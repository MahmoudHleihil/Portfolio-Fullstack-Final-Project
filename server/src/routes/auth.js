import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const r = Router();

// Seed a first admin (run once)
r.post('/seed-admin', async (req, res) => {
  const { email, password, name } = req.body;
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) return res.json({ ok: true, message: 'Exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, name, role: 'admin' } });
  res.json({ ok: true, user });
});

r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: u.id, role: u.role, email: u.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

export default r;
