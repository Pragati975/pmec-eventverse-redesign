import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WheelSvg } from "./Wheel";

const quickLinks = [
  { label: "Events",  href: "/#events" },
  { label: "Clubs",   href: "/#clubs" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/#contact" },
];

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.from("subscribers").insert({ email });
    if (error && error.code !== "23505") { toast.error("Could not subscribe. Please try again."); return; }
    toast.success(error ? "You're already subscribed!" : "Subscribed! You'll get event updates.");
    setEmail("");
  };

  return (
    <footer className="relative bg-ink text-chalk overflow-hidden border-t-2 border-ink">
      <WheelSvg className="absolute -right-24 -top-24 w-80 h-80 text-chalk/[0.07]" />
      <div className="container relative pt-16 pb-8">
        <div className="grid md:grid-cols-[1.3fr_0.7fr_1fr] gap-12 mb-14">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5 w-fit">
              <span className="w-12 h-12 rounded-full bg-paper border-2 border-haldi overflow-hidden flex items-center justify-center">
                <img src="/brand/pmec-logo.jpg" alt="PMEC logo" className="w-[120%] max-w-none" />
              </span>
              <span className="font-display font-black text-3xl uppercase leading-none">PMEC <span className="text-haldi">EventVerse</span></span>
            </Link>
            <p className="text-chalk/75 max-w-sm leading-relaxed">
              Events, clubs and registrations for Parala Maharaja Engineering College, Berhampur, Odisha.
            </p>
            <p className="mt-4 text-sm text-chalk/75">pmecbam@gmail.com</p>
          </div>

          <div>
            <h4 className="font-display font-extrabold uppercase tracking-[0.2em] text-sm text-haldi mb-4">Explore</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="font-display font-black uppercase text-2xl tracking-wide hover:text-haldi transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-extrabold uppercase tracking-[0.2em] text-sm text-haldi mb-4">Event updates</h4>
            <p className="text-chalk/75 mb-4">Drop your email and hear about new events first.</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email for event updates"
                className="flex-1 min-w-0 px-4 py-3 bg-chalk text-ink border-2 border-chalk placeholder:text-mute/70 focus:outline-none focus:border-haldi"
              />
              <button type="submit" className="px-5 bg-haldi text-ink border-2 border-haldi font-display font-black uppercase tracking-[0.14em] hover:bg-chalk hover:border-chalk transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t-2 border-chalk/15 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-sm text-chalk/60">
          <p>&copy; {new Date().getFullYear()} PMEC EventVerse · Built by a PMEC student</p>
          <p className="odia">ଧନ୍ୟବାଦ</p>
        </div>
      </div>
    </footer>
  );
};
