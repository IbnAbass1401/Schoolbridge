import { Router } from "express";
import rateLimit from "express-rate-limit";
import { Payment } from "../models/Payment";

const router = Router();

const checkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many attempts, try again later" },
});

router.post("/check", checkLimiter, async (req, res) => {
  try {
    const { ticketCode, email } = req.body ?? {};
    if (!ticketCode || !email) {
      return res.status(400).json({ message: "Ticket code and email are required" });
    }

    const p = await Payment.findOne({
      ticketCode: String(ticketCode).trim().toUpperCase(),
      studentEmail: String(email).trim().toLowerCase(),
    });
    if (!p) {
      return res.status(404).json({ message: "No payment found for that code and email" });
    }

    const paid = p.status !== "unpaid" && p.status !== "failed";
    // Minimal info only: nothing about the parent
    res.json({
      paid,
      status: p.status,
      message: paid
        ? "Your tuition has been paid."
        : "Your tuition has not been paid yet. Ask your parent to complete the payment.",
      studentName: p.studentName,
      university: p.university,
      term: p.term,
      amountUSD: p.amountUSD,
      updatedAt: p.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;