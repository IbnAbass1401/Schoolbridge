const MAP: Record<string, { label: string; cls: string }> = {
  unpaid: { label: "Not paid", cls: "bg-red-100 text-red-800" },
  paid: { label: "Paid", cls: "bg-butter text-ink" },
  sent_to_school: { label: "Sent to university", cls: "bg-butter text-ink" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-100 text-emerald-800" },
  failed: { label: "Failed", cls: "bg-red-100 text-red-800" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = MAP[status] ?? { label: status, cls: "bg-slate-100 text-slate-800" };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${s.cls}`}>
      {s.label}
    </span>
  );
}