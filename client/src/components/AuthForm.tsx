"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AuthForm({
  mode,
  role = "parent",
}: {
  mode: "login" | "register";
  role?: "parent" | "student";
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await api<{ role: string }>(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(
          mode === "register" ? { name, email, password, role } : { email, password }
        ),
      });
      router.push(u.role === "student" ? "/student/dashboard" : "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "min-h-12 rounded-xl border-2 border-slate-300 bg-white px-4 font-semibold outline-none focus:border-navy";

  const title =
    mode === "login"
      ? "Log in"
      : role === "student"
      ? "Create student account"
      : "Create parent account";

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-5 py-14">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {mode === "register" && role === "student" && (
        <p className="text-sm text-navy/80">
          Sign up with the same email your parent used when paying for you.
        </p>
      )}

      <form onSubmit={submit} className="flex flex-col gap-4">
        {mode === "register" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold">Your name</label>
            <input id="name" className={input} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-semibold">Email</label>
          <input id="email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-semibold">Password</label>
          <input id="password" type="password" minLength={6} className={input} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="min-h-12 rounded-xl bg-navy text-lg font-extrabold text-cream hover:bg-ink disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-navy/80">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href="/register" className="font-bold underline">Parent sign up</Link>
            {" or "}
            <Link href="/student/register" className="font-bold underline">Student sign up</Link>
          </>
        ) : (
          <>Already registered? <Link href="/login" className="font-bold underline">Log in</Link></>
        )}
      </p>
    </main>
  );
}