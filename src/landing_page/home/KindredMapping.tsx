import React from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Users2,
  Activity,
  Maximize2,
  Plus,
  Search,
} from "lucide-react";

const YELLOW = "#FACC15"; // Core accent

const KindredMapping: React.FC = () => {
  return (
    <section className="bg-white py-32 px-6 relative overflow-hidden border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Side: Copy & Meta-Data */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8E7] border border-amber-200/60 mb-8"
            >
              <Activity size={14} className="text-neutral-900" />
              <span className="text-neutral-900 text-[10px] font-black uppercase tracking-widest">
                Family Network v2.0
              </span>
            </motion.div>

            <h2 className="text-neutral-900 text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
              MAPPING <br />
              <span className="text-neutral-300 font-light">CONNECTIONS.</span>
            </h2>

            <p className="text-neutral-600 text-xl font-light leading-relaxed mb-12 max-w-md">
              Bring your relatives closer together. Our dynamic mapping engine
              turns shared family history into an interactive web of meaningful
              connections.
            </p>

            {/* Feature List with Tinted Cards */}
            <div className="space-y-6">
              {[
                {
                  title: "Generational Branching",
                  desc: "Automatically map and expand your family tree across generations of relatives and kin.",
                  icon: GitBranch,
                  tint: "bg-[#FFF8E7]", // soft yellow
                },
                {
                  title: "Live Family Sync",
                  desc: "Updates to contact details and family milestones sync instantly for every connected member.",
                  icon: Users2,
                  tint: "bg-[#F0F7FF]", // faint blue
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-5 p-4 rounded-3xl border border-neutral-200/60 ${item.tint}`}
                >
                  <div
                    className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-neutral-900"
                    style={{ background: YELLOW }}
                  >
                    <item.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-neutral-900 font-bold text-lg mb-1">
                      {item.title}
                    </h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: The Interactive Canvas */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[3rem] bg-[#F8F0FF] border border-neutral-200/80 p-5 overflow-hidden"
            >
              {/* Toolbar */}
              <div className="bg-white border border-neutral-200/70 rounded-2xl p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold border-r border-neutral-200 pr-4">
                    <Search size={14} /> Find Relative
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { bg: "bg-[#FFF8E7]" },
                      { bg: "bg-[#F0F7FF]" },
                      { bg: "bg-[#F0FFF4]" },
                    ].map((dot, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full border border-neutral-200 ${dot.bg}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-600 transition-colors"
                  >
                    <Maximize2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="text-neutral-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                    style={{ background: YELLOW }}
                  >
                    <Plus size={14} /> Add Connection
                  </button>
                </div>
              </div>

              {/* Map Visualization Area */}
              <div className="h-[450px] relative bg-white rounded-[2rem] border border-neutral-200/70 overflow-hidden">
                {/* Connection Paths */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                  <path
                    d="M100,200 Q250,100 400,200 T700,300"
                    stroke="#a3a3a3"
                    fill="transparent"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                  <path
                    d="M150,400 Q350,300 550,400"
                    stroke="#a3a3a3"
                    fill="transparent"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </svg>

                {/* Floating Node 1 */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-20 left-1/4 p-4 bg-[#FFF8E7] border border-amber-200/80 rounded-2xl flex items-center gap-3 cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-900 font-black text-xs"
                    style={{ background: YELLOW }}
                  >
                    FM
                  </div>
                  <div>
                    <p className="text-neutral-900 font-bold text-xs">
                      Family Elder
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">
                      Main Branch
                    </p>
                  </div>
                </motion.div>

                {/* Floating Node 2 */}
                <motion.div
                  animate={{ y: [10, 0, 10] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-24 right-1/4 p-4 bg-[#F8F0FF] border border-purple-200/80 rounded-2xl flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-200/60 flex items-center justify-center text-purple-900 font-black text-xs">
                    RC
                  </div>
                  <div>
                    <p className="text-neutral-900 font-bold text-xs">
                      Relative Circle
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">
                      Verified Link
                    </p>
                  </div>
                </motion.div>

                {/* Canvas Grid Background */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#000 0.8px, transparent 0.8px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>
            </motion.div>

            {/* Total Connections Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-6 -left-6 p-6 rounded-3xl border border-neutral-900/10 text-neutral-900"
              style={{ background: YELLOW }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">
                Family Connections
              </p>
              <p className="text-3xl font-black tracking-tighter">14,802</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KindredMapping;
