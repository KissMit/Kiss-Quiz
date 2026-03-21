// Show cookie bar unless already accepted
  (function(){
    if(!localStorage.getItem('kismit_cookies_accepted')){
      document.getElementById('cookieBar').classList.remove('hidden');
    } else {
      document.getElementById('cookieBar').classList.add('hidden');
    }
    document.getElementById('cookieBtn').addEventListener('click', function(){
      localStorage.setItem('kismit_cookies_accepted','1');
      document.getElementById('cookieBar').classList.add('hidden');
    });
  })();

/* ── PARALLAX ORBS ── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const orbs = document.querySelectorAll('#heroOrbs .orb');
  const speeds = [.06, .04, .08, .05, .07];
  orbs.forEach((o, i) => { o.style.transform = `translateY(${y * speeds[i]}px)`; });
});

/* ── DISCLAIMER SCROLL TRIGGER ── */
let disclaimerShown = false;
const discAnchor = document.getElementById('disclaimerAnchor');
const modal = document.getElementById('modal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !disclaimerShown) {
      disclaimerShown = true;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  });
}, { threshold: 1.0 });
observer.observe(discAnchor);

// Also trigger on manual click
discAnchor.addEventListener('click', () => {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
});

function dismissModal() {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

/* ── SHOW/HIDE OTHER INPUT ── */
// For dark card selects (csel) — show ctxt when "Other" selected
document.querySelectorAll('.csel').forEach(sel => {
  const card = sel.closest('.qcard');
  const input = card ? card.querySelector('.ctxt') : null;
  if (!input) return;
  sel.addEventListener('change', () => {
    if (sel.value === '' && sel.options[sel.selectedIndex].text === 'Other') {
      input.classList.add('visible');
    } else if (sel.options[sel.selectedIndex].text === 'Other') {
      input.classList.add('visible');
    } else {
      input.classList.remove('visible');
      input.value = '';
    }
  });
});
// For light section selects (lsel) — show oinput when "Other" selected
document.querySelectorAll('.lsel').forEach(sel => {
  const body = sel.closest('.lq') || sel.closest('.star-body');
  const input = body ? body.querySelector('.oinput') : null;
  if (!input) return;
  sel.addEventListener('change', () => {
    if (sel.options[sel.selectedIndex].text.startsWith('Other')) {
      input.classList.add('visible');
    } else {
      input.classList.remove('visible');
      input.value = '';
    }
  });
});

/* ── SCALE BUTTONS ── */
function pickScale(btn, group) {
  document.querySelectorAll(`.scale-row[data-group="${group}"] .sbtn`).forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

/* ── DRAG & DROP BINGO — mouse + touch support ── */
let draggedId = null;

function placeCircle(cell) {
  if (!draggedId) return;
  const row = cell.dataset.row;
  document.querySelectorAll(`.bid[data-row="${row}"] .placed`).forEach(p => p.remove());
  const src = document.querySelector(`.drag-circle[data-id="${draggedId}"]`);
  if (!src) return;
  const clone = document.createElement('div');
  clone.className = 'placed';
  clone.style.background = src.style.background;
  cell.appendChild(clone);
  src.style.opacity = '0.25';
  draggedId = null;
}

// Mouse drag events
document.querySelectorAll('.drag-circle').forEach(c => {
  c.addEventListener('dragstart', e => {
    draggedId = c.dataset.id;
    c.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  c.addEventListener('dragend', () => c.classList.remove('dragging'));
});

document.querySelectorAll('.bid[data-row]').forEach(cell => {
  cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('drag-over'); });
  cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
  cell.addEventListener('drop', e => {
    e.preventDefault();
    cell.classList.remove('drag-over');
    placeCircle(cell);
  });
});

// Touch events for mobile
document.querySelectorAll('.drag-circle').forEach(c => {
  c.addEventListener('touchstart', e => {
    draggedId = c.dataset.id;
    c.classList.add('dragging');
    c.style.opacity = '0.6';
  }, { passive: true });

  c.addEventListener('touchmove', e => {
    e.preventDefault();
    const touch = e.touches[0];
    c.style.position = 'fixed';
    c.style.zIndex = '9999';
    c.style.left = (touch.clientX - c.offsetWidth / 2) + 'px';
    c.style.top = (touch.clientY - c.offsetHeight / 2) + 'px';
    c.style.pointerEvents = 'none';
  }, { passive: false });

  c.addEventListener('touchend', e => {
    c.style.pointerEvents = '';
    c.style.opacity = '';
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el ? el.closest('.bid[data-row]') : null;
    // Reset circle position
    c.style.position = 'absolute';
    c.style.zIndex = '';
    c.style.left = c.dataset.origLeft || c.style.left;
    c.style.top = c.dataset.origTop || c.style.top;
    c.classList.remove('dragging');
    if (cell) placeCircle(cell);
    else draggedId = null;
  });
});

// Store original positions for reset after touch
document.querySelectorAll('.drag-circle').forEach(c => {
  c.dataset.origLeft = c.style.left;
  c.dataset.origTop = c.style.top;
});

/* ── ARCHETYPES ── */
const ARCHETYPES = {
  archiver: {
    name: "The Harmonious Archiver",
    desc: "You collect inspiration with intention. Rare ideas matter to you and you want a place where your discoveries can live without noise, algorithms, or disruptive distractions. Seeking out spaces that feel approachable, truthful and tidy — you value balance and order in your discovery process of digital exploration.",
    priorities: ["Authentic discovery", "Clean organization", "Long term collections"],
    color: "radial-gradient(circle at 40% 40%, #6B8DD6, #2A4A9E)"
  },
  explorer: {
    name: "The Uncharted Explorer",
    desc: "You are driven by discovery and have a seeker mindset. New ideas, unexpected aesthetics, and creative rabbit holes energize you. Your inspiration often comes from wandering into places you did not expect to find. You value platforms that feel alive and expansive — full of possibility rather than repetitive feeds.",
    priorities: ["Authentic discovery", "Diverse and unexpected content", "Freedom to explore without algorithm pressure"],
    color: "radial-gradient(circle at 40% 40%, #10D5E2, #0A7A88)"
  },
  architect: {
    name: "The Modern Architect",
    desc: "You collect inspiration with purpose. Ideas you cultivate are not just interesting to you — they are tools you use to build real things into this world. Whether it is a branding project, a home renovation, a new recipe, or a creative vision — your collections help you move from inspiration to execution.",
    priorities: ["Practical inspiration you can apply to real projects", "Clear organization and structure", "Tools that help you move from idea to action"],
    color: "radial-gradient(circle at 40% 40%, #9DBA38, #5A7020)"
  },
  alchemist: {
    name: "The Sovereign Alchemist",
    desc: "You use inspiration as a mirror for personal transformation. Images, aesthetics, concepts, ideas — all help you shape your identity and emotional world. Your collections are less about projects and more about feeling, mood and becoming the person you are evolving into.",
    priorities: ["Deep aesthetic exploration", "Personal creative expression", "Spaces that feel intimate & emotionally resonant"],
    color: "radial-gradient(circle at 40% 40%, #FA67C0, #A03080)"
  }
};

/* ── SCORING ── */
function submitQuiz() {

  // ── VALIDATION: Q1–16 must all be answered ──
  const missing = [];

  // Q1-3: dark card selects
  [['q1','1'],['q2','2'],['q3','3']].forEach(([name, num]) => {
    const sel = document.querySelector(`select[name="${name}"]`);
    if (!sel || !sel.value) missing.push(`Question ${num}`);
  });

  // Q4-5: scale buttons
  ['q4','q5'].forEach((group, i) => {
    const selected = document.querySelector(`.scale-row[data-group="${group}"] .sbtn.sel`);
    if (!selected) missing.push(`Question ${i + 4}`);
  });

  // Q6-7: scored selects
  [['sq6','6'],['sq7','7']].forEach(([id, num]) => {
    const el = document.getElementById(id);
    if (!el || !el.value) missing.push(`Question ${num}`);
  });

  // Q8-10: dark card selects
  [['q8','8'],['q9','9'],['q10','10']].forEach(([name, num]) => {
    const sel = document.querySelector(`select[name="${name}"]`);
    if (!sel || !sel.value) missing.push(`Question ${num}`);
  });

  // Q11: both choices required
  const sq11a = document.getElementById('sq11a');
  const sq11b = document.getElementById('sq11b');
  if (!sq11a || !sq11a.value) missing.push('Question 11 (first choice)');
  if (!sq11b || !sq11b.value) missing.push('Question 11 (second choice)');

  // Q12-13: scored selects
  [['sq12','12'],['sq13','13']].forEach(([id, num]) => {
    const el = document.getElementById(id);
    if (!el || !el.value) missing.push(`Question ${num}`);
  });

  // Q14: at least one platform tag selected
  const tagSelected = document.querySelector('.ptag.on');
  if (!tagSelected) missing.push('Question 14');

  // Q15-16: scored selects
  [['sq15','15'],['sq16','16']].forEach(([id, num]) => {
    const el = document.getElementById(id);
    if (!el || !el.value) missing.push(`Question ${num}`);
  });

  if (missing.length > 0) {
    alert('Please answer the following before submitting:\n\n' + missing.join('\n'));
    // Scroll to first unanswered question
    const firstMissing = missing[0];
    const num = parseInt(firstMissing.match(/\d+/)[0]);
    const allSections = document.querySelectorAll('.qcard, .lq, .star-q, .bingo-section');
    window.scrollTo({ top: document.querySelector('#quizGate').offsetTop, behavior: 'smooth' });
    return;
  }

  const scores = { archiver: 0, explorer: 0, architect: 0, alchemist: 0 };
  // Scored selects
  ['sq6','sq7','sq11a','sq11b','sq12','sq13','sq15','sq16'].forEach(id => {
    const el = document.getElementById(id);
    if (!el || !el.value) return;
    const opt = el.options[el.selectedIndex];
    const pts = parseInt(opt?.dataset?.points || '1', 10);
    if (scores.hasOwnProperty(el.value)) scores[el.value] += pts;
  });

  // Tie-breaker: sq7 → sq6 → sq13
  let sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  let winner = sorted[0][0];
  if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) {
    for (const id of ['sq7','sq6','sq13']) {
      const el = document.getElementById(id);
      if (el && el.value && scores.hasOwnProperty(el.value)) { winner = el.value; break; }
    }
  }
  if (!winner || scores[winner] === 0) winner = 'explorer';

  const a = ARCHETYPES[winner];
  document.getElementById('rBadge').style.background = a.color;
  document.getElementById('rName').textContent = a.name;
  document.getElementById('rDesc').textContent = a.desc;
  document.getElementById('rList').innerHTML = a.priorities.map(p => `<li>${p}</li>`).join('');
  document.getElementById('resultPopup').classList.add('show');
  document.body.style.overflow = 'hidden';
  console.log('Scores:', scores, '| Winner:', winner);

  // ── CAPTURE: collect all quiz answers for submission ──
  const q = (name) => { const el = document.querySelector(`select[name="${name}"]`); return el ? el.value : ''; };
  const sid = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
  const scaleVal = (group) => { const btn = document.querySelector(`.scale-row[data-group="${group}"] .sbtn.sel`); return btn ? btn.textContent : ''; };
  const tags = [...document.querySelectorAll('.ptag.on')].map(t => t.textContent.trim()).join(', ');
  const bingo = [...document.querySelectorAll('.bingo-cell .drag-circle')].map(c => c.textContent.trim()).filter(Boolean).join(', ');

  window._kismitAnswers = {
    q1_frustration:       q('q1'),
    q2_pain_point:        q('q2'),
    q3_instant_leave:     q('q3'),
    q4_digital_footprint: scaleVal('q4'),
    q5_existing_collections: scaleVal('q5'),
    q6_visual_organization: sid('sq6'),
    q7_one_thing:         sid('sq7'),
    q8_no_ai_line:        q('q8'),
    q9_ai_usage:          q('q9'),
    q10_ai_comfort:       q('q10'),
    q11_psych_safe_1:     sid('sq11a'),
    q11_psych_safe_2:     sid('sq11b'),
    q12_trigger:          sid('sq12'),
    q13_statement:        sid('sq13'),
    q14_save_where:       tags,
    q15_instinct:         sid('sq15'),
    q16_creative_identity: sid('sq16'),
    q17_demographics:     bingo,
    archetype_result:     winner
  };
}

function closeResult() {
  document.getElementById('resultPopup').classList.remove('show');
  document.body.style.overflow = '';
}

function sendEmail() {
  const v = document.getElementById('earlyEmail').value;
  if (!v || !v.includes('@')) { alert('Please enter a valid email.'); return; }

  const SHEET_URL   = 'https://script.google.com/macros/s/AKfycbz2IVgL5GxGOzLCDsMr9X2gtA08ElJ77ERueQZ-Wq3NMgSL3cA9K7S_HprraTCHSf07tw/exec';
  const HS_TOKEN    = 'pat-na2-10b3f2df-8db3-4bc4-8f28-55cf7b7d26d3';
  const HS_PORTAL   = '245593467';

  const answers = window._kismitAnswers || {};
  const payload  = { timestamp: new Date().toISOString(), email: v, ...answers };

  // 1. Google Sheets — safety net, fire & forget
  fetch(SHEET_URL, {
    method: 'POST',
    body: JSON.stringify(payload)
  }).catch(err => console.warn('Sheet capture failed:', err));

  // 2. HubSpot Contacts API — create/update contact with all quiz data
  fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${HS_TOKEN}`
    },
    body: JSON.stringify({
      properties: {
        email:                    v,
        kismit_archetype:         answers.archetype_result        || '',
        kismit_q1_frustration:    answers.q1_frustration          || '',
        kismit_q2_pain_point:     answers.q2_pain_point           || '',
        kismit_q3_instant_leave:  answers.q3_instant_leave        || '',
        kismit_q4_digital_footprint: answers.q4_digital_footprint || '',
        kismit_q5_collections:    answers.q5_existing_collections || '',
        kismit_q6_visual_org:     answers.q6_visual_organization  || '',
        kismit_q7_one_thing:      answers.q7_one_thing            || '',
        kismit_q8_no_ai_line:     answers.q8_no_ai_line           || '',
        kismit_q9_ai_usage:       answers.q9_ai_usage             || '',
        kismit_q10_ai_comfort:    answers.q10_ai_comfort          || '',
        kismit_q11_psych_1:       answers.q11_psych_safe_1        || '',
        kismit_q11_psych_2:       answers.q11_psych_safe_2        || '',
        kismit_q12_trigger:       answers.q12_trigger             || '',
        kismit_q13_statement:     answers.q13_statement           || '',
        kismit_q14_platforms:     answers.q14_save_where          || '',
        kismit_q15_instinct:      answers.q15_instinct            || '',
        kismit_q16_identity:      answers.q16_creative_identity   || '',
        kismit_q17_demographics:  answers.q17_demographics        || ''
      }
    })
  }).catch(err => console.warn('HubSpot capture failed:', err));

  alert(`Thank you! We'll be in touch at ${v} ✦`);
  closeResult();
}