const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// "2026-11-14" -> { day: "14", month: "NOV", year: "2026" }
export function splitDate(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return { day: "--", month: "---", year: "" };
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS[d.getMonth()], year: String(d.getFullYear()) };
}

export function daysUntil(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}
