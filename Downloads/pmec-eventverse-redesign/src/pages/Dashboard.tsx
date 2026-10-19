import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { WheelSvg } from "@/components/Wheel";
import { splitDate } from "@/lib/format";
import { styleFor } from "@/lib/categories";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, Check } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", branch: "", year: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) { navigate("/login"); return; }
      setUser(s.user); setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setUser(session.user); setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load profile + registrations + upcoming count once we know the user
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
    supabase.from("registrations")
      .select("id, created_at, events(title, event_date, event_time, location, category, icon)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRegistrations(data ?? []));
    supabase.from("events").select("id", { count: "exact", head: true })
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .then(({ count }) => setUpcomingCount(count ?? 0));
  }, [user]);

  const openEdit = () => {
    setForm({
      full_name: profile?.full_name || user?.user_metadata?.full_name || "",
      branch: profile?.branch || user?.user_metadata?.branch || "",
      year: profile?.year || user?.user_metadata?.year || "",
      phone: profile?.phone || user?.user_metadata?.phone || "",
    });
    setEditOpen(true);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const row = { id: user.id, ...form };
    const { error } = await supabase.from("profiles").upsert(row);
    setSaving(false);
    if (error) { toast.error("Could not save profile: " + error.message); return; }
    setProfile(row);
    setEditOpen(false);
    toast.success("Profile updated!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-chalk flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <WheelSvg className="w-16 h-16 text-ink animate-spin" />
          <p className="font-display font-extrabold uppercase tracking-[0.2em] text-mute">Loading…</p>
        </div>
      </div>
    );
  }

  // Prefer the profiles table; fall back to sign-up metadata (e.g. Google users)
  const info = (f: string) => profile?.[f] || user?.user_metadata?.[f];
  const userName = info("full_name") || user?.user_metadata?.name || user?.email?.split("@")[0] || "Student";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const branch = info("branch");
  const year = info("year");
  const yearLabel = year ? (/^\d$/.test(String(year)) ? ["", "1st", "2nd", "3rd", "4th"][Number(year)] || year : year) : "";

  // Profile completion
  const fields = ["full_name", "branch", "year", "phone"];
  const filled = fields.filter(f => info(f)).length;
  const profilePct = Math.round((filled / fields.length) * 100);
  const fieldLabel = (f: string) => (f === "full_name" ? "Full name" : f.charAt(0).toUpperCase() + f.slice(1));

  return (
    <div className="min-h-screen bg-chalk">
      <Navbar />

      <header className="relative bg-ink text-chalk pt-[68px] overflow-hidden">
        <WheelSvg className="absolute -right-28 -bottom-40 w-[460px] h-[460px] text-chalk/10" />
        <div className="container relative py-12 flex flex-col md:flex-row md:items-center gap-6">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-24 h-24 border-2 border-haldi object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-24 h-24 bg-haldi text-ink border-2 border-chalk flex items-center justify-center font-display font-black text-6xl">
              {userName[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="eyebrow !text-haldi mb-1">Student dashboard</p>
            <h1 className="font-display font-black uppercase leading-[0.9] text-5xl sm:text-7xl break-words">{userName}</h1>
            <p className="text-chalk/70 mt-1 break-all">{user?.email}</p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {branch && <span className="bg-nila text-chalk border-2 border-chalk px-3 py-0.5 font-display font-extrabold uppercase tracking-[0.16em] text-sm">{branch}</span>}
              {yearLabel && <span className="bg-pata text-chalk border-2 border-chalk px-3 py-0.5 font-display font-extrabold uppercase tracking-[0.16em] text-sm">{yearLabel} year</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={openEdit} className="btn-haldi">Edit profile</button>
            <button onClick={handleLogout} className="btn-line !text-chalk !border-chalk hover:!bg-chalk hover:!text-ink"><LogOut size={18} /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* registrations */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <h2 className="font-display font-black uppercase text-4xl sm:text-5xl leading-none">My registrations</h2>
              <button onClick={() => navigate("/#events")} className="btn-ink !py-2 !px-4 !text-sm shrink-0">Browse events</button>
            </div>

            {registrations.length === 0 ? (
              <div className="panel p-10 text-center">
                <p className="font-display font-black uppercase text-4xl">No registrations yet</p>
                <p className="text-mute mt-2 mb-6">Pick an event and it will show up here.</p>
                <button onClick={() => navigate("/#events")} className="btn-pata">See what's on →</button>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map(r => {
                  const st = styleFor(r.events?.category ?? "");
                  const d = splitDate(r.events?.event_date ?? "");
                  return (
                    <div key={r.id} className="grid grid-cols-[88px_1fr] border-2 border-ink bg-paper shadow-block-sm">
                      <div className={`${st.bg} ${st.text} border-r-2 border-ink flex flex-col items-center justify-center py-3`}>
                        <p className="font-display font-black text-4xl leading-none">{d.day}</p>
                        <p className="font-display font-extrabold tracking-[0.18em] text-sm">{d.month}</p>
                      </div>
                      <div className="p-4 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-display font-black uppercase text-2xl sm:text-3xl leading-tight truncate">{r.events?.title}</p>
                          <span className="shrink-0 hidden sm:flex items-center gap-1 bg-tulsi text-chalk border-2 border-ink px-2 py-0.5 font-display font-extrabold uppercase tracking-[0.14em] text-xs"><Check size={13} /> Registered</span>
                        </div>
                        <p className="text-sm text-mute mt-1">{r.events?.event_time} · {r.events?.location}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* side column */}
          <aside className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-haldi border-2 border-ink shadow-block-sm p-4">
                <p className="font-display font-black text-6xl leading-none">{registrations.length}</p>
                <p className="font-display font-extrabold uppercase tracking-[0.14em] text-xs mt-1">Registered</p>
              </div>
              <div className="bg-nila text-chalk border-2 border-ink shadow-block-sm p-4">
                <p className="font-display font-black text-6xl leading-none">{upcomingCount}</p>
                <p className="font-display font-extrabold uppercase tracking-[0.14em] text-xs mt-1">Upcoming on campus</p>
              </div>
            </div>

            <div className="panel p-5">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-display font-black uppercase text-2xl">Profile</h3>
                <span className="font-display font-black text-3xl text-pata">{profilePct}%</span>
              </div>
              <div className="h-3 border-2 border-ink bg-paper mb-4"><div className="h-full bg-tulsi transition-all duration-700" style={{ width: `${profilePct}%` }} /></div>
              <ul className="space-y-2">
                {fields.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className={`w-5 h-5 border-2 border-ink flex items-center justify-center ${info(f) ? "bg-tulsi text-chalk" : "bg-paper"}`}>{info(f) && <Check size={13} />}</span>
                    <span className={info(f) ? "" : "text-mute"}>{fieldLabel(f)}</span>
                  </li>
                ))}
              </ul>
              {profilePct < 100 && <button onClick={openEdit} className="btn-line w-full mt-5 !py-2 !text-sm">Complete profile</button>}
            </div>
          </aside>
        </motion.div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md p-0 gap-0">
          <DialogHeader className="bg-ink text-chalk p-6 pr-14 text-left">
            <DialogTitle className="font-display font-black uppercase text-4xl leading-none text-chalk">Edit profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveProfile} className="p-6 space-y-4">
            {[
              { name: "full_name", label: "Full name", type: "text" },
              { name: "phone", label: "Phone", type: "tel" },
            ].map(f => (
              <div key={f.name}>
                <label className="label" htmlFor={`edit-${f.name}`}>{f.label}</label>
                <input id={`edit-${f.name}`} type={f.type} value={(form as any)[f.name]} required
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  className="field" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="edit-branch">Branch</label>
                <select id="edit-branch" value={form.branch} required onChange={e => setForm({ ...form, branch: e.target.value })} className="field">
                  <option value="">Select</option>
                  {["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="edit-year">Year</label>
                <select id="edit-year" value={form.year} required onChange={e => setForm({ ...form, year: e.target.value })} className="field">
                  <option value="">Select</option>
                  {["1st", "2nd", "3rd", "4th"].map(y => <option key={y} value={y}>{y} Year</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-pata w-full">
              {saving ? "Saving…" : "Save changes →"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
