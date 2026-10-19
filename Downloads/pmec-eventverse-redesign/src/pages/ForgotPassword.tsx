import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("Password reset email sent!");
  };

  return (
    <AuthShell eyebrow="Reset" title="Forgot password" subtitle="Enter your email and we'll send you a reset link.">
      {sent ? (
        <div className="border-2 border-ink bg-haldi/40 p-4 text-sm leading-relaxed">
          Check your email for the reset link. If you don't see it, look in spam.
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" required />
          </div>
          <button type="submit" disabled={loading} className="btn-ink w-full">
            {loading ? "Sending…" : "Send reset link →"}
          </button>
        </form>
      )}
      <p className="text-center text-sm mt-6">
        <Link to="/login" className="font-semibold text-nila underline underline-offset-4 hover:text-pata">Back to sign in</Link>
      </p>
    </AuthShell>
  );
};

export default ForgotPassword;
