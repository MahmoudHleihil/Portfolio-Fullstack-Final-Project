import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const r = Router();

// Create a new contact message
r.post('/', async (req, res) => {
  const { userId, name, email, subject, message } = req.body;
  const m = await prisma.contactMessage.create({ data: { userId: userId ? Number(userId) : null, name, email, subject, message } });
  res.status(201).json(m);
});

// Get all contact messages (admin only)
r.get('/', authRequired, adminOnly, async (_req, res) => {
  const msgs = await prisma.contactMessage.findMany({ orderBy: { sentAt: 'desc' } });
  res.json(msgs);
});

// Update message status (admin only)
r.put('/:id', authRequired, adminOnly, async (req, res) => {
  const { status } = req.body;
  const m = await prisma.contactMessage.update({ where: { id: Number(req.params.id) }, data: { status } });
  res.json(m);
});

// Delete a message (admin only)
r.delete('/:id', authRequired, adminOnly, async (req, res) => {
  await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
