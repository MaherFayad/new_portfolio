// Tells Bing (and the other IndexNow engines) that the site changed, so their index, which
// also feeds ChatGPT search and Copilot, refreshes within hours instead of on the next crawl.
// Run after a production deploy is live:  npm run indexnow
import { readdirSync, readFileSync } from "node:fs";

const HOST = "maherfayad.com";
const key = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.replace(".txt", "");
if (!key) throw new Error("No IndexNow key file in /public");

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (readFileSync(`public/${key}.txt`, "utf8").trim() !== key) throw new Error("Key file content does not match its name");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
