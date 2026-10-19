import type { AssessmentSession, AssessmentSessionStatus } from '../types/index.ts';

/**
 * Generates a clean, readable 6-character unique join code.
 * Excludes easily confusable characters (0, O, 1, I, L).
 */
export function generateCleanJoinCode(): string {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

/**
 * Validates a join code format.
 */
export function isValidJoinCodeFormat(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const clean = code.trim().toUpperCase();
  return clean.length === 6 && /^[A-Z0-9]{6}$/.test(clean);
}

/**
 * State machine for valid session status transitions.
 */
export const VALID_STATUS_TRANSITIONS: Record<AssessmentSessionStatus, AssessmentSessionStatus[]> = {
  draft: ['scheduled', 'active', 'archived'],
  scheduled: ['active', 'paused', 'archived'],
  active: ['paused', 'closed', 'archived'],
  paused: ['active', 'closed', 'archived'],
  closed: ['archived', 'active'],
  archived: ['draft', 'active']
};

export function canTransitionSessionStatus(
  currentStatus: AssessmentSessionStatus,
  targetStatus: AssessmentSessionStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = VALID_STATUS_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(targetStatus) : false;
}

/**
 * Evaluates whether a session is currently accepting student submissions.
 */
export function isSessionAcceptingSubmissions(session: AssessmentSession): {
  isAccepting: boolean;
  reason?: string;
} {
  if (session.status !== 'active') {
    return {
      isAccepting: false,
      reason: `Sesi ini sedang berstatus '${session.status}', belum atau tidak dapat menerima pengerjaan baru.`
    };
  }

  const now = new Date();

  if (session.scheduledStartTime) {
    const startTime = new Date(session.scheduledStartTime);
    if (now < startTime) {
      return {
        isAccepting: false,
        reason: `Sesi dijadwalkan baru akan dibuka pada ${startTime.toLocaleString('id-ID')}.`
      };
    }
  }

  if (session.deadlineTime) {
    const deadline = new Date(session.deadlineTime);
    if (now > deadline) {
      return {
        isAccepting: false,
        reason: `Batas waktu pengerjaan sesi telah berakhir pada ${deadline.toLocaleString('id-ID')}.`
      };
    }
  }

  return { isAccepting: true };
}
