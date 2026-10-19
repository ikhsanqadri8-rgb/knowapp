import type { Mission, AssessmentResponse, DiagnosticDimension, StudentLearningProfile } from '../types/index.ts';

export interface ScoreResult {
  score: number;
  maxScore: number;
  isCorrect: boolean;
  percentage: number;
  evidenceNote: string;
}

/**
 * Calculates objective score for a mission response independently from AI.
 * Distinguishes cognitive/prior-knowledge tests from preference/interest surveys.
 */
export function calculateMissionScore(
  mission: Mission,
  userAnswer: any,
  hintsUsed: number = 0
): ScoreResult {
  const maxScore = mission.rubric.maxScore || 100;

  // Non-evaluative dimensions (Interests, Activity Preferences, Reflections)
  // are NOT scored as correct/incorrect cognitive competency.
  if (mission.dimension !== 'prior_knowledge') {
    const hasAnswer = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';
    return {
      score: hasAnswer ? maxScore : 0,
      maxScore,
      isCorrect: hasAnswer,
      percentage: hasAnswer ? 100 : 0,
      evidenceNote: hasAnswer 
        ? `Respons tercatat untuk pemetaan ${mission.dimensionLabel}: ${JSON.stringify(userAnswer)}` 
        : 'Data belum diisi'
    };
  }

  // Dimension: prior_knowledge (Cognitive / Diagnostic)
  let earnedScore = 0;
  let isCorrect = false;

  switch (mission.type) {
    case 'multiple_choice':
    case 'scenario_choice':
    case 'spot_error': {
      const selectedChoice = mission.challenge.choices?.find((c) => c.id === userAnswer);
      if (selectedChoice && selectedChoice.isCorrect) {
        earnedScore = maxScore;
        isCorrect = true;
      } else {
        earnedScore = 0;
        isCorrect = false;
      }
      break;
    }

    case 'ordering': {
      // userAnswer is expected to be an array of item IDs in student order
      if (Array.isArray(userAnswer) && mission.challenge.orderingItems) {
        const items = mission.challenge.orderingItems;
        let correctMatches = 0;
        userAnswer.forEach((itemId, idx) => {
          const item = items.find((i) => i.id === itemId);
          if (item && item.correctIndex === idx) {
            correctMatches++;
          }
        });
        const ratio = correctMatches / items.length;
        earnedScore = Math.round(ratio * maxScore);
        isCorrect = ratio === 1;
      }
      break;
    }

    default: {
      earnedScore = 0;
      isCorrect = false;
    }
  }

  // Slight hint adjustment recorded for diagnostic trace (does not penalize completely)
  const hintAdjustment = hintsUsed > 0 ? Math.min(hintsUsed * 5, 15) : 0;
  const finalScore = Math.max(0, earnedScore - hintAdjustment);

  return {
    score: finalScore,
    maxScore,
    isCorrect,
    percentage: Math.round((finalScore / maxScore) * 100),
    evidenceNote: isCorrect 
      ? mission.evidenceInterpretation.correctMeaning 
      : (mission.evidenceInterpretation.commonMisconception || 'Jawaban belum tepat')
  };
}

/**
 * Aggregates student responses into a transparent diagnostic profile.
 */
export function buildStudentDiagnosticProfile(
  studentId: string,
  studentName: string,
  classId: string,
  responses: AssessmentResponse[]
): StudentLearningProfile {
  const studentResponses = responses.filter((r) => r.studentId === studentId);

  // Filter cognitive responses
  const cognitiveResponses = studentResponses.filter((r) => r.dimension === 'prior_knowledge');
  
  let priorKnowledgePercent = 0;
  let priorKnowledgeStatus: StudentLearningProfile['priorKnowledgeStatus'] = 'Belum Cukup Data';

  if (cognitiveResponses.length >= 2) {
    const totalScore = cognitiveResponses.reduce((sum, r) => sum + r.score, 0);
    const totalMax = cognitiveResponses.reduce((sum, r) => sum + r.maxScore, 0);
    priorKnowledgePercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    if (priorKnowledgePercent >= 75) {
      priorKnowledgeStatus = 'Kesiapan Mandiri';
    } else if (priorKnowledgePercent >= 50) {
      priorKnowledgeStatus = 'Perlu Latihan Terarah';
    } else {
      priorKnowledgeStatus = 'Perlu Pendampingan Intensif';
    }
  }

  // Aggregate interests
  const interestResponses = studentResponses.filter((r) => r.dimension === 'interests_context');
  const interestsSummary: string[] = [];
  interestResponses.forEach((r) => {
    if (r.answers && typeof r.answers === 'string') {
      interestsSummary.push(r.answers);
    } else if (Array.isArray(r.answers)) {
      interestsSummary.push(...r.answers);
    }
  });

  // Aggregate activity preferences
  const activityResponses = studentResponses.filter((r) => r.dimension === 'activity_preferences');
  const preferredActivities: string[] = [];
  activityResponses.forEach((r) => {
    if (r.answers) preferredActivities.push(String(r.answers));
  });

  // Aggregate support needs
  const supportResponses = studentResponses.filter((r) => r.dimension === 'support_needs');
  const supportNeeds: string[] = [];
  supportResponses.forEach((r) => {
    if (r.answers) supportNeeds.push(String(r.answers));
  });

  return {
    id: `profile-${studentId}-${classId}`,
    studentId,
    studentName,
    classId,
    priorKnowledgeScorePercent: priorKnowledgePercent,
    priorKnowledgeStatus,
    interestsSummary: Array.from(new Set(interestsSummary)),
    preferredActivities: Array.from(new Set(preferredActivities)),
    supportNeeds: Array.from(new Set(supportNeeds)),
    totalMissionsCompleted: studentResponses.length,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Generates class-level indicators summary with sample size and valid responses count.
 */
export function calculateClassMetrics(
  responses: AssessmentResponse[],
  missions: Mission[]
) {
  const missionMap = new Map(missions.map((m) => [m.id, m]));
  const indicatorStats: {
    [missionId: string]: {
      missionTitle: string;
      dimension: DiagnosticDimension;
      dimensionLabel: string;
      indicator: string;
      totalResponses: number;
      correctResponses: number;
      averagePercentage: number;
      commonErrors: string[];
      hasSufficientData: boolean;
    };
  } = {};

  responses.forEach((resp) => {
    const mission = missionMap.get(resp.missionId);
    if (!mission) return;

    if (!indicatorStats[resp.missionId]) {
      indicatorStats[resp.missionId] = {
        missionTitle: mission.title,
        dimension: mission.dimension,
        dimensionLabel: mission.dimensionLabel,
        indicator: mission.indicator,
        totalResponses: 0,
        correctResponses: 0,
        averagePercentage: 0,
        commonErrors: [],
        hasSufficientData: false
      };
    }

    const stat = indicatorStats[resp.missionId];
    stat.totalResponses += 1;
    if (resp.score >= (resp.maxScore * 0.7)) {
      stat.correctResponses += 1;
    } else {
      if (mission.evidenceInterpretation.commonMisconception) {
        stat.commonErrors.push(mission.evidenceInterpretation.commonMisconception);
      }
    }
  });

  // Calculate percentages and sufficiency (need at least 1 response to display, 3+ for robust conclusions)
  Object.values(indicatorStats).forEach((stat) => {
    stat.hasSufficientData = stat.totalResponses >= 3;
    stat.averagePercentage = stat.totalResponses > 0
      ? Math.round((stat.correctResponses / stat.totalResponses) * 100)
      : 0;
    stat.commonErrors = Array.from(new Set(stat.commonErrors));
  });

  return indicatorStats;
}
