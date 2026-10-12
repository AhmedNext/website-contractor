import type { FieldKind } from "@/content/field-tools";
export type Point = { x: number; y: number };
export type TakeoffState = { numbers: Record<string, number>; choices: Record<string, string>; toggles: Record<string, boolean>; points: Point[] };
export type TakeoffResult = { metrics: { label: string; value: number; unit: string }[]; quantity: number; unit: string; materialCost: number; totalCost: number; bid: number; area: number; volume: number; note: string; errors: string[] };
export const defaultPoints: Point[] = [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 10 }, { x: 12, y: 10 }, { x: 12, y: 16 }, { x: 0, y: 16 }];
export function polygonArea(points: Point[]) { return Math.abs(points.reduce((sum, point, i) => { const next = points[(i + 1) % points.length]; return sum + point.x * next.y - next.x * point.y; }, 0)) / 2; }
export function polygonPerimeter(points: Point[]) { return points.reduce((sum, point, i) => { const next = points[(i + 1) % points.length]; return sum + Math.hypot(next.x - point.x, next.y - point.y); }, 0); }
export function roomPoints(state: TakeoffState): Point[] {
  const n = state.numbers;
  if (state.choices.shape === "polygon") return state.points;
  if (state.choices.shape === "l-shape") return [{ x: 0, y: 0 }, { x: n.length, y: 0 }, { x: n.length, y: n.width - n.notchWidth }, { x: n.length - n.notchLength, y: n.width - n.notchWidth }, { x: n.length - n.notchLength, y: n.width }, { x: 0, y: n.width }];
  return [{ x: 0, y: 0 }, { x: n.length, y: 0 }, { x: n.length, y: n.width }, { x: 0, y: n.width }];
}
const cross = (a: Point, b: Point, c: Point) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
function invalidPolygon(points: Point[]) {
  if (points.length < 3 || points.length > 12 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y) || p.x < 0 || p.y < 0 || p.x > 100 || p.y > 100)) return true;
  for (let i=0;i<points.length;i++) {
    const a=points[i], b=points[(i+1)%points.length]; if (Math.hypot(b.x-a.x,b.y-a.y)<0.01) return true;
    for(let j=i+1;j<points.length;j++){if(j===i+1 || (i===0&&j===points.length-1))continue;const c=points[j],d=points[(j+1)%points.length];if(cross(a,b,c)*cross(a,b,d)<=0 && cross(c,d,a)*cross(c,d,b)<=0 && Math.max(Math.min(a.x,b.x),Math.min(c.x,d.x))<=Math.min(Math.max(a.x,b.x),Math.max(c.x,d.x)) && Math.max(Math.min(a.y,b.y),Math.min(c.y,d.y))<=Math.min(Math.max(a.y,b.y),Math.max(c.y,d.y)))return true;}
  }
  return polygonArea(points)<0.01;
}
export function calculateTakeoff(kind: FieldKind, state: TakeoffState): TakeoffResult {
  const n=state.numbers,c=state.choices,t=state.toggles;
  const metrics: TakeoffResult["metrics"]=[],errors:string[]=[];
  const add=(label:string,value:number,unit:string)=>{metrics.push({label,value,unit});return value;};
  let area=0,volume=0,quantity=0,unit="",materialCost=0,note="";
  const factor=1+(n.waste||0)/100;
  if(Object.values(n).some(value=>!Number.isFinite(value)||value<0))errors.push("Enter finite, nonnegative measurements.");
  if(kind==="concrete") {
    const footing=c.mode==="footing",fw=n.footing/12;
    if(footing&&fw*2>=Math.min(n.length,n.width))errors.push("Footing width must leave a positive inside opening.");
    area=footing?n.length*n.width-Math.max(0,n.length-2*fw)*Math.max(0,n.width-2*fw):n.length*n.width;
    volume=area*n.depth/12/27; quantity=volume*factor;unit="yd³";
    add("Net concrete",volume,"yd³");add("Order with allowance",quantity,"yd³");
    const yieldFt=c.bag==="60"?0.45:0.6,bags=add(`${c.bag||"80"} lb bags (alternative to ready-mix)`,Math.ceil(quantity*27/yieldFt),"bags");
    const gravel=add("Gravel layer",t.gravel?area*n.gravel/12/27*factor:0,"yd³");let bars=0;
    if(t.rebar&&!footing){const l=n.length-2*n.cover/12,w=n.width-2*n.cover/12;if(l<=0||w<=0)errors.push("Edge clearance exceeds the slab dimensions."); const nx=Math.ceil(Math.max(0,w)*12/n.spacing)+1,ny=Math.ceil(Math.max(0,l)*12/n.spacing)+1;add("Bars running along length",nx,"bars");add("Bars running along width",ny,"bars");bars=add("Grid bar length, no laps",nx*Math.max(0,l)+ny*Math.max(0,w),"ft");}
    if(c.supply==="bags"){quantity=bags;unit="bags";}
    materialCost=quantity*n.unitCost+gravel*n.gravelCost+bars*n.barCost;note="Quantity sketch only. Depth is visually exaggerated. Rebar spacing, size and clearance are assumptions, not a structural design; laps and splice allowances are excluded. Bag yield: QUIKRETE Concrete Mix; verify your product. Gravel and grid steel use the separate unit costs entered below.";
  } else if(kind==="roofing") {
    const l=n.length+2*n.overhang/12,w=n.width+2*n.overhang/12;
    if(c.roofShape==="hip"&&l<w)errors.push("For this simple hip model, length must be at least width.");
    area=l*w*Math.sqrt(1+(n.pitch/12)**2);quantity=Math.ceil(area*factor/100*n.bundles);unit="bundles";
    add("Sloped roof area",area,"ft²");add("Roofing squares, net",area/100,"squares");add("Pitch angle",Math.atan(n.pitch/12)*180/Math.PI,"°");add("Shingle bundles",quantity,"bundles");add("Underlayment rolls",Math.ceil(area*factor/n.rollCoverage),"rolls");
    materialCost=quantity*n.unitCost+n.extras;note="Simple rectangular, equal-pitch roof. No dormers, valleys, penetrations or structural sizing. Bundle and roll yields are product assumptions. Waste applies to purchase quantities, not measured roof area.";
  } else if(kind==="framing") {
    const regular=Math.ceil(n.length*12/n.spacing)+1,extra=n.corners*2,cut=n.height-4.5/12;
    if(cut>n.stock)errors.push("Stud stock must be at least the cut length.");
    quantity=Math.ceil((regular+extra)*factor);unit="studs";area=n.length*n.height;
    add("Regular studs including both ends",regular,"studs");add("Extra corner/backing studs",extra,"studs");add("Purchase count",quantity,"studs");add("Stud cut length (three 1.5-in plates)",cut,"ft");add("Plate lumber with allowance",n.length*3*factor,"ft");
    materialCost=quantity*n.unitCost+n.length*3*factor*n.plateCost;note="Straight wall, one bottom and two top plates. Two extra studs per entered corner are a quantity allowance only. Openings, headers, bracing and structural suitability are excluded. Stock count is not a cutting optimization.";
  } else if(kind==="drywall") {
    const sheet=Number(c.sheet||8),gross=n.length*n.height;area=gross-n.openings;
    if(area<=0)errors.push("Opening deductions must be smaller than the measured surface.");
    quantity=Math.ceil(Math.max(0,area)*factor/(4*sheet));unit="sheets";
    const rows=Math.ceil(n.height/4);let vertical=0;
    for(let row=0;row<rows;row++){const offset=row%2?sheet/2:0;let x=sheet-offset;let count=0;while(x<n.length-1e-9){count++;x+=sheet;}vertical+=count*Math.min(4,n.height-row*4);}
    const tape=((rows-1)*n.length+vertical)*factor,buckets=Math.ceil(Math.max(0,area)*factor/n.bucketCoverage);
    add("Net surface area",Math.max(0,area),"ft²");add("Sheets, area-based purchase estimate",quantity,"sheets");add("Gross-layout joint tape + allowance",tape,"ft");add("Compound buckets",buckets,"buckets");materialCost=quantity*n.unitCost+buckets*n.bucketCost;
    note="Staggered sketch shows gross surface, not openings or an optimized cut plan. Sheets use net area plus allowance; cuts can require more. Tape excludes perimeter edges and opening returns. Compound yield is your assumption; tape and accessories belong in other costs.";
  } else if(kind==="room") {
    if(c.shape==="l-shape"&&(n.notchLength>=n.length||n.notchWidth>=n.width))errors.push("The L-shape cutout must be smaller than the outside length and width.");
    const points=roomPoints(state);if(invalidPolygon(points))errors.push("Use a non-crossing polygon with distinct vertices and positive area.");
    area=polygonArea(points);const perimeter=polygonPerimeter(points),mode=c.material||"flooring";
    add("Floor area",area,"ft²");add("Room perimeter",perimeter,"ft");
    if(mode==="paint"){const wallArea=perimeter*n.height-n.openings;if(wallArea<=0)errors.push("Wall-opening deductions exceed wall area.");quantity=Math.ceil(Math.max(0,wallArea)*n.coats*factor/n.paintCoverage);unit="gallons";add("Net wall area",Math.max(0,wallArea),"ft²");add("Paint purchase",quantity,"gallons");}
    else if(mode==="tile"){const tiles=Math.ceil(area*factor/(n.tileLength*n.tileWidth/144));quantity=Math.ceil(tiles/n.tilesPerBox);unit="boxes";add("Tiles with allowance",tiles,"tiles");add("Tile boxes",quantity,"boxes");}
    else {quantity=area*factor;unit="ft²";add("Flooring purchase area",quantity,"ft²");}
    materialCost=quantity*n.unitCost;note="Plan area and perimeter from your dimensions. Polygon handles are draggable; coordinate inputs provide a keyboard alternative. Paint covers walls only, not the ceiling. Deductions, coverage and waste are editable assumptions.";
  } else if(kind==="aggregate") {
    volume=c.shape==="cone"?Math.PI*n.radius*n.radius*n.pileHeight/3/27:n.length*n.width*n.depth/12/27;area=n.length*n.width;
    const order=volume*n.looseFactor*factor,tons=order*27*n.density/2000;
    add("Measured volume",volume,"yd³");add("Order volume",order,"yd³");add("Order weight",tons,"U.S. short tons");add("Assumed bulk density",n.density,"lb/ft³");quantity=c.costUnit==="ton"?tons:order;unit=c.costUnit==="ton"?"tons":"yd³";materialCost=quantity*n.unitCost;
    note="U.S. short ton = 2,000 lb. Bulk densities are illustrative and editable; use the supplier's condition-specific density. Loose/placed factor and order allowance are separate. The cone assumes a circular base, not a surveyed irregular pile.";
  } else if(kind==="benchmark") {
    if(n.high<n.low)errors.push("High cost must be at least low cost.");if(n.materialShare+n.laborShare>100)errors.push("Material and labor shares cannot exceed 100% together.");
    area=n.area;const rate=n.low+(n.high-n.low)*n.position/100;quantity=area;unit="ft²";materialCost=area*rate;
    add("Selected installed rate",rate,"$/ft²");add("Planning total",materialCost,"$");add("Material allocation",materialCost*n.materialShare/100,"$");add("Labor allocation",materialCost*n.laborShare/100,"$");add("Other / overhead allocation",materialCost*(100-n.materialShare-n.laborShare)/100,"$");add("Premium scenario",area*n.high*n.premium,"$");
    note="User-defined planning ranges, not verified regional benchmarks. Midpoint is arithmetic, not a market average. Shares allocate the same total and do not add extra costs. Premium is an editable factor applied to your high assumption.";
  }
  const totalCost=materialCost+(kind==="benchmark"?0:n.labor||0),bid=kind==="benchmark"?totalCost:totalCost/(1-(n.margin||0)/100);
  if(!Number.isFinite(quantity)||!Number.isFinite(bid)||!Number.isFinite(area)||bid<0||metrics.some(metric=>!Number.isFinite(metric.value)||metric.value<0))errors.push("These measurements cannot produce a finite, nonnegative estimate.");
  return {metrics,quantity,unit,materialCost,totalCost,bid,area,volume,note,errors};
}
