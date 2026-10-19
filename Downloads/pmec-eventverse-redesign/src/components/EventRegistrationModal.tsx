import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export const EventRegistrationModal = ({ isOpen, onClose, eventId, eventTitle }: EventRegistrationModalProps) => {
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", registrationNumber: "", phone: "", year: "", branch: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please login to register for events");
        onClose();
        navigate("/login");
        return;
      }
      setUser(session.user);
      setFormData(prev => ({ ...prev, email: session.user.email || "" }));
    });
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const { error } = await supabase.rpc("register_for_event", {
      p_event: eventId,
      p_reg: formData.registrationNumber,
      p_phone: formData.phone,
      p_year: formData.year,
      p_branch: formData.branch,
    });

    setSubmitting(false);

    if (error) {
      toast.error(
        error.message.includes("duplicate") ? "You're already registered for this event"
        : error.message.includes("full") ? "Sorry, this event is full"
        : error.message
      );
      return;
    }

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    toast.success(`Successfully registered for ${eventTitle}!`);
    setFormData({ name: "", email: "", registrationNumber: "", phone: "", year: "", branch: "" });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="bg-ink text-chalk p-6 pr-14 space-y-1 text-left">
          <p className="eyebrow !text-haldi">Register for</p>
          <DialogTitle className="font-display font-black uppercase text-4xl leading-[0.95] text-chalk">{eventTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label" htmlFor="reg-name">Full name</label>
            <input id="reg-name" type="text" name="name" value={formData.name} onChange={handleInputChange} className="field" required />
          </div>
          <div>
            <label className="label" htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" name="email" value={formData.email} onChange={handleInputChange} className="field" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="reg-no">Registration no.</label>
              <input id="reg-no" type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} className="field" required />
            </div>
            <div>
              <label className="label" htmlFor="reg-phone">Phone</label>
              <input id="reg-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="field" required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="reg-year">Year</label>
              <select id="reg-year" name="year" value={formData.year} onChange={handleInputChange} className="field" required>
                <option value="">Select year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="reg-branch">Branch</label>
              <select id="reg-branch" name="branch" value={formData.branch} onChange={handleInputChange} className="field" required>
                <option value="">Select branch</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical & Electronics</option>
                <option value="MECH">Mechanical</option>
                <option value="CIVIL">Civil</option>
                <option value="IT">Information Technology</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-pata w-full">
            {submitting ? "Registering…" : "Confirm registration →"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
