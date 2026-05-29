// ===== TEST DATA =====

const TESTS = [
  // ---- TEST 1: PENALARAN (Reasoning) ----
  // Pool soal ada di pool-penalaran.js, diambil acak 20 setiap sesi
  {
    id: 'penalaran',
    title: 'Penalaran',
    icon: '🧠',
    desc: 'Bandingkan dua orang berdasarkan pernyataan, lalu jawab pertanyaan. Kerjakan secepat dan setepat mungkin.',
    timeLimit: 180,
    type: 'reasoning',
    generate: true,
    questions: []
  },

  // ---- TEST 2: KECEPATAN PERSEPSI ----
  {
    id: 'persepsi',
    title: 'Kecepatan Persepsi',
    icon: '👁️',
    desc: 'Hitung berapa pasangan huruf yang SAMA (huruf kapital = huruf kecil). Kerjakan secepat dan setepat mungkin.',
    timeLimit: 120,
    type: 'perception',
    generate: true,
    questions: []
  },

  // ---- TEST 3: KECEPATAN & KETEPATAN ANGKA ----
  {
    id: 'angka',
    title: 'Kecepatan & Ketepatan Angka',
    icon: '🔢',
    desc: 'Temukan angka tertinggi dan terendah. Pilih yang paling jauh dari angka yang tersisa. Kerjakan secepat dan setepat mungkin.',
    timeLimit: 120,
    type: 'number',
    generate: true,
    questions: []
  },

  // ---- TEST 4: PEMAHAMAN ARTI KATA ----
  // Pool soal ada di pool-kata.js (generated dari dict.json via build-kata.js)
  {
    id: 'kata',
    title: 'Pemahaman Arti Kata',
    icon: '📖',
    desc: 'Temukan kata yang GANJIL — tidak berkaitan dengan dua kata lainnya. Kerjakan secepat dan setepat mungkin.',
    timeLimit: 120,
    type: 'word',
    generate: true,
    questions: []
  },

  // ---- TEST 5: VISUALISASI RUANG ----
  {
    id: 'visual',
    title: 'Visualisasi Ruang',
    icon: '🔷',
    desc: 'Hitung berapa pasangan bentuk yang SAMA (setelah diputar). Bentuk cermin tidak sama. Kerjakan secepat dan setepat mungkin.',
    timeLimit: 180,
    type: 'spatial',
    generate: true,
    questions: []
  }
];
