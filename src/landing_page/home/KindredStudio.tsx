import React from "react";
import { motion } from "framer-motion";
import { Users, MapPin, Database, Plus, Apple, Triangle } from "lucide-react";

const YELLOW = "#FACC15"; // Core accent

const stats = [
  {
    label: "Active Nodes",
    value: "2.4k",
    icon: MapPin,
    tint: "bg-[#FFF8E7]", // soft yellow
    border: "border-amber-200/60",
  },
  {
    label: "Data Integrity",
    value: "99.9%",
    icon: Database,
    tint: "bg-[#F0FFF4]", // faint green
    border: "border-emerald-200/60",
  },
  {
    label: "Verified Clans",
    value: "850+",
    icon: Users,
    tint: "bg-[#F8F0FF]", // faint purple
    border: "border-purple-200/60",
  },
];

const KindredStudio: React.FC = () => {
  return (
    <section className="bg-white py-32 px-6 relative overflow-hidden border-t border-neutral-100">
      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Minimalist & Bold */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8E7] border border-amber-200/60 mb-6"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: YELLOW }}
              />
              <span className="text-neutral-900 font-black uppercase tracking-[0.3em] text-[10px]">
                The Kokohor Standard
              </span>
            </motion.div>

            <h2 className="text-neutral-900 text-5xl lg:text-8xl font-black tracking-tighter leading-[0.85]">
              PURITY IN <br />
              <span className="text-neutral-300 font-light">CONNECTION.</span>
            </h2>
          </div>

          <p className="text-neutral-600 text-lg lg:text-xl max-w-sm font-medium leading-relaxed">
            Stripping away the noise to leave only what matters: the authentic
            pulse of your family’s history.
          </p>
        </div>

        {/* Feature Cards - Zero Border/Shadow, Tinted Backgrounds */}
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`group p-10 rounded-[3rem] border ${stat.border} ${stat.tint} hover:bg-neutral-900 transition-all duration-500 cursor-pointer`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/60 flex items-center justify-center mb-12 group-hover:bg-neutral-800 group-hover:border-neutral-700 transition-colors duration-300">
                <stat.icon
                  size={20}
                  className="text-neutral-900 group-hover:text-amber-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <p className="text-neutral-500 group-hover:text-neutral-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                  {stat.label}
                </p>
                <h4 className="text-neutral-900 group-hover:text-white text-5xl font-black tracking-tighter transition-colors">
                  {stat.value}
                </h4>
              </div>

              <div className="mt-12 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={24} style={{ color: YELLOW }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Call to Action - Clean Black & Yellow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[4rem] bg-neutral-900 p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative border border-neutral-800"
        >
          {/* Decorative Glow inside Black Box */}
          <div
            className="absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full pointer-events-none opacity-20"
            style={{ background: YELLOW }}
          />

          <div className="relative z-10 text-center lg:text-left">
            <h3 className="text-white text-4xl lg:text-7xl font-black tracking-tighter mb-4 uppercase leading-[0.9]">
              READY TO <br />
              <span style={{ color: YELLOW }}>UNIFY?</span>
            </h3>
            <p className="text-neutral-400 font-black uppercase tracking-[0.3em] text-xs">
              Deploy your family node in seconds.
            </p>
          </div>

          {/* Store Download Actions */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button
              type="button"
              className="px-10 py-6 bg-white text-neutral-900 rounded-[2rem] transition-all flex items-center justify-center gap-4 hover:opacity-90 active:scale-95"
            >
              <Apple size={32} strokeWidth={2.5} className="fill-neutral-900" />
              <div className="text-left">
                <p className="text-[10px] font-black leading-none uppercase tracking-tighter text-neutral-500">
                  Download on the
                </p>
                <p className="text-2xl font-black leading-none uppercase tracking-tighter">
                  App Store
                </p>
              </div>
            </button>

            <button
              type="button"
              className="px-10 py-6 bg-white text-neutral-900 rounded-[2rem] transition-all flex items-center justify-center gap-4 hover:opacity-90 active:scale-95"
            >
              <Triangle
                size={28}
                strokeWidth={2.5}
                className="fill-neutral-900 rotate-90"
              />
              <div className="text-left">
                <p className="text-[10px] font-black leading-none uppercase tracking-tighter text-neutral-500">
                  Get it on
                </p>
                <p className="text-2xl font-black leading-none uppercase tracking-tighter">
                  Google Play
                </p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KindredStudio;
