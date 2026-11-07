"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { isPaid } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";

type Payment = {
  id: string;
  studentLevel: string;
  university: string;
  term: string;
  amountNGN: number;
  amountUSD: number;
  status: string;
};

export default function StudentDashboard() {
  const user = useRequireAuth("student");
  const [list, setList] = useState<Payment[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api<Payment[]>("/student/payments").then(setList).catch(() => setList([]));
  }, [user]);

  if (!user) return null;

  const paid = (list ?? []).filter((p) => isPaid(p.status));
  const totalNGN = paid.reduce((s, p) => s + p.amountNGN, 0);
  const totalUSD = paid.reduce((s, p) => s + (p.amountUSD || 0), 0);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Hello, {user.name.split(" ")[0]}</h1>
        <Link
          href="/student/verify"
          className="flex min-h-11 items-center rounded-full bg-gold px-5 font-extrabold text-ink hover:bg-butter"
        >
          Verify tuition
        </Link>
      </div>

      <div className="rounded-2xl bg-ink p-5 text-cream">
        <div className="text-sm font-semibold text-butter">Total paid for your education</div>
        <div className="mt-1 text-4xl font-extrabold">&#8358;{totalNGN.toLocaleString()}</div>
        <div className="text-sm text-cream/80">&asymp; ${totalUSD.toFixed(2)}</div>
      </div>

      {list === null && <p>Loading...</p>}
      {list && list.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-navy/40 p-8 text-center text-navy/70">
          Nothing verified yet. Click &ldquo;Verify tuition&rdquo; and enter the code your parent sent you.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {list?.map((p) => (
          <Link
            key={p.id}
            href={`/student/receipt/${p.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-navy bg-white p-4 hover:bg-butter/40"
          >
            <div>
              <div className="font-extrabold">{p.university}</div>
              <div className="text-sm text-navy/70">{p.term} &middot; {p.studentLevel}</div>
              <div className="text-sm font-semibold">
                &#8358;{p.amountNGN.toLocaleString()} &middot; ${p.amountUSD?.toFixed(2)}
              </div>
            </div>
            <StatusBadge status={p.status} />
          </Link>
        ))}
      </div>
    </main>
  );
}