import Link from "next/link";
import { tradeTools } from "@/content/trade-tools";

export function TradeLinks({ currentSlug }: { currentSlug?: string }) {
  return <section className="related trade-directory no-print" aria-labelledby="trade-tools-title">
    <span className="eyebrow">START WITH YOUR TRADE</span>
    <h2 id="trade-tools-title">A closer fit for the work you do.</h2>
    <div className="trade-grid">{tradeTools.filter((tool) => tool.slug !== currentSlug).map((tool) => <article key={tool.slug}>
      <Link href={`/tools/${tool.slug}/`}>{tool.name}<span aria-hidden="true"> ↗</span></Link><p>{tool.description}</p>
    </article>)}</div>
  </section>;
}
