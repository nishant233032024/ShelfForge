import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/70">
          Log in to continue with your shelf.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-ink/70">
        New here?{" "}
        <Link href="/signup" className="font-medium text-ink underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </section>
  );
}
