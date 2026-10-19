import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMissionScore, buildStudentDiagnosticProfile } from './scoring.ts';
import { ALL_MISSIONS } from '../content/missionBank.ts';

test('Scoring Engine - Correct Multiple Choice gives full score without hints', () => {
  const m1 = ALL_MISSIONS.find((m) => m.id === 'm1-digital-detective')!;
  assert.ok(m1);

  // Correct answer is 'c1'
  const result = calculateMissionScore(m1, 'c1', 0);
  assert.equal(result.isCorrect, true);
  assert.equal(result.score, 100);
  assert.equal(result.percentage, 100);
});

test('Scoring Engine - Incorrect Multiple Choice gives zero score', () => {
  const m1 = ALL_MISSIONS.find((m) => m.id === 'm1-digital-detective')!;
  const result = calculateMissionScore(m1, 'c2', 0);
  assert.equal(result.isCorrect, false);
  assert.equal(result.score, 0);
  assert.equal(result.percentage, 0);
});

test('Scoring Engine - Ordering Challenge calculates proportional accuracy', () => {
  const m2 = ALL_MISSIONS.find((m) => m.id === 'm2-logic-quest')!;
  assert.ok(m2);

  // Full correct order
  const fullCorrect = ['step-stock', 'step-invoice', 'step-verify', 'step-ship'];
  const resFull = calculateMissionScore(m2, fullCorrect, 0);
  assert.equal(resFull.isCorrect, true);
  assert.equal(resFull.score, 100);

  // Partial order (2 out of 4 matching their correctIndex)
  const partial = ['step-stock', 'step-ship', 'step-verify', 'step-invoice'];
  const resPartial = calculateMissionScore(m2, partial, 0);
  assert.equal(resPartial.score, 50);
});

test('Scoring Engine - Interests dimension does not penalize subjective choice', () => {
  const m7 = ALL_MISSIONS.find((m) => m.id === 'm7-choose-your-world')!;
  assert.ok(m7);

  const res = calculateMissionScore(m7, 'int-game', 0);
  assert.equal(res.isCorrect, true);
  assert.equal(res.score, 100);
  assert.ok(res.evidenceNote.includes('int-game'));
});

test('Diagnostic Profile Builder - Computes student status accurately', () => {
  const mockResponses = [
    {
      id: 'resp-1',
      sessionId: 'sess-1',
      classId: 'class-1',
      studentId: 'stud-1',
      studentName: 'Ahmad Siswa',
      missionId: 'm1-digital-detective',
      dimension: 'prior_knowledge' as const,
      answers: 'c1',
      score: 100,
      maxScore: 100,
      hintsUsed: 0,
      attemptsCount: 1,
      timeSpentSeconds: 120,
      completedAt: new Date().toISOString()
    },
    {
      id: 'resp-2',
      sessionId: 'sess-1',
      classId: 'class-1',
      studentId: 'stud-1',
      studentName: 'Ahmad Siswa',
      missionId: 'm2-logic-quest',
      dimension: 'prior_knowledge' as const,
      answers: ['step-stock', 'step-invoice', 'step-verify', 'step-ship'],
      score: 100,
      maxScore: 100,
      hintsUsed: 0,
      attemptsCount: 1,
      timeSpentSeconds: 150,
      completedAt: new Date().toISOString()
    },
    {
      id: 'resp-3',
      sessionId: 'sess-1',
      classId: 'class-1',
      studentId: 'stud-1',
      studentName: 'Ahmad Siswa',
      missionId: 'm7-choose-your-world',
      dimension: 'interests_context' as const,
      answers: 'Game & Mobile Dev',
      score: 100,
      maxScore: 100,
      hintsUsed: 0,
      attemptsCount: 1,
      timeSpentSeconds: 60,
      completedAt: new Date().toISOString()
    }
  ];

  const profile = buildStudentDiagnosticProfile('stud-1', 'Ahmad Siswa', 'class-1', mockResponses);
  assert.equal(profile.studentId, 'stud-1');
  assert.equal(profile.priorKnowledgeScorePercent, 100);
  assert.equal(profile.priorKnowledgeStatus, 'Kesiapan Mandiri');
  assert.ok(profile.interestsSummary.includes('Game & Mobile Dev'));
});
