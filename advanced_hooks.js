/* English Journey v11 — complete A2/B1 learning route and gated internal assessments.
 * Uses existing localStorage and the same data schema. No legacy progress reset.
 * NOTE: TTS comprehension ≠ authentic natural speech or CEFR certification.
 */
(function(){
 const BASE_AUDIO_PANE=skillAudioPane;
 const BASE_SKILL_HANDLERS=skillsHandlers;
 const BASE_TOPIC_BANK=topicBank;
 const BASE_EXAM_MODE=examMode;
 const BASE_GENERATE_FINAL=generateFinalQuestions;
 const BASE_EXAM_PAGE=examPage;
 const BASE_SUBMIT_EXAM=submitExam;
 const BASE_BANNER=assessmentBanner;
 const BASE_ROADMAP=roadmap;
 const BASE_COURSE=course;
 const BASE_DASHBOARD=vocabularyDashboard;
 const BASE_WIRE=wire;
 const BASE_FINAL_INFO={A2:{start:25,end:50,display:'A2'},B1:{start:50,end:100,display:'B1'}};
 const OLD_WEEKS=31;
 function productionItems(mode,attempt){
  const {start,end}=BASE_FINAL_INFO[mode],random=prng(seedHash(`production-${mode}-${attempt}-${dateYMD(new Date())}`));
  const weeks=shuffleItems(Array.from({length:end-start},(_,i)=>start+i),random).slice(0,4);
  return weeks.map(w=>{const row=SKILLS_DATA[w].grammar[Math.floor(random()*2)];return {week:w,ru:row.ru,en:row.en};});
 }
 function ensureProduction(cur,mode,attempt){
  if(!Array.isArray(cur.production)||cur.production.length!==4)cur.production=productionItems(mode,attempt);
  if(!cur.productionAnswers||typeof cur.productionAnswers!=='object')cur.productionAnswers={};
  return cur.production;
 }
 if(courses.length!==100||SKILLS_DATA.length!==100||VOCAB_EXTRA.length!==100){
  console.error('English Journey: data count mismatch; advanced upgrade disabled.',courses.length,SKILLS_DATA.length);
  return;
 }
 LEVEL_GOALS.splice(0,LEVEL_GOALS.length,
  {level:'A1',title:'Базовое общение',details:'Понимание простых сообщений, основные грамматические конструкции и путешествия.',weeks:25,units:150,label:'≈ 6 месяцев',available:true},
  {level:'A2',title:'Практика повседневного общения',details:'Реальные бытовые ситуации, поездки, вопросы и объяснения.',weeks:50,units:300,label:'≈ 12 месяцев',available:true},
  {level:'B1',title:'Связное независимое общение',details:'Аргументация, повествование, сложные поездки и обсуждение решений.',weeks:100,units:600,label:'≈ 23 месяца',available:true});

 nextTask=function(){
  for(let w=0;w<courses.length;w++){
   if(w===12&&!store.exams.A1?.passedAt)return {type:'exam',level:'A1'};
   if(w===25&&!store.exams.A1_full?.passedAt)return {type:'exam',level:'A1_full'};
   if(w===50&&!store.exams.A2?.passedAt)return {type:'exam',level:'A2'};
   if(daysReady(w)&&!store.checkpoints[String(w)]?.passedAt)return {type:'topic',week:w};
   if(!daysReady(w))return {type:'lesson',index:nextIndex()};
  }
  if(!store.exams.B1?.passedAt)return {type:'exam',level:'B1'};
  return {type:'completed',level:'B1'};
 };
 examMode=function(){
  const t=nextTask();if(t.type==='exam')return t.level;
  if(doneCount()>=600)return 'B1';
  if(doneCount()>=300)return 'A2';
  return BASE_EXAM_MODE();
 };

 // Exercises in the new sections use clearly disclosed synthetic speech. Existing
 // A1 and first six A2 units keep their real publisher-hosted audio exercises.
 skillAudioPane=function(r){
  const w=Math.floor(dayFocus/6);
  if(w<OLD_WEEKS)return BASE_AUDIO_PANE(r);
  const a=skillItem().audio,s=ejSkills(r).listening;
  return `<div class="split"><span class="pill">Шаг 3 · аудирование ~9 минут</span>${r.steps[2]?'✅ Готово':''}</div>
   <h3>🎧 Понимание английской речи</h3><p>Прослушай сценарий без чтения текста. Ответь на два вопроса по месту и времени. При ошибке можно прослушать снова.</p>
   <div class="audio-resource"><b>${esc(a.title)}</b><p class="tiny"><b>Важно:</b> это озвучка браузера (TTS), а не запись живого носителя языка. Для полноценного уровня CEFR нужно дополнительно слушать людей с разными акцентами.</p>
   <button class="primary dark" type="button" data-real-audio="1">▶ ${s.opened?'Прослушать ещё раз':'Прослушать запись'}</button>
   <p class="tiny">Дополнительная практика с настоящей речью: <a href="${courses[w].resource}" target="_blank" rel="noopener noreferrer">British Council LearnEnglish, ${courses[w].level} ↗</a> (самостоятельное упражнение; вопросы ниже относятся только к озвученному сценарию).</p></div>
   ${s.passed?`<div class="donebanner">✓ Понимание проверено. ${nextButton(3)}</div>`:
    `${skillOptionsMarkup(a.questions,s.answers,'listening')}<button class="primary dark" data-skill-listening-submit="1" ${!s.opened||Object.keys(s.answers).length!==a.questions.length?'disabled':''}>Проверить услышанное</button>
    ${s.lastScore!==undefined?`<div class="result error">Верно: ${s.lastScore}/2. Для зачёта требуется 2/2.</div>`:''}`}`;
 };
 skillsHandlers=function(){
  BASE_SKILL_HANDLERS();
  if(Math.floor(dayFocus/6)<OLD_WEEKS||page!=='lesson')return;
  const button=document.querySelector('[data-real-audio]');if(!button)return;
  button.onclick=()=>{
   const s=ejSkills(record(dayFocus)).listening;
   if(!('speechSynthesis'in window)){
    alert('Озвучка недоступна в этом браузере. Попробуй Chrome или Edge, либо открой внешние материалы British Council.');return;
   }
   try{
    speechSynthesis.cancel();
    const utter=new SpeechSynthesisUtterance(skillItem().audio.script);
    utter.lang='en-GB';utter.rate=courses[Math.floor(dayFocus/6)].level==='B1'?.91:.79;
    button.disabled=true;button.textContent='Воспроизводится...';
    utter.onend=()=>{s.opened=true;save();if(page==='lesson')render()};
    utter.onerror=()=>{button.disabled=false;button.textContent='▶ Повторить попытку';};
    speechSynthesis.speak(utter);
   }catch(err){button.disabled=false;alert('Не удалось воспроизвести звук: '+err.message)}
  };
 };
 topicBank=function(w){
  const pool=BASE_TOPIC_BANK(w);
  if(w>=OLD_WEEKS){
   for(const q of pool)if(q.type==='listening'){
    q.spoken=SKILLS_DATA[w].audio.script;
    q.audioTitle='Синтезированная английская речь';
    delete q.audioUrl;
    q.review='Прослушай сценарий заново. Это голос браузера, не запись носителя.';
   }
  }
  return pool;
 };
 newTopicAttempt=function(w){
  const rec=testsFor(w),num=rec.attempts.length;
  const rand=prng(seedHash(`${w}::${num}::${dateYMD(new Date())}::topic`));
  const pool=topicBank(w);
  const pick=(type,n,condition=()=>true)=>shuffleItems(pool.filter(q=>q.type===type&&condition(q)),rand).slice(0,n);
  const qs=[...pick('grammar',4),...pick('vocabulary',4),...pick('reading',2,q=>Boolean(q.passage)),...pick('listening',2,q=>Boolean(q.spoken||q.audioUrl))];
  if(qs.length!==12)throw Error('Недостаточно упражнений для обязательного тематического зачёта '+w+': '+qs.length);
  const mixed=shuffleItems(qs,rand).map(q=>{const answer=q.options[q.answer],options=shuffleItems(q.options,rand);return {...q,options,answer:options.indexOf(answer)}});
  rec.current={date:dateYMD(new Date()),questions:mixed,answers:{},startedAt:new Date().toISOString()};save();return rec.current;
 };
 generateFinalQuestions=function(attempt,mode=examMode()){
  if(!BASE_FINAL_INFO[mode])return BASE_GENERATE_FINAL(attempt,mode);
  const {start,end}=BASE_FINAL_INFO[mode],rand=prng(seedHash(`${mode}-exam-${attempt}-${dateYMD(new Date())}`));
  const grammar=[],vocab=[],reading=[],listening=[];
  for(let w=start;w<end;w++){
   const questions=topicBank(w);
   const g=shuffleItems(questions.filter(q=>q.type==='grammar'),rand)[0];
   const v=shuffleItems(questions.filter(q=>q.type==='vocabulary'),rand)[0];
   const r=shuffleItems(questions.filter(q=>q.type==='reading'&&q.passage),rand)[0];
   const a=shuffleItems(questions.filter(q=>q.type==='listening'&&(q.spoken||q.audioUrl)),rand)[0];
   if(g)grammar.push(g);if(v)vocab.push(v);if(r)reading.push(r);if(a)listening.push(a);
  }
  const qs=[...shuffleItems(grammar,rand).slice(0,12),...shuffleItems(vocab,rand).slice(0,12),...shuffleItems(reading,rand).slice(0,6),...shuffleItems(listening,rand).slice(0,6)];
  if(qs.length!==36)throw Error('Экзамен '+mode+': нужны 36 независимых вопросов');
  return shuffleItems(qs,rand).map(q=>{const correct=q.options[q.answer],options=shuffleItems(q.options,rand);return {...q,options,answer:options.indexOf(correct)}});
 };
 wire=function(){
  BASE_WIRE();
  for(const [id,event] of [['exam-writing','oninput'],['exam-speaking','onchange']]){
   const el=document.getElementById(id);if(!el)continue;const prior=el[event];
   el[event]=function(e){if(prior)prior.call(this,e);const rec=examRecord(),cur=rec.current,submit=document.querySelector('[data-exam-submit]');
    if(cur?.production&&submit)submit.disabled=Object.keys(cur.answers).length!==36||!cur.speaking||String(cur.writing||'').trim().length<40||cur.production.some((_,i)=>!String(cur.productionAnswers[i]||'').trim());};
  }
  document.querySelectorAll('[data-exam-production]').forEach(el=>el.oninput=()=>{
   const mode=examMode(),rec=examRecord(),cur=rec.current;if(!cur||!BASE_FINAL_INFO[mode])return;
   const i=Number(el.dataset.examProduction);cur.productionAnswers[i]=el.value;save();
   const submit=document.querySelector('[data-exam-submit]');if(submit)submit.disabled=Object.keys(cur.answers).length!==36||!cur.speaking||String(cur.writing||'').trim().length<40||cur.production.some((_,j)=>!String(cur.productionAnswers[j]||'').trim());
  });
 };
 examPage=function(){
  const mode=examMode();if(!BASE_FINAL_INFO[mode])return BASE_EXAM_PAGE();
  const meta=BASE_FINAL_INFO[mode],rec=examRecord();
  const ready=Array.from({length:meta.end-meta.start},(_,i)=>daysReady(meta.start+i)&&Boolean(store.checkpoints[String(meta.start+i)]?.passedAt)).every(Boolean);
  const earlier=mode==='B1'?Boolean(store.exams.A2?.passedAt):Boolean(store.exams.A1_full?.passedAt);
  let body='';
  if(!ready||!earlier)body=`<div class="notes">Экзамен ${mode} откроется после всех ${meta.end-meta.start} тем этого уровня, всех тематических зачётов и предыдущего экзамена.</div>`;
  else if(rec.passedAt)body=`<div class="donebanner">✓ Внутренний экзамен ${mode} пройден: ${rec.lastScore||0}/36. <b>Это не сертификат CEFR и не проверка произношения, письма или свободной речи.</b></div>`;
  else if(readyTomorrow(rec.retryAfter))body=testCooldown(rec)+`<div class="notes"><h3>Ошибки для повторения</h3>${(rec.lastMistakes||[]).slice(0,10).map(q=>`<p>${esc(q.prompt)} — <b>${esc(q.correct)}</b></p>`).join('')}</div>`;
  else{
   if(!rec.current)newFinalAttempt();const c=rec.current,n=Object.keys(c.answers).length,part=c.part||0,partStart=part*18,qs=c.questions;
   ensureProduction(c,mode,rec.attempts.length);
   const heading=`<div class="notes">Часть ${part+1}/2. Всего 36 вопросов: 12 грамматика, 12 словарь, 6 чтение и 6 аудирование + 4 самостоятельно составленных предложения. Нужно не менее 29/36, 8/12 по грамматике и словам, 4/6 по чтению и аудированию, 3/4 по составлению предложений. Без таймера. Вопросы меняются при новой попытке.</div>`;
   body=heading;
   if(part===0){const count=Array.from({length:18},(_,i)=>c.answers[i]!==undefined).filter(Boolean).length;
    body+=testChoiceMarkup(qs.slice(0,18),c.answers,'exam',0)+`<div class="assessment-submit"><span class="tiny">${count}/18</span><button class="primary dark" data-exam-next="1" ${count!==18?'disabled':''}>Часть 2 →</button></div>`;
   }else{const count=Array.from({length:18},(_,i)=>c.answers[i+18]!==undefined).filter(Boolean).length;
    body+=`<button class="outline" data-exam-back="1">← Часть 1</button>`+testChoiceMarkup(qs.slice(18),c.answers,'exam',18)+
    `<div class="writing"><h3>Самостоятельно составь 4 предложения</h3><p>Напиши английские варианты по-русски, без готовых ответов и подсказок. Для сдачи экзамена нужно минимум 3 из 4. Допускаются различия в регистре и пунктуации. Синонимы пока не распознаются.</p>${c.production.map((q,i)=>`<div class="skill-question"><b>${i+1}. ${esc(q.ru)}</b><div class="skill-inputrow"><input type="text" data-exam-production="${i}" value="${esc(c.productionAnswers[i]||'')}" spellcheck="false" autocomplete="off" placeholder="Английское предложение"></div></div>`).join('')}</div>
    <div class="writing"><h3>Практика письма и речи (не оценивается автоматически)</h3><p>Опиши на английском проблему в путешествии, две возможные меры и почему ты выбрал одну из них. Произнеси свой ответ вслух. Отметка ниже подтверждает лишь выполнение упражнения, а не качество речи.</p><textarea id="exam-writing" rows="4" placeholder="The main problem was...">${esc(c.writing||'')}</textarea><label class="switchline"><input type="checkbox" id="exam-speaking" ${c.speaking?'checked':''}> Я произнёс(ла) свой ответ вслух.</label></div><div class="assessment-submit"><span class="tiny">${count}/18 · итог по всем разделам</span><button class="primary dark" data-exam-submit="1" ${n!==36||!c.speaking||String(c.writing||'').trim().length<40||c.production.some((_,i)=>!String(c.productionAnswers[i]||'').trim())?'disabled':''}>Проверить экзамен →</button></div>`;
   }
  }
  return `<div class="lesson-head"><div><span class="pill">Внутренний экзамен ${mode}</span><h2>Итоговый тест уровня ${mode}</h2><p>${meta.end-meta.start} тематических блоков · проверка навыков, не сертификация CEFR</p></div><button class="outline" data-page="assessments">Все тесты</button></div><div class="panel assessment-panel">${body}</div>
  <div class="panel"><h3>Независимая проверка</h3><p>Для сопоставления с уровнем школы английского используй реальные задания и обратную связь от преподавателя. Сертификат и уровень нельзя подтверждать только внутренними тестами.</p><a target="_blank" rel="noopener noreferrer" href="${mode==='A2'?OFFICIAL_LINKS.A2:OFFICIAL_LINKS.B1}">Cambridge ${mode==='A2'?'A2 Key':'B1 Preliminary'}: официальные образцы ↗</a></div>`;
 };
 submitExam=function(){
  const mode=examMode();if(!BASE_FINAL_INFO[mode])return BASE_SUBMIT_EXAM();
  const rec=examRecord(),cur=rec.current;
  if(!cur||cur.part!==1||Object.keys(cur.answers).length!==cur.questions.length||!cur.speaking||String(cur.writing||'').trim().length<40)return;
  ensureProduction(cur,mode,rec.attempts.length);
  if(cur.production.some((_,i)=>!String(cur.productionAnswers[i]||'').trim()))return;
  const score=answerRatio(cur.questions,cur.answers),wrong=mistakeList(cur.questions,cur.answers),bySkill={grammar:0,vocabulary:0,reading:0,listening:0};
  const productiveScore=cur.production.reduce((n,q,i)=>n+(normalizeGrammar(q.en)===normalizeGrammar(cur.productionAnswers[i])?1:0),0);
  for(let i=0;i<cur.production.length;i++)if(normalizeGrammar(cur.production[i].en)!==normalizeGrammar(cur.productionAnswers[i]))wrong.push({type:'production',prompt:cur.production[i].ru,correct:cur.production[i].en});
  for(let i=0;i<cur.questions.length;i++){const q=cur.questions[i];if(Number(cur.answers[i])===q.answer)bySkill[q.type]++;}
  const ok=score>=29&&bySkill.grammar>=8&&bySkill.vocabulary>=8&&bySkill.reading>=4&&bySkill.listening>=4&&productiveScore>=3;
  rec.attempts.push({on:new Date().toISOString(),score,total:36,bySkill,productiveScore,passed:ok,writing:cur.writing,externalVerificationRequired:true});
  rec.lastScore=score;rec.lastMistakes=wrong;rec.current=null;
  if(ok){rec.passedAt=new Date().toISOString();rec.retryAfter=null;message='Внутренний экзамен '+mode+' сдан. Для подтверждения реального CEFR необходима внешняя оценка.';}
  else{rec.retryAfter=nextLocalDay();message='Результат ниже порога. Ошибки доступны для повторения, новая попытка завтра.';}
  save();render();
 };

 assessmentBanner=function(){
  const t=nextTask();
  if(t.type==='completed')return `<div class="panel assessment-banner"><div><span class="pill">Все внутренние темы и тесты пройдены</span><h3>Учебная программа до B1 завершена</h3><p>Это не означает автоматически независимое соответствие CEFR B1. Пройди официальный образец и живую проверку разговорной речи.</p></div><button class="primary dark" data-page="assessments">Мои экзамены →</button></div>`;
  if(t.type==='exam'&&(t.level==='A2'||t.level==='B1'))return `<div class="panel assessment-banner"><div><span class="pill">Обязательный переход</span><h3>Время итогового экзамена ${t.level}</h3><p>Нужны отдельные результаты по грамматике, словарю, чтению и аудированию. При неудаче пересдача возможна со следующего дня.</p></div><button class="primary dark" data-page="exam">Экзамен ${t.level} →</button></div>`;
  return BASE_BANNER().replace('Первые шесть тем A2 завершены; продолжение в разработке','Текущий уровень завершён. Следующий этап открывается после экзамена');
 };
 const BASE_ASSESSMENTS=assessmentsPage;
 assessmentsPage=function(){
  const t=nextTask(),groups=[['A1',0,25],['A2',25,50],['B1',50,100]];
  const records=[['A1','A1_full'],['A2','A2'],['B1','B1']];
  return `<div class="lesson-head"><div><span class="pill">Ступени A1 — A2 — B1</span><h2>Зачёты и экзамены</h2><p>Следующий раздел закрыт без положительного результата; провал требует закрепления и следующего дня.</p></div></div>`+
   groups.map(([level,first,end])=>`<div class="panel"><h3>${level} — ${end-first} тем / ${(end-first)*6} занятий</h3><div class="check-grid">${courses.slice(first,end).map((c,j)=>{const w=first+j,passed=Boolean(store.checkpoints[String(w)]?.passedAt),done=daysReady(w);return `<button class="check-card ${passed?'checked':t.type==='topic'&&t.week===w?'need-check':'locked'}" data-check-open="${w}" ${!done?'disabled':''}><span class="pill">Неделя ${w+1}</span><b>${esc(c.title)}</b><small>${passed?'✓ Сдано':done?'Нужен тест':'После 6 уроков'}</small></button>`}).join('')}</div></div>`).join('')+
   `<div class="panel"><h3>Итоговые экзамены</h3>${records.map(([name,key])=>`<p><b>${name}:</b> ${store.exams[key]?.passedAt?'✓ Внутренний тест сдан':t.type==='exam'&&t.level===key?'Доступен обязательный экзамен':'Ещё не открыт'}</p>`).join('')}<button class="primary dark" data-page="exam">Открыть доступный экзамен →</button><p class="tiny">A1 также содержит отдельную промежуточную проверку после первых 12 тем. Экзамены не подтверждают произношение, письмо и неподготовленный разговор.</p><p><a target="_blank" rel="noopener noreferrer" href="${OFFICIAL_LINKS.A2}">Cambridge A2 Key ↗</a> · <a target="_blank" rel="noopener noreferrer" href="${OFFICIAL_LINKS.B1}">Cambridge B1 Preliminary ↗</a></p></div>`;
 };
 course=function(){return BASE_COURSE().replace('A0–A1: полный учебный модуль · A2: первые шесть тем','A1: 25 тем · A2: 25 тем · B1: 50 тем')
  .replace('Доступны 150 занятий A1 и первые 36 занятий A2 (всего 186). Для входа в A2 нужен итоговый экзамен A1. Это внутреннее обучение, не сертификат CEFR. Остальные A2 и B1 будут добавлены позже.',
    'Доступны 600 занятий по 100 темам: A1 — 150, A2 — 150, B1 — 300. Каждая тема завершается тестом; переход между уровнями требует внутреннего экзамена. Полнота содержания не равна независимому подтверждению CEFR.');};
 futureCurriculumPanel=function(){return `<div class="section-head"><h2>Программа A2 и B1</h2></div><p class="tiny">Темы доступны последовательно, после успешных проверок. Вторая часть содержит новые авторские учебные тексты и синтезированные сценарии на слух; нужна также практика с живой речью.</p>`+
 ['A2','B1'].map(level=>`<details class="panel syllabus-panel"><summary><b>${level} — ${FUTURE_SYLLABUS[level].length} недель · доступны</b></summary><div class="syllabus-list">${FUTURE_SYLLABUS[level].map((a,i)=>`<div class="syllabus-item"><span class="pill">${level} · ${i+1}</span><strong>${esc(a[0])}</strong><small>${esc(a[1])} · ${esc(a[2])}</small></div>`).join('')}</div></details>`).join('');};
 roadmap=function(){return BASE_ROADMAP().replace('Основа · 150 уроков A1 + 36 уроков A2','Начальная и средняя программа · 600 занятий')
  .replace('Две части A1: первые 72 занятия и дальнейшие 78 занятий. Переход к расширенному блоку требует промежуточного экзамена.',
    'A1: 150 занятий, A2: 150, B1: 300. Между уровнями обязательны внутренние экзамены.')
  .replace('Готовы 150 занятий A1 и первые 36 занятий A2. Остальные 114 плановых занятий A2 и весь B1 пока отсутствуют, поэтому сроки ориентировочные.',
    'Учебные темы A1, A2 и B1 доступны. Для последних 69 тем используется авторский текст и синтезированное аудирование. Сроки примерные, а уровень должен подтверждаться независимой проверкой.')};
 vocabularyDashboard=function(){return BASE_DASHBOARD().replace('Программа A1 содержит 25 тем; первые 6 тем A2 доступны. Полный A2 и B1 ещё требуют авторских уроков и комплексных экзаменов.',
  'Программа включает A1 (25 тем), A2 (25 тем) и B1 (50 тем), но статистика изученных слов сама по себе не подтверждает владение уровнем.');};

 render();
})();