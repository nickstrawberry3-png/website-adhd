import './loader-progressive-bar.css'

type Props = {
  /** 0 to 1 */
  value: number
  label: string
  valueText?: string
}

export default function LoaderProgressiveBar({ value, label, valueText }: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      className="lpb-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-valuetext={valueText}
    >
      <div className="lpb-fill" style={{ width: `${pct}%` }}>
        <div className="lpb-stripes" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
