// ts-ignore
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'skyroutes_jwt_secret_2024_change_in_production';
const JWT_EXPIRES_IN = '1h';

// Generar token JWT
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verificar token JWT
export function verifyToken(token: string): any | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Verificar autenticación en el request
export async function verifyAuth(req: any): Promise<{ valid: boolean; user?: any }> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { valid: false };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return { valid: false };
  }

  return { valid: true, user: decoded };
}

// Verificar contraseña (futuro: hash bcrypt/crypt)
export function verifyPassword(inputPassword: string, hashedPassword: string): boolean {
  // Por ahora comparación simple - EN PRODUCCIÓN USAR HASH!
  return inputPassword === hashedPassword;
}