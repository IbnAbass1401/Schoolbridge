"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { LEVELS } from "@/lib/constants";

export default function VerifyPage() {
  const user = useRequireAuth("student");
  const router = useRouter();
  const [ticketCode, setTicketCode] = useState("");
  const [level, setLevel] = useState(LEVELS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const p = await api<{ id: string }>("/student/claim", {
        method: "POST",
        body: JSON.stringify({ ticketCode, level }),
      });
      router.push(`/student/receipt/${p.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!user) return null;

  const input =
    "min-h-12 rounded-xl border-2 border-slate-300 bg-white px-4 font-semibold outline-none focus:border-navy";

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-5 py-12">
      <h1 className="text-3xl font-extrabold">Verify tuition payment</h1>
      <p className="text-navy/80">
        Enter the ticket code your parent sent you and your level. We will check it and show your receipt.
      </p>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="tc" className="text-sm font-semibold">Ticket code</label>
          <input
            id="tc"
            className={`${input} uppercase tracking-widest`}
            placeholder="SB-XXXX-XXXX"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lvl" className="text-sm font-semibold">Your level</label>
          <select id="lvl" className={input} value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="min-h-12 rounded-xl bg-navy text-lg font-extrabold text-cream hover:bg-ink disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify tuition"}
        </button>
      </form>
    </main>
  );
}