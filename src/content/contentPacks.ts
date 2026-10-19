import type { ContentPack } from '../types/index.ts';

export const CONTENT_PACKS: ContentPack[] = [
  {
    id: 'general_informatics',
    code: 'general_informatics',
    name: 'Informatika Umum (Fase E - SMK)',
    tagline: 'Pemetaan Fondasi Berpikir Komputasional, Literasi Keamanan, & Kolaborasi Digital',
    description: 'Dirancang untuk seluruh murid tingkat awal (Kelas X) semua jurusan SMK. Menguji kesiapan dasar algoritma, literasi data sederhana, pemecahan masalah (troubleshooting), etika digital, dan keamanan akun.',
    badgeColor: 'teal',
    missionIds: [
      'm1-digital-detective',
      'm2-logic-quest',
      'm3-data-explorer',
      'm4-problem-solver',
      'm5-cyber-safety',
      'm6-find-the-pattern',
      'm7-choose-your-world',
      'm8-build-your-plan',
      'm9-hint-explorer',
      'm12-my-learning-quest',
      'm13-digital-workflow',
      'm14-information-check',
      'm15-practical-decision',
      'm16-learning-reflection'
    ],
    prerequisites: ['Pengenalan Komputer Dasar', 'Kemampuan Membaca & Bernalar Sederhana']
  },
  {
    id: 'digital_business',
    code: 'digital_business',
    name: 'Bisnis Digital & E-Commerce',
    tagline: 'Asesmen Kesiapan Operasional Toko Digital & Analisis Data Penjualan',
    description: 'Fokus pada pemahaman alur transaksi bisnis daring, interpretasi grafik penjualan produk, strategi promosi digital, dan etika transaksi konsumen.',
    badgeColor: 'indigo',
    missionIds: [
      'm1-digital-detective',
      'm2-logic-quest',
      'm3-data-explorer',
      'm7-choose-your-world',
      'm8-build-your-plan',
      'm12-my-learning-quest',
      'm13-digital-workflow',
      'm14-information-check',
      'm15-practical-decision',
      'm16-learning-reflection'
    ],
    prerequisites: ['Literasi Digital Dasar', 'Pengantar Bisnis & Penjualan']
  },
  {
    id: 'rpl',
    code: 'rpl',
    name: 'Rekayasa Perangkat Lunak (PPLG / RPL)',
    tagline: 'Diagnostik Logika Algoritma, Pemecahan Masalah, & Debugging Kode',
    description: 'Menekankan pada logika komputasional, struktur kendali percabangan & perulangan, kemampuan menemukan kesalahan kode (debugging), dan analisis efisiensi solusi.',
    badgeColor: 'purple',
    missionIds: [
      'm2-logic-quest',
      'm6-find-the-pattern',
      'm10-spot-the-error',
      'm11-compare-solutions',
      'm7-choose-your-world',
      'm8-build-your-plan',
      'm9-hint-explorer',
      'm12-my-learning-quest',
      'm16-learning-reflection'
    ],
    prerequisites: ['Logika Matematika Sederhana', 'Pengenalan Algoritma']
  },
  {
    id: 'tkj',
    code: 'tkj',
    name: 'Teknik Jaringan Komputer & Telekomunikasi (TJKT / TKJ)',
    tagline: 'Diagnostik Troubleshooting Perangkat, Jaringan, & Keamanan Sistem',
    description: 'Mengukur kepekaan pemecahan masalah perangkat keras, konektivitas kabel/nirkabel, konfigurasi dasar, dan perlindungan keamanan jaringan.',
    badgeColor: 'sky',
    missionIds: [
      'm1-digital-detective',
      'm4-problem-solver',
      'm5-cyber-safety',
      'm7-choose-your-world',
      'm8-build-your-plan',
      'm12-my-learning-quest',
      'm13-digital-workflow',
      'm16-learning-reflection'
    ],
    prerequisites: ['Pengenalan Perangkat Keras Komputer']
  }
];
