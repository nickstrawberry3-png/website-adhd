import NeuroNoise from '@/components/NeuroNoise'

/** Moving Neuro Noise lines fixed behind the whole page. */
export default function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(90%_70%_at_30%_20%,#123a66,#05080d_70%)]"
    >
      <NeuroNoise maxPixelRatio={1} />
      <div className="absolute inset-0 bg-ink/55" />
    </div>
  )
}
