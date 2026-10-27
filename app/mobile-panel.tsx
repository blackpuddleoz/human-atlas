import {useEffect,useRef,useState,type CSSProperties} from 'react';
export function useMobilePanel(){
 const [viewport,setViewport]=useState({width:1024,height:800});
 const [height,setHeight]=useState<number|null>(null);
 const drag=useRef<{id:number;y:number;height:number}|null>(null);
 useEffect(()=>{const resize=()=>setViewport({width:window.innerWidth,height:window.innerHeight});resize();window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
 const mobile=viewport.width<768&&viewport.height>viewport.width;
 const min=104,max=Math.max(min,viewport.height-156),normal=Math.min(max,Math.max(320,Math.round(viewport.height*.42)));
 const clamp=(n:number)=>Math.max(min,Math.min(max,n));
 const actual=clamp(height??normal),collapsed=actual<=min+20;
 return {mobile,height:actual,collapsed,expanded:actual>normal+40,style:{'--mobile-panel-height':`${actual}px`} as CSSProperties,
  expand:()=>setHeight(max),restore:()=>setHeight(normal),
  control:(label:string)=><div className="mobile-panel-resize">
   <div role="slider" tabIndex={0} aria-label={`${label} 높이 조절`} aria-orientation="vertical" aria-valuemin={min} aria-valuemax={max} aria-valuenow={actual} aria-valuetext={collapsed?'접힌 상태':`${Math.round(actual)}픽셀`} className="mobile-panel-grip"
    onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);drag.current={id:e.pointerId,y:e.clientY,height:actual};}}
    onPointerMove={e=>{const start=drag.current;if(!start||start.id!==e.pointerId)return;setHeight(clamp(start.height+start.y-e.clientY));}}
    onPointerUp={e=>{if(drag.current?.id===e.pointerId){drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}}}
    onPointerCancel={()=>{drag.current=null;}}
    onKeyDown={e=>{if(['ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();setHeight(e.key==='Home'?min:e.key==='End'?max:clamp(actual+(e.key==='ArrowUp'?48:-48)));}}}>
    <span className="mobile-panel-bar"/><span>위아래로 끌어 조절</span>
   </div>
   <button type="button" aria-label={`${label} ${collapsed?'펼치기':'접기'}`} onClick={()=>setHeight(collapsed?normal:min)}>{collapsed?'펼치기 ↑':'접기 ↓'}</button>
  </div>
 };
}
