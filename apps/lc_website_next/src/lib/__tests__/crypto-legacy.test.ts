/**
 * Unit tests for crypto-legacy.ts
 * Tests legacy password verification (MD5, SHA256)
 */

import { describe, it, expect } from 'vitest';
import { verifyLegacyPassword, hashMd5, hashSha256Salt, detectAndVerify } from '../crypto-legacy';

describe('crypto-legacy', () => {
  describe('hashMd5', () => {
    it('should hash password with MD5', () => {
      const password = 'password';
      const hash = hashMd5(password);
      expect(hash).toBe('5f4dcc3b5aa765d61d8327deb882cf99');
    });
  });

  describe('hashSha256Salt', () => {
    it('should hash password with SHA256 and salt', () => {
      const username = 'testuser';
      const password = 'password';
      const hash = hashSha256Salt(username, password);
      expect(hash).toBeDefined();
      expect(hash.length).toBe(64); // SHA256 produces 64 hex chars
    });
  });

  describe('verifyLegacyPassword', () => {
    it('should verify MD5 hashed password', () => {
      const password = 'password';
      const username = 'testuser';
      const md5Hash = '5f4dcc3b5aa765d61d8327deb882cf99';
      
      const result = verifyLegacyPassword(password, username, md5Hash);
      expect(result).toBe(true);
    });

    it('should reject incorrect MD5 password', () => {
      const wrongPassword = 'wrongpassword';
      const username = 'testuser';
      const md5Hash = '5f4dcc3b5aa765d61d8327deb882cf99'; // password
      
      const result = verifyLegacyPassword(wrongPassword, username, md5Hash);
      expect(result).toBe(false);
    });

    it('should verify SHA256 hashed password', () => {
      const password = 'test123';
      const username = 'testuser';
      const sha256Hash = hashSha256Salt(username, password);
      
      const result = verifyLegacyPassword(password, username, sha256Hash);
      expect(result).toBe(true);
    });

    it('should reject incorrect SHA256 password', () => {
      const wrongPassword = 'wrong';
      const username = 'testuser';
      const sha256Hash = hashSha256Salt(username, 'test123');
      
      const result = verifyLegacyPassword(wrongPassword, username, sha256Hash);
      expect(result).toBe(false);
    });

    it('should verify plaintext password', () => {
      const password = 'mypassword';
      const username = 'testuser';
      
      const result = verifyLegacyPassword(password, username, password);
      expect(result).toBe(true);
    });

    it('should reject incorrect plaintext password', () => {
      const storedPassword = 'mypassword';
      const wrongPassword = 'wrongpassword';
      const username = 'testuser';
      
      const result = verifyLegacyPassword(wrongPassword, username, storedPassword);
      expect(result).toBe(false);
    });
  });

  describe('detectAndVerify', () => {
    it('should detect and verify MD5 password', () => {
      const password = 'password';
      const username = 'testuser';
      const md5Hash = hashMd5(password);
      
      const result = detectAndVerify({
        username,
        password,
        storedHash: md5Hash,
      });
      
      expect(result.matched).toBe(true);
      expect(result.algo).toBe('md5');
    });

    it('should detect and verify SHA256 password', () => {
      const password = 'test123';
      const username = 'testuser';
      const sha256Hash = hashSha256Salt(username, password);
      
      const result = detectAndVerify({
        username,
        password,
        storedHash: sha256Hash,
      });
      
      expect(result.matched).toBe(true);
      expect(result.algo).toBe('sha256-salt');
    });

    it('should return false for incorrect password', () => {
      const username = 'testuser';
      const md5Hash = hashMd5('correct');
      
      const result = detectAndVerify({
        username,
        password: 'wrong',
        storedHash: md5Hash,
      });
      
      expect(result.matched).toBe(false);
    });
  });
});
