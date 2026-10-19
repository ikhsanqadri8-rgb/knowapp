# KNOW Security Specification & Dirty Dozen Audit

## 1. Data Invariants
1. **Teacher Ownership**: A class or assessment session can only be created, modified, or deleted by its authenticated teacher owner (`teacherId == request.auth.uid`).
2. **Student Isolation**: A student can only view their own assessment responses and diagnostic profile (`studentId == request.auth.uid`). A student cannot view other students' scores or submissions.
3. **Official Score Protection**: A student cannot write or tamper with final scores; assessment response records must match submission validation rules.
4. **Active Session Gate**: Responses cannot be submitted to a session that is `draft`, `paused`, `closed`, or `archived`.
5. **Class Membership Integrity**: A student can only submit responses for a class in which they are an active member.
6. **No Client Role Escalation**: A user cannot self-assign or elevate their role to `admin` or modify their role after creation.
7. **No Blanket Reads**: No query or read may dump the entire database or classes belonging to other teachers.

## 2. The Dirty Dozen Attack Payloads
1. **Payload 1 (Role Escalation)**: Student sends `{ role: "teacher", email: "student@school.id" }` in profile update. (Blocked: role field is immutable after creation).
2. **Payload 2 (Cross-Teacher Class Hijack)**: Teacher B sends update to `/classes/{classId}` where `teacherId` belongs to Teacher A. (Blocked: `existing().teacherId == request.auth.uid`).
3. **Payload 3 (Score Forgery)**: Student submits `{ score: 100, maxScore: 100 }` on a mission they failed. (Blocked: score field validated against rubric bounds and server-computed validation).
4. **Payload 4 (Post-Close Submission)**: Student writes to `/assessmentResponses` when session status is `closed`. (Blocked: session status check).
5. **Payload 5 (ID Poisoning Attack)**: Attacker attempts to write to a document with 10KB string ID. (Blocked: `isValidId(docId)` length <= 128 chars).
6. **Payload 6 (Shadow Field Injection)**: User updates user profile with `{ displayName: "Budi", isSuperAdmin: true }`. (Blocked: `affectedKeys().hasOnly(['displayName', 'updatedAt'])`).
7. **Payload 7 (Unauthenticated Class Member List)**: Unauthenticated visitor queries `/classMembers`. (Blocked: `request.auth != null`).
8. **Payload 8 (Student Querying Teacher Sessions)**: Student queries another class's sessions. (Blocked: student can only read sessions of classes they are enrolled in).
9. **Payload 9 (Teacher Deleting Another Teacher's Class)**: Teacher B sends delete request to Teacher A's class. (Blocked: `existing().teacherId == request.auth.uid`).
10. **Payload 10 (Denial of Wallet String Injection)**: User sends 2MB payload into `description` field. (Blocked: `data.description.size() <= 500`).
11. **Payload 11 (Orphaned Write Attack)**: User creates assessment response referencing non-existent class or session. (Blocked: `exists(/databases/$(database)/documents/assessmentSessions/$(incoming().sessionId))`).
12. **Payload 12 (AI Recommendation Tamper)**: Student attempts to modify AI recommendation notes or strategies. (Blocked: only class teacher can modify `aiRecommendations`).
