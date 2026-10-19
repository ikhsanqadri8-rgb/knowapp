import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCleanJoinCode, isValidJoinCodeFormat, canTransitionSessionStatus, isSessionAcceptingSubmissions } from './session.ts';
import type { AssessmentSession } from '../types/index.ts';

test('Session Utils - Generates 6-character valid code without confusable characters', () => {
  const code = generateCleanJoinCode();
  assert.equal(code.length, 6);
  assert.match(code, /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/);
  assert.equal(isValidJoinCodeFormat(code), true);
});

test('Session Utils - Validates join code formats strictly', () => {
  assert.equal(isValidJoinCodeFormat('ABC234'), true);
  assert.equal(isValidJoinCodeFormat('abc234'), true); // handles lowercase
  assert.equal(isValidJoinCodeFormat('12'), false); // too short
  assert.equal(isValidJoinCodeFormat('ABCDEFGH'), false); // too long
  assert.equal(isValidJoinCodeFormat('ABC!23'), false); // invalid characters
});

test('Session Utils - Enforces valid status transition state machine', () => {
  assert.equal(canTransitionSessionStatus('draft', 'active'), true);
  assert.equal(canTransitionSessionStatus('active', 'paused'), true);
  assert.equal(canTransitionSessionStatus('paused', 'active'), true);
  assert.equal(canTransitionSessionStatus('active', 'closed'), true);
  assert.equal(canTransitionSessionStatus('closed', 'draft'), false); // closed cannot jump directly to draft
});

test('Session Utils - Evaluates submission window correctly', () => {
  const baseSession: AssessmentSession = {
    id: 's-1',
    classId: 'c-1',
    teacherId: 't-1',
    name: 'Diagnostik Awal',
    contentPackId: 'general_informatics',
    selectedMissionIds: ['m1-digital-detective'],
    status: 'active',
    allowHints: true,
    maxAttempts: 1,
    createdAt: new Date().toISOString()
  };

  // Active session without time bounds accepts submissions
  assert.equal(isSessionAcceptingSubmissions(baseSession).isAccepting, true);

  // Paused session rejects
  const pausedSession = { ...baseSession, status: 'paused' as const };
  assert.equal(isSessionAcceptingSubmissions(pausedSession).isAccepting, false);

  // Expired deadline rejects
  const pastDate = new Date(Date.now() - 3600000).toISOString();
  const expiredSession = { ...baseSession, deadlineTime: pastDate };
  assert.equal(isSessionAcceptingSubmissions(expiredSession).isAccepting, false);
});
