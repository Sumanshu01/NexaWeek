import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream border-b-4 border-ink">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group brutal-hover">
          <div className="relative w-14 h-14 brutal-border-sm bg-white overflow-hidden shrink-0">
            <Image
              src="/COMPASS.jpeg"
              alt="NexaSoul Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-hot-pink">
              Technical Club
            </p>
            <h1 className="text-2xl font-black leading-none" style={{ fontFamily: "var(--font-fraunces)" }}>
              NexaSoul
            </h1>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/quiz">Srujana Quiz</NavLink>
          <NavLink href="/admin" accent>
            Admin
          </NavLink>
        </nav>

        <div className="md:hidden">
          <Link
            href="/quiz"
            className="sticker bg-hot-pink text-white brutal-border-sm text-xs brutal-hover"
          >
            GO BLITZ →
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  accent,
}: {
  href: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 font-bold text-sm uppercase tracking-wide brutal-border-sm brutal-hover ${
        accent ? "bg-electric-blue text-white" : "bg-white"
      }`}
    >
      {children}
    </Link>
  );
}
