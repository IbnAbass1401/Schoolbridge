const ORDER = ["unpaid", "paid", "sent_to_school", "confirmed"];

const STEPS = [
  { label: "Payment received", sub: "Your naira payment was collected" },
  { label: "Sent to university", sub: "Converted and on its way" },
  { label: "Confirmed", sub: "The university has received it" },
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
            </div>
          </li>
        );
      })}
    </ol>
  );
}