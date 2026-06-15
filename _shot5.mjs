import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// Check for any element matching the dynamic-imported component placeholder
const html = await page.evaluate(() => {
  const forms = document.querySelectorAll("form");
  return Array.from(forms).map(f => f.outerHTML.slice(0, 2000));
});
console.log(JSON.stringify(html, null, 2));

await browser.close();
