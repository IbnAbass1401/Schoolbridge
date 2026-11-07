"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";

type Payment = {
  id: string;
  university: string;
  amountNGN: number;
  amountUSD: number;
  status: string;
};

function CheckoutView() {
  const user = useRequireAuth("parent");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [p, setP] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [method, setMethod] = useState<"card" | "transfer">("card");
  const [busy, setBusy] = useState(false);
  const [card, setCard] = useState({ name: "", number: "", exp: "", cvv: "" });

  useEffect(() => {
    if (!user) return;
    api<Payment>(`/payments/${id}`)
      .then((pay) => {
        if (pay.status !== "unpaid") router.replace(`/receipt/${id}`);
        else setP(pay);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load this payment"));
  }, [user, id, router]);

  async function confirm() {
    setError("");
    if (method === "card" && Object.values(card).some((v) => !v.trim())) {
      setError("Fill in all card fields (any values work in demo mode).");
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 2000)); // fake processing
    try {
      await api(`/payments/${id}/simulate`, { method: "POST" });
      router.push(`/receipt/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  const input = "min-h-12 w-full rounded-xl border-2 border-navy px-4 text-lg";

  if (!user) return null;
  if (error && !p)
    return <main className="mx-auto max-w-md px-5 py-12 font-semibold text-red-700">{error}</main>;
  if (!p) return <main className="mx-auto max-w-md px-5 py-12">Loading...</main>;

  return (
    <main className="mx-auto max-w-md px-5 py-10">
      <div className="rounded-3xl border-2 border-navy bg-white p-6 shadow-[8px_8px_0_#1E3A5F]">
        <div className="inline-block rounded-full bg-butter px-3 py-1 text-xs font-extrabold">
          DEMO CHECKOUT: no real money
        </div>
        <h1 className="mt-2 text-2xl font-extrabold">Pay ₦{p.amountNGN.toLocaleString()}</h1>
        <p className="text-navy/70">
          {p.university} receives ${p.amountUSD.toFixed(2)} (sample rate)
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {(["card", "transfer"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`min-h-12 rounded-xl border-2 border-navy font-extrabold ${
                method === m ? "bg-butter" : "bg-white"
              }`}
            >
              {m === "card" ? "Card" : "Bank transfer"}
            </button>
          ))}
        </div>

        {method === "card" ? (
          <div className="mt-5 flex flex-col gap-3">
            <input
              className={input}
              placeholder="Name on card"
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })}
            />
            <input
              className={input}
              inputMode="numeric"
              placeholder="Card number (any digits)"
              value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className={input}
                placeholder="MM/YY"
                value={card.exp}
                onChange={(e) => setCard({ ...card, exp: e.target.value })}
              />
              <input
                className={input}
                inputMode="numeric"
                placeholder="CVV"
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-butter p-4 text-sm">
            <div className="font-extrabold">Transfer to this demo account</div>
            <div className="mt-2">Bank: Demo Bank</div>
            <div>Account number: 0123456789</div>
            <div>Account name: SchoolBridge Demo</div>
            <div>Amount: ₦{p.amountNGN.toLocaleString()}</div>
            <div className="mt-2 text-navy/70">Pretend you sent it, then tap the button below.</div>
          </div>
        )}

        {error && <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>}

        <button
          type="button"
          onClick={confirm}
          disabled={busy}
          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-gold text-lg font-extrabold text-ink disabled:opacity-60"
        >
          {busy
            ? "Processing..."
            : method === "card"
              ? `Pay ₦${p.amountNGN.toLocaleString()}`
              : "I have made the transfer"}
        </button>
        <p className="mt-3 text-center text-xs text-navy/60">
          Demo only. Nothing you type here is saved or sent anywhere.
        </p>
        <Link
          href={`/receipt/${id}`}
          className="mt-3 block text-center text-sm font-bold text-navy underline"
        >
          Cancel
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-5 py-12">Loading...</main>}>
      <CheckoutView />
    </Suspense>
  );
}