/** A small top bar for single-purpose pages: name on the left, back to the home page. */
export default function SimpleHeader() {
  return (
    <header className="px-5 pt-6 sm:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <a href="/" className="flex items-center gap-3 rounded-full">
          <img
            src="/assets/profile-square.jpg"
            alt=""
            width="40"
            height="40"
            className="size-10 rounded-full object-cover"
          />
          <span className="font-serif text-xl text-text">Dr Nick Straw</span>
        </a>
        <a href="/12-week-programme/" className="text-[0.9375rem] font-semibold text-sky hover:text-text">
          The programme
        </a>
      </div>
    </header>
  )
}
