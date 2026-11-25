// The free resources on drnickstraw.com/free.
// PLACEHOLDER: put each Google Drive or YouTube link in `url`. While `url` is empty, the button shows "Coming soon".
export type Resource = {
  keyword: string
  name: string
  kind: string
  blurb: string
  button: string
  url: string
}

export const RESOURCES: Resource[] = [
  {
    keyword: 'MANUAL',
    name: "The ADHD Founder's Manual",
    kind: 'Free guide',
    blurb: 'How we break the Burnout Loop in our business, so we stop pushing hard, crashing and starting over.',
    button: 'Get the manual',
    url: 'https://drnickyyy.gumroad.com/l/adhd-founders-manual',
  },
  {
    keyword: 'GUIDE',
    name: 'The ADHD Survival Guide',
    kind: 'Free guide',
    blurb: 'Simple ways to manage our ADHD day to day.',
    button: 'Get the guide',
    url: 'https://drnickyyy.gumroad.com/l/adhd-survival-guide',
  },
  {
    keyword: 'RESET',
    name: 'The 7-Day Reset',
    kind: 'PDF, 7 days',
    blurb: 'Seven days to get back to the work that brings in money, without starting over from zero.',
    button: 'Start the reset',
    url: '', // PLACEHOLDER: 7-Day Reset PDF link
  },
  {
    keyword: 'TOOLKIT',
    name: 'The AI Toolkit for ADHD Business Owners',
    kind: 'PDF, 2 pages',
    blurb: 'Let software do the money tasks we keep putting off.',
    button: 'Get the toolkit',
    url: 'https://drive.google.com/file/d/1-gEQYAuYnBn9mUSN8TQSwO1YOg1GJz3u/view',
  },
  {
    keyword: 'FOLLOWUP',
    name: 'The Follow-Up Message Pack',
    kind: 'PDF, 2 pages',
    blurb: 'Copy, paste and send the follow-ups we keep putting off.',
    button: 'Get the messages',
    url: '', // PLACEHOLDER: Follow-Up Message Pack PDF link
  },
  {
    keyword: 'BADWEEK',
    name: 'The Bad Week Plan',
    kind: 'PDF, 1 page',
    blurb: "What to do in a bad week so we don't start over from zero.",
    button: 'Get the plan',
    url: '', // PLACEHOLDER: Bad Week Plan PDF link
  },
  {
    keyword: 'SPRINT',
    name: 'The 25-Minute Focus Sprint',
    kind: 'Video, 30 minutes',
    blurb: 'Work next to me for 25 minutes on the task you keep avoiding.',
    button: 'Watch the sprint',
    url: '', // PLACEHOLDER: unlisted YouTube link
  },
  {
    keyword: 'BLOCKER',
    name: 'The Focus Quiz',
    kind: 'Quiz, 2 minutes',
    blurb: "What's blocking your focus? 7 quick questions and 1 thing to try today.",
    button: 'Take the quiz',
    url: '/quiz/',
  },
]
