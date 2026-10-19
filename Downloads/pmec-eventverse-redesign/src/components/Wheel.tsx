import { motion, useScroll, useTransform } from "framer-motion";

/** Konark-style chakra drawn in SVG. Uses currentColor. */
export const WheelSvg = ({ className = "" }: { className?: string }) => {
  const spokes = Array.from({ length: 8 }, (_, i) => i * 45);
  const fine = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  const beads = Array.from({ length: 48 }, (_, i) => (i * 360) / 48);
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="100" cy="100" r="97" strokeWidth="4" />
      <circle cx="100" cy="100" r="80" strokeWidth="2" />
      {beads.map(a => (
        <circle key={a} cx="100" cy="11" r="2.1" fill="currentColor" stroke="none" transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="30" strokeWidth="3" />
      <circle cx="100" cy="100" r="12" strokeWidth="3" fill="currentColor" />
      {spokes.map(a => (
        <g key={a} transform={`rotate(${a} 100 100)`}>
          <line x1="100" y1="88" x2="100" y2="20" strokeWidth="6" />
          <circle cx="100" cy="52" r="8" strokeWidth="3" />
          <circle cx="100" cy="52" r="2.5" fill="currentColor" stroke="none" />
          <path d="M92 20 Q100 8 108 20" strokeWidth="2.5" />
        </g>
      ))}
      {fine.map(a => (
        <line key={a} x1="100" y1="70" x2="100" y2="22" strokeWidth="2" transform={`rotate(${a} 100 100)`} />
      ))}
    </svg>
  );
};

/** The wheel turns as the page scrolls. */
export const ScrollWheel = ({ className = "", speed = 0.25 }: { className?: string; speed?: number }) => {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, v => v * speed);
  return (
    <div className={className}>
      <motion.div style={{ rotate }} className="w-full h-full">
        <WheelSvg className="w-full h-full" />
      </motion.div>
    </div>
  );
};
