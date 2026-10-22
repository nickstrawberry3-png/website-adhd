import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import LoaderProgressiveBar from '@/components/ui/loader-progressive-bar'
import BookButton from '@/components/BookButton'

type BlockType = 'fuel' | 'focus' | 'finish'

// PLACEHOLDER CONTENT: swap these for the real questions and results.
const QUESTIONS: { q: string; options: { label: string; type: BlockType }[] }[] = [
  {
    q: 'Placeholder question 1: how do you usually feel by mid-afternoon?',
    options: [
      { label: 'Drained, even on easy days', type: 'fuel' },
      { label: 'Busy but scattered', type: 'focus' },
      { label: 'Fine, until something goes wrong', type: 'finish' },
    ],
  },
  {
    q: 'Placeholder question 2: what happens when you sit down to work?',
    options: [
      { label: "I can't get going", type: 'fuel' },
      { label: 'I start ten things at once', type: 'focus' },
      { label: 'I start well, then drift off', type: 'finish' },
    ],
  },
  {
    q: 'Placeholder question 3: which of these sounds most like you?',
    options: [
      { label: 'My sleep is all over the place', type: 'fuel' },
      { label: "I don't know what matters most today", type: 'focus' },
      { label: 'One bad week undoes all my progress', type: 'finish' },
    ],
  },
  {
    q: 'Placeholder question 4: what would help most right now?',
    options: [
      { label: 'More energy', type: 'fuel' },
      { label: 'Clear priorities', type: 'focus' },
      { label: 'Habits that last', type: 'finish' },
    ],
  },
]

const RESULTS: Record<BlockType, { title: string; body: string }> = {
  fuel: { title: 'Placeholder result: your energy', body: 'Placeholder text explaining an energy block.' },
  focus: { title: 'Placeholder result: your focus', body: 'Placeholder text explaining a focus block.' },
  finish: { title: 'Placeholder result: your follow-through', body: 'Placeholder text explaining a follow-through block.' },
}

type Step = { kind: 'intro' } | { kind: 'question'; index: number } | { kind: 'details' } | { kind: 'result' }

const total = QUESTIONS.length
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Quiz() {
  const [step, setStep] = useState<Step>({ kind: 'intro' })
  const [answers, setAnswers] = useState<(BlockType | null)[]>(() => Array(total).fill(null))
  const [picked, setPicked] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const headingRef = useRef<HTMLHeadingElement>(null)
  const shownStep = useRef(step)
  const ids = useId()

  useEffect(() => {
    if (shownStep.current === step) return
    shownStep.current = step
    headingRef.current?.focus()
  }, [step])

  const progress =
    step.kind === 'question' ? (step.index + 1) / total : step.kind === 'intro' ? 0 : 1

  const choose = (index: number, optionIndex: number, type: BlockType) => {
    if (picked !== null) return
    setPicked(optionIndex)
    setAnswers((a) => a.map((v, i) => (i === index ? type : v)))
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280
    window.setTimeout(() => {
      setPicked(null)
      setStep(index + 1 < total ? { kind: 'question', index: index + 1 } : { kind: 'details' })
    }, delay)
  }

  const back = () => {
    if (step.kind === 'question') setStep(step.index === 0 ? { kind: 'intro' } : { kind: 'question', index: step.index - 1 })
    else if (step.kind === 'details') setStep({ kind: 'question', index: total - 1 })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Enter your first name.'
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter an email address, like name@example.com.'
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(next.name ? `${ids}-name` : `${ids}-email`)?.focus()
      return
    }
    // PLACEHOLDER: name and email are not sent anywhere yet.
    setStep({ kind: 'result' })
  }

  const result = (() => {
    const counts = { fuel: 0, focus: 0, finish: 0 }
    answers.forEach((a) => a && counts[a]++)
    const top = (Object.keys(counts) as BlockType[]).reduce((a, b) => (counts[b] > counts[a] ? b : a), 'fuel')
    return RESULTS[top]
  })()

  const headingClass = 'font-serif text-[1.75rem] leading-tight text-text outline-none sm:text-[2rem]'

  return (
    <div className="liquid-glass mx-auto w-full max-w-xl rounded-[28px] bg-panel/80 p-5 sm:p-8">
      {step.kind !== 'intro' && step.kind !== 'result' && (
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={back}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-text"
            aria-label="Previous question"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <div className="flex-1">
            <LoaderProgressiveBar
              value={progress}
              label="Quiz progress"
              valueText={step.kind === 'question' ? `Question ${step.index + 1} of ${total}` : 'Questions done'}
            />
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {step.kind === 'question' ? `Question ${step.index + 1} of ${total}` : ''}
      </p>

      {step.kind === 'intro' && (
        <div className="text-center">
          <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
            {total} quick questions
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-muted">Tap the answer that fits best.</p>
          <button
            type="button"
            onClick={() => setStep({ kind: 'question', index: 0 })}
            className="mt-7 inline-flex min-h-13 items-center justify-center rounded-full bg-dodger px-8 font-semibold text-ink transition-colors hover:bg-sky"
          >
            Start the quiz
          </button>
        </div>
      )}

      {step.kind === 'question' && (
        <fieldset key={step.index}>
          <legend className="contents">
            <p className="mb-2 text-sm font-medium text-sky">
              Question {step.index + 1} of {total}
            </p>
            <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
              {QUESTIONS[step.index].q}
            </h3>
          </legend>
          <div className="mt-6 grid gap-3">
            {QUESTIONS[step.index].options.map((o, i) => {
              const isPicked = picked === i
              const wasChosen = picked === null && answers[step.index] === o.type
              return (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => choose(step.index, i, o.type)}
                  aria-pressed={isPicked || wasChosen}
                  className={`min-h-14 rounded-2xl border px-5 py-3.5 text-left text-[1.0625rem] transition-[background-color,border-color,transform] duration-200 active:scale-[0.99] ${
                    isPicked
                      ? 'border-sky bg-dodger/25 text-text'
                      : wasChosen
                        ? 'border-dodger/70 bg-dodger/10 text-text'
                        : 'border-steel/45 bg-ink/40 text-text hover:border-dodger hover:bg-dodger/10'
                  }`}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {step.kind === 'details' && (
        <form onSubmit={submit} noValidate>
          <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
            Where should we send your result?
          </h3>
          <div className="mt-6 grid gap-5">
            {(
              [
                ['name', 'First name', 'text', 'given-name', name, setName],
                ['email', 'Email', 'email', 'email', email, setEmail],
              ] as const
            ).map(([key, label, type, autoComplete, value, set]) => (
              <div key={key}>
                <label htmlFor={`${ids}-${key}`} className="mb-1.5 block text-sm font-medium text-text">
                  {label}
                </label>
                <input
                  id={`${ids}-${key}`}
                  type={type}
                  autoComplete={autoComplete}
                  inputMode={key === 'email' ? 'email' : undefined}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${ids}-${key}-err` : undefined}
                  className={`min-h-13 w-full rounded-xl border bg-ink/60 px-4 text-base text-text placeholder:text-muted/70 focus-visible:outline-offset-1 ${
                    errors[key] ? 'border-[#ff8a80]' : 'border-steel/55'
                  }`}
                />
                {errors[key] && (
                  <p id={`${ids}-${key}-err`} className="mt-1.5 text-sm text-[#ffb4ab]">
                    {errors[key]}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-full bg-dodger px-8 font-semibold text-ink transition-colors hover:bg-sky"
          >
            Show my result
          </button>
        </form>
      )}

      {step.kind === 'result' && (
        <div className="text-center">
          <p className="text-sm font-medium text-sky">Your result</p>
          <h3 ref={headingRef} tabIndex={-1} className={`${headingClass} mt-2`}>
            {result.title}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-muted">{result.body}</p>
          <div className="mt-8 flex justify-center">
            <BookButton />
          </div>
        </div>
      )}
    </div>
  )
}
