import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WheelSvg } from "@/components/Wheel";

const facts = [
  { big: "2009", label: "Established", bg: "bg-haldi", text: "text-ink" },
  { big: "BPUT", label: "Affiliated university", bg: "bg-nila", text: "text-chalk" },
  { big: "6", label: "Student clubs", bg: "bg-pata", text: "text-chalk" },
  { big: "761003", label: "Berhampur, Odisha", bg: "bg-tulsi", text: "text-chalk" },
];

const About = () => (
  <div className="min-h-screen bg-chalk">
    <Navbar />

    <header className="relative pt-32 pb-20 bg-ink text-chalk overflow-hidden">
      <WheelSvg className="absolute -right-32 -top-20 w-[520px] h-[520px] text-chalk/10" />
      <div className="container relative">
        <p className="eyebrow !text-haldi mb-3">About</p>
        <h1 className="font-display font-black uppercase leading-[0.88] text-6xl sm:text-8xl max-w-4xl">
          Parala Maharaja <span className="text-haldi">Engineering</span> College
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-chalk/80 leading-relaxed">
          PMEC is an engineering college in Berhampur, Odisha, affiliated to BPUT and established in 2009.
          EventVerse is the student-built portal for everything that happens outside the classroom.
        </p>
      </div>
    </header>

    <section className="container -mt-10 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {facts.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className={`${f.bg} ${f.text} border-2 border-ink shadow-block p-5`}
          >
            <p className="font-display font-black text-5xl leading-none">{f.big}</p>
            <p className="font-display font-extrabold uppercase tracking-[0.14em] text-sm mt-2">{f.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="container py-20 grid md:grid-cols-[1fr_1.2fr] gap-10 items-start">
      <div>
        <p className="eyebrow mb-2">Why EventVerse</p>
        <h2 className="font-display font-black uppercase text-5xl leading-[0.92]">One place for every fest, club and contest</h2>
      </div>
      <div className="space-y-4 text-lg leading-relaxed text-ink/85">
        <p>
          Events used to live in notice boards and WhatsApp groups. EventVerse puts them in one place: browse what is coming up,
          see how many seats are left, and register in a few taps.
        </p>
        <p>
          It is built by a PMEC student, as the web companion to the PMEC EventVerse Android app.
        </p>
        <p>
          Clubs like CDD, Robostreak, Imagics, Abhyudaya, Sanskruti and Writerea each get their own corner, because a college
          is more than its classrooms.
        </p>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
