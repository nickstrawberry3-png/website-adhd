import PageBackground from '@/components/PageBackground'
import SimpleHeader from '@/components/SimpleHeader'
import { CALENDLY_PAGE } from '@/components/Calendly'
import { RESOURCES } from './resources'

const ACCENTS = ['border-t-dodger', 'border-t-gold', 'border-t-sky', 'border-t-khaki', 'border-t-steel', 'border-t-dodger']

export default function App() {
  return (
    <>
      <PageBackground />
      <SimpleHeader />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="px-5 pb-12 pt-12 text-center sm:px-8 lg:pt-20">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-[0.9375rem] font-semibold text-sky">Free resources</p>
            <h1 className="text-[2.5rem] text-text sm:text-6xl">Free tools for ADHD business owners</h1>
            <p className="mt-5 text-[1.0625rem] text-muted sm:text-lg">
              Pick the one that fits what we're stuck on today. One is enough.
            </p>
          </div>
        </section>

        <section aria-label="Free resources" className="px-5 pb-20 sm:px-8">
          <ul className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r, i) => (
              <li
                key={r.keyword}
                className={`glass-panel flex flex-col rounded-3xl border-t-4 p-6 ${ACCENTS[i % ACCENTS.length]}`}
              >
                <p className="text-sm font-semibold text-khaki">{r.kind}</p>
                <h2 className="mt-2 text-[1.625rem] text-text">{r.name}</h2>
                <p className="mt-3 flex-1 text-[1.0625rem] text-muted">{r.blurb}</p>
                {r.url ? (
                  <a
                    href={r.url}
                    {...(r.url.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}
                    className="mt-6 inline-flex min-h-13 items-center justify-center rounded-full bg-dodger px-6 font-semibold text-ink transition-colors hover:bg-sky"
                  >
                    {r.button} →
                  </a>
                ) : (
                  <span className="mt-6 inline-flex min-h-13 items-center justify-center rounded-full border border-steel/60 px-6 font-semibold text-muted">
                    Coming soon
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="px-5 pb-24 text-center sm:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-[2.125rem] text-text sm:text-5xl">Want a plan made for you?</h2>
            <p className="mt-5 text-[1.0625rem] text-muted sm:text-lg">
              On a free Focus Audit call, we find which stage keeps breaking down for you and make a plan to get the
              money tasks done every week.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={CALENDLY_PAGE}
                className="inline-flex min-h-14 w-full max-w-[400px] items-center justify-center rounded-full bg-gold px-8 py-4 text-center text-[1.0625rem] font-bold text-ink shadow-[0_10px_40px_-12px_rgba(255,215,0,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5"
              >
                Book Your Free Focus Audit →
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 text-center">
        <p className="text-[0.8125rem] text-muted">© 2026 Dr Nick. All rights reserved.</p>
      </footer>
    </>
  )
}
