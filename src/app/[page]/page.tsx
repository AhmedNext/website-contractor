import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "@/content/pages";
import { meta } from "@/lib/seo";
import { EditorialPhoto } from "@/components/editorial-photo";
import { contactEmail, policyUpdated } from "@/content/contact";
export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const p = pages[page];
  return p ? meta(p.title, p.description, "/" + page + "/") : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const p = pages[page];
  if (!p) notFound();
  return (
    <article className="container prose-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{page.replaceAll("-", " ")}</span>
      </nav>
      <span className="eyebrow">CONTRACTOR MONEY LAB</span>
      <h1>{p.title}</h1>
      <p className="intro">{p.description}</p>
      {(page === "terms" || page === "privacy-policy") && <p className="policy-date">Last updated: {policyUpdated}</p>}
      {page === "contact" && <div className="contact-card"><h2>Email support</h2><p><a href={`mailto:${contactEmail}`}>{contactEmail}</a></p><a className="button-link" href={`mailto:${contactEmail}?subject=Contractor%20Money%20Lab%20support`}>Write an email</a><p className="lab-hint">Opens your email app. You can also copy the address into your preferred email service.</p></div>}
      {page === "about" && (
        <figure className="about-story">
        <EditorialPhoto
          photo="framing-crew"
          alt="Carpenters reviewing the next stage of a residential project"
          className="about-photo"
        />
        <figcaption>From the first plan to the final invoice, clear numbers help you make better decisions on the job.</figcaption>
        </figure>
      )}
      {p.sections.map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
      {(page === "terms" || page === "privacy-policy") && <section><h2>Contact</h2><p>Questions or requests: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p><Link href="/contact/">How to report an issue →</Link></section>}
      {page === "methodology" && (
        <Link className="button-link" href="/tools">
          Use the calculators →
        </Link>
      )}
    </article>
  );
}
