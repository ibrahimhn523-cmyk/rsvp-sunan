import jwt from 'jsonwebtoken';
import { getBearerToken } from './http.js';

const JWT_SECRET = process.env.JWT_SECRET;

export function signAdminToken(payload) {
  if (!JWT_SECRET) throw new Error('Missing JWT_SECRET');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  if (!JWT_SECRET) throw new Error('Missing JWT_SECRET');
  return jwt.verify(token, JWT_SECRET);
}

export function requireAdmin(req) {
  const token = getBearerToken(req);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
