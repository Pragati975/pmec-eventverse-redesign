import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

// Each tile is a close-up of the campus photo (/public/brand/campus.jpg).
// To use your own event photos, put them in /public/gallery and give each tile a `src` instead.
const tiles = [
  { title: "The Flag",        note: "Above the main block",  pos: "50% 14%", zoom: 320, span: "sm:col-span-2 sm:row-span-2", tone: "bg-nila" },
  { title: "East Wing",       note: "Blue façade",           pos: "6% 42%",  zoom: 300, span: "", tone: "bg-haldi" },
  { title: "Entrance Walk",   note: "Where every fest begins", pos: "50% 96%", zoom: 280, span: "", tone: "bg-pata" },
  { title: "Main Block",      note: "Classrooms and labs",   pos: "50% 46%", zoom: 230, span: "sm:col-span-2", tone: "bg-tulsi" },
  { title: "West Wing",       note: "Blue façade",           pos: "94% 42%", zoom: 300, span: "", tone: "bg-pata" },
  { title: "Gardens",         note: "Lawns by the walkway",  pos: "88% 92%", zoom: 280, span: "", tone: "bg-nila" },
];

type Tile = (typeof tiles)[0];

const Crop = ({ t, className = "" }: { t: Tile; className?: string }) => (
  <div
    role="img"
    aria-label={`${t.title}: ${t.note}`}
    className={`bg-ink bg-no-repeat ${className}`}
    style={{ backgroundImage: "url(/brand/campus.jpg)", backgroundSize: `${t.zoom}%`, backgroundPosition: t.pos }}
  />
);

export const GallerySection = () => {
  const [selected, setSelected] = useState<Tile | null>(null);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-chalk">
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end mb-12">
          <div>
            <p className="eyebrow mb-2">Around campus</p>
            <h2 className="font-display font-black uppercase leading-[0.86] text-[20vw] sm:text-8xl lg:text-9xl">Gallery</h2>
          </div>
          <p className="max-w-sm text-ink/75 leading-relaxed">
            A walk through the PMEC campus, Berhampur. Event photos will join these as the fests happen.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[170px] sm:auto-rows-[210px] gap-3 sm:gap-4">
          {tiles.map((t, i) => (
            <motion.button
              key={t.title}
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(t)}
              className={`group relative border-2 border-ink shadow-block-sm overflow-hidden text-left ${t.span} ${i === 0 || i === 3 ? "col-span-2" : ""}`}
            >
              <Crop t={t} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
              <span className={`absolute left-0 bottom-0 ${t.tone} ${t.tone === "bg-haldi" ? "text-ink" : "text-chalk"} border-t-2 border-r-2 border-ink px-3 py-1.5`}>
                <span className="block font-display font-black uppercase text-xl leading-none">{t.title}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          role="dialog" aria-modal="true" aria-label={selected.title}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-4xl border-2 border-chalk bg-paper"
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute right-3 top-3 z-10 bg-ink text-chalk border-2 border-chalk p-1" onClick={() => setSelected(null)} aria-label="Close"><X size={22} /></button>
            <Crop t={{ ...selected, zoom: Math.max(100, selected.zoom * 0.6) }} className="w-full aspect-[16/10]" />
            <div className="p-4 border-t-2 border-ink">
              <h4 className="font-display font-black uppercase text-3xl leading-none">{selected.title}</h4>
              <p className="text-mute mt-1">{selected.note}</p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
