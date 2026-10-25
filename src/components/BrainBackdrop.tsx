import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import brainVideo from '@/assets/hero/brain-blue-720.mp4'
import brainPoster from '@/assets/hero/brain-blue-poster.jpg'

type Props = { pauseButtonClassName?: string }

/** Blue brain video pinned behind a hero; place inside a `relative isolate` container. */
export default function BrainBackdrop({ pauseButtonClassName = 'right-4 top-4 sm:right-6 sm:top-6' }: Props) {
  const bgRef = useRef<HTMLVideoElement>(null)
  const [bgPlaying, setBgPlaying] = useState(false)

  useEffect(() => {
    const v = bgRef.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!reduce.matches) v.play().catch(() => {})
    const onPlay = () => setBgPlaying(true)
    const onPause = () => setBgPlaying(false)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [])

  const toggleBg = () => {
    const v = bgRef.current!
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleBg}
        className={`liquid-glass absolute z-10 inline-flex size-11 items-center justify-center rounded-full text-white/85 hover:text-white ${pauseButtonClassName}`}
        aria-label={bgPlaying ? 'Pause background video' : 'Play background video'}
      >
        {bgPlaying ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
      </button>
      {/* Background video stays pinned while the hero content scrolls over it */}
      <div
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_calc(100%-16rem),transparent)]"
        aria-hidden="true"
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <video
            ref={bgRef}
            className="absolute inset-0 h-full w-full object-cover object-[38%_center]"
            src={brainVideo}
            poster={brainPoster}
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
          />
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,rgba(5,8,13,0.45),rgba(5,8,13,0.82))]" />
        </div>
      </div>
    </>
  )
}
