import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { translations, type Lang } from './i18n'

type Props = { lang: Lang; onToggleLang: () => void }

const APPLY = 'Apply for Coaching'

export default function Nav({ lang, onToggleLang }: Props) {
  const t = translations[lang]
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const behind = [...document.querySelectorAll<HTMLElement>('#home, #main, footer')]
    behind.forEach((el) => (el.inert = true))
    menuRef.current?.querySelector('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      behind.forEach((el) => (el.inert = false))
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const links = [
    ['#about', t['nav-about']],
    ['#services', t['nav-services']],
    ['#contact', t['nav-contact']],
  ] as const

  const langButton = (
    <button
      type="button"
      onClick={onToggleLang}
      lang={lang === 'en' ? 'zh-TW' : 'en'}
      aria-label={lang === 'en' ? '切換成中文' : 'Switch to English'}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/35 px-3.5 text-sm text-white transition-colors hover:border-white/70 hover:bg-white/10"
    >
      {lang === 'en' ? '中文' : 'EN'}
    </button>
  )

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-1.5 pl-5 pr-1.5 transition-[background-color,box-shadow] duration-300 ${
            scrolled ? 'liquid-glass glass-panel' : ''
          }`}
        >
          <a href="#home" className="font-serif text-2xl text-white">
            Dr Nick
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-4 py-2.5 text-[0.9375rem] font-medium text-white/80 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
            <a
              href="/12-week-programme/"
              className="ml-2 inline-flex min-h-11 items-center rounded-full bg-gold px-5 text-[0.9375rem] font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              {APPLY}
            </a>
            <span className="ml-2">{langButton}</span>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {langButton}
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="liquid-glass relative z-50 inline-flex size-11 items-center justify-center rounded-full text-white"
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-7 bg-ink/90 px-6 backdrop-blur-xl md:hidden"
      >
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)} className="text-3xl font-medium text-white">
            {label}
          </a>
        ))}
        <a
          href="/12-week-programme/"
          onClick={() => setOpen(false)}
          className="mt-3 inline-flex min-h-14 items-center rounded-full bg-gold px-8 text-lg font-bold text-ink"
        >
          {APPLY}
        </a>
      </div>
    </>
  )
}
