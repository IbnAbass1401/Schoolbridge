import { Router } from "express";
import { Payment } from "../models/Payment";
import { UNIVERSITIES } from "../config/universities";
import { LEVELS } from "../config/levels";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";
import { generateTicketCode } from "../utils/ticket";
import { ngnToUsd, NGN_PER_USD, isMock, runMockLifecycle } from "../services/payments";

const router = Router();

function serialize(p: any) {
  return {
    id: p.id,
    studentName: p.studentName,
    studentEmail: p.studentEmail,
    studentLevel: p.studentLevel,
    university: p.university,
    term: p.term,
    amountNGN: p.amountNGN,
    amountUSD: p.amountUSD,
    ticketCode: p.ticketCode,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// Public helpers
router.get("/universities", (_req, res) => {
  res.json(UNIVERSITIES);
});

router.get("/quote", (req, res) => {
  const amountNGN = Number(req.query.amountNGN);
  if (!amountNGN || amountNGN <= 0) {
    return res.status(400).json({ message: "amountNGN must be a positive number" });
  }
  res.json({ amountNGN, amountUSD: ngnToUsd(amountNGN), rate: NGN_PER_USD, sample: true });
});

// Everything below needs a logged-in parent
router.use(requireAuth, requireRole("parent"));

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { studentName, studentEmail, studentLevel, university, term, amountNGN } =
      req.body ?? {};
    if (!studentName || !studentEmail || !studentLevel || !university || !term || !amountNGN) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!(UNIVERSITIES as readonly string[]).includes(university)) {
      return res.status(400).json({ message: "Pick a university from the list" });
    }
    if (!(LEVELS as readonly string[]).includes(studentLevel)) {
      return res.status(400).json({ message: "Pick the student's level from the list" });
    }
    const amount = Number(amountNGN);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    let ticketCode = generateTicketCode();
    while (await Payment.exists({ ticketCode })) ticketCode = generateTicketCode();

    const payment = await Payment.create({
      parent: req.userId,
      studentName,
      studentEmail,
      studentLevel,
      university,
      term,
      amountNGN: amount,
      amountUSD: ngnToUsd(amount),
      ticketCode,
    });

    res.status(201).json(serialize(payment));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  const list = await Payment.find({ parent: req.userId }).sort({ createdAt: -1 });
  res.json(list.map(serialize));
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const p = await Payment.findOne({ _id: req.params.id, parent: req.userId });
    if (!p) return res.status(404).json({ message: "Payment not found" });
    res.json(serialize(p));
  } catch {
    res.status(400).json({ message: "Invalid payment id" });
  }
});

// MOCK ONLY: pretend the parent paid
router.post("/:id/simulate", async (req: AuthRequest, res) => {
  if (!isMock()) return res.status(403).json({ message: "Simulation is disabled" });
  try {
    const p = await Payment.findOne({ _id: req.params.id, parent: req.userId });
    if (!p) return res.status(404).json({ message: "Payment not found" });
    if (p.status !== "unpaid") return res.json(serialize(p));

    await runMockLifecycle(p.id);
    const updated = await Payment.findById(p.id);
    res.json(serialize(updated));
  } catch {
    res.status(400).json({ message: "Invalid payment id" });
  }
});

export default router;