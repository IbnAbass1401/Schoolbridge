import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-5 px-5 py-24 text-center">
      <div className="text-7xl font-extrabold text-navy">404</div>
      <h1 className="text-2xl font-extrabold">This page doesn&rsquo;t exist</h1>
      <p className="text-navy/80">The link may be wrong, or the page may have moved.</p>
      <Link
        href="/"
        className="flex min-h-12 items-center justify-center rounded-xl bg-gold px-6 text-lg font-extrabold text-ink"
      >
        Back to home
      </Link>
    </main>
  );
}