import express from 'express';
import { prisma } from '../database/prisma';

const router = express.Router();

// GET /api/profile/:wallet
router.get('/profile/:wallet', async (req, res) => {
  const wallet = req.params.wallet.toLowerCase();
  
  const profile = await prisma.financialIdentity.findUnique({
    where: { wallet }
  });

  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  return res.json(profile);
});

// GET /api/activity/:wallet
router.get('/activity/:wallet', async (req, res) => {
  const wallet = req.params.wallet.toLowerCase();
  
  // Note: Since Prisma Mock is limited, we simulate finding many filtering manually
  const allEvents = await prisma.trustEvent.findMany();
  const userEvents = allEvents.filter(e => e.wallet.toLowerCase() === wallet);

  return res.json(userEvents);
});

// GET /api/stats
router.get('/stats', async (req, res) => {
  const identities = await prisma.financialIdentity.findMany();
  const events = await prisma.trustEvent.findMany();
  const settlements = await prisma.settlement.findMany();

  return res.json({
    totalIdentities: identities.length,
    totalTrustEvents: events.length,
    totalSettlements: settlements.length
  });
});

export default router;
