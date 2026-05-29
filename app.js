// ===== UTILS =====
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWordQuestions(count = 20) {
  return shuffle([...KATA_POOL])
    .slice(0, count)
    .map(q => ({
      words:  shuffle([...q.words].map(w => w.charAt(0).toUpperCase() + w.slice(1))),
      answer: q.answer.charAt(0).toUpperCase() + q.answer.slice(1)
    }));
}

function generateReasoningQuestions(count = 20) {
  return shuffle([...PENALARAN_POOL])
    .slice(0, count)
    .map(q => ({ ...q, choices: shuffle([...q.choices]) }));
}

function generatePerceptionQuestions(count = 20) {
  // Exclude visually ambiguous: I (mirip l), O (mirip 0), Q (mirip O)
  const LETTERS = 'ABCDEFGHJKMNPRSTUVWXYZ'.split('');
  const n = LETTERS.length;
  const questions = [];

  while (questions.length < count) {
    const answer   = randInt(0, 4);
    const pairs    = [];
    const used     = new Set();
    const topUpper = Math.random() < 0.5; // seluruh soal: atas kapital atau kecil

    // Matching pairs: same letter
    for (let i = 0; i < answer; i++) {
      let l;
      do { l = LETTERS[randInt(0, n - 1)]; } while (used.has(l));
      used.add(l);
      pairs.push(topUpper ? [l, l.toLowerCase()] : [l.toLowerCase(), l]);
    }

    // Non-matching pairs: different letters
    for (let i = 0; i < 4 - answer; i++) {
      let l1, l2;
      do { l1 = LETTERS[randInt(0, n - 1)]; } while (used.has(l1));
      used.add(l1);
      do { l2 = LETTERS[randInt(0, n - 1)]; } while (l2 === l1 || used.has(l2));
      used.add(l2);
      pairs.push(topUpper ? [l1, l2.toLowerCase()] : [l1.toLowerCase(), l2]);
    }

    questions.push({ pairs: shuffle(pairs), answer });
  }

  return questions;
}

function generateSpatialQuestions(count = 20) {
  const ROTS = [0, 90, 180, 270];
  const questions = [];

  while (questions.length < count) {
    const numPairs = randInt(2, 3);
    const answer   = randInt(0, numPairs);
    const pairs    = [];

    // Same-shape pairs (mirror: false)
    for (let i = 0; i < answer; i++) {
      pairs.push({ top: ROTS[randInt(0, 3)], bot: ROTS[randInt(0, 3)], mirror: false });
    }

    // Mirror pairs (mirror: true — can never match)
    for (let i = 0; i < numPairs - answer; i++) {
      pairs.push({ top: ROTS[randInt(0, 3)], bot: ROTS[randInt(0, 3)], mirror: true });
    }

    questions.push({ pairs: shuffle(pairs), answer });
  }

  return questions;
}

function generateNumberQuestions(count = 20) {
  const questions = [];
  const usedKeys  = new Set();
  let attempts    = 0;

  while (questions.length < count && attempts < 2000) {
    attempts++;

    const middle = randInt(5, 30);
    const dNear  = randInt(2, 7);
    // dFar hanya 1–3 lebih besar dari dNear → perlu hitung beneran, tidak obvious
    const dFar   = dNear + randInt(1, 3);

    // Randomly decide: answer is the high outlier or the low outlier
    const answerIsHigh = Math.random() < 0.5;

    let high, low, answer;
    if (answerIsHigh) {
      high   = middle + dFar;
      low    = middle - dNear;
      answer = high;
    } else {
      high   = middle + dNear;
      low    = middle - dFar;
      answer = low;
    }

    if (low < 1 || high > 60) continue;

    // Verify distances are truly unequal (sanity check)
    if ((high - middle) === (middle - low)) continue;

    const key = [high, middle, low].sort((a, b) => a - b).join(',');
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);

    questions.push({ nums: shuffle([high, middle, low]), answer });
  }

  return questions;
}

// ===== STATE =====
let currentTest      = 0;
let currentQ         = 0;
let userAnswers      = [];
let testScores       = [];
let timer            = null;
let timeLeft         = 0;
let testStarted      = false;
let testQueue        = [];
let queuePos         = 0;
let questionStartTime = 0;  // ms timestamp when current question became answerable

// ===== WELCOME: TEST SELECTOR =====
function toggleTestSelect(el) {
  el.classList.toggle('active');
  const anySelected = document.querySelectorAll('.test-overview-item.active').length > 0;
  document.getElementById('selectHint').classList.toggle('hidden', anySelected);
}

// ===== INIT =====
function startTest() {
  const selected = [...document.querySelectorAll('.test-overview-item.active')]
    .map(el => parseInt(el.dataset.idx))
    .sort((a, b) => a - b);

  if (selected.length === 0) {
    document.getElementById('selectHint').classList.remove('hidden');
    return;
  }

  testQueue = selected;
  queuePos  = 0;

  document.getElementById('screenWelcome').classList.add('hidden');
  document.getElementById('progressWrapper').classList.remove('hidden');
  buildProgressSteps();
  runTest(testQueue[0]);
}

// ===== PROGRESS =====
function buildProgressSteps() {
  const wrap = document.getElementById('progressSteps');
  wrap.innerHTML = '';
  testQueue.forEach((testIdx, pos) => {
    const t   = TESTS[testIdx];
    const div = document.createElement('div');
    div.className = 'step-dot' + (pos === 0 ? ' active' : '');
    div.id = `step_${pos}`;
    div.innerHTML = `<div class="dot">${pos + 1}</div><div class="label">${t.title.split(' ')[0]}</div>`;
    wrap.appendChild(div);
  });
  updateProgress(0);
}

function updateProgress(pos) {
  testQueue.forEach((_, i) => {
    const el = document.getElementById(`step_${i}`);
    if (!el) return;
    el.className = 'step-dot' + (i < pos ? ' completed' : i === pos ? ' active' : '');
  });
  document.getElementById('progressFill').style.width = `${(pos / testQueue.length) * 100}%`;
}

// ===== RUN TEST =====
function runTest(idx) {
  currentTest = idx;
  currentQ    = 0;
  testStarted = true;
  updateProgress(queuePos);

  const t = TESTS[idx];

  // Generate fresh random questions for applicable tests every run
  if (t.generate) {
    if (t.type === 'reasoning')  t.questions = generateReasoningQuestions(20);
    if (t.type === 'word')       t.questions = generateWordQuestions(20);
    if (t.type === 'number')     t.questions = generateNumberQuestions(20);
    if (t.type === 'perception') t.questions = generatePerceptionQuestions(20);
    if (t.type === 'spatial')    t.questions = generateSpatialQuestions(20);
  }
  const area = document.getElementById('testArea');
  area.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card';
  card.id = 'testCard';
  card.innerHTML = `
    <div class="card-title">
      ${t.icon} ${t.title}
      <span class="badge">Tes ${queuePos + 1} / ${testQueue.length}</span>
    </div>
    <div class="card-desc">${t.desc}</div>
    <div class="timer-bar">
      <span class="timer-icon">⏱️</span>
      <span class="timer-val" id="timerVal">${formatTime(t.timeLimit)}</span>
      <div class="timer-track"><div class="timer-fill" id="timerFill" style="width:100%"></div></div>
    </div>
    <div class="q-counter" id="qCounter"></div>
    <div id="questionArea"></div>
  `;
  area.appendChild(card);

  timeLeft = t.timeLimit;
  startTimer(t.timeLimit);
  renderQuestion();
}

// ===== TIMER =====
function startTimer(total) {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    const pct = (timeLeft / total) * 100;
    const valEl  = document.getElementById('timerVal');
    const fillEl = document.getElementById('timerFill');
    if (!valEl) { clearInterval(timer); return; }

    valEl.textContent = formatTime(timeLeft);
    fillEl.style.width = pct + '%';

    const cls = timeLeft < total * 0.2 ? 'danger' : timeLeft < total * 0.4 ? 'warning' : '';
    valEl.className = 'timer-val ' + cls;
    fillEl.className = 'timer-fill ' + cls;

    if (timeLeft <= 0) {
      clearInterval(timer);
      finishTest(true);
    }
  }, 1000);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

// ===== RENDER QUESTION =====
function renderQuestion() {
  const t  = TESTS[currentTest];
  const q  = t.questions[currentQ];
  const qArea = document.getElementById('questionArea');
  const ctr   = document.getElementById('qCounter');

  if (ctr) ctr.innerHTML = `Soal <span>${currentQ + 1}</span> dari <span>${t.questions.length}</span>`;

  // For reasoning, timer starts when phase 2 is revealed (see revealReasoningQuestion)
  // For all other types, start immediately
  if (t.type !== 'reasoning') questionStartTime = Date.now();

  switch (t.type) {
    case 'reasoning': renderReasoning(q, qArea); break;
    case 'perception': renderPerception(q, qArea); break;
    case 'number':    renderNumber(q, qArea); break;
    case 'word':      renderWord(q, qArea); break;
    case 'spatial':   renderSpatial(q, qArea); break;
  }
}

// ===== ANSWER HANDLER =====
function submitAnswer(userAns, correctAns) {
  const isCorrect   = String(userAns) === String(correctAns);
  const timeTaken   = questionStartTime ? Math.round((Date.now() - questionStartTime) / 100) / 10 : null;
  userAnswers.push({
    testIdx: currentTest, qIdx: currentQ,
    userAnswer: userAns, correct: isCorrect,
    timeTaken,           // seconds to answer (1 decimal)
    timeRemaining: timeLeft
  });

  // Disable all buttons silently — no feedback shown during test
  document.querySelectorAll('.choice-btn, .num-btn, .word-btn, .perc-btn, .sp-ans-btn').forEach(b => {
    b.disabled = true;
  });

  // Auto-advance after short delay, or finish if last question
  setTimeout(() => {
    if (currentQ < TESTS[currentTest].questions.length - 1) {
      nextQuestion();
    } else {
      finishTest(false);
    }
  }, 500);
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= TESTS[currentTest].questions.length) {
    finishTest(false);
  } else {
    renderQuestion();
  }
}

// ===== FINISH TEST =====
function finishTest(timeout) {
  clearInterval(timer);
  const t = TESTS[currentTest];

  const myAns = userAnswers.filter(a => a.testIdx === currentTest);
  const correct = myAns.filter(a => a.correct).length;
  testScores[currentTest] = { correct, total: t.questions.length };

  const isLast = queuePos >= testQueue.length - 1;
  if (isLast) {
    showResults();
  } else {
    showInterstitial(timeout);
  }
}

// ===== INTERSTITIAL =====
function showInterstitial(wasTimeout) {
  const donedTestIdx = testQueue[queuePos];
  const t   = TESTS[donedTestIdx];
  const sc  = testScores[donedTestIdx];
  const pct = Math.round((sc.correct / sc.total) * 100);

  queuePos++;
  const nextTestIdx = testQueue[queuePos];
  const nextT = TESTS[nextTestIdx];

  updateProgress(queuePos);

  const area = document.getElementById('testArea');
  area.innerHTML = `
    <div class="card" style="text-align:center">
      <div style="font-size:3rem">${wasTimeout ? '⏰' : '✅'}</div>
      <h3 style="font-size:1.4rem;font-weight:800;color:var(--blue);margin:14px 0 8px">
        ${wasTimeout ? 'Waktu Habis' : 'Tes Selesai'}: ${t.title}
      </h3>
      <p style="color:var(--text-muted);margin-bottom:20px">
        Anda menjawab <strong>${sc.correct}</strong> benar dari <strong>${sc.total}</strong> soal
        &nbsp;·&nbsp; Skor: <strong>${pct}%</strong>
      </p>
      <button class="btn btn-primary" onclick="runTest(${nextTestIdx})">
        Lanjut ke: ${nextT.title} ›
      </button>
    </div>
  `;
}

// ===== RESULTS =====
function showResults() {
  clearInterval(timer);
  document.getElementById('testArea').innerHTML = '';
  document.getElementById('progressWrapper').classList.add('hidden');
  const screen = document.getElementById('screenResults');
  screen.classList.remove('hidden');

  const totalCorrect = userAnswers.filter(a => a.correct).length;
  const totalQ       = userAnswers.length;
  const pct          = Math.round((totalCorrect / totalQ) * 100);

  // Score circle
  document.getElementById('scorePct').textContent = pct + '%';
  document.getElementById('scoreCircle').style.background =
    `conic-gradient(var(--green) ${pct * 3.6}deg, var(--gray) 0deg)`;

  const tesDone = testQueue.length;
  document.getElementById('resultsSubtitle').textContent =
    tesDone === 1
      ? `${TESTS[testQueue[0]].title} · ${totalCorrect} benar dari ${totalQ} soal`
      : `${tesDone} tes · ${totalCorrect} benar dari ${totalQ} soal`;

  // Per-test cards — only for tests that were taken
  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';
  testQueue.forEach((testIdx, pos) => {
    const t   = TESTS[testIdx];
    const sc  = testScores[testIdx] || { correct: 0, total: t.questions.length };
    const p   = Math.round((sc.correct / sc.total) * 100);
    const cls = p >= 75 ? 'good' : p >= 50 ? 'ok' : 'poor';
    grid.innerHTML += `
      <div class="result-card ${cls}">
        <div class="rc-title">${t.icon} ${t.title}</div>
        <div class="rc-score">${sc.correct}/${sc.total}</div>
        <div class="rc-meta">${p}% benar</div>
      </div>
    `;
  });

  // Build review list
  buildReviewList();
}

function buildReviewList() {
  const list = document.getElementById('reviewList');
  list.innerHTML = '';

  testQueue.forEach((testIdx, pos) => {
    const t  = TESTS[testIdx];
    const ti = testIdx;

    const header = document.createElement('div');
    header.style.cssText = 'font-weight:800;font-size:1rem;color:var(--blue);margin:14px 0 6px;padding:8px 0 4px;border-bottom:2px solid var(--gray)';
    header.textContent = `${t.icon} Tes ${pos + 1}: ${t.title}`;
    list.appendChild(header);

    t.questions.forEach((q, qi) => {
      const ans = userAnswers.find(a => a.testIdx === ti && a.qIdx === qi);
      if (!ans) return;
      const item = document.createElement('div');
      item.className = 'review-item ' + (ans.correct ? 'correct' : 'wrong');

      let qText = '';
      let userText = '';
      let correctText = '';

      switch (t.type) {
        case 'reasoning':
          qText = `${q.statement} → ${q.question}`;
          userText = ans.userAnswer;
          correctText = q.answer;
          break;
        case 'perception':
          qText = `Pasangan: ${q.pairs.map(p=>p[0]+'/'+p[1]).join(', ')}`;
          userText = `Jawaban Anda: ${ans.userAnswer}`;
          correctText = `Benar: ${q.answer}`;
          break;
        case 'number':
          qText = `Angka: ${q.nums.join(' — ')}`;
          userText = `Jawaban Anda: ${ans.userAnswer}`;
          correctText = `Benar: ${q.answer}`;
          break;
        case 'word':
          qText = `Kata: ${q.words.join(' · ')}`;
          userText = `Jawaban Anda: ${ans.userAnswer}`;
          correctText = `Benar: ${q.answer}`;
          break;
        case 'spatial':
          qText = `${q.pairs.length} pasangan bentuk`;
          userText = `Jawaban Anda: ${ans.userAnswer}`;
          correctText = `Benar: ${q.answer}`;
          break;
      }

      const timeInfo = ans.timeTaken !== null
        ? `<span class="ri-time">⏱ ${ans.timeTaken}d · sisa ${formatTime(ans.timeRemaining)}</span>`
        : '';

      item.innerHTML = `
        <div class="ri-q">${qi+1}. ${qText}</div>
        <div class="ri-ans">
          <span class="ri-user ${ans.correct ? 'ok' : 'bad'}">${userText}</span>
          <span class="ri-correct">✓ ${correctText}</span>
          ${timeInfo}
        </div>
      `;
      list.appendChild(item);
    });
  });
}

function toggleReview() {
  const el = document.getElementById('reviewList');
  el.classList.toggle('hidden');
}

function restartAll() {
  currentTest = 0;
  currentQ    = 0;
  userAnswers = [];
  testScores  = [];
  testQueue   = [];
  queuePos    = 0;
  clearInterval(timer);

  // Reset card selections
  document.querySelectorAll('.test-overview-item').forEach(el => el.classList.remove('active'));
  document.getElementById('selectHint').classList.add('hidden');

  document.getElementById('screenResults').classList.add('hidden');
  document.getElementById('progressWrapper').classList.remove('hidden');
  document.getElementById('screenWelcome').classList.remove('hidden');
  document.getElementById('testArea').innerHTML = '';
  document.getElementById('progressSteps').innerHTML = '';
  document.getElementById('progressFill').style.width = '0%';
}

// ===========================
// TEST 1 — REASONING RENDERER
// ===========================
function renderReasoning(q, area) {
  // Phase 1: show statement only, wait for click
  area.innerHTML = `
    <div class="reasoning-box reasoning-phase1" id="reasoningPhase1">
      <div class="reasoning-statement">${q.statement}</div>
      <p class="reasoning-hint">Klik tombol di bawah saat sudah siap</p>
    </div>
    <div style="text-align:center;margin-top:18px">
      <button class="btn btn-primary" id="readyBtn" onclick="revealReasoningQuestion()">
        Saya Siap ›
      </button>
    </div>
    <div id="reasoningPhase2" class="hidden">
      <div class="reasoning-box reasoning-phase2-box">
        <div class="reasoning-question" id="reasoningQ">${q.question}</div>
      </div>
      <div class="reasoning-choices" id="reasoningChoices">
        ${q.choices.map(c => `
          <button class="choice-btn" onclick="answerReasoning('${c}', '${q.answer}', this)">
            ${c}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function revealReasoningQuestion() {
  const phase1 = document.getElementById('reasoningPhase1');
  const phase2 = document.getElementById('reasoningPhase2');
  const readyBtn = document.getElementById('readyBtn').parentElement;

  // Fade out phase 1
  phase1.style.transition = 'opacity 0.25s';
  phase1.style.opacity = '0';
  readyBtn.style.transition = 'opacity 0.25s';
  readyBtn.style.opacity = '0';

  setTimeout(() => {
    phase1.classList.add('hidden');
    readyBtn.classList.add('hidden');
    phase2.classList.remove('hidden');
    phase2.style.opacity = '0';
    phase2.style.transition = 'opacity 0.25s';
    requestAnimationFrame(() => { phase2.style.opacity = '1'; });
    questionStartTime = Date.now();
  }, 250);
}

function answerReasoning(chosen, correct, btn) {
  btn.classList.add('selected');
  submitAnswer(chosen, correct);
}

// =============================
// TEST 2 — PERCEPTION RENDERER
// =============================
function renderPerception(q, area) {
  const cells = q.pairs.map(p => `
    <div class="perc-cell">
      <div class="perc-top">${p[0]}</div>
      <div class="perc-bot">${p[1]}</div>
    </div>
  `).join('');

  const btns = [0,1,2,3,4].map(n => `
    <button class="perc-btn" onclick="answerPerception(${n}, ${q.answer}, this)">${n}</button>
  `).join('');

  area.innerHTML = `
    <div class="perc-grid">${cells}</div>
    <div class="perc-answers">${btns}</div>
  `;
}

function answerPerception(chosen, correct, btn) {
  btn.classList.add('selected');
  submitAnswer(chosen, correct);
}

// ============================
// TEST 3 — NUMBER RENDERER
// ============================
function renderNumber(q, area) {
  const btns = q.nums.map(n => `
    <button class="num-btn" onclick="answerNumber(${n}, ${q.answer}, this)">${n}</button>
  `).join('');

  area.innerHTML = `<div class="num-row">${btns}</div>`;
}

function answerNumber(chosen, correct, btn) {
  btn.classList.add('selected');
  submitAnswer(chosen, correct);
}

// ============================
// TEST 4 — WORD RENDERER
// ============================
function renderWord(q, area) {
  // Shuffle display order so answer isn't always in the same position
  const words = shuffle([...q.words]);

  const btns = words.map(w => `
    <button class="word-btn" onclick="answerWord('${w}', '${q.answer}', this)">${w}</button>
  `).join('');

  area.innerHTML = `<div class="word-row">${btns}</div>`;
}

function answerWord(chosen, correct, btn) {
  btn.classList.add('selected');
  submitAnswer(chosen, correct);
}

// ============================
// TEST 5 — SPATIAL RENDERER
// ============================
function renderSpatial(q, area) {
  const pairBoxes = q.pairs.map((p, i) => `
    <div class="sp-pair">
      <div class="sp-cell sp-top">${drawR(p.top, p.mirror ? 'mirror' : 'normal')}</div>
      <div class="sp-cell sp-bot">${drawR(p.bot, 'normal')}</div>
    </div>
  `).join('');

  const maxAns = q.pairs.length;
  const ansBtns = [];
  for (let v = 0; v <= maxAns; v++) {
    ansBtns.push(`<button class="sp-ans-btn" onclick="answerSpatial(${v}, ${q.answer}, this)">${v}</button>`);
  }

  area.innerHTML = `
    <div class="sp-grid">${pairBoxes}</div>
    <div class="sp-ans-row">${ansBtns.join('')}</div>
  `;
}

// Draw the R shape via CSS transforms
function drawR(rotation, variant) {
  const transforms = { 0: '', 90: 'rotate(90deg)', 180: 'rotate(180deg)', 270: 'rotate(270deg)' };
  const tr = transforms[rotation] || '';
  const mirrorScale = variant === 'mirror' ? 'scaleX(-1)' : '';
  const combined = [tr, mirrorScale].filter(Boolean).join(' ');
  const style = combined ? `transform:${combined}` : '';
  return `<span class="sp-letter" style="${style}">R</span>`;
}

function answerSpatial(chosen, correct, btn) {
  btn.classList.add('selected');
  submitAnswer(chosen, correct);
}
