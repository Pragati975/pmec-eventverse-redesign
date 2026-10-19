// Category -> colour classes. Class names are written out in full so Tailwind can see them.
export const CATEGORY_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  Technical: { bg: "bg-nila",  text: "text-chalk", dot: "bg-nila" },
  Cultural:  { bg: "bg-pata",  text: "text-chalk", dot: "bg-pata" },
  Sports:    { bg: "bg-tulsi", text: "text-chalk", dot: "bg-tulsi" },
  Workshop:  { bg: "bg-haldi", text: "text-ink",   dot: "bg-haldi" },
};
export const FALLBACK_STYLE = { bg: "bg-ink", text: "text-chalk", dot: "bg-ink" };
export const styleFor = (category: string) => CATEGORY_STYLE[category] ?? FALLBACK_STYLE;
