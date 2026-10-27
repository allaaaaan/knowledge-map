import React, {useState,useEffect,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {Excalidraw, CaptureUpdateAction} from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import {centeredZoom,detailLevel,visibleElements} from './zoom.mjs';
import './style.css';
window.EXCALIDRAW_ASSET_PATH = import.meta.env.BASE_URL;
const mapURL = `${import.meta.env.BASE_URL}map.excalidraw`;
function App({scene}) {
 const [api,setApi]=useState(null),[zoom,setZoom]=useState(.6),[help,setHelp]=useState(false);
 const level=detailLevel(zoom);
 const fit=useCallback(()=>api?.scrollToContent(visibleElements(scene.elements,0),{fitToContent:true,animate:false,viewportZoomFactor:.8}),[api,scene]);
 useEffect(()=>{if(!api)return; const timer=setTimeout(fit,100);return()=>clearTimeout(timer);},[api,fit]);
 useEffect(()=>{if(api)api.updateScene({elements:visibleElements(scene.elements,zoom),captureUpdate:CaptureUpdateAction.NEVER});},[api,level,scene]);
 const changeZoom=useCallback(factor=>{if(api)api.updateScene({appState:centeredZoom(api.getAppState(),api.getAppState().zoom.value*factor),captureUpdate:CaptureUpdateAction.NEVER});},[api]);
 const onKeyDown=e=>{if(e.target.closest('button,a,input'))return;if(e.key==='+'||e.key==='='){e.preventDefault();changeZoom(1.25);}if(e.key==='-'){e.preventDefault();changeZoom(.8);}if(e.key==='0'){e.preventDefault();fit();}};
 return <main onKeyDown={onKeyDown}>
  <header><a className="brand" href={import.meta.env.BASE_URL} aria-label="Knowledge garden home"><span className="brand-mark">✳</span><span>knowledge garden<small>A living map of ideas</small></span></a><div className="header-right"><span className="readonly"><i/> View only</span><a className="download" href={mapURL} download="knowledge-garden.excalidraw">Download drawing <span aria-hidden="true">↗</span></a></div></header>
  <section className="intro"><div><p className="eyebrow">THE FIRST SEED · ORIGINAL DEMO</p><h1>Good ideas grow together.</h1><p>Follow a connection. Zoom closer. Discover the little things.</p></div><div className="intro-note"><span aria-hidden="true">↙</span> A small map about learning.<br/>A place for your ideas next.</div></section>
  <section className="map-shell" aria-label="Interactive read-only knowledge map" tabIndex={0}>
   <div className="map-top"><span className="map-title">Learning, connected <span>01</span></span><button className="help-button" onClick={()=>setHelp(!help)} aria-expanded={help} aria-controls="map-help">How to explore <span aria-hidden="true">?</span></button></div>
   {help&&<aside className="help" id="map-help"><strong>A canvas, not a checklist.</strong><p>Drag the canvas to pan. Pinch or use the + / − controls to zoom. More notes appear as you move closer.</p><p>Keyboard: focus the canvas, then + / − to zoom and 0 to fit. Tab reaches every control.</p><p>This is a public, read-only demo. Downloads are editable copies, not changes to this map.</p><button onClick={()=>setHelp(false)}>Got it</button></aside>}
   <div className="canvas"><Excalidraw excalidrawAPI={setApi} initialData={{elements:visibleElements(scene.elements,.6),appState:{...scene.appState,zoom:{value:.6},viewModeEnabled:true,activeTool:{type:'hand',customType:null,locked:false,lastActiveTool:null}},scrollToContent:true}} viewModeEnabled={true} zenModeEnabled={true} theme="light" name="Knowledge garden" onChange={(_,state)=>setZoom(state.zoom.value)} onPaste={()=>false} validateEmbeddable={false} UIOptions={{canvasActions:{loadScene:false,saveToActiveFile:false,export:false,clearCanvas:false,changeViewBackgroundColor:false,toggleTheme:false,saveAsImage:false}}}/></div>
   <div className="map-bottom"><div className="level" role="status" aria-live="polite"><span className="level-dots" aria-hidden="true"><i/><i className={zoom>=.7?'active':''}/><i className={zoom>=1.15?'active':''}/></span><span>{level}<small>{zoom<.7?'Zoom in to reveal connections':zoom<1.15?'Zoom closer for field notes':'The details are in view'}</small></span></div><div className="zoom-controls"><button onClick={()=>changeZoom(.8)} aria-label="Zoom out">−</button><output aria-label="Zoom percentage">{Math.round(zoom*100)}%</output><button onClick={()=>changeZoom(1.25)} aria-label="Zoom in">+</button><span/><button className="fit" onClick={fit} aria-label="Fit map to view">↔ <span>Fit</span></button></div></div>
  </section>
  <footer><p><span className="legend-dot"/> Ideas <span className="legend-line">⟶</span> Connections <span className="legend-note">≡</span> Notes on closer view</p><p>Drawn with Excalidraw · <a href="https://github.com/allaaaaan/knowledge-map">Source & publishing</a></p></footer>
  <details className="text-version"><summary>Read the map as text</summary><p>This original demonstration is a learning loop: Notice a question → Connect ideas → Try a small experiment → Reflect on what changes your mind → Notice new questions.</p><p>Notice: collect observations and distinguish facts from guesses. Connect: look for patterns. Try: explain an idea, build a tiny example, and test what does not fit. Reflect: keep useful connections and revise the rest.</p></details>
 </main>;
}
fetch(mapURL).then(r=>{if(!r.ok)throw new Error('Map unavailable');return r.json()}).then(scene=>createRoot(document.getElementById('root')).render(<App scene={scene}/>)).catch(()=>{document.getElementById('root').textContent='The map could not load. Please refresh to try again.';});
