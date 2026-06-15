import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message, err.stack));
page.on("response", (res) => {
  if (res.status() >= 400) console.log("HTTP ERR:", res.status(), res.url());
});

await page.goto("http://localhost:3000", { waitUntil: "load" });
await page.waitForTimeout(4000);

const result = await page.evaluate(() => {
  const pill = document.querySelector("form.fixed.bottom-6");
  if (!pill) return "no pill";
  return pill.outerHTML;
});
console.log("RESULT:", result);

await browser.close();
