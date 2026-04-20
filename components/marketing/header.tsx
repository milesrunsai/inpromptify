import Link from "next/link";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Solutions", href: "/pricing" },
  { name: "Plans", href: "/pricing" },
  { name: "Learning", href: "/developers" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between py-5 px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
          IF
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm text-foreground/90 transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <Link
          href="/sign-up"
          className="liquid-glass rounded-full px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
        >
          Sign Up
        </Link>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </header>
  );
}
