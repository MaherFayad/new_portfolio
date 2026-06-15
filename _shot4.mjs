import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });

page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));
page.on("response", (res) => {
  const url = res.url();
  if (url.includes("lottie") || url.includes("wasm") || url.includes("dotlottie")) {
    console.log("RESPONSE:", res.status(), url);
  }
});
page.on("requestfailed", (req) => console.log("REQFAIL:", req.url(), req.failure()?.errorText));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

const el = await page.locator("form.fixed.bottom-6 canvas").count();
console.log("canvas count:", el);

await browser.close();
