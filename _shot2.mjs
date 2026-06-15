import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });

page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));
page.on("requestfailed", (req) => console.log("REQFAIL:", req.url(), req.failure()?.errorText));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const pill = await page.locator("form.fixed.bottom-6").first();
const box = await pill.boundingBox();
console.log("pill box:", box);

await page.screenshot({ path: "_pill-full.png", clip: { x: box.x - 20, y: box.y - 20, width: box.width + 40, height: box.height + 40 } });

await browser.close();
