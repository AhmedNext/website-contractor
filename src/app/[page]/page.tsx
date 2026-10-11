import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "@/content/pages";
import { meta } from "@/lib/seo";
import { EditorialPhoto } from "@/components/editorial-photo";
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
      {page === "about" && (
        <EditorialPhoto
          photo="framing-crew"
          alt="Carpenters reviewing the next stage of a residential project"
          className="about-photo"
        />
      )}
      {p.sections.map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>
            {page === "contact" &&
            title === "Contact availability" &&
            process.env.NEXT_PUBLIC_CONTACT_EMAIL
              ? "Use the email link below to contact the site operator. Please use hypothetical figures when reporting a calculation issue."
              : body}
          </p>
        </section>
      ))}
      {page === "contact" && process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
        <a
          className="button-link"
          href={"mailto:" + process.env.NEXT_PUBLIC_CONTACT_EMAIL}
        >
          Email Contractor Money Lab
        </a>
      )}
      {page === "methodology" && (
        <Link className="button-link" href="/tools">
          Use the calculators →
        </Link>
      )}
    </article>
  );
}
