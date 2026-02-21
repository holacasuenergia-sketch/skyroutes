// ts-ignore
import { verifyPassword, generateToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  // Verificar contraseña (debería venir de variable de entorno)
  const adminPassword = process.env.ADMIN_PASSWORD || 'skyroutes25@';

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Generar token JWT que expira en 1 hora
  const token = generateToken({ role: 'admin' });

  res.status(200).json({
    success: true,
    token,
    expiresIn: '1h'
  });
}