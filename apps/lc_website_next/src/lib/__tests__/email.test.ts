/**
 * Email Utility Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendEmail, sendPasswordResetEmail, sendMfaEnabledEmail } from '../email';

describe('Email Utility', () => {
  beforeEach(() => {
    // Mock console.log to prevent test output clutter
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sendEmail', () => {
    it('should log email in development mode', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');
      
      await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test HTML</p>',
        text: 'Test Text',
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('EMAIL SENT (DEV MODE)')
      );
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should generate password reset email with correct data', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');
      
      await sendPasswordResetEmail(
        'user@example.com',
        'test-token-123',
        'http://localhost:3000'
      );

      // Check that email was logged
      expect(consoleLogSpy).toHaveBeenCalled();
      
      // Verify the email content contains the reset link
      const logCalls = consoleLogSpy.mock.calls.flat().join(' ');
      expect(logCalls).toContain('user@example.com');
      expect(logCalls).toContain('test-token-123');
    });
  });

  describe('sendMfaEnabledEmail', () => {
    it('should generate MFA enabled notification email', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log');
      
      await sendMfaEnabledEmail('user@example.com');

      // Check that email was logged
      expect(consoleLogSpy).toHaveBeenCalled();
      
      // Verify the email content
      const logCalls = consoleLogSpy.mock.calls.flat().join(' ');
      expect(logCalls).toContain('user@example.com');
      expect(logCalls).toContain('Two-Factor Authentication');
    });
  });
});
