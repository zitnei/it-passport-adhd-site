const $ = (id) => document.getElementById(id);
const catName = { strategy:'ストラテジ', management:'マネジメント', technology:'テクノロジ' };
const IPA_PAST_URL = 'https://www3.jitec.ipa.go.jp/JitesCbt/html/openinfo/questions.html';
let state = JSON.parse(localStorage.getItem('ipState') || '{"answered":0,"correct":0,"weak":[],"seen":[],"mastered":[]}');
if (!Array.isArray(state.seen)) state.seen = [];
if (!Array.isArray(state.mastered)) state.mastered = [];
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
function sourceLabel(q){ return q.source || '出典未設定'; }
function pool(weakOnly=false){
  const cat = $('categorySelect').value;
  let items = QUESTIONS.filter(q => cat === 'all' || q.cat === cat);
  if (weakOnly) items = items.filter(q => state.weak.includes(q.id));
  else items = items.filter(q => !state.mastered.includes(q.id));
  return items;
}
function clearNode(node){ while(node.firstChild) node.removeChild(node.firstChild); }
function addOfficialLink(parent){
  const a = document.createElement('a');
  a.href = IPA_PAST_URL;
  a.target = '_blank';
  a.rel = 'noreferrer';
  a.className = 'official-link';
  a.textContent = 'IPA公式 過去問題ページを開く';
  parent.appendChild(a);
}
function renderQuestionBody(q){
  clearNode($('question'));
  const title = document.createElement('div');
  title.className = 'question-text';
  title.textContent = q.q;
  $('question').appendChild(title);
  if (q.tip) {
    const tip = document.createElement('div');
    tip.className = 'study-tip';
    tip.textContent = q.tip;
    $('question').appendChild(tip);
  }
  if (q.table) {
    const table = document.createElement('table');
    table.className = 'question-table';
    const thead = document.createElement('thead');
    const hr = document.createElement('tr');
    q.table.headers.forEach(h => { const th = document.createElement('th'); th.textContent = h; hr.appendChild(th); });
    thead.appendChild(hr);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    q.table.rows.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => { const td = document.createElement('td'); td.textContent = cell; tr.appendChild(td); });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    $('question').appendChild(table);
  }
}
function showFinished(){
  current = null;
  $('tag').textContent = '完了';
  $('qNo').textContent = '正解済みは非表示';
  clearNode($('question'));
  const done = document.createElement('div');
  done.className = 'question-text';
  done.textContent = 'この範囲の未正解問題は終わりました。分野を変えるか、記録リセットで最初からできます。';
  $('question').appendChild(done);
  clearNode($('choices'));
  $('result').className = 'result ok';
  $('result').textContent = '〇 よくできました';
  $('explain').className = 'explain';
  clearNode($('explain'));
  const p = document.createElement('p');
  p.textContent = '一度正解した問題は、もう通常練習には出ません。';
  $('explain').appendChild(p);
  addOfficialLink($('explain'));
}
function pick(weakOnly=false){
  currentWeakOnly = weakOnly;
  const items = pool(weakOnly);
  if (!items.length) { showFinished(); return; }
  let unseen = items.filter(q => !state.seen.includes(q.id));
  if (!unseen.length) { state.seen = []; unseen = items; }
  current = unseen[Math.floor(Math.random() * unseen.length)];
  state.seen.push(current.id);
  save();
  $('tag').textContent = catName[current.cat] || '分野';
  $('qNo').textContent = sourceLabel(current) + ' / Q' + current.id;
  renderQuestionBody(current);
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
}
function answer(i){
  if (!current) return;
  const ok = i === current.answer;
  state.answered++;
  if (ok) {
    state.correct++;
    if (!state.mastered.includes(current.id)) state.mastered.push(current.id);
  }
  if (!ok && !state.weak.includes(current.id)) state.weak.push(current.id);
  if (ok) state.weak = state.weak.filter(id => id !== current.id);
  $('choices').querySelectorAll('button').forEach((b, idx) => {
    b.disabled = true;
    b.classList.add('choice-muted');
    if (idx === current.answer) b.classList.add('choice-correct');
    if (idx === i && !ok) b.classList.add('choice-wrong');
  });
  $('result').className = 'result result-row ' + (ok ? 'ok' : 'ng');
  clearNode($('result'));
  const msg = document.createElement('span');
  msg.textContent = ok ? '〇 正解！この問題は卒業' : '× 不正解。正解は「' + ['ア','イ','ウ','エ'][current.answer] + '」';
  const next = document.createElement('button');
  next.className = 'next-inline';
  next.textContent = '次の問題';
  next.addEventListener('click', () => pick(currentWeakOnly));
  $('result').appendChild(msg);
  $('result').appendChild(next);
  $('explain').className = 'explain';
  clearNode($('explain'));
  const exLines = Array.isArray(current.ex) ? current.ex.slice(0, 3) : String(current.ex).split('。').filter(Boolean).slice(0, 3).map(s => s + '。');
  exLines.forEach(t => { const p = document.createElement('p'); p.textContent = t; $('explain').appendChild(p); });
  addOfficialLink($('explain'));
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
$('resetBtn').addEventListener('click', () => { if(confirm('学習記録を消しますか？')){ state={answered:0,correct:0,weak:[],seen:[],mastered:[]}; save(); pick(false); } });
renderStats();
