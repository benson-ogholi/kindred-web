
import { motion } from "framer-motion";
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
    tint: "bg-[#FFF8E7]",
    border: "border-amber-200/60",
  },
  {
    name: "Classmates",
    note: "Old school and university friends",
    tint: "bg-[#F0F7FF]",
    border: "border-blue-200/60",
  },
  {
    name: "Office",
    note: "Teams, departments, coworkers",
    tint: "bg-[#F8F0FF]",
    border: "border-purple-200/60",
  },
  {
    name: "Business",
    note: "Partners, staff and clients",
    tint: "bg-[#F0FFF4]",
    border: "border-emerald-200/60",
  },
  {
    name: "Community",
    note: "Church, mosque, clubs, neighbours",
    tint: "bg-[#FFF0F3]",
    border: "border-pink-200/60",
  },
];

const wave = [5, 10, 7, 15, 11, 19, 9, 13, 6, 17, 10, 7, 14, 8, 5, 12, 9];

export default function Circles() {
  return (
    <section id="circles" className="bg-[#F4F4F2] py-24">
      <SectionHeading
        title="Family is bigger than one household"
        body="Create a circle for anyone who matters: relatives, old classmates, your office or your business. Each circle has its own members, news and conversations."
      />

      {/* Circle types */}
      <div className="mx-auto mt-12 grid max-w-6xl gap-3 px-6 sm:grid-cols-2 lg:grid-cols-5">
        {circleTypes.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={`rounded-3xl bg-white p-5 border ${c.border} ${c.tint}`}
          >
            <span
              className="inline-block rounded-full px-3.5 py-1 text-sm font-semibold text-neutral-900"
              style={{ background: YELLOW }}
            >
              {c.name}
            </span>
            <p className="mt-3 text-sm text-neutral-600">{c.note}</p>
          </motion.div>
        ))}
      </div>

      {/* News + Polls */}
      <div className="mx-auto mt-8 grid max-w-6xl gap-5 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full rounded-[2rem] border border-neutral-200/70 bg-white p-8">
            <IconBadge d={ICONS.news} />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
              News for the whole group
            </h3>
            <p className="mt-2 text-neutral-600">
              Post announcements that every member of the circle sees. Good
              news, family events, office updates or reminders, all in one feed.
            </p>
            <div className="mt-6 rounded-2xl border border-amber-200/60 bg-[#FFF8E7] p-4">
              <div className="flex items-center gap-3">
                <Avatar label="TK" bg="bg-sky-300" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Tunde Kalu
                  </p>
                  <p className="text-xs text-neutral-500">
                    Okoye Family · 2h ago
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-800">
                Family reunion is confirmed for December 27. Please update your
                travel plans.
              </p>
              <div className="mt-3 flex gap-3 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1">
                  <Icon d={ICONS.heart} className="h-3.5 w-3.5" /> 24
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon d={ICONS.chat} className="h-3.5 w-3.5" /> 9
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="h-full rounded-[2rem] border border-neutral-200/70 bg-white p-8">
            <IconBadge d={ICONS.poll} />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
              Polls that settle things
            </h3>
            <p className="mt-2 text-neutral-600">
              Ask the group and see answers as they come in. Pick a date, a
              venue or a decision without a long chain of messages.
            </p>
            <div className="mt-6 rounded-2xl border border-blue-200/60 bg-[#F0F7FF] p-4">
              <p className="text-sm font-semibold text-neutral-900">
                Where should we hold the reunion?
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  { l: "Port Harcourt", v: 58 },
                  { l: "Abuja", v: 27 },
                  { l: "Lagos", v: 15 },
                ].map((o) => (
                  <div key={o.l}>
                    <div className="flex justify-between text-xs text-neutral-600">
                      <span>{o.l}</span>
                      <span>{o.v}%</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full border border-neutral-200/60 bg-white">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${o.v}%`, background: YELLOW }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Chats + Calls */}
      <div className="mx-auto mt-5 grid max-w-6xl gap-5 px-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-3"
        >
          <Card className="h-full rounded-[2rem] border border-neutral-200/70 bg-white p-8">
            <IconBadge d={ICONS.chat} />
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
              Chats and voice notes
            </h3>
            <p className="mt-2 max-w-lg text-neutral-600">
              Message one person or a whole circle. Record a voice note when
              typing is slow, and keep every conversation in the right group.
            </p>
            <div className="mt-6 space-y-3 rounded-2xl border border-purple-200/60 bg-[#F8F0FF] p-4">
              <div className="max-w-[75%] rounded-2xl rounded-bl-md border border-neutral-200/60 bg-white px-4 py-2.5 text-sm text-neutral-800">
                Did everyone get the reunion date?
              </div>
              <div
                className="ml-auto flex max-w-[75%] items-center gap-3 rounded-2xl rounded-br-md px-4 py-2.5 text-neutral-900"
                style={{ background: YELLOW }}
              >
                <Icon d={ICONS.mic} className="h-4 w-4" />
                <div className="flex h-6 items-end gap-0.5" aria-hidden>
                  {wave.map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-neutral-900/70"
                      style={{ height: h + 4 }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium">0:14</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full rounded-[2rem] border border-neutral-800 bg-neutral-900 p-8 text-white">
            <div className="flex items-center justify-between">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl text-neutral-900"
                style={{ background: YELLOW }}
              >
                <Icon d={ICONS.phone} />
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                Beta
              </span>
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
              Calls
            </h3>
            <p className="mt-2 text-neutral-400">
              Call your circle from inside Kokohor. Calling is in beta, so it’s
              still being improved and may change.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <Avatar label="AO" bg="bg-amber-300" />
              <div className="text-sm">
                <p className="font-semibold text-white">Ada Okoye</p>
                <p className="text-xs text-neutral-400">Calling…</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Circle controls */}
      <div className="mx-auto mt-5 max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 rounded-[2rem] border border-amber-200/60 p-8 md:grid-cols-3 md:gap-8 md:p-10"
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
            <div key={x.t} className="flex gap-4">
              <span className="mt-0.5 text-neutral-900">
                <Icon d={x.icon} className="h-6 w-6" />
              </span>
              <div>
                <h4 className="font-semibold text-neutral-900">{x.t}</h4>
                <p className="mt-1 text-sm text-neutral-700">{x.b}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Download CTA */}
      <div id="download" className="mx-auto mt-8 max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-amber-300/60 p-8 text-center md:flex-row md:p-10 md:text-left"
          style={{ background: YELLOW }}
        >
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
              Bring your people together
            </h3>
            <p className="mt-1 text-neutral-800">
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
