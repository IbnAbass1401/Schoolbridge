"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import Timeline from "@/components/Timeline";
import StatusBadge from "@/components/StatusBadge";

type Payment = {
  id: string;
  studentName: string;
  studentEmail: string;
  university: string;
  term: string;
  amountNGN: number;
  amountUSD: number;
  ticketCode: string;
  status: string;
};

export default function ReceiptPage() {
  const user = useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [paying, setPaying] = useState(false);

  const load = useCallback(() => {
    api<Payment>(`/payments/${id}`).then(setP).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user, load]);

  // Poll while the payment is moving
  useEffect(() => {
    if (!p || p.status === "unpaid" || p.status === "confirmed") return;
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, [p, load]);

  async function simulate() {
    setPaying(true);
    try {
      const updated = await api<Payment>(`/payments/${id}/simulate`, { method: "POST" });
      setP(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPaying(false);
    }
  }

  async function copy() {
    if (!p) return;
    await navigator.clipboard.writeText(p.ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!user) return null;
  if (error) return <main className="mx-auto max-w-lg px-5 py-12 font-semibold text-red-700">{error}</main>;
  if (!p) return <main className="mx-auto max-w-lg px-5 py-12">Loading...</main>;

  const unpaid = p.status === "unpaid";

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-12">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">{unpaid ? "Ready to pay" : "Payment received"}</h1>
        <StatusBadge status={p.status} />
      </div>

      <div className="rounded-2xl border-2 border-navy bg-white p-5">
        <div className="font-extrabold">{p.studentName}</div>
        <div className="text-sm text-navy/70">{p.university} &middot; {p.term}</div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-extrabold">&#8358;{p.amountNGN.toLocaleString()}</span>
          <span className="text-navy/70">&asymp; ${p.amountUSD.toFixed(2)}</span>
        </div>
      </div>

      {unpaid ? (
        <>
          <p className="text-sm text-navy/70">
            Demo mode: this simulates the naira payment. Real payments will go through Blaaiz.
          </p>
          <button
            onClick={simulate}
            disabled={paying}
            className="min-h-12 rounded-xl bg-gold text-lg font-extrabold text-ink hover:bg-butter disabled:opacity-60"
          >
            {paying ? "Processing..." : `Pay ₦${p.amountNGN.toLocaleString()} (demo)`}
          </button>
        </>
      ) : (
        <>
          <div className="rounded-2xl bg-ink p-6 text-center text-cream">
            <div className="text-sm font-semibold text-butter">TICKET CODE</div>
            <div className="mt-1 text-3xl font-extrabold tracking-widest">{p.ticketCode}</div>
            <p className="mt-2 text-sm text-cream/80">
              Send this code to {p.studentName.split(" ")[0]}. They also need their email ({p.studentEmail}).
            </p>
          </div>
          <button
            onClick={copy}
            className="min-h-12 rounded-xl bg-navy text-lg font-extrabold text-cream hover:bg-ink"
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
          <Timeline status={p.status} />
        </>
      )}

      <Link href="/dashboard" className="text-center font-bold text-navy underline">
        Back to dashboard
      </Link>
    </main>
  );
}