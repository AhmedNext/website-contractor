"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Minus, Plus, RotateCcw, ArrowUpRight } from "lucide-react";
import { type DimensionField, type FieldTool } from "@/content/field-tools";
import { calculateTakeoff, defaultPoints, type Point, type TakeoffState } from "@/lib/takeoff";
import { takeoffTransferKey } from "@/lib/workspace-keys";
import { money } from "@/content/tools";
import { TakeoffDiagram } from "./takeoff-diagram";
import { useHydrated } from "@/components/use-hydrated";

const defaults=(tool:FieldTool)=>Object.fromEntries(tool.fields.map(f=>[f.key,String(f.initial)]));
const defaultChoices={mode:"slab",bar:"4",bag:"80",supply:"ready",roofShape:"gable",sheet:"8",surface:"wall",shape:"rectangle",material:"flooring",costUnit:"ton",densityMaterial:"gravel",scope:"slab"};
const densities:Record<string,number>={gravel:105,stone:100,topsoil:80,mulch:20};
const short=(value:number)=>value.toLocaleString("en-US",{maximumFractionDigits:2});
export function TakeoffLab({tool}:{tool:FieldTool}) {
  const ready=useHydrated();
  const [raw,setRaw]=useState(()=>defaults(tool)),[choices,setChoices]=useState<Record<string,string>>(defaultChoices),[toggles,setToggles]=useState({rebar:true,gravel:true}),[points,setPoints]=useState(defaultPoints),[copied,setCopied]=useState(false),[notice,setNotice]=useState(""),[region,setRegion]=useState("");
  const fieldVisible=(key:string)=>{
    if(tool.kind==="concrete"){if(key==="footing")return choices.mode==="footing";if(["spacing","cover","barCost"].includes(key))return choices.mode!=="footing"&&toggles.rebar;if(["gravel","gravelCost"].includes(key))return toggles.gravel;}
    if(tool.kind==="room"){if(["length","width"].includes(key))return choices.shape!=="polygon";if(["notchLength","notchWidth"].includes(key))return choices.shape==="l-shape";if(["tileLength","tileWidth","tilesPerBox"].includes(key))return choices.material==="tile";if(["height","openings","coats","paintCoverage"].includes(key))return choices.material==="paint";}
    if(tool.kind==="aggregate"){if(["radius","pileHeight"].includes(key))return choices.shape==="cone";if(["length","width","depth"].includes(key))return choices.shape!=="cone";}
    return true;
  };
  const visible=tool.fields.filter(f=>fieldVisible(f.key)),inputErrors=visible.filter(f=>raw[f.key]?.trim()===""||!Number.isFinite(Number(raw[f.key]))||Number(raw[f.key])<f.min||Number(raw[f.key])>f.max||(["corners","bundles","tilesPerBox","coats"].includes(f.key)&&!Number.isInteger(Number(raw[f.key])))).map(f=>`${f.label}: enter ${f.min}–${f.max} ${f.unit}${["corners","bundles","tilesPerBox","coats"].includes(f.key)?" in whole numbers":""}.`);
  const numbers=Object.fromEntries(tool.fields.map(f=>[f.key,Math.max(f.min,Math.min(f.max,Number.isFinite(Number(raw[f.key]))&&raw[f.key].trim()!==""?Number(raw[f.key]):f.initial))]));
  const state:TakeoffState={numbers,choices,toggles,points},result=calculateTakeoff(tool.kind,state),errors=[...inputErrors,...result.errors],valid=errors.length===0;
  const setNumber=(key:string,value:string)=>{setRaw(old=>({...old,[key]:value}));setCopied(false);setNotice("");};
  const setChoice=(key:string,value:string)=>{setChoices(old=>({...old,[key]:value}));setCopied(false);setNotice("");if(key==="densityMaterial")setNumber("density",String(densities[value]));if(key==="supply")setNumber("unitCost",value==="bags"?"6":"165");if(key==="scope"){const ranges:Record<string,number[]>={slab:[6,14],addition:[120,250],roof:[4.5,9]};setRaw(old=>({...old,low:String(ranges[value][0]),high:String(ranges[value][1])}));}};
  const setToggle=(patch:Partial<typeof toggles>)=>{setToggles(old=>({...old,...patch}));setCopied(false);setNotice("");};
  const movePoint=(index:number,point:Point)=>{setPoints(old=>old.map((p,i)=>i===index?point:p));setCopied(false);setNotice("");};
  const quickFields=tool.kind==="benchmark"?visible.filter(f=>["area","position","premium"].includes(f.key)):visible.filter(f=>!["unitCost","labor","margin"].includes(f.key)).slice(0,3);
  const select=(key:string,label:string,options:[string,string][])=> <label className="lab-choice" key={key}>{label}<select value={choices[key]} onChange={e=>setChoice(key,e.target.value)}>{options.map(([value,text])=><option value={value} key={value}>{text}</option>)}</select></label>;
  const priceUnit=tool.kind==="concrete"?(choices.supply==="bags"?"$/bag":"$/yd³"):tool.kind==="room"?(choices.material==="paint"?"$/gallon":choices.material==="tile"?"$/box":"$/ft²"):tool.kind==="aggregate"?(choices.costUnit==="ton"?"$/U.S. ton":"$/yd³"):null;
  const field=(f:DimensionField)=>{
    const value=numbers[f.key],id=`${tool.slug}-${f.key}`,unit=f.key==="unitCost"&&priceUnit?priceUnit:f.unit;
    return <div className="dimension-field" key={f.key}>
      <label htmlFor={id}>{f.label}<small>{unit}</small></label>
      <div className="dimension-stepper"><button aria-label={`Decrease ${f.label}`} disabled={value<=f.min} onClick={()=>setNumber(f.key,String(Math.max(f.min,Number((value-f.step).toFixed(4)))))}><Minus size={14}/></button><input id={id} type="number" min={f.min} max={f.max} step={f.step} value={raw[f.key]} onChange={e=>setNumber(f.key,e.target.value)} aria-invalid={inputErrors.some(error=>error.startsWith(`${f.label}:`))} aria-describedby={f.hint?`${id}-hint`:undefined}/><button aria-label={`Increase ${f.label}`} disabled={value>=f.max} onClick={()=>setNumber(f.key,String(Math.min(f.max,Number((value+f.step).toFixed(4)))))}><Plus size={14}/></button></div>
      <input type="range" aria-label={`Adjust ${f.label}`} min={f.min} max={f.max} step={f.step} value={value} onChange={e=>setNumber(f.key,e.target.value)}/>
      {f.hint&&<p id={`${id}-hint`} className="lab-hint">{f.hint}</p>}
    </div>;
  };
  const summary=()=>`${tool.name}${region?` — ${region}`:""}\n${result.metrics.map(m=>`${m.label}: ${short(m.value)} ${m.unit}`).join("\n")}\n${tool.kind==="benchmark"?"Planning total":"Estimated bid"}: ${money(result.bid)}\n${result.note}\nHypothetical planning estimate; replace assumptions with actual job data.`;
  async function copy(){try{await navigator.clipboard.writeText(summary());setCopied(true);setNotice("Summary copied.");}catch{setNotice("Copy unavailable. Select the quantities and bid below to copy manually.");}}
  function transfer(){try{sessionStorage.setItem(takeoffTransferKey,JSON.stringify({description:`${tool.name}: ${short(result.quantity)} ${result.unit}. ${result.metrics.slice(0,2).map(m=>`${m.label} ${short(m.value)} ${m.unit}`).join("; ")}`,quantity:1,unit:"job",rate:Math.round(result.bid*100)/100,taxable:false}));setNotice("Bid ready. Open the estimate studio and choose Add takeoff line; your existing draft is preserved.");}catch{setNotice("Browser storage unavailable. Copy the bid summary instead.");}}
  return <div className="field-lab">
    <fieldset className="interactive-tool-frame" disabled={!ready} aria-busy={!ready}><legend className="sr-only">{tool.name} inputs and results</legend>
    <div className="lab-toolbar"><span className="lab-live"><span/> LIVE QUANTITY LAB</span><button onClick={()=>{setRaw(defaults(tool));setChoices(defaultChoices);setToggles({rebar:true,gravel:true});setPoints(defaultPoints);setNotice("");setCopied(false);}}><RotateCcw size={15}/> Reset example</button></div>
    <div className="lab-layout">
      <section className="lab-inputs" aria-labelledby="dimensions-title"><h2 id="dimensions-title">Shape the work.</h2><p>Drag a measurement. Watch the takeoff change.</p>
        <div className="lab-choices">
          {tool.kind==="concrete"&&<>{select("mode","Concrete shape",[["slab","Solid slab"],["footing","Perimeter footing"]])}{select("supply","Concrete supply",[["ready","Ready-mix"],["bags","Bagged mix"]])}{choices.supply==="bags"&&select("bag","Bag size",[["80","80 lb · 0.60 ft³ yield"],["60","60 lb · 0.45 ft³ yield"]])}{choices.mode!=="footing"&&<><label className="lab-toggle"><input type="checkbox" checked={toggles.rebar} onChange={e=>setToggle({rebar:e.target.checked})}/> Show rebar grid</label>{toggles.rebar&&select("bar","Grid bar size (visual only)",[["4","#4 bar"],["5","#5 bar"]])}</>}<label className="lab-toggle"><input type="checkbox" checked={toggles.gravel} onChange={e=>setToggle({gravel:e.target.checked})}/> Include gravel layer</label></>}
          {tool.kind==="roofing"&&select("roofShape","Roof shape",[["gable","Gable"],["hip","Simple equal-pitch hip"]])}
          {tool.kind==="drywall"&&<>{select("sheet","Sheet size",[["8","4 × 8 ft"],["12","4 × 12 ft"]])}{select("surface","Surface",[["wall","Wall"],["ceiling","Ceiling"]])}</>}
          {tool.kind==="room"&&<>{select("shape","Room shape",[["rectangle","Rectangle"],["l-shape","L-shaped"],["polygon","Custom polygon"]])}{select("material","Convert area to",[["flooring","Flooring"],["tile","Tile boxes"],["paint","Wall paint"]])}</>}
          {tool.kind==="aggregate"&&<>{select("shape","Measure a",[["rectangle","Pad / trench"],["cone","Conical pile"]])}{select("densityMaterial","Material starting density",[["gravel","Gravel · illustrative 105 lb/ft³"],["stone","Crushed stone · illustrative 100 lb/ft³"],["topsoil","Topsoil · illustrative 80 lb/ft³"],["mulch","Mulch · illustrative 20 lb/ft³"]])}{select("costUnit","Supplier prices by",[["ton","U.S. short ton"],["yard","Cubic yard"]])}</>}
          {tool.kind==="benchmark"&&<>{select("scope","Example scope",[["slab","Garage slab"],["addition","Room addition"],["roof","Roof replacement"]])}<label className="lab-choice">Your region / quote label<input value={region} maxLength={100} placeholder="Enter your area (no automatic adjustment)" onChange={e=>{setRegion(e.target.value);setCopied(false);setNotice("");}}/></label><p className="lab-hint">Starting ranges are hypothetical planning examples. Replace them with dated local quotes for the same scope.</p></>}
        </div>
        <div className="dimension-grid">{visible.map(field)}</div>
        {tool.kind==="room"&&choices.shape==="polygon"&&<fieldset className="polygon-inputs"><legend>Polygon coordinates · feet (0–40)</legend><p>Drag orange handles, or edit each vertex here.</p>{points.map((point,index)=><div key={index}><span>P{index+1}</span>{(["x","y"] as const).map(axis=><label key={axis}>{axis.toUpperCase()}<input type="number" aria-label={`Point ${index+1} ${axis}`} min="0" max="40" step="0.5" value={point[axis]} onChange={e=>{const value=e.target.valueAsNumber;if(Number.isFinite(value)&&value>=0&&value<=40)movePoint(index,{...point,[axis]:value});}}/></label>)}</div>)}</fieldset>}
      </section>
      <section className="lab-output" aria-label="Live visual takeoff">
        <div className="blueprint-panel"><div className="blueprint-label"><span>{tool.short.toUpperCase()} / MEASURED VIEW</span><span>SCHEMATIC</span></div><TakeoffDiagram kind={tool.kind} state={state} result={result} onPointMove={movePoint}/><p>Live diagram · large layouts simplify repeated pieces · not a construction drawing</p></div>
        <div className="lab-mobile-dimensions"><span className="eyebrow">QUICK ADJUST</span>{quickFields.map(f=><label key={f.key}>{f.label}<strong>{short(numbers[f.key])} {f.unit}</strong><input type="range" aria-label={`Quick adjust ${f.label}`} min={f.min} max={f.max} step={f.step} value={numbers[f.key]} onChange={e=>setNumber(f.key,e.target.value)}/></label>)}</div>
        {errors.length>0?<div className="lab-errors" role="alert"><strong>Check your measurements</strong><ul>{errors.map(error=><li key={error}>{error}</li>)}</ul><p>The diagram uses bounded preview values. Correct the inputs to obtain an estimate.</p></div>:<>
          <div className="takeoff-bid"><div><span>{tool.kind==="benchmark"?"YOUR PLANNING TOTAL":"QUANTITY → COST → BID"}</span><strong>{money(result.bid)}</strong><p>{tool.kind==="benchmark"?"Area × selected installed cost assumption":`${money(result.materialCost)} materials + ${money(numbers.labor)} prep / labor / other · ${numbers.margin}% margin`}</p></div><button onClick={()=>void copy()}>{copied?<Check size={17}/>:<Copy size={17}/>} {copied?"Copied":"Copy bid summary"}</button></div>
          <div className="quantity-grid">{result.metrics.map(metric=><article key={metric.label}><span>{metric.label}</span><strong>{short(metric.value)} <small>{metric.unit}</small></strong></article>)}</div>
          <p className="lab-assumptions">{result.note}</p>
        </>}
        <div className="lab-estimate-actions"><button className="button-link" disabled={!valid} onClick={transfer}>Prepare estimate line <ArrowUpRight size={16}/></button><Link className="text-link" href="/tools/contractor-estimate-invoice-generator/">Open estimate studio →</Link></div>
        <p className="lab-feedback" role="status">{notice}</p>
        {tool.kind==="concrete"&&<p className="lab-hint">Bag yield reference: <a href="https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf">QUIKRETE Concrete Mix data sheet</a>. This product yield is not universal.</p>}
      </section>
    </div>
    </fieldset>
  </div>;
}
