// 样张共用脚本：只做时钟与年份，不引入任何第三方依赖。
const pad = (n) => String(n).padStart(2, "0");

function paintClock() {
  const clock = document.querySelector("[data-clock]");
  if (!clock) return;
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? "00";
  clock.textContent = `[ ${get("hour")}:${get("minute")} ]`;
  clock.setAttribute("datetime", now.toISOString());
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = "\u00A92026";

paintClock();
setInterval(paintClock, 30_000);
