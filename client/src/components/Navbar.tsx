"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User } from "@/lib/useRequireAuth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    api<User>("/auth/me")
      .then(setUser)
      .catch(() => setUser(null));
  }, [pathname]);

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }

  const base =
    "flex min-h-11 items-center border-b-2 font-semibold hover:text-gold active:text-gold";
  const link = (href: string) =>
    `${base} ${pathname === href ? "border-gold text-gold" : "border-transparent text-butter"}`;
  const cta =
    "flex min-h-11 items-center rounded-full bg-gold px-5 font-extrabold text-ink hover:bg-butter active:bg-butter";

  return (
    <nav className="bg-ink px-5 py-3 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-cream">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#F5B700" />
            <path
              d="M6 21h20M9 21v-6a7 7 0 0 1 14 0v6"
              stroke="#0B1B2E"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          SchoolBridge
        </Link>

        <div className="flex flex-wrap items-center gap-5">
          {user?.role === "parent" && (
            <>
              <Link href="/dashboard" className={link("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/pay" className={link("/pay")}>
                New payment
              </Link>
            </>
          )}
          {user?.role === "student" && (
            <Link href="/student/dashboard" className={link("/student/dashboard")}>
              My tuition
            </Link>
          )}
          {!user && (
            <Link href="/student" className={link("/student")}>
              I am a student
            </Link>
          )}
          {user ? (
            <button onClick={logout} className={cta}>
              Log out
            </button>
          ) : (
            <>
              <Link href="/login" className={link("/login")}>
                Log in
              </Link>
              <Link href="/register" className={cta}>
                Parent sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}