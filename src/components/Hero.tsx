import { useRef, useState } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'
import BookButton from '@/components/BookButton'

const VSL_SRC = 'https://pub-233d270a885f4fc3831fa6f418a2d596.r2.dev/VSL.mov'
const VSL_POSTER = 'https://pub-233d270a885f4fc3831fa6f418a2d596.r2.dev/WhatsApp%20Image%202026-06-03%20at%2021.33.19.jpeg'

const TRUST = [
  ['12', 'Weeks'],
  ['1:1', 'Private Coaching'],
  ['1×', 'Weekly Check-in'],
] as const

/** VSL with no timeline or time shown: big play button, tap to pause, sound toggle. */
function VslPlayer() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  const toggle = () => {
    const v = ref.current!
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  const toggleSound = () => {
    const v = ref.current!
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        src={VSL_SRC}
        poster={VSL_POSTER}
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        aria-label="How to Get Unstuck, video by Dr Nick Straw"
      />
      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/10"
        >
          <span className="flex size-24 items-center justify-center rounded-full bg-gold text-ink shadow-[0_10px_50px_-6px_rgba(255,215,0,0.7)] transition-transform hover:scale-105 sm:size-28">
            <Play className="ml-1.5 size-11 fill-current sm:size-12" aria-hidden="true" />
          </span>
        </button>
      )}
      {playing && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/70"
        >
          {muted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
        </button>
      )}
    </>
  )
}

export default function Hero() {
  return (
    <header className="relative isolate">

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-[max(3.5rem,env(safe-area-inset-top))] sm:px-8 sm:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-x-16 lg:gap-y-10 lg:pt-24">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-7 flex items-center gap-4 text-left [text-shadow:0_2px_16px_rgba(5,8,13,0.7)] lg:gap-5">
            <img src="/assets/profile-square.jpg" alt="Dr Nick Straw" width="112" height="112" className="size-18 shrink-0 rounded-2xl object-cover lg:size-24" />
            <div>
              <p className="font-serif text-[1.75rem] leading-tight text-white lg:text-[2.5rem]">Dr Nick Straw</p>
              <p className="text-sm font-semibold text-gold lg:mt-1 lg:text-lg">MBChB, BMedSci · Edinburgh Medical School</p>
              <p className="text-sm text-white/80 lg:text-[1.0625rem]">Former UK doctor with ADHD, licensed doctor in Australia.</p>
            </div>
          </div>

          <p className="liquid-glass rounded-full px-4 py-2 text-sm font-medium text-white/90">
            12-Week Frictionless Focus Programme for ADHD Business Owners
          </p>

          <h1 className="mt-6 text-[2.75rem] text-white [text-shadow:0_2px_24px_rgba(5,8,13,0.6)] sm:text-6xl lg:text-[4.25rem]">
            Break the Burnout Loop
            <br />
            in 12 Weeks
          </h1>

          <p className="mt-4 max-w-[30rem] text-lg font-medium text-white sm:text-xl">
            I help ADHD business owners break the Burnout Loop.
          </p>

          <p className="mt-5 max-w-[34rem] text-[1.0625rem] text-white/85 sm:text-lg">
            Work hard when there's a deadline → Crash → Waste the day → Feel guilty → Start over. Frictionless Focus
            fixes your energy first, then your systems, to break the cycle.
          </p>

          <BookButton className="mt-8" />

        </div>

        <div className="liquid-glass mx-auto w-full max-w-[360px] rounded-[30px] p-2 shadow-[0_0_120px_-20px_rgba(30,144,255,0.45)] sm:max-w-[380px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[400px]">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[24px] bg-black">
            <VslPlayer />
          </div>
        </div>

        <dl className="liquid-glass mx-auto grid w-full max-w-xl lg:col-start-1 lg:mx-0 lg:-mt-4 lg:self-start grid-cols-3 rounded-3xl px-2 py-5">
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
