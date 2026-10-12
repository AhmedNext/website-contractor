"use client";
import { useId, useState } from "react";
import type { FieldKind } from "@/content/field-tools";
import { roomPoints, type Point, type TakeoffResult, type TakeoffState } from "@/lib/takeoff";

type XY = [number, number];
const pointsText = (points: XY[]) => points.map(p => p.join(",")).join(" ");
const short = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
export function TakeoffDiagram({ kind, state, result, onPointMove }: { kind: FieldKind; state: TakeoffState; result: TakeoffResult; onPointMove: (index: number, point: Point) => void }) {
  const id = useId().replace(/:/g, "");
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragView, setDragView] = useState<{scale:number;ox:number;oy:number}|null>(null);
  const n=state.numbers,c=state.choices,t=state.toggles;
  const grid=`grid-${id}`,clip=`clip-${id}`;
  const label = `${kind} quantity diagram. ${result.metrics.slice(0,3).map(m=>`${m.label}: ${short(m.value)} ${m.unit}`).join(". ")}`;
  const slab=(l:number,w:number,depth:number,ring=false)=>{
    const scale=440/Math.max(1,l+w),h=Math.max(12,Math.min(65,depth/12*scale*2));
    const p=(x:number,y:number,z=0):XY=>[300+(x-y)*scale,170+(x+y)*scale*0.42-z];
    const top=[p(-l/2,-w/2),p(l/2,-w/2),p(l/2,w/2),p(-l/2,w/2)];
    const bottom=top.map(([x,y])=>[x,y+h] as XY),gravelH=kind==="concrete"&&t.gravel?Math.max(8,n.gravel/12*scale):0;
    const fw=n.footing/12,inner=ring?[p(-l/2+fw,-w/2+fw),p(l/2-fw,-w/2+fw),p(l/2-fw,w/2-fw),p(-l/2+fw,w/2-fw)]:[];
    const path=(pts:XY[])=>`M${pts.map(v=>v.join(",")).join(" L")} Z`;
    const nx=Math.min(70,Math.ceil(w*12/n.spacing)+1),ny=Math.min(70,Math.ceil(l*12/n.spacing)+1);
    return <>
      {gravelH>0&&<polygon points={pointsText([bottom[0],bottom[1],bottom[2],bottom[3]].map(([x,y])=>[x,y+gravelH]))} fill="#736d5e" stroke="#aaa18a"/>}
      <polygon points={pointsText([top[1],top[2],bottom[2],bottom[1]])} fill="#747f7a" stroke="#b9c9c0"/>
      <polygon points={pointsText([top[2],top[3],bottom[3],bottom[2]])} fill="#56625d" stroke="#b9c9c0"/>
      <path d={path(top)+(ring?path(inner):"")} fill="#b2bdb5" fillRule="evenodd" stroke="#e2e9e4" strokeWidth="1.5"/>
      <defs><clipPath id={clip}><polygon points={pointsText(top)}/></clipPath></defs>
      {kind==="concrete"&&t.rebar&&!ring&&<g clipPath={`url(#${clip})`} stroke="#e59774" strokeWidth={c.bar==="5"?2:1.3} opacity="0.9">
        {Array.from({length:nx},(_,i)=>{const y=-w/2+n.cover/12+(w-2*n.cover/12)*i/Math.max(1,nx-1);return <line key={`x${i}`} x1={p(-l/2+n.cover/12,y)[0]} y1={p(-l/2+n.cover/12,y)[1]} x2={p(l/2-n.cover/12,y)[0]} y2={p(l/2-n.cover/12,y)[1]}/>;})}
        {Array.from({length:ny},(_,i)=>{const x=-l/2+n.cover/12+(l-2*n.cover/12)*i/Math.max(1,ny-1);return <line key={`y${i}`} x1={p(x,-w/2+n.cover/12)[0]} y1={p(x,-w/2+n.cover/12)[1]} x2={p(x,w/2-n.cover/12)[0]} y2={p(x,w/2-n.cover/12)[1]}/>;})}
      </g>}
      <text x="80" y="300">{short(l)} ft length</text><text x="380" y="300">{short(w)} ft width</text><text x="300" y="338" textAnchor="middle">{short(depth)} in depth · {short(result.volume)} yd³ net</text>
      {kind==="concrete"&&<g transform="translate(410,25)">
        {c.supply==="bags"?<>{Array.from({length:6},(_,i)=><rect key={i} x={(i%3)*23} y={Math.floor(i/3)*14} width="20" height="11" rx="2" fill="#b74724" stroke="#efc0a3"/>)}<line x1="-3" y1="32" x2="72" y2="32" stroke="#bfad83" strokeWidth="4"/><text x="32" y="53" textAnchor="middle">Bagged mix</text></>:<><path d="M0 25H62V7H45V25M62 15H82V31H0Z" fill="none" stroke="#7ed8e2" strokeWidth="2"/><ellipse cx="24" cy="13" rx="24" ry="12" transform="rotate(-15 24 13)" fill="#536b68" stroke="#7ed8e2"/><circle cx="15" cy="33" r="6" fill="#1c221e" stroke="#cbd4cb"/><circle cx="68" cy="33" r="6" fill="#1c221e" stroke="#cbd4cb"/><text x="38" y="57" textAnchor="middle">Ready-mix</text></>}
      </g>}
    </>;
  };
  let drawing: React.ReactNode;
  if(kind==="concrete")drawing=slab(n.length,n.width,n.depth,c.mode==="footing");
  else if(kind==="roofing"){
    const l=n.length+2*n.overhang/12,w=n.width+2*n.overhang/12,scale=400/(l+w+w*n.pitch/24),rise=w*n.pitch/24;
    const p=(x:number,y:number,z=0):XY=>[300+(x-y)*scale,240+(x+y)*scale*.42-z*scale];
    const a=p(-l/2,-w/2),b=p(l/2,-w/2),d=p(-l/2,w/2),e=p(l/2,w/2),hip=c.roofShape==="hip",r1=p(hip?-(l-w)/2:-l/2,0,rise),r2=p(hip?(l-w)/2:l/2,0,rise);
    drawing=<><polygon points={pointsText([a,b,r2,r1])} fill="#466c6b" stroke="#7ed8e2"/><polygon points={pointsText([d,e,r2,r1])} fill="#334c4b" stroke="#7ed8e2"/><polygon points={pointsText([a,d,r1])} fill="#2a3f3d" stroke="#7ed8e2"/><polygon points={pointsText([b,e,r2])} fill="#57665c" stroke="#7ed8e2"/><line x1={r1[0]} y1={r1[1]} x2={r2[0]} y2={r2[1]} stroke="#e59774" strokeWidth="3"/>{Array.from({length:9},(_,i)=>{const f=(i+1)/10;const start:XY=[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f],end:XY=[r1[0]+(r2[0]-r1[0])*f,r1[1]+(r2[1]-r1[1])*f];return <line key={i} x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke="#7ed8e2" opacity=".3"/>;})}<text x="300" y="48" textAnchor="middle">{short(n.pitch)}/12 pitch · {short(Math.atan(n.pitch/12)*180/Math.PI)}°</text><text x="300" y="328" textAnchor="middle">{short(result.area)} ft² · {short(result.area/100)} roofing squares</text><path d={`M50 135H130V${135-n.pitch/12*80}Z`} fill="none" stroke="#e59774"/><text x="90" y="157" textAnchor="middle">12 in run</text><text x="140" y={135-n.pitch/12*40}>{short(n.pitch)} in rise</text></>;
  } else if(kind==="framing"){
    const scale=Math.min(460/n.length,240/n.height),x=(600-n.length*scale)/2,y=65,w=n.length*scale,h=n.height*scale,count=Math.ceil(n.length*12/n.spacing)+1,shown=Math.min(count,150);
    drawing=<><rect x={x} y={y} width={w} height={h} fill="#203536" stroke="#7ed8e2"/>{Array.from({length:shown},(_,i)=>{const pos=i===shown-1?w:Math.min(w,i*(count-1)/Math.max(1,shown-1)*n.spacing/12*scale);return <rect key={i} x={x+Math.max(0,Math.min(w-4,pos))} y={y+8} width="4" height={h-12} fill="#b89163" stroke="#d1b892" strokeWidth=".4"/>;})}<rect x={x} y={y} width={w} height="9" fill="#be9565"/><line x1={x} x2={x+w} y1={y+4.5} y2={y+4.5} stroke="#6d543a"/><rect x={x} y={y+h-5} width={w} height="5" fill="#be9565"/>{n.corners>0&&<><rect x={x+5} y={y+9} width="6" height={h-14} fill="#e59774"/><rect x={x+w-11} y={y+9} width="6" height={h-14} fill="#e59774"/></>}<text x="300" y={y+h+28} textAnchor="middle">{short(n.length)} ft · {n.spacing} in on center</text><text x="300" y="35" textAnchor="middle">{short(n.height)} ft wall · one bottom + two top plates</text><text x="300" y="350" textAnchor="middle">{count} regular studs + {n.corners*2} corner / backing allowance</text></>;
  } else if(kind==="drywall"){
    const sheet=Number(c.sheet||8),scale=Math.min(460/n.length,220/n.height),ox=(600-n.length*scale)/2,oy=65,rows=Math.ceil(n.height/4),rects=[];
    for(let row=0;row<rows;row++){for(let start=row%2?-sheet/2:0;start<n.length;start+=sheet){const left=Math.max(0,start),right=Math.min(n.length,start+sheet),height=Math.min(4,n.height-row*4);rects.push(<g key={`${row}-${start}`}><rect x={ox+left*scale} y={oy+row*4*scale} width={(right-left)*scale} height={height*scale} fill={row%2?"#516262":"#384e4f"} stroke="#7ed8e2" strokeWidth="1.3"/>{(right-left)*scale>45&&<text x={ox+(left+right)/2*scale} y={oy+(row*4+height/2)*scale+4} textAnchor="middle">{short(right-left)} × {short(height)}</text>}</g>);}}
    drawing=<><text x="300" y="35" textAnchor="middle">{c.surface==="ceiling"?"Ceiling plan":"Wall elevation"} · staggered 4 × {sheet} ft sheets</text>{rects}<text x="300" y={oy+n.height*scale+28} textAnchor="middle">{short(n.length)} × {short(n.height)} ft gross surface</text><g transform="translate(70,327)">{Array.from({length:Math.min(8,result.metrics.find(m=>m.unit==="buckets")?.value||0)},(_,i)=><g key={i} transform={`translate(${i*28},0)`}><path d="M0 0H20L18 22H2Z" fill="#b74724" stroke="#e59774"/><path d="M2 0Q10-12 18 0" fill="none" stroke="#d4ddd5"/></g>)}</g><text x="390" y="344">Compound estimate</text></>;
  } else if(kind==="room"){
    const points=roomPoints(state),polygon=c.shape==="polygon",maxX=Math.max(1,...points.map(p=>p.x))*(polygon?1.15:1),maxY=Math.max(1,...points.map(p=>p.y))*(polygon?1.15:1),scale=dragView?.scale??Math.min(450/maxX,260/maxY),ox=dragView?.ox??(600-maxX*scale)/2,oy=dragView?.oy??48;
    const mapped=points.map(p=>[ox+p.x*scale,oy+p.y*scale] as XY);
    drawing=<><polygon points={pointsText(mapped)} fill="#314d4a" stroke="#7ed8e2" strokeWidth="2"/>{mapped.map((p,i)=>{const next=mapped[(i+1)%mapped.length],world=points[i],worldNext=points[(i+1)%points.length];return <text key={i} x={(p[0]+next[0])/2} y={(p[1]+next[1])/2-7} textAnchor="middle">{short(Math.hypot(worldNext.x-world.x,worldNext.y-world.y))} ft</text>;})}<text x="300" y="350" textAnchor="middle">{short(result.area)} ft² · {c.material||"flooring"} conversion</text>{polygon&&mapped.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="8" fill="#e59774" stroke="#fff" strokeWidth="2" className="room-handle" aria-hidden="true" onPointerDown={event=>{event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);setDragging(i);setDragView({scale,ox,oy});}} onPointerUp={()=>{setDragging(null);setDragView(null);}} onPointerCancel={()=>{setDragging(null);setDragView(null);}} onPointerMove={event=>{if(dragging!==i)return;const svg=event.currentTarget.ownerSVGElement,matrix=svg?.getScreenCTM();if(!matrix)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());onPointMove(i,{x:Math.round(Math.max(0,Math.min(40,(p.x-ox)/scale))*2)/2,y:Math.round(Math.max(0,Math.min(40,(p.y-oy)/scale))*2)/2});}}/>)}</>;
  } else if(kind==="aggregate"){
    if(c.shape==="cone"){const scale=Math.min(190/n.radius,220/n.pileHeight),rx=n.radius*scale,height=n.pileHeight*scale;drawing=<><ellipse cx="300" cy="265" rx={rx} ry={rx*.22} fill="#776a4e" stroke="#d2bd8e"/><path d={`M${300-rx} 265 Q${300-rx/2} ${265-height*.55} 300 ${265-height} Q${300+rx/2} ${265-height*.55} ${300+rx} 265 Q300 ${265+rx*.3} ${300-rx} 265`} fill="#948263" stroke="#d2bd8e"/><line x1="300" y1={265-height} x2="300" y2="265" stroke="#7ed8e2" strokeDasharray="5 5"/><text x="315" y={265-height/2}>{short(n.pileHeight)} ft height</text><text x="300" y="320" textAnchor="middle">{short(n.radius)} ft radius · {short(result.volume)} yd³ net</text></>;}else drawing=slab(n.length,n.width,n.depth);
  } else {
    const x=65+n.position/100*470;
    drawing=<><defs><linearGradient id={`spectrum-${id}`}><stop stopColor="#547d66"/><stop offset=".5" stopColor="#d1ae6b"/><stop offset="1" stopColor="#b74724"/></linearGradient></defs><rect x="65" y="158" width="470" height="46" rx="8" fill={`url(#spectrum-${id})`}/><path d={`M${x-8} 148 L${x+8} 148 L${x} 159Z`} fill="#fff"/><line x1={x} x2={x} y1="157" y2="215" stroke="#fff" strokeWidth="3"/><text x={x} y="129" textAnchor="middle">${short(n.low+(n.high-n.low)*n.position/100)} / ft²</text><text x="65" y="237">Low ${short(n.low)}</text><text x="300" y="237" textAnchor="middle">Midpoint ${short((n.low+n.high)/2)}</text><text x="535" y="237" textAnchor="end">High ${short(n.high)}</text><text x="300" y="300" textAnchor="middle">Your assumptions · no regional market survey</text></>;
  }
  return <svg className="takeoff-diagram" viewBox="0 0 600 380" role="img" aria-label={label}>
    <title>{label}</title><defs><pattern id={grid} width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#7ed8e2" strokeOpacity=".09"/></pattern></defs>
    <rect width="600" height="380" rx="12" fill="#1c2825"/><rect width="600" height="380" rx="12" fill={`url(#${grid})`}/>
    <g className="diagram-geometry">{drawing}</g>
  </svg>;
}
