import { Router } from "express";
import rateLimit from "express-rate-limit";
import { Payment } from "../models/Payment";
import { User } from "../models/User";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many attempts, try again later" },
});

function forStudent(p: any) {
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

router.post("/claim", limiter, requireAuth, requireRole("student"), async (req: AuthRequest, res) => {
  try {
    const { ticketCode, level } = req.body ?? {};
    if (!ticketCode || !level) {
      return res.status(400).json({ message: "Ticket code and level are required" });
    }

    const user = await User.findById(req.userId);
    const p = await Payment.findOne({
      ticketCode: String(ticketCode).trim().toUpperCase(),
    });

    // One generic message so nobody can probe which part was wrong
    if (!user || !p || p.studentEmail !== user.email || p.studentLevel !== level) {
      return res.status(404).json({
        message:
          "We could not verify that ticket. Check the code, your level, and that you signed up with the email your parent used.",
      });
    }
    if (p.student && String(p.student) !== req.userId) {
      return res.status(409).json({ message: "This ticket is already linked to another account" });
    }

    p.student = user._id;
    await p.save();
    res.json(forStudent(p));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/payments", requireAuth, requireRole("student"), async (req: AuthRequest, res) => {
  const list = await Payment.find({ student: req.userId }).sort({ createdAt: -1 });
  res.json(list.map(forStudent));
});

router.get("/payments/:id", requireAuth, requireRole("student"), async (req: AuthRequest, res) => {
  try {
    const p = await Payment.findOne({ _id: req.params.id, student: req.userId });
    if (!p) return res.status(404).json({ message: "Receipt not found" });
    res.json(forStudent(p));
  } catch {
    res.status(400).json({ message: "Invalid receipt id" });
  }
});

export default router;