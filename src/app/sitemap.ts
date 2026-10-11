import type { MetadataRoute } from "next";
import { tools } from "@/content/tools";
import { pages } from "@/content/pages";
import { siteUrl } from "@/lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return siteUrl
    ? [
        "/",
        "/tools/",
        "/tools/job-cost-tracker/",
        "/tools/change-order-builder/",
        ...Object.keys(pages).map((p) => "/" + p + "/"),
        ...tools.map((t) => "/tools/" + t.slug + "/"),
      ].map((p) => ({ url: siteUrl + p }))
    : [];
}
