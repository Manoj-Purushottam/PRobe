import { Router } from 'express';
import prisma from '../lib/prisma.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { parsePRUrl, fetchPRData } from '../services/githubService.js';
import { analyzeCode } from '../services/claudeService.js';

const router = Router();

router.get('/share/:id', async (req, res) => {
  const review = await prisma.review.findUnique({
    where: { id: req.params.id },
  });

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  res.json(review);
});

router.use(authMiddleware);

router.post('/analyze', async (req, res) => {
  const { prUrl, githubToken } = req.body;

  if (!prUrl) {
    return res.status(400).json({ message: 'prUrl is required' });
  }

  const { owner, repo, prNumber } = parsePRUrl(prUrl);

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const token = githubToken || user?.githubToken || undefined;

  const prData = await fetchPRData(owner, repo, prNumber, token);

  const reviewResult = await analyzeCode(prData);

  const issues = reviewResult.issues || [];
  const issueCount = issues.length;
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const suggestionCount = issues.filter((i) => i.severity === 'suggestion').length;

  const saved = await prisma.review.create({
    data: {
      userId: req.user.id,
      prUrl,
      prTitle: prData.title,
      repoName: `${owner}/${repo}`,
      prNumber,
      authorLogin: prData.user,
      filesChanged: prData.changedFiles,
      additions: prData.additions,
      deletions: prData.deletions,
      reviewData: reviewResult,
      issueCount,
      criticalCount,
      warningCount,
      suggestionCount,
    },
  });

  res.status(201).json({
    id: saved.id,
    ...reviewResult,
    prMeta: {
      prTitle: saved.prTitle,
      repoName: saved.repoName,
      prNumber: saved.prNumber,
      authorLogin: saved.authorLogin,
      filesChanged: saved.filesChanged,
      additions: saved.additions,
      deletions: saved.deletions,
    },
  });
});

router.get('/history', async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      prUrl: true,
      prTitle: true,
      repoName: true,
      prNumber: true,
      issueCount: true,
      criticalCount: true,
      warningCount: true,
      suggestionCount: true,
      createdAt: true,
    },
  });

  res.json(reviews);
});

router.get('/:id', async (req, res) => {
  const review = await prisma.review.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  res.json(review);
});

router.delete('/:id', async (req, res) => {
  const review = await prisma.review.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  await prisma.review.delete({ where: { id: req.params.id } });

  res.json({ message: 'Review deleted' });
});

export default router;
