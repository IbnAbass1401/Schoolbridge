"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const UNIS = [
  "Harvard University",
  "Stanford University",
  "MIT",
  "Columbia University",
  "UT Austin",
];

const STEPS = [
  {
    n: "1",
    title: "Pay in naira",
    text: "Enter your child's details, pick the university and pay in NGN.",
  },
  {
    n: "2",
    title: "Share the ticket",
    text: "You get a ticket code (SB-XXXX-XXXX). Send it to your child.",
  },
  {
    n: "3",
    title: "Child gets the receipt",
    text: "Your child verifies the code and sees that the fees are paid.",
  },
];

export default function Home() {
  const [amount, setAmount] = useState("500");
  const [usd, setUsd] = useState<number | null>(null);

  useEffect(() => {
    const n = Number(amount);
    if (!n || n <= 0) {
      setUsd(null);
      return;
    }
    const t = setTimeout(() => {
      api<{ amountUSD: number }>(`/payments/quote?amountNGN=${n}`)
        .then((r) => setUsd(r.amountUSD))
        .catch(() => setUsd(null));
    }, 300);
    return () => clearTimeout(t);
  }, [amount]);

  return (
    <>
      <main className="mx-auto flex max-w-6xl flex-wrap items-center gap-12 px-5 py-14 md:px-10">
        <div className="flex min-w-75 flex-1 flex-col gap-6">
          <span className="self-start rounded-full bg-butter px-4 py-1 text-sm font-semibold">
            For Nigerian parents
          </span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Pay your child&rsquo;s school fees abroad, from Nigeria.
          </h1>
          <p className="max-w-xl text-lg text-navy/80">
            Pay in naira. Get a ticket code. Your child enters it and sees, instantly, that the
            fees are paid.
          </p>
          <div className="flex flex-wrap gap-2">
            {UNIS.map((u) => (
              <span
                key={u}
                className="rounded-full border-2 border-navy bg-white px-4 py-1 text-sm font-semibold"
              >
                {u}
              </span>
            ))}
          </div>
        </div>

        <div className="flex min-w-75 flex-1 flex-col gap-5 rounded-3xl border-2 border-navy bg-white p-8 shadow-[10px_10px_0_#1E3A5F]">
          <div className="text-xl font-extrabold">Quick quote</div>

          <div className="flex flex-col gap-1">
            <label htmlFor="amount" className="text-sm font-semibold text-navy/80">
              You pay (NGN)
            </label>
            <input
              id="amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              className="min-h-12 rounded-xl border-2 border-navy px-4 text-2xl font-extrabold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-navy/80">
              University receives (USD, sample rate)
            </span>
            <div className="flex min-h-12 items-center rounded-xl bg-butter px-4 text-2xl font-extrabold">
              {usd === null ? "--" : `$${usd.toFixed(2)}`}
            </div>
          </div>

          <p className="text-sm text-navy/70">Demo mode: small test amounts only.</p>

          <Link
            href="/pay"
            className="flex min-h-12 items-center justify-center rounded-xl bg-gold text-lg font-extrabold text-ink"
          >
            Start a payment
          </Link>
        </div>
      </main>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-10">
        <h2 className="mb-6 text-3xl font-extrabold">How it works</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_#1E3A5F]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-butter text-lg font-extrabold">
                {s.n}
              </div>
              <div className="text-xl font-extrabold">{s.title}</div>
              <p className="mt-1 text-navy/80">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-navy/70">
          Student? Use <span className="font-semibold">I am a student</span> in the menu to
          verify your ticket.
        </p>
      </section>
    </>
  );
}