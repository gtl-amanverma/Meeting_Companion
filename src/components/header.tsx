import { Logo } from "./icon";


export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex w-full items-center gap-6 text-lg font-medium md:text-sm">
        <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl">Meeting Companion</span>
        </div>
      </nav>
    </header>
  );
}
