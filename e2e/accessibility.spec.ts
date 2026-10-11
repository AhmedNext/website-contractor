import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
test("WCAG 2 AA automated checks on homepage and six tools", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/tools/job-profit-calculator/",
    "/tools/contractor-break-even-calculator/",
    "/tools/contractor-cash-flow-calculator/",
    "/tools/labor-rate-calculator/",
    "/tools/markup-vs-margin-calculator/",
    "/tools/change-order-profit-calculator/",
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      path,
    ).toEqual([]);
  }
});
