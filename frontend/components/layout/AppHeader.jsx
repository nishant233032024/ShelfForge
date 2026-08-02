"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Button from "@/components/shared/Button";

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/books", label: "Books" },
  ];

  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-ink">
            ShelfForge
          </Link>
          <nav className="flex gap-3 text-sm" aria-label="Primary">
            {navLinks.map((navLink) => {
              const isActive = pathname.startsWith(navLink.href);

              return (
                <Link
                  key={navLink.href}
                  href={navLink.href}
                  className={
                    isActive
                      ? "font-medium text-ink underline underline-offset-4"
                      : "text-ink/70 hover:text-ink"
                  }
                >
                  {navLink.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {authenticatedUser ? (
            <p className="hidden text-sm text-ink/70 sm:block">
              {authenticatedUser.fullName}
            </p>
          ) : null}
          <Button variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
