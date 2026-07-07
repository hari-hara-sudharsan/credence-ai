import { Router, Request, Response } from "express";
import { TrustDefenseEngine } from "../services/security/trust_defense_engine";

const router = Router();
const engine = new TrustDefenseEngine();

router.get("/trust/:wallet", (req: Request, res: Response) => {
  const wallet = req.params.wallet;
  const report = engine.generateDefenseReport(wallet);
  res.json({
    authenticity: report.authenticityScore,
    sybilRisk: report.sybilRisk,
    trustSafe: report.trustSafe
  });
});

router.get("/report/:wallet", (req: Request, res: Response) => {
  const wallet = req.params.wallet;
  const report = engine.generateDefenseReport(wallet);
  
  let analysis = "This wallet's reputation appears authentic.";
  if (!report.trustSafe) {
    analysis = "Warning: Possible artificial reputation farming detected.";
  }

  res.json({
    wallet: wallet.toLowerCase(),
    authenticityScore: report.authenticityScore,
    sybilRisk: report.sybilRisk,
    trustSafe: report.trustSafe,
    analysis
  });
});

export default router;
