"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

type Result = {
  paid: boolean;
  status: string;
  message: string;
  studentName: string;
  university: string;
  term: string;
  amountUSD: number;
};

export default function StudentPage() {
  const [ticketCode, setTicketCode] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const r = await api<Result>("/student/check", {
        method: "POST",
        body: JSON.stringify({ ticketCode, email }),
      });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "min-h-12 rounded-xl border-2 border-slate-300 bg-white px-4 font-semibold outline-none focus:border-navy";

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-5 py-12">
      <h1 className="text-3xl font-extrabold">Check your tuition</h1>
      <p className="text-navy/80">Enter the ticket code your parent sent you and your email.</p>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="code" className="text-sm font-semibold">Ticket code</label>
          <input
            id="code"
            className={`${input} uppercase tracking-widest`}
            placeholder="SB-XXXX-XXXX"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="em" className="text-sm font-semibold">Your email</label>
          <input id="em" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button
          disabled={loading}
          className="min-h-12 rounded-xl bg-navy text-lg font-extrabold text-cream hover:bg-ink disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check status"}
        </button>
      </form>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      {result && (
        <div
          className={`flex flex-col gap-2 rounded-2xl border-2 p-5 ${
            result.paid ? "border-navy bg-butter" : "border-red-300 bg-red-50"
          }`}
        >
          <StatusBadge status={result.status} />
          <div className="text-xl font-extrabold">{result.message}</div>
          <div className="text-sm text-navy/80">
            {result.studentName} &middot; {result.university} &middot; {result.term}
          </div>
          {result.paid && <div className="font-bold">${result.amountUSD.toFixed(2)}</div>}
        </div>
      )}
    </main>
  );
}