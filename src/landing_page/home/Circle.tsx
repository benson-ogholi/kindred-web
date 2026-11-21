import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Avatar, Icon, ICONS, IosSoon, PlayButton, YELLOW } from "./shared";
import { LINE, NAVY, PAPER, Rings, Small, Wrap } from "./editorial";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const circleTypes = [
  {
    name: "Relatives",
    note: "Parents, siblings, cousins, in-laws",
    members: "14 members",
    author: {
      name: "Tunde Kalu",
      avatar: "TK",
      bg: "bg-sky-300",
      time: "Okoye Family · 2h ago",
    },
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
    caller: {
      name: "Ada Okoye",
      avatar: "AO",
      bg: "bg-amber-300",
      status: "Ringing…",
    },
  },
  {
    name: "Classmates",
    note: "Old school and university friends",
    members: "32 members",
    author: {
      name: "Chidi J.",
      avatar: "CJ",
      bg: "bg-emerald-300",
      time: "Class of '16 · 4h ago",
    },
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
    caller: {
      name: "Musa Abdullahi",
      avatar: "MA",
      bg: "bg-sky-300",
      status: "Connected · 02:14",
    },
  },
  {
    name: "Office",
    note: "Teams, departments, coworkers",
    members: "11 members",
    author: {
      name: "Benson O.",
      avatar: "BO",
      bg: "bg-amber-300",
      time: "Core Product · 1h ago",
    },
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
    caller: {
      name: "Ikenna Ibeneme",
      avatar: "II",
      bg: "bg-rose-300",
      status: "Ringing…",
    },
  },
  {
    name: "Business",
    note: "Partners, staff and clients",
    members: "19 members",
    author: {
      name: "Ngozi E.",
      avatar: "NE",
      bg: "bg-rose-300",
      time: "Suppliers & Ops · 5h ago",
    },
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
    caller: {
      name: "Kelechi Ulu",
      avatar: "KU",
      bg: "bg-emerald-300",
      status: "Connected · 05:41",
    },
  },
  {
    name: "Community",
    note: "Church, mosque, clubs, neighbours",
    members: "48 members",
    author: {
      name: "Elder Sam",
      avatar: "ES",
      bg: "bg-amber-300",
      time: "Estate & Welfare · 3h ago",
    },
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
    caller: {
      name: "Amaka N.",
      avatar: "AN",
      bg: "bg-sky-300",
      status: "Ringing…",
    },
  },
];

const controls = [
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
];

const wave = [6, 12, 8, 17, 13, 21, 10, 15, 7, 19, 12, 8, 16, 10, 6, 14, 10];

/* A feature panel inside the stage */
function Panel({
  className = "",
  delay = 0,
  tone = "white",
  icon,
  label,
  title,
  body,
  chip,
  children,
}: {
  className?: string;
  delay?: number;
  tone?: "white" | "yellow";
  icon: string;
  label: string;
  title: string;
  body: string;
  chip?: ReactNode;
  children: ReactNode;
}) {
  const rm = !!useReducedMotion();
  const yellow = tone === "yellow";
  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={`flex flex-col justify-between rounded-2xl p-6 text-neutral-900 sm:p-8 ${className}`}
      style={{ background: yellow ? YELLOW : "#fff" }}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-3">
            <span
              className={`grid h-10 w-10 place-items-center rounded-full ${yellow ? "bg-neutral-900 text-white" : ""}`}
              style={yellow ? undefined : { background: YELLOW }}
            >
              <Icon d={icon} className="h-4 w-4" />
            </span>
            <span className="text-xs font-medium">/{label.toUpperCase()}/</span>
          </span>
          {chip}
        </div>
        <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
          {title}
        </h3>
        <p
          className={`mt-2 max-w-md text-sm leading-relaxed ${yellow ? "text-neutral-800" : "text-neutral-600"}`}
        >
          {body}
        </p>
      </div>
      <div className="mt-7">{children}</div>
    </motion.div>
  );
}

const Chip = ({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) => (
  <span
    className={`rounded-full px-3 py-1 text-[11px] font-medium ${
      dark
        ? "border border-neutral-900/25 text-neutral-900"
        : "bg-[#F3F3F1] text-neutral-600"
    }`}
  >
    {children}
  </span>
);

export default function Circles() {
  const rm = !!useReducedMotion();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [votedIdx, setVotedIdx] = useState<number | null>(0);
  const [playingVoice, setPlayingVoice] = useState(false);

  const active = circleTypes[selectedIdx];
  const ringing = active.caller.status.startsWith("Ringing");

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

  // Live poll percentages
  const adjustedOptions = active.pollOptions.map((opt, idx) => ({
    ...opt,
    votes: opt.votes + (votedIdx === idx ? 1 : 0),
  }));
  const totalVotes = adjustedOptions.reduce((sum, o) => sum + o.votes, 0);

  const swap = {
    initial: rm ? (false as const) : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: rm ? undefined : { opacity: 0, y: -8 },
    transition: { duration: 0.25 },
  };

  return (
    <section
      id="circles"
      style={{ background: PAPER }}
      className="text-neutral-900"
    >
      <Wrap className="pb-8 pt-20 md:pt-28">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="text-xs font-medium">/CIRCLES/</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl">
              Family is bigger than one household.
            </h2>
          </div>
          <Small className="max-w-sm md:pb-2">
            Create a circle for anyone who matters: relatives, old classmates,
            your office or your business. Each circle has its own members, news
            and conversations.
          </Small>
        </div>

        {/* Circle tabs */}
        <div className="mt-14">
          <div
            role="tablist"
            aria-label="Circle types"
            className={`flex gap-7 overflow-x-auto border-b sm:gap-12 ${LINE}`}
          >
            {circleTypes.map((c, i) => {
              const on = i === selectedIdx;
              return (
                <button
                  key={c.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => handleSelectCircle(i)}
                  className={`relative shrink-0 pb-4 text-2xl font-semibold tracking-[-0.04em] transition-colors sm:text-4xl ${
                    on
                      ? "text-neutral-900"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {c.name}
                  {on && (
                    <motion.span
                      layoutId="circle-underline"
                      className="absolute inset-x-0 -bottom-px h-[3px]"
                      style={{ background: YELLOW }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <AnimatePresence mode="wait">
              <motion.p
                key={active.name}
                {...swap}
                className="text-neutral-600"
              >
                {active.note}
              </motion.p>
            </AnimatePresence>
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              <Icon d={ICONS.users} className="h-4 w-4" />
              {active.members}
            </span>
          </div>
        </div>
      </Wrap>

      {/* Stage */}
      <Wrap className="pb-6">
        <div
          className="relative overflow-hidden rounded-3xl p-3 sm:p-6"
          style={{ background: NAVY }}
        >
          <Rings />
          <div className="relative grid gap-3 sm:gap-4 lg:grid-cols-12">
            {/* News */}
            <Panel
              className="lg:col-span-7"
              icon={ICONS.news}
              label="News"
              title="News for the whole group"
              body="Post announcements that every member of the circle sees. Good news, family events, office updates or reminders, all in one feed."
              chip={<Chip>{active.name} feed</Chip>}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.name}
                  {...swap}
                  className="rounded-xl p-4"
                  style={{ background: PAPER }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      label={active.author.avatar}
                      bg={active.author.bg}
                    />
                    <div>
                      <p className="text-sm font-semibold">
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
                  <div className="mt-3.5 flex items-center gap-4 border-t border-neutral-300/70 pt-3 text-xs text-neutral-500">
                    <button
                      type="button"
                      onClick={() => setLiked((v) => !v)}
                      aria-pressed={liked}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-colors ${
                        liked
                          ? "bg-neutral-900 text-white"
                          : "hover:bg-neutral-200 hover:text-neutral-900"
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
            </Panel>

            {/* Polls */}
            <Panel
              className="lg:col-span-5"
              delay={0.08}
              icon={ICONS.poll}
              label="Polls"
              title="Polls that settle things"
              body="Ask the group and see answers as they come in. Pick a date, a venue or a decision without a long chain of messages."
              chip={<Chip>Tap to vote</Chip>}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.name}
                  {...swap}
                  className="rounded-xl p-4"
                  style={{ background: PAPER }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {active.pollQuestion}
                    </p>
                    <span className="shrink-0 text-[11px] text-neutral-500">
                      {totalVotes} votes
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {adjustedOptions.map((o, idx) => {
                      const pct = Math.round((o.votes / totalVotes) * 100);
                      const picked = votedIdx === idx;
                      return (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => setVotedIdx(idx)}
                          className="group block w-full text-left"
                        >
                          <div className="flex justify-between text-xs">
                            <span
                              className={`inline-flex items-center gap-1.5 font-medium ${picked ? "text-neutral-900" : "text-neutral-600 group-hover:text-neutral-900"}`}
                            >
                              {picked && (
                                <Icon d={ICONS.check} className="h-3 w-3" />
                              )}
                              {o.label}
                            </span>
                            <span className="font-semibold">{pct}%</span>
                          </div>
                          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#E1E1DD]">
                            <motion.div
                              className="h-full rounded-full"
                              initial={false}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: rm ? 0 : 0.45,
                                ease: EASE,
                              }}
                              style={{
                                background: picked ? YELLOW : "#B9B9B3",
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Panel>

            {/* Chats */}
            <Panel
              className="lg:col-span-5"
              delay={0.04}
              icon={ICONS.chat}
              label="Chats"
              title="Chats and voice notes"
              body="Message one person or a whole circle. Record a voice note when typing is slow, and keep every conversation in the right group."
            >
              <div
                className="space-y-3 rounded-xl p-4"
                style={{ background: PAPER }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.name}
                    initial={rm ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={rm ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm text-neutral-800"
                  >
                    {active.chatQuestion}
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => setPlayingVoice((p) => !p)}
                  aria-label={
                    playingVoice ? "Pause voice note" : "Play voice note"
                  }
                  className="ml-auto flex max-w-[90%] items-center gap-3 rounded-2xl rounded-br-sm px-4 py-2.5 transition hover:brightness-[1.03] active:scale-[0.99]"
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
                            ? { height: [h + 4, Math.max(5, 22 - h), h + 4] }
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
            </Panel>

            {/* Calls */}
            <Panel
              className="lg:col-span-7"
              delay={0.12}
              tone="yellow"
              icon={ICONS.phone}
              label="Calls"
              title="Call your circle from inside Kokohor."
              body="Calling is in beta, so it’s still being improved and may change."
              chip={<Chip dark>Beta</Chip>}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.name}
                  {...swap}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/70 p-4 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {ringing && !rm && (
                        <motion.span
                          className="absolute inset-0 rounded-full border-2 border-neutral-900"
                          animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                      )}
                      <Avatar
                        label={active.caller.avatar}
                        bg={active.caller.bg}
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold">{active.caller.name}</p>
                      <p className="text-xs text-neutral-600">
                        {active.caller.status}
                      </p>
                    </div>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 text-white">
                    <Icon d={ICONS.phone} className="h-4 w-4" />
                  </span>
                </motion.div>
              </AnimatePresence>
            </Panel>
          </div>
        </div>
      </Wrap>

      {/* Circle controls */}
      <Wrap className="py-16 md:py-24">
        <div className="grid gap-10 sm:grid-cols-3">
          {controls.map((x, i) => (
            <motion.div
              key={x.t}
              initial={rm ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className={`border-t pt-5 ${LINE}`}
            >
              <Icon d={x.icon} className="h-5 w-5" />
              <h4 className="mt-4 text-lg font-semibold tracking-[-0.02em]">
                {x.t}
              </h4>
              <Small className="mt-1.5 max-w-xs">{x.b}</Small>
            </motion.div>
          ))}
        </div>
      </Wrap>

      {/* Download CTA, full-bleed */}
      <div id="download" style={{ background: YELLOW }}>
        <Wrap className="flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end md:py-20">
          <div>
            <h3 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
              Bring your people together.
            </h3>
            <p className="mt-4 text-sm text-neutral-800">
              Available now on Android. iOS is coming soon.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PlayButton />
            <IosSoon />
          </div>
        </Wrap>
      </div>
    </section>
  );
}
