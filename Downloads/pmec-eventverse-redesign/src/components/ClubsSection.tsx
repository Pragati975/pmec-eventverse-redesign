import { useState } from "react";
import { Code, Bot, Palette, Music, Heart, PenTool, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { ClubDetailsModal } from "./ClubDetailsModal";

// one flat colour per club (full class names so Tailwind keeps them)
const TONES = [
  { hover: "hover:bg-nila hover:text-chalk",  solid: "bg-nila text-chalk" },
  { hover: "hover:bg-pata hover:text-chalk",  solid: "bg-pata text-chalk" },
  { hover: "hover:bg-haldi hover:text-ink",   solid: "bg-haldi text-ink" },
  { hover: "hover:bg-tulsi hover:text-chalk", solid: "bg-tulsi text-chalk" },
  { hover: "hover:bg-nila hover:text-chalk",  solid: "bg-nila text-chalk" },
  { hover: "hover:bg-pata hover:text-chalk",  solid: "bg-pata text-chalk" },
];

const clubs = [
  {
    name: "CDD", fullName: "Code Debug Deploy",
    description: "Premier coding club nurturing innovation, hackathons, and AI excellence.",
    fullDescription: "CDD (Code Debug Deploy) is the premier coding club of PMEC, dedicated to fostering innovation and technical excellence among students.\n\nKey Activities:\n• National and international hackathons\n• Weekly competitive programming\n• AI/ML workshops covering deep learning\n• Open source collaboration\n• Industry expert talks",
    icon: Code,
  },
  {
    name: "Robostreak", fullName: "Robotics Club",
    description: "Exploring automation, hardware, drones, and AI-powered machines.",
    fullDescription: "Robostreak is PMEC's dynamic robotics club.\n\nOur Focus Areas:\n• Autonomous robot development\n• Arduino, Raspberry Pi projects\n• Drone technology\n• Industrial automation and IoT",
    icon: Bot,
  },
  {
    name: "Imagics", fullName: "Digital Arts Club",
    description: "Creative design, digital art, UI/UX, and multimedia storytelling.",
    fullDescription: "Imagics is the creative heart of PMEC.\n\nOur Creative Domains:\n• Digital illustration and concept art\n• Graphic design and branding\n• Photography and manipulation\n• UI/UX design and prototyping",
    icon: Palette,
  },
  {
    name: "Abhyudaya", fullName: "Performance Arts Club",
    description: "Dance, drama, anchoring, and performance arts for cultural expression.",
    fullDescription: "Abhyudaya is PMEC's premier performance club.\n\nCore Specializations:\n• Event hosting and anchoring\n• Public speaking\n• Drama and theatrical performances\n• Dance performances",
    icon: Music,
  },
  {
    name: "Sanskruti", fullName: "Cultural Heritage Club",
    description: "Preserving and celebrating Indian heritage, art, and traditional values.",
    fullDescription: "Sanskruti is PMEC's cultural preservation society.\n\nCultural Focus Areas:\n• Indian classical music\n• Classical dance forms\n• Folk art and traditions\n• Traditional crafts",
    icon: Heart,
  },
  {
    name: "Writerea", fullName: "Literary Club",
    description: "For writers, poets, and creative thinkers who express through words.",
    fullDescription: "Writerea is PMEC's literary sanctuary.\n\nLiterary Genres:\n• Poetry in multiple languages\n• Creative writing and short stories\n• Article writing on social issues\n• Blog and digital content",
    icon: PenTool,
  },
];

export const ClubsSection = () => {
  const [selectedClub, setSelectedClub] = useState<(typeof clubs)[0] & { tone: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="clubs" className="py-20 sm:py-28 bg-paper border-y-2 border-ink">
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end mb-12">
          <div>
            <p className="eyebrow mb-2">Find your people</p>
            <h2 className="font-display font-black uppercase leading-[0.86] text-[20vw] sm:text-8xl lg:text-9xl">Clubs</h2>
          </div>
          <p className="max-w-sm text-ink/75 leading-relaxed">
            Six student communities, from code to classical dance. Tap a club to see what it does.
          </p>
        </div>

        <ul className="border-t-2 border-ink">
          {clubs.map((club, index) => {
            const Icon = club.icon;
            const tone = TONES[index % TONES.length];
            return (
              <motion.li
                key={club.name}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: Math.min(index, 5) * 0.05 }}
                className="border-b-2 border-ink"
              >
                <button
                  onClick={() => { setSelectedClub({ ...club, tone: tone.solid }); setIsModalOpen(true); }}
                  className={`group w-full text-left grid grid-cols-[auto_1fr_auto] sm:grid-cols-[72px_1fr_auto] items-center gap-4 sm:gap-8 py-5 sm:py-7 px-2 sm:px-4 transition-colors ${tone.hover}`}
                >
                  <span className="font-display font-black text-3xl sm:text-5xl opacity-40 group-hover:opacity-100">{String(index + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block font-display font-black uppercase leading-[0.9] text-5xl sm:text-7xl lg:text-8xl break-words">{club.name}</span>
                    <span className="block mt-2 font-display font-extrabold uppercase tracking-[0.18em] text-sm opacity-70 group-hover:opacity-100">{club.fullName}</span>
                    <span className="hidden sm:block mt-2 max-w-xl text-[15px] leading-relaxed opacity-80">{club.description}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <Icon size={30} className="hidden sm:block" />
                    <ArrowUpRight size={34} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <ClubDetailsModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedClub(null); }} club={selectedClub} />
    </section>
  );
};
