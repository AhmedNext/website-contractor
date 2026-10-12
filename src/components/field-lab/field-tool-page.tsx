import Link from "next/link";
import type { FieldTool } from "@/content/field-tools";
import { fieldGuides } from "@/content/field-guides";
import { ToolWorkbench } from "@/components/tool-workbench";
import { ToolGuideContent } from "@/components/tool-guide";
import { siteUrl } from "@/lib/seo";
import { FieldToolGrid } from "./field-tool-grid";

export function FieldToolPage({tool}:{tool:FieldTool}) {
  const guide=fieldGuides[tool.kind],document=tool.kind==="estimate"||tool.kind==="waiver";
  const steps=document?["Choose the document type and enter the project, party and payment details.","Review the live preview, exceptions and required information before printing.","Use Print / Save PDF and download a JSON backup to keep the local draft."]:tool.kind==="benchmark"?["Choose an example scope and replace the low and high rates with your own local assumptions.","Enter measured area and move the slider to compare the planning total and allocated cost shares.","Review the separate premium scenario, then copy the summary or prepare a planning line for the estimate studio."]:["Choose the shape and enter measured dimensions using the labeled units.","Review the live diagram, net quantities and allowance-adjusted purchase quantities.","Enter current unit costs, labor and margin; copy the bid or prepare a line for the estimate studio."];
  const url=`${siteUrl}/tools/${tool.slug}/`,schema=siteUrl?{"@context":"https://schema.org","@graph":[{"@type":"WebApplication",name:tool.name,url,applicationCategory:document?"BusinessApplication":"UtilitiesApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}},{"@type":"HowTo",name:`How to use the ${tool.name}`,step:steps.map((text,index)=>({"@type":"HowToStep",position:index+1,text}))},{"@type":"FAQPage",mainEntity:guide.faqs.map(faq=>({"@type":"Question",name:faq.question,acceptedAnswer:{"@type":"Answer",text:faq.answer}}))},{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${siteUrl}/`},{"@type":"ListItem",position:2,name:"Visual field lab",item:`${siteUrl}/field-lab/`},{"@type":"ListItem",position:3,name:tool.name,item:url}]}]}:null;
  return <div className={`container calculator-page field-tool-page${document?" workspace-page":""}`}>
    {schema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>}
    <nav className="breadcrumbs no-print" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/field-lab/">Visual field lab</Link><span>/</span><span>{tool.short}</span></nav>
    <div className="no-print"><span className="eyebrow">{document?"DOCUMENT STUDIO":"VISUAL TAKEOFF"} / FREE CONTRACTOR TOOL</span><h1>{tool.name}</h1><p className="intro">{tool.description}</p></div>
    {tool.kind==="estimate"?<ToolWorkbench key={tool.slug} mode="estimate"/>:tool.kind==="waiver"?<ToolWorkbench key={tool.slug} mode="waiver"/>:<ToolWorkbench key={tool.slug} mode="takeoff" tool={tool}/>}
    <section className="lab-howto no-print" aria-labelledby="lab-howto-title"><h2 id="lab-howto-title">Use it in three steps</h2><ol>{steps.map(step=><li key={step}>{step}</li>)}</ol></section>
    <ToolGuideContent tool={{...tool,category:"FIELD TOOL",fields:[],formula:guide.formula,example:guide.example,mistake:"",audience:guide.audience,limitations:guide.limitations}} guide={guide} introduction={guide.audience} privacy={document?"One document draft is saved in localStorage in this browser. It is not sent to a server or synchronized. Download a backup before replacing it.":"Takeoff inputs stay in page memory and clear on reload. Preparing an estimate line creates a local session transfer; you explicitly add it in the studio. No financial inputs are transmitted."}/>
    <section className="related no-print"><span className="eyebrow">KEEP BUILDING THE ESTIMATE</span><h2>Explore the field lab</h2><FieldToolGrid excludeSlug={tool.slug}/></section>
  </div>;
}
