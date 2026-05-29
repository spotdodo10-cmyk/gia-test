// node build-kata.js  →  generates pool-kata.js
// Re-run whenever dict.json is updated.

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('dict.json', 'utf8'));

// ── helpers ──────────────────────────────────────────────────────────────────
function isClean(w) {
  w = w.trim();
  return w.length >= 3 && w.length <= 10 && /^[a-zA-Z]+$/.test(w);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a set of ALL words that appear in any category (can't be used as odd)
const kategoriData = data['__kategori__'] || {};
const allCategoryWords = new Set(
  Object.values(kategoriData).flat().map(w => w.trim().toLowerCase())
);

// Pool of generic "odd" nouns — must NOT overlap with any category
const ODD_NOUNS_RAW = [
  'buku','meja','kursi','lampu','pintu','jendela','pohon','batu','air',
  'api','tanah','hujan','angin','langit','laut','gunung','sungai','jalan',
  'rumah','kota','desa','pasar','sekolah','kantor','taman','pantai',
  'bola','botol','jam','kunci','cermin','radio','komputer','kamera',
  'pena','kertas','kotak','spons','tali','papan','bantal','karpet',
  'awan','bintang','bulan','matahari','pasir','lumpur','besi','kayu',
];
const ODD_NOUNS = ODD_NOUNS_RAW.filter(w => !allCategoryWords.has(w.toLowerCase()));

const usedOdds = new Set();
function pickOdd(exclude1, exclude2) {
  const avail = ODD_NOUNS.filter(n => n !== exclude1 && n !== exclude2 && !usedOdds.has(n));
  if (avail.length === 0) { usedOdds.clear(); return pickOdd(exclude1, exclude2); }
  const pick = avail[Math.floor(Math.random() * avail.length)];
  usedOdds.add(pick);
  return pick;
}

const questions = [];
const usedPairs = new Set();

// ── ANTONIM questions ─────────────────────────────────────────────────────────
const keys = Object.keys(data).filter(k => k !== '__kategori__');
keys.forEach(k => {
  const v = data[k];
  if (v.tag !== 'a') return;
  if (!isClean(k)) return;
  if (!v.antonim) return;

  v.antonim.forEach(raw => {
    const ant = raw.trim();
    if (!isClean(ant)) return;

    const pairKey = [k, ant].sort().join('|');
    if (usedPairs.has(pairKey)) return;
    usedPairs.add(pairKey);

    const odd = pickOdd(k, ant);
    questions.push({ words: [k, ant, odd], answer: odd, type: 'antonim' });
  });
});

// ── SINONIM questions ─────────────────────────────────────────────────────────
// Only include pairs where BOTH words are dictionary entries with tag 'a'
// (mutual entries = more recognizable, well-established words)
usedOdds.clear();

const dictSet = new Set(keys.filter(k => data[k].tag === 'a' && isClean(k)));

keys.forEach(k => {
  const v = data[k];
  if (v.tag !== 'a') return;
  if (!isClean(k)) return;
  if (!v.sinonim) return;

  v.sinonim.forEach(raw => {
    const syn = raw.trim();
    if (!isClean(syn)) return;
    if (syn === k) return;
    // Both must be registered adjective entries in the dictionary
    if (!dictSet.has(syn)) return;

    const pairKey = [k, syn].sort().join('|');
    if (usedPairs.has(pairKey)) return;
    usedPairs.add(pairKey);

    const odd = pickOdd(k, syn);
    questions.push({ words: [k, syn, odd], answer: odd, type: 'sinonim' });
  });
});

// ── KATEGORI questions ────────────────────────────────────────────────────────
const kategori = data['__kategori__'] || {};
usedOdds.clear();

Object.entries(kategori).forEach(([catName, members]) => {
  const clean = members.map(m => m.trim()).filter(m => m.length <= 12 && !(/[^a-zA-Z ]/.test(m)));
  if (clean.length < 2) return;

  // Generate pairs from same category
  for (let i = 0; i < clean.length - 1; i++) {
    for (let j = i + 1; j < clean.length; j++) {
      const a = clean[i], b = clean[j];
      const pairKey = [a, b].sort().join('|');
      if (usedPairs.has(pairKey)) continue;
      usedPairs.add(pairKey);

      const odd = pickOdd(a, b);
      questions.push({ words: [a, b, odd], answer: odd, type: 'kategori', cat: catName });
    }
  }
});

// ── Stats & output ────────────────────────────────────────────────────────────
const byType = { antonim: 0, sinonim: 0, kategori: 0 };
questions.forEach(q => byType[q.type]++);

console.log(`Total: ${questions.length} soal`);
console.log(`  Antonim : ${byType.antonim}`);
console.log(`  Sinonim : ${byType.sinonim}`);
console.log(`  Kategori: ${byType.kategori}`);

// Strip internal 'type'/'cat' fields — not needed in the browser pool
const clean = questions.map(({ words, answer }) => ({ words, answer }));

const output = `// Auto-generated from dict.json — do not edit manually.
// Run: node build-kata.js
const KATA_POOL = ${JSON.stringify(clean, null, 2)};
`;

fs.writeFileSync('pool-kata.js', output);
console.log('Written pool-kata.js');
