"use client";
import dynamic from "next/dynamic";
import type { Tool } from "@/content/tools";
import type { FieldTool } from "@/content/field-tools";
import type { CalculatorPreset } from "@/content/calculator-presets";
import type { Change } from "@/lib/job-workspace";

const loading=()=> <p className="lab-hint" role="status">Preparing your interactive tool…</p>;
// Split at a client boundary while preserving the default server-rendered preview.
const FinancialCalculator=dynamic(()=>import("./calculators/calculator").then(module=>module.Calculator),{loading});
const TakeoffLab=dynamic(()=>import("./field-lab/takeoff-lab").then(module=>module.TakeoffLab),{loading});
const EstimateStudio=dynamic(()=>import("./field-lab/estimate-studio").then(module=>module.EstimateStudio),{loading});
const LienStudio=dynamic(()=>import("./field-lab/lien-studio").then(module=>module.LienStudio),{loading});
const ChangeBuilder=dynamic(()=>import("./job-workspace/change-builder").then(module=>module.ChangeBuilder),{loading});
type WorkbenchProps =
  | {mode:"financial";tool:Tool;presets?:CalculatorPreset[]}
  | {mode:"takeoff";tool:FieldTool}
  | {mode:"estimate"}
  | {mode:"waiver"}
  | {mode:"change";example?:Partial<Change>};
export function ToolWorkbench(props:WorkbenchProps) {
  if(props.mode==="financial")return <FinancialCalculator tool={props.tool} presets={props.presets}/>;
  if(props.mode==="takeoff")return <TakeoffLab tool={props.tool}/>;
  if(props.mode==="estimate")return <EstimateStudio/>;
  if(props.mode==="waiver")return <LienStudio/>;
  return <ChangeBuilder example={props.example}/>;
}
