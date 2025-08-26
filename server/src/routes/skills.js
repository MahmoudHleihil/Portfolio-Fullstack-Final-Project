import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const r = Router();

r.get('/', async (_req, res) => {
  const skills = await prisma.skill.findMany({ orderBy: { name: 'asc' } });
  res.json(skills);
});

r.post('/', authRequired, adminOnly, async (req, res) => {
  const { name, level } = req.body;
  const s = await prisma.skill.create({ data: { name, level: level ? Number(level) : null } });
  res.status(201).json(s);
});

r.put('/:id', authRequired, adminOnly, async (req, res) => {
  const { name, level } = req.body;
  const s = await prisma.skill.update({ where: { id: Number(req.params.id) }, data: { name, level: level ? Number(level) : null } });
  res.json(s);
});

r.delete('/:id', authRequired, adminOnly, async (req, res) => {
  await prisma.projectSkills.deleteMany({ where: { skillId: Number(req.params.id) } });
  await prisma.skill.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
