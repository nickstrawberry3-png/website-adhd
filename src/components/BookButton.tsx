import type { ReactNode } from 'react'

type Props = { className?: string; children?: ReactNode }

export default function BookButton({ className = '', children = 'Book Your Free Focus Audit →' }: Props) {
  return (
    <a
      href="#book"
      className={`inline-flex min-h-14 w-full max-w-[400px] items-center justify-center rounded-full bg-gold px-8 py-4 text-center text-[1.0625rem] font-bold text-ink shadow-[0_10px_40px_-12px_rgba(255,215,0,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-12px_rgba(255,215,0,0.7)] focus-visible:outline-offset-4 active:translate-y-0 ${className}`}
    >
      {children}
    </a>
  )
}
