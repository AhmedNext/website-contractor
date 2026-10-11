import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { meta, siteUrl } from "@/lib/seo";
import "./globals.css";
export const metadata: Metadata = {
  ...meta(
    "Contractor Money Lab | Know Your Numbers Before You Bid",
    "Free financial calculators for U.S. contractors: job profit, cash flow, break-even, labor rates, markup and change orders.",
  ),
  title: {
    default: "Contractor Money Lab | Know Your Numbers Before You Bid",
    template: "%s | Contractor Money Lab",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {siteUrl && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": siteUrl + "/#organization",
                    name: "Contractor Money Lab",
                    url: siteUrl,
                  },
                  {
                    "@type": "WebSite",
                    name: "Contractor Money Lab",
                    url: siteUrl,
                    publisher: { "@id": siteUrl + "/#organization" },
                  },
                ],
              }).replace(/</g, "\\u003c"),
            }}
          />
        )}
        <TooltipProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <footer className="footer">
            <div className="container footer-grid">
              <div>
                <strong>
                  CONTRACTOR MONEY LAB<span className="orange">.</span>
                </strong>
                <p>Know your numbers before you bid.</p>
                <small>
                  Free tools. Clear assumptions. Better-informed decisions.
                </small>
              </div>
              <div className="footer-links">
                {[
                  ["Calculators", "/tools"],
                  ["Methodology", "/methodology"],
                  ["About", "/about"],
                  ["Contact", "/contact"],
                  ["Privacy policy", "/privacy-policy"],
                  ["Terms of use", "/terms"],
                ].map(([label, path]) => (
                  <Link key={path} href={path}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="container footer-bottom">
              © {new Date().getFullYear()} Contractor Money Lab. Educational
              estimates, not accounting or tax advice.
            </div>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
