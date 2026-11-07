"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function PayPage() {
  const user = useRequireAuth();
  const router = useRouter();
  const [unis, setUnis] = useState<string[]>([]);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [term, setTerm] = useState("Spring 2027");
  const [amountNGN, setAmountNGN] = useState("500");
  const [usd, setUsd] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api<string[]>("/payments/universities").then((u) => {
      setUnis(u);
      setUniversity(u[0] ?? "");
    });
  }, []);

  useEffect(() => {
    const n = Number(amountNGN);
    if (!n || n <= 0) return setUsd(null);
    const t = setTimeout(() => {
      api<{ amountUSD: number }>(`/payments/quote?amountNGN=${n}`)
        .then((r) => setUsd(r.amountUSD))
        .catch(() => setUsd(null));
    }, 300);
    return () => clearTimeout(t);
  }, [amountNGN]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const p = await api<{ id: string }>("/payments", {
        method: "POST",
        body: JSON.stringify({
          studentName,
          studentEmail,
          university,
          term,
          amountNGN: Number(amountNGN),
        }),
      });
      router.push(`/receipt/${p.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!user) return null;

  const input =
    "min-h-12 rounded-xl border-2 border-slate-300 bg-white px-4 font-semibold outline-none focus:border-navy";

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-12">
      <h1 className="text-3xl font-extrabold">Who are you paying for?</h1>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="sn" className="text-sm font-semibold">Child&rsquo;s full name</label>
          <input id="sn" className={input} value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="se" className="text-sm font-semibold">Child&rsquo;s email</label>
          <input id="se" type="email" className={input} value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="un" className="text-sm font-semibold">University</label>
          <select id="un" className={input} value={university} onChange={(e) => setUniversity(e.target.value)}>
            {unis.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="tm" className="text-sm font-semibold">Term</label>
          <input id="tm" className={input} value={term} onChange={(e) => setTerm(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="am" className="text-sm font-semibold">Amount (NGN)</label>
          <input
            id="am"
            inputMode="numeric"
            className={`${input} border-navy text-2xl font-extrabold`}
            value={amountNGN}
            onChange={(e) => setAmountNGN(e.target.value.replace(/[^\d]/g, ""))}
            required
          />
        </div>

        <div className="rounded-2xl bg-butter p-4">
          <div className="text-sm font-semibold text-navy/80">University receives (sample rate)</div>
          <div className="text-3xl font-extrabold">{usd === null ? "--" : `$${usd.toFixed(2)}`}</div>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="min-h-12 rounded-xl bg-navy text-lg font-extrabold text-cream hover:bg-ink disabled:opacity-60"
        >
          {loading ? "Creating ticket..." : "Continue"}
        </button>
      </form>
    </main>
  );
}