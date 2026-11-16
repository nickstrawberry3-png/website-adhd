import { useEffect, useRef } from 'react'

export const CALENDLY_PAGE = 'https://calendly.com/drnickstraw/free-20-minute-focus-audit'

const CALENDLY_URL = `${CALENDLY_PAGE}?hide_event_type_details=0&hide_gdpr_banner=1&background_color=0b1220&text_color=eef4fa&primary_color=1e90ff`

/** The Focus Audit booking calendar, shown inline on the page. */
export default function Calendly() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (document.querySelector('script[src*="assets.calendly.com"]')) return
    const s = document.createElement('script')
    s.src = 'https://assets.calendly.com/assets/external/widget.js'
    s.async = true
    ref.current!.appendChild(s)
  }, [])
  return (
    <div ref={ref}>
      <div
        className="calendly-inline-widget overflow-hidden rounded-2xl"
        data-url={CALENDLY_URL}
        style={{ minWidth: 320, height: 700 }}
      />
    </div>
  )
}
