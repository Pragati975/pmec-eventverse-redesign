
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") !== "recovery" && !hashParams.get("access_token")) {
      // Also check query params
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get("type") !== "recovery") {
        toast.error("Invalid or expired reset link");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated! Please login.");
    navigate("/login");
  };

  return (
    <AuthShell eyebrow="New start" title="Set new password" subtitle="Choose a password you'll remember.">
      <form onSubmit={handleReset} className="space-y-5">
        <div>
          <label className="label" htmlFor="password">New password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="At least 6 characters" required minLength={6} />
        </div>
        <button type="submit" disabled={loading} className="btn-ink w-full">
          {loading ? "Updating…" : "Update password →"}
        </button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
