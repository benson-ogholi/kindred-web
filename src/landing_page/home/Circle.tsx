import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Avatar,
  Card,
  Icon,
  ICONS,
  IconBadge,
  IosSoon,
  PlayButton,
  SectionHeading,
  YELLOW,
  YELLOW_SOFT,
} from "./shared";

const circleTypes = [
  {
    name: "Relatives",
    note: "Parents, siblings, cousins, in-laws",
    members: "14 members",
    author: { name: "Tunde Kalu", avatar: "TK", bg: "bg-sky-300", time: "Okoye Family · 2h ago" },
    post: "Family reunion is confirmed for December 27. Please update your travel plans in the hub.",
    likes: 24,
    replies: 9,
    pollQuestion: "Where should we hold the reunion?",
    pollOptions: [
      { label: "Port Harcourt", votes: 14 },
      { label: "Abuja", votes: 7 },
      { label: "Lagos", votes: 4 },
    ],
    chatQuestion: "Did everyone get the reunion date?",
    caller: { name: "Ada Okoye", avatar: "AO", bg: "bg-amber-300", status: "Ringing…" },
  },
  {
    name: "Classmates",
    note: "Old school and university friends",
    members: "32 members",
    author: { name: "Chidi J.", avatar: "CJ", bg: "bg-emerald-300", time: "Class of '16 · 4h ago" },
    post: "Ten-year anniversary dinner tickets are live! Drop your dietary preferences below.",
    likes: 31,
    replies: 15,
    pollQuestion: "Best weekend for the alumni meetup?",
    pollOptions: [
      { label: "First Saturday of Dec", votes: 19 },
      { label: "Second Saturday of Dec", votes: 9 },
      { label: "New Year weekend", votes: 4 },
    ],
    chatQuestion: "Who is driving down from Benin on Friday?",
    caller: { name: "Musa Abdullahi", avatar: "MA", bg: "bg-sky-300", status: "Connected · 02:14" },
  },
  {
    name: "Office",
    note: "Teams, departments, coworkers",
    members: "11 members",
    author: { name: "Benson O.", avatar: "BO", bg: "bg-amber-300", time: "Core Product · 1h ago" },
    post: "Sprint review moved to 3:00 PM today. Updated release checklist is pinned.",
    likes: 11,
    replies: 4,
    pollQuestion: "Team lunch spot this Friday?",
    pollOptions: [
      { label: "Bistro 45", votes: 6 },
      { label: "Cornerstone Grill", votes: 3 },
      { label: "Order in", votes: 2 },
    ],
    chatQuestion: "QA build is green—ready for staging?",
    caller: { name: "Ikenna Ibeneme", avatar: "II", bg: "bg-rose-300", status: "Ringing…" },
  },
  {
    name: "Business",
    note: "Partners, staff and clients",
    members: "19 members",
    author: { name: "Ngozi E.", avatar: "NE", bg: "bg-rose-300", time: "Suppliers & Ops · 5h ago" },
    post: "Q4 inventory shipment cleared customs this morning. Delivery schedule attached.",
    likes: 18,
    replies: 6,
    pollQuestion: "Preferred dispatch window?",
    pollOptions: [
      { label: "Morning (8 AM – 12 PM)", votes: 11 },
      { label: "Afternoon (1 PM – 5 PM)", votes: 6 },
      { label: "Weekend drop-off", votes: 2 },
    ],
    chatQuestion: "Invoice #408 has been signed off.",
    caller: { name: "Kelechi Ulu", avatar: "KU", bg: "bg-emerald-300", status: "Connected · 05:41" },
  },
  {
    name: "Community",
    note: "Church, mosque, clubs, neighbours",
    members: "48 members",
    author: { name: "Elder Sam", avatar: "ES", bg: "bg-amber-300", time: "Estate & Welfare · 3h ago" },
    post: "Monthly community sanitation and security briefing starts at 8:00 AM sharp.",
    likes: 39,
    replies: 12,
    pollQuestion: "New solar streetlight priority zone?",
    pollOptions: [
      { label: "Main Gate & Lane 1", votes: 26 },
      { label: "Children's Park", votes: 14 },
      { label: "East Perimeter", votes: 8 },
    ],
    chatQuestion: "Security patrol schedule for this week is up.",
    caller: { name: "Amaka N.", avatar: "AN", bg: "bg-sky-300", status: "Ringing…" },
  },
];

const wave = [6, 12, 8, 17, 13, 21, 10, 15, 7, 19, 12, 8, 16, 10, 6, 14, 10];

export default function Circles() {
  const rm = !!useReducedMotion();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [votedIdx, setVotedIdx] = useState<number | null>(0);
  const [playingVoice, setPlayingVoice] = useState(false);

  const active = circleTypes[selectedIdx];

  // Reset interactive demo states when switching circle tabs
  const handleSelectCircle = (idx: number) => {
    setSelectedIdx(idx);
    setLiked(false);
    setVotedIdx(0);
    setPlayingVoice(false);
  };

  // Auto-stop simulated voice note playback after 4 seconds
  useEffect(() => {
    if (!playingVoice) return;
    const t = setTimeout(() => setPlayingVoice(false), 4000);
    return () => clearTimeout(t);
  }, [playingVoice]);

  // Compute live poll percentages
  const adjustedOptions = active.pollOptions.map((opt, idx) => ({
    ...opt,
    votes: opt.votes + (votedIdx === idx ? 1 : 0),
  }));
  const totalVotes = adjustedOptions.reduce((sum, o) => sum + o.votes, 0);

  return (
    <section id="circles" className="bg-[#F4F4F2] py-24 md:py-28">
      <SectionHeading
        title="Family is bigger than one household"
        body="Create a circle for anyone who matters: relatives, old classmates, your office or your business. Each circle has its own members, news and conversations."
      />

      {/* Interactive Circle Type Switcher */}
      <div className="mx-auto mt-14 max-w-6xl px-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Select a circle to preview
          </p>
          <span className="text-xs font-medium text-neutral-600">
            {active.members}
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Circle types"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {circleTypes.map((c, i) => {
            const isSelected = i === selectedIdx;
            return (
              <motion.button
                key={c.name}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectCircle(i)}
                initial={rm ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`group relative flex flex-col justify-between rounded-3xl border p-5 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-neutral-900 bg-white shadow-[0_14px_34px_-16px_rgba(0,0,0,0.18)]"
                    : "border-neutral-200/80 bg-white/75 hover:border-neutral-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-full px-3.5 py-1 text-sm font-semibold transition-colors ${
                      isSelected
                        ? "text-neutral-900"
                        : "bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200/70"
                    }`}
                    style={isSelected ? { background: YELLOW } : undefined}
                  >
                    {c.name}
                  </span>
                  {isSelected && (
                    <motion.span
                      layoutId="circle-active-dot"
                      className="h-2 w-2 rounded-full bg-neutral-900"
                    />
                  )}
                </div>
                <p className="mt-3.5 text-sm leading-snug text-neutral-600">
                  {c.note}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Row 1: News + Polls */}
      <div className="mx-auto mt-6 grid max-w-6xl gap-5 px-6 md:grid-cols-2">
        {/* News Card */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <Card className="flex h-full flex-col justify-between rounded-[2rem] border border-neutral-200/80 bg-white p-8 shadow-[0_12px_36px_-24px_rgba(0,0,0,0.15)]">
            <div>
              <div className="flex items-center justify-between">
                <IconBadge d={ICONS.news} />
                <span className="rounded-full bg-[#F4F4F2] px-3 py-1 text-[11px] font-medium text-neutral-600">
                  {active.name} Feed
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
                News for the whole group
              </h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Post announcements that every member of the circle sees. Good
                news, family events, office updates or reminders, all in one feed.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={rm ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={rm ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-6 rounded-2xl border border-neutral-200/80 bg-[#F8F8F6] p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar label={active.author.avatar} bg={active.author.bg} />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {active.author.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {active.author.time}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-800">
                  {active.post}
                </p>
                <div className="mt-3.5 flex items-center gap-4 border-t border-neutral-200/70 pt-3 text-xs text-neutral-500">
                  <button
                    type="button"
                    onClick={() => setLiked((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-colors ${
                      liked
                        ? "bg-rose-50 text-rose-600"
                        : "hover:bg-neutral-200/60 hover:text-neutral-800"
                    }`}
                  >
                    <Icon d={ICONS.heart} className="h-3.5 w-3.5" />
                    {active.likes + (liked ? 1 : 0)}
                  </button>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon d={ICONS.chat} className="h-3.5 w-3.5" />
                    {active.replies} replies
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Polls Card */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <Card className="flex h-full flex-col justify-between rounded-[2rem] border border-neutral-200/80 bg-white p-8 shadow-[0_12px_36px_-24px_rgba(0,0,0,0.15)]">
            <div>
              <div className="flex items-center justify-between">
                <IconBadge d={ICONS.poll} />
                <span className="rounded-full bg-[#F4F4F2] px-3 py-1 text-[11px] font-medium text-neutral-600">
                  Tap to vote
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
                Polls that settle things
              </h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Ask the group and see answers as they come in. Pick a date, a
                venue or a decision without a long chain of messages.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={rm ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={rm ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-6 rounded-2xl border border-neutral-200/80 bg-[#F8F8F6] p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-900">
                    {active.pollQuestion}
                  </p>
                  <span className="shrink-0 text-[11px] text-neutral-500">
                    {totalVotes} votes
                  </span>
                </div>
                <div className="mt-3.5 space-y-2.5">
                  {adjustedOptions.map((o, idx) => {
                    const pct = Math.round((o.votes / totalVotes) * 100);
                    const picked = votedIdx === idx;
                    return (
                      <button
                        key={o.label}
                        type="button"
                        onClick={() => setVotedIdx(idx)}
                        className="block w-full text-left group"
                      >
                        <div className="flex justify-between text-xs">
                          <span
                            className={`font-medium transition-colors ${
                              picked
                                ? "text-neutral-900"
                                : "text-neutral-600 group-hover:text-neutral-900"
                            }`}
                          >
                            {o.label}
                            {picked ? " ✓" : ""}
                          </span>
                          <span className="font-semibold text-neutral-800">
                            {pct}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full border border-neutral-200/80 bg-white">
                          <motion.div
                            className="h-full rounded-full"
                            initial={false}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: rm ? 0 : 0.45,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{
                              background: picked ? YELLOW : "#D4D4CE",
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      {/* Row 2: Chats + Calls */}
      <div className="mx-auto mt-5 grid max-w-6xl gap-5 px-6 lg:grid-cols-5">
        {/* Chats & Voice Notes */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-3"
        >
          <Card className="flex h-full flex-col justify-between rounded-[2rem] border border-neutral-200/80 bg-white p-8 shadow-[0_12px_36px_-24px_rgba(0,0,0,0.15)]">
            <div>
              <IconBadge d={ICONS.chat} />
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
                Chats and voice notes
              </h3>
              <p className="mt-2 max-w-lg leading-relaxed text-neutral-600">
                Message one person or a whole circle. Record a voice note when
                typing is slow, and keep every conversation in the right group.
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-neutral-200/80 bg-[#F8F8F6] p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.name}
                  initial={rm ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={rm ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-[80%] rounded-2xl rounded-bl-md border border-neutral-200/80 bg-white px-4 py-2.5 text-sm text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                >
                  {active.chatQuestion}
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setPlayingVoice((p) => !p)}
                aria-label={playingVoice ? "Pause voice note" : "Play voice note"}
                className="ml-auto flex max-w-[82%] items-center gap-3 rounded-2xl rounded-br-md px-4 py-2.5 text-neutral-900 shadow-sm transition hover:brightness-[1.03] active:scale-[0.99]"
                style={{ background: YELLOW }}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neutral-900 text-white">
                  <Icon d={ICONS.mic} className="h-3.5 w-3.5" />
                </span>
                <div className="flex h-6 items-center gap-0.5" aria-hidden>
                  {wave.map((h, i) => (
                    <motion.span
                      key={i}
                      animate={
                        playingVoice && !rm
                          ? {
                              height: [h + 4, Math.max(5, 22 - h), h + 4],
                            }
                          : { height: h + 4 }
                      }
                      transition={
                        playingVoice && !rm
                          ? {
                              repeat: Infinity,
                              duration: 0.65,
                              delay: i * 0.04,
                              ease: "easeInOut",
                            }
                          : { duration: 0.2 }
                      }
                      className="w-1 rounded-full bg-neutral-900/75"
                      style={{ height: h + 4 }}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold tabular-nums">
                  {playingVoice ? "Playing" : "0:14"}
                </span>
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Calls Card */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="lg:col-span-2"
        >
          <Card className="flex h-full flex-col justify-between rounded-[2rem] border border-neutral-800 bg-neutral-900 p-8 text-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between">
                <div
                  className="grid h-11 w-11 place-items-center rounded-2xl text-neutral-900"
                  style={{ background: YELLOW }}
                >
                  <Icon d={ICONS.phone} />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: YELLOW }}
                  />
                  Beta
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                Calls
              </h3>
              <p className="mt-2 leading-relaxed text-neutral-400">
                Call your circle from inside Kokohor. Calling is in beta, so it’s
                still being improved and may change.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={rm ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={rm ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar label={active.caller.avatar} bg={active.caller.bg} />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-neutral-900 bg-emerald-400" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-white">
                      {active.caller.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {active.caller.status}
                    </p>
                  </div>
                </div>

                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <Icon d={ICONS.phone} className="h-4 w-4" />
                </span>
              </motion.div>
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      {/* Circle Controls */}
      <div className="mx-auto mt-5 max-w-6xl px-6">
        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="grid gap-6 rounded-[2rem] border border-amber-200/80 p-8 md:grid-cols-3 md:gap-8 md:p-10"
          style={{ background: YELLOW_SOFT }}
        >
          {[
            {
              icon: ICONS.users,
              t: "Separate groups",
              b: "Family, classmates and work never mix unless you want them to.",
            },
            {
              icon: ICONS.lock,
              t: "Private by design",
              b: "Only invited members can see a circle’s posts and chats.",
            },
            {
              icon: ICONS.plus,
              t: "Grow at your pace",
              b: "Invite people one by one and add as many circles as you need.",
            },
          ].map((x) => (
            <div key={x.t} className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/80 text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <Icon d={x.icon} className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-semibold text-neutral-900">{x.t}</h4>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                  {x.b}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Download CTA */}
      <div id="download" className="mx-auto mt-8 max-w-6xl px-6">
        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-amber-300/70 p-8 text-center shadow-[0_18px_45px_-24px_rgba(232,152,28,0.45)] md:flex-row md:p-10 md:text-left"
          style={{ background: YELLOW }}
        >
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
              Bring your people together
            </h3>
            <p className="mt-1.5 text-neutral-800">
              Available now on Android. iOS is coming soon.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <PlayButton />
            <IosSoon />
          </div>
        </motion.div>
      </div>
    </section>
  );
}