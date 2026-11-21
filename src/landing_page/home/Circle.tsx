import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Avatar, Icon, ICONS, IosSoon, PlayButton, YELLOW } from "./shared";
import { LINE, NAVY, PAPER, Rings, Small, Wrap } from "./editorial";

const EASE = [0.2, 0.7, 0.2, 1] as const;

type CircleKey =
  | "Relatives"
  | "Classmates"
  | "Office"
  | "Business"
  | "Community";

interface CircleConfig {
  name: CircleKey;
  count: number;
  note: string;
  members: string;
  author: {
    name: string;
    avatar: string;
    bg: string;
    time: string;
  };
  post: string;
  sampleReply: string;
  likes: number;
  replies: number;
  pollQuestion: string;
  pollOptions: { label: string; votes: number }[];
  chatQuestion: string;
  caller: {
    name: string;
    avatar: string;
    bg: string;
    status: string;
  };
}

const circleTypes: CircleConfig[] = [
  {
    name: "Relatives",
    count: 14,
    note: "Parents, siblings, cousins, in-laws",
    members: "14 members",
    author: {
      name: "Tunde Kalu",
      avatar: "TK",
      bg: "bg-sky-300",
      time: "Okoye Family · 2h ago",
    },
    post: "Family reunion is confirmed for December 27. Please update your travel plans in the hub.",
    sampleReply: "Booked my flight for Dec 26—can’t wait to see everyone.",
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
    count: 32,
    note: "Old school and university friends",
    members: "32 members",
    author: {
      name: "Chidi J.",
      avatar: "CJ",
      bg: "bg-emerald-300",
      time: "Class of '16 · 4h ago",
    },
    post: "Ten-year anniversary dinner tickets are live! Drop your dietary preferences below.",
    sampleReply: "Two seats claimed—no shellfish for me.",
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
    count: 11,
    note: "Teams, departments, coworkers",
    members: "11 members",
    author: {
      name: "Benson O.",
      avatar: "BO",
      bg: "bg-amber-300",
      time: "Core Product · 1h ago",
    },
    post: "Sprint review moved to 3:00 PM today. Updated release checklist is pinned.",
    sampleReply: "Got it, design notes are already attached to the card.",
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
    count: 19,
    note: "Partners, staff and clients",
    members: "19 members",
    author: {
      name: "Ngozi E.",
      avatar: "NE",
      bg: "bg-rose-300",
      time: "Suppliers & Ops · 5h ago",
    },
    post: "Q4 inventory shipment cleared customs this morning. Delivery schedule attached.",
    sampleReply: "Warehouse bay 2 is open for morning offloading.",
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
    count: 48,
    note: "Church, mosque, clubs, neighbours",
    members: "48 members",
    author: {
      name: "Elder Sam",
      avatar: "ES",
      bg: "bg-amber-300",
      time: "Estate & Welfare · 3h ago",
    },
    post: "Monthly community sanitation and security briefing starts at 8:00 AM sharp.",
    sampleReply: "Lane 1 committee will bring extra bin bags.",
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

// Distinct motion per circle
function getCircleMotionProps(
  circle: CircleKey,
  slotIndex: number,
  rm: boolean,
) {
  if (rm) {
    return { initial: false as const, animate: { opacity: 1 } };
  }

  switch (circle) {
    case "Relatives":
      return {
        initial: { opacity: 0, y: 18, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: {
          type: "spring" as const,
          stiffness: 240,
          damping: 22,
          delay: slotIndex * 0.06,
        },
      };

    case "Classmates":
      return {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.36,
          delay: slotIndex * 0.07,
          ease: EASE,
        },
      };

    case "Office":
      return {
        initial: { opacity: 0, x: slotIndex % 2 === 0 ? -20 : 20 },
        animate: { opacity: 1, x: 0 },
        transition: {
          duration: 0.32,
          delay: slotIndex * 0.05,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      };

    case "Business":
      return {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 0.38,
          delay: slotIndex * 0.06,
          ease: EASE,
        },
      };

    case "Community":
      return {
        initial: { opacity: 0, y: 28, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: {
          type: "spring" as const,
          stiffness: 320,
          damping: 19,
          delay: slotIndex * 0.05,
        },
      };
  }
}

function Panel({
  className = "",
  circle,
  slotIndex,
  tone = "white",
  icon,
  label,
  title,
  body,
  chip,
  children,
}: {
  className?: string;
  circle: CircleKey;
  slotIndex: number;
  tone?: "white" | "yellow";
  icon: string;
  label: string;
  title: string;
  body: string;
  chip?: ReactNode;
  children: ReactNode;
}) {
  const rm = !!useReducedMotion();
  const isYellow = tone === "yellow";
  const motionProps = getCircleMotionProps(circle, slotIndex, rm);

  return (
    <motion.div
      key={`${circle}-${label}`}
      {...motionProps}
      className={`flex min-w-0 flex-col justify-between rounded-2xl p-6 text-neutral-900 sm:p-8 ${className}`}
      style={{ background: isYellow ? YELLOW : "#FFFFFF" }}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                isYellow ? "bg-neutral-900 text-white" : "text-neutral-900"
              }`}
              style={isYellow ? undefined : { background: YELLOW }}
            >
              <Icon d={icon} className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold tracking-wider">
              /{label.toUpperCase()}/
            </span>
          </span>
          {chip}
        </div>

        <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">
          {title}
        </h3>
        <p
          className={`mt-2.5 max-w-xl text-sm leading-relaxed ${
            isYellow ? "text-neutral-800" : "text-neutral-600"
          }`}
        >
          {body}
        </p>
      </div>

      <div className="mt-7 min-w-0">{children}</div>
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
    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
      dark
        ? "border border-neutral-900/25 bg-neutral-900/5 text-neutral-900"
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
  const [showReply, setShowReply] = useState(false);
  const [votedIdx, setVotedIdx] = useState<number | null>(0);
  const [playingVoice, setPlayingVoice] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  const active = circleTypes[selectedIdx];
  const baseRinging = active.caller.status.startsWith("Ringing");
  const ringing = baseRinging && !callConnected;
  const callStatusText =
    baseRinging && callConnected ? "Connected · 00:12" : active.caller.status;

  const handleSelectCircle = (idx: number) => {
    setSelectedIdx(idx);
    setLiked(false);
    setShowReply(false);
    setVotedIdx(0);
    setPlayingVoice(false);
    setCallConnected(false);
  };

  useEffect(() => {
    if (!playingVoice) return;
    const t = setTimeout(() => setPlayingVoice(false), 4000);
    return () => clearTimeout(t);
  }, [playingVoice]);

  const adjustedOptions = active.pollOptions.map((opt, idx) => ({
    ...opt,
    votes: opt.votes + (votedIdx === idx ? 1 : 0),
  }));
  const totalVotes = adjustedOptions.reduce((sum, o) => sum + o.votes, 0);

  const renderNewsCard = () => (
    <div className="rounded-xl p-5" style={{ background: PAPER }}>
      <div className="flex items-center gap-3">
        <Avatar label={active.author.avatar} bg={active.author.bg} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{active.author.name}</p>
          <p className="truncate text-xs text-neutral-500">
            {active.author.time}
          </p>
        </div>
      </div>
      <p className="mt-3.5 text-sm leading-relaxed text-neutral-800">
        {active.post}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-neutral-300/70 pt-3.5 text-xs text-neutral-500">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-colors ${
            liked
              ? "bg-neutral-900 text-white"
              : "bg-white/90 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
          }`}
        >
          <Icon d={ICONS.heart} className="h-3.5 w-3.5" />
          {active.likes + (liked ? 1 : 0)}
        </button>
        <button
          type="button"
          onClick={() => setShowReply((s) => !s)}
          aria-expanded={showReply}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 font-medium text-neutral-700 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
        >
          <Icon d={ICONS.chat} className="h-3.5 w-3.5" />
          {active.replies + (showReply ? 1 : 0)} replies
        </button>
      </div>
      {showReply && (
        <div className="mt-3.5 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-xs leading-relaxed text-neutral-700">
          <span className="font-semibold text-neutral-900">
            Reply preview:{" "}
          </span>
          {active.sampleReply}
        </div>
      )}
    </div>
  );

  const renderPollCard = () => (
    <div className="rounded-xl p-5" style={{ background: PAPER }}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-snug">
          {active.pollQuestion}
        </p>
        <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
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
              className={`group block w-full rounded-lg p-2 text-left transition-colors ${
                picked ? "bg-white" : "hover:bg-white/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className={`inline-flex items-center gap-1.5 font-medium ${
                    picked
                      ? "text-neutral-900"
                      : "text-neutral-600 group-hover:text-neutral-900"
                  }`}
                >
                  {picked && <Icon d={ICONS.check} className="h-3.5 w-3.5" />}
                  {o.label}
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {pct}%{" "}
                  <span className="font-normal text-neutral-400">
                    ({o.votes})
                  </span>
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E1E1DD]">
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
    </div>
  );

  const renderChatCard = () => (
    <div className="space-y-3.5 rounded-xl p-5" style={{ background: PAPER }}>
      <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-relaxed text-neutral-800 shadow-xs">
        {active.chatQuestion}
      </div>

      <button
        type="button"
        onClick={() => setPlayingVoice((p) => !p)}
        aria-label={playingVoice ? "Pause voice note" : "Play voice note"}
        aria-pressed={playingVoice}
        className="ml-auto flex max-w-[95%] items-center gap-3 rounded-2xl rounded-br-sm px-4 py-3 transition hover:brightness-[1.03] active:scale-[0.99]"
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
        <span className="shrink-0 text-xs font-semibold tabular-nums">
          {playingVoice ? "Playing" : "0:14"}
        </span>
      </button>
    </div>
  );

  const renderCallCard = () => (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/85 p-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="relative shrink-0">
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
          <Avatar label={active.caller.avatar} bg={active.caller.bg} />
        </div>
        <div className="min-w-0 text-sm">
          <p className="truncate font-semibold">{active.caller.name}</p>
          <p className="truncate text-xs text-neutral-600">{callStatusText}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCallConnected((c) => !c)}
        aria-label={
          baseRinging
            ? callConnected
              ? "End simulated call"
              : "Answer simulated call"
            : "Circle call status"
        }
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-neutral-900 text-white transition hover:scale-105 active:scale-95"
      >
        <Icon d={ICONS.phone} className="h-4 w-4" />
      </button>
    </div>
  );

  // Optimized layouts per circle – no shadows, clean spacing, better breathing room
  const renderCircleDisplay = (c: CircleConfig) => {
    switch (c.name) {
      case "Relatives":
        return (
          <div className="relative grid gap-5 sm:gap-6 md:grid-cols-12">
            <Panel
              circle="Relatives"
              slotIndex={0}
              className="md:col-span-6 md:row-span-2"
              icon={ICONS.news}
              label="News"
              title="Family news that brings everyone in"
              body="Share reunion plans, milestones and family updates with relatives in one private feed."
              chip={<Chip>Family feed</Chip>}
            >
              {renderNewsCard()}
            </Panel>

            <Panel
              circle="Relatives"
              slotIndex={1}
              className="md:col-span-6"
              icon={ICONS.poll}
              label="Polls"
              title="Settle dates together"
              body="Vote on venues and dates without endless back-and-forth threads."
              chip={<Chip>Tap to vote</Chip>}
            >
              {renderPollCard()}
            </Panel>

            <Panel
              circle="Relatives"
              slotIndex={2}
              className="md:col-span-6"
              icon={ICONS.chat}
              label="Chats"
              title="Voice notes for elders and busy days"
              body="Send quick voice notes or check in with family at any hour."
            >
              {renderChatCard()}
            </Panel>

            <Panel
              circle="Relatives"
              slotIndex={3}
              tone="yellow"
              className="md:col-span-12"
              icon={ICONS.phone}
              label="Calls"
              title="Call relatives from inside Kokohor."
              body="Calling is in beta, so it’s still being improved and may change."
              chip={<Chip dark>Beta</Chip>}
            >
              {renderCallCard()}
            </Panel>
          </div>
        );

      case "Classmates":
        return (
          <div className="relative grid gap-5 sm:gap-6 md:grid-cols-2">
            <Panel
              circle="Classmates"
              slotIndex={0}
              icon={ICONS.poll}
              label="Polls"
              title="Alumni weekend & meetup votes"
              body="Pick dates and locations fast with live circle tallies."
              chip={<Chip>Live poll</Chip>}
            >
              {renderPollCard()}
            </Panel>

            <Panel
              circle="Classmates"
              slotIndex={1}
              icon={ICONS.news}
              label="News"
              title="Reunion drops & class updates"
              body="Keep everyone on the same page for dinners, trips and milestones."
              chip={<Chip>Class of '16</Chip>}
            >
              {renderNewsCard()}
            </Panel>

            <Panel
              circle="Classmates"
              slotIndex={2}
              icon={ICONS.chat}
              label="Chats"
              title="Banter and voice notes"
              body="Catch up with old schoolmates in one dedicated space."
            >
              {renderChatCard()}
            </Panel>

            <Panel
              circle="Classmates"
              slotIndex={3}
              tone="yellow"
              icon={ICONS.phone}
              label="Calls"
              title="Quick catch-up calls."
              body="Calling is in beta, so it’s still being improved and may change."
              chip={<Chip dark>Beta</Chip>}
            >
              {renderCallCard()}
            </Panel>
          </div>
        );

      case "Office":
        return (
          <div className="relative grid gap-5 sm:gap-6 md:grid-cols-12">
            <Panel
              circle="Office"
              slotIndex={0}
              tone="yellow"
              className="md:col-span-7"
              icon={ICONS.phone}
              label="Calls"
              title="Direct voice check-ins."
              body="Calling is in beta, so it’s still being improved and may change."
              chip={<Chip dark>Beta</Chip>}
            >
              {renderCallCard()}
            </Panel>

            <Panel
              circle="Office"
              slotIndex={1}
              className="md:col-span-5"
              icon={ICONS.poll}
              label="Polls"
              title="Fast team decisions"
              body="Align on lunch spots, schedules or priorities in seconds."
              chip={<Chip>Team vote</Chip>}
            >
              {renderPollCard()}
            </Panel>

            <Panel
              circle="Office"
              slotIndex={2}
              className="md:col-span-7"
              icon={ICONS.news}
              label="News"
              title="Sprint & release announcements"
              body="Pin important schedule changes and checklists for the team."
              chip={<Chip>Core Product</Chip>}
            >
              {renderNewsCard()}
            </Panel>

            <Panel
              circle="Office"
              slotIndex={3}
              className="md:col-span-5"
              icon={ICONS.chat}
              label="Chats"
              title="Focused team threads"
              body="Keep work chats separate from family and personal circles."
            >
              {renderChatCard()}
            </Panel>
          </div>
        );

      case "Business":
        return (
          <div className="relative grid gap-5 sm:gap-6 md:grid-cols-12">
            <Panel
              circle="Business"
              slotIndex={0}
              className="md:col-span-12"
              icon={ICONS.news}
              label="News"
              title="Shipment & operations updates"
              body="Share customs clearances, schedules and business notices clearly across partners and staff."
              chip={<Chip>Suppliers & Ops</Chip>}
            >
              {renderNewsCard()}
            </Panel>

            <Panel
              circle="Business"
              slotIndex={1}
              className="md:col-span-4"
              icon={ICONS.poll}
              label="Polls"
              title="Dispatch windows"
              body="Confirm preferred drop-off times with partners."
              chip={<Chip>Ops poll</Chip>}
            >
              {renderPollCard()}
            </Panel>

            <Panel
              circle="Business"
              slotIndex={2}
              className="md:col-span-4"
              icon={ICONS.chat}
              label="Chats"
              title="Sign-offs & memos"
              body="Confirm approvals and voice notes on the move."
            >
              {renderChatCard()}
            </Panel>

            <Panel
              circle="Business"
              slotIndex={3}
              tone="yellow"
              className="md:col-span-4"
              icon={ICONS.phone}
              label="Calls"
              title="Partner & ops calls."
              body="Calling is in beta, so it’s still being improved and may change."
              chip={<Chip dark>Beta</Chip>}
            >
              {renderCallCard()}
            </Panel>
          </div>
        );

      case "Community":
        return (
          <div className="relative grid gap-5 sm:gap-6 md:grid-cols-12">
            <Panel
              circle="Community"
              slotIndex={0}
              className="md:col-span-7"
              icon={ICONS.news}
              label="News"
              title="Community-wide notices & schedules"
              body="Broadcast estate briefings, sanitation times and welfare updates to every member."
              chip={<Chip>Estate & Welfare</Chip>}
            >
              {renderNewsCard()}
            </Panel>

            <Panel
              circle="Community"
              slotIndex={1}
              className="md:col-span-5"
              icon={ICONS.poll}
              label="Polls"
              title="Priority votes"
              body="See what matters most to neighbours."
              chip={<Chip>Tap to vote</Chip>}
            >
              {renderPollCard()}
            </Panel>

            <Panel
              circle="Community"
              slotIndex={2}
              className="md:col-span-12"
              icon={ICONS.chat}
              label="Chats"
              title="Neighbourhood updates & voice notes"
              body="Share patrol schedules and quick updates with everyone."
            >
              {renderChatCard()}
            </Panel>

            <Panel
              circle="Community"
              slotIndex={3}
              tone="yellow"
              className="md:col-span-12"
              icon={ICONS.phone}
              label="Calls"
              title="Reach circle leads."
              body="Calling is in beta, so it’s still being improved and may change."
              chip={<Chip dark>Beta</Chip>}
            >
              {renderCallCard()}
            </Panel>
          </div>
        );
    }
  };

  const metaSwap = {
    initial: rm ? (false as const) : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: rm ? undefined : { opacity: 0, y: -6 },
    transition: { duration: 0.22, ease: EASE },
  };

  return (
    <section
      id="circles"
      style={{ background: PAPER }}
      className="text-neutral-900"
    >
      {/* Header & Circle Tabs */}
      <Wrap className="pb-10 pt-20 md:pt-28">
        <div className="grid gap-8 border-b pb-10 md:grid-cols-[1.45fr_1fr] md:items-end border-neutral-200">
          <div>
            <p className="text-xs font-semibold tracking-wider">/CIRCLES/</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl">
              Family is bigger than one household.
            </h2>
          </div>
          <Small className="max-w-sm md:pb-1">
            Create a circle for anyone who matters: relatives, old classmates,
            your office or your business. Each circle has its own members, news
            and conversations.
          </Small>
        </div>

        {/* Full-Width Circle Tab Bar */}
        <div className="mt-8">
          <div
            role="tablist"
            aria-label="Circle types"
            className={`flex gap-6 overflow-x-auto border-b sm:gap-10 ${LINE}`}
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
                  className={`relative flex shrink-0 items-baseline gap-2.5 pb-4 text-xl font-semibold tracking-[-0.035em] transition-colors sm:text-3xl ${
                    on
                      ? "text-neutral-900"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  <span>{c.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums tracking-normal ${
                      on
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-200/80 text-neutral-600"
                    }`}
                  >
                    {c.count}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="circle-underline"
                      transition={{ duration: rm ? 0 : 0.3, ease: EASE }}
                      className="absolute inset-x-0 -bottom-px h-[3px]"
                      style={{ background: YELLOW }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Spacious Active Circle Strip */}
          <div
            className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border bg-white/80 px-6 py-4 sm:flex-row sm:items-center"
            style={{ borderColor: "rgba(23,23,23,0.1)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                {...metaSwap}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
              >
                <span className="text-lg font-semibold tracking-[-0.025em] text-neutral-900">
                  {active.name}
                </span>
                <span className="text-sm text-neutral-600">{active.note}</span>
              </motion.div>
            </AnimatePresence>
            <span
              className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold text-neutral-900"
              style={{ background: YELLOW }}
            >
              <Icon d={ICONS.users} className="h-3.5 w-3.5" />
              {active.members}
            </span>
          </div>
        </div>
      </Wrap>

      {/* Full-Width Navy Stage – no shadows, extra padding for better layout breathing */}
      <Wrap className="pb-14">
        <div
          className="relative overflow-hidden rounded-3xl p-4 sm:p-10"
          style={{ background: NAVY }}
        >
          <Rings />
          <AnimatePresence mode="wait">
            <div key={active.name}>{renderCircleDisplay(active)}</div>
          </AnimatePresence>
        </div>
      </Wrap>

      {/* Roomy 3-Column Circle Controls */}
      <Wrap className="pb-20 md:pb-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {controls.map((x, i) => (
            <motion.div
              key={x.t}
              initial={rm ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className={`min-w-0 border-t pt-6 ${LINE}`}
            >
              <Icon d={x.icon} className="h-5 w-5" />
              <h4 className="mt-4 text-lg font-semibold tracking-[-0.02em]">
                {x.t}
              </h4>
              <Small className="mt-2 max-w-sm">{x.b}</Small>
            </motion.div>
          ))}
        </div>
      </Wrap>

      {/* Download CTA */}
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
