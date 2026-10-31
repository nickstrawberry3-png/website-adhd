import { useEffect, useRef, type ReactNode } from 'react'
import Hero from '@/components/Hero'
import Quiz from '@/components/Quiz'
import PageBackground from '@/components/PageBackground'
import BookButton from '@/components/BookButton'

const CALENDLY_URL =
  'https://calendly.com/drnickstraw/audit?hide_event_type_details=0&hide_gdpr_banner=1&background_color=0b1220&text_color=eef4fa&primary_color=1e90ff'

const PROBLEMS = [
  '"When there\'s a deadline, I get it all done. But the next day, I\'m depleted."',
  '"I can see a lot of opportunities in my business, but I don\'t know how to act on them."',
  '"The admin keeps piling up, and I keep putting it off."',
  '"I\'ve tried medication, apps, planners, timers and time blocking. Some helped for a while. Yet, none of it lasted."',
  '"I know I\'m smart and capable. But I\'m just tired of fighting myself to get things done."',
]

const STAGES = [
  {
    n: 'Stage 01',
    title: 'Fuel (Weeks 1 to 4)',
    desc: 'Get your energy back first. Sleep, environment and the first hour of your day, with the First Hour Reset.',
  },
  {
    n: 'Stage 02',
    title: 'Focus (Weeks 5 to 8)',
    desc: 'Capture everything, choose what matters, protect the time, and start and finish your work. The Spark Check helps you get started on days when motivation is missing.',
  },
  {
    n: 'Stage 03',
    title: 'Finish (Weeks 9 to 12)',
    desc: 'Make it last with The Burnout Loop Breaker which spots the crash before it happens, and your Bad Week Plan means one bad week no longer sends you back to zero.',
  },
]

const MORE_RESULTS = [
  {
    heading: 'From not picking up the camera to booking shoots again in 3 weeks',
    body: 'A photographer had almost stopped taking bookings, stopped posting her work, and said she would forget she even had the equipment. Within 3 weeks of starting the Fuel, Focus, Finish Method she reached out to past contacts, posted her work again, booked 2 shoots and had 4 more waiting on dates. She also put her website back online and cleared out her office, while helping her parents move house.',
    // PLACEHOLDER: her quote goes here once she gives permission.
  },
  {
    heading: 'From 5 years of putting off billing to starting the same week',
    body: 'A retired engineer had been putting off billing for years of work on a family building, worth tens of thousands of dollars. On the first call we broke it into small steps and set clear rules for how to count her time, and she started billing the same week.',
  },
  {
    heading: 'From failing a module to top marks',
    body: 'A medical student was getting D grades and close to dropping out. She is now getting mostly As and Bs, and got the top mark in a module she had failed. In her words, she "stopped waiting to feel motivated."',
  },
]

const TESTIMONIALS = [
  {
    quotes: [
      '"Before, I felt depressed and lost. I could see a lot of opportunities but didn\'t know how to execute them. Now I feel confident and capable. The programme helped me get my priorities straight and start small."',
      '"Just do it. Having someone keep reminding me and holding me accountable made all the difference."',
    ],
    who: 'Emma, nail salon owner',
  },
  {
    quotes: [
      '"When we first started working together I felt like I was always fighting with myself. I stopped waiting to feel motivated all the time and started understanding that showing up even on the difficult days is what really makes the difference."',
      '"I don\'t let one bad day convince me that I\'m failing. I feel happier, more at peace with myself, more consistent and much more confident."',
    ],
    who: 'Sarah, 12-week client',
  },
  {
    quotes: [
      '"Sleep in particular was something I used to overlook, but now I realize how much of an impact it has on ADHD. I feel a clear improvement after working with Nick."',
      '"It felt like a gentle form of accountability that pushed me to stay focused on solving my issues in daily life."',
    ],
    who: 'Eric, engineer, Taiwan',
  },
]

const Label = ({ children }: { children: ReactNode }) => (
  <p className="mb-3 text-[0.9375rem] font-semibold text-sky">{children}</p>
)

const h2 = 'text-[2.125rem] text-text sm:text-5xl'
const body = 'text-[1.0625rem] text-muted sm:text-lg'

function Calendly() {
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

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-text px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <PageBackground />

      <Hero />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* The Problem */}
        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Label>The Problem</Label>
              <h2 className={h2}>The Burnout Loop</h2>
              <p className={`${body} mt-6`}>
                Most of us with ADHD know this loop: We push hard with systems that don't fit our brains; we crash; we
                feel exhausted even on days we're not busy; we feel guilty. Then we start over.
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl italic text-text">Sound familiar?</p>
              <ul className="mt-6 divide-y divide-steel/25 border-y border-steel/25">
                {PROBLEMS.map((p) => (
                  <li key={p} className="py-5 text-[1.0625rem] leading-relaxed text-text/90 sm:text-lg">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Why it keeps happening */}
        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-[2.5rem] text-text sm:text-6xl lg:text-7xl">Trying harder will never work.</h2>
            <p className={`${body} mx-auto mt-6 max-w-2xl`}>
              Most of us try to fix ADHD with apps, planners and timers. But you can't run a car without fuel, so we
              boost energy first.
            </p>
          </div>
        </section>

        {/* Quiz */}
        <section aria-labelledby="quiz-heading" className="px-5 pb-20 pt-4 sm:px-8 lg:pb-28">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <h2 id="quiz-heading" className={h2}>
              What's blocking your focus?
            </h2>
            <p className={`${body} mt-4`}>7 quick questions to help you find your focus type and 1 thing to try today.</p>
          </div>
          <Quiz />
          <p className="mt-5 text-center text-sm text-muted">This quiz is not a diagnosis.</p>
        </section>

        {/* The Solution: Neuro Noise background */}
        <section className="px-5 py-20 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <Label>The Solution</Label>
              <h2 className={h2}>The Fuel, Focus, Finish Method</h2>
              <p className="mt-6 text-[1.0625rem] text-text/90 sm:text-lg">
                Over 12 weeks, we work 1:1 to build a system around how your brain works. There are 3 stages, always in
                this order:
              </p>
            </div>

            <ol className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
              {STAGES.map((s) => (
                <li key={s.n} className="glass-panel rounded-3xl border border-steel/40 p-6 sm:p-7">
                  <p className="text-sm font-semibold text-sky">{s.n}</p>
                  <h3 className="mt-3 text-[1.625rem] text-text">{s.title}</h3>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-text/85">{s.desc}</p>
                </li>
              ))}
            </ol>

            <p className="glass-panel mt-10 max-w-3xl rounded-2xl p-5 text-[1.0625rem] text-text/90 sm:p-6 sm:text-lg">
              Weekly 1:1 accountability runs through all 12 weeks. We set up your environment so the right choices
              become automatic, and you cannot ghost on your own goals, because I will not let you.
            </p>
          </div>
        </section>

        {/* Results */}
        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
            <figure className="mx-auto w-full max-w-[300px] lg:order-first">
              <img
                src="/assets/client-nail-salon.jpg"
                alt="Emma, nail salon owner"
                width={720}
                height={696}
                loading="lazy"
                className="h-auto w-full rounded-3xl"
              />
              <figcaption className="mt-3 text-center text-[0.9375rem] font-semibold text-khaki">
                Emma, nail salon owner
              </figcaption>
            </figure>
            <div className="lg:order-last">
              <Label>Results</Label>
              <h2 className="text-[1.875rem] leading-[1.15] text-text sm:text-[2.5rem]">
                From burnout and overwhelm to working less, earning more, and getting her energy back
              </h2>
              <p className={`${body} mt-6`}>
                A nail salon owner came in working 60+ hours a week, feeling lost and unable to act on the opportunities
                she could see. With the Fuel, Focus, Finish Method she got her priorities straight, raised her prices,
                hired help, moved to a 9 to 6 schedule, and now works fewer hours while earning more.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-12 lg:mt-20 lg:gap-16 lg:pl-[364px]">
            {MORE_RESULTS.map((r) => (
              <div key={r.heading}>
                <h2 className="text-[1.875rem] leading-[1.15] text-text sm:text-[2.5rem]">{r.heading}</h2>
                <p className={`${body} mt-6`}>{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-6xl">
            <Label>In their words</Label>
            <div className="mt-4 grid gap-4 lg:grid-cols-3 lg:gap-5">
              {TESTIMONIALS.map((t) => (
                <figure key={t.who} className="glass-panel flex flex-col rounded-3xl border border-steel/30 p-6 sm:p-7">
                  <blockquote className="flex-1 space-y-3 text-[1.0625rem] leading-relaxed text-text/90">
                    {t.quotes.map((q) => (
                      <p key={q}>{q}</p>
                    ))}
                  </blockquote>
                  <figcaption className="mt-6 text-[0.9375rem] font-semibold text-khaki">{t.who}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] lg:gap-16">
            <img
              src="/assets/profile.webp"
              alt="Dr Nick"
              loading="lazy"
              width={2500}
              height={3750}
              className="mx-auto aspect-[4/5] w-full max-w-[240px] rounded-3xl object-cover object-top sm:max-w-none"
            />
            <div>
              <h2 className={h2}>Who I am</h2>
              <p className={`${body} mt-6`}>
                I'm Dr Nick Straw, a former UK doctor with ADHD. I trained at Edinburgh Medical School and worked as a
                doctor for 2 years. I know the Burnout Loop from the inside. I got through
                six years of medical school by building systems around how my brain works without forcing it. And now I
                help ADHD entrepreneurs break the loop, feel more confident in themselves and get stuff done.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-20 text-center sm:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl">
            <Label>Let's Talk</Label>
            <h2 className={h2}>Let's see what's keeping you stuck.</h2>
            <p className={`${body} mt-6`}>
              Book your free <strong className="font-semibold text-text">Focus Audit</strong> (30 to 45 minutes).
              We'll talk through what's keeping you stuck and where you want to be, and you'll leave with a clear next
              step. If <strong className="font-semibold text-text">Frictionless Focus</strong> is the right fit, we'll
              talk about how to start the programme.
            </p>
            <div className="mt-10 flex justify-center">
              <BookButton />
            </div>
          </div>
        </section>

        {/* Booking */}
        <section id="book" tabIndex={-1} className="bg-panel px-5 pb-20 pt-4 outline-none sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-[1.875rem] text-text sm:text-4xl">Book Your Free Focus Audit</h2>
            <p className="mb-8 mt-2 text-center text-muted">Choose a time that works for you.</p>
            <Calendly />
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 text-center">
        <p className="text-[0.8125rem] text-muted">© 2026 Dr Nick. All rights reserved.</p>
      </footer>
    </>
  )
}
