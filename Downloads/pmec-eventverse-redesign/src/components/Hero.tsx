import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScrollWheel } from "./Wheel";

const TICKER = ["Technical", "Cultural", "Sports", "Workshops", "Hackathons", "Dance", "Quiz", "Robotics"];

const FACTS = [
  { k: "Est.", v: "2009" },
  { k: "Home", v: "Berhampur, Odisha" },
  { k: "Clubs", v: "6 on campus" },
  { k: "Affiliation", v: "BPUT" },
];

export const Hero = () => {
  const scrollToEvents = () => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <section className="relative bg-chalk paper-grain overflow-hidden pt-[68px]">
        {/* the wheel, half hidden behind the photo, turns as you scroll */}
        <ScrollWheel className="absolute right-[-180px] top-10 w-[640px] h-[640px] text-ink/[0.09] hidden md:block" />

        <div className="container relative grid lg:grid-cols-[1.25fr_1fr] gap-10 items-center py-12 lg:py-20 min-h-[calc(100vh-68px-64px)]">
          <div>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
              <span className="odia text-2xl text-pata">ଉତ୍ସବ</span>
              <span className="w-10 h-0.5 bg-ink" />
              <span className="eyebrow !text-ink">Parala Maharaja Engineering College</span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="font-display font-black uppercase leading-[0.84] tracking-[0.01em] text-[17vw] sm:text-[15vw] lg:text-[9.5rem] text-ink"
            >
              PMEC<br />
              <span className="relative inline-block isolate">
                Event<span className="text-pata">Verse</span>
                <span className="absolute left-0 -bottom-1 w-full h-3 bg-haldi -z-10" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed text-ink/85"
            >
              Every fest, contest and workshop at PMEC in one place. See what's coming, check the seats left, and register in a few taps.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <button onClick={scrollToEvents} className="btn-ink">Browse events ↓</button>
              <Link to="/register" className="btn-line">Create account</Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative border-2 border-ink shadow-block-lg bg-ink rounded-t-[999px] overflow-hidden aspect-[4/5]">
              <img src="/brand/campus.jpg" alt="PMEC campus main building" className="absolute inset-0 w-full h-full object-cover object-[50%_60%]" />
            </div>
            <div className="absolute -left-3 bottom-8 sm:-left-6 bg-haldi border-2 border-ink shadow-block-sm px-4 py-2 rotate-[-4deg]">
              <p className="font-display font-black uppercase text-2xl leading-none">Berhampur</p>
              <p className="font-display font-extrabold uppercase tracking-[0.2em] text-xs">Odisha · 761003</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ticker */}
      <div className="bg-ink text-chalk border-y-2 border-ink overflow-hidden" aria-hidden="true">
        <div className="flex w-max animate-[marquee_32s_linear_infinite] py-3">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center font-display font-black uppercase text-2xl tracking-[0.12em] whitespace-nowrap">
              <span className="px-6">{t}</span>
              <span className="text-haldi">✺</span>
            </span>
          ))}
        </div>
      </div>

      <div className="bg-paper border-b-2 border-ink">
        <div className="container grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-ink/15">
          {FACTS.map(f => (
            <div key={f.k} className="py-5 px-4 first:pl-0">
              <p className="font-display font-extrabold uppercase tracking-[0.2em] text-xs text-pata">{f.k}</p>
              <p className="font-display font-black uppercase text-2xl sm:text-3xl leading-tight">{f.v}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
