import { AdSlot } from "@/components/ads/ad-slot";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tools } from "@/content/tools";
import { toolGuides } from "@/content/tool-guides";
import { calculatorForTrade, tradeTools } from "@/content/trade-tools";
import { ToolWorkbench } from "@/components/tool-workbench";
import { ToolGuideContent } from "@/components/tool-guide";
import { TradeLinks } from "@/components/trade-links";
import { meta, siteUrl } from "@/lib/seo";
import { fieldTools } from "@/content/field-tools";
import { FieldToolPage } from "@/components/field-lab/field-tool-page";

export function generateStaticParams() {
  return [...tools, ...tradeTools, ...fieldTools].map((tool) => ({ slug: tool.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = [...tools, ...tradeTools, ...fieldTools].find((tool) => tool.slug === slug);
  return tool ? meta(tool.name, tool.description, `/tools/${slug}/`) : {};
}
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fieldTool = fieldTools.find((tool) => tool.slug === slug);
  if (fieldTool) return <FieldToolPage tool={fieldTool} />;
  const trade = tradeTools.find((tool) => tool.slug === slug);
  const tool = trade ? calculatorForTrade(trade) : tools.find((tool) => tool.slug === slug);
  if (!tool) notFound();
  const template = trade?.kind === "template";
  const guide = trade?.guide ?? toolGuides[slug];
  const schema = siteUrl ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication", name: tool.name,
        url: `${siteUrl}/tools/${slug}/`,
        applicationCategory: "FinanceApplication", operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Calculators", item: `${siteUrl}/tools/` },
          { "@type": "ListItem", position: 3, name: tool.name, item: `${siteUrl}/tools/${slug}/` },
        ],
      },
    ],
  } : null;
  return <div className={`container calculator-page${template ? " workspace-page" : ""}`}>
    {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />}
    <nav className="breadcrumbs no-print" aria-label="Breadcrumb">
      <Link href="/">Home</Link><span>/</span><Link href="/tools/">Calculators</Link><span>/</span><span>{tool.short}</span>
    </nav>
    <span className="eyebrow no-print">{tool.category} / FREE CONTRACTOR TOOL</span>
    <h1>{tool.name}</h1>
    <p className="intro no-print">{tool.description}</p>
    {template ? <ToolWorkbench key={slug} mode="change" example={trade?.changeExample} /> : <ToolWorkbench key={slug} mode="financial" tool={tool} presets={trade?.presets} />}
    <ToolGuideContent tool={tool} guide={guide} template={template} exampleSlug={slug} />
    {trade && <p className="no-print"><Link className="text-link" href={`/tools/${trade.baseSlug}/`}>Read the general {tools.find((item) => item.slug === trade.baseSlug)?.short.toLowerCase()} guide →</Link></p>}
    <div className="no-print"><AdSlot /></div>
    <TradeLinks currentSlug={slug} />
    <section className="related no-print">
      <span className="eyebrow">KEEP WORKING THE NUMBERS</span>
      <h2>Related calculators</h2>
      <div className="related-grid">{tools.filter((item) => item.slug !== tool.slug).map((item) => <Link key={item.slug} href={`/tools/${item.slug}/`}>{item.name}<span aria-hidden="true">↗</span></Link>)}</div>
    </section>
  </div>;
}
