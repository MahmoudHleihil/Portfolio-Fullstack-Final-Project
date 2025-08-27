import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { slugify } from '../utils/slugify.js';

const r = Router();

// List blog posts with optional search and pagination
r.get('/', async (req, res) => {
  const { page=1, pageSize=10, search } = req.query;
  const where = search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { contentHtml: { contains: search, mode: 'insensitive' } }] } : {};
  const posts = await prisma.blog.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    skip: (Number(page)-1)*Number(pageSize),
    take: Number(pageSize),
    select: { id:true, title:true, slug:true, coverUrl:true, publishedAt:true, createdAt:true }
  });
  res.json(posts);
});

// Get a single post by slug with approved comments
r.get('/:slug', async (req, res) => {
  const post = await prisma.blog.findUnique({
    where: { slug: req.params.slug },
    include: { comments: { where: { isApproved: true } } }
  });
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

// Create a new post (admin only)
r.post('/', authRequired, adminOnly, async (req, res) => {
  const { userId, title, contentHtml, coverUrl, publishedAt } = req.body;
  const slug = slugify(req.body.slug || title);
  const p = await prisma.blog.create({
    data: { userId: Number(userId), title, slug, contentHtml, coverUrl, publishedAt: publishedAt ? new Date(publishedAt) : null }
  });
  res.status(201).json(p);
});

// Update a post (admin only)
r.put('/:id', authRequired, adminOnly, async (req, res) => {
  const { title, contentHtml, coverUrl, publishedAt } = req.body;
  const data = { title, contentHtml, coverUrl, publishedAt: publishedAt ? new Date(publishedAt) : null };
  if (req.body.slug || title) data.slug = slugify(req.body.slug || title);
  const p = await prisma.blog.update({ where: { id: Number(req.params.id) }, data });
  res.json(p);
});

// Delete a post and its comments (admin only)
r.delete('/:id', authRequired, adminOnly, async (req, res) => {
  await prisma.comment.deleteMany({ where: { postId: Number(req.params.id) } });
  await prisma.blog.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// Add a comment
r.post('/:id/comments', async (req, res) => {
  const { authorName, authorEmail, content } = req.body;
  const c = await prisma.comment.create({ data: { postId: Number(req.params.id), authorName, authorEmail, content } });
  res.status(201).json(c);
});

// Approve a comment (admin only)
r.put('/comments/:cid/approve', authRequired, adminOnly, async (req, res) => {
  const c = await prisma.comment.update({ where: { id: Number(req.params.cid) }, data: { isApproved: true } });
  res.json(c);
});

export default r;
