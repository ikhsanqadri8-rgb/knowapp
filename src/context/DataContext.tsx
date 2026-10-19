import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { 
  SchoolClass, 
  ClassMember, 
  AssessmentSession, 
  AssessmentResponse, 
  StudentLearningProfile, 
  StoredAIRecommendation,
  AssessmentSessionStatus
} from '../types';
import { useAuth } from './AuthContext';
import { ALL_MISSIONS } from '../content/missionBank';
import { generateCleanJoinCode, canTransitionSessionStatus, isSessionAcceptingSubmissions } from '../utils/session';
import { calculateMissionScore, buildStudentDiagnosticProfile } from '../utils/scoring';

interface DataContextType {
  classes: SchoolClass[];
  members: ClassMember[];
  sessions: AssessmentSession[];
  responses: AssessmentResponse[];
  profiles: StudentLearningProfile[];
  recommendations: StoredAIRecommendation[];
  isLoading: boolean;
  
  // Class Actions
  createClass: (name: string, gradeLevel: string, major: string, description?: string) => Promise<SchoolClass>;
  updateClass: (classId: string, updates: Partial<Pick<SchoolClass, 'name' | 'gradeLevel' | 'major' | 'description'>>) => Promise<void>;
  archiveClass: (classId: string) => Promise<void>;
  restoreClass: (classId: string) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
  regenerateClassJoinCode: (classId: string) => Promise<string>;

  // Member Actions
  joinClassByCode: (code: string) => Promise<{ success: boolean; message: string; classItem?: SchoolClass }>;
  removeClassMember: (classId: string, studentId: string) => Promise<void>;

  // Session Actions
  createSession: (sessionData: Omit<AssessmentSession, 'id' | 'teacherId' | 'createdAt' | 'status'> & { status?: AssessmentSessionStatus }) => Promise<AssessmentSession>;
  updateSession: (sessionId: string, updates: Partial<AssessmentSession>) => Promise<void>;
  updateSessionStatus: (sessionId: string, status: AssessmentSessionStatus) => Promise<{ success: boolean; message?: string }>;
  duplicateSession: (sessionId: string) => Promise<AssessmentSession>;
  archiveSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;

  // Assessment Execution
  submitMissionResponse: (
    sessionId: string,
    missionId: string,
    answers: any,
    timeSpentSeconds: number,
    hintsUsed: number
  ) => Promise<{ score: number; percentage: number; isCorrect: boolean; feedback: string }>;

  // AI Recommendations
  requestAIRecommendations: (sessionId: string, teacherContext?: string) => Promise<{ success: boolean; data?: StoredAIRecommendation; error?: string }>;
  updateRecommendationNotes: (recId: string, notes: string, status: 'draft' | 'reviewed' | 'applied') => Promise<void>;

  // Query helpers
  getClassById: (classId: string) => SchoolClass | undefined;
  getSessionById: (sessionId: string) => AssessmentSession | undefined;
  getClassMembers: (classId: string) => ClassMember[];
  getClassSessions: (classId: string) => AssessmentSession[];
  getSessionResponses: (sessionId: string) => AssessmentResponse[];
  getStudentResponsesForSession: (sessionId: string, studentId: string) => AssessmentResponse[];
  getStudentProfile: (studentId: string, classId: string) => StudentLearningProfile | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLASSES: 'know_classes_v1',
  MEMBERS: 'know_members_v1',
  SESSIONS: 'know_sessions_v1',
  RESPONSES: 'know_responses_v1',
  PROFILES: 'know_profiles_v1',
  RECOMMENDATIONS: 'know_recommendations_v1'
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [profiles, setProfiles] = useState<StudentLearningProfile[]>([]);
  const [recommendations, setRecommendations] = useState<StoredAIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial load from local storage
  useEffect(() => {
    try {
      const savedClasses = localStorage.getItem(STORAGE_KEYS.CLASSES);
      if (savedClasses) setClasses(JSON.parse(savedClasses));

      const savedMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (savedMembers) setMembers(JSON.parse(savedMembers));

      const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (savedSessions) setSessions(JSON.parse(savedSessions));

      const savedResponses = localStorage.getItem(STORAGE_KEYS.RESPONSES);
      if (savedResponses) setResponses(JSON.parse(savedResponses));

      const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (savedProfiles) setProfiles(JSON.parse(savedProfiles));

      const savedRecs = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
      if (savedRecs) setRecommendations(JSON.parse(savedRecs));
    } catch (e) {
      console.error('Failed to load local database:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect to Firestore real-time synchronization whenever authenticated
  useEffect(() => {
    if (!user) return;

    const unsubs: (() => void)[] = [];

    try {
      // Sync classes
      const unsubClasses = onSnapshot(collection(db, 'classes'), (snap) => {
        const items = snap.docs.map((d) => d.data() as SchoolClass);
        if (items.length > 0) {
          setClasses(items);
          localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(items));
        }
      }, (err) => console.warn('Firestore classes sync note:', err.message));
      unsubs.push(unsubClasses);

      // Sync members
      const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => {
        const items = snap.docs.map((d) => d.data() as ClassMember);
        if (items.length > 0) {
          setMembers(items);
          localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(items));
        }
      }, (err) => console.warn('Firestore members sync note:', err.message));
      unsubs.push(unsubMembers);

      // Sync sessions
      const unsubSessions = onSnapshot(collection(db, 'sessions'), (snap) => {
        const items = snap.docs.map((d) => d.data() as AssessmentSession);
        if (items.length > 0) {
          setSessions(items);
          localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(items));
        }
      }, (err) => console.warn('Firestore sessions sync note:', err.message));
      unsubs.push(unsubSessions);

      // Sync responses
      const unsubResponses = onSnapshot(collection(db, 'responses'), (snap) => {
        const items = snap.docs.map((d) => d.data() as AssessmentResponse);
        if (items.length > 0) {
          setResponses(items);
          localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(items));
        }
      }, (err) => console.warn('Firestore responses sync note:', err.message));
      unsubs.push(unsubResponses);

      // Sync profiles
      const unsubProfiles = onSnapshot(collection(db, 'profiles'), (snap) => {
        const items = snap.docs.map((d) => d.data() as StudentLearningProfile);
        if (items.length > 0) {
          setProfiles(items);
          localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(items));
        }
      }, (err) => console.warn('Firestore profiles sync note:', err.message));
      unsubs.push(unsubProfiles);

      // Sync recommendations
      const unsubRecs = onSnapshot(collection(db, 'recommendations'), (snap) => {
        const items = snap.docs.map((d) => d.data() as StoredAIRecommendation);
        if (items.length > 0) {
          setRecommendations(items);
          localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(items));
        }
      }, (err) => console.warn('Firestore recs sync note:', err.message));
      unsubs.push(unsubRecs);

    } catch (e) {
      console.warn('Firestore subscriptions init:', e);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [user?.id]);

  // Sync to persistence
  const syncClasses = (updated: SchoolClass[]) => {
    setClasses(updated);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(updated));
  };

  const syncMembers = (updated: ClassMember[]) => {
    setMembers(updated);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
  };

  const syncSessions = (updated: AssessmentSession[]) => {
    setSessions(updated);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  };

  const syncResponses = (updated: AssessmentResponse[]) => {
    setResponses(updated);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(updated));
  };

  const syncProfiles = (updated: StudentLearningProfile[]) => {
    setProfiles(updated);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updated));
  };

  const syncRecommendations = (updated: StoredAIRecommendation[]) => {
    setRecommendations(updated);
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(updated));
  };

  // CLASS ACTIONS
  const createClass = async (
    name: string,
    gradeLevel: string,
    major: string,
    description?: string
  ): Promise<SchoolClass> => {
    if (!user || user.role !== 'teacher') {
      throw new Error('Hanya pengguna terverifikasi sebagai Guru yang berhak membuat kelas.');
    }

    const newClass: SchoolClass = {
      id: `cls_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      teacherId: user.id,
      teacherName: user.displayName,
      name: name.trim(),
      gradeLevel: gradeLevel.trim(),
      major: major.trim(),
      description: description?.trim(),
      joinCode: generateCleanJoinCode(),
      isArchived: false,
      createdAt: new Date().toISOString()
    };

    const next = [...classes, newClass];
    syncClasses(next);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'classes', newClass.id), newClass);
    } catch (fsErr) {
      console.warn('Firestore class save notice:', fsErr);
    }

    return newClass;
  };

  const updateClass = async (
    classId: string,
    updates: Partial<Pick<SchoolClass, 'name' | 'gradeLevel' | 'major' | 'description'>>
  ): Promise<void> => {
    const target = classes.find((c) => c.id === classId);
    if (!target) throw new Error('Kelas tidak ditemukan.');
    if (user?.role !== 'teacher' || target.teacherId !== user.id) {
      throw new Error('Anda tidak memiliki hak otorisasi untuk mengubah kelas ini.');
    }

    const updated = classes.map((c) => (c.id === classId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    syncClasses(updated);

    try {
      await updateDoc(doc(db, 'classes', classId), { ...updates, updatedAt: new Date().toISOString() });
    } catch (fsErr) {
      console.warn('Firestore class update notice:', fsErr);
    }
  };

  const archiveClass = async (classId: string): Promise<void> => {
    const target = classes.find((c) => c.id === classId);
    if (!target) throw new Error('Kelas tidak ditemukan.');
    if (user?.role !== 'teacher' || target.teacherId !== user.id) {
      throw new Error('Anda tidak memiliki hak otorisasi untuk mengarsipkan kelas ini.');
    }

    const updated = classes.map((c) => (c.id === classId ? { ...c, isArchived: true, updatedAt: new Date().toISOString() } : c));
    syncClasses(updated);

    try {
      await updateDoc(doc(db, 'classes', classId), { isArchived: true, updatedAt: new Date().toISOString() });
    } catch (fsErr) {
      console.warn('Firestore archive class notice:', fsErr);
    }
  };

  const restoreClass = async (classId: string): Promise<void> => {
    const target = classes.find((c) => c.id === classId);
    if (!target) throw new Error('Kelas tidak ditemukan.');
    if (user?.role !== 'teacher' || target.teacherId !== user.id) {
      throw new Error('Anda tidak memiliki hak otorisasi untuk memulihkan kelas ini.');
    }

    const updated = classes.map((c) => (c.id === classId ? { ...c, isArchived: false, updatedAt: new Date().toISOString() } : c));
    syncClasses(updated);

    try {
      await updateDoc(doc(db, 'classes', classId), { isArchived: false, updatedAt: new Date().toISOString() });
    } catch (fsErr) {
      console.warn('Firestore restore class notice:', fsErr);
    }
  };

  const deleteClass = async (classId: string): Promise<void> => {
    const target = classes.find((c) => c.id === classId);
    if (!target) throw new Error('Kelas tidak ditemukan.');
    if (user?.role !== 'teacher' || target.teacherId !== user.id) {
      throw new Error('Anda tidak memiliki hak otorisasi untuk menghapus kelas ini.');
    }

    syncClasses(classes.filter((c) => c.id !== classId));
    syncMembers(members.filter((m) => m.classId !== classId));
    syncSessions(sessions.filter((s) => s.classId !== classId));
    syncResponses(responses.filter((r) => r.classId !== classId));
    syncProfiles(profiles.filter((p) => p.classId !== classId));
    syncRecommendations(recommendations.filter((rec) => rec.classId !== classId));

    try {
      await deleteDoc(doc(db, 'classes', classId));
    } catch (fsErr) {
      console.warn('Firestore delete class notice:', fsErr);
    }
  };

  const regenerateClassJoinCode = async (classId: string): Promise<string> => {
    const target = classes.find((c) => c.id === classId);
    if (!target) throw new Error('Kelas tidak ditemukan.');
    if (user?.role !== 'teacher' || target.teacherId !== user.id) {
      throw new Error('Otorisasi ditolak.');
    }

    const newCode = generateCleanJoinCode();
    const updated = classes.map((c) => (c.id === classId ? { ...c, joinCode: newCode, updatedAt: new Date().toISOString() } : c));
    syncClasses(updated);

    try {
      await updateDoc(doc(db, 'classes', classId), { joinCode: newCode, updatedAt: new Date().toISOString() });
    } catch (fsErr) {
      console.warn('Firestore code regeneration notice:', fsErr);
    }
    return newCode;
  };

  // MEMBER ACTIONS
  const joinClassByCode = async (code: string): Promise<{ success: boolean; message: string; classItem?: SchoolClass }> => {
    if (!user) {
      return { success: false, message: 'Silakan login terlebih dahulu untuk bergabung ke kelas.' };
    }

    const cleanCode = code.trim().toUpperCase();
    const targetClass = classes.find((c) => c.joinCode === cleanCode && !c.isArchived);

    if (!targetClass) {
      return { success: false, message: 'Kode bergabung tidak valid atau kelas telah diarsipkan.' };
    }

    // Check existing membership
    const existing = members.find((m) => m.classId === targetClass.id && m.studentId === user.id);
    if (existing) {
      if (existing.status === 'removed') {
        return { success: false, message: 'Status keanggotaan Anda di kelas ini telah dinonaktifkan oleh guru pengampu.' };
      }
      return { success: true, message: 'Anda sudah terdaftar sebagai anggota di kelas ini.', classItem: targetClass };
    }

    const newMember: ClassMember = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      classId: targetClass.id,
      studentId: user.id,
      studentName: user.displayName,
      studentEmail: user.email,
      status: 'active',
      joinedAt: new Date().toISOString()
    };

    syncMembers([...members, newMember]);

    try {
      await setDoc(doc(db, 'members', newMember.id), newMember);
    } catch (fsErr) {
      console.warn('Firestore join class notice:', fsErr);
    }

    return { success: true, message: `Berhasil bergabung ke kelas ${targetClass.name}!`, classItem: targetClass };
  };

  const removeClassMember = async (classId: string, studentId: string): Promise<void> => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass || targetClass.teacherId !== user?.id) {
      throw new Error('Otorisasi ditolak.');
    }

    const updated = members.map((m) => 
      (m.classId === classId && m.studentId === studentId) 
        ? { ...m, status: 'removed' as const } 
        : m
    );
    syncMembers(updated);

    const targetMember = members.find((m) => m.classId === classId && m.studentId === studentId);
    if (targetMember) {
      try {
        await updateDoc(doc(db, 'members', targetMember.id), { status: 'removed' });
      } catch (fsErr) {
        console.warn('Firestore remove member notice:', fsErr);
      }
    }
  };

  // SESSION ACTIONS
  const createSession = async (
    sessionData: Omit<AssessmentSession, 'id' | 'teacherId' | 'createdAt' | 'status'> & { status?: AssessmentSessionStatus }
  ): Promise<AssessmentSession> => {
    if (!user || user.role !== 'teacher') {
      throw new Error('Hanya guru yang berhak membuat sesi asesmen.');
    }

    const targetClass = classes.find((c) => c.id === sessionData.classId);
    if (!targetClass || targetClass.teacherId !== user.id) {
      throw new Error('Kelas tidak valid atau bukan milik Anda.');
    }

    const newSession: AssessmentSession = {
      ...sessionData,
      id: `ses_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      teacherId: user.id,
      status: sessionData.status || 'draft',
      createdAt: new Date().toISOString()
    };

    syncSessions([...sessions, newSession]);

    try {
      await setDoc(doc(db, 'sessions', newSession.id), newSession);
    } catch (fsErr) {
      console.warn('Firestore create session notice:', fsErr);
    }

    return newSession;
  };

  const updateSession = async (sessionId: string, updates: Partial<AssessmentSession>): Promise<void> => {
    const target = sessions.find((s) => s.id === sessionId);
    if (!target || target.teacherId !== user?.id) {
      throw new Error('Sesi tidak ditemukan atau otorisasi ditolak.');
    }

    const updated = sessions.map((s) => (s.id === sessionId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
    syncSessions(updated);

    try {
      await updateDoc(doc(db, 'sessions', sessionId), { ...updates, updatedAt: new Date().toISOString() });
    } catch (fsErr) {
      console.warn('Firestore update session notice:', fsErr);
    }
  };

  const updateSessionStatus = async (
    sessionId: string,
    targetStatus: AssessmentSessionStatus
  ): Promise<{ success: boolean; message?: string }> => {
    const target = sessions.find((s) => s.id === sessionId);
    if (!target || target.teacherId !== user?.id) {
      return { success: false, message: 'Sesi tidak ditemukan atau Anda tidak berwenang.' };
    }

    if (!canTransitionSessionStatus(target.status, targetStatus)) {
      return {
        success: false,
        message: `Transisi status tidak valid dari '${target.status}' ke '${targetStatus}'.`
      };
    }

    const updated = sessions.map((s) => (s.id === sessionId ? { ...s, status: targetStatus, updatedAt: new Date().toISOString() } : s));
    syncSessions(updated);

    try {
      await updateDoc(doc(db, 'sessions', sessionId), { status: targetStatus, updatedAt: new Date().toISOString() });
    } catch (fsErr) {
      console.warn('Firestore session status notice:', fsErr);
    }

    return { success: true };
  };

  const duplicateSession = async (sessionId: string): Promise<AssessmentSession> => {
    const target = sessions.find((s) => s.id === sessionId);
    if (!target || target.teacherId !== user?.id) {
      throw new Error('Sesi tidak ditemukan atau otorisasi ditolak.');
    }

    const newSession: AssessmentSession = {
      id: `ses_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      classId: target.classId,
      teacherId: target.teacherId,
      name: `${target.name} (Salinan)`,
      description: target.description,
      contentPackId: target.contentPackId,
      selectedMissionIds: [...target.selectedMissionIds],
      status: 'draft',
      allowHints: target.allowHints,
      maxAttempts: target.maxAttempts,
      createdAt: new Date().toISOString()
    };

    syncSessions([...sessions, newSession]);

    try {
      await setDoc(doc(db, 'sessions', newSession.id), newSession);
    } catch (fsErr) {
      console.warn('Firestore duplicate session notice:', fsErr);
    }

    return newSession;
  };

  const archiveSession = async (sessionId: string): Promise<void> => {
    await updateSessionStatus(sessionId, 'archived');
  };

  const deleteSession = async (sessionId: string): Promise<void> => {
    const target = sessions.find((s) => s.id === sessionId);
    if (!target || target.teacherId !== user?.id) {
      throw new Error('Sesi tidak ditemukan atau otorisasi ditolak.');
    }

    syncSessions(sessions.filter((s) => s.id !== sessionId));
    syncResponses(responses.filter((r) => r.sessionId !== sessionId));
    syncRecommendations(recommendations.filter((rec) => rec.sessionId !== sessionId));

    try {
      await deleteDoc(doc(db, 'sessions', sessionId));
    } catch (fsErr) {
      console.warn('Firestore delete session notice:', fsErr);
    }
  };

  // ASSESSMENT SUBMISSION
  const submitMissionResponse = async (
    sessionId: string,
    missionId: string,
    answers: any,
    timeSpentSeconds: number,
    hintsUsed: number
  ): Promise<{ score: number; percentage: number; isCorrect: boolean; feedback: string }> => {
    if (!user) {
      throw new Error('Pengguna belum terautentikasi.');
    }

    const session = sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error('Sesi asesmen tidak ditemukan.');

    const submissionGate = isSessionAcceptingSubmissions(session);
    if (!submissionGate.isAccepting) {
      throw new Error(submissionGate.reason || 'Sesi ini tidak dapat menerima respons saat ini.');
    }

    const mission = ALL_MISSIONS.find((m) => m.id === missionId);
    if (!mission) throw new Error('Misi tidak ditemukan dalam bank konten.');

    const scoreResult = calculateMissionScore(mission, answers, hintsUsed);

    const newResponse: AssessmentResponse = {
      id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      classId: session.classId,
      studentId: user.id,
      studentName: user.displayName,
      missionId,
      dimension: mission.dimension,
      answers,
      score: scoreResult.score,
      maxScore: scoreResult.maxScore,
      hintsUsed,
      attemptsCount: 1,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      notes: scoreResult.evidenceNote
    };

    const nextResponses = [...responses.filter((r) => !(r.sessionId === sessionId && r.studentId === user.id && r.missionId === missionId)), newResponse];
    syncResponses(nextResponses);

    const updatedProfile = buildStudentDiagnosticProfile(
      user.id,
      user.displayName,
      session.classId,
      nextResponses
    );

    const nextProfiles = [
      ...profiles.filter((p) => !(p.studentId === user.id && p.classId === session.classId)),
      updatedProfile
    ];
    syncProfiles(nextProfiles);

    // Save to Firestore asynchronously
    try {
      await setDoc(doc(db, 'responses', newResponse.id), newResponse);
      await setDoc(doc(db, 'profiles', updatedProfile.id), updatedProfile);
    } catch (fsErr) {
      console.warn('Firestore submission save notice:', fsErr);
    }

    return {
      score: scoreResult.score,
      percentage: scoreResult.percentage,
      isCorrect: scoreResult.isCorrect,
      feedback: scoreResult.evidenceNote
    };
  };

  // AI RECOMMENDATIONS
  const requestAIRecommendations = async (
    sessionId: string,
    teacherContext?: string
  ): Promise<{ success: boolean; data?: StoredAIRecommendation; error?: string }> => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return { success: false, error: 'Sesi tidak ditemukan.' };

    const classItem = classes.find((c) => c.id === session.classId);
    if (!classItem) return { success: false, error: 'Kelas tidak ditemukan.' };

    const sessionResponses = responses.filter((r) => r.sessionId === sessionId);
    if (sessionResponses.length === 0) {
      return {
        success: false,
        error: 'Belum ada data respons pengerjaan murid di sesi ini. Rekomendasi AI memerlukan bukti respons aktual.'
      };
    }

    try {
      const payload = {
        sessionId,
        className: classItem.name,
        gradeLevel: classItem.gradeLevel,
        major: classItem.major,
        teacherContext,
        responsesSummary: sessionResponses.map((r) => ({
          studentName: r.studentName,
          missionId: r.missionId,
          dimension: r.dimension,
          score: r.score,
          maxScore: r.maxScore,
          hintsUsed: r.hintsUsed,
          timeSpentSeconds: r.timeSpentSeconds,
          notes: r.notes
        }))
      };

      const res = await fetch('/api/gemini/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Gagal memproses rekomendasi AI dari server.');
      }

      const storedRec: StoredAIRecommendation = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sessionId,
        classId: session.classId,
        teacherId: session.teacherId,
        data: resJson.data,
        teacherNotes: '',
        status: 'draft',
        generatedAt: new Date().toISOString()
      };

      const nextRecs = [...recommendations.filter((r) => r.sessionId !== sessionId), storedRec];
      syncRecommendations(nextRecs);

      try {
        await setDoc(doc(db, 'recommendations', storedRec.id), storedRec);
      } catch (fsErr) {
        console.warn('Firestore recommendation save notice:', fsErr);
      }

      return { success: true, data: storedRec };
    } catch (err: any) {
      return { success: false, error: err.message || 'Terjadi kesalahan pemanggilan AI.' };
    }
  };

  const updateRecommendationNotes = async (
    recId: string,
    notes: string,
    status: 'draft' | 'reviewed' | 'applied'
  ): Promise<void> => {
    const updated = recommendations.map((r) =>
      r.id === recId ? { ...r, teacherNotes: notes, status, updatedAt: new Date().toISOString() } : r
    );
    syncRecommendations(updated);

    try {
      await updateDoc(doc(db, 'recommendations', recId), {
        teacherNotes: notes,
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (fsErr) {
      console.warn('Firestore update rec notes notice:', fsErr);
    }
  };

  // QUERY HELPERS
  const getClassById = (classId: string) => classes.find((c) => c.id === classId);
  const getSessionById = (sessionId: string) => sessions.find((s) => s.id === sessionId);
  const getClassMembers = (classId: string) => members.filter((m) => m.classId === classId && m.status === 'active');
  const getClassSessions = (classId: string) => sessions.filter((s) => s.classId === classId);
  const getSessionResponses = (sessionId: string) => responses.filter((r) => r.sessionId === sessionId);
  const getStudentResponsesForSession = (sessionId: string, studentId: string) => 
    responses.filter((r) => r.sessionId === sessionId && r.studentId === studentId);
  const getStudentProfile = (studentId: string, classId: string) => 
    profiles.find((p) => p.studentId === studentId && p.classId === classId);

  return (
    <DataContext.Provider
      value={{
        classes,
        members,
        sessions,
        responses,
        profiles,
        recommendations,
        isLoading,
        createClass,
        updateClass,
        archiveClass,
        restoreClass,
        deleteClass,
        regenerateClassJoinCode,
        joinClassByCode,
        removeClassMember,
        createSession,
        updateSession,
        updateSessionStatus,
        duplicateSession,
        archiveSession,
        deleteSession,
        submitMissionResponse,
        requestAIRecommendations,
        updateRecommendationNotes,
        getClassById,
        getSessionById,
        getClassMembers,
        getClassSessions,
        getSessionResponses,
        getStudentResponsesForSession,
        getStudentProfile
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
