import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { WheelSvg } from "./Wheel";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  points?: string[];
  children: ReactNode;
}

/** Two-panel layout used by every auth page: navy poster on the left, paper form on the right. */
export const AuthShell = ({ eyebrow, title, subtitle, points = [], children }: AuthShellProps) => (
  <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-chalk">
    <aside className="relative hidden lg:flex flex-col justify-between bg-ink text-chalk p-14 overflow-hidden">
      <WheelSvg className="absolute -right-40 -bottom-40 w-[620px] h-[620px] text-chalk/10 animate-[spin_120s_linear_infinite]" />
      <Link to="/" className="relative flex items-center gap-4 w-fit">
        <span className="w-14 h-14 rounded-full bg-paper border-2 border-haldi overflow-hidden flex items-center justify-center">
          <img src="/brand/pmec-logo.jpg" alt="PMEC logo" className="w-[120%] max-w-none" />
        </span>
        <span className="font-display font-black text-2xl uppercase tracking-wide leading-none">
          PMEC<br /><span className="text-haldi">EventVerse</span>
        </span>
      </Link>

      <div className="relative">
        <p className="odia text-haldi text-2xl mb-3">ସ୍ୱାଗତ</p>
        <h2 className="font-display font-black uppercase text-7xl leading-[0.9] mb-6">{eyebrow}</h2>
        <p className="max-w-sm text-chalk/80 leading-relaxed">
          One account for every event, club and registration at Parala Maharaja Engineering College.
        </p>
        {points.length > 0 && (
          <ul className="mt-8 space-y-3">
            {points.map(p => (
              <li key={p} className="flex items-center gap-3 font-display font-extrabold uppercase tracking-[0.12em] text-lg">
                <span className="w-3 h-3 bg-haldi rotate-45 shrink-0" />{p}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="relative text-sm text-chalk/60 tracking-wide">Berhampur, Odisha · Est. 2009</p>
    </aside>

    <main className="relative flex items-center justify-center px-5 py-10 sm:px-10 paper-grain">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Link to="/" className="lg:hidden flex items-center gap-3 mb-6 w-fit">
          <span className="w-11 h-11 rounded-full bg-paper border-2 border-ink overflow-hidden flex items-center justify-center">
            <img src="/brand/pmec-logo.jpg" alt="PMEC logo" className="w-[120%] max-w-none" />
          </span>
          <span className="font-display font-black text-xl uppercase leading-none">PMEC <span className="text-pata">EventVerse</span></span>
        </Link>
        <div className="panel p-6 sm:p-8">
          <h1 className="font-display font-black uppercase text-4xl leading-none">{title}</h1>
          {subtitle && <p className="text-mute mt-2 mb-6 text-sm">{subtitle}</p>}
          {children}
        </div>
        <Link to="/" className="block text-center mt-6 text-sm font-display font-extrabold uppercase tracking-[0.18em] text-ink/70 hover:text-pata">← Back to home</Link>
      </motion.div>
    </main>
  </div>
);
