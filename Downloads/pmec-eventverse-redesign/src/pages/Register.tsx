import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { GoogleG } from "@/components/GoogleG";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", branch: "", year: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email, password: formData.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: formData.name, branch: formData.branch, year: formData.year, phone: formData.phone },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); }
    else { toast.success("Account created! Check your email to verify."); navigate("/login"); }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);   // on success the browser redirects to Google
  };

  return (
    <AuthShell
      eyebrow="Join in"
      title="Create account"
      subtitle="Takes a minute. Then you can register for any event."
      points={["Register in one tap", "Live seat counts", "Your events, one place"]}
    >
      <button onClick={handleGoogleSignup} type="button" className="btn-line w-full !normal-case !tracking-normal !font-sans !font-semibold !text-sm gap-3">
        <GoogleG /> Sign up with Google
      </button>

      <div className="flex items-center gap-3 my-5">
        <span className="flex-1 h-0.5 bg-ink/15" />
        <span className="font-display font-extrabold uppercase tracking-[0.2em] text-xs text-mute">or email</span>
        <span className="flex-1 h-0.5 bg-ink/15" />
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="field" placeholder="Your full name" required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="field" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="field pr-11" placeholder="At least 6 characters" required minLength={6} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="branch">Branch</label>
            <select id="branch" name="branch" value={formData.branch} onChange={handleChange} className="field" required>
              <option value="">Select</option>
              {["CSE","ECE","EEE","MECH","CIVIL","IT"].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="year">Year</label>
            <select id="year" name="year" value={formData.year} onChange={handleChange} className="field" required>
              <option value="">Select</option>
              {["1","2","3","4"].map(y => <option key={y} value={y}>{y === "1" ? "1st" : y === "2" ? "2nd" : y === "3" ? "3rd" : "4th"} Year</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="field" placeholder="10-digit mobile number" required />
        </div>
        <button type="submit" disabled={loading} className="btn-pata w-full">
          {loading ? "Creating account…" : "Create account →"}
        </button>
      </form>

      <p className="text-center text-sm mt-6 text-mute">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-nila underline underline-offset-4 hover:text-pata">Sign in</Link>
      </p>
    </AuthShell>
  );
};

export default Register;
