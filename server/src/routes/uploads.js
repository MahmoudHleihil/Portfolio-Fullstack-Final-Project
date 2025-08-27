import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { prisma } from '../lib/prisma.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const r = Router();
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload a project image (admin only)
r.post('/projects/:id/images', authRequired, adminOnly, upload.single('image'), async (req, res) => {
  const { caption, orderIndex } = req.body;

  // Save image info to database
  const pimg = await prisma.projectImage.create({
    data: {
      projectId: Number(req.params.id),
      url: `/${uploadDir}/${req.file.filename}`,
      caption,
      orderIndex: orderIndex ? Number(orderIndex) : null
    }
  });

  res.status(201).json(pimg);
});

export default r;
