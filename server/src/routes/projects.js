import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { slugify } from '../utils/slugify.js';

const r = Router();

// List projects with optional search and skill filtering
r.get('/', async (req, res) => {
  const { skill, search, page = 1, pageSize = 12 } = req.query;
  const where = {
    AND: [
      search ? { OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ] } : {},
      skill ? { skills: { some: { skill: { name: { equals: skill } } } } } : {}
    ]
  };

  const items = await prisma.project.findMany({
    where,
    include: { images: true, skills: { include: { skill: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize)
  });

  res.json(items);
});

// Get a single project by slug
r.get('/:slug', async (req, res) => {
  const p = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    include: { images: true, skills: { include: { skill: true } } }
  });
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Create a new project (admin only)
r.post('/', authRequired, adminOnly, async (req, res) => {
  const { userId, title, summary, description, githubUrl, liveUrl, youtubeEmbed, skillIds = [] } = req.body;
  const slug = slugify(req.body.slug || title);

  const project = await prisma.project.create({
    data: {
      userId: Number(userId),
      title, slug, summary, description, githubUrl, liveUrl, youtubeEmbed,
      skills: { create: skillIds.map(id => ({ skillId: Number(id) })) }
    }
  });

  res.status(201).json(project);
});

// Update an existing project (admin only)
r.put('/:id', authRequired, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const { title, slug, summary, description, githubUrl, liveUrl, youtubeEmbed, skillIds } = req.body;
  const data = { title, summary, description, githubUrl, liveUrl, youtubeEmbed };
  if (slug || title) data.slug = slugify(slug || title);

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...data,
      ...(Array.isArray(skillIds) ? {
        skills: { deleteMany: {}, create: skillIds.map(sid => ({ skillId: Number(sid) })) }
      } : {})
    }
  });

  res.json(project);
});

// Delete a project and its related images and skills (admin only)
r.delete('/:id', authRequired, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.projectImage.deleteMany({ where: { projectId: id } });
  await prisma.projectSkills.deleteMany({ where: { projectId: id } });
  await prisma.project.delete({ where: { id } });
  res.json({ ok: true });
});

export default r;
