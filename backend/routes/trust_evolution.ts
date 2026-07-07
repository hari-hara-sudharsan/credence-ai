import { Router, Request, Response } from "express";
import { TrustEvolutionEngine } from "../services/trust/trust_evolution_engine";

const router = Router();
const engine = new TrustEvolutionEngine();

router.get("/evolution/:wallet", (req: Request, res: Response) => {
  const wallet = req.params.wallet;
  const growth = engine.calculateTrustGrowth(wallet, "HSP_SETTLEMENT", "att_proof");
  res.json([
    {
      eventId: "ev_init",
      timestamp: new Date().toISOString(),
      previousScore: growth.previousScore,
      newScore: growth.newScore,
      change: growth.change,
      reason: growth.reason
    }
  ]);
});

router.get("/before-after/:wallet", (req: Request, res: Response) => {
  const wallet = req.params.wallet;
  const snapshot = engine.generateBeforeAfterSnapshot(wallet);
  res.json(snapshot);
});

router.get("/next-level/:wallet", (req: Request, res: Response) => {
  const wallet = req.params.wallet;
  const milestone = engine.calculateNextMilestone(wallet);
  res.json(milestone);
});

export default router;
