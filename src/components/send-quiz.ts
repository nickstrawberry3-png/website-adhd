import { WEB3FORMS_ACCESS_KEY } from '@/config'
import { QUESTIONS, RESULTS, type FocusType } from './quiz-content'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

export async function sendQuizLead(name: string, email: string, answers: (number | null)[], result: FocusType) {
  if (!WEB3FORMS_ACCESS_KEY) {
    console.warn('Quiz email not sent: add your Web3Forms access key in src/config.ts')
    return false
  }

  const resultName = RESULTS[result].name
  const pick = (i: number) => {
    const a = answers[i]
    return a === null ? '' : QUESTIONS[i].options[a].label
  }

  const fields: Record<string, string> = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `New quiz lead: ${name} - ${resultName}`,
    from_name: 'drnickstraw.com quiz',
    botcheck: '',
    Name: name,
    Email: email,
    'Role (Q6)': pick(5),
    'Cost (Q7)': pick(6),
    'Result type': `${resultName} (breaks at ${RESULTS[result].breaks})`,
  }
  QUESTIONS.forEach((q, i) => {
    const a = answers[i]
    if (a === null) return
    const o = q.options[a]
    fields[`Q${i + 1}. ${q.q}`] = 'type' in o ? `${LETTERS[a]}. ${o.label} (${RESULTS[o.type].name})` : o.label
  })

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(fields),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.success) {
      console.warn('Quiz email failed', data.message ?? res.status)
      return false
    }
    return true
  } catch (err) {
    console.warn('Quiz email failed', err)
    return false
  }
}
