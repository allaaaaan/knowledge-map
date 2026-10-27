export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 3;
export const clampZoom = z => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
export const detailLevel = z => z < 0.7 ? 'Overview' : z < 1.15 ? 'Connections' : 'Field notes';
export const visibleElements = (elements,z) => elements.filter(e => !e.isDeleted && (e.customData?.minZoom ?? 0) <= z);
export function centeredZoom(state,newZoom) {
 const z=clampZoom(newZoom), old=state.zoom.value;
 return {zoom:{value:z},scrollX:state.scrollX+state.width/(2*z)-state.width/(2*old),scrollY:state.scrollY+state.height/(2*z)-state.height/(2*old)};
}
