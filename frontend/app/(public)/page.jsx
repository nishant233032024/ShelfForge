import Link from "next/link";
import Button from "@/components/shared/Button";

export default function LandingPage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(31,41,55,0.06),_transparent_70%)]"
      />
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">Personal library</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        ShelfForge
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
        A quiet place to track what you want to read, what you are reading, and
        what you have finished — without noise.
      </p>
      <ul className="mt-6 space-y-1.5 text-sm text-ink/65">
        <li>Log titles with tags, status, and a short personal note</li>
        <li>Filter by status, author, or the tags you actually use</li>
        <li>See gentle habits: completion rate, authors you return to</li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/signup">
          <Button>Sign up</Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary">Log in</Button>
        </Link>
      </div>
      <p className="mt-16 text-xs text-ink/50">
        Built by Nishant · nishantghuge@hotmail.com
      </p>
    </main>
  );
}
