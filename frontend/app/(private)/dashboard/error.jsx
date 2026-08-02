"use client";

import Button from "@/components/shared/Button";

export default function DashboardError({ error, reset }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-ink">Dashboard could not load</h1>
      <p className="text-sm text-ink/70">{error?.message || "Something went wrong."}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
