export type FocusType = 'A' | 'B' | 'C' | 'D'

export type ScoredQuestion = { q: string; scored: true; options: { label: string; type: FocusType }[] }
export type PlainQuestion = { q: string; scored: false; key: 'role' | 'cost'; options: { label: string }[] }
export type Question = ScoredQuestion | PlainQuestion

export const QUESTIONS: Question[] = [
  {
    q: 'What does a bad workday look like for you?',
    scored: true,
    options: [
      { type: 'A', label: 'I work hard for a few days, then crash and lose a day or two' },
      { type: 'B', label: "I know what to do, but I can't make myself start" },
      { type: 'C', label: 'I start lots of things and jump between them' },
      { type: 'D', label: "Everything feels urgent and I don't know where to begin" },
    ],
  },
  {
    q: 'When you have a big task due, what usually happens?',
    scored: true,
    options: [
      { type: 'A', label: 'I do it in one huge push, then need days to recover' },
      { type: 'B', label: 'I put off starting until I panic' },
      { type: 'C', label: 'I start it, then get pulled onto something else' },
      { type: 'D', label: 'It gets buried under everything else on my list' },
    ],
  },
  {
    q: 'How do you feel at the end of most days?',
    scored: true,
    options: [
      { type: 'A', label: "Exhausted, even on days I wasn't busy" },
      { type: 'B', label: "Guilty that I didn't do the thing I meant to" },
      { type: 'C', label: 'Busy all day, but nothing important got finished' },
      { type: 'D', label: 'Stressed about everything still left to do' },
    ],
  },
  {
    q: "What have you tried that didn't last?",
    scored: true,
    options: [
      { type: 'A', label: 'Pushing harder, early mornings, more coffee' },
      { type: 'B', label: 'Timers, Pomodoro, motivation videos' },
      { type: 'C', label: 'New apps, planners and to-do systems' },
      { type: 'D', label: 'Time blocking and long to-do lists' },
    ],
  },
  {
    q: 'Which sentence sounds most like you?',
    scored: true,
    options: [
      { type: 'A', label: '"I can work for hours, then waste the whole next day."' },
      { type: 'B', label: '"I know what to do. I just can\'t make myself do it."' },
      { type: 'C', label: '"I have ten projects started and none finished."' },
      { type: 'D', label: '"I have too much to do and it all feels urgent."' },
    ],
  },
  {
    q: 'What do you do?',
    scored: false,
    key: 'role',
    options: [
      { label: 'Business owner' },
      { label: 'Self-employed or freelancer' },
      { label: 'Employed professional' },
      { label: 'Student' },
      { label: 'Other' },
    ],
  },
  {
    q: 'What is this costing you most right now?',
    scored: false,
    key: 'cost',
    options: [
      { label: 'Money and business growth' },
      { label: 'My evenings and weekends' },
      { label: 'My standing at work' },
      { label: 'My health and energy' },
    ],
  },
]

export const RESULTS: Record<FocusType, { name: string; body: string; breaks: string; tryToday: string }> = {
  A: {
    name: 'The Crasher',
    body: "You push hard, crash, feel exhausted and guilty, then start over. That's the Burnout Loop, and your problem is you have no energy to even implement any systems.",
    breaks: 'Fuel',
    tryToday: 'Keep the first hour of tomorrow phone-free and get outside in daylight before you start work.',
  },
  B: {
    name: 'The Starter',
    body: 'You know exactly what needs doing. Starting is the hard part, so you wait until panic forces you to, then feel guilty.',
    breaks: 'Focus',
    tryToday:
      'Make the first step so small it takes under 2 minutes. Open the document and write one line. Then stop if you want.',
  },
  C: {
    name: 'The Switcher',
    body: "New ideas and tasks keep pulling you away before you finish the last one. You're busy all day, but the important work stays unfinished.",
    breaks: 'Focus',
    tryToday: 'Write every new idea on one list instead of acting on it. Pick one task to finish before lunch.',
  },
  D: {
    name: 'The Overloaded',
    body: 'Everything feels urgent, so nothing feels possible. You spend your energy worrying about the list instead of doing it.',
    breaks: 'Finish',
    tryToday:
      "At midday, stop for 2 minutes. Pick one task that must be done by the end of the day and ignore the others until it's done.",
  },
}

/** Highest score wins. On a tie, the type picked in question 5 wins. */
export function scoreQuiz(answers: (number | null)[]): FocusType {
  const counts: Record<FocusType, number> = { A: 0, B: 0, C: 0, D: 0 }
  QUESTIONS.forEach((q, i) => {
    const a = answers[i]
    if (q.scored && a !== null) counts[q.options[a].type]++
  })
  const top = Math.max(...Object.values(counts))
  const tied = (Object.keys(counts) as FocusType[]).filter((t) => counts[t] === top)
  if (tied.length === 1) return tied[0]
  const q5 = QUESTIONS[4] as ScoredQuestion
  const q5Answer = answers[4]
  return q5Answer === null ? tied[0] : q5.options[q5Answer].type
}
