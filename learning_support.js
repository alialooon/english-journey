/* English Journey 13.5 — assisted and deferred practice with mandatory unassisted recovery.
 * A hint or skipped example never counts as durable mastery: its topic returns
 * as a different question before the next lesson, checkpoint or CEFR exam.
 * Local-only, backward compatible with englishJourneyTravelV1. */
(function(){
'use strict';
const KEY='practiceDebts', KINDS={
 vocabulary:'словарь',grammar:'грамматика',quiz:'мини-тест',reading:'чтение',
 dialogue:'диалог',writing:'самостоятельное письмо'
};
let feedback='';
function pending(){
 if(!Array.isArray(store[KEY]))store[KEY]=[];
 return store[KEY].filter(x=>!x.clearedAt);
}
function allDebts(){if(!Array.isArray(store[KEY]))store[KEY]=[];return store[KEY];}
function counts(){return pending().length;}
function dueBefore(lesson){return pending().some(x=>x.lesson<lesson);}
function ensureDebt(kind,ref,reason){
 const list=allDebts(),old=list.find(x=>!x.clearedAt&&x.lesson===dayFocus&&x.kind===kind&&x.ref===String(ref));
 if(old){if(reason==='skip')old.reason='skip';return old;}
 const debt={id:'practice-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),
  lesson:dayFocus,week:Math.floor(dayFocus/6),kind,ref:String(ref),
  reason,createdAt:new Date().toISOString(),revision:0,attempts:0,clearedAt:null};
 list.push(debt);return debt;
}
function noteHint(kind,ref,node){
 const debt=ensureDebt(kind,ref,'hint');
 const r=record(dayFocus),u=courses[debt.week];
 const lessonRule=dayFocus<6&&window.EJVariety?.foundationHint?
  window.EJVariety.foundationHint(dayFocus):(u.rule||u.grammar);
 const hints={
  vocabulary:()=>{const item=VOCAB_MAP.get(debt.ref);return item?
   'Начни с «'+esc(item.en[0].toUpperCase())+'…»; всего слов в выражении: '+item.en.trim().split(/\s+/).length+'. Вспомни английский вариант по смыслу.':'Вспомни слово по контексту темы.';},
  grammar:()=> 'Вспомни уже объяснённое правило: '+esc(lessonRule)+'. Проверь порядок слов.';,
  quiz:()=> 'Вспомни уже объяснённое правило: '+esc(lessonRule)+'. Сравни варианты.',
  reading:()=> 'Вернись к тексту и найди именно информацию, о которой спрашивают. Не ориентируйся только на знакомые слова.',
  dialogue:()=> 'Представь, что ответ прозвучит вслух: должен ли он отвечать на вопрос или вежливо уточнять ситуацию?',
  writing:()=>{const task=window.EJWritingLesson?.prompts().find(x=>x.id===debt.ref);return task?(task.kind==='grammar'?'Используй правило: '+esc(lessonRule)+'. Сначала вспомни подлежащее и глагол.':'Это выражение было в карточках слов текущего урока. Вспомни его начало: «'+esc(task.en.slice(0,1))+'…».'):'Используй уже изученные слова и строй осмысленные фразы.';}
 };
 save();
 const tip=document.createElement('p');tip.className='support-tip';tip.setAttribute('role','status');
 tip.innerHTML='<b>Подсказка:</b> '+hints[kind]()+ '<br><small>Эта тема появится в обязательном закреплении перед следующим уроком.</small>';
 const host=node.closest('.support-actions');
 host?.querySelector('.support-tip')?.remove();
 host?.appendChild(tip);
}
function doneDeferred(stage){
 const r=record(dayFocus);
 if(!r.steps[stage])r.steps[stage]=true;
 if(r.steps.every(Boolean)&&!r.doneAt){
  r.doneAt=new Date().toISOString();
  if(!store.started)store.started=r.doneAt;
  const now=dateYMD(new Date());store.history[now]=(store.history[now]||0)+1;
 }
 save();
 if(r.doneAt&&dayFocus%6===5){navigate('checkpoint');return;}
 render();
}
function skipOne(kind,ref){
 const r=record(dayFocus),s=ejSkills(r),u=courses[Math.floor(dayFocus/6)],d=dayFocus%6;
 ensureDebt(kind,ref,'skip');
 r.learningSkipped=r.learningSkipped||{};
 r.learningSkipped[kind+':'+ref]=true;
 if(kind==='vocabulary'){
  const items=vocabForLesson(dayFocus),id=String(ref);
  if(!items.some(x=>x.id===id))return;
  r.vocabDoneIds=r.vocabDoneIds||[];
  if(!r.vocabDoneIds.includes(id))r.vocabDoneIds.push(id);
  r.vocabRecall=null;r.vocabLastError=null;
  save();
  if(vocabularyStepReady(dayFocus,r))markStep(1);else render();
  return;
 }
 if(kind==='grammar'){
  const i=Number(ref);
  s.grammar.answers[i]={ok:true,deferred:true};
  s.grammar.passed=[0,1].every(i=>s.grammar.answers[i]?.ok);
  save();if(s.grammar.passed&&!r.steps[0])markStep(0);else render();return;
 }
 if(kind==='quiz'){
  const i=Number(ref);
  if(r.quizDraft[i]!==undefined)return;
  r.quizDraft[i]=-1; // explicitly skipped, not counted correct
  save();
  if(Object.keys(r.quizDraft).length===qlist(u,d,r.profile).length)finishQuiz(r,u,d);
  else render();
  return;
 }
 if(kind==='reading'){
  const i=Number(ref);
  s.reading.answers[i]=-1;
  save();render();return;
 }
 if(kind==='dialogue'){
  const ds=skillItem().dialogues;
  const path=Number.isInteger(s.dialogue.path)?s.dialogue.path:dayFocus%2;
  const turns=ds[path].turns;
  s.dialogue.path=path;s.dialogue.turn=Math.min(turns.length,(Number(s.dialogue.turn)||0)+1);
  if(s.dialogue.turn>=turns.length)s.dialogue.passed=true;
  save();render();return;
 }
 if(kind==='writing'){
  if(window.EJWritingLesson?.skip&&String(ref)!=='text')window.EJWritingLesson.skip(ref);
  else doneDeferred(4);
 }
}
const originalFinishQuiz=finishQuiz;
finishQuiz=function(r,u,d){
 if(!Object.keys(r.learningSkipped||{}).some(x=>x.startsWith('quiz:')))return originalFinishQuiz(r,u,d);
 const qs=qlist(u,d,r.profile),score=scoreDraft(qs,r),accuracy=score/qs.length;
 r.quizAttempts=(r.quizAttempts||0)+1;
 if(!Number.isFinite(r.firstAccuracy))r.firstAccuracy=accuracy;
 r.bestAccuracy=Math.max(r.bestAccuracy||0,accuracy);
 // Provisional only: unanswered items are explicitly tracked in practiceDebts.
 ejSkills(r).quizPassed=true;
 r.learningQuizProvisional=true;
 save();
 if(ejSkills(r).reading.passed&&!r.steps[3])markStep(3);
 else render();
};
function bindActions(){
 if(page!=='lesson')return;
 const work=document.querySelector('.journey-current');if(!work)return;
 // Controls are associated with the actual current sub-task, never the whole lesson.
 function add(target,kind,ref){
  if(!target||target.dataset.supportDecorated)return;
  target.dataset.supportDecorated='1';
  const host=document.createElement('div');host.className='support-actions';
  const hint=document.createElement('button');hint.type='button';hint.className='outline support-hint';
  hint.textContent='💡 Подсказка';hint.setAttribute('aria-label','Подсказка по текущему заданию');
  hint.onclick=()=>noteHint(kind,ref,hint);
  const skip=document.createElement('button');skip.type='button';skip.className='outline support-skip';
  skip.textContent='⏭ Пропустить';skip.setAttribute('aria-label','Отложить задание на обязательное закрепление');
  skip.onclick=()=>skipOne(kind,ref);
  host.append(hint,skip);target.insertAdjacentElement('afterend',host);
 }
 const vocab=work.querySelector('[data-vocab-recall], [data-vocab-submit]');
 if(vocab)add(vocab,'vocabulary',vocab.dataset.vocabRecall||vocab.dataset.vocabSubmit);
 work.querySelectorAll('[data-grammar-check]').forEach(b=>add(b.closest('.skill-inputrow')||b,'grammar',b.dataset.grammarCheck));
 const quizGroups=Array.from(work.querySelectorAll('.questiongroup'));
 quizGroups.forEach((group,i)=>{const button=group.querySelector('[data-answer]');if(button&&record(dayFocus).quizDraft[i]===undefined)add(group,'quiz',i)});
 work.querySelectorAll('.skill-question').forEach(group=>{
  const reading=group.querySelector('[data-skill-reading]');
  if(reading){
   const part=reading.dataset.skillReading.split(':')[0];
   if(ejSkills(record(dayFocus)).reading.answers[part]===undefined)add(group,'reading',part);
  }
  const dialog=group.querySelector('[data-dialog-answer]');
  if(dialog){const s=ejSkills(record(dayFocus)).dialogue;add(group,'dialogue',String(Number(s.turn)||0));}
 });
 work.querySelectorAll('[data-writing-check]').forEach(btn=>{
  const ref=btn.dataset.writingCheck;
  const block=btn.closest('.writing-item');
  if(block&&!record(dayFocus).steps[4])add(block.querySelector('.writing-inputrow')||block,'writing',ref);
 });
 const writing=work.querySelector('#lesson-writing');
 if(writing&&!record(dayFocus).steps[4])add(writing,'writing','text');
 const dueHere=pending().filter(x=>x.lesson===dayFocus);
 if(dueHere.length){
  const msg=document.createElement('div');msg.className='support-warning';msg.setAttribute('role','status');
  msg.innerHTML='<b>🔁 Будет повторение:</b> '+dueHere.length+' заданий этой темы отмечено для закрепления. Текущий урок можно завершить, но следующий урок или экзамен останется закрыт до успешного выполнения новых вариантов.';
  const title=work.querySelector('.journey-current-heading');
  if(title)title.insertAdjacentElement('afterend',msg);
 }
}
// If reading or quiz items were deferred, permit provisional stage completion without declaring mastery.
const oldWire=wire;
wire=function(){
 oldWire();
 if(page==='reinforcement'){bindReview();return;}
 if(page!=='lesson')return;
 const submit=document.querySelector('[data-skill-reading-submit]');
 if(submit&&Object.keys(record(dayFocus).learningSkipped||{}).some(x=>x.startsWith('reading:'))){
  submit.onclick=()=>{
   const r=record(dayFocus),skill=ejSkills(r),questions=skillItem().reading.questions;
   if(Object.keys(skill.reading.answers).length!==questions.length)return;
   const realCorrect=questions.reduce((n,q,i)=>n+Number(skill.reading.answers[i]===q.answer),0);
   skill.reading.lastScore=realCorrect;skill.reading.passed=true;
   r.learningReadingProvisional=true;save();
   if(skill.quizPassed&&!r.steps[3])markStep(3);else render();
  };
 }
 bindActions();
};
function eligibleDebts(){return pending().sort((a,b)=>a.lesson-b.lesson||a.createdAt.localeCompare(b.createdAt));}
function selectDifferent(rows,key,index,excluded){
 if(!rows.length)throw Error('Нет повторных заданий по этой теме');
 const candidates=rows.filter(x=>String(key(x))!==String(excluded));
 const all=candidates.length?candidates:rows;
 return all[(index%all.length+all.length)%all.length];
}
function question(debt){
 if(window.EJPrerequisites)return window.EJPrerequisites.reviewTask(debt);
 const week=debt.week,u=courses[week],s=SKILLS_DATA[week],v=VOCAB_BANK[week]||[];
 const seed=seedHash(debt.id+'-'+debt.kind);
 const offset=(seed+debt.revision)%1000;
 if(debt.kind==='vocabulary'){
  const row=selectDifferent(v,x=>x.id,offset,debt.ref);
  return {mode:'text',label:'Вспомни другое выражение из той же темы',
   body:'Как сказать по-английски: «'+esc(row.ru)+'»?',expected:row.en,kind:'vocabulary'};
 }
 if(debt.kind==='grammar'){
  const exercises=s.grammar||[],origin=Number(debt.ref),prior=exercises[(debt.lesson%6+origin)%exercises.length];
  const row=selectDifferent(exercises,x=>x.en,offset,prior?.en);
  return {mode:'text',label:'Новая фраза с тем же грамматическим правилом',
   body:'Переведи: «'+esc(row.ru)+'»',expected:row.en,kind:'grammar'};
 }
 if(debt.kind==='writing'){
  const original=Number(debt.ref),models=s.grammar||[];
  if(Number.isInteger(original)&&original>=0&&original<=3){
   if(original<3){
    const studied=vocabForLesson(debt.lesson);
    const ignored=studied[original]?.id||'';
    const alternatives=studied.filter(x=>x.id!==ignored);
    const row=alternatives[offset%alternatives.length];
    return {mode:'text',label:'Повтори слово из той же темы, но не исходное',
      body:'Переведи на английский: «'+esc(row.ru)+'»',expected:row.en,kind:'vocabulary'};
   }
   const previous=models[(debt.lesson%6+2)%models.length];
   const row=selectDifferent(models,x=>x.en,offset,previous?.en);
   return {mode:'text',label:'Переведи другое предложение по тому же правилу',
    body:'Переведи на английский: «'+esc(row.ru)+'»',expected:row.en,kind:'grammar'};
  }
  const a=v.length?v[offset%v.length]:null;
  const b=v.length>1?v[(offset+3)%v.length]:null;
  return {mode:'writing',label:'Напиши новую самостоятельную фразу',
   body:'Составь короткое сообщение по теме «'+esc(u.title)+'», минимум 9 английских слов. Используй'+
   (a?' выражение «'+esc(a.en)+'»':' лексику урока')+(b?' и «'+esc(b.en)+'»':'')+'.',
   terms:[a?.en,b?.en].filter(Boolean)};
 }
  if(debt.kind==='quiz'){
  const list=u.quiz||[],original=qlist(u,debt.lesson%6,record(debt.lesson).profile)[Number(debt.ref)];
  const row=selectDifferent(list,x=>x[0],offset,original?.[0]);
  return choices(row[0],row[1],row[2],seed+debt.revision,'Грамматика и лексика: новая ситуация');
 }
 if(debt.kind==='reading'){
  const qs=s.reading.questions,original=Number(debt.ref);
  const row=qs[(original+1+(debt.revision%(qs.length-1||1)))%qs.length];
  return choices(s.reading.text+' \n\n'+row.q,row.options,row.answer,seed+debt.revision,'Найди в тексте новый факт');
 }
 if(debt.kind==='dialogue'){
  const dialogs=s.dialogues||[],flat=dialogs.flatMap(x=>x.turns);
  const oldIndex=Number(debt.ref),row=flat[(oldIndex+1+offset)%flat.length];
  return choices(row.lead,row.choices,row.correct,seed+debt.revision,'Ответь на новую реплику собеседника');
 }
 throw Error('Неизвестная категория повторения');
}
function choices(body,options,answer,seed,label){
 const shuffled=options.map((value,i)=>({value,correct:i===answer}));
 const rand=prng(seedHash(String(seed)));
 for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 return {mode:'choice',label,body,options:shuffled};
}
function reviewPage(){
 const debts=eligibleDebts(),debt=debts[0],remaining=debts.length;
 if(!debt)return '<div class="panel"><h2>✓ Закрепление выполнено</h2><button class="primary dark" data-review-continue="1">Продолжить обучение →</button></div>';
 const task=question(debt),level=courses[debt.week].level;
 const input=task.mode==='choice'?'<div class="support-review-options">'+task.options.map((o,i)=>
  '<button class="choice" data-review-choice="'+i+'">'+String.fromCharCode(65+i)+'. '+esc(o.value)+'</button>').join('')+'</div>':
  '<textarea id="support-review-answer" rows="3" spellcheck="false" placeholder="Напиши свой ответ по-английски..." aria-label="Самостоятельный ответ"></textarea>'+
  '<button class="primary dark" data-review-check="1">Проверить ответ</button>';
 return '<div class="lesson-head"><div><span class="pill">Обязательное закрепление · '+esc(level)+'</span>'+
  '<h2>🔁 Вспомним изученную тему</h2><p>Прежде чем двигаться дальше, самостоятельно выполни новый вариант задания.</p></div></div>'+
  '<div class="panel support-review"><p class="pill">Осталось заданий: '+remaining+'</p>'+
  '<h3>'+esc(courses[debt.week].title)+'</h3><p class="tiny">Из урока '+(debt.lesson+1)+
  ' · '+KINDS[debt.kind]+' · '+(debt.reason==='skip'?'было пропущено':'использовалась подсказка')+'</p>'+
  '<div class="support-review-question"><b>'+esc(task.label)+'</b><p>'+esc(task.body)+'</p></div>'+
  input+'<div class="support-review-actions"><button class="outline" data-review-alternate="1">Другой вариант по этой же теме ↻</button>'+
  '<span class="tiny">Подсказки и пропуски не засчитываются как подтверждение навыка. Здесь нужно ответить самостоятельно.</span></div>'+
  (feedback?'<div class="result error" role="status">'+esc(feedback)+'</div>':'')+
  '</div>';
}
function tryAnswer(value,choiceIndex=null){
 const debt=eligibleDebts()[0];if(!debt)return;
 const task=question(debt);let ok=false;
 if(task.mode==='choice')ok=task.options[choiceIndex]?.correct===true;
  else if(task.mode==='text')ok=task.kind==='vocabulary'?vocText(value)===vocText(task.expected):
  normalizeGrammar(value)===normalizeGrammar(task.expected);
 else if(task.mode==='writing'){
  const tokens=(value.match(/[a-z]+(?:'[a-z]+)?/gi)||[]);
  ok=tokens.length>=9&&task.terms.every(t=>vocText(value).includes(vocText(t)));
 }
 debt.attempts++;
 if(ok){
  debt.clearedAt=new Date().toISOString();debt.reviewedTaskType=task.mode;
  feedback='';save();render();
 }else{
  debt.revision++;
  feedback='Пока не получилось. Подобран другой вариант этой темы: попробуй ещё раз, без подсказки.';
  save();render();
 }
}
function bindReview(){
 document.querySelectorAll('[data-review-choice]').forEach(b=>b.onclick=()=>tryAnswer('',Number(b.dataset.reviewChoice)));
 const check=document.querySelector('[data-review-check]');
 if(check)check.onclick=()=>tryAnswer(document.getElementById('support-review-answer')?.value||'');
 const area=document.getElementById('support-review-answer');
 if(area)area.onkeydown=e=>{if(e.key==='Enter'&&e.ctrlKey)check?.click();};
 const next=document.querySelector('[data-review-alternate]');
 if(next)next.onclick=()=>{const d=eligibleDebts()[0];if(d){d.revision++;feedback='Новый вариант. Смысл и тема остались прежними.';save();render();}};
 const go=document.querySelector('[data-review-continue]');if(go)go.onclick=resume;
}
function resume(){
 if(counts()){navigate('reinforcement');return;}
 const target=Number.isInteger(store.practiceResumeDay)?store.practiceResumeDay:nextIndex();
 store.practiceResumeDay=null;save();
 const next=nextTask();
 if(next.type==='exam'||next.type==='topic')navigate(next.type==='exam'?'exam':'checkpoint');
 else openLesson(target);
}
const oldLesson=lesson,oldRender=render,oldOpenLesson=openLesson,oldNavigate=navigate;
lesson=function(){
 const content=oldLesson();
 if(!pending().some(x=>x.lesson===dayFocus))return content;
 return content.replace('<div class="journey-bonus tiny">','<div class="support-warning" role="status">🔁 Задания с подсказкой или пропуском не забыты. Они появятся перед следующим уроком и должны быть выполнены без подсказок.</div><div class="journey-bonus tiny">');
};
openLesson=function(i){
 if(dueBefore(i)){
  store.practiceResumeDay=i;feedback='';save();oldNavigate('reinforcement');return;
 }
 return oldOpenLesson(i);
};
navigate=function(p){
 if((p==='checkpoint'||p==='exam')&&counts()>0){
  store.practiceResumeDay=nextIndex();feedback='';save();return oldNavigate('reinforcement');
 }
 return oldNavigate(p);
};
const oldCheckpoint=checkpointPage,oldExamPage=examPage,oldSubmitTopic=submitTopic,oldSubmitExam=submitExam;
function gateText(kind){
 return '<div class="panel support-warning"><h3>🔒 Прежде чем открыть '+kind+', закончи закрепление</h3>'+
  '<p>Осталось '+counts()+' заданий из прежних уроков, где была подсказка или пропуск. Новые варианты по той же теме нужно выполнить самостоятельно.</p>'+
  '<button class="primary dark" data-page="reinforcement">Перейти к закреплению →</button></div>';
}
checkpointPage=function(){return counts()?gateText('зачёт темы'):oldCheckpoint();};
examPage=function(){return counts()?gateText('экзамен'):oldExamPage();};
submitTopic=function(){if(counts())return navigate('reinforcement');return oldSubmitTopic();};
submitExam=function(){if(counts())return navigate('reinforcement');return oldSubmitExam();};
render=function(){
 if(page==='reinforcement'){
  header();document.getElementById('root').innerHTML=reviewPage();
  wire();return;
 }
 oldRender();
};
window.EnglishJourneySupport={pending:()=>pending().map(x=>({...x})),dueBefore,reviewTask:()=>eligibleDebts()[0]?question(eligibleDebts()[0]):null};
})();