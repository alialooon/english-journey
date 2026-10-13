/* English Journey 8 — productive grammar, authentic-source listening,
 * contextual reading, and two-path interactive dialogues.
 * Only first-party authored exercises are embedded; recordings stay on VOA. */
function ejSkills(r){
 if(!r.skills||typeof r.skills!=='object')r.skills={};
 for(const k of ['grammar','reading','listening','dialogue'])if(!r.skills[k]||typeof r.skills[k]!=='object')r.skills[k]={};
 for(const k of ['reading','listening'])if(!r.skills[k].answers||typeof r.skills[k].answers!=='object')r.skills[k].answers={};
 if(!r.skills.grammar.answers||typeof r.skills.grammar.answers!=='object')r.skills.grammar.answers={};
 return r.skills;
}
function skillItem(){return SKILLS_DATA[Math.floor(dayFocus/6)]}
function grammarExercises(){if(window.EJVariety?.curated(dayFocus))return window.EJVariety.practice(dayFocus).slice(0,2);let a=skillItem().grammar,day=dayFocus%6;return [a[day%3],a[(day+1)%3]]}
function normalizeGrammar(raw){return String(raw||'').trim().toLowerCase().replace(/[’]/g,"'").replace(/\bcan't\b/g,'cannot').replace(/\bdon't\b/g,'do not').replace(/\bdoesn't\b/g,'does not').replace(/\bi'm\b/g,'i am').replace(/\bshe's\b/g,'she is').replace(/\bhe's\b/g,'he is').replace(/\bwe're\b/g,'we are').replace(/\bthey're\b/g,'they are').replace(/\byou're\b/g,'you are').replace(/[^\p{L}\p{N} ]/gu,'').replace(/\s+/g,' ').trim()}
// Scaffold one new pattern at a time; retain independent translation each day.
function grammarPracticeMode(i){
 if(i!==0||!window.EJVariety?.curated(dayFocus))return 'translate';
 return dayFocus%6===1?'order':dayFocus%6===2?'gap':'translate';
}
function grammarOrderTokens(sentence){
 const words=sentence.replace(/[.!?]+$/,'').split(/\s+/);
 // Deterministic but never initially assembled: rotate by one word.
 return words.slice(1).concat(words[0]);
}
function grammarGapIndex(sentence){
 return /^[Aa]m |^[Ii]s |^[Aa]re |^[Dd]o |^[Dd]oes /.test(sentence)?0:1;
}
function skillGrammarPane(r){
 const state=ejSkills(r).grammar,rows=grammarExercises();
 state.tileDrafts=state.tileDrafts||{};
 const tasks=rows.map((item,i)=>{
  const mode=grammarPracticeMode(i),passed=Boolean(state.answers[i]?.ok);
  let input='';
  if(!passed&&mode==='order'){
   const tokens=grammarOrderTokens(item.en);
   const picks=(state.tileDrafts[i]||[]).filter(x=>Number.isInteger(x)&&x>=0&&x<tokens.length);
   const chosen=picks.map(x=>tokens[x]).join(' ');
   input='<div class="tiny">Нажми слова в правильном порядке:</div>'+
    '<div class="grammar-tiles" aria-label="Слова для составления">'+tokens.map((word,k)=>
     '<button class="outline grammar-tile" data-grammar-token="'+i+':'+k+'" '+
     (picks.includes(k)?'disabled':'')+'>'+esc(word)+'</button>').join('')+'</div>'+
    '<div class="grammar-assembly" aria-live="polite">'+(chosen?esc(chosen):'Составь предложение')+'</div>'+
    '<div class="skill-inputrow"><input type="hidden" data-grammar-input="'+i+'" value="'+esc(chosen)+'">'+
    '<button class="outline" data-grammar-clear="'+i+'" '+(!picks.length?'disabled':'')+'>Очистить</button>'+
    '<button class="outline" data-grammar-check="'+i+'" '+(picks.length!==tokens.length?'disabled':'')+'>Проверить</button></div>';
  }else if(!passed&&mode==='gap'){
   const words=item.en.split(/\s+/),missing=grammarGapIndex(item.en);
   const visible=words.map((word,k)=>k===missing?'_____':word).join(' ');
   input='<div class="grammar-gap" lang="en">'+esc(visible)+'</div>'+
    '<div class="skill-inputrow"><input data-grammar-input="'+i+'" spellcheck="false" autocomplete="off" '+
    'aria-label="Вставь одно английское слово в пропуск" placeholder="Пропущенное слово">'+
    '<button class="outline" data-grammar-check="'+i+'">Проверить</button></div>';
  }else if(!passed){
   input='<div class="skill-inputrow"><input data-grammar-input="'+i+'" spellcheck="false" autocomplete="off" '+
    'aria-label="Английское предложение '+(i+1)+'" placeholder="Напиши английскую фразу">'+
    '<button class="outline" data-grammar-check="'+i+'">Проверить</button></div>';
  }
  const instruction=mode==='order'?'Составь из слов':mode==='gap'?'Вставь одно слово':'Переведи на английский';
  return '<div class="skill-question"><div class="qcounter">'+(i+1)+'/2 · '+instruction+'</div>'+
   '<b>'+esc(item.ru)+'</b>'+
   (passed?'<p class="result">✓ <span lang="en">'+esc(item.en)+'</span></p>':input+
    (state.answers[i]?.error?'<p class="result error">Попробуй ещё раз, опираясь на правило выше.</p>':''))+
   '</div>';
 }).join('');
 return '<div class="skill-section"><h3>Практика правила</h3>'+
  '<p class="tiny">Все слова и конструкции уже объяснены. Ответы проверяются без учёта регистра и пунктуации.</p>'+
  tasks+(state.passed?'':'<p class="tiny">Верно: '+[0,1].filter(i=>state.answers[i]?.ok).length+'/2</p>')+'</div>';
}
function skillOptionsMarkup(items,answers,kind){return items.map((q,i)=>`<div class="skill-question"><b>${i+1}. ${esc(q.q)}</b><div class="skill-choicegrid">${q.options.map((v,j)=>`<button class="choice ${Number(answers[i])===j?'answer-selected':''}" data-skill-${kind}="${i}:${j}" aria-pressed="${Number(answers[i])===j}">${String.fromCharCode(65+j)}. ${esc(v)}</button>`).join('')}</div></div>`).join('')}
function skillReadingPane(r){const s=ejSkills(r).reading,d=skillItem().reading;return `<div class="skill-section"><h3>Чтение</h3><p class="tiny">Прочитай предложения и выбери их значение по-русски.</p><div class="reading-source" lang="en">${esc(d.text)}</div>${s.passed?'<p class="tiny">Чтение завершено</p>':`${skillOptionsMarkup(d.questions,s.answers,'reading')}<button class="primary dark" data-skill-reading-submit="1" ${Object.keys(s.answers).length!==d.questions.length?'disabled':''}>Проверить чтение</button>${s.lastScore!==undefined?`<div class="result ${s.lastScore<2?'error':''}">Правильно: ${s.lastScore}/3. Для зачёта требуется 2 из 3.${s.lastScore<2?' Повтори текст и попробуй ещё раз.':''}</div>`:''}`}</div>`}
function skillAudioPane(r){const s=ejSkills(r).listening,a=skillItem().audio,provider=a.url.includes("britishcouncil.org")?"British Council LearnEnglish":"VOA Learning English";return `<div class="split"><span class="pill">Шаг 3 · аудирование ~9 мин</span>${r.steps[2]?'✅ Готово':''}</div><h3>🎧 Настоящая разговорная английская речь</h3><p>Открой оригинальную запись двух или нескольких говорящих на сайте ${esc(provider)}. Прослушай её 1–2 раза, не читая расшифровку до первой попытки.</p><div class="audio-resource"><b>${esc(a.title)}</b><a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer" data-real-audio="1">▶ Открыть запись ${esc(provider)} ↗</a><p class="tiny">Источник: ${esc(provider)}. Запись воспроизводится на сайте правообладателя, а не создаётся голосовым синтезатором. Нужен интернет. После прослушивания вернись к вопросам.</p></div>${s.passed?`<div class="donebanner">✓ Понимание записи проверено. ${nextButton(3)}</div>`:`${skillOptionsMarkup(a.questions,s.answers,'listening')}<button class="primary dark" data-skill-listening-submit="1" ${!s.opened||Object.keys(s.answers).length!==a.questions.length?'disabled':''}>Проверить услышанное</button>${!s.opened?'<p class="tiny">Сначала открой запись по ссылке выше.</p>':''}${s.lastScore!==undefined?`<div class="result error">Верно: ${s.lastScore}/2. Нужно 2 из 2. Ещё раз прослушай оригинал и пересдай вопросы.</div>`:''}`}</div>`}
function skillDialogPane(r){const s=ejSkills(r).dialogue,d=skillItem().dialogues;const path=Number.isInteger(s.path)?s.path:dayFocus%2,branch=d[path];const ix=Number(s.turn)||0;return `<div class="skill-section"><h3>🗣️ Диалог с выбором сценария</h3><p class="tiny">Выбери ситуацию и реагируй подходящими английскими репликами. Если собеседник изменит условия, ответ тоже должен измениться. Это проверка коммуникативных решений, не произношения.</p><div class="skill-paths">${d.map((b,j)=>`<button class="outline ${path===j?'skill-active':''}" data-dialog-path="${j}">${esc(b.title)}</button>`).join('')}</div>${s.passed?'<div class="donebanner">✓ Обе реплики диалога выбраны верно</div>':`${ix<branch.turns.length?`<div class="skill-question"><div class="qcounter">Реплика ${ix+1} из ${branch.turns.length}</div><b>${esc(branch.turns[ix].lead)}</b><div class="skill-choicegrid">${branch.turns[ix].choices.map((v,j)=>`<button class="choice" data-dialog-answer="${j}">${String.fromCharCode(65+j)}. ${esc(v)}</button>`).join('')}</div></div>`:''}${s.lastWrong?'<div class="result error">Этот ответ не подходит по смыслу. Попробуй другой вариант.</div>':''}`}</div>`}
function skillsHandlers(){
 document.querySelectorAll('[data-grammar-token]').forEach(b=>b.onclick=()=>{
  const [i,k]=b.dataset.grammarToken.split(':').map(Number);
  const r=record(dayFocus),state=ejSkills(r).grammar;state.tileDrafts=state.tileDrafts||{};
  const draft=state.tileDrafts[i]||[];
  if(grammarPracticeMode(i)!=='order'||state.answers[i]?.ok||draft.includes(k))return;
  draft.push(k);state.tileDrafts[i]=draft;save();render();
 });
 document.querySelectorAll('[data-grammar-clear]').forEach(b=>b.onclick=()=>{
  const r=record(dayFocus),state=ejSkills(r).grammar;
  if(state.tileDrafts)state.tileDrafts[Number(b.dataset.grammarClear)]=[];
  save();render();
 });
 document.querySelectorAll('[data-grammar-check]').forEach(b=>{
  const fn=()=>{
   const i=Number(b.dataset.grammarCheck),r=record(dayFocus),state=ejSkills(r).grammar;
   const raw=document.querySelector(`[data-grammar-input="${i}"]`)?.value||'';
   const target=grammarExercises()[i].en;
   const expected=grammarPracticeMode(i)==='gap'?target.split(/\s+/)[grammarGapIndex(target)]:target;
   const ok=normalizeGrammar(raw)===normalizeGrammar(expected);
   state.answers[i]={ok,error:!ok};
   state.passed=[0,1].every(j=>state.answers[j]?.ok);
   save();if(state.passed&&!r.steps[0])markStep(0);else render();
  };
  b.onclick=fn;
  const input=document.querySelector(`[data-grammar-input="${b.dataset.grammarCheck}"]`);
  if(input)input.onkeydown=e=>{if(e.key==='Enter')fn()};
 });
 document.querySelectorAll('[data-real-audio]').forEach(b=>b.onclick=()=>{const s=ejSkills(record(dayFocus)).listening;s.opened=true;save();const submit=document.querySelector('[data-skill-listening-submit]');if(submit&&Object.keys(s.answers).length===skillItem().audio.questions.length)submit.disabled=false;});
 for(const kind of ['reading','listening']){
  document.querySelectorAll(`[data-skill-${kind}]`).forEach(b=>b.onclick=()=>{const [i,j]=b.dataset[`skill${kind[0].toUpperCase()+kind.slice(1)}`].split(':').map(Number);ejSkills(record(dayFocus))[kind].answers[i]=j;save();render()});
  const submit=document.querySelector(`[data-skill-${kind}-submit]`);if(submit)submit.onclick=()=>{const r=record(dayFocus),s=ejSkills(r)[kind],questions=kind==='reading'?skillItem().reading.questions:skillItem().audio.questions;if(kind==='listening'&&!s.opened)return;if(Object.keys(s.answers).length!==questions.length)return;const count=questions.reduce((n,q,i)=>n+(Number(s.answers[i])===q.answer?1:0),0);s.lastScore=count;s.passed=count>=(kind==='reading'?2:2);if(!s.passed)s.answers={};save();if(s.passed&&kind==='listening'&&!r.steps[2])markStep(2);else if(s.passed&&kind==='reading'&&r.skills.quizPassed&&!r.steps[3])markStep(3);else render()};
 }
 document.querySelectorAll('[data-dialog-path]').forEach(b=>b.onclick=()=>{const r=record(dayFocus),s=ejSkills(r).dialogue;s.path=Number(b.dataset.dialogPath);s.turn=0;s.passed=false;s.lastWrong=false;save();render()});
 document.querySelectorAll('[data-dialog-answer]').forEach(b=>b.onclick=()=>{const r=record(dayFocus),s=ejSkills(r).dialogue,path=Number.isInteger(s.path)?s.path:dayFocus%2,branch=skillItem().dialogues[path];s.path=path;const ix=Number(s.turn)||0;if(ix>=branch.turns.length)return;const correct=Number(b.dataset.dialogAnswer)===branch.turns[ix].correct;if(correct){s.turn=ix+1;s.lastWrong=false;if(s.turn===branch.turns.length)s.passed=true}else s.lastWrong=true;save();render()});
}
function skillStats(){const rows=Object.values(store.logs).filter(x=>x&&x.doneAt);const match=(key)=>rows.filter(r=>r.skills?.[key]?.passed).length;return {grammar:match('grammar'),reading:match('reading'),listening:match('listening'),dialogue:match('dialogue'),completed:rows.length}}
