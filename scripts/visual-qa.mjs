import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const site=process.env.MAP_URL||'https://allaaaaan.github.io/knowledge-map/';
const video='https://www.youtube.com/watch?v=CNMo3EtWHu8';
const out='qa-output';
await mkdir(out,{recursive:true});
const report={url:site,timestamp:new Date().toISOString(),screenshots:[],checks:[],issues:[],consoleErrors:[]};

function check(name,pass,detail={}) {
  report.checks.push({name,pass,...detail});
  if(!pass)report.issues.push(name+(detail.error?': '+detail.error:''));
}
async function capture(page,name) {
  const file=out+'/'+name+'.png';
  await page.screenshot({path:file,fullPage:true,animations:'disabled',timeout:30000});
  report.screenshots.push(file);
}

const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
try{
 for(const config of [
  {name:'desktop',viewport:{width:1440,height:900},isMobile:false,hasTouch:false},
  {name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true}
 ]){
  const context=await browser.newContext({
   viewport:config.viewport,isMobile:config.isMobile,hasTouch:config.hasTouch,
   deviceScaleFactor:1,ignoreHTTPSErrors:false,
  });
  const page=await context.newPage();
  page.on('pageerror',e=>report.consoleErrors.push(config.name+': '+e.message));
  page.on('console',msg=>{if(msg.type()==='error')report.consoleErrors.push(config.name+' console: '+msg.text().slice(0,400));});
  try{
   const response=await page.goto(site,{waitUntil:'domcontentloaded',timeout:60000});
   check(config.name+' HTTP 200',response?.status()===200,{status:response?.status()});
   await page.locator('.map-shell .excalidraw').waitFor({state:'visible',timeout:45000});
   await page.locator('.zoom-controls output').waitFor({state:'visible',timeout:15000});
   await page.waitForTimeout(2200);
   await page.evaluate(()=>document.fonts.ready);
   const initial=await page.locator('.zoom-controls output').textContent();
   const metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth,canvasHeight:document.querySelector('.map-shell')?.getBoundingClientRect().height}));
   check(config.name+' no horizontal document overflow',metrics.scrollWidth<=metrics.innerWidth+2,{...metrics,initialZoom:initial});

   const sceneResponse=await page.request.get(new URL('map.excalidraw',site).toString());
   const scene=await sceneResponse.json();
   const nodes=scene.elements.filter(e=>e.id.startsWith('money-video-what-is-bank-'));
   check(config.name+' public scene has Money video link',
     nodes.length===3&&nodes.filter(e=>e.link===video).length===2&&nodes.every(e=>e.customData?.minZoom===.7),
     {sceneElements:scene.elements.length,videoElements:nodes.length});

   await capture(page,config.name+'-initial');
   // Ensure a true overview screenshot with the deeper node hidden.
   let value=Number((await page.locator('.zoom-controls output').textContent()).replace(/[^0-9.]/g,''));
   for(let i=0;i<14&&value>=68;i++){
    await page.getByRole('button',{name:'Zoom out'}).click();
    await page.waitForTimeout(170);
    value=Number((await page.locator('.zoom-controls output').textContent()).replace(/[^0-9.]/g,''));
   }
   check(config.name+' overview zoom below 70%',value<70,{zoomPercent:value});
   await capture(page,config.name+'-overview');

   // Zoom to level where Money -> What is Bank should render.
   for(let i=0;i<14&&value<85;i++){
    await page.getByRole('button',{name:'Zoom in'}).click();
    await page.waitForTimeout(190);
    value=Number((await page.locator('.zoom-controls output').textContent()).replace(/[^0-9.]/g,''));
   }
   await page.waitForTimeout(650);
   check(config.name+' detail zoom at least 70%',value>=70,{zoomPercent:value});
   await capture(page,config.name+'-money-detail');

   // An accessible fallback link exists independent of Excalidraw's canvas.
   const details=page.locator('.text-version');
   await details.locator('summary').click();
   const link=details.locator('a[href*="CNMo3EtWHu8"]');
   check(config.name+' accessible YouTube link',await link.count()===1&&await link.getAttribute('href')===video);
   await capture(page,config.name+'-link-expanded');
   try{
    const popupPromise=page.waitForEvent('popup',{timeout:8000});
    await link.click();
    const popup=await popupPromise;
    await popup.waitForLoadState('domcontentloaded',{timeout:7000}).catch(()=>{});
    check(config.name+' video link opens new tab',true,{newTabUrl:popup.url().slice(0,250)});
    await popup.close();
   }catch(e){
    check(config.name+' video link opens new tab',false,{error:e.message.slice(0,300)});
   }
  }catch(e){
   check(config.name+' browser QA completed',false,{error:e.stack?.slice(0,1200)||String(e)});
   try{await capture(page,config.name+'-error');}catch{}
  }finally{
   await context.close();
  }
 }
}finally{
 await browser.close();
 await writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');
 await writeFile(out+'/console-errors.txt',report.consoleErrors.join('\n')+'\n');
 console.log(JSON.stringify({checks:report.checks,screenshots:report.screenshots,issues:report.issues,consoleErrors:report.consoleErrors},null,2));
}
if(report.issues.length)process.exitCode=1;
