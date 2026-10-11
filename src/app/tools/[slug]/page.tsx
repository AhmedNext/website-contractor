import { AdSlot } from "@/components/ads/ad-slot";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tools } from "@/content/tools";
import { Calculator } from "@/components/calculators/calculator";
import { meta, siteUrl } from "@/lib/seo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = tools.find((t) => t.slug === slug);
  return t ? meta(t.name, t.description, "/tools/" + slug + "/") : {};
}
export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = tools.find((t) => t.slug === slug);
  if (!t) notFound();
  const schema = siteUrl
    ? {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        url: siteUrl + "/tools/" + slug + "/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }
    : null;
  return (
    <div className="container calculator-page">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      {siteUrl && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteUrl + "/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Calculators",
                  item: siteUrl + "/tools/",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: t.name,
                  item: siteUrl + "/tools/" + slug + "/",
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/tools">Calculators</Link>
        <span>/</span>
        <span>{t.short}</span>
      </nav>
      <span className="eyebrow">{t.category} / FREE CONTRACTOR TOOL</span>
      <h1>{t.name}</h1>
      <p className="intro">{t.description}</p>
      <Calculator tool={t} />
      <section className="editorial">
        <div>
          <span className="eyebrow">UNDERSTAND THE ESTIMATE</span>
          <h2>The math, without the mystery.</h2>
          <h3>What this calculator does</h3>
          <p>
            {t.description} It separates the parts of your estimate so you can
            examine what changes when a price, cost, or timing assumption
            changes.
          </p>
          <h3>Who should use it</h3>
          <p>{t.audience}</p>
          <h3>How to use it</h3>
          <p>
            Replace the hypothetical inputs with figures from your estimate,
            contract, or business budget. Enter dollar amounts in USD and
            percentages as whole percentages: enter 20 for 20%. Results
            recalculate immediately. Use Reset to return to the example and
            compare a revised scenario.
          </p>
          <h3>How the calculation works</h3>
          <p className="formula-box">{t.formula}</p>
          <h3>A worked example</h3>
          <p>{t.example}</p>
          <h3>Common mistakes</h3>
          <p>{t.mistake}</p>
        </div>
        <aside>
          <h3>Assumptions & limitations</h3>
          <p>{t.limitations}</p>
          <p>
            Undefined ratios appear as unavailable. Dollar amounts are rounded
            only for display; calculations retain their intermediate precision.
          </p>
          <Link className="text-link" href="/methodology">
            Read the full methodology →
          </Link>
          <Accordion>
            <AccordionItem value="privacy">
              <AccordionTrigger>Are my inputs saved?</AccordionTrigger>
              <AccordionContent>
                No. Inputs remain in local page state and are cleared when the
                page is reloaded. We do not transmit them to a server.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="free">
              <AccordionTrigger>Is this tool free?</AccordionTrigger>
              <AccordionContent>
                Yes. All tools are available without an account or payment.
                Future display advertising must remain separate from your
                calculations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>
      </section>
      <AdSlot />
      <section className="related">
        <span className="eyebrow">KEEP WORKING THE NUMBERS</span>
        <h2>Related calculators</h2>
        <div className="related-grid">
          {tools
            .filter((x) => x.slug !== slug)
            .map((x) => (
              <Link key={x.slug} href={"/tools/" + x.slug}>
                {x.name}
                <span>↗</span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
