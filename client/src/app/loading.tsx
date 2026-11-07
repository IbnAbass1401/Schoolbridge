export default function Loading() {
  return (
    <main className="mx-auto flex max-w-xl items-center justify-center px-5 py-24">
      <div className="flex items-center gap-3 text-lg font-semibold text-navy">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy border-t-gold" />
        Loading...
      </div>
    </main>
  );
}