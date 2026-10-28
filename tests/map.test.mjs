import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {detailLevel,visibleElements,centeredZoom,clampZoom} from '../src/zoom.mjs';
const scene=JSON.parse(readFileSync(new URL('../public/map.excalidraw',import.meta.url)));
const ui=readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
test('four root topics plus one Money video, no placeholders',()=>{
 assert.deepEqual(scene.elements.filter(x=>x.id.startsWith('topic-')&&x.type==='text').map(x=>x.text),['Money','Physical Health','Mental Health','Learning']);
 assert.equal(scene.elements.length,11);
 assert.equal(scene.elements.filter(x=>x.type==='rectangle'&&x.id.startsWith('topic-')).length,4);
 assert.ok(scene.elements.filter(e=>e.id.startsWith('topic-')).every(e=>e.customData.minZoom===0&&!e.isDeleted&&!e.link));
 assert.doesNotMatch(scene.elements.map(x=>x.text||'').join(' '),/demo|placeholder|notice|connect|try|reflect|loop/i);
 assert.ok(ui.includes('Money · Physical Health · Mental Health · Learning'));
 assert.doesNotMatch(ui,/Notice → Connect|facts vs guesses/i);
});
test('distinct root identities and non-overlapping blocks',()=>{
 const boxes=scene.elements.filter(x=>x.type==='rectangle'&&x.id.startsWith('topic-'));
 assert.deepEqual(boxes.map(x=>x.customData.topic),['money','physical-health','mental-health','learning']);
 assert.equal(new Set(scene.elements.map(e=>e.id)).size,11);
 for(const a of boxes)for(const b of boxes)if(a!==b)
  assert.equal(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y,false);
 for(const box of boxes){
  const title=scene.elements.find(x=>x.id===box.id.replace('-box','-title'));
  assert.ok(title);assert.equal(title.customData.topic,box.customData.topic);
  assert.ok(title.x>=box.x&&title.x+title.width<=box.x+box.width);
  assert.ok(title.y>=box.y&&title.y+title.height<=box.y+box.height);
 }
});
test('semantic zoom retains future detail layers without placeholder nodes',()=>{
 assert.equal(detailLevel(.5),'Overview');
 assert.equal(detailLevel(.7),'Connections');
 assert.equal(detailLevel(1.15),'Field notes');
 assert.equal(visibleElements(scene.elements,.5).length,8);
 assert.equal(visibleElements(scene.elements,.7).length,11);
 assert.equal(visibleElements(scene.elements,1.2).length,11);
 const nested=[{id:'a',customData:{minZoom:0}},{id:'b',customData:{minZoom:.7}},{id:'c',customData:{minZoom:1.15}}];
 assert.deepEqual(visibleElements(nested,.5).map(x=>x.id),['a']);
 assert.deepEqual(visibleElements(nested,.8).map(x=>x.id),['a','b']);
 assert.deepEqual(visibleElements(nested,1.2).map(x=>x.id),['a','b','c']);
});
test('centered zoom remains bounded',()=>{
 const s={zoom:{value:.5},width:800,height:500,scrollX:200,scrollY:100};
 const n=centeredZoom(s,1);
 assert.equal(400/.5-s.scrollX,400/n.zoom.value-n.scrollX);
 assert.equal(250/.5-s.scrollY,250/n.zoom.value-n.scrollY);
 assert.equal(clampZoom(0),.15);assert.equal(clampZoom(10),3);
});
test('public portable Excalidraw file',()=>{
 assert.equal(scene.type,'excalidraw');assert.equal(scene.version,2);assert.equal(Object.keys(scene.files).length,0);
 for(const e of scene.elements){assert.ok(['rectangle','text','arrow'].includes(e.type));if(e.id.startsWith('topic-'))assert.equal(e.link,null);}
 assert.doesNotMatch(JSON.stringify(scene),/token|secret|password|@/i);
});
test('view-only minimal UI and full mobile overview',()=>{
 assert.ok(ui.includes('viewModeEnabled={true}'));
 assert.ok(ui.includes('onPaste={()=>false}'));
 assert.ok(ui.includes('hasDetails&&'));
 assert.ok(ui.includes('narrow ? 0.94 : 0.82'));
 assert.ok(!ui.includes('Math.max(state.zoom.value,.64)'));
 assert.ok(ui.includes('Entirely subjective. Your approval was never the point.'));
 assert.ok(!/localStorage|sessionStorage|method:\s*["']POST|api\.github|Authorization/.test(ui));
 assert.ok(css.includes('.map-chrome--solo{justify-content:flex-end}'));
 assert.ok(css.includes('@media(max-width:720px)'));
 assert.ok(css.includes('min-height:44px'));
});

test('Money video is clickable from its card and text and appears only above 70%',()=>{
 const expected='https://www.youtube.com/watch?v=CNMo3EtWHu8';
 const vid=scene.elements.filter(e=>e.id.startsWith('money-video-what-is-bank-'));
 assert.equal(vid.length,3);
 assert.ok(vid.every(e=>e.customData.minZoom===.7&&e.customData.topic==='money'));
 const card=vid.find(e=>e.type==='rectangle');
 const label=vid.find(e=>e.type==='text');
 const arrow=vid.find(e=>e.type==='arrow');
 assert.ok(card&&label&&arrow);
 assert.equal(card.link,expected);
 assert.equal(label.link,expected);
 assert.equal(arrow.link,null);
 assert.equal(label.text,'What is Bank ↗');
 assert.equal(visibleElements(scene.elements,.699).some(e=>e.id===card.id),false);
 assert.equal(visibleElements(scene.elements,.7).some(e=>e.id===card.id),true);
 const money=scene.elements.find(e=>e.id==='topic-money-box');
 const mental=scene.elements.find(e=>e.id==='topic-mental-health-box');
 assert.ok(card.x>=money.x&&card.x+card.width<=money.x+money.width);
 assert.ok(card.y>=money.y+money.height&&card.y+card.height<mental.y);
 assert.ok(ui.includes('href="https://www.youtube.com/watch?v=CNMo3EtWHu8"'));
 assert.ok(ui.includes('rel="noopener noreferrer"'));
});
