import { test, expect } from "@playwright/test";
const slugs = [
  "job-profit-calculator",
  "contractor-break-even-calculator",
  "contractor-cash-flow-calculator",
  "labor-rate-calculator",
  "markup-vs-margin-calculator",
  "change-order-profit-calculator",
];
test("disabled integrations, local inputs and custom 404", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://localhost:4173"))
      external.push(request.url());
  });
  await page.goto("/tools/job-profit-calculator/");
  await page
    .getByLabel("Base contract revenue", { exact: true })
    .fill("1000000000000");
  await expect(page.getByTestId("primary-result")).toContainText(
    "$999,999,963,500.00",
  );
  expect(external).toEqual([]);
  const response = await page.goto("/page-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "didn’t make the estimate",
  );
});
test("all exported routes, metadata, inputs and reset", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const s of slugs) {
    await page.goto("/tools/" + s + "/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByTestId("primary-result")).toBeVisible();
    expect(await page.title()).toContain("Contractor Money Lab");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    const input = page.locator("input").first(),
      before = await page.getByTestId("primary-result").textContent();
    await input.fill("100000");
    await expect(page.getByTestId("primary-result")).not.toHaveText(before!);
    await page.getByRole("button", { name: "Reset to example" }).click();
    await expect(page.getByTestId("primary-result")).toHaveText(before!);
  }
  for (const path of [
    "/",
    "/tools/",
    "/about/",
    "/methodology/",
    "/privacy-policy/",
    "/terms/",
    "/contact/",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("mobile navigation and input validation", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Calculators", exact: true })
    .click();
  await expect(page).toHaveURL(/\/tools\//);
  await page.goto("/tools/job-profit-calculator/");
  await page.getByLabel("Materials", { exact: true }).fill("-1");
  await expect(page.getByText("Enter zero or a positive value.")).toBeVisible();
  await expect(page.getByTestId("primary-result")).toHaveCount(0);
});
test("no horizontal overflow at all required widths", async ({ page }) => {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/tools/",
      ...slugs.map((s) => "/tools/" + s + "/"),
    ]) {
      await page.goto(path);
      if (path.includes("cash-flow"))
        await expect(page.locator(".recharts-surface")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
    }
  }
});
test("cash horizon, margin mode and internal links", async ({ page }) => {
  await page.goto("/tools/contractor-cash-flow-calculator/");
  await page.getByLabel("Forecast length").selectOption("12");
  await expect(
    page.getByLabel("Month 12 invoices", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(12);
  await page.goto("/tools/markup-vs-margin-calculator/");
  await page.getByRole("tab", { name: "Profit margin", exact: true }).click();
  await expect(page.getByTestId("primary-result")).toHaveText("$13,333.33");
  await page.getByLabel("Desired percentage").fill("100");
  await expect(page.getByText("Margin must be less than 100%.")).toBeVisible();
  await page.goto("/");
  const urls = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(links.map((l) => l.getAttribute("href")!)),
    ]);
  for (const url of urls) {
    const r = await page.request.get(url);
    expect(r.status(), url).toBe(200);
  }
});
test("capture visual QA screenshots", async ({ page }) => {
  for (const [name, width] of [
    ["mobile", 375],
    ["tablet", 768],
    ["desktop", 1440],
  ] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.screenshot({ path: `qa/home-${name}.png`, fullPage: true });
    await page.goto("/tools/job-profit-calculator/");
    await page.screenshot({
      path: `qa/calculator-${name}.png`,
      fullPage: true,
    });
  }
});
