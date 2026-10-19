import { useState, useEffect } from "react";
import { Clock, MapPin, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { EventRegistrationModal } from "./EventRegistrationModal";
import { styleFor } from "@/lib/categories";
import { splitDate, daysUntil } from "@/lib/format";

type EventRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  prize: string;
  total_seats: number;
  seats_left: number;
  icon: string;
  gradient: string;
};

const categories = ["All", "Technical", "Cultural", "Sports", "Workshop"];

const Seats = ({ total, left }: { total: number; left: number }) => {
  const taken = Math.max(0, total - left);
  const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
  const low = total > 0 && left > 0 && left <= Math.ceil(total * 0.2);
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-display font-black text-3xl leading-none">{left}</span>
        <span className="font-display font-extrabold uppercase tracking-[0.14em] text-xs text-mute">of {total} seats left</span>
      </div>
      <div className="h-3 border-2 border-ink bg-paper">
        <div className={`h-full ${low || left === 0 ? "bg-pata" : "bg-tulsi"}`} style={{ width: `${pct}%` }} />
      </div>
      {low && <p className="mt-1.5 text-xs font-bold text-pata uppercase tracking-wider">Almost full</p>}
    </div>
  );
};

const EventStrip = ({ event, index, onRegister }: { event: EventRow; index: number; onRegister: (id: string, title: string) => void }) => {
  const st = styleFor(event.category);
  const d = splitDate(event.event_date);
  const until = daysUntil(event.event_date);
  const when = until === null ? "" : until < 0 ? "Past event" : until === 0 ? "Today" : until === 1 ? "Tomorrow" : `In ${until} days`;
  const full = event.seats_left === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index, 4) * 0.06 }}
      className="grid sm:grid-cols-[132px_1fr] lg:grid-cols-[132px_1fr_270px] border-2 border-ink bg-paper shadow-block hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-block-lg transition-all"
    >
      {/* date block, coloured by category */}
      <div className={`${st.bg} ${st.text} flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-1 p-4 sm:p-5 border-b-2 sm:border-b-0 sm:border-r-2 border-ink`}>
        <div>
          <p className="font-display font-black text-6xl leading-[0.85]">{d.day}</p>
          <p className="font-display font-extrabold tracking-[0.18em] text-lg">{d.month}</p>
        </div>
        <p className="font-display font-extrabold uppercase tracking-[0.14em] text-xs sm:mt-3 text-right sm:text-left">{when}</p>
      </div>

      <div className="p-5 sm:p-6 lg:border-r-2 border-ink">
        <div className="flex items-center gap-3 mb-2">
          <span className={`${st.bg} ${st.text} border-2 border-ink px-2.5 py-0.5 font-display font-extrabold uppercase tracking-[0.16em] text-xs`}>{event.category}</span>
          <span className="text-2xl select-none" aria-hidden="true">{event.icon}</span>
        </div>
        <h3 className="font-display font-black uppercase text-3xl sm:text-4xl leading-[0.95] mb-2">{event.title}</h3>
        <p className="text-ink/75 leading-relaxed line-clamp-2 mb-4">{event.description}</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-medium">
          <li className="flex items-center gap-1.5"><Clock size={15} className="text-pata" />{event.event_time}</li>
          <li className="flex items-center gap-1.5"><MapPin size={15} className="text-pata" />{event.location}</li>
          {event.prize && <li className="flex items-center gap-1.5"><Trophy size={15} className="text-pata" />{event.prize}</li>}
        </ul>
      </div>

      <div className="p-5 sm:p-6 sm:col-span-2 lg:col-span-1 flex flex-col justify-between gap-4 border-t-2 lg:border-t-0 border-ink bg-chalk/60">
        <Seats total={event.total_seats} left={event.seats_left} />
        <button
          onClick={() => onRegister(event.id, event.title)}
          disabled={event.seats_left === 0}
          className={`${full ? "btn-line" : "btn-ink"} w-full`}
        >
          {full ? "Event full" : "Register →"}
        </button>
      </div>
    </motion.article>
  );
};

export const EventsSection = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState({ id: "", title: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase.from("events").select("*").order("event_date");
      if (error) console.error("Failed to load events:", error.message);
      setEvents((data as EventRow[]) ?? []);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const filteredEvents = activeCategory === "All"
    ? events
    : events.filter(e => e.category === activeCategory);

  return (
    <section id="events" className="py-20 sm:py-28 bg-chalk">
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-10">
          <div>
            <p className="eyebrow mb-2">What's on</p>
            <h2 className="font-display font-black uppercase leading-[0.86] text-[20vw] sm:text-8xl lg:text-9xl">Events</h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter events by category">
            {categories.map(cat => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(cat)}
                  className={`border-2 border-ink px-4 py-2 font-display font-extrabold uppercase tracking-[0.16em] text-sm transition-colors ${
                    active ? "bg-ink text-chalk shadow-[3px_3px_0_0_#f4b82e]" : "bg-paper text-ink hover:bg-haldi"
                  }`}
                >{cat}</button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <p className="font-display font-extrabold uppercase tracking-[0.2em] text-mute">Loading events…</p>
        ) : filteredEvents.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="font-display font-black uppercase text-4xl">Nothing here yet</p>
            <p className="text-mute mt-2">No events in this category right now. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <EventStrip
                key={event.id}
                event={event}
                index={index}
                onRegister={(id, title) => { setSelectedEvent({ id, title }); setIsModalOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedEvent({ id: "", title: "" }); loadEvents(); }}
        eventId={selectedEvent.id}
        eventTitle={selectedEvent.title}
      />
    </section>
  );
};
