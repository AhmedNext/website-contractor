import { chromium } from "@playwright/test";
import { writeFile, readFile } from "node:fs/promises";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(await readFile("public/social.svg", "utf8"));
await page.locator("svg").screenshot({ path: "public/social.png" });
const measurements = [];
for (const route of [
  "/",
  "/tools/job-profit-calculator/",
  "/tools/contractor-cash-flow-calculator/",
]) {
  await page.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0, events: [] };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__metrics.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        if (!e.hadRecentInput) window.__metrics.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__metrics.events.push(e.duration);
    }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  });
  await page.goto("http://localhost:4173" + route);
  await page.waitForLoadState("networkidle");
  if (route.includes("tools")) {
    await page.locator("input").first().fill("75000");
    await page.locator("input").first().press("Tab");
  }
  const result = await page.evaluate(() => ({
    ...window.__metrics,
    fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
    resourceBytes: performance
      .getEntriesByType("resource")
      .reduce((sum, r) => sum + r.transferSize, 0),
  }));
  measurements.push({ route, ...result });
}
await writeFile(
  "qa/local-performance.json",
  JSON.stringify(
    {
      conditions:
        "Unthrottled local Chromium, 1200px viewport. Not field Core Web Vitals. Event timings are a limited lab interaction sample, not a field INP score.",
      measurements,
    },
    null,
    2,
  ),
);
await browser.close();
