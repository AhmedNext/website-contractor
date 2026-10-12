"use client";
import { useState } from "react";
import { Printer, Download } from "lucide-react";
import { blankLien, lienDraftSchema, lienForm, lienSources, type LienDraft } from "@/content/lien-forms";
import { useLocalDraft, MoneyInput } from "@/components/job-workspace/storage";
import { downloadFile } from "@/lib/job-workspace";

export function LienStudio() {
  const {data,setData,ready,message,setMessage}=useLocalDraft("cml-lien-v1",lienDraftSchema,blankLien);
  const [reviewed,setReviewed]=useState(false),[paid,setPaid]=useState(false),[pending,setPending]=useState<LienDraft|null>(null);
  const update=(patch:Partial<LienDraft>)=>{setData({...data,...patch});setReviewed(false);setPaid(false);};
  const form=lienForm(data),notice=data.type==="notice",source=notice?(data.state==="FL"?lienSources.notice:null):data.state==="General"?null:lienSources[data.state];
  const required: (keyof LienDraft)[]=["claimant","customer","location","date",...(notice?["scope"] as const:["owner"] as const),...(!notice&&!form.final?["through"] as const:[]),...(!notice&&form.conditional?["maker","payee"] as const:[]),...(data.state==="TX"&&!notice?["project","job","scope"] as const:[]),...(data.state==="General"&&!notice?["jurisdiction","scope"] as const:[]),...(notice&&data.state==="FL"?["owner","ownerAddress","address","copies"] as const:[])];
  if(data.state==="CA"&&!notice){if(form.final)required.push("extrasAmount");else if(form.conditional)required.push("unpaidAmount");}
  const missing=required.filter(key=>!String(data[key]).trim()),canPrint=ready&&reviewed&&missing.length===0&&(notice&&data.state==="FL"||data.amount>0)&&(notice||form.conditional||paid);
  const fields:[keyof LienDraft,string][]=[["claimant","Claimant / company"],["customer","Customer / contracting party"],["owner","Property owner"],["location","Property / job location"],["project","Project name"],["job","Job number"],["through","Through date"],["maker","Check maker"],["payee","Check payable to"],["scope","Furnished work / job description"],["unpaidDates",data.state==="General"?"Exceptions for local review":"Earlier conditional waiver date(s)"],["unpaidAmount","Unpaid progress amount(s) — enter 0 if none"],["extrasAmount","Disputed extras amount — enter 0 if none"],["title","Claimant representative title"],["date","Signature / document date"],["address","Claimant address"],["ownerAddress","Owner address"],["copies","Notice copies / required recipients"],["jurisdiction","Project jurisdiction for review"]];
  const show=(key:keyof LienDraft)=>{
    if(["claimant","customer","owner","location","title","date"].includes(key))return true;
    if(key==="project"||key==="job")return data.state==="TX"||notice;
    if(key==="through")return !notice&&!form.final;
    if(key==="maker"||key==="payee")return !notice&&form.conditional;
    if(key==="scope")return data.state==="TX"||data.state==="General"||notice;
    if(key==="unpaidDates")return data.state==="General"&&!notice||data.state==="CA"&&!form.final&&form.conditional;
    if(key==="unpaidAmount")return data.state==="CA"&&!notice&&!form.final&&form.conditional;
    if(key==="extrasAmount")return data.state==="CA"&&!notice&&form.final;
    if(key==="jurisdiction")return data.state==="General";
    return notice&&data.state==="FL";
  };
  async function restore(file?:File){if(!file)return;setPending(null);try{if(file.size>100000)throw Error();setPending(lienDraftSchema.parse(JSON.parse(await file.text())));setMessage("Backup ready. Confirm replacement, then review the restored details.");}catch{setMessage("Invalid lien-document backup. The current draft was kept.");}}
  return <div className="lien-studio">
    <div className="workspace-actions no-print"><button disabled={!canPrint} onClick={()=>window.print()}><Printer size={17}/> Print / Save PDF</button><button disabled={!ready} onClick={()=>downloadFile("lien-document-backup.json",JSON.stringify(data,null,2))}><Download size={17}/> JSON backup</button><label className="import-control">Restore backup<input type="file" accept=".json,application/json" disabled={!ready} onChange={e=>{void restore(e.target.files?.[0]);e.target.value="";}}/></label></div>
    <p className="storage-note no-print" role="status">{message} One local document draft. No signing, sending, filing or service is performed.</p>
    {pending&&<div className="example-confirmation no-print"><p>Replace the current lien-document draft with this backup?</p><div className="workspace-actions"><button onClick={()=>{setData(pending);setPending(null);setReviewed(false);setPaid(false);setMessage("Lien document backup restored. Review acknowledgments cleared.");}}>Replace draft</button><button onClick={()=>{setPending(null);setMessage("Current draft kept.");}}>Keep current draft</button></div></div>}
    <div className="document-studio-grid">
      <fieldset className="document-controls no-print" disabled={!ready}><legend>Choose the right document</legend><label>Project state<select value={data.state} onChange={e=>update({state:e.target.value as LienDraft["state"]})}><option value="CA">California</option><option value="TX">Texas</option><option value="FL">Florida</option><option value="General">General / other states — review draft</option></select></label><label>Document form<select value={data.type} onChange={e=>update({type:e.target.value as LienDraft["type"]})}><option value="conditional-progress">Conditional · progress payment</option><option value="unconditional-progress">Unconditional · progress payment</option><option value="conditional-final">Conditional · final payment</option><option value="unconditional-final">Unconditional · final payment</option><option value="notice">{data.state==="FL"?"Florida Notice to Owner":"General payment notice (not statutory)"}</option></select></label>
        <p className="legal-context">{data.state==="General"?"The General option is a review draft, not a universal state-compliant waiver. Some states require specific wording or restrict releases.":notice&&data.state!=="FL"?"This is ordinary payment correspondence, not a state preliminary notice or lien filing.":"State form language is based on the official source linked below. The facts, signature, delivery, payment evidence and job applicability still require review."}</p>
        {source&&<a className="text-link" href={source.href}>Review {source.label} ↗</a>}
        {data.state==="TX"&&!notice&&!form.final&&<p className="legal-context">Texas progress forms refer to attached statements or progress payment requests. Attach the actual supporting documents to the final copy.</p>}
        {notice&&data.state==="FL"&&<p className="legal-context">Generating this notice does not serve it, identify every recipient or calculate a deadline. Review §713.06 and the applicable service requirements before using it.</p>}
        {fields.filter(([key])=>show(key)).map(([key,label])=><label key={key}>{label}{key==="through"||key==="date"?<input type="date" value={String(data[key])} onChange={e=>update({[key]:e.target.value})}/>:<textarea rows={["scope","location","address","ownerAddress","copies"].includes(key)?3:1} maxLength={2000} value={String(data[key])} onChange={e=>update({[key]:e.target.value})}/>}</label>)}
        {(!notice||data.state!=="FL")&&<label>Payment amount ($)<MoneyInput label="Payment amount" value={data.amount} onChange={amount=>update({amount})}/></label>}
        {data.state==="CA"&&!notice&&<p className="lab-hint">For exception amount fields, enter 0 explicitly when there are no reserved amounts. The signature remains blank for signing outside this tool.</p>}
        {!notice&&!form.conditional&&<label className="lab-toggle legal-ack"><input type="checkbox" checked={paid} onChange={e=>setPaid(e.target.checked)}/> The identified payment has actually been received in cleared funds.</label>}
        <label className="lab-toggle legal-ack"><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/> I reviewed the document facts and the current official form or local requirements.</label>
        <p className="lab-hint">Print becomes available after required details and review are complete. Missing fields: {missing.length?missing.join(", "):"none"}. {data.amount<=0&&!notice?"Enter a positive payment amount.":""}</p>
      </fieldset>
      <article className={`document-canvas printable-document legal-document${!canPrint?" document-draft":""}`} aria-label="Live lien-document preview">
        {!canPrint&&<div className="document-review-tag">DRAFT · NOT READY FOR SIGNATURE</div>}
        {form.notice&&<p className="statutory-notice">{form.notice}</p>}
        <h2>{form.title}</h2><dl className="legal-identifying">{form.fields.map(([label,value])=><div key={label}><dt>{label}:</dt><dd>{value}</dd></div>)}</dl>
        {form.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
        {form.exceptions.length>0&&<section><h3>{notice?"Lienor & copies":"Exceptions"}</h3>{form.exceptions.map((exception,index)=><p key={index}>{exception}</p>)}</section>}
        <div className="legal-signature"><p>{notice&&data.state==="FL"?"Lienor's signature":data.state==="TX"?"By (signature)":"Claimant's signature"}: ____________________________</p>{data.state==="TX"&&<p>Company name: {data.claimant||"____________________"}</p>}<p>Title: {data.title||"____________________"}</p><p>Date: {data.date||"____________________"}</p></div>
        <p className="document-footnote">{data.state==="General"||notice&&data.state!=="FL"?"General review draft. Not a state-approved form.":`Prepared from ${source?.label}. Source reviewed October 12, 2026. Verify current requirements before execution.`}</p>
      </article>
    </div>
  </div>;
}
