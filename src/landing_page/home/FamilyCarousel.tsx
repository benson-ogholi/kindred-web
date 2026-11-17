import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  ShieldCheck,
  Globe,
  Lock,
} from "lucide-react";

import familyImg1 from "../../assets/hero/a.jpg";
import familyImg2 from "../../assets/hero/b.jpg";
import familyImg3 from "../../assets/hero/c.jpg";

/**
 * Sample stories: replace names and quotes with real members (with their permission).
 * Match each image to its story: a.jpg = Okoye family, b.jpg = Class of 2009, c.jpg = Eze & Sons team.
 */
const families = [
  {
    id: 1,
    name: "The Okoye Family",
    location: "Port Harcourt, Rivers",
    caption:
      "My dad travels often for work. Now he saves his route and emergency details in the Safety Vault, and my sister and I know we can reach them if he ever goes quiet.",
    image: familyImg1,
    stat: "Assigned access",
    tag: "Safety Vault",
  },
  {
    id: 2,
    name: "Class of 2009",
    location: "Lagos, Nigeria",
    caption:
      "We were scattered across five cities and one WhatsApp group had 300 messages a day. Our Kokohor circle has the reunion poll, the news and the voice notes in one place.",
    image: familyImg2,
    stat: "Private circle",
    tag: "Classmates",
  },
  {
    id: 3,
    name: "Eze & Sons Trading",
    location: "Abuja, FCT",
    caption:
      "Our staff and our relatives are in separate circles, so announcements go to the right people. When we need to talk fast, we send a voice note.",
    image: familyImg3,
    stat: "Separate circles",
    tag: "Business",
  },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "8%" : "-8%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "8%" : "-8%",
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

const FamilyCarousel: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const currentIndex = Math.abs(page % families.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <section className="bg-[#F4F4F2] py-16 lg:py-28 px-4 md:px-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-neutral-500 mb-4"
            >
              <Globe size={14} className="animate-pulse text-amber-500" />
              <span className="font-semibold uppercase tracking-[0.25em] text-[10px] lg:text-xs">
                Circles using Kokohor
              </span>
            </motion.div>
            <h2 className="text-neutral-900 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Real circles, <br />
              <span className="text-neutral-400">closer every day.</span>
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              aria-label="Previous story"
              onClick={() => paginate(-1)}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              aria-label="Next story"
              onClick={() => paginate(1)}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Carousel Card */}
        <div className="relative min-h-[580px] lg:min-h-0 lg:aspect-[16/8] w-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="lg:absolute inset-0 flex flex-col lg:grid lg:grid-cols-12 rounded-3xl overflow-hidden border border-neutral-200 bg-white"
            >
              {/* Image Side */}
              <div className="lg:col-span-7 relative h-[340px] lg:h-auto">
                <img
                  src={families[currentIndex].image}
                  alt={families[currentIndex].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 px-3 py-1 w-fit bg-white rounded-full text-neutral-900 text-[10px] font-semibold uppercase tracking-wider">
                      <Lock size={11} />
                      {families[currentIndex].tag}
                    </div>
                    <h3 className="text-white font-bold text-3xl lg:text-5xl tracking-tight">
                      {families[currentIndex].name}
                    </h3>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-widest">
                      {families[currentIndex].location}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between relative bg-[#FAFAF8]">
                <div>
                  <Quote
                    className="text-neutral-200 mb-6"
                    size={36}
                    strokeWidth={1.5}
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-neutral-700 text-lg lg:text-xl leading-relaxed"
                  >
                    “{families[currentIndex].caption}”
                  </motion.p>
                </div>

                <div className="mt-10 pt-8 border-t border-neutral-200">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-neutral-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                        Privacy
                      </p>
                      <p className="text-neutral-900 font-semibold text-lg flex items-center gap-2">
                        {families[currentIndex].stat}
                        <ShieldCheck size={18} className="text-amber-500" />
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-neutral-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                        Platform
                      </p>
                      <p className="text-amber-600 font-semibold text-lg">
                        Kokohor for Android
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      key={page}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 7, ease: "linear" }}
                      className="h-full bg-amber-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FamilyCarousel;
