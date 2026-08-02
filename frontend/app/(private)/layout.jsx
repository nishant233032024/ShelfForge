"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AppShell from "@/components/layout/AppShell";
import Spinner from "@/components/shared/Spinner";

export default function PrivateLayout({ children }) {
  const router = useRouter();
  const { authenticatedUser, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !authenticatedUser) {
      router.replace("/login");
    }
  }, [authenticatedUser, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Spinner label="Checking your session..." />
      </div>
    );
  }

  if (!authenticatedUser) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
