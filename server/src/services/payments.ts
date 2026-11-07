import { Payment } from "../models/Payment";

export const NGN_PER_USD = Number(process.env.NGN_PER_USD) || 1500; // sample rate

export function ngnToUsd(amountNGN: number) {
  return Math.round((amountNGN / NGN_PER_USD) * 100) / 100;
}

export function isMock() {
  return (process.env.PAYMENT_PROVIDER || "mock") === "mock";
}

export async function runMockLifecycle(paymentId: string) {
  await Payment.findByIdAndUpdate(paymentId, {
    status: "paid",
    providerRef: `mock_${paymentId}`,
  });
  setTimeout(async () => {
    await Payment.findByIdAndUpdate(paymentId, { status: "sent_to_school" });
  }, 3000);
  setTimeout(async () => {
    await Payment.findByIdAndUpdate(paymentId, { status: "confirmed" });
  }, 7000);
}