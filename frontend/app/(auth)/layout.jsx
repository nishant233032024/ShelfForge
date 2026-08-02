import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-lg font-semibold text-ink">
        ShelfForge
      </Link>
      {children}
    </main>
  );
}
