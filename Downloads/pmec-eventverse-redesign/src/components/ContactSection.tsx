import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      name: formData.name, email: formData.email,
      subject: formData.subject, message: formData.message,
    });
    setSending(false);
    if (error) { toast.error("Could not send message. Please try again."); return; }
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: Mail,   label: "Email",        value: "pmecbam@gmail.com",        sub: "We reply within 24 hours", bg: "bg-pata" },
    { icon: Phone,  label: "Phone",        value: "+91 680-229-1040",         sub: "Mon–Sat, 9am–6pm",          bg: "bg-nila" },
    { icon: MapPin, label: "Address",      value: "Berhampur, Odisha 761003", sub: "Parala Maharaja Engineering College", bg: "bg-tulsi" },
    { icon: Clock,  label: "Office hours", value: "Mon – Sat",                sub: "9:00 AM – 5:00 PM IST",     bg: "bg-haldi" },
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-chalk border-t-2 border-ink">
      <div className="container">
        <div className="mb-12">
          <p className="eyebrow mb-2">Say hello</p>
          <h2 className="font-display font-black uppercase leading-[0.86] text-[20vw] sm:text-8xl lg:text-9xl">Contact</h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 content-start">
            {contactInfo.map(info => (
              <div key={info.label} className="flex items-stretch border-2 border-ink bg-paper">
                <div className={`${info.bg} ${info.bg === "bg-haldi" ? "text-ink" : "text-chalk"} w-14 shrink-0 flex items-center justify-center border-r-2 border-ink`}>
                  <info.icon size={22} />
                </div>
                <div className="p-4 min-w-0">
                  <p className="font-display font-extrabold uppercase tracking-[0.18em] text-xs text-mute">{info.label}</p>
                  <p className="font-semibold break-words">{info.value}</p>
                  <p className="text-sm text-mute">{info.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="panel p-6 sm:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="field" placeholder="Your name" required />
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="field" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="subject">Subject</label>
              <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="field" required>
                <option value="">Select a subject</option>
                <option>Event Registration</option>
                <option>Club Membership</option>
                <option>Sponsorship</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} className="field resize-none" placeholder="How can we help?" required />
            </div>
            <button type="submit" disabled={sending} className="btn-pata w-full">
              {sending ? "Sending…" : "Send message →"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
