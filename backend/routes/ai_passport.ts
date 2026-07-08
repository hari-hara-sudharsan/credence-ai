import express, { Request, Response } from 'express';
import { aiDecisionEngine } from '../services/ai/ai_decision_passport_engine.js';
import { explainabilityEngine } from '../services/ai/explainability_engine.js';

const router = express.Router();

// GET /api/ai/decision/:id
router.get('/decision/:id', (req: Request, res: Response): any => {
  // Mock finding decision across all histories for demo purposes
  let found = null;
  for (const [wallet, decisions] of (aiDecisionEngine as any).decisionHistory.entries()) {
    const d = decisions.find((x: any) => x.id === (req.params.id as string));
    if (d) found = d;
  }
  
  if (!found) return res.status(404).json({ error: "Decision not found" });
  return res.json(found);
});

// GET /api/ai/history/:wallet
router.get('/history/:wallet', (req: Request, res: Response): any => {
  const history = aiDecisionEngine.getDecisionHistory(req.params.wallet as string);
  return res.json(history);
});

// POST /api/ai/verify
router.post('/verify', (req: Request, res: Response): any => {
  const passport = req.body;
  if (!passport) return res.status(400).json({ error: "Passport required" });

  const isValid = aiDecisionEngine.verifyDecisionIntegrity(passport);
  return res.json({ valid: isValid });
});

// POST /api/ai/explain
router.post('/explain', (req: Request, res: Response): any => {
  const { score, inputs } = req.body;
  if (!score || !inputs) return res.status(400).json({ error: "Missing data" });

  const explanations = explainabilityEngine.explainScore(score, inputs);
  const risk = explainabilityEngine.explainRisk(inputs.riskScore);
  const plan = explainabilityEngine.generateImprovementPlan(inputs);

  return res.json({ explanations, risk, plan });
});

export default router;
