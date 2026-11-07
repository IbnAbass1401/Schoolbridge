import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";

const ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23F5B700'/%3E%3Cpath d='M6 21h20M9 21v-6a7 7 0 0 1 14 0v6' stroke='%230B1B2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: "SchoolBridge",
  description: "Pay school fees abroad from Nigeria.",
  icons: { icon: ICON },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <div className="bg-gold px-4 py-1.5 text-center text-sm font-extrabold text-ink">
          Demo mode: mock payments, no real money moves. Built for the Blaaiz Buildathon.
        </div>
        <Suspense fallback={<div className="h-17 bg-ink" />}>
          <Navbar />
        </Suspense>
        <div className="flex-1">{children}</div>
        <footer className="bg-ink px-5 py-6 text-center text-sm text-butter">
          <div className="font-extrabold text-cream">SchoolBridge</div>
          <div className="mt-1 text-butter/80">
            Demo project. Payments are simulated in the style of the Blaaiz cross-border flow
            (NGN collection, USD payout).
          </div>
        </footer>
      </body>
    </html>
  );
}