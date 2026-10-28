import React, {useState,useEffect,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {Excalidraw,CaptureUpdateAction} from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import {centeredZoom,detailLevel,visibleElements} from './zoom.mjs';
import './style.css';

window.EXCALIDRAW_ASSET_PATH=import.meta.env.BASE_URL;
const mapURL=import.meta.env.BASE_URL+'map.excalidraw';

function App({scene}){
 const [api,setApi]=useState(null);
 const [zoom,setZoom]=useState(.6);
 const level=detailLevel(zoom);
 const hasDetails=scene.elements.some(e=>!e.isDeleted&&(e.customData?.minZoom??0)>0);

 const fit=useCallback(()=>{
  if(!api)return;
  const narrow=window.matchMedia('(max-width: 720px)').matches;
  api.scrollToContent(visibleElements(scene.elements,0),{fitToContent:true,animate:false,viewportZoomFactor:narrow ? 0.94 : 0.82});
 },[api,scene]);

 useEffect(()=>{
  if(!api)return;
  const timer=setTimeout(()=>fit(),150);
  return()=>clearTimeout(timer);
 },[api,fit]);

 useEffect(()=>{
  if(api)api.updateScene({elements:visibleElements(scene.elements,zoom),captureUpdate:CaptureUpdateAction.NEVER});
 },[api,level,scene]);

 const changeZoom=useCallback(factor=>{
  if(!api)return;
  const state=api.getAppState();
  api.updateScene({appState:centeredZoom(state,state.zoom.value*factor),captureUpdate:CaptureUpdateAction.NEVER});
 },[api]);

 const onKeyDown=e=>{
  if(e.target.closest('button,a,input,summary'))return;
  if(e.key==='+'||e.key==='='){e.preventDefault();changeZoom(1.25);}
  if(e.key==='-'){e.preventDefault();changeZoom(.8);}
  if(e.key==='0'){e.preventDefault();fit();}
 };

 return <main className="page" onKeyDown={onKeyDown}>
  <header className="site-header">
   <span className="brand"><span className="brand-mark" aria-hidden="true">✳</span> knowledge map</span>
   <a className="download" href={mapURL} download="knowledge-map.excalidraw" aria-label="Download Excalidraw map" title="Download map file"><span aria-hidden="true">↓</span><span className="download-label">.excalidraw</span></a>
  </header>
  <section className="map-shell" aria-label="Read-only knowledge map" tabIndex={0}>
   <div className="canvas"><Excalidraw excalidrawAPI={setApi} initialData={{elements:visibleElements(scene.elements,.6),appState:{...scene.appState,zoom:{value:.6},viewModeEnabled:true,activeTool:{type:'hand',customType:null,locked:false,lastActiveTool:null}},scrollToContent:true}} viewModeEnabled={true} zenModeEnabled={true} theme="light" name="Knowledge map" onChange={(_,state)=>setZoom(state.zoom.value)} onPaste={()=>false} validateEmbeddable={false} UIOptions={{canvasActions:{loadScene:false,saveToActiveFile:false,export:false,clearCanvas:false,changeViewBackgroundColor:false,toggleTheme:false,saveAsImage:false}}}/></div>
   <div className={hasDetails ? "map-chrome" : "map-chrome map-chrome--solo"}>
    {hasDetails&&<div className="level" role="status" aria-live="polite" aria-label={'Detail level: '+level}><span className="level-dots" aria-hidden="true"><i className="active"/><i className={zoom>=.7?'active':''}/><i className={zoom>=1.15?'active':''}/></span><span className="level-label">{level}</span></div>}
    <div className="zoom-controls" aria-label="Map zoom controls">
     <button type="button" onClick={()=>changeZoom(.8)} aria-label="Zoom out">−</button>
     <output aria-label="Zoom percentage">{Math.round(zoom*100)}%</output>
     <button type="button" onClick={()=>changeZoom(1.25)} aria-label="Zoom in">+</button>
     <span className="control-divider" aria-hidden="true"/>
     <button type="button" className="fit" onClick={()=>fit()} aria-label="Fit whole map">Fit</button>
    </div>
   </div>
  </section>
  <footer className="site-footer">
   <details className="text-version"><summary>Text</summary><p>Money · Physical Health · Mental Health · Learning</p><a href="https://www.youtube.com/watch?v=CNMo3EtWHu8" target="_blank" rel="noopener noreferrer">What is Bank ↗</a></details>
   <span className="aside-thought">Entirely subjective. Your approval was never the point.</span>
  </footer>
 </main>;
}

fetch(mapURL).then(r=>{
 if(!r.ok)throw new Error('Map unavailable');
 return r.json();
}).then(scene=>createRoot(document.getElementById('root')).render(<App scene={scene}/>))
.catch(()=>{document.getElementById('root').textContent='Map unavailable.';});
