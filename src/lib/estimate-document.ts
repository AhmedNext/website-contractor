import { z } from "zod";
const amount=z.number().finite().min(0).max(1e12);
export const estimateLineSchema=z.object({description:z.string().max(500),quantity:amount,unit:z.string().max(30),rate:amount,taxable:z.boolean()});
export const estimateSchema=z.object({version:z.literal(1),type:z.enum(["Estimate","Invoice"]),number:z.string().max(80),date:z.string().max(30),due:z.string().max(30),contractor:z.string().max(500),client:z.string().max(500),project:z.string().max(300),terms:z.string().max(3000),notes:z.string().max(3000),lines:z.array(estimateLineSchema).min(1).max(30),tax:z.number().finite().min(0).max(30),discount:z.number().finite().min(0).max(100),retainage:z.number().finite().min(0).max(100)});
export type EstimateDocument=z.infer<typeof estimateSchema>;
export type EstimateLine=z.infer<typeof estimateLineSchema>;
export const blankEstimate:EstimateDocument={version:1,type:"Estimate",number:"EST-001",date:"",due:"",contractor:"",client:"",project:"",terms:"Payment schedule and acceptance terms to be agreed with the client.",notes:"",lines:[{description:"",quantity:1,unit:"job",rate:0,taxable:false}],tax:0,discount:0,retainage:0};
export const cents=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export function estimateTotals(doc:EstimateDocument){const subtotal=cents(doc.lines.reduce((s,l)=>s+cents(l.quantity*l.rate),0)),discount=cents(subtotal*doc.discount/100),net=cents(subtotal-discount),taxable=doc.lines.filter(l=>l.taxable).reduce((s,l)=>s+cents(l.quantity*l.rate),0)*(subtotal>0?net/subtotal:0),tax=cents(taxable*doc.tax/100),retainage=cents(net*doc.retainage/100);return{subtotal,discount,tax,retainage,total:cents(net+tax),due:cents(net+tax-retainage)};}
export { estimateDraftKey, takeoffTransferKey } from "./workspace-keys";
