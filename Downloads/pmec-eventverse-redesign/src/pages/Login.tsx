import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { GoogleG } from "@/components/GoogleG";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); }
    else { toast.success("Welcome back!"); navigate("/dashboard"); }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);   // on success the browser redirects to Google
  };

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Log in to register for events and see your dashboard."
      points={["Register in one tap", "Live seat counts", "Your events, one place"]}
    >
      <button onClick={handleGoogleLogin} type="button" className="btn-line w-full !normal-case !tracking-normal !font-sans !font-semibold !text-sm gap-3">
        <GoogleG /> Continue with Google
      </button>

      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-0.5 bg-ink/15" />
        <span className="font-display font-extrabold uppercase tracking-[0.2em] text-xs text-mute">or email</span>
        <span className="flex-1 h-0.5 bg-ink/15" />
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="field" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="field pr-11" placeholder="Your password" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-sm font-semibold text-nila underline underline-offset-4 hover:text-pata">Forgot password?</Link>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-ink w-full">
          {loading ? "Signing in…" : "Sign in →"}
        </button>
      </form>

      <p className="text-center text-sm mt-6 text-mute">
        New here?{" "}
        <Link to="/register" className="font-semibold text-nila underline underline-offset-4 hover:text-pata">Create an account</Link>
      </p>
    </AuthShell>
  );
};

export default Login;
