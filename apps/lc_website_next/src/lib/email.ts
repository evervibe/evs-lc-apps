/**
 * Email Utility
 * 
 * Handles sending emails with dev/prod environment support
 * In development: logs to console and file
 * In production: sends via SMTP
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// SMTP transporter (lazy initialization)
let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter === null && process.env.SMTP_HOST) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      
      console.log('SMTP transporter initialized');
    } catch (error) {
      console.error('Failed to initialize SMTP transporter:', error);
      return null;
    }
  }
  return transporter;
}

/**
 * Send an email (dev mode: console logging, prod mode: SMTP)
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Development: Log to console
    console.log('\n=== EMAIL SENT (DEV MODE) ===');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Text:', options.text);
    console.log('HTML:', options.html);
    console.log('=============================\n');
    
    // Also log to a file for persistence
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const logDir = path.join(process.cwd(), 'logs');
      await fs.mkdir(logDir, { recursive: true });
      
      const timestamp = new Date().toISOString();
      const logEntry = `
[${timestamp}]
To: ${options.to}
Subject: ${options.subject}
Text: ${options.text}
HTML: ${options.html}
---
`;
      
      await fs.appendFile(
        path.join(logDir, 'emails.log'),
        logEntry
      );
    } catch (error) {
      console.error('Failed to write email log:', error);
    }
  } else {
    // Production: Send via SMTP
    const smtp = getTransporter();
    
    if (!smtp) {
      throw new Error('SMTP not configured - set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD in production');
    }
    
    try {
      const info = await smtp.sendMail({
        from: process.env.SMTP_FROM || 'noreply@lcportal.com',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  baseUrl: string
): Promise<void> {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  
  await sendEmail({
    to: email,
    subject: 'Password Reset Request - LC Portal',
    text: `
You have requested to reset your password for LC Portal.

Click the link below to reset your password (valid for 1 hour):
${resetUrl}

If you did not request this, please ignore this email.

Best regards,
LC Portal Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #3B82F6; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
      margin: 20px 0;
    }
    .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>You have requested to reset your password for LC Portal.</p>
    <p>Click the button below to reset your password (valid for 1 hour):</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>Or copy this link: <br>${resetUrl}</p>
    <div class="footer">
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>LC Portal Team</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  });
}

/**
 * Send MFA enabled notification
 */
export async function sendMfaEnabledEmail(email: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Two-Factor Authentication Enabled - LC Portal',
    text: `
Two-factor authentication has been successfully enabled on your LC Portal account.

If you did not enable this, please contact support immediately.

Best regards,
LC Portal Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { 
      background-color: #FEF3C7; 
      border-left: 4px solid #F59E0B; 
      padding: 12px; 
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Two-Factor Authentication Enabled</h2>
    <p>Two-factor authentication has been successfully enabled on your LC Portal account.</p>
    <div class="alert">
      <strong>Security Notice:</strong> If you did not enable this, please contact support immediately.
    </div>
    <p>Best regards,<br>LC Portal Team</p>
  </div>
</body>
</html>
    `.trim(),
  });
}
