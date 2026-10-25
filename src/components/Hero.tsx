import BookButton from '@/components/BookButton'
import BrainBackdrop from '@/components/BrainBackdrop'

const VSL_SRC = 'https://pub-233d270a885f4fc3831fa6f418a2d596.r2.dev/VSL.mov'
const VSL_POSTER = 'https://pub-233d270a885f4fc3831fa6f418a2d596.r2.dev/WhatsApp%20Image%202026-06-03%20at%2021.33.19.jpeg'

const TRUST = [
  ['12', 'Weeks'],
  ['1:1', 'Private Coaching'],
  ['1×', 'Weekly Check-in'],
] as const

export default function Hero() {
  return (
    <header className="relative isolate">
      <BrainBackdrop />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-16 pt-[max(3.5rem,env(safe-area-inset-top))] text-center sm:px-8 sm:pt-20 lg:pt-24">
        <p className="liquid-glass rounded-full px-4 py-2 text-sm font-medium text-white/90">
          12-Week Frictionless Focus Programme for ADHD Entrepreneurs
        </p>

        <h1 className="mt-6 text-[2.75rem] text-white [text-shadow:0_2px_24px_rgba(5,8,13,0.6)] sm:text-6xl lg:text-[5.25rem]">
          Break the Burnout Loop
          <br />
          in 12 Weeks
        </h1>

        <p className="mt-4 max-w-[30rem] text-lg font-medium text-white sm:text-xl">
          I help ADHD entrepreneurs break the Burnout Loop.
        </p>

        <p className="mt-5 max-w-[34rem] text-[1.0625rem] text-white/85 sm:text-lg">
          Work hard when there's a deadline → Crash → Waste the day → Feel guilty → Start over. Frictionless Focus
          fixes your energy first, then your systems, to break the cycle.
        </p>
        <p className="mt-3 max-w-[30rem] text-[0.9375rem] text-white/75">
          By Dr Nick Straw, MBChB, BMedSci (Edinburgh Medical School). Former UK doctor with ADHD, licensed doctor
          in Australia.
        </p>

        <BookButton className="mt-8" />

        <div className="liquid-glass mt-10 w-full max-w-[360px] rounded-[30px] p-2 sm:max-w-[380px]">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[24px] bg-black">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={VSL_SRC}
              poster={VSL_POSTER}
              controls
              playsInline
              preload="metadata"
              aria-label="How to Get Unstuck, video by Dr Nick Straw"
            />
          </div>
        </div>

        <dl className="liquid-glass mt-12 grid w-full max-w-xl grid-cols-3 rounded-3xl px-2 py-5">
          {TRUST.map(([num, label]) => (
            <div key={label} className="flex flex-col-reverse items-center gap-1 px-1">
              <dt className="text-[0.8125rem] leading-snug text-white/75">{label}</dt>
              <dd className="font-serif text-[2rem] leading-none text-white">{num}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  )
}
