export default function AdminLayout({
  children,
  detail
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg">
      <div className="grid min-h-screen lg:grid-cols-[232px_1fr_380px]">
        <aside className="hidden border-r border-border bg-bg-muted p-4 lg:flex lg:flex-col">
          <span className="wordmark">
            vero
            <span className="font-sans text-[0.55em] not-italic text-accent">•</span>
          </span>
          <nav className="mt-8 space-y-2 text-sm font-medium text-fg">
            <span className="block rounded-lg bg-surface px-3 py-2">Schedule</span>
            <span className="block rounded-lg px-3 py-2 text-fg-muted">Requests</span>
            <span className="block rounded-lg px-3 py-2 text-fg-muted">Patients</span>
          </nav>
        </aside>
        {children}
        <div className="hidden min-h-0 lg:block">{detail}</div>
      </div>
    </main>
  );
}
