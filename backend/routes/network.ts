import express from 'express';
import { analyticsEngine } from '../services/analytics/network_analytics_engine';
import { capitalEngine } from '../services/analytics/capital_metrics_engine';

const router = express.Router();

// GET /api/network/stats
router.get('/stats', (req, res) => {
  const report = analyticsEngine.generateNetworkReport();
  const capital = capitalEngine.calculateMetrics();

  return res.json({
    identities: report.identities,
    trustProofs: report.trustProofs,
    settlements: report.settlements,
    capitalUnlocked: capital.capitalUnlocked
  });
});

// GET /api/network/activity
router.get('/activity', (req, res) => {
  const activity = analyticsEngine.getRecentActivity(10);
  
  const formattedActivity = activity.map(evt => ({
    event: evt.eventType,
    wallet: `${evt.wallet.slice(0, 6)}...${evt.wallet.slice(-4)}`,
    impact: `+${evt.trustImpact}`
  }));

  return res.json(formattedActivity);
});

// GET /api/network/protocols
router.get('/protocols', (req, res) => {
  const protocols = analyticsEngine.calculateProtocolUsage();
  return res.json(protocols);
});

// GET /api/network/leaderboard
router.get('/leaderboard', (req, res) => {
  const leaderboard = analyticsEngine.getLeaderboard(10);
  return res.json(leaderboard);
});

export default router;
