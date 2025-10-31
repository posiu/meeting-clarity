import crypto from 'crypto';
export function token(len = 32) {
  return crypto.randomBytes(len).toString('hex');
}