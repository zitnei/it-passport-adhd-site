const $ = (id) => document.getElementById(id);
const catName = { strategy:'ストラテジ', management:'マネジメント', technology:'テクノロジ' };
let state = JSON.parse(localStorage.getItem('ipState') || '{"answered":0,"correct":0,"weak":[],"seen":[]}');
if (!Array.isArray(state.seen)) state.seen = [];
let current = null;
let currentWeakOnly = false;

function save(){ localStorage.setItem('ipState', JSON.stringify(state)); renderStats(); }
function renderStats(){
  const rate = state.answered ? Math.round(state.correct / state.answered * 100) : 0;
  $('scoreRate').textContent = rate + '%';
  $('answeredCount').textContent = state.answered;
  $('correctCount').textContent = state.correct;
  $('weakCount').textContent = state.weak.length;
}
function pool(weakOnly=false){
  const cat = $('categorySelect').value;
  let items = QUESTIONS.filter(q => cat === 'all' || q.cat === cat);
  if (weakOnly) items = items.filter(q => state.weak.includes(q.id));
  return items.length ? items : QUESTIONS;
}
function clearNode(node){ while(node.firstChild) node.removeChild(node.firstChild); }
function pick(weakOnly=false){
  currentWeakOnly = weakOnly;
  const items = pool(weakOnly);
  let unseen = items.filter(q => !state.seen.includes(q.id));
  if (!unseen.length) { state.seen = []; unseen = items; }
  current = unseen[Math.floor(Math.random() * unseen.length)];
  state.seen.push(current.id);
  save();
  $('tag').textContent = catName[current.cat] || '分野';
  $('qNo').textContent = (current.source || '出典未設定') + ' / Q' + current.id;
  $('question').textContent = current.q;
  $('result').className = 'result hidden';
  $('explain').className = 'explain hidden';
  clearNode($('result'));
  clearNode($('explain'));
  clearNode($('choices'));
  current.choices.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = ['ア','イ','ウ','エ'][i] + '　' + c;
    b.addEventListener('click', () => answer(i));
    $('choices').appendChild(b);
  });
  if ($('modeSelect').value === 'adhd') $('question').scrollIntoView({ behavior:'smooth', block:'center' });
}
function answer(i){
  if (!current) return;
  const ok = i === current.answer;
  state.answered++;
  if (ok) state.correct++;
  if (!ok && !state.weak.includes(current.id)) state.weak.push(current.id);
  if (ok) state.weak = state.weak.filter(id => id !== current.id);
  $('choices').querySelectorAll('button').forEach(b => b.disabled = true);
  $('result').className = 'result result-row ' + (ok ? 'ok' : 'ng');
  clearNode($('result'));
  const msg = document.createElement('span');
  msg.textContent = ok ? '〇 正解！' : '× 不正解。正解は「' + ['ア','イ','ウ','エ'][current.answer] + '」';
  const next = document.createElement('button');
  next.className = 'next-inline';
  next.textContent = '次の問題';
  next.addEventListener('click', () => pick(currentWeakOnly));
  $('result').appendChild(msg);
  $('result').appendChild(next);
  $('explain').className = 'explain';
  clearNode($('explain'));
  const lines = [
    '出典：' + (current.source || '出典未設定'),
    '覚え方：' + current.ex,
    'ADHD対策：この1文だけ読んだら「次の問題」。長く復習しない。'
  ];
  lines.forEach(t => { const p = document.createElement('p'); p.textContent = t; $('explain').appendChild(p); });
  if (ok) happyAnimation();
  save();
}
function happyAnimation(){
  const marks = ['⭐','✨','🌸','💮','🎉','✅'];
  const wrap = document.createElement('div');
  wrap.className = 'happy-pop';
  const count = 10 + Math.floor(Math.random() * 7);
  for (let n = 0; n < count; n++) {
    const s = document.createElement('span');
    s.textContent = marks[Math.floor(Math.random() * marks.length)];
    s.style.left = (10 + Math.random() * 80) + '%';
    s.style.animationDelay = (Math.random() * 0.2) + 's';
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1400);
}
$('startBtn').addEventListener('click', () => pick(false));
$('nextBtn').addEventListener('click', () => pick(false));
$('weakBtn').addEventListener('click', () => pick(true));
$('categorySelect').addEventListener('change', () => { state.seen = []; save(); });
$('resetBtn').addEventListener('click', () => { if(confirm('学習記録を消しますか？')){ state={answered:0,correct:0,weak:[],seen:[]}; save(); pick(false); } });
renderStats();
