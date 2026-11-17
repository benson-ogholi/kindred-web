import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Scale, Crown, ArrowRight, ShieldCheck } from "lucide-react";

const YELLOW = "#FACC15"; // Core accent

const legacyCategories = [
  {
    id: "traditions",
    title: "Village Traditions",
    description:
      "Digitize and preserve oral histories, local customs, and cultural rites. Ensure the essence of your origin is never diluted by time.",
    icon: History,
    tint: "bg-[#FFF8E7]", // soft yellow
    border: "border-amber-200/60",
  },
  {
    id: "resolutions",
    title: "Family Resolutions",
    description:
      "Formalize family governance. Record meeting outcomes, financial decisions, and long-term resolutions with immutable clarity.",
    icon: Scale,
    tint: "bg-[#F8F0FF]", // faint purple
    border: "border-purple-200/60",
  },
  {
    id: "lineage",
    title: "The Great Lineage",
    description:
      "A living record of Kings, Patriarchs, and Matriarchs. Map your family tree with verified historical nodes and media archives.",
    icon: Crown,
    tint: "bg-[#F0F7FF]", // faint blue
    border: "border-blue-200/60",
  },
];

const LegacyVaultLight: React.FC = () => {
  const [activeTab, setActiveTab] = useState(legacyCategories[0]);

  return (
    <section className="bg-white py-32 px-6 relative overflow-hidden border-t border-neutral-100">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Navigation & Context */}
          <div className="lg:w-1/3">
            <div className="mb-12">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8E7] border border-amber-200/60 mb-8">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: YELLOW }}
                />
                <span className="text-neutral-900 text-[10px] font-black uppercase tracking-widest">
                  Preservation Protocol
                </span>
              </span>

              <h3 className="text-neutral-900 text-5xl font-black tracking-tighter leading-[0.9] mb-6">
                THE DIGITAL <br />
                <span className="text-neutral-300 font-light">
                  VILLAGE VAULT.
                </span>
              </h3>

              <p className="text-neutral-600 text-lg font-light leading-relaxed">
                Beyond chat, Kokohor provides a secure repository for the
                pillars of your family identity.
              </p>
            </div>

            <div className="space-y-4">
              {legacyCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category)}
                  className={`w-full p-6 rounded-3xl flex items-center gap-6 transition-all duration-300 border text-left ${
                    activeTab.id === category.id
                      ? `${category.tint} ${category.border}`
                      : "bg-white border-neutral-200/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/60 text-neutral-900 flex items-center justify-center">
                    <category.icon size={24} strokeWidth={1.5} />
                  </div>
                  <span
                    className={`font-bold text-lg tracking-tight ${
                      activeTab.id === category.id
                        ? "text-neutral-900"
                        : "text-neutral-500"
                    }`}
                  >
                    {category.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Feature Showcase (Animated) */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`h-full min-h-[500px] rounded-[3rem] ${activeTab.tint} border border-neutral-200/80 p-12 lg:p-20 relative overflow-hidden flex flex-col justify-between`}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="px-4 py-1.5 rounded-full border border-neutral-200/80 bg-white flex items-center gap-2">
                      <ShieldCheck className="text-neutral-900" size={14} />
                      <span className="text-[10px] text-neutral-700 font-black uppercase tracking-widest">
                        Immutable Record
                      </span>
                    </div>
                  </div>

                  <h4 className="text-neutral-900 text-4xl lg:text-6xl font-black tracking-tighter mb-8 leading-tight">
                    {activeTab.title}
                  </h4>

                  <p className="text-neutral-600 text-xl lg:text-2xl font-light leading-relaxed max-w-xl">
                    {activeTab.description}
                  </p>
                </div>

                <div className="relative z-10 mt-12 pt-12 border-t border-neutral-200/60 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center overflow-hidden"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-50" />
                      </div>
                    ))}
                    <div
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-neutral-900"
                      style={{ background: YELLOW }}
                    >
                      +12
                    </div>
                  </div>

                  <button className="flex items-center gap-3 text-neutral-900 font-black uppercase tracking-widest text-[10px] hover:opacity-70 transition-opacity group">
                    Explore Archive
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacyVaultLight;
