/* English Journey 12 — fully self-guided learning; listening is OPTIONAL in lessons,
 * topic checkpoints and CEFR-inspired internal level exams. No teacher needed.
 * Listening diagnostics are reported separately and never block progression.
 * This does NOT award or certify an official CEFR level.
 */
(function(){
 'use strict';
 const originalRecord=record;
 const originalCheckpointPage=checkpointPage;
 const originalExamPage=examPage;
 const originalWire=wire;
 const originalTestMarkup=testChoiceMarkup;
 const originalLabRender=render;
 const MODE_WEEKS={A1:[0,12],A1_full:[12,25],A2:[25,50],B1:[50,100]};
 const PRODUCTION_MIN=3;
 STAGE_NAMES[2]='Аудио (по желанию)';
 labelDays[2]='Дополнительное аудирование';

 // Preserve the five-element record schema and the old progress key.
 // Listening no longer consumes a mandatory course step. Old finished lessons stay finished.
 function makeListeningOptional(r){
  if(!r||!Array.isArray(r.steps)||r.steps.length!==5||r.doneAt)return false;
  let dirty=false;
  if(!r.steps[2]){r.steps[2]=true;dirty=true;}
  if(r.steps.every(Boolean)&&!r.doneAt){
   r.doneAt=new Date().toISOString();const date=dateYMD(new Date());
   store.history[date]=(store.history[date]||0)+1;dirty=true;
  }
  return dirty;
 }
 let migrated=false;
 for(const r of Object.values(store.logs||{}))migrated=makeListeningOptional(r)||migrated;
 if(migrated)save();
 record=function(i){const r=originalRecord(i);if(makeListeningOptional(r))save();return r;};

 // Topic checks now examine grammar, active vocabulary and reading. None requires sound.
 newTopicAttempt=function(w){
  const rec=testsFor(w),attemptNumber=rec.attempts.length;
  const random=prng(seedHash(`selfguided-topic-${w}-${attemptNumber}-${dateYMD(new Date())}`));
  const pool=topicBank(w);
  const take=(kind,n,check=()=>true)=>shuffleItems(pool.filter(q=>q.type===kind&&check(q)),random).slice(0,n);
  const chosen=[...take('grammar',5),...take('vocabulary',4),...take('reading',3,q=>Boolean(q.passage))];
  if(chosen.length!==12)throw new Error(`Тема ${w+1}: недостаточно текстовых вопросов (${chosen.length}/12).`);
  const questions=shuffleItems(chosen,random).map(q=>{
   const correct=q.options[q.answer],options=shuffleItems(q.options,random);
   return {...q,options,answer:options.indexOf(correct)};
  });
  rec.current={date:dateYMD(new Date()),questions,answers:{},startedAt:new Date().toISOString()};save();return rec.current;
 };
 function scoreWithoutListening(qs,answers){
  const bySkill={grammar:0,vocabulary:0,reading:0,listening:0};
  const totals={grammar:0,vocabulary:0,reading:0,listening:0};
  let score=0,required=0;
  qs.forEach((q,i)=>{
   if(Object.prototype.hasOwnProperty.call(totals,q.type))totals[q.type]++;
   const ok=Number(answers[i])===q.answer;
   if(ok&&Object.prototype.hasOwnProperty.call(bySkill,q.type))bySkill[q.type]++;
   if(q.type!=='listening'){required++;if(ok)score++;}
  });
  return {score,required,bySkill,totals};
 }
 submitTopic=function(){
  const task=nextTask();if(task.type!=='topic')return;
  const w=task.week,rec=testsFor(w),cur=rec.current;
  if(!cur||Object.keys(cur.answers).length!==cur.questions.length)return;
  const result=scoreWithoutListening(cur.questions,cur.answers);
  const mistakes=cur.questions.filter((q,i)=>q.type!=='listening'&&Number(cur.answers[i])!==q.answer)
   .map(q=>({id:q.id,type:q.type,prompt:q.prompt,correct:q.options[q.answer],review:q.review}));
  const readingMin=Math.min(result.totals.reading,2);
  const passed=result.score>=Math.ceil(result.required*.8)&&result.bySkill.reading>=readingMin;
  rec.attempts.push({on:new Date().toISOString(),score:result.score,total:result.required,passed,bySkill:result.bySkill,
   audioOptional:true,weakTags:[...new Set(mistakes.map(q=>q.type))]});
  rec.lastMistakes=mistakes;rec.lastScore=result.score;rec.current=null;
  if(passed){rec.passedAt=new Date().toISOString();rec.retryAfter=null;message='Тема зачтена! Аудирование можно тренировать отдельно.';}
  else{rec.retryAfter=nextLocalDay();createRemediation(w,rec);message='Тема пока не зачтена: повтори слабые места и пересдай завтра.';}
  save();render();
 };
 checkpointPage=function(){
  return originalCheckpointPage()
   .replace('12 вопросов: грамматика, слова, понимание текста и реального аудио. Нужно минимум 10 верных ответов, включая правильные ответы по чтению и аудированию.',
    '12 вопросов: грамматика, словарь и чтение. Для новой попытки требуется не менее 10/12 правильных и не менее 2/3 по чтению. Аудио — только дополнительная практика.')
   .replace('12 вопросов: грамматика, слова, понимание текста и реального аудио',
    '12 вопросов: грамматика, слова и понимание прочитанного');
 };

 // Existing remediation retries may contain previously mandatory listening prompts.
 const originalRemediation=createRemediation;
 createRemediation=function(week,rec){
  const clean=(rec.lastMistakes||[]).filter(q=>q.type!=='listening');
  const previous=rec.lastMistakes;rec.lastMistakes=clean;
  try{originalRemediation(week,rec);}finally{rec.lastMistakes=previous;}
 };
 submitRemediation=function(){
  const task=nextTask();if(task.type!=='topic')return;
  const rec=testsFor(task.week),r=rec.remediation;
  if(!r||r.passedAt||Object.keys(r.answers).length!==r.questions.length)return;
  const result=scoreWithoutListening(r.questions,r.answers);r.retries++;
  if(result.score>=Math.ceil(result.required*.8))r.passedAt=new Date().toISOString();
  else{
   const rand=prng(seedHash(`selfguided-remedy-${task.week}-${rec.attempts.length}-${r.retries}`));
   r.questions=r.questions.map(q=>{const correct=q.options[q.answer],options=shuffleItems(q.options,rand);return {...q,options,answer:options.indexOf(correct)};});
   r.answers={};
  }
  save();render();
 };

 // Earliest baseline A1 exams and advanced A2/B1 exams share one transparent scoring rubric.
 function skipUnansweredAudio(cur){
  if(!cur?.questions||!cur.answers)return false;
  let changed=false;
  cur.questions.forEach((q,i)=>{if(q.type==='listening'&&cur.answers[i]===undefined){cur.answers[i]=-1;changed=true;}});
  return changed;
 }
 const originalNewFinalAttempt=newFinalAttempt;
 newFinalAttempt=function(){const cur=originalNewFinalAttempt();if(skipUnansweredAudio(cur))save();return cur;};
 function productionFor(mode,attempt){
  const bounds=MODE_WEEKS[mode]||[0,12],rand=prng(seedHash(`selfguided-production-${mode}-${attempt}`));
  return shuffleItems(Array.from({length:bounds[1]-bounds[0]},(_,i)=>bounds[0]+i),rand).slice(0,4)
   .map(w=>{const a=SKILLS_DATA[w].grammar;const q=a[Math.floor(rand()*a.length)];return {week:w,ru:q.ru,en:q.en};});
 }
 function ensureProduction(cur,mode,attempt){
  if(!Array.isArray(cur.production)||cur.production.length!==4)cur.production=productionFor(mode,attempt);
  if(!cur.productionAnswers||typeof cur.productionAnswers!=='object')cur.productionAnswers={};
 }
 function canSubmit(cur){
  return Boolean(cur&&cur.part===1&&cur.questions&&Object.keys(cur.answers||{}).length===cur.questions.length&&
   cur.production?.length===4&&cur.production.every((_,i)=>String(cur.productionAnswers?.[i]||'').trim()));
 }
 function selfExamMarkup(qs,answers,kind,offset=0){
  // Retain established question markup and add an explicit 'skip' control to every audio item.
  const totalItems=kind==='exam'?36:qs.length;
  return qs.map((q,i)=>{
   const idx=i+offset,selected=answers[idx];
   return `<div class="questiongroup assessment-q"><div class="qcounter">Вопрос ${idx+1} из ${totalItems} · ${q.type==='listening'?'Аудирование (необязательно)':q.type==='reading'?'Чтение':q.type==='vocabulary'?'Слова':'Грамматика'}</div>`+
    (q.passage?`<div class="reading-source assessment-text" lang="en">${esc(q.passage)}</div>`:'')+
    (q.audioUrl?`<div class="audio-resource"><a href="${esc(q.audioUrl)}" target="_blank" rel="noopener noreferrer">▶ Открыть запись: ${esc(q.audioTitle||'Источник')} ↗</a></div>`:'')+
    `<div class="question">${esc(q.prompt)}</div>`+
    (q.spoken?`<button class="sound" data-assess-speak="${idx}">▶ Прослушать фразу</button><div class="tiny">Звук синтезируется браузером, не является записью живого человека.</div>`:'')+
    q.options.map((opt,j)=>`<button class="choice ${selected===j?'answer-selected':''}" data-${kind}-answer="${idx}:${j}" aria-pressed="${selected===j}">${String.fromCharCode(65+j)}. ${esc(opt)}</button>`).join('')+
    (q.type==='listening'?`<button class="outline" data-${kind}-answer="${idx}:-1" ${Number(selected)===-1?'aria-pressed="true"':''}>${Number(selected)===-1?'✓ Аудио пропущено без штрафа':'Пропустить аудирование — без штрафа'}</button>`:'')+
    `</div>`;
  }).join('');
 }
 testChoiceMarkup=selfExamMarkup;

 function productionMarkup(cur){return `<div class="writing"><h3>Самостоятельные ответы — автоматически проверяемые</h3>
  <p>Составь четыре английских предложения по русским подсказкам. Для зачёта нужно минимум три точных варианта из четырёх. Допускаются различия в пунктуации и регистре; синонимы могут пока не распознаваться.</p>
  ${cur.production.map((q,i)=>`<div class="skill-question"><b>${i+1}. ${esc(q.ru)}</b><div class="skill-inputrow"><input type="text" data-exam-production="${i}" value="${esc(cur.productionAnswers[i]||'')}" spellcheck="false" autocomplete="off" placeholder="Напиши английскую фразу"></div></div>`).join('')}
  </div>`;}
 examPage=function(){
  const mode=examMode(),before=examRecord();
  if(before.current&&skipUnansweredAudio(before.current))save();
  const html=originalExamPage(),rec=examRecord(),cur=rec.current;
  if(cur)ensureProduction(cur,mode,rec.attempts?.length||0);
  let result=html;
  if(cur?.part===1&&(mode==='A1'||mode==='A1_full')){
   const marker='<div class="writing"><h3>Короткое письмо';
   if(result.includes(marker))result=result.replace(marker,productionMarkup(cur)+marker);
  }
  result=result.replace(/36 вопросов \(грамматика, слова, чтение и аудирование\) с порогом 80% и минимум 4 из 6 в чтении и аудировании\./g,
    '30 обязательных вопросов (грамматика, словарь, чтение) и 6 необязательных на слух. Для зачёта нужно 24/30, отдельно 8/12 грамматика, 8/12 словарь, 4/6 чтение и 3/4 самостоятельно составленных предложений.')
   .replace(/Всего 36 вопросов: 12 грамматика, 12 словарь, 6 чтение и 6 аудирование \+ 4 самостоятельно составленных предложения\. Нужно не менее 29\/36, 8\/12 по грамматике и словам, 4\/6 по чтению и аудированию, 3\/4 по составлению предложений\./g,
    '30 обязательных вопросов: 12 грамматика, 12 словарь, 6 чтение + 4 самостоятельно составленных предложения; 6 вопросов на слух — дополнительно, можно пропустить без штрафа. Для зачёта: 24/30, минимум 8/12 грамматика, 8/12 словарь, 4/6 чтение и 3/4 самостоятельных ответов.')
   .replace(/Отметка ниже подтверждает лишь выполнение упражнения, а не качество речи\./g,'Произношение можно тренировать добровольно; оно не влияет на сдачу этого экзамена.')
   .replace(/письмо и говорение — самопроверка/g,'письмо и говорение — добровольная практика')
   .replace(/письменное и устное упражнение для самопроверки/g,'самостоятельные ответы с автоматической проверкой');
  if(rec.passedAt&&rec.lastScore!=null&&rec.attempts?.at(-1)?.automatic)result=result.replace(`${rec.lastScore}/36`,`${rec.lastScore}/30 по обязательным заданиям`);
  result+=`<div class="panel"><h3>🎧 Аудирование — дополнительная диагностика</h3>
   <p>В каждом экзамене есть шесть добровольных вопросов на слух. Их можно пропустить: это <b>не снижает оценку и не закрывает следующий уровень</b>. Для тренировки на записях живых людей доступен отдельный практикум British Council. Все результаты фиксируются автоматически.</p>
   <button class="outline" data-page="authentic-lab">Живые записи и автоматическая проверка →</button></div>`;
  return result;
 };
 submitExam=function(){
  const mode=examMode(),rec=examRecord(),cur=rec.current;
  if(!canSubmit(cur))return;
  const result=scoreWithoutListening(cur.questions,cur.answers);
  const productiveScore=cur.production.reduce((n,q,i)=>n+(normalizeGrammar(q.en)===normalizeGrammar(cur.productionAnswers[i])?1:0),0);
  const bad=cur.questions.filter((q,i)=>q.type!=='listening'&&Number(cur.answers[i])!==q.answer).map(q=>({id:q.id,type:q.type,prompt:q.prompt,correct:q.options[q.answer],review:q.review}));
  for(let i=0;i<cur.production.length;i++)if(normalizeGrammar(cur.production[i].en)!==normalizeGrammar(cur.productionAnswers[i])){
   bad.push({type:'production',prompt:cur.production[i].ru,correct:cur.production[i].en});
  }
  const passed=result.score>=24&&result.bySkill.grammar>=8&&result.bySkill.vocabulary>=8&&
   result.bySkill.reading>=4&&productiveScore>=PRODUCTION_MIN;
  rec.attempts.push({on:new Date().toISOString(),score:result.score,total:result.required,bySkill:result.bySkill,
   listeningDiagnostics:{correct:result.bySkill.listening,total:result.totals.listening,skipped:cur.questions.filter((q,i)=>q.type==='listening'&&Number(cur.answers[i])===-1).length},
   productiveScore,passed,automatic:true,externalVerificationRequired:true,writing:cur.writing||''});
  rec.lastScore=result.score;rec.lastMistakes=bad;rec.current=null;
  if(passed){rec.passedAt=new Date().toISOString();rec.retryAfter=null;
   message=`Внутренний экзамен ${mode} сдан. Аудирование не влияло на результат; это не официальный сертификат CEFR.`;}
  else{rec.retryAfter=nextLocalDay();message='Экзамен пока не сдан. Разбор ошибок сохранён; повторная попытка завтра.';}
  save();render();
 };
 wire=function(){
  originalWire();
  const button=document.querySelector('[data-exam-submit]');
  if(!button)return;
  const update=()=>{const cur=examRecord().current;button.disabled=!canSubmit(cur);};
  document.querySelectorAll('[data-exam-production]').forEach(el=>el.addEventListener('input',()=>{
   const rec=examRecord(),cur=rec.current;if(!cur)return;
   ensureProduction(cur,examMode(),rec.attempts?.length||0);
   cur.productionAnswers[Number(el.dataset.examProduction)]=el.value;save();update();
  }));
  const writing=document.getElementById('exam-writing');
  if(writing)writing.addEventListener('input',update);
  const speaking=document.getElementById('exam-speaking');
  if(speaking)speaking.addEventListener('change',update);
  update();
 };

 // Postprocess the supplementary lab interface: no handoff to a teacher is needed.
 render=function(){
  originalLabRender();
  if(page!=='authentic-lab')return;
  const root=document.getElementById('root');if(!root)return;
  const copy=root.querySelector('[data-lab-copy]');if(copy)copy.textContent='Скопировать мои ответы (необязательно)';
  const panels=root.querySelectorAll('.panel');
  for(const panel of panels){
   if(panel.textContent.includes('Независимая проверка у экзаменатора')){
    panel.innerHTML='<h3>Автоматическая самостоятельная практика</h3><p>Все упражнения здесь проверяются программой — преподаватель не нужен. Диктовка работает только в поддерживаемых браузерах, а ввод текста доступен всегда. Оценка является тренировочной и не заменяет официальный экзамен CEFR.</p>';
   }
  }
 };

 // Announce version in the settings/update mechanism without changing storage schema.
 if(typeof console!=='undefined')console.info('English Journey self-guided assessment enabled; listening is optional.');
 render();
})();