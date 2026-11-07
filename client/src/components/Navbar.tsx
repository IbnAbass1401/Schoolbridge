"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User } from "@/lib/useRequireAuth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
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
    "flex min-h-11 items-center justify-center rounded-full bg-gold px-5 font-extrabold text-ink hover:bg-butter active:bg-butter";

  return (
    <nav className="no-print sticky top-0 z-50 bg-ink px-5 py-3 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3">
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

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-cream md:hidden"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <div
          onClick={() => setOpen(false)}
          className={`${
            open ? "flex" : "hidden"
          } w-full flex-col gap-1 pb-2 pt-3 md:flex md:w-auto md:flex-row md:items-center md:gap-5 md:p-0`}
        >
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
            <>
              <Link href="/student/dashboard" className={link("/student/dashboard")}>
                My tuition
              </Link>
              <Link href="/student/verify" className={link("/student/verify")}>
                Verify tuition
              </Link>
            </>
          )}
          {!user && (
            <Link href="/student" className={link("/student")}>
              I am a student
            </Link>
          )}
          {user ? (
            <button onClick={logout} className={`${cta} mt-2 md:mt-0`}>
              Log out
            </button>
          ) : (
            <>
              <Link href="/login" className={link("/login")}>
                Parent log in
              </Link>
              <Link href="/register" className={`${cta} mt-2 md:mt-0`}>
                Parent sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}