import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import LoaderProgressiveBar from '@/components/ui/loader-progressive-bar'
import BookButton from '@/components/BookButton'
import { QUESTIONS, RESULTS, scoreQuiz, type FocusType } from './quiz-content'
import { sendQuizLead } from './send-quiz'

type Step = { kind: 'question'; index: number } | { kind: 'details' } | { kind: 'result'; type: FocusType }

const total = QUESTIONS.length
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Quiz() {
  const [step, setStep] = useState<Step>({ kind: 'question', index: 0 })
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null))
  const [picked, setPicked] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const focusRef = useRef<HTMLElement | null>(null)
  const shownStep = useRef(step)
  const ids = useId()

  useEffect(() => {
    if (shownStep.current === step) return
    shownStep.current = step
    focusRef.current?.focus()
  }, [step])

  const progress = step.kind === 'question' ? (step.index + 1) / total : 1

  const choose = (index: number, optionIndex: number) => {
    if (picked !== null) return
    setPicked(optionIndex)
    setAnswers((a) => a.map((v, i) => (i === index ? optionIndex : v)))
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280
    window.setTimeout(() => {
      setPicked(null)
      setStep(index + 1 < total ? { kind: 'question', index: index + 1 } : { kind: 'details' })
    }, delay)
  }

  const back = () => {
    if (step.kind === 'question' && step.index > 0) setStep({ kind: 'question', index: step.index - 1 })
    else if (step.kind === 'details') setStep({ kind: 'question', index: total - 1 })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Enter your name.'
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter an email address, like name@example.com.'
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(next.name ? `${ids}-name` : `${ids}-email`)?.focus()
      return
    }
    const type = scoreQuiz(answers)
    // The result shows straight away; the email is sent in the background and a failure never blocks it.
    void sendQuizLead(name.trim(), email.trim(), answers, type)
    setStep({ kind: 'result', type })
  }

  const headingClass = 'font-serif text-[1.625rem] leading-tight text-text outline-none sm:text-[2rem]'
  const setFocus = (el: HTMLElement | null) => {
    focusRef.current = el
  }

  return (
    <div className="liquid-glass mx-auto w-full max-w-xl rounded-[28px] bg-panel/85 p-5 sm:p-8">
      {step.kind !== 'result' && (
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step.kind === 'question' && step.index === 0}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-text disabled:pointer-events-none disabled:opacity-30"
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

      {step.kind === 'question' && (
        <fieldset key={step.index}>
          <legend className="contents">
            <p className="mb-2 text-sm font-medium text-sky" aria-live="polite">
              Question {step.index + 1} of {total}
            </p>
            <h3 ref={setFocus} tabIndex={-1} className={headingClass}>
              {QUESTIONS[step.index].q}
            </h3>
          </legend>
          <div className="mt-6 grid gap-3">
            {QUESTIONS[step.index].options.map((o, i) => {
              const isPicked = picked === i
              const wasChosen = picked === null && answers[step.index] === i
              return (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => choose(step.index, i)}
                  aria-pressed={isPicked || wasChosen}
                  className={`min-h-14 rounded-2xl border px-5 py-3.5 text-left text-[1.0625rem] leading-snug transition-[background-color,border-color,transform] duration-200 active:scale-[0.99] ${
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
        <form onSubmit={submit} noValidate aria-label="Your name and email">
          <div className="grid gap-5">
            {(
              [
                ['name', 'Name', 'text', 'given-name', name, setName],
                ['email', 'Email', 'email', 'email', email, setEmail],
              ] as const
            ).map(([key, label, type, autoComplete, value, set]) => (
              <div key={key}>
                <label htmlFor={`${ids}-${key}`} className="mb-1.5 block text-sm font-medium text-text">
                  {label}
                </label>
                <input
                  id={`${ids}-${key}`}
                  ref={key === 'name' ? setFocus : undefined}
                  type={type}
                  autoComplete={autoComplete}
                  inputMode={key === 'email' ? 'email' : undefined}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${ids}-${key}-err` : undefined}
                  className={`min-h-13 w-full rounded-xl border bg-ink/60 px-4 text-base text-text focus-visible:outline-offset-1 ${
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
        <div>
          <h3 ref={setFocus} tabIndex={-1} className={`${headingClass} text-center sm:text-[2.25rem]`}>
            {RESULTS[step.type].name}
          </h3>
          <p className="mt-4 text-[1.0625rem] text-text/90">{RESULTS[step.type].body}</p>
          <dl className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-steel/40 bg-ink/40 p-4">
              <dt className="text-sm font-semibold text-sky">The bottleneck</dt>
              <dd className="mt-1 font-serif text-xl text-text">{RESULTS[step.type].breaks}</dd>
            </div>
            <div className="rounded-2xl border border-khaki/35 bg-ink/40 p-4">
              <dt className="text-sm font-semibold text-khaki">Try today</dt>
              <dd className="mt-1 text-[1.0625rem] text-text/90">{RESULTS[step.type].tryToday}</dd>
            </div>
          </dl>
          <p className="mt-6 text-center text-[1.0625rem] text-text/90">
            On a free Focus Audit, I'll find precisely which stage is broken for you and give you a plan to fix it.
          </p>
          <div className="mt-6 flex justify-center">
            <BookButton>Book your free Focus Audit</BookButton>
          </div>
        </div>
      )}
    </div>
  )
}
