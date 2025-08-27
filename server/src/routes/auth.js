import { Router } from 'express'; // Import Router from Express to define routes
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing passwords
import jwt from 'jsonwebtoken'; // Import jsonwebtoken to generate auth tokens
import { prisma } from '../lib/prisma.js'; // Import Prisma client for DB access

const r = Router(); // Create a new router instance

// ----------------------
// Route: Seed a first admin user (run only once)
// ----------------------
r.post('/seed-admin', async (req, res) => {
  const { email, password, name } = req.body; // Extract email, password, and name from request body

  // Check if a user with this email already exists
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) return res.json({ ok: true, message: 'Exists' }); // Return early if user exists

  // Hash the password before saving it
  const passwordHash = await bcrypt.hash(password, 10);

  // Create the admin user in the database
  const user = await prisma.user.create({ 
    data: { email, passwordHash, name, role: 'admin' } 
  });

  // Return success response with the created user
  res.json({ ok: true, user });
});

// ----------------------
// Route: Login user
// ----------------------
r.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  // Find the user by email
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) return res.status(400).json({ error: 'Invalid credentials' }); // User not found

  // Compare provided password with hashed password in DB
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' }); // Password mismatch

  // Generate JWT token containing user id, role, and email, expires in 2 hours
  const token = jwt.sign(
    { id: u.id, role: u.role, email: u.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  // Return token to client
  res.json({ token });
});

export default r; // Export the router to be used in main app
