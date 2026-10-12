import { practicalExamples } from "@/content/practical-examples";

export function PracticalExample({ slug }: { slug: string }) {
  const example = practicalExamples[slug];
  if (!example) return null;
  return <section className="practical-example no-print" aria-labelledby={`practical-${slug}`}>
    <span className="eyebrow">A JOBSITE DECISION, WORKED THROUGH</span>
    <h3 id={`practical-${slug}`}>{example.title}</h3>
    <p className="example-disclosure">Hypothetical worked example · prices are assumptions, not a market survey</p>
    <p>{example.setup}</p>
    <div className="table-scroll" tabIndex={0} role="region" aria-label={example.title}><table>
      <caption>Compare the scenarios</caption><thead><tr><th scope="col">Scenario</th><th scope="col">Result</th><th scope="col">What it means</th></tr></thead>
      <tbody>{example.rows.map(([scenario, result, meaning]) => <tr key={scenario}><th scope="row">{scenario}</th><td>{result}</td><td>{meaning}</td></tr>)}</tbody>
    </table></div>
    <p><strong>Use the result:</strong> {example.decision}</p>
    <p><strong>Before committing:</strong> {example.verify}</p>
    {example.source && <p className="guide-source">Reference: <a href={example.source.href}>{example.source.label}</a>.</p>}
  </section>;
}
