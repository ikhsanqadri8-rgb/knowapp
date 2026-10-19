# KNOW — Interactive Diagnostic Assessment & Learning Insights Platform

> **Discover Learners. Design Better Learning.**  
> Dikembangkan oleh: **Ikhsan Qadri** (*Developer & Educational Technology Enthusiast*)  
> Target Pengguna: Guru dan Murid SMK (Informatika, RPL, TKJ, Bisnis Digital)

---

## 1. Ringkasan Produk
**KNOW** adalah platform asesmen diagnostik interaktif berbasis gamifikasi yang dirancang untuk menjembatani kebutuhan guru SMK dalam memetakan kesiapan awal belajar murid secara terstruktur, berbasis bukti empiris, dan bebas dari pelabelan peyoratif.

KNOW bukan sekadar kuis atau formulir digital biasa, melainkan menghadirkan alur misi sekuensial:
1. **Mission Briefing & Skenario**: Mengaitkan tantangan dengan studi kasus dunia kerja digital SMK.
2. **Interactive Challenge**: Memfasilitasi berbagai jenis interaksi (analisis skenario, pengurutan sekuensial, *spot the error*, eksplorasi minat, pemetaan preferensi modalitas instruksi).
3. **Umpan Balik Kontekstual & Scaffolding**: Petunjuk bertingkat yang membantu murid tanpa hukuman, dicatat secara transparan sebagai bukti kebutuhan dukungan.
4. **Learning Insights & Rekomendasi AI (Gemini)**: Menganalisis bukti respons untuk memberikan saran pengelompokan fleksibel *Teaching at the Right Level* (TaRL) dan strategi *Universal Design for Learning* (UDL) yang tetap berada dalam kendali pedagogis guru.

---

## 2. Empat Dimensi Kerangka Asesmen
1. **Dimensi 1 — Kemampuan Awal (Prior Knowledge)**: Literasi keamanan digital, logika algoritma, analisis data tabel, dan *troubleshooting* sistem.
2. **Dimensi 2 — Minat dan Konteks (Interests & Context)**: Memetakan konteks industri yang memotivasi murid (Toko Digital/Bisnis, Game & App, Desain Media, AI/Data, Jaringan/Cloud, Masalah Sosial).
3. **Dimensi 3 — Preferensi Aktivitas (Activity Preferences)**: Format belajar yang disukai (praktik langsung di lab, diagram visual alur, studi kasus analogi, kolaboratif tim).
4. **Dimensi 4 — Kebutuhan Dukungan (Support Needs)**: Mengukur dampak petunjuk bertingkat (*hints*) dan refleksi metakognisi murid.

---

## 3. Kebijakan Mutlak: Tanpa Demo User & Tanpa Data Palsu
Aplikasi KNOW dibangun dengan standar *clean production state*:
- **Tidak ada akun guru demo atau akun murid demo.**
- **Tidak ada tombol login instan palsu.**
- **Tidak ada kelas, sesi, atau respons fiktif.**
- **Dashboard menyajikan empty state informatif ketika belum ada aktivitas.**
- Seluruh metrik dan grafik dihitung murni dari data aktual yang tersimpan di sistem.

---

## 4. Arsitektur & Struktur Folder
```
├── server.ts                       # Backend Express & proxy aman server-side Gemini AI
├── firebase-blueprint.json         # Intermediate Representation (IR) skema entitas Firestore
├── firestore.rules                 # Aturan keamanan database Firestore (Zero-Trust RBAC)
├── security_spec.md                # Spesifikasi keamanan & Dirty Dozen attack audit
├── src/
│   ├── types/index.ts              # Model data TypeScript domain KNOW
│   ├── services/firebase.ts        # Inisialisasi Firebase & handler FirestoreErrorInfo
│   ├── context/
│   │   ├── AuthContext.tsx         # Autentikasi nyata & aktivasi kode guru
│   │   └── DataContext.tsx         # Manajemen kelas, sesi, respons, & rekomendasi AI
│   ├── content/
│   │   ├── contentPacks.ts         # 4 Paket Konten (Informatika Umum, RPL, TKJ, Bisnis Digital)
│   │   └── missionBank.ts          # 16 Bank Misi Lengkap & Interaktif
│   ├── utils/
│   │   ├── scoring.ts              # Scoring engine objektif independen dari AI
│   │   ├── scoring.test.ts         # Unit tests Node:test untuk scoring
│   │   ├── session.ts              # State machine sesi & generator kode kelas
│   │   └── session.test.ts         # Unit tests Node:test untuk sesi
│   └── components/
│       ├── common/                 # Navbar, Footer, Modal Privasi, Lupa Sandi
│       ├── public/                 # Landing Page, About KNOW, Katalog Bank Misi
│       ├── auth/                   # Halaman Login & Registrasi
│       ├── teacher/                # Dashboard, Kelas, Sesi, Analisis, Profil Murid, Ekspor
│       └── student/                # Hub Misi, Pelaksana Misi Interaktif, Lencana XP
```

---

## 5. Autentikasi & Aktivasi Role Guru
- **Murid SMK**: Registrasi akun menggunakan nama dan email yang valid.
- **Guru Pengampu**: Untuk mencegah eskalasi hak akses sepihak, registrasi Guru mewajibkan **Kode Aktivasi Edukator**.
  - Kode Resmi Uji Coba: `GURU-KNOW-2026`

---

## 6. Integrasi Server-Side Gemini AI
Endpoint `/api/gemini/recommendations` memproses data respons agregat sesi dan memanggil model `gemini-2.5-flash` dengan aman di backend menggunakan `process.env.GEMINI_API_KEY`:
- Mengelompokkan murid berdasarkan kesiapan (*ready for extension, need guided practice, need intensive scaffolding*).
- Menjelaskan kemungkinan miskonsepsi secara spesifik.
- Menyarankan diferensiasi instruksional konkret.
- Guru dapat mengedit catatan, menyetujui, atau menerapkan saran tersebut.

---

## 7. Ekspor Laporan & Print PDF
- **Ekspor CSV**: Mengunduh seluruh rekam jejak baris per baris yang mencakup skor, petunjuk yang dipakai, durasi, dan waktu pengerjaan.
- **Tampilan Cetak / Simpan PDF**: Tampilan cetak berstandar dokumen resmi sekolah lengkap dengan kop institusi, rekapitulasi nilai, serta *disclaimer* batasan instrumen asesmen.

---

## 8. Menjalankan Aplikasi
```bash
# Menjalankan server pengembangan (Express + Vite)
npm run dev

# Menjalankan rangkaian unit test logika murni
node --test src/utils/scoring.test.ts
node --test src/utils/session.test.ts

# Membangun bundle produksi
npm run build
```
