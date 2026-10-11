import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container section">
      <span className="eyebrow">404 / PAGE NOT FOUND</span>
      <h1>This page didn’t make the estimate.</h1>
      <p className="intro">
        Head back to the toolbox to find the calculator you need.
      </p>
      <Link className="button-link" href="/tools">
        Explore calculators →
      </Link>
    </div>
  );
}
