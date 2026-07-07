/* ============================================================
   Morse Code Converter — script.js
   ============================================================ */

'use strict';

/* ── Morse Data ─────────────────────────────────────────── */
const MORSE_MAP = {
  a:'.-',    b:'-...',  c:'-.-.',  d:'-..',
  e:'.',     f:'..-.',  g:'--.',   h:'....',
  i:'..',    j:'.---',  k:'-.-',   l:'.-..',
  m:'--',    n:'-.',    o:'---',   p:'.--.',
  q:'--.-',  r:'.-.',   s:'...',   t:'-',
  u:'..-',   v:'...-',  w:'.--',   x:'-..-',
  y:'-.--',  z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--',
  '4':'....-','5':'.....','6':'-....','7':'--...',
  '8':'---..','9':'----.',
  '.':'.-.-.-', ',':'--..--', '?':'..--..', "'":'.----.',
  '!':'-.-.--', '/':'-..-.', '(':'-.--.', ')':'-.--.-',
  '&':'.-...', ':':'---...', ';':'-.-.-.', '=':'-...-',
  '+':'.-.-.', '-':'-....-', '_':'..--.-', '"':'.-..-.',
  '$':'...-..-','@':'.--.-.', ' ':'   '
};

const TEXT_MAP = Object.fromEntries(
  Object.entries(MORSE_MAP).filter(([k]) => k !== ' ').map(([k, v]) => [v, k])
);

/* ── Reference Data ─────────────────────────────────────── */
const REF_DATA = {
  letters: 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => ({ char: c.toUpperCase(), morse: MORSE_MAP[c] })),
  numbers: '0123456789'.split('').map(c => ({ char: c, morse: MORSE_MAP[c] })),
  punctuation: ['.', ',', '?', "'", '!', '/', '(', ')', '&', ':', ';', '=', '+', '-', '"', '@']
    .map(c => ({ char: c, morse: MORSE_MAP[c] })),
  special: [
    { char: 'SOS', morse: '... --- ...' },
    { char: 'AR', morse: '.-.-.' },
    { char: 'SK', morse: '...-.-' },
    { char: 'KA', morse: '-.-.-' },
    { char: 'BT', morse: '-...-' },
  ]
};

/* ── DOM References ─────────────────────────────────────── */
const inputEl      = document.getElementById('converter-input');
const outputEl     = document.getElementById('converterOutput');
const charCountEl  = document.getElementById('char-count');
const convertBtn   = document.getElementById('convertBtn');
const clearBtn     = document.getElementById('clearBtn');
const swapBtn      = document.getElementById('swapBtn');
const copyBtn      = document.getElementById('copyBtn');
const downloadBtn  = document.getElementById('downloadBtn');
const playBtn      = document.getElementById('playBtn');
const toast        = document.getElementById('toast');
const themeToggle  = document.getElementById('themeToggle');
const inputLabel   = document.getElementById('input-label-text');
const inputHint    = document.getElementById('input-hint');
const refGrid      = document.getElementById('refGrid');
const refTabs      = document.querySelectorAll('.ref-tab');
const modeBtns     = document.querySelectorAll('.mode-btn');
const faqQuestions = document.querySelectorAll('.faq-question');
const yearEl       = document.getElementById('currentYear');

/* ── State ──────────────────────────────────────────────── */
let mode = 'textToMorse';
let audioCtx = null;
let isPlaying = false;
let playStop = false;

/* ── Init ───────────────────────────────────────────────── */
if (yearEl) yearEl.textContent = new Date().getFullYear();
loadTheme();
renderRef('letters');

/* ── Theme ──────────────────────────────────────────────── */
function loadTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
  if (themeToggle) themeToggle.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

/* ── Mode Toggle ────────────────────────────────────────── */
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    mode = btn.dataset.mode;
    outputEl.textContent = '';
    if (mode === 'textToMorse') {
      inputLabel.textContent = 'Enter text to convert to Morse code';
      inputHint.textContent = 'A–Z, 0–9, punctuation supported';
      inputEl.placeholder = 'Type your text here…';
    } else {
      inputLabel.textContent = 'Enter Morse code to decode to text';
      inputHint.textContent = 'Use . and - · single space between letters · triple space between words';
      inputEl.placeholder = '.... . .-.. .-.. ---';
    }
  });
});

/* ── Conversion ─────────────────────────────────────────── */
function convert() {
  const raw = inputEl.value;
  if (!raw.trim()) {
    outputEl.innerHTML = '<span class="invalid">Please enter some input.</span>';
    return;
  }
  if (mode === 'textToMorse') {
    outputEl.textContent = textToMorse(raw);
  } else {
    outputEl.innerHTML = morseToText(raw);
  }
}

function textToMorse(text) {
  return text.toLowerCase().split('').map(ch => {
    if (ch === ' ') return '   ';
    return MORSE_MAP[ch] ? MORSE_MAP[ch] + ' ' : '<?>';
  }).join('').trim();
}

function morseToText(morse) {
  const words = morse.trim().split('   ');
  return words.map(word => {
    return word.trim().split(' ').map(symbol => {
      if (!symbol) return '';
      const ch = TEXT_MAP[symbol];
      return ch ? ch.toUpperCase() : `<span class="invalid">${symbol}</span>`;
    }).join('');
  }).join(' ');
}

/* ── Event Listeners ────────────────────────────────────── */
convertBtn?.addEventListener('click', convert);

inputEl?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    convert();
  }
});

inputEl?.addEventListener('input', () => {
  const len = inputEl.value.length;
  charCountEl.textContent = `${len} char${len !== 1 ? 's' : ''}`;
});

clearBtn?.addEventListener('click', () => {
  inputEl.value = '';
  outputEl.textContent = '';
  charCountEl.textContent = '0 chars';
  inputEl.focus();
});

swapBtn?.addEventListener('click', () => {
  const outputText = outputEl.textContent.trim();
  if (!outputText) return;
  inputEl.value = outputText;
  const len = outputText.length;
  charCountEl.textContent = `${len} char${len !== 1 ? 's' : ''}`;
  // flip mode
  const targetMode = mode === 'textToMorse' ? 'morseToText' : 'textToMorse';
  modeBtns.forEach(b => {
    const match = b.dataset.mode === targetMode;
    b.classList.toggle('active', match);
    b.setAttribute('aria-selected', String(match));
  });
  mode = targetMode;
  outputEl.textContent = '';
  inputEl.focus();
});

/* ── Copy ───────────────────────────────────────────────── */
function copyOutput() {
  const text = outputEl.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => showToast('✓ Copied to clipboard')).catch(() => showToast('⚠ Copy failed'));
}

copyBtn?.addEventListener('click', copyOutput);

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ── Download ───────────────────────────────────────────── */
downloadBtn?.addEventListener('click', () => {
  const text = outputEl.textContent.trim();
  if (!text) return;
  const blob = new Blob([text], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'morse-output.txt' });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

/* ── Audio Playback ─────────────────────────────────────── */
const DOT_MS  = 80;
const DASH_MS = DOT_MS * 3;
const GAP_MS  = DOT_MS;
const LETTER_GAP_MS = DOT_MS * 3;
const WORD_GAP_MS   = DOT_MS * 7;
const FREQ = 600;

async function playMorse(morseStr) {
  if (isPlaying) { playStop = true; return; }
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') await audioCtx.resume();

  isPlaying = true;
  playStop = false;
  playBtn.classList.add('playing');
  playBtn.setAttribute('aria-label', 'Stop audio');

  let t = audioCtx.currentTime;

  function beep(duration) {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = FREQ;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.005);
    gain.gain.setValueAtTime(0.5, t + duration / 1000 - 0.005);
    gain.gain.linearRampToValueAtTime(0, t + duration / 1000);
    osc.start(t);
    osc.stop(t + duration / 1000);
    t += duration / 1000;
  }

  const tokens = morseStr.trim().split('   ');
  for (let wi = 0; wi < tokens.length; wi++) {
    if (playStop) break;
    const letters = tokens[wi].trim().split(' ');
    for (let li = 0; li < letters.length; li++) {
      if (playStop) break;
      const symbols = letters[li].split('');
      for (let si = 0; si < symbols.length; si++) {
        if (playStop) break;
        if (symbols[si] === '.') { beep(DOT_MS); } else if (symbols[si] === '-') { beep(DASH_MS); }
        if (si < symbols.length - 1) t += GAP_MS / 1000;
      }
      if (li < letters.length - 1) t += LETTER_GAP_MS / 1000;
    }
    if (wi < tokens.length - 1) t += WORD_GAP_MS / 1000;
  }

  const totalMs = (t - audioCtx.currentTime) * 1000 + 200;
  await new Promise(r => setTimeout(r, Math.max(totalMs, 100)));

  isPlaying = false;
  playBtn.classList.remove('playing');
  playBtn.setAttribute('aria-label', 'Play Morse code audio');
}

playBtn?.addEventListener('click', () => {
  const text = outputEl.textContent.trim();
  if (isPlaying) { playStop = true; return; }
  if (!text) return;
  playMorse(text);
});

/* ── Reference Table ────────────────────────────────────── */
function renderRef(category) {
  const items = REF_DATA[category] || [];
  refGrid.innerHTML = items.map(({ char, morse }) => {
    const visual = morse === '... --- ...'
      ? morse
      : (morse || '').split('').map(s => s === '.' ? '<span class="dot"></span>' : s === '-' ? '<span class="dash"></span>' : ' ').join('');
    return `
      <button class="ref-card" data-char="${char}" data-morse="${morse || ''}" type="button"
              aria-label="${char} — ${morse || ''}">
        <span class="ref-char">${char}</span>
        <span class="ref-morse">${morse || ''}</span>
        <span class="ref-dots" aria-hidden="true">${visual}</span>
      </button>`;
  }).join('');

  // click ref card → populate input
  refGrid.querySelectorAll('.ref-card').forEach(card => {
    card.addEventListener('click', () => {
      const ch = card.dataset.char;
      const mo = card.dataset.morse;
      if (mode === 'textToMorse' && ch.length === 1) {
        inputEl.value += ch;
        charCountEl.textContent = `${inputEl.value.length} chars`;
      } else if (mode === 'morseToText') {
        const cur = inputEl.value;
        inputEl.value = cur ? cur + ' ' + mo : mo;
        charCountEl.textContent = `${inputEl.value.length} chars`;
      }
      inputEl.focus();
      document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

refTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    refTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    renderRef(tab.dataset.ref);
  });
});

/* ── FAQ Accordion ──────────────────────────────────────── */
faqQuestions.forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answer   = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(!expanded));
    if (answer) answer.hidden = expanded;
  });
});

/* ── Keyboard Shortcuts ─────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey) {
    switch (e.key.toLowerCase()) {
      case 'c': e.preventDefault(); copyOutput(); break;
      case 'x': e.preventDefault(); clearBtn?.click(); break;
      case 's': e.preventDefault(); swapBtn?.click(); break;
      case 'p': e.preventDefault(); playBtn?.click(); break;
    }
  }
});