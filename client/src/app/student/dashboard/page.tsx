"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { LEVELS, isPaid } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";

type Payment = {
  id: string;
  studentLevel: string;
  university: string;
  term: string;
  amountNGN: number;
  amountUSD: number;
  ticketCode: string;
  status: string;
};

export default function StudentDashboard() {
  const user = useRequireAuth("student");
  const [list, setList] = useState<Payment[] | null>(null);
  const [ticketCode, setTicketCode] = useState("");
  const [level, setLevel] = useState(LEVELS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function load() {
    api<Payment[]>("/student/payments").then(setList).catch(() => setList([]));
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/student/claim", {
        method: "POST",
        body: JSON.stringify({ ticketCode, level }),
      });
      setTicketCode("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  const paid = (list ?? []).filter((p) => isPaid(p.status));
  const totalNGN = paid.reduce((s, p) => s + p.amountNGN, 0);
  const totalUSD = paid.reduce((s, p) => s + (p.amountUSD || 0), 0);

  const input =
    "min-h-12 rounded-xl border-2 border-slate-300 bg-white px-4 font-semibold outline-none focus:border-navy";

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-12">
      <h1 className="text-3xl font-extrabold">Hello, {user.name.split(" ")[0]}</h1>

      <div className="rounded-2xl bg-ink p-5 text-cream">
        <div className="text-sm font-semibold text-butter">Total paid for your education</div>
        <div className="mt-1 text-4xl font-extrabold">&#8358;{totalNGN.toLocaleString()}</div>
        <div className="text-sm text-cream/80">&asymp; ${totalUSD.toFixed(2)}</div>
      </div>

      <form onSubmit={claim} className="flex flex-col gap-3 rounded-2xl border-2 border-navy bg-white p-5">
        <div className="text-lg font-extrabold">Verify a ticket from your parent</div>
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
          {loading ? "Verifying..." : "Verify ticket"}
        </button>
      </form>

      {list === null && <p>Loading...</p>}
      {list && list.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-navy/40 p-8 text-center text-navy/70">
          No tickets verified yet. Enter the code your parent sent you.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {list?.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-navy bg-white p-4"
          >
            <div>
              <div className="font-extrabold">{p.university}</div>
              <div className="text-sm text-navy/70">{p.term} &middot; {p.studentLevel}</div>
              <div className="text-sm font-semibold">
                &#8358;{p.amountNGN.toLocaleString()} &middot; ${p.amountUSD?.toFixed(2)}
              </div>
            </div>
            <StatusBadge status={p.status} />
          </div>
        ))}
      </div>
    </main>
  );
}