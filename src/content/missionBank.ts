import type { Mission } from '../types/index.ts';

export const ALL_MISSIONS: Mission[] = [
  {
    id: 'm1-digital-detective',
    title: 'Digital Detective',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Literasi Keamanan',
    indicator: 'Menganalisis indikator email phishing dan rekayasa sosial',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Mudah',
    targetDurationMinutes: 10,
    briefing: {
      story: 'Seseorang dari divisi keuangan menerima email mendesak mengenai faktur yang tertunggak.',
      scenario: 'Email tersebut meminta pengguna segera mengeklik tautan `http://bank-bca-verifikasi-tagihan.biz/login` dalam kurun waktu 1 jam sebelum akun ditutup.',
      objective: 'Identifikasi tanda bahaya (red flag) paling kuat yang membuktikan email ini adalah serangan phishing.'
    },
    stimulus: {
      scenarioText: `Dari: support@bank-verifikasi.net
Kepada: kasir.toko@smk-bisa.sch.id
Subjek: [MENDESAK] Pembekuan Rekening Toko dalam 1 Jam!

Kepada Pelanggan Terhormat,
Sistem mendeteksi transaksi mencurigakan. Klik tautan berikut segera untuk membatalkan:
http://bank-bca-verifikasi-tagihan.biz/login

Jika tidak, rekening Anda dibekukan secara permanen.`
    },
    challenge: {
      question: 'Manakah kombinasi indikator paling valid yang menandakan pesan ini adalah penipuan (phishing)?',
      instructions: 'Pilih satu opsi yang memberikan alasan paling akurat secara teknis.',
      choices: [
        {
          id: 'c1',
          text: 'Domain pengirim dan URL tautan tidak resmi (bukan domain resmi bank) serta menggunakan ancaman batas waktu darurat.',
          isCorrect: true,
          feedback: 'Tepat sekali! Domain palsu (bukan bca.co.id) dan taktik urgensi psikologis adalah ciri utama rekayasa sosial phishing.'
        },
        {
          id: 'c2',
          text: 'Pesan dikirim pada jam kerja normal karyawan kantor.',
          isCorrect: false,
          feedback: 'Waktu pengiriman jam kerja bukan indikator phishing; penyerang sering mengirim saat jam sibuk.'
        },
        {
          id: 'c3',
          text: 'Email menggunakan sapaan resmi "Pelanggan Terhormat".',
          isCorrect: false,
          feedback: 'Sapaan umum tanpa nama penerima justru merupakan ciri pesan massal yang patut dicurigai.'
        },
        {
          id: 'c4',
          text: 'Email tidak menyertakan lampiran file PDF atau ZIP.',
          isCorrect: false,
          feedback: 'Tautan berbahaya bisa langsung mengeksploitasi kredensial tanpa perlu lampiran file.'
        }
      ]
    },
    hints: [
      'Perhatikan domain URL tautan, apakah cocok dengan situs resmi bank?',
      'Waspadai penggunaan rasa takut atau batas waktu yang sangat sempit untuk memaksa korban bertindak terburu-buru.'
    ],
    rubric: {
      maxScore: 100,
      criteria: '100 jika memilih c1, 0 jika lainnya.'
    },
    evidenceInterpretation: {
      correctMeaning: 'Murid memiliki kepekaan dasar terhadap domain URL dan prinsip rekayasa sosial.',
      commonMisconception: 'Sebagian murid mengira semua email berpenampilan formal adalah pesan resmi.',
      pedagogicalImplication: 'Dapat langsung masuk materi keamanan jaringan tingkat lanjut tanpa perlu pengulangan konsep dasar phishing.'
    }
  },
  {
    id: 'm2-logic-quest',
    title: 'Logic Quest',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Berpikir Komputasional & Algoritma',
    indicator: 'Mengurutkan tahapan algoritma pemrosesan transaksi otomatis',
    domain: 'general_informatics',
    type: 'ordering',
    difficulty: 'Menengah',
    targetDurationMinutes: 12,
    briefing: {
      story: 'Sistem aplikasi toko online sekolah harus memproses pesanan barang secara otomatis dan konsisten.',
      scenario: 'Jika tahapan terbalik, pembeli bisa mendapatkan barang tanpa membayar atau stok berkurang padahal pembayaran gagal.',
      objective: 'Urutkan 4 langkah pemrosesan pesanan berikut menjadi alur algoritma yang logis dan aman.'
    },
    challenge: {
      question: 'Susun langkah-langkah pemrosesan transaksi berikut ke dalam urutan yang benar dari awal hingga akhir!',
      instructions: 'Urutkan langkah dari 1 (awal) hingga 4 (selesai).',
      orderingItems: [
        { id: 'step-stock', text: 'Cek ketersediaan stok barang di database gudang', correctIndex: 0 },
        { id: 'step-invoice', text: 'Buat tagihan (invoice) dan kode unik pembayaran', correctIndex: 1 },
        { id: 'step-verify', text: 'Verifikasi konfirmasi transfer pembayaran dari payment gateway', correctIndex: 2 },
        { id: 'step-ship', text: 'Kurangi stok dan terbitkan nomor resi pengiriman barang', correctIndex: 3 }
      ]
    },
    hints: [
      'Sebelum menagih uang, kita harus memastikan barangnya memang ada di gudang.',
      'Pengurangan stok permanen dan pengiriman baru boleh dilakukan setelah pembayaran benar-benar terverifikasi.'
    ],
    rubric: {
      maxScore: 100,
      criteria: '100 jika urutan tepat [0,1,2,3]. Skor 50 jika urutan logis sebagian.'
    },
    evidenceInterpretation: {
      correctMeaning: 'Murid memahami prasyarat urutan (sekuensial) dalam perancangan algoritma pemrosesan data.',
      commonMisconception: 'Mengurangi stok sebelum pembayaran terverifikasi atau membuat invoice sebelum cek stok.',
      pedagogicalImplication: 'Kesiapan baik untuk materi flowchart dan struktur kontrol percabangan/perulangan.'
    }
  },
  {
    id: 'm3-data-explorer',
    title: 'Data Explorer',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Analisis Data',
    indicator: 'Membaca dan menarik kesimpulan dari visualisasi tabel data transaksi',
    domain: 'digital_business',
    type: 'multiple_choice',
    difficulty: 'Mudah',
    targetDurationMinutes: 10,
    briefing: {
      story: 'Koperasi SMK mencatat penjualan produk makanan dan perlengkapan sekolah selama 4 pekan.',
      scenario: 'Guru kewirausahaan meminta rekomendasi pengadaan stok untuk pekan depan berdasarkan data penjualan.',
      objective: 'Temukan pola tren produk yang mengalami kenaikan permintaan tertinggi.'
    },
    stimulus: {
      dataTable: {
        headers: ['Kategori Produk', 'Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4'],
        rows: [
          ['Snack Keripik Singkong', 120, 115, 122, 118],
          ['Buku Catatan SMK', 45, 60, 95, 140],
          ['Pulpen Gel Hitam', 80, 85, 82, 84],
          ['Flashdisk 32GB', 15, 14, 16, 12]
        ]
      }
    },
    challenge: {
      question: 'Berdasarkan tabel tren di atas, produk manakah yang menunjukkan pertumbuhan permintaan paling konsisten dan memerlukan penambahan stok paling signifikan untuk pekan ke-5?',
      instructions: 'Pilih satu kesimpulan yang paling didukung bukti angka pada tabel.',
      choices: [
        {
          id: 'c1',
          text: 'Buku Catatan SMK, karena mengalami kenaikan lebih dari 200% dari Pekan 1 (45) hingga Pekan 4 (140).',
          isCorrect: true,
          feedback: 'Tepat! Kenaikan dari 45 -> 60 -> 95 -> 140 menunjukkan tren pertumbuhan eksponensial yang jelas.'
        },
        {
          id: 'c2',
          text: 'Snack Keripik Singkong, karena angka penjualannya selalu berada di atas 100 setiap pekan.',
          isCorrect: false,
          feedback: 'Meskipun volumenya tinggi, tren Keripik Singkong stagnan (stabil), bukan bertumbuh secara signifikan.'
        },
        {
          id: 'c3',
          text: 'Flashdisk 32GB, karena penjualannya paling sedikit sehingga harus ditambah stoknya.',
          isCorrect: false,
          feedback: 'Penjualan sedikit justru menunjukkan perputaran stok lambat, bukan kebutuhan penambahan stok darurat.'
        },
        {
          id: 'c4',
          text: 'Pulpen Gel Hitam, karena variasinya paling acak.',
          isCorrect: false,
          feedback: 'Data pulpen gel sangat stabil di kisaran 80-85 unit.'
        }
      ]
    },
    hints: [
      'Bedakan antara total volume tertinggi vs persentase laju pertumbuhan (kenaikan dari waktu ke waktu).'
    ],
    rubric: {
      maxScore: 100,
      criteria: '100 jika c1, 0 jika lainnya.'
    },
    evidenceInterpretation: {
      correctMeaning: 'Murid mampu membedakan data volume absolut dengan tren pertumbuhan laju (slope).',
      commonMisconception: 'Terkecoh dengan memilih nilai angka terbesar tanpa melihat tren perubahan waktu.',
      pedagogicalImplication: 'Siap untuk pembelajaran spreadsheet dan visualisasi grafik bisnis digital.'
    }
  },
  {
    id: 'm4-problem-solver',
    title: 'Problem Solver',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Dekomposisi & Troubleshooting',
    indicator: 'Mendekomposisi masalah sistem ke dalam hipotesis akar penyebab yang teruji',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Menengah',
    targetDurationMinutes: 12,
    briefing: {
      story: 'Komputer kasir kantin SMK mendadak tidak bisa mencetak struk transaksi pelanggan.',
      scenario: 'Lampu printer menyala hijau normal, komputer menyala, namun tombol cetak tidak merespons.',
      objective: 'Tentukan langkah investigasi pertama yang paling sistematis dan hemat waktu.'
    },
    challenge: {
      question: 'Manakah tindakan awal pemecahan masalah (troubleshooting) yang paling tepat secara teknis?',
      instructions: 'Pilih langkah pertama yang paling efisien sebelum melakukan tindakan perbaikan berat.',
      choices: [
        {
          id: 'c1',
          text: 'Periksa kabel USB penghubung antara printer dan komputer serta antrean cetak (print queue) di sistem operasi.',
          isCorrect: true,
          feedback: 'Benar! Memeriksa sambungan fisik dan antrean perangkat lunak adalah langkah dekomposisi awal yang logis.'
        },
        {
          id: 'c2',
          text: 'Langsung menginstal ulang sistem operasi Windows pada komputer kasir.',
          isCorrect: false,
          feedback: 'Instal ulang OS terlalu berlebihan untuk masalah printer lokal dan membuang banyak waktu operasional.'
        },
        {
          id: 'c3',
          text: 'Membongkar printer thermal untuk memeriksa dinamo motor.',
          isCorrect: false,
          feedback: 'Lampu hijau sudah menyala normal, membongkar mekanis tanpa cek koneksi software berisiko merusak garansi.'
        },
        {
          id: 'c4',
          text: 'Mengganti kabel listrik PLN di gedung kantin.',
          isCorrect: false,
          feedback: 'Kedua perangkat menyala normal, sehingga sumber daya listrik bukan akar masalah.'
        }
      ]
    },
    hints: [
      'Gunakan metode eliminasi dari komponen paling sederhana (koneksi & software queue) sebelum hardware berat.'
    ],
    rubric: {
      maxScore: 100,
      criteria: '100 jika c1, 0 jika lainnya.'
    },
    evidenceInterpretation: {
      correctMeaning: 'Murid menerapkan prinsip troubleshooting bertahap (layer-by-layer) dari yang paling sederhana.',
      pedagogicalImplication: 'Memiliki intuisi pemecahan masalah hardware/software yang baik untuk SMK.'
    }
  },
  {
    id: 'm5-cyber-safety',
    title: 'Cyber Safety',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Keamanan Data & Akun',
    indicator: 'Mengevaluasi kekuatan kata sandi dan autentikasi multi-faktor (2FA)',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Mudah',
    targetDurationMinutes: 8,
    briefing: {
      story: 'Seorang administrator lab komputer ingin membuat kebijakan kata sandi bagi seluruh akun murid.',
      scenario: 'Banyak akun sebelumnya mudah diretas karena menggunakan tanggal lahir atau nama hewan peliharaan.',
      objective: 'Tentukan kombinasi keamanan kata sandi yang paling tahan terhadap serangan brute-force dan kamus kata.'
    },
    challenge: {
      question: 'Dari opsi berikut, manakah strategi perlindungan akun yang paling kokoh dan sesuai standar keamanan modern?',
      instructions: 'Pilih kombinasi terbaik.',
      choices: [
        {
          id: 'c1',
          text: 'Menggunakan passphrase acak minimal 14 karakter (kombinasi huruf besar/kecil, angka, simbol) ditambah mengaktifkan Autentikasi Dua Faktor (2FA/OTP).',
          isCorrect: true,
          feedback: 'Sangat tepat! Panjang karakter (passphrase) dan lapisan 2FA membuat peretasan brute-force menjadi sangat sulit.'
        },
        {
          id: 'c2',
          text: 'Menggunakan kata sandi 6 huruf yang sering diubah setiap 3 hari.',
          isCorrect: false,
          feedback: 'Kata sandi 6 huruf bisa dibobol software brute force dalam hitungan detik terlepas dari seberapa sering diganti.'
        },
        {
          id: 'c3',
          text: 'Menyimpan satu kata sandi yang sama persis untuk email sekolah, media sosial, dan mobile banking.',
          isCorrect: false,
          feedback: 'Penggunaan kata sandi berulang (credential reuse) sangat berbahaya jika salah satu platform bocor.'
        },
        {
          id: 'c4',
          text: 'Menuliskan kata sandi di selembar kertas memo yang ditempel di layar monitor komputer lab.',
          isCorrect: false,
          feedback: 'Menempelkan password secara fisik membuka risiko bahaya keamanan langsung bagi siapa pun yang lewat.'
        }
      ]
    },
    hints: ['Panjang karakter lebih penting daripada kerumitan acak yang sulit diingat.'],
    rubric: { maxScore: 100, criteria: '100 jika c1, 0 jika lainnya.' },
    evidenceInterpretation: {
      correctMeaning: 'Murid menyadari faktor kunci ketahanan kredensial digital.',
      pedagogicalImplication: 'Siap untuk materi keamanan data di kelas X.'
    }
  },
  {
    id: 'm6-find-the-pattern',
    title: 'Find the Pattern',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Pengenalan Pola & Logika Deret',
    indicator: 'Mengidentifikasi aturan perubahan nilai dalam deret data komputasi',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Menengah',
    targetDurationMinutes: 10,
    briefing: {
      story: 'Sistem alokasi memori komputer mengalokasikan ruang blok dalam urutan kapasitas tertentu.',
      scenario: 'Terdapat urutan alokasi kapasitas buffer: 4 MB, 8 MB, 16 MB, 32 MB, ..., 128 MB.',
      objective: 'Tentukan nilai kapasitas yang hilang di antara 32 MB dan 128 MB.'
    },
    challenge: {
      question: 'Berapakah nilai kapasitas yang mengisi titik-titik pada deret alokasi: 4, 8, 16, 32, [ ? ], 128?',
      instructions: 'Pilih jawaban yang mengikuti pola pengali sistem biner.',
      choices: [
        { id: 'c1', text: '64 MB (karena setiap suku merupakan kelipatan 2 kali suku sebelumnya / perpangkatan 2)', isCorrect: true, feedback: 'Tepat! Pola deret biner: 2^2, 2^3, 2^4, 2^5, 2^6 (64), 2^7.' },
        { id: 'c2', text: '48 MB (karena selisih 16)', isCorrect: false, feedback: 'Perhatikan bahwa pertambahan tidak konstan; ini deret geometri, bukan aritmatika.' },
        { id: 'c3', text: '50 MB', isCorrect: false, feedback: 'Bukan kelipatan 2 dalam sistem biner komputer.' },
        { id: 'c4', text: '96 MB', isCorrect: false, feedback: 'Nilai terlalu besar untuk pola kelipatan dua.' }
      ]
    },
    hints: ['Coba bagi suku kedua (8) dengan suku pertama (4), lalu suku ketiga (16) dengan suku kedua (8).'],
    rubric: { maxScore: 100, criteria: '100 jika c1, 0 jika lainnya.' },
    evidenceInterpretation: {
      correctMeaning: 'Murid mengenali pola bilangan perpangkatan 2 yang mendasari arsitektur komputer.',
      pedagogicalImplication: 'Dapat memahami konsep representasi biner, ukuran RAM, dan kompleksitas O(log n).'
    }
  },
  {
    id: 'm7-choose-your-world',
    title: 'Choose Your World',
    dimension: 'interests_context',
    dimensionLabel: 'Minat & Konteks: Eksplorasi Minat Murid',
    indicator: 'Memetakan preferensi konteks aplikasi dan industri yang memotivasi belajar murid',
    domain: 'cross_cutting',
    type: 'interest_select',
    difficulty: 'Mudah',
    targetDurationMinutes: 8,
    briefing: {
      story: 'Informatika diterapkan di hampir seluruh bidang kehidupan modern.',
      scenario: 'Proyek akhir kelas akan disesuaikan dengan topik yang paling menarik bagimu.',
      objective: 'Pilih 1 atau 2 bidang yang paling ingin kamu pelajari dan buat solusinya.'
    },
    challenge: {
      question: 'Bidang penerapan teknologi manakah yang paling membuatmu bersemangat untuk membuat karya nyata?',
      instructions: 'Pilih topik yang paling sesuai minat pribadimu (tidak ada jawaban benar atau salah).',
      choices: [
        { id: 'int-game', text: 'Game & Aplikasi Mobile Interaktif (pengembangan logika permainan, animasi, dan antarmuka pengguna)', associatedTrait: 'Game & Mobile Dev' },
        { id: 'int-biz', text: 'Bisnis Digital & Toko Online (otomasi pesanan, promosi digital, dan analitik penjualan e-commerce)', associatedTrait: 'E-Commerce & Digital Business' },
        { id: 'int-ai', text: 'Kecerdasan Buatan & Analisis Data (prediksi tren, pengenalan gambar, dan otomasi cerdas)', associatedTrait: 'AI & Data Science' },
        { id: 'int-cyber', text: 'Jaringan, Cloud & Keamanan Siber (keamanan server, WiFi sekolah, dan perlindungan privasi)', associatedTrait: 'Networking & Cybersecurity' },
        { id: 'int-social', text: 'Teknologi Sosial & Lingkungan (aplikasi bank sampah, edukasi warga, atau layanan komunitas lokal)', associatedTrait: 'Social Tech & Community' }
      ]
    },
    hints: ['Pilihlah berdasarkan rasa ingin tahumu, bukan apa yang dipilih temanmu.'],
    rubric: { maxScore: 100, criteria: '100 jika memilih salah satu opsi minat.' },
    evidenceInterpretation: {
      correctMeaning: 'Pilihan minat memberikan guru konteks untuk studi kasus dan penugasan proyek berdiferensiasi.',
      pedagogicalImplication: 'Bukan pengukur kecerdasan, melainkan panduan relevansi konteks pembelajaran.'
    }
  },
  {
    id: 'm8-build-your-plan',
    title: 'Build Your Plan',
    dimension: 'support_needs',
    dimensionLabel: 'Kebutuhan Dukungan: Perencanaan & Kemandirian',
    indicator: 'Menilai tingkat kebutuhan panduan dalam merancang proyek belajar',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Mudah',
    targetDurationMinutes: 8,
    briefing: {
      story: 'Saat menghadapi tugas pembuatan program atau proyek digital baru yang belum pernah diajarkan sebelumnya.',
      scenario: 'Setiap orang memiliki cara terbaik untuk memulai agar tidak bingung atau merasa buntu.',
      objective: 'Tunjukkan bentuk bantuan apa yang paling membuatmu merasa nyaman dan terbantu saat belajar.'
    },
    challenge: {
      question: 'Ketika kamu diberikan tugas teknologi yang cukup rumit, pendekatan mana yang paling membantumu?',
      instructions: 'Pilih satu bentuk dukungan yang paling efektif untukmu.',
      choices: [
        { id: 'sup-step', text: 'Lembar panduan langkah-demi-langkah (step-by-step checklist) dengan contoh visual yang jelas.', associatedTrait: 'Checklist Terstruktur' },
        { id: 'sup-demo', text: 'Demonstrasi langsung oleh guru atau video singkat sebelum saya mencoba sendiri.', associatedTrait: 'Demonstrasi Visual' },
        { id: 'sup-peer', text: 'Diskusi bersama teman kelompok atau rekan belajar untuk bertukar ide.', associatedTrait: 'Kolaborasi Teman Sebaya' },
        { id: 'sup-indep', text: 'Diberikan instruksi ringkas/tujuan akhir, lalu saya bebas bereksplorasi mencari cara penyelesaian sendiri.', associatedTrait: 'Eksplorasi Mandiri' }
      ]
    },
    hints: ['Jujur pada kebiasaan belajarmu akan membantu guru memberikan materi yang pas.'],
    rubric: { maxScore: 100, criteria: '100 jika memilih respons valid.' },
    evidenceInterpretation: {
      correctMeaning: 'Memberikan informasi scaffolding yang dibutuhkan murid pada penugasan awal.',
      pedagogicalImplication: 'Guru dapat menyiapkan bahan ajar berjenjang (scaffolded worksheet).'
    }
  },
  {
    id: 'm9-hint-explorer',
    title: 'Hint Explorer',
    dimension: 'support_needs',
    dimensionLabel: 'Kebutuhan Dukungan: Efektivitas Petunjuk & Bantuan',
    indicator: 'Mengukur dampak petunjuk bertingkat terhadap keberhasilan penyelesaian tantangan',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Menengah',
    targetDurationMinutes: 10,
    briefing: {
      story: 'Sebuah fungsi konversi suhu di komputer kasir salah menghitung dari Celsius ke Fahrenheit.',
      scenario: 'Rumus yang tertulis di kode program: `F = (C * 9 / 5) + 32`. Namun seorang programmer pemula menulisnya: `F = C * 9 / 5 - 32`.',
      objective: 'Perbaiki kesalahan rumus tersebut.'
    },
    stimulus: {
      codeSnippet: `// Kode bermasalah:
function hitungFahrenheit(celsius) {
  return (celsius * 9 / 5) - 32; // <--- Apakah ini sudah benar?
}`
    },
    challenge: {
      question: 'Bagaimana perbaikan yang benar pada rumus konversi suhu tersebut?',
      instructions: 'Gunakan petunjuk jika ragu.',
      choices: [
        { id: 'c1', text: 'Ganti tanda minus (-) menjadi plus (+), menjadi: (celsius * 9 / 5) + 32', isCorrect: true, feedback: 'Tepat sekali! Titik beku air pada Fahrenheit adalah +32 derajat, bukan -32.' },
        { id: 'c2', text: 'Ganti pembagi 5 menjadi 9, menjadi: (celsius * 5 / 9) - 32', isCorrect: false, feedback: 'Pecahan 9/5 sudah tepat untuk konversi C ke F.' },
        { id: 'c3', text: 'Hapus tanda kurung', isCorrect: false, feedback: 'Tanda kurung membantu keterbacaan kode.' },
        { id: 'c4', text: 'Ubah angka 32 menjadi 100', isCorrect: false, feedback: '100 adalah titik didih skala Celsius.' }
      ]
    },
    hints: [
      'Ingat titik beku air: 0 derajat Celsius setara dengan 32 derajat Fahrenheit (positif).',
      'Jika input C = 0, rumusnya harus menghasilkan nilai 32.'
    ],
    rubric: { maxScore: 100, criteria: '100 jika c1, 0 jika lainnya.' },
    evidenceInterpretation: {
      correctMeaning: 'Mengevaluasi apakah murid mampu menyelesaikan tantangan dengan atau tanpa penggunaan petunjuk.',
      pedagogicalImplication: 'Membantu guru mengidentifikasi murid yang membutuhkan pengingat konsep rumus dasar.'
    }
  },
  {
    id: 'm10-spot-the-error',
    title: 'Spot the Error',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Debugging & Logika Kondisional',
    indicator: 'Menemukan kesalahan logika (bug) pada percabangan kondisi diskon belanja',
    domain: 'rpl',
    type: 'spot_error',
    difficulty: 'Menengah',
    targetDurationMinutes: 12,
    briefing: {
      story: 'Sebuah toko online memiliki aturan: "Diskon 10% diberikan HANYA jika total belanja LEBIH DARI ATAU SAMA DENGAN 100.000 DAN pembeli adalah member terdaftar."',
      scenario: 'Namun saat diuji coba, seorang pembeli bukan member yang belanja 150.000 ternyata tetap mendapatkan diskon.',
      objective: 'Temukan baris logika kode yang menyebabkan kesalahan (bug) tersebut.'
    },
    stimulus: {
      codeSnippet: `1: let totalBelanja = 150000;
2: let isMember = false;
3: let diskon = 0;
4: if (totalBelanja >= 100000 || isMember == true) {
5:   diskon = totalBelanja * 0.10;
6: }`
    },
    challenge: {
      question: 'Pada baris ke berapa letak kesalahan logika kode di atas, dan apa yang harus diganti?',
      instructions: 'Pilih perbaikan baris yang paling tepat.',
      choices: [
        {
          id: 'c1',
          text: 'Baris 4: Operator logika || (ATAU) seharusnya menggunakan && (DAN) agar kedua syarat wajib terpenuhi bersamaan.',
          isCorrect: true,
          feedback: 'Sangat tepat! Aturan menyatakan kedua syarat harus dipenuhi, sehingga wajib menggunakan operator konjungsi logika AND (&&).'
        },
        {
          id: 'c2',
          text: 'Baris 5: Nilai 0.10 seharusnya diganti menjadi 10.',
          isCorrect: false,
          feedback: '0.10 setara dengan 10% (10/100). Jika dikalikan 10, diskonnya menjadi 10 kali lipat harga barang!'
        },
        {
          id: 'c3',
          text: 'Baris 1: Nilai totalBelanja tidak boleh 150000.',
          isCorrect: false,
          feedback: 'Nilai variabel adalah input dinamis, bukan letak bug logika.'
        },
        {
          id: 'c4',
          text: 'Baris 2: Variabel isMember tidak boleh bertipe boolean.',
          isCorrect: false,
          feedback: 'Tipe data boolean (true/false) adalah tipe paling ideal untuk status member.'
        }
      ]
    },
    hints: [
      'Kata kuncinya: "DAN pembeli adalah member".',
      'Operator || artinya cukup salah satu benar, sedangkan && mewajibkan keduanya benar.'
    ],
    rubric: { maxScore: 100, criteria: '100 jika c1, 0 jika lainnya.' },
    evidenceInterpretation: {
      correctMeaning: 'Murid menguasai pembedaan fundamental antara operator boolean AND (&&) dan OR (||).',
      commonMisconception: 'Sering tertukar antara konsep OR dalam bahasa sehari-hari dengan logika komputasi boolean.',
      pedagogicalImplication: 'Siap untuk materi struktur kendali percabangan bersarang (nested if).'
    }
  },
  {
    id: 'm11-compare-solutions',
    title: 'Compare Solutions',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Efisiensi & Analisis Solusi',
    indicator: 'Membandingkan efisiensi dan kesederhanaan dua pendekatan algoritma',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Menengah',
    targetDurationMinutes: 10,
    briefing: {
      story: 'Dua siswa RPL merancang cara untuk mencari apakah nama seorang murid ada dalam daftar 10.000 murid yang sudah terurut rapi dari A sampai Z.',
      scenario: 'Siswa A mengecek satu per satu dari murid nomor 1 sampai 10.000. Siswa B membuka langsung halaman tengah, lalu membagi dua sisa pencarian (Binary Search).',
      objective: 'Tentukan pendekatan yang paling efisien ketika data sangat besar.'
    },
    challenge: {
      question: 'Pendekatan manakah yang jauh lebih cepat dan hemat daya komputasi saat mencari di dalam data yang sudah terurut?',
      instructions: 'Pilih perbandingan yang tepat.',
      choices: [
        {
          id: 'c1',
          text: 'Metode Siswa B (Bagi dua / Binary Search), karena hanya membutuhkan maksimal belasan langkah perbandingan dibanding hingga 10.000 langkah.',
          isCorrect: true,
          feedback: 'Benar! Log2(10.000) adalah sekitar 14 kali langkah perbandingan. Efisiensinya luar biasa dibanding linear search.'
        },
        {
          id: 'c2',
          text: 'Metode Siswa A (Cek satu per satu), karena selalu memeriksa setiap data secara teliti tanpa melompati baris.',
          isCorrect: false,
          feedback: 'Linear search sangat lambat untuk data jutaan record, padahal data sudah terurut rapi.'
        },
        {
          id: 'c3',
          text: 'Kedua metode memiliki kecepatan yang sama persis.',
          isCorrect: false,
          feedback: 'Kompleksitas O(log n) jauh lebih cepat daripada O(n).'
        },
        {
          id: 'c4',
          text: 'Tidak ada metode yang berhasil jika datanya lebih dari 100 orang.',
          isCorrect: false,
          feedback: 'Komputer modern mampu memproses jutaan data dalam sekejap dengan algoritma yang tepat.'
        }
      ]
    },
    hints: ['Pikirkan saat kamu mencari kata di dalam kamus cetak tebal: apakah kamu membacanya dari halaman pertama satu per satu?'],
    rubric: { maxScore: 100, criteria: '100 jika c1, 0 jika lainnya.' },
    evidenceInterpretation: {
      correctMeaning: 'Murid memiliki intuisi komputasional tentang efisiensi pencarian pada data terstruktur.',
      pedagogicalImplication: 'Siap untuk pembelajaran algoritma sorting dan searching.'
    }
  },
  {
    id: 'm12-my-learning-quest',
    title: 'My Learning Quest',
    dimension: 'activity_preferences',
    dimensionLabel: 'Preferensi Aktivitas: Gaya Eksplorasi Belajar',
    indicator: 'Mengidentifikasi jenis aktivitas belajar yang paling meningkatkan pemahaman murid',
    domain: 'cross_cutting',
    type: 'preference_rating',
    difficulty: 'Mudah',
    targetDurationMinutes: 8,
    briefing: {
      story: 'Dalam mempelajari materi baru di kelas komputer atau laboratorium.',
      scenario: 'Format penyampaian materi yang berbeda memberikan kenyamanan belajar yang berbeda untuk setiap murid.',
      objective: 'Pilihlah gaya belajar yang paling membantu kamu cepat paham.'
    },
    challenge: {
      question: 'Bentuk aktivitas belajar seperti apa yang paling membuatmu bersemangat dan cepat mengerti materi baru?',
      instructions: 'Pilih opsi yang paling menggambarkan preferensimu.',
      choices: [
        { id: 'pref-hands-on', text: 'Praktik langsung (hands-on) di depan komputer sambil membongkar atau mencoba kode dan aplikasi.', associatedTrait: 'Praktik Langsung' },
        { id: 'pref-visual', text: 'Melihat diagram alur (flowchart), infografis, dan animasi visual proses sistem.', associatedTrait: 'Visual & Diagram' },
        { id: 'pref-analog', text: 'Mendengarkan analogi atau studi kasus kehidupan nyata yang diceritakan guru.', associatedTrait: 'Studi Kasus Konseptual' },
        { id: 'pref-collab', text: 'Bekerja bersama tim dalam menyelesaikan tantangan proyek kelompok.', associatedTrait: 'Kolaboratif' }
      ]
    },
    hints: ['Tidak ada jawaban salah; guru akan menggunakan data ini untuk meragamkan aktivitas kelas.'],
    rubric: { maxScore: 100, criteria: '100 jika memilih respons valid.' },
    evidenceInterpretation: {
      correctMeaning: 'Membantu guru merancang Universal Design for Learning (UDL) dengan menyediakan multi-modalitas.',
      pedagogicalImplication: 'Menghindari metode ceramah satu arah yang monoton di lab komputer.'
    }
  },
  {
    id: 'm13-digital-workflow',
    title: 'Digital Workflow',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Alat & Alur Kerja Digital',
    indicator: 'Mencocokkan alat digital produktif dengan kebutuhan operasional pekerjaan SMK',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Mudah',
    targetDurationMinutes: 10,
    briefing: {
      story: 'Sebuah tim siswa SMK sedang merencanakan proyek pameran teknologi akhir semester.',
      scenario: 'Mereka membutuhkan alat untuk melacak status tugas anggota (Belum, Sedang, Selesai) secara online dan real-time.',
      objective: 'Tentukan jenis aplikasi yang paling sesuai untuk kebutuhan manajemen tugas tersebut.'
    },
    challenge: {
      question: 'Jenis alat digital manakah yang dirancang khusus untuk manajemen kolaborasi papan tugas (Kanban Board)?',
      instructions: 'Pilih kategori aplikasi yang paling relevan.',
      choices: [
        { id: 'c1', text: 'Aplikasi Project Management / Kanban Board (seperti Trello, Notion, atau GitHub Projects).', isCorrect: true, feedback: 'Tepat sekali! Papan Kanban sangat efektif untuk memantau alur kerja tugas secara transparan.' },
        { id: 'c2', text: 'Aplikasi pemutar musik offline.', isCorrect: false, feedback: 'Pemutar media tidak memiliki fitur kolaborasi manajemen tugas tim.' },
        { id: 'c3', text: 'Aplikasi kalkulator ilmiah satu baris.', isCorrect: false, feedback: 'Kalkulator hanya untuk perhitungan angka sederhana.' },
        { id: 'c4', text: 'Aplikasi pengompres video.', isCorrect: false, feedback: 'Kompresor video bukan alat kolaborasi proyek.' }
      ]
    },
    hints: ['Cari alat yang memiliki kolom status To-Do, In Progress, dan Done.'],
    rubric: { maxScore: 100, criteria: '100 jika c1, 0 jika lainnya.' },
    evidenceInterpretation: {
      correctMeaning: 'Murid memahami ekosistem alat produktivitas digital kolaboratif modern.',
      pedagogicalImplication: 'Siap menggunakan tools manajemen proyek dalam pembelajaran berbasis proyek (PjBL).'
    }
  },
  {
    id: 'm14-information-check',
    title: 'Information Check',
    dimension: 'prior_knowledge',
    dimensionLabel: 'Kemampuan Awal: Evaluasi Informasi & Literasi Media',
    indicator: 'Memverifikasi kredibilitas fakta digital dan mencegah penyebaran disinformasi',
    domain: 'general_informatics',
    type: 'multiple_choice',
    difficulty: 'Mudah',
    targetDurationMinutes: 8,
    briefing: {
      story: 'Sebuah pesan berantai di grup WhatsApp mengklaim bahwa kuota internet gratis 100GB akan diberikan jika membagikan tautan pesan ke 10 grup lain.',
      scenario: 'Tautan mengarah ke situs blog gratisan tak dikenal dan meminta nomor telepon serta kode SMS verifikasi.',
      objective: 'Evaluasi kebenaran informasi tersebut.'
    },
    challenge: {
      question: 'Tindakan apa yang paling bijak dan aman untuk merespons pesan tersebut?',
      instructions: 'Pilih tindakan literasi informasi yang bertanggung jawab.',
      choices: [
        { id: 'c1', text: 'Tidak mengeklik tautan, tidak membagikan pesan, serta mengecek kebenaran informasi melalui kanal resmi kementerian atau provider terkait.', isCorrect: true, feedback: 'Tepat! Menahan diri untuk tidak menyebarkan dan memverifikasi ke sumber primer adalah langkah literasi digital yang benar.' },
        { id: 'c2', text: 'Langsung membagikan tautan ke 10 grup lain agar segera mendapatkan kuota gratis.', isCorrect: false, feedback: 'Ini membantu penyebaran hoaks dan membahayakan teman serta kerabat.' },
        { id: 'c3', text: 'Memasukkan kode SMS OTP rahasia ke situs blog tersebut.', isCorrect: false, feedback: 'Memberikan kode OTP ke situs asing berakibat akun pribadimu langsung dibajak.' },
        { id: 'c4', text: 'Membalas pesan dengan kata-kata kasar.', isCorrect: false, feedback: 'Tidak menyelesaikan akar masalah dan tidak mengedukasi.' }
      ]
    },
    hints: ['Pemberian bantuan resmi selalu diumumkan melalui situs resmi bertld .go.id atau saluran resmi provider.'],
    rubric: { maxScore: 100, criteria: '100 jika c1, 0 jika lainnya.' },
    evidenceInterpretation: {
      correctMeaning: 'Murid memiliki ketahanan kritis terhadap hoaks dan penipuan berbasis manipulasi psikologis.',
      pedagogicalImplication: 'Siap menjadi warga digital (digital citizenship) yang etis dan bertanggung jawab.'
    }
  },
  {
    id: 'm15-practical-decision',
    title: 'Practical Decision',
    dimension: 'support_needs',
    dimensionLabel: 'Kebutuhan Dukungan: Etika & Hak Cipta Digital',
    indicator: 'Memilih keputusan etis dalam penggunaan aset dan kode open-source',
    domain: 'cross_cutting',
    type: 'multiple_choice',
    difficulty: 'Mudah',
    targetDurationMinutes: 8,
    briefing: {
      story: 'Dalam membuat website tugas sekolah, seorang murid membutuhkan gambar ilustrasi dan ikon pendukung.',
      scenario: 'Murid tersebut menemukan gambar menarik di Google Images yang memiliki lisensi hak cipta berbayar (copyrighted watermark).',
      objective: 'Tentukan pilihan tindakan yang menghargai hak cipta intelektual.'
    },
    challenge: {
      question: 'Bagaimana cara mendapatkan aset grafis yang legal, aman, dan etis untuk proyek tugas sekolah?',
      instructions: 'Pilih praktik terbaik dalam etika digital.',
      choices: [
        { id: 'c1', text: 'Menggunakan platform penyedia aset berlisensi bebas royalti (Creative Commons/Unsplash/Freepik free license) serta mencantumkan atribusi pembuat jika dipersyaratkan.', isCorrect: true, feedback: 'Sangat baik! Menghormati lisensi karya orang lain adalah bagian penting profesionalisme teknologi.' },
        { id: 'c2', text: 'Menghapus tanda watermark pembuat gambar menggunakan aplikasi edit foto lalu mengakuinya sebagai karya sendiri.', isCorrect: false, feedback: 'Menghapus watermark tanpa izin adalah pelanggaran hak cipta intelektual.' },
        { id: 'c3', text: 'Mengambil karya orang lain tanpa izin karena untuk keperluan tugas sekolah tidak akan ada yang tahu.', isCorrect: false, feedback: 'Integritas akademis dan etika digital harus dibiasakan sejak di bangku sekolah.' },
        { id: 'c4', text: 'Menghindari penggunaan gambar sama sekali dan hanya memakai teks hitam putih polos.', isCorrect: false, feedback: 'Visual tetap penting, asalkan menggunakan aset yang berlisensi tepat.' }
      ]
    },
    hints: ['Cari istilah Creative Commons (CC) atau lisensi bebas royalti (royalty-free).'],
    rubric: { maxScore: 100, criteria: '100 jika c1, 0 jika lainnya.' },
    evidenceInterpretation: {
      correctMeaning: 'Murid menyadari batasan lisensi digital dan integritas karya intelektual.',
      pedagogicalImplication: 'Guru dapat memperkuat materi hak cipta dalam produk digital.'
    }
  },
  {
    id: 'm16-learning-reflection',
    title: 'Learning Reflection',
    dimension: 'support_needs',
    dimensionLabel: 'Kebutuhan Dukungan: Metakognisi & Refleksi Belajar',
    indicator: 'Mengenali hambatan belajar pribadi dan strategi penanganan yang efektif',
    domain: 'cross_cutting',
    type: 'reflection',
    difficulty: 'Mudah',
    targetDurationMinutes: 8,
    briefing: {
      story: 'Setiap perjalanan belajar informatika memiliki tantangan tersendiri.',
      scenario: 'Mengetahui apa yang paling membuatmu ragu atau kesulitan akan membantu guru mendampingimu secara lebih tepat sasaran.',
      objective: 'Pilih tantangan yang paling sering kamu hadapi saat belajar materi teknis komputer.'
    },
    challenge: {
      question: 'Ketika kamu mengalami kendala dalam mempelajari materi teknologi baru, kendala mana yang paling sering kamu rasakan?',
      instructions: 'Pilih refleksi yang paling jujur (tidak ada jawaban benar atau salah).',
      choices: [
        { id: 'ref-terms', text: 'Banyak istilah bahasa Inggris teknis atau simbol yang belum saya pahami artinya.', associatedTrait: 'Penguatan Glosarium & Istilah' },
        { id: 'ref-logic', text: 'Kesulitan membayangkan alur logika jika instruksi terlalu abstrak tanpa diagram visual.', associatedTrait: 'Kebutuhan Visualisasi Konsep' },
        { id: 'ref-time', text: 'Merasa terburu-buru dan membutuhkan waktu lebih untuk berlatih berulang kali sampai lancar.', associatedTrait: 'Kebutuhan Kecepatan Adaptif' },
        { id: 'ref-confidence', text: 'Takut membuat kesalahan atau takut mencoba hal baru karena khawatir merusak sistem komputer.', associatedTrait: 'Penguatan Keberanian Eksplorasi' }
      ]
    },
    hints: ['Guru membaca ini bukan untuk memberi nilai buruk, tetapi untuk merancang bantuan terbaik bagimu.'],
    rubric: { maxScore: 100, criteria: '100 jika memilih salah satu refleksi.' },
    evidenceInterpretation: {
      correctMeaning: 'Data metakognitif murid untuk memandu empati dan pendekatan pedagogis guru.',
      pedagogicalImplication: 'Guru dapat menyesuaikan tempo mengajar dan glosarium istilah.'
    }
  }
];
