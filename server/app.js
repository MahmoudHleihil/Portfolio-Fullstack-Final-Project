import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import auth from './src/routes/auth.js';
import projects from './src/routes/projects.js';
import skills from './src/routes/skills.js';
import blogs from './src/routes/blogs.js';
import contact from './src/routes/contact.js';
import uploads from './src/routes/uploads.js';
import resume from './src/routes/resume.js';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

app.get('/', (_req, res) => res.send('Portfolio API OK'));
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/skills', skills);
app.use('/api/blogs', blogs);
app.use('/api/contact', contact);
app.use('/api', uploads);
app.use('/api/resume', resume);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening http://localhost:${PORT}`));
