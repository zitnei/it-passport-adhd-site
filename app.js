const $ = (id)=>document.getElementById(id);
const catName = {strategy:'ストラテジ', management:'マネジメント', technology:'テクノロジ'};
let state = JSON.parse(localStorage.getItem('ipState')||'{"answered":0,"correct":0,"weak":[]}');
let current = null;
function save(){ localStorage.setItem('ipState', JSON.stringify(state)); renderStats(); }
function renderStats(){
 const rate = state.answered ? Math.round(state.correct/state.answered*100) : 0;
 $('scoreRate').textContent = rate + '%'; $('answeredCount').textContent = state.answered; $('correctCount').textContent = state.correct; $('weakCount').textContent = state.weak.length;
}
function pool(weakOnly=false){
 const cat = $('categorySelect').value;
 let items = QUESTIONS.filter(q => cat==='all' || q.cat===cat);
 if(weakOnly){ items = items.filter(q => state.weak.includes(q.id)); }
 return items.length ? items : QUESTIONS;
}
function pick(weakOnly=false){
 const items = pool(weakOnly);
 current = items[Math.floor(Math.random()*items.length)];
 $('tag').textContent = catName[current.cat]; $('qNo').textContent = 'Q' + current.id; $('question').textContent = current.q;
 $('result').className='result hidden'; $('explain').className='explain hidden';
 $('choices').innerHTML = '';
 current.choices.forEach((c,i)=>{ const b=document.createElement('button'); b.className='choice'; b.textContent=['ア','イ','ウ','エ'][i]+'　'+c; b.onclick=()=>answer(i); $('choices').appendChild(b); });
 if($('modeSelect').value==='adhd') $('question').scrollIntoView({behavior:'smooth',block:'center'});
}
function answer(i){
 if(!current) return;
 const ok = i===current.answer;
 state.answered++; if(ok) state.correct++;
 if(!ok && !state.weak.includes(current.id)) state.weak.push(current.id);
 if(ok) state.weak = state.weak.filter(id=>id!==current.id);
 $('result').className = 'result ' + (ok?'ok':'ng'); $('result').textContent = ok ? '〇 正解！' : '× 不正解。正解は「' + ['ア','イ','ウ','エ'][current.answer] + '」';
 $('explain').className='explain'; $('explain').innerHTML = '<b>覚え方：</b>' + current.ex + '<br><b>ADHD対策：</b>この1文だけ読んだら次へ。長く復習しない。';
 save();
}
$('startBtn').onclick=()=>pick(false); $('nextBtn').onclick=()=>pick(false); $('weakBtn').onclick=()=>pick(true);
$('resetBtn').onclick=()=>{ if(confirm('学習記録を消しますか？')){ state={answered:0,correct:0,weak:[]}; save(); pick(false); } };
renderStats();
