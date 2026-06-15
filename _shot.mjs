import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 500, height: 400 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Scroll to bottom to find the pill
await page.waitForTimeout(1500);

const pill = await page.locator("form.fixed.bottom-6").first();
await pill.screenshot({ path: "_pill-closed.png", scale: "css" });

await browser.close();
