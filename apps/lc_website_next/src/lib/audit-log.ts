/**
 * Audit Logging Utility
 * 
 * Records security-relevant actions for compliance and security monitoring
 */

import { prisma } from './prisma';

export type AuditAction =
  | 'user.register'
  | 'user.login'
  | 'user.logout'
  | 'user.password_change'
  | 'user.password_reset_request'
  | 'user.password_reset_complete'
  | 'mfa.enabled'
  | 'mfa.disabled'
  | 'mfa.verify_success'
  | 'mfa.verify_failed'
  | 'mfa.backup_code_used'
  | 'game.link_account'
  | 'game.unlink_account'
  | 'server.add'
  | 'server.remove'
  | 'admin.action'
  | 'security.rate_limit'
  | 'security.invalid_attempt';

export interface AuditLogParams {
  actorUserId?: string;
  action: AuditAction;
  target: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create an audit log entry
 * Never throws errors to prevent audit failures from breaking functionality
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    // Filter out sensitive data from metadata
    const sanitizedMetadata = params.metadata
      ? sanitizeMetadata(params.metadata)
      : undefined;

    await prisma.auditLog.create({
      data: {
        actorUserId: params.actorUserId,
        action: params.action,
        target: params.target,
        metaJson: sanitizedMetadata ? JSON.stringify(sanitizedMetadata) : null,
      },
    });
  } catch (error) {
    // Log to console but don't throw - audit failures shouldn't break functionality
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Sanitize metadata to remove sensitive information
 */
function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...metadata };

  // Remove sensitive fields
  const sensitiveFields = [
    'password',
    'passwordHash',
    'token',
    'secret',
    'accessToken',
    'refreshToken',
    'apiKey',
  ];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(params: {
  actorUserId?: string;
  action?: AuditAction;
  limit?: number;
  offset?: number;
}) {
  return await prisma.auditLog.findMany({
    where: {
      actorUserId: params.actorUserId,
      action: params.action,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: params.limit || 50,
    skip: params.offset || 0,
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
}
