import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 10);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    if (pathname !== "/") { navigate(`/#${id}`); return; }   // go home, Index scrolls to the section
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = async () => { setIsMobileMenuOpen(false); await supabase.auth.signOut(); navigate("/"); };

  const navLinks = [
    { label: "Events",  action: () => scrollTo("events") },
    { label: "Clubs",   action: () => scrollTo("clubs") },
    { label: "Gallery", action: () => scrollTo("gallery") },
    { label: "About",   action: () => { setIsMobileMenuOpen(false); navigate("/about"); } },
    { label: "Contact", action: () => scrollTo("contact") },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${isScrolled || isMobileMenuOpen || pathname !== "/" ? "bg-chalk border-b-2 border-ink" : "bg-transparent"}`}>
      <div className="container">
        <div className="flex items-center justify-between h-[68px]">
          <Link to="/" className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-paper border-2 border-ink overflow-hidden flex items-center justify-center shrink-0">
              <img src="/brand/pmec-logo.jpg" alt="PMEC logo" className="w-[120%] max-w-none" />
            </span>
            <span className="font-display font-black text-2xl uppercase leading-none tracking-wide text-ink">
              PMEC <span className="text-pata">EventVerse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={link.action}
                className="px-3.5 py-2 font-display font-extrabold uppercase tracking-[0.16em] text-[15px] text-ink hover:text-pata relative group"
              >
                {link.label}
                <span className="absolute left-3.5 right-3.5 bottom-1 h-[3px] bg-haldi scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-line !py-2 !px-4 !text-sm">Dashboard</Link>
                <button onClick={handleLogout} className="btn-ink !py-2 !px-4 !text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-line !py-2 !px-4 !text-sm">Login</Link>
                <Link to="/register" className="btn-pata !py-2 !px-4 !text-sm">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 border-2 border-ink bg-paper" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-chalk border-b-2 border-ink"
          >
            <div className="container py-4">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="block w-full text-left py-3 border-b-2 border-ink/10 font-display font-black uppercase text-3xl tracking-wide text-ink"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-5 pb-2 grid grid-cols-2 gap-3">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="btn-line">Dashboard</Link>
                    <button onClick={handleLogout} className="btn-ink">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-line">Login</Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-pata">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
