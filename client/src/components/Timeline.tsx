const ORDER = ["unpaid", "paid", "sent_to_school", "confirmed"];

const STEPS = [
  {
    label: "Collection received (NGN)",
    sub: "Your naira payment was collected into the business wallet",
    api: "Blaaiz: collection.completed",
  },
  {
    label: "Payout sent (USD)",
    sub: "Converted and sent to the university",
    api: "Blaaiz: payout.processing",
  },
  {
    label: "Confirmed by school",
    sub: "The university has received it",
    api: "Blaaiz: payout.completed",
  },
];

export default function Timeline({ status }: { status: string }) {
  const idx = Math.max(ORDER.indexOf(status), 0);

  return (
    <ol className="flex flex-col gap-5 rounded-2xl border-2 border-navy bg-white p-5">
      {STEPS.map((s, i) => {
        const n = i + 1;
        const done = idx >= n;
        const current = idx === n - 1;
        const color = done ? "bg-navy" : current ? "bg-gold" : "bg-slate-300";
        return (
          <li key={s.label} className="flex items-center gap-4">
            <span className={`h-6 w-6 flex-none rounded-full ${color}`} />
            <div>
              <div className="font-extrabold">{s.label}</div>
              <div className="text-sm text-navy/70">{s.sub}</div>
              <div className="mt-0.5 text-xs font-semibold text-navy/50">
                {s.api} (demo)
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}