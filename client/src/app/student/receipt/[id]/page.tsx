"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { isPaid } from "@/lib/constants";

type Payment = {
  id: string;
  studentName: string;
  studentEmail: string;
  studentLevel: string;
  university: string;
  term: string;
  amountNGN: number;
  amountUSD: number;
  ticketCode: string;
  status: string;
  updatedAt: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-slate-200 py-2">
      <span className="text-sm font-semibold text-navy/70">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function ReceiptView() {
  const user = useRequireAuth("student");
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Payment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api<Payment>(`/student/payments/${id}`).then(setP).catch((e) => setError(e.message));
  }, [user, id]);

  if (!user) return null;
  if (error) return <main className="mx-auto max-w-lg px-5 py-12 font-semibold text-red-700">{error}</main>;
  if (!p) return <main className="mx-auto max-w-lg px-5 py-12">Loading...</main>;

  const paid = isPaid(p.status);

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-12">
      <div className="rounded-3xl border-2 border-navy bg-white p-6 shadow-[8px_8px_0_#1E3A5F]">
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold">SchoolBridge Receipt</div>
          <div className="text-sm text-navy/70">{new Date(p.updatedAt).toLocaleDateString()}</div>
        </div>

        <div
          className={`mt-5 flex items-center gap-3 rounded-2xl p-4 ${
            paid ? "bg-butter" : "bg-red-50"
          }`}
        >
          <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true" className="flex-none">
            <circle cx="32" cy="32" r="32" fill={paid ? "#F5B700" : "#FCA5A5"} />
            {paid ? (
              <path d="M19 33l9 9 17-19" stroke="#0B1B2E" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M22 22l20 20M42 22L22 42" stroke="#7F1D1D" strokeWidth="5" fill="none" strokeLinecap="round" />
            )}
          </svg>
          <div className="text-lg font-extrabold">
            {paid
              ? `Congratulations ${p.studentName.split(" ")[0]}, your school fees have been paid.`
              : "Your school fees have not been paid yet."}
          </div>
        </div>

        <div className="mt-5">
          <Row label="Student" value={p.studentName} />
          <Row label="Email" value={p.studentEmail} />
          <Row label="Level" value={p.studentLevel} />
          <Row label="University" value={p.university} />
          <Row label="Term" value={p.term} />
          <Row label="Amount paid" value={`₦${p.amountNGN.toLocaleString()} (≈ $${p.amountUSD.toFixed(2)})`} />
          <Row label="Ticket code" value={p.ticketCode} />
          <Row label="Status" value={p.status.replace(/_/g, " ")} />
        </div>
        <p className="mt-4 text-xs text-navy/60">Demo mode: test payment, no real funds moved.</p>
      </div>

      <div className="no-print flex flex-col gap-3">
        <button
          onClick={() => window.print()}
          className="min-h-12 rounded-xl bg-navy text-lg font-extrabold text-cream hover:bg-ink"
        >
          Print or save as PDF
        </button>
        <Link href="/student/dashboard" className="text-center font-bold text-navy underline">
          Back to my tuition
        </Link>
      </div>
    </main>
  );
}

export default function StudentReceiptPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-lg px-5 py-12">Loading...</main>}>
      <ReceiptView />
    </Suspense>
  );
}