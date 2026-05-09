export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <span className="wordmark">
            vero
            <span className="font-sans text-[0.55em] not-italic text-accent">•</span>
          </span>
          <nav className="hidden gap-7 text-sm font-medium text-fg md:flex">
            <span>Find care</span>
            <span>My visits</span>
            <span>Records</span>
            <span>Help</span>
          </nav>
          <div className="hidden size-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-fg md:flex">
            EC
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
