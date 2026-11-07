"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type User = { id: string; name: string; email: string };

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

  const link =
    "flex min-h-11 items-center font-semibold text-butter hover:text-gold active:text-gold";
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
          <Link href="/student" className={link}>
            I am a student
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className={link}>
                Dashboard
              </Link>
              <Link href="/pay" className={link}>
                New payment
              </Link>
              <button onClick={logout} className={cta}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={link}>
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