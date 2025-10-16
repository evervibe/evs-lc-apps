/**
 * Legacy Password Hash Utilities
 * 
 * Supports multiple legacy hash algorithms used in the old system:
 * - MD5 (simple)
 * - SHA256 with fixed salt
 * - Plaintext (legacy fallback, INSECURE)
 */

import { createHash } from 'crypto';

// Fixed salt from legacy system (SHA256 variant)
const LEGACY_SHA256_SALT = 
  'phoohie1yaihooyaequae7PuiWoeNgahjieth3ru3yeeghaepahb7aeYaipe2we6zii6mai6uweig8siasheinoungeoyeiLohShi2xoh2xi8ooxee9ahpiehahc9Phe';

export type LegacyHashAlgo = 'md5' | 'sha256-salt' | 'plaintext';

export interface LegacyHashResult {
  matched: boolean;
  algo?: LegacyHashAlgo;
}

/**
 * Hash password using MD5 (legacy method 1)
 * Format: md5(password)
 */
export function hashMd5(password: string): string {
  const hash = createHash('md5').update(password).digest('hex');
  return hash.toLowerCase();
}

/**
 * Hash password using SHA256 with fixed salt (legacy method 2)
 * Format: sha256(username + salt + password)
 */
export function hashSha256Salt(username: string, password: string): string {
  const input = username + LEGACY_SHA256_SALT + password;
  const hash = createHash('sha256').update(input).digest('hex');
  return hash.toLowerCase();
}

/**
 * Verify password against a stored hash using detected algorithm
 */
export function verifyLegacyPassword(
  password: string,
  username: string,
  storedHash: string
): boolean {
  // Try MD5
  const md5Hash = hashMd5(password);
  if (md5Hash === storedHash.toLowerCase()) {
    return true;
  }

  // Try SHA256 with salt
  const sha256Hash = hashSha256Salt(username, password);
  if (sha256Hash === storedHash.toLowerCase()) {
    return true;
  }

  // Try plaintext (INSECURE fallback)
  if (password === storedHash) {
    return true;
  }

  return false;
}

/**
 * Detect which algorithm was used and verify
 * Returns both match result and detected algorithm
 */
export function detectAndVerify(params: {
  username: string;
  password: string;
  storedHash: string;
  algoHints?: LegacyHashAlgo[];
}): LegacyHashResult {
  const { username, password, storedHash, algoHints } = params;
  const normalizedHash = storedHash.toLowerCase();

  // If hints provided, try those first
  if (algoHints && algoHints.length > 0) {
    for (const algo of algoHints) {
      if (tryAlgorithm(algo, username, password, normalizedHash)) {
        return { matched: true, algo };
      }
    }
  }

  // Try all algorithms in order of likelihood
  const algorithms: LegacyHashAlgo[] = ['md5', 'sha256-salt', 'plaintext'];
  
  for (const algo of algorithms) {
    if (tryAlgorithm(algo, username, password, normalizedHash)) {
      return { matched: true, algo };
    }
  }

  return { matched: false };
}

/**
 * Try a specific algorithm
 */
function tryAlgorithm(
  algo: LegacyHashAlgo,
  username: string,
  password: string,
  normalizedHash: string
): boolean {
  switch (algo) {
    case 'md5':
      return hashMd5(password) === normalizedHash;
    
    case 'sha256-salt':
      return hashSha256Salt(username, password) === normalizedHash;
    
    case 'plaintext':
      return password === normalizedHash;
    
    default:
      return false;
  }
}

/**
 * Get a human-readable description of the algorithm
 */
export function getAlgorithmDescription(algo: LegacyHashAlgo): string {
  switch (algo) {
    case 'md5':
      return 'MD5 (Insecure, legacy)';
    case 'sha256-salt':
      return 'SHA256 with fixed salt (Insecure, legacy)';
    case 'plaintext':
      return 'Plaintext (CRITICAL SECURITY RISK)';
    default:
      return 'Unknown';
  }
}
