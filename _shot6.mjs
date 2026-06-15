import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

const bodyHTML = await page.evaluate(() => document.body.innerHTML.length);
console.log("body length:", bodyHTML);

const title = await page.title();
console.log("title:", title);

await page.screenshot({ path: "_full.png", fullPage: false });

await browser.close();
