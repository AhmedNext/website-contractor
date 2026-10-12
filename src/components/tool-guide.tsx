import Link from "next/link";
import type { Tool } from "@/content/tools";
import type { ToolGuide } from "@/content/tool-guides";
import { PracticalExample } from "@/components/practical-example";

export function ToolGuideContent({ tool, guide, template = false, introduction, privacy, exampleSlug }: { tool: Tool; guide: ToolGuide; template?: boolean; introduction?: string; privacy?: string; exampleSlug?: string }) {
  return (
    <section className="editorial guide-layout no-print" aria-labelledby="guide-title">
      <article className="guide-body">
        <span className="eyebrow">WORK THROUGH YOUR ESTIMATE</span>
        <h2 id="guide-title">{guide.title}</h2>
        <p>{introduction ?? (template ? "Use this free remodeling change-order template to document added work, calculate its proposed price and print a customer copy. It shares the change-order builder's single saved browser draft." : `${tool.audience} Replace the hypothetical inputs with your own costs and contract figures. Results update as you type; use the chart and pinned comparison to examine a revised estimate.`)}</p>
        <h3>Formula and worked example</h3>
        <p className="formula-box">{template ? "Proposed change price = added cost ÷ (1 − target margin ÷ 100)." : tool.formula}</p>
        <p>{tool.example}</p>
        <PracticalExample slug={exampleSlug ?? tool.slug} />
        {guide.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h3 id={section.id}>{section.title}</h3>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.source && <p className="guide-source">Source: <a href={section.source.href}>{section.source.label}</a>.</p>}
          </section>
        ))}
        {guide.table && <div className="table-scroll guide-table" tabIndex={0} role="region" aria-label={guide.table.caption}>
          <table>
            <caption>{guide.table.caption}</caption>
            <thead><tr>{guide.table.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
            <tbody>{guide.table.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>}
        <section className="guide-faq" aria-labelledby="common-questions">
          <h3 id="common-questions">Frequently asked questions</h3>
          {guide.faqs.map((faq) => <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}{faq.source && <> Source: <a href={faq.source.href}>{faq.source.label}</a>.</>}</p>
          </details>)}
        </section>
      </article>
      <aside>
        <nav aria-label="On this page">
          <h3>In this guide</h3>
          <ol>{guide.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}<li><a href="#common-questions">Frequently asked questions</a></li></ol>
        </nav>
        <h3>Assumptions & limitations</h3>
        <p>{template ? "This template records the details you supply. It does not send documents, verify authorization, collect a signature or determine contract compliance. Follow your actual agreement's approval process." : tool.limitations}</p>
        <p>{privacy ?? (template ? "One draft is saved locally in this browser. Download a backup before replacing it. Other devices and domains have separate storage." : "Inputs and pinned estimates stay in page memory and clear on reload. Dollar amounts are rounded only for display. Undefined ratios appear as unavailable.")}</p>
        <Link className="text-link" href="/methodology/">Formulas and methodology →</Link>
        <h3>Keep the estimate useful</h3>
        <p>All examples are hypothetical. Compare the result with actual costs, capacity and collection timing before making a business decision.</p>
        <Link className="text-link" href="/tools/job-cost-tracker/">Track estimated vs. actual costs →</Link>
        {!template && <Link className="text-link" href="/tools/change-order-builder/">Build a printable change order →</Link>}
      </aside>
    </section>
  );
}
