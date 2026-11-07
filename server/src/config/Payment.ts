import { Schema, model, Types } from "mongoose";
import { UNIVERSITIES } from "../config/universities";

export const PAYMENT_STATUSES = [
  "unpaid",
  "paid",
  "sent_to_school",
  "confirmed",
  "failed",
] as const;

const paymentSchema = new Schema(
  {
    parent: { type: Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, lowercase: true, trim: true },
    university: { type: String, enum: UNIVERSITIES, required: true },
    term: { type: String, required: true, trim: true },
    amountNGN: { type: Number, required: true, min: 1 },
    amountUSD: { type: Number },
    ticketCode: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: PAYMENT_STATUSES, default: "unpaid" },
    providerRef: { type: String },
  },
  { timestamps: true }
);

export const Payment = model("Payment", paymentSchema);