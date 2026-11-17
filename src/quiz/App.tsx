import Quiz from '@/components/Quiz'
import PageBackground from '@/components/PageBackground'
import SimpleHeader from '@/components/SimpleHeader'
import Calendly from '@/components/Calendly'

// The same Quiz component as the programme page, so there is only one quiz to keep up to date.
export default function App() {
  return (
    <>
      <PageBackground />
      <SimpleHeader />

      <main id="main" tabIndex={-1} className="outline-none">
        <section aria-labelledby="quiz-heading" className="px-5 pb-20 pt-12 sm:px-8 lg:pb-28 lg:pt-20">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <h1 id="quiz-heading" className="text-[2.5rem] text-text sm:text-6xl">
              What's blocking your focus?
            </h1>
            <p className="mt-4 text-[1.0625rem] text-muted sm:text-lg">
              7 quick questions to help you find your focus type and 1 thing to try today.
            </p>
          </div>
          <Quiz />
          <p className="mt-5 text-center text-sm text-muted">This quiz is not a diagnosis.</p>
        </section>

        <section id="book" tabIndex={-1} className="bg-panel px-5 pb-20 pt-12 outline-none sm:px-8">
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
