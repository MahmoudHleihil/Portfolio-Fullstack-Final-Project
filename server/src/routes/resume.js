import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const r = Router();

// Get all resume entries: experience, education, certifications
r.get('/', async (_req, res) => {
  const [experience, education, certs] = await Promise.all([
    prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
    prisma.education.findMany({ orderBy: { startDate: 'desc' } }),
    prisma.certification.findMany({ orderBy: { dateIssued: 'desc' } })
  ]);
  res.json({ experience, education, certs });
});

// Create a new resume entry (admin only)
r.post('/', authRequired, adminOnly, async (req, res) => {
  const { type, ...data } = req.body;
  let result;

  if (type === 'experience') result = await prisma.experience.create({ data: { userId: 1, ...data } });
  else if (type === 'education') result = await prisma.education.create({ data: { userId: 1, ...data } });
  else if (type === 'certification') result = await prisma.certification.create({ data: { userId: 1, ...data } });
  else return res.status(400).json({ error: 'Invalid type' });

  res.status(201).json(result);
});

// Delete a resume entry by type and ID (admin only)
r.delete("/:type/:id", authRequired, adminOnly, async (req, res) => {
  const { type, id } = req.params;
  const entryId = parseInt(id);

  try {
    let result;
    if (type === "experience") {
      result = await prisma.experience.delete({ where: { id: entryId } });
    } else if (type === "education") {
      result = await prisma.education.delete({ where: { id: entryId } });
    } else if (type === "certification") {
      result = await prisma.certification.delete({ where: { id: entryId } });
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      // Prisma error if record not found
      return res.status(404).json({ error: `${type} entry not found` });
    }
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

export default r;
