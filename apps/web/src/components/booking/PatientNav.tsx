import { Avatar } from "@/components/ui/Avatar";
import { Wordmark } from "@/components/ui/Wordmark";

const navItems = ["Find care", "My visits", "Records", "Help"] as const;

export function PatientNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Wordmark />
        <nav className="hidden gap-7 text-sm font-medium text-fg md:flex">
          {navItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <div className="hidden md:block">
          <Avatar initials="EC" name="Example patient" size="sm" />
        </div>
      </div>
    </header>
  );
}
