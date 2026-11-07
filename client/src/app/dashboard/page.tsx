"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import StatusBadge from "@/components/StatusBadge";

type Payment = {
  id: string;
  studentName: string;
  university: string;
  term: string;
  amountNGN: number;
  ticketCode: string;
  status: string;
};

export default function Dashboard() {
  const user = useRequireAuth();
  const [list, setList] = useState<Payment[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api<Payment[]>("/payments").then(setList).catch(() => setList([]));
  }, [user]);

  if (!user) return null;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Hello, {user.name.split(" ")[0]}</h1>
        <Link
          href="/pay"
          className="flex min-h-11 items-center rounded-full bg-gold px-5 font-extrabold text-ink hover:bg-butter"
        >
          New payment
        </Link>
      </div>

      {list === null && <p>Loading...</p>}
      {list && list.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-navy/40 p-8 text-center text-navy/70">
          No payments yet. Start one with &ldquo;New payment&rdquo;.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {list?.map((p) => (
          <Link
            key={p.id}
            href={`/receipt/${p.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-navy bg-white p-4 hover:bg-butter/40"
          >
            <div>
              <div className="font-extrabold">{p.studentName}</div>
              <div className="text-sm text-navy/70">{p.university} &middot; {p.term}</div>
              <div className="text-sm font-semibold">&#8358;{p.amountNGN.toLocaleString()} &middot; {p.ticketCode}</div>
            </div>
            <StatusBadge status={p.status} />
          </Link>
        ))}
      </div>
    </main>
  );
}