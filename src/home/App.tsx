import { useEffect, useState, type ReactNode } from 'react'
import { BookText, ChevronDown, Compass, Mail, Mic } from 'lucide-react'
import BrainBackdrop from '@/components/BrainBackdrop'
import PageBackground from '@/components/PageBackground'
import Nav from './Nav'
import { lines, plain, translations, type Lang } from './i18n'

const GUMROAD_URL = 'https://drnickyyy.gumroad.com/l/adhd-survival-guide'
const FORMSPREE_URL = 'https://formspree.io/f/mykleewg'

const Label = ({ children }: { children: ReactNode }) => (
  <p className="mb-3 text-[0.9375rem] font-semibold text-sky">{children}</p>
)

const h2 = 'text-[2.125rem] text-text sm:text-5xl'
const body = 'text-[1.0625rem] text-muted sm:text-lg'
const blueButton =
  'inline-flex min-h-13 items-center justify-center rounded-full bg-dodger px-7 font-semibold text-ink transition-colors hover:bg-sky'

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en'
  }, [lang])

  // Gumroad turns the ebook link into an in-page checkout once its script sees the link.
  useEffect(() => {
    if (document.querySelector('script[src*="gumroad.com/js"]')) return
    const s = document.createElement('script')
    s.src = 'https://gumroad.com/js/gumroad.js'
    s.async = true
    document.body.appendChild(s)
  }, [])

  const stats = [
    [t['stat-1-label'], t['stat-1-value']],
    [t['stat-2-label'], t['stat-2-value']],
    [t['stat-3-label'], t['stat-3-value']],
    [t['stat-4-label'], t['stat-4-value']],
  ] as const

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-text px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <PageBackground />
      <Nav lang={lang} onToggleLang={() => setLang((l) => (l === 'en' ? 'zh' : 'en'))} />

      <header id="home" className="relative isolate flex min-h-svh flex-col">
        <BrainBackdrop pauseButtonClassName="bottom-6 right-4 sm:right-6" />

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-28 pt-28 text-center sm:px-8">
          <p className="liquid-glass rounded-full px-4 py-2 text-sm font-medium text-white/90">{t['hero-eyebrow']}</p>

          <h1 className="mt-6 text-[2.75rem] text-white [text-shadow:0_2px_24px_rgba(5,8,13,0.6)] sm:text-6xl lg:text-[5.25rem]">
            {lines(t['hero-h1']).map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-[36rem] text-[1.0625rem] text-white/85 sm:text-lg">{t['hero-sub']}</p>

          <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
            <a
              href="/12-week-programme/"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-gold px-9 text-[1.0625rem] font-bold text-ink shadow-[0_10px_40px_-12px_rgba(255,215,0,0.55)] transition-transform hover:-translate-y-0.5"
            >
              {t['hero-cta1']}
            </a>
            <a
              href="#about"
              className="liquid-glass inline-flex min-h-14 items-center justify-center rounded-full px-9 text-[1.0625rem] font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t['hero-cta2']}
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-white/70" aria-hidden="true">
          <ChevronDown className="size-5" />
          <span className="text-xs">{t['hero-scroll']}</span>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        {/* Ebook */}
        <section id="ebook" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
          <div className="liquid-glass glass-panel mx-auto flex max-w-2xl flex-col items-center rounded-[32px] px-6 py-12 text-center sm:px-12">
            <p className="rounded-full border border-khaki/50 px-3.5 py-1 text-sm font-semibold text-khaki">
              {t['ebook-badge']}
            </p>
            <BookText className="mt-7 size-12 text-sky" strokeWidth={1.4} aria-hidden="true" />
            <h2 className={`${h2} mt-5`}>{t['ebook-title']}</h2>
            <p className={`${body} mt-4 max-w-lg`}>{t['ebook-sub']}</p>
            <a href={GUMROAD_URL} className={`${blueButton} mt-8`}>
              {t['ebook-cta']}
            </a>
            <p className="mt-4 text-sm text-muted">{t['ebook-note']}</p>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_7fr] lg:gap-16">
            <img
              src="/assets/profile.webp"
              alt="Dr Nick"
              width={2500}
              height={3750}
              loading="lazy"
              className="mx-auto aspect-[4/5] w-full max-w-[340px] rounded-3xl object-cover object-top lg:sticky lg:top-28 lg:max-w-none"
            />
            <div>
              <Label>{t['about-label']}</Label>
              <h2 className={h2}>{t['about-title']}</h2>
              <div className={`${body} mt-6 space-y-5`}>
                <p>{t['about-p1']}</p>
                <p>{t['about-p2']}</p>
                <p>{t['about-p3']}</p>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map(([label, value]) => (
                  <div key={label} className="glass-panel rounded-2xl border border-steel/35 p-4 sm:p-5">
                    <dt className="text-sm font-semibold text-khaki">{label}</dt>
                    <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-text/90">
                      {lines(value).map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Services. #coaching is kept because the dopamine audit page links to it. */}
        <div id="coaching" className="scroll-mt-24" aria-hidden="true" />
        <section id="services" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <Label>{t['services-label']}</Label>
            <h2 className={h2}>{t['services-title']}</h2>

            <div className="mt-10 grid gap-4 md:grid-cols-[3fr_2fr] lg:gap-5">
              <article className="glass-panel relative overflow-hidden rounded-3xl border border-sky/45 p-6 sm:p-8">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-dodger to-sky" aria-hidden="true" />
                <p className="text-sm font-semibold text-khaki">Featured Programme</p>
                <Compass className="mt-5 size-9 text-sky" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-4 text-[1.75rem] text-text">{t['s1-title']}</h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-text/85">{t['s1-body']}</p>
                <a href="/12-week-programme/" className={`${blueButton} mt-7`}>
                  See the Programme →
                </a>
              </article>

              <article className="glass-panel rounded-3xl border border-steel/35 p-6 sm:p-8">
                <Mic className="size-9 text-sky" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-4 text-[1.75rem] text-text">{t['s2-title']}</h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-text/85">{t['s2-body']}</p>
              </article>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <Label>{t['contact-label']}</Label>
            <h2 className={h2}>{t['contact-title']}</h2>
            <p className={`${body} mt-6`}>{t['contact-tagline']}</p>
          </div>

          <div id="get-in-touch" className="mx-auto mt-14 max-w-xl scroll-mt-24">
            <h2 className="text-center text-[1.875rem] text-text sm:text-4xl">{t['contact-me-title']}</h2>
            <form
              action={FORMSPREE_URL}
              method="POST"
              className="liquid-glass glass-panel mt-8 grid gap-5 rounded-[28px] p-5 sm:p-8"
            >
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-text">
                  {t['form-name']}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={t['form-placeholder-name']}
                  className="min-h-13 w-full rounded-xl border border-steel/55 bg-ink/60 px-4 text-base text-text placeholder:text-muted/70"
                />
              </div>
              <div>
                <label htmlFor="contact-email-input" className="mb-1.5 block text-sm font-medium text-text">
                  {t['form-email']}
                </label>
                <input
                  id="contact-email-input"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t['form-placeholder-email']}
                  className="min-h-13 w-full rounded-xl border border-steel/55 bg-ink/60 px-4 text-base text-text placeholder:text-muted/70"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-text">
                  {t['form-message']}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder={t['form-placeholder-message']}
                  className="w-full rounded-xl border border-steel/55 bg-ink/60 px-4 py-3 text-base text-text placeholder:text-muted/70"
                />
              </div>
              <button type="submit" className={blueButton}>
                {t['form-send']}
              </button>
            </form>

            <div className="mt-8 flex justify-center">
              <a
                href="mailto:nick@drnickstraw.com"
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[1.0625rem] text-sky hover:text-text"
              >
                <Mail className="size-4" aria-hidden="true" />
                nick@drnickstraw.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 text-center">
        <p className="text-[0.8125rem] text-muted">{plain(t.footer)}</p>
      </footer>
    </>
  )
}
