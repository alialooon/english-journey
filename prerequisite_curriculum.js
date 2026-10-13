/* English Journey 13.9 — strict prerequisite curriculum with reviewed variations.
 * No compulsory lesson exercise can draw vocabulary from future days or
 * English grammar/sentences that the learner was not explicitly shown first.
 * All tasks are generated from today's eight introduced cards and this week's
 * three explicitly introduced bilingual grammar models. */
(function(){
'use strict';
const VERSION=2;
function models(i){return SKILLS_DATA[Math.floor(i/6)].grammar;}
function words(i){return vocabForLesson(i);}
function material(i){
 const g=models(i),v=words(i);
 if(g.length<3||v.length<3)throw Error('Недостаточно изучаемого материала для урока '+i);
 return {grammar:g,words:v};
}
function shuffle3(values,seed){
 let a=values.slice(),s=(seed+1)>>>0;
 for(let j=a.length-1;j>0;j--){s=(Math.imul(s,1664525)+1013904223)>>>0;let k=s%(j+1);[a[j],a[k]]=[a[k],a[j]]}
 return a;
}
function pickOtherWords(i,target,n=2){
 const all=words(i).filter(w=>w.id!==target.id);
 return Array.from({length:n},(_,j)=>all[(i+j+all.length)%all.length]);
}
function choiceQuiz(i,n){
 const {grammar:g,words:v}=material(i);
 const practice=window.EJVariety?.curated(i)?window.EJVariety.practice(i):null;
 return Array.from({length:n},(_,k)=>{
  const a=(k+Math.floor(i/6))%v.length;
  if(k%2===0){
   const chosen=v[a],alternatives=pickOtherWords(i,chosen,2);
   const opts=shuffle3([chosen.en,...alternatives.map(x=>x.en)],i*29+k);
   return ['Выбери перевод изученного слова «'+chosen.ru+'».',opts,opts.indexOf(chosen.en)];
  }
  const target=practice?practice[Math.floor(k/2)%2]:window.EJLanguageContract.auditedPrompt(g[(k+i)%g.length]);
  const candidates=practice?
   [...practice.slice(0,2).map(x=>x.en),...g.map(x=>x.en),...v.map(x=>x.en)]:
   [target.en,...g.filter(x=>x.en!==target.en).map(x=>x.en)];
  const distinct=[target.en,...candidates.filter(x=>x!==target.en&&x!==practice?.[2]?.en)];
  const opts=shuffle3([...new Set(distinct)].slice(0,3),i*31+k);
  if(opts.length<3)throw Error('Недостаточно изученных вариантов в уроке '+i);
  return ['Выбери английский перевод фразы «'+target.ru+'»',opts,opts.indexOf(target.en)];
 });
}
function reading(i){
 if(window.EJVariety?.curated(i)){
  // Reading uses two already practised sentences and a dedicated read-only model.
  // The later free-writing answer must NOT be visible in this earlier stage.
  const lines=window.EJVariety.readingModels(i);
  const q=lines.map((model,j)=>{
   const options=shuffle3(lines.map(x=>x.ru),i*23+j);
   return {q:'Что означает предложение '+(j+1)+' из текста?',options,answer:options.indexOf(model.ru)};
  });
  return {kind:'Читаем знакомые конструкции в новом контексте',
   text:lines.map(x=>x.en).join(' '),questions:q};
 }
 const {grammar:g}=material(i);
 const rotated=g.map((_,j)=>window.EJLanguageContract.auditedPrompt(g[(i+j)%g.length]));
 const intro=rotated.map(x=>x.en).join(' ');
 const q=rotated.map((model,j)=>{
  const opts=shuffle3(g.map(x=>window.EJLanguageContract.auditedPrompt(x).ru),i*23+j);
  return {q:'Что означает предложение '+(j+1)+' из текста?',options:opts,answer:opts.indexOf(model.ru)};
 });
 return {kind:'Чтение изученных предложений',text:intro,questions:q};
}
function dialogues(i){
 const {grammar:g,words:v}=material(i);
 const practice=window.EJVariety?.curated(i)?window.EJVariety.practice(i):null;
 const branches=[{title:'Разговор: изученные слова',turns:[]},{title:'Разговор: изученные фразы',turns:[]}];
 for(let k=0;k<2;k++){
  const a=v[(i+k)%v.length],b=v[(i+k+2)%v.length],other=v[(i+k+4)%v.length];
  const opts=shuffle3([a.en,b.en,other.en],i*17+k);
  branches[0].turns.push({lead:'Собеседник просит назвать по-английски: «'+a.ru+'».',
   leadRu:'Тебе нужно ответить только словом или выражением из уже пройденных карточек.',
   choices:opts,correct:opts.indexOf(a.en),answer:a.en});
  const target=practice?practice[k]:window.EJLanguageContract.auditedPrompt(g[(i+k)%g.length]);
  const others=practice?
   [...practice.slice(0,2).map(x=>x.en),...g.map(x=>x.en),...v.map(x=>x.en)]:
   g.filter(x=>x.en!==target.en).map(x=>x.en);
  const choices=[target.en,...new Set(others.filter(x=>x!==target.en&&x!==practice?.[2]?.en))].slice(0,3);
  const options=shuffle3(choices,i*19+k);
  branches[1].turns.push({lead:'Собеседник просит выразить по-английски: «'+target.ru+'».',
   leadRu:'Используй одну из трёх конструкций, показанных в разделе теории.',
   choices:options,correct:options.indexOf(target.en),answer:target.en});
 }
 return branches;
}
const existingQlist=qlist,existingSkillItem=skillItem,existingTheory=theoryPane,
 existingReadPane=skillReadingPane,existingLesson=lesson;
qlist=function(u,day,profile){
 const w=courses.indexOf(u);
 const i=(w>=0?w:Math.floor(dayFocus/6))*6+day;
 const count=PROFILES[profile]?.questions||4;
 return choiceQuiz(i,count);
};
skillItem=function(){
 const i=dayFocus,s=SKILLS_DATA[Math.floor(i/6)];
 return {...s,reading:reading(i),dialogues:dialogues(i)};
};
function teachPanel(i,u){
 if(window.EJVariety?.curated(i)){
  const expected=new Set(window.EJVariety.weekModels(i).map(x=>window.EJVariety.normalized(x.en)));
  const examples=(u.examples||[]).filter(pair=>!expected.has(window.EJVariety.normalized(pair[0]))).slice(0,2);
  return '<div class="known-models"><h4>Как строить новые предложения</h4>'+
   '<p>Сначала изучи правило и карточки. Затем самостоятельно соедини ЗНАКОМЫЕ части. '+
   'Полных ответов из упражнений здесь нет.</p>'+
   '<div class="notes">'+esc(window.EJVariety.teachingNotes[Math.floor(i/6)])+'</div>'+
   (examples.length?'<h4>Разобранные примеры — другие, чем в упражнениях</h4>'+
   examples.map(pair=>'<div class="ex"><b lang="en">'+esc(pair[0])+'</b><span>'+esc(pair[1])+'</span></div>').join(''):'')+
   '<p class="tiny">ВОПРОС: переставь вспомогательный глагол в начало. '+
   'Утверждение: начни с того, о ком говоришь. Слова для всех ответов уже объяснены.</p></div>';
 }
 const rows=models(i).map(m=>window.EJLanguageContract.auditedPrompt(m));
 const expected=new Set(rows.map(x=>x.en.replace(/[.!?]+$/,'').toLowerCase()));
 const safeExamples=(u.examples||[]).filter(pair=>!expected.has(String(pair[0]||'').replace(/[.!?]+$/,'').trim().toLowerCase())).slice(0,2);
 const exampleSection=safeExamples.length?'<h4>Другие примеры (не готовые ответы)</h4>'+
  safeExamples.map(ex=>'<div class="ex"><b lang="en">'+esc(ex[0])+'</b><span lang="ru">'+esc(ex[1])+'</span></div>').join(''):'';
 const disassembled=rows.map((m,j)=>{
  const words=m.en.replace(/[.!?]+$/,'').split(/\s+/);
  let shuffled=words.slice();
  if(shuffled.length>1){const k=(i+j)%shuffled.length+1;shuffled=shuffled.slice(k).concat(shuffled.slice(0,k));}
  if(shuffled.join(' ').toLowerCase()===words.join(' ').toLowerCase())shuffled.reverse();
  const descriptor=m.type==='question'?
   'ВОПРОС: вспомогательный глагол → подлежащее → остальное → ?':
   m.type==='imperative'?'ЗАПРЕТ / ПОБУЖДЕНИЕ: отрицание или команда → действие → .':
   'УТВЕРЖДЕНИЕ: подлежащее → глагол / связка → дополнение → .';
  return '<div class="teaching-builder"><b>Модель '+(j+1)+': '+descriptor+'</b>'+
   '<p>Значение по-русски: <strong>'+esc(m.ru)+'</strong></p>'+
   '<p class="tiny">Слова даны НЕ в правильном порядке; составь английскую фразу сам:</p>'+
   '<div class="teaching-tokens" aria-label="Изученные слова конструкции">'+
   shuffled.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div></div>';
 }).join('');
 return '<div class="known-models"><h4>Сначала правило и смысл — затем самостоятельный ответ</h4>'+
  '<p>Здесь нет готовых английских ответов. Прочитай объяснение, примеры другой формулировки и изучи нужные слова. '+
  'При проверке самостоятельно расставь слова в нужном порядке. <b>Вопрос и утверждение — разные конструкции!</b></p>'+
  exampleSection+disassembled+'</div>';
}
function hideAnswers(text,models){
 let s=String(text||'');
 for(const m of models){
  const clean=String(m.en).replace(/[.!?]+$/,'').trim();
  if(clean.length<8)continue;
  const rx=new RegExp(clean.replace(/[^a-zA-Z0-9 ]/g,'\\$&'),'gi');
  s=s.replace(rx,'[пример разбирается ниже]');
 }
 return s;
}
theoryPane=function(u,day,r){
 const original=existingTheory(u,day,r),marker='<div class="skill-section">';
 const at=original.indexOf(marker);
 if(at<0)throw Error('Не найден блок упражнения: недоступно для проверки');
 let teaching=original.slice(0,at),practice=original.slice(at);
 const start=teaching.indexOf('<h4>Примеры</h4>');
 const next=teaching.indexOf('<p class="disclaimer">',start);
 if(start<0||next<start)throw Error('Нет отдельного блока учебных примеров');
 teaching=teaching.slice(0,start)+teaching.slice(next);
 teaching=hideAnswers(teaching,window.EJVariety?.curated(dayFocus)?window.EJVariety.weekModels(dayFocus):models(dayFocus));
 return teaching+teachPanel(dayFocus,u)+practice;
};
skillReadingPane=function(r){
 return existingReadPane(r)
  .replace('📖 Читаем настоящий бытовой текст','📖 Читаем только уже изученные фразы')
  .replace('Прочитай текст и ответь на три вопроса о фактах, а не о переводе отдельных фраз.',
   'Здесь только три английских предложения из только что изученного правила. Прочитай и выбери их смысл по-русски. Новые незнакомые слова не требуются.');
};
skillDialogPane=function(r){
 const s=ejSkills(r).dialogue,b=skillItem().dialogues;
 const path=Number.isInteger(s.path)?s.path:dayFocus%2;
 const branch=b[path],ix=Number(s.turn)||0;
 const header='<div class="skill-section"><h3>🗣️ Практика изученных реплик</h3>'+
 '<p class="tiny">Никаких неизвестных реплик. Только слова с карточек и предложения из теории. Это учебная практика, не экзамен на спонтанный диалог.</p>'+
 '<div class="skill-paths">'+b.map((v,j)=>'<button class="outline '+(j===path?'skill-active':'')+
 '" data-dialog-path="'+j+'">'+esc(v.title)+'</button>').join('')+'</div>';
 if(s.passed)return header+'<div class="donebanner">✓ Обе изученные реплики проверены.</div></div>';
 if(ix>=branch.turns.length)return header+'</div>';
 const turn=branch.turns[ix];
 return header+'<div class="skill-question"><div class="qcounter">Реплика '+(ix+1)+
 ' из 2</div><b>'+esc(turn.lead)+'</b><div class="course-meaning"><b>Что требуется:</b> '+
 esc(turn.leadRu)+'</div><div class="skill-choicegrid">'+turn.choices.map((value,j)=>
 '<button class="choice" data-dialog-answer="'+j+'">'+String.fromCharCode(65+j)+'. '+esc(value)+'</button>').join('')+
 '</div></div>'+(s.lastWrong?'<div class="result error">Ответ не совпал с изученной моделью. Посмотри ещё раз карточки или три примера теории.</div>':'')+
 '</div>';
};
// In-progress answer indices from pre-13.7 might refer to totally different questions.
// Preserve all completed stages and the saved history, reset only unfinished drafts.
lesson=function(){
 const r=record(dayFocus);
 if(r.prerequisiteAlignedV!==VERSION){
  if(!r.steps[0]){
   const sk=ejSkills(r);
   sk.grammar.answers={};sk.grammar.passed=false;
  }
  if(!r.steps[4]){
   r.writingAnswers={};r.writingDrafts={};r.writingValidated=false;
  }
  if(!r.steps[3]){
   r.quizDraft={};
   const sk=ejSkills(r);
   sk.quizPassed=false;
   sk.reading.answers={};sk.reading.passed=false;delete sk.reading.lastScore;
   if(!r.steps[4]){
    sk.dialogue.path=dayFocus%2;sk.dialogue.turn=0;sk.dialogue.passed=false;sk.dialogue.lastWrong=false;
   }
  }
  r.prerequisiteAlignedV=VERSION;save();
 }
 return existingLesson();
};
function reviewTask(debt){
 const i=Math.min(total-1,Math.max(0,Number(debt.lesson)||0)),data=material(i),rev=Math.max(0,Number(debt.revision)||0);
 const prefix={vocabulary:'Вспомни другое слово из карточек этого урока',
  grammar:'Переведи другое изученное предложение',writing:'Закрепи слово или фразу из этого урока',
  quiz:'Повтори изученное без подсказки',reading:'Проверь смысл знакомого предложения',
  dialogue:'Проверь знакомую реплику'}[debt.kind]||'Закрепи изученное';
 const prev=String(debt.ref),g=data.grammar,v=data.words;
 if(debt.kind==='vocabulary'||(debt.kind==='writing'&&/^[012]$/.test(prev))||
    (debt.kind==='writing'&&prev==='text')){
  const excluded=debt.kind==='vocabulary'?prev:v[Number(prev)]?.id||'';
  const list=v.filter(w=>w.id!==excluded);
  const row=list[(i+rev)%list.length];
  return {mode:'text',kind:'vocabulary',label:prefix,
   body:'Переведи на английский: «'+esc(row.ru)+'»',expected:row.en};
 }
 if(debt.kind==='grammar'||(debt.kind==='writing'&&prev==='3')){
  const origin=debt.kind==='writing'?(i%6+2)%g.length:(i%6+Number(prev))%g.length;
  const alternatives=g.filter(x=>x.en!==g[origin].en);
  const target=alternatives[rev%alternatives.length];
  return {mode:'text',kind:'grammar',label:prefix,
   body:'Переведи на английский: «'+esc(target.ru)+'»',expected:target.en};
 }
 if(debt.kind==='quiz'){
  const bank=choiceQuiz(i,6);
  const original=Math.max(0,Number(prev)||0);
  const selected=bank[(original+1+rev)%(bank.length)];
  return {mode:'choice',label:prefix,body:selected[0],
   options:selected[1].map((value,k)=>({value,correct:k===selected[2]}))};
 }
 if(debt.kind==='reading'){
  const bank=reading(i),selected=bank.questions[(Math.max(0,Number(prev)||0)+1+rev)%3];
  return {mode:'choice',label:prefix,body:bank.text+' \n\n'+selected.q,
   options:selected.options.map((value,k)=>({value,correct:k===selected.answer}))};
 }
 if(debt.kind==='dialogue'){
  const all=dialogues(i).flatMap(b=>b.turns),selected=all[(Math.max(0,Number(prev)||0)+1+rev)%all.length];
  return {mode:'choice',label:prefix,body:selected.lead,
   options:selected.choices.map((value,k)=>({value,correct:k===selected.correct}))};
 }
 throw Error('Нет изученного примера для обязательного закрепления');
}
window.EJPrerequisites={
 words,models,quizFor:choiceQuiz,reading,dialogues,reviewTask,
 // Automated audit: any task must come from a previously explained, exact model.
 validateLesson(i){
  const d=material(i),quiz=choiceQuiz(i,6),read=reading(i),dialog=dialogues(i);
  const known=new Set([...d.words.map(x=>x.en),...d.grammar.map(x=>x.en),
   ...(window.EJVariety?.curated(i)?window.EJVariety.practice(i).map(x=>x.en):[])]);
  const quizSafe=quiz.every(q=>q[2]>=0&&q[1].length===3&&q[1].every(option=>known.has(option)));
  const expectedReading=window.EJVariety?.curated(i)?window.EJVariety.readingModels(i):d.grammar;
  const readingSafe=read.questions.every(q=>q.answer>=0&&
   q.options.every(x=>expectedReading.some(m=>m.ru===x)));
  const dialogueSafe=dialog.every(b=>b.turns.length===2&&b.turns.every(t=>
   t.correct>=0&&t.choices.every(option=>known.has(option))));
  const reviews=['vocabulary','grammar','writing','quiz','reading','dialogue'].map(kind=>
   reviewTask({lesson:i,kind,ref:kind==='vocabulary'?d.words[0].id:'0',revision:0}));
  const writingSafe=words(i).slice(0,3).every(x=>known.has(x.en))&&d.grammar.some(x=>known.has(x.en));
  const reviewSafe=reviews.every(task=>task.mode==='choice'?
   task.options.length===3&&task.options.every(x=>known.has(x.value)||d.grammar.some(g=>g.ru===x.value)||expectedReading.some(g=>g.ru===x.value)):
   known.has(task.expected));
  const punctuationSafe=d.grammar.every(m=>{const c=window.EJLanguageContract.auditedPrompt(m);return c.en===m.en&&c.ru===m.ru&&((c.type==='question')===c.ru.endsWith('?'));});
  const assessed=window.EJVariety?.curated(i)?window.EJVariety.weekModels(i):d.grammar;
  const answersNotLeaked=assessed.every(m=>!teachPanel(i,courses[Math.floor(i/6)]).includes('>'+m.en+'<'));
  return {ok:quizSafe&&readingSafe&&dialogueSafe&&writingSafe&&reviewSafe&&punctuationSafe&&answersNotLeaked,quizSafe,readingSafe,dialogueSafe,writingSafe,reviewSafe,punctuationSafe,answersNotLeaked};
 }
};
})();