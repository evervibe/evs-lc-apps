/**
 * Portal Password Hashing with Argon2id
 * 
 * Modern password hashing for new portal accounts
 */

import { hash, verify } from '@node-rs/argon2';

const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

/**
 * Hash a password using Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, ARGON2_OPTIONS);
}

/**
 * Verify a password against an Argon2id hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await verify(hash, password);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}
