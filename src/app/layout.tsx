import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Header } from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { meta, siteUrl } from "@/lib/seo";
import "./globals.css";
const geist = localFont({
  src: "./fonts/Geist.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});
export const metadata: Metadata = {
  ...meta(
    "Construction Calculators & Estimates | Contractor Money Lab",
    "Free visual construction calculators for concrete, roofing, framing and more. Price jobs, forecast cash flow and print private estimates without signing up.",
  ),
  title: {
    default: "Construction Calculators & Estimates | Contractor Money Lab",
    template: "%s | Contractor Money Lab",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
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
          <div className="pdf-branding-footer">
            Generated with ContractorMoneyLab.website — Free Estimating &amp; Job Costing Tools for Trade Pros
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
