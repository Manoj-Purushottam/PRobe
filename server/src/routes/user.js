import { Router } from 'express';
import prisma from '../lib/prisma.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.put('/github-token', async (req, res) => {
  const { githubToken } = req.body;

  if (!githubToken) {
    return res.status(400).json({ message: 'githubToken is required' });
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: { githubToken },
  });

  res.json({ message: 'GitHub token saved' });
});

router.get('/stats', async (req, res) => {
  const stats = await prisma.review.aggregate({
    where: { userId: req.user.id },
    _count: { id: true },
    _sum: {
      issueCount: true,
      criticalCount: true,
      warningCount: true,
      suggestionCount: true,
    },
  });

  res.json({
    totalReviews: stats._count.id,
    totalIssues: stats._sum.issueCount || 0,
    totalCritical: stats._sum.criticalCount || 0,
    totalWarnings: stats._sum.warningCount || 0,
    totalSuggestions: stats._sum.suggestionCount || 0,
  });
});

export default router;
