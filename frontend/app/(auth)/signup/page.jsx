import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Create your shelf</h1>
        <p className="mt-1 text-sm text-ink/70">
          A few details and you are ready to start tracking books.
        </p>
      </div>
      <SignupForm />
      <p className="text-sm text-ink/70">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-2">
          Log in
        </Link>
      </p>
    </section>
  );
}
