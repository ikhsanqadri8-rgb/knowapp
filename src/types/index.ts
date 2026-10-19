export type UserRole = 'teacher' | 'student';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  educatorCodeVerified?: boolean;
  schoolName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SchoolClass {
  id: string;
  teacherId: string;
  teacherName: string;
  name: string;
  gradeLevel: string; // e.g. "Kelas X", "Kelas XI", "Kelas XII"
  major: string; // e.g. "Rekayasa Perangkat Lunak (RPL)", "Teknik Komputer & Jaringan (TKJ)", "Bisnis Digital", "Informatika Umum"
  description?: string;
  joinCode: string; // 6-digit unique alphanumeric code
  isArchived: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ClassMember {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'active' | 'removed';
  joinedAt: string;
}

export type AssessmentSessionStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'closed' | 'archived';

export interface AssessmentSession {
  id: string;
  classId: string;
  teacherId: string;
  name: string;
  description?: string;
  contentPackId: string; // 'general_informatics' | 'digital_business' | 'rpl' | 'tkj'
  selectedMissionIds: string[];
  status: AssessmentSessionStatus;
  allowHints: boolean;
  maxAttempts: number;
  scheduledStartTime?: string;
  deadlineTime?: string;
  createdAt: string;
  updatedAt?: string;
}

export type DiagnosticDimension = 
  | 'prior_knowledge' 
  | 'interests_context' 
  | 'activity_preferences' 
  | 'support_needs';

export interface MissionChoice {
  id: string;
  text: string;
  isCorrect?: boolean;
  feedback?: string;
  associatedTrait?: string;
}

export interface MissionOrderingItem {
  id: string;
  text: string;
  correctIndex: number;
}

export interface MissionMatchingPair {
  id: string;
  item: string;
  targetMatchId: string;
  targetText: string;
}

export type MissionType = 
  | 'multiple_choice' 
  | 'ordering' 
  | 'matching' 
  | 'spot_error' 
  | 'scenario_choice' 
  | 'interest_select' 
  | 'preference_rating' 
  | 'reflection';

export interface Mission {
  id: string;
  title: string;
  dimension: DiagnosticDimension;
  dimensionLabel: string;
  indicator: string;
  domain: 'general_informatics' | 'digital_business' | 'rpl' | 'tkj' | 'cross_cutting';
  type: MissionType;
  difficulty: 'Mudah' | 'Menengah' | 'Tantangan';
  targetDurationMinutes: number;
  briefing: {
    story: string;
    scenario: string;
    objective: string;
  };
  stimulus?: {
    codeSnippet?: string;
    dataTable?: { headers: string[]; rows: (string | number)[][] };
    visualDiagram?: string;
    scenarioText?: string;
  };
  challenge: {
    question: string;
    instructions: string;
    choices?: MissionChoice[];
    orderingItems?: MissionOrderingItem[];
    matchingPairs?: MissionMatchingPair[];
    scaleOptions?: { value: number; label: string }[];
    errorLines?: { id: string; text: string; isError: boolean; explanation: string }[];
  };
  hints: string[];
  rubric: {
    maxScore: number;
    criteria: string;
  };
  evidenceInterpretation: {
    correctMeaning: string;
    commonMisconception?: string;
    pedagogicalImplication: string;
  };
}

export interface ContentPack {
  id: string;
  name: string;
  code: 'general_informatics' | 'digital_business' | 'rpl' | 'tkj';
  tagline: string;
  description: string;
  badgeColor: string;
  missionIds: string[];
  prerequisites: string[];
}

export interface AssessmentResponse {
  id: string;
  sessionId: string;
  classId: string;
  studentId: string;
  studentName: string;
  missionId: string;
  dimension: DiagnosticDimension;
  answers: any;
  score: number;
  maxScore: number;
  hintsUsed: number;
  attemptsCount: number;
  timeSpentSeconds: number;
  completedAt: string;
  notes?: string;
}

export interface StudentLearningProfile {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  priorKnowledgeScorePercent: number;
  priorKnowledgeStatus: 'Belum Cukup Data' | 'Perlu Pendampingan Intensif' | 'Perlu Latihan Terarah' | 'Kesiapan Mandiri';
  interestsSummary: string[];
  preferredActivities: string[];
  supportNeeds: string[];
  totalMissionsCompleted: number;
  lastUpdated: string;
}

export interface AIRecommendationData {
  executiveSummary: string;
  observedPatterns: {
    dimension: string;
    pattern: string;
    evidenceSummary: string;
  }[];
  misconceptions: {
    concept: string;
    observedError: string;
    suggestedCorrection: string;
  }[];
  suggestedStrategies: {
    title: string;
    rationale: string;
    actionSteps: string[];
    differentiationType: string;
  }[];
  tarlGrouping: {
    readyForExtension: string[];
    needGuidedPractice: string[];
    needIntensiveScaffolding: string[];
    groupingStrategy: string;
  };
  scaffoldingSteps: string[];
  limitations: string;
}

export interface StoredAIRecommendation {
  id: string;
  sessionId: string;
  classId: string;
  teacherId: string;
  data: AIRecommendationData;
  teacherNotes?: string;
  status: 'draft' | 'reviewed' | 'applied';
  generatedAt: string;
  updatedAt?: string;
}
