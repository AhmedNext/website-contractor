import type { Metadata } from "next";
const configured = (
  process.env.SITE_URL || "https://contractormoneylab.website"
).replace(/\/$/, "");
export const siteUrl =
  configured && /^https?:\/\//.test(configured) ? configured : undefined;
export function meta(title: string, description: string, path = ""): Metadata {
  return {
    title,
    description,
    ...(siteUrl
      ? {
          metadataBase: new URL(siteUrl),
          alternates: { canonical: siteUrl + path },
        }
      : {}),
    openGraph: {
      title,
      description,
      type: "website",
      ...(siteUrl
        ? {
            url: siteUrl + path,
            images: [
              {
                url: siteUrl + "/social.png",
                width: 1200,
                height: 630,
                alt: "Contractor Money Lab — Know Your Numbers Before You Bid.",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(siteUrl ? { images: [siteUrl + "/social.png"] } : {}),
    },
  };
}
