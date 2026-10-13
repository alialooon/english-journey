/* English Journey — lexical learning with active recall and day-spaced review.
   This module runs in the same (non-module) browser scope as engine.js. */
const VOCAB_INTERVALS = [1,3,7,14,30,60,90];
// Only previously introduced words can enter the personal difficult-word list.
// They are reviewed more often, but never repeat automatically twice the same day.
const VOCAB_FOCUS_INTERVALS = [1,2,4,7,14,30,45];
let VOCAB_BROWSE_LIMIT=18;
let VOCAB_BROWSE_QUERY='';
function vocabIntervalDays(s){
 const intervals=s?.focus||((s?.lapses||0)>=2&&(s?.step||0)<4)?
  VOCAB_FOCUS_INTERVALS:VOCAB_INTERVALS;
 return intervals[Math.min(s?.step||0,intervals.length-1)];
}
function vocabFocusList(){
 ensureVocabulary();
 return Object.entries(store.vocabulary).filter(([id,s])=>VOCAB_MAP.has(id)&&s?.introducedAt)
  .map(([id,s])=>({...VOCAB_MAP.get(id),focus:Boolean(s.focus),learned:s.introducedAt,step:s.step||0,due:s.due||''}))
  .sort((a,b)=>Number(b.focus)-Number(a.focus)||b.learned.localeCompare(a.learned)||a.en.localeCompare(b.en));
}
function toggleWordFocus(id){
 ensureVocabulary();const state=store.vocabulary[id];
 if(!VOCAB_MAP.has(id)||!state?.introducedAt)return false;
 state.focus=!state.focus;
 if(state.focus){
  const tomorrow=vocNext(1);
  if(!state.due||state.due>tomorrow)state.due=tomorrow;
 }
 save();render();return true;
}
function personalVocabularyPane(){
 const all=vocabFocusList();
 if(!all.length)return '<div class="panel"><h3>Мои сложные слова</h3><p class="tiny">Здесь появятся уже изученные слова. Любое из них можно отметить для более частого повторения.</p></div>';
 const q=VOCAB_BROWSE_QUERY.toLocaleLowerCase('ru').trim();
 const selected=all.filter(item=>!q||item.en.toLowerCase().includes(q)||item.ru.toLocaleLowerCase('ru').includes(q));
 const items=selected.slice(0,VOCAB_BROWSE_LIMIT);
 return '<div class="panel personal-vocab"><h3>Мои сложные слова</h3>'+
  '<p class="tiny">Отмечай только уже изученные слова, которые хочешь вспоминать чаще. Отметку всегда можно снять. '+
  'Ошибки на повторении также временно сокращают интервалы.</p>'+
  '<div class="personal-vocab-search"><input id="vocab-lookup" spellcheck="false" autocomplete="off" '+
  'aria-label="Найти изученное слово" placeholder="Поиск среди изученных слов" value="'+esc(VOCAB_BROWSE_QUERY)+'">'+
  '<button class="outline" data-vocab-find="1">Найти</button></div>'+
  '<p class="tiny">Изучено: '+all.length+' · В личном списке: '+all.filter(x=>x.focus).length+'</p>'+
  '<div class="personal-vocab-items">'+items.map(item=>
   '<div class="personal-vocab-item"><div><strong lang="en">'+esc(item.en)+'</strong>'+
   ' <span class="tiny">— '+esc(item.ru)+'</span>'+
   (vocabContext(item)||'')+'</div>'+
   '<button class="outline" data-vocab-focus="'+esc(item.id)+'" aria-pressed="'+item.focus+'">'+
   (item.focus?'Убрать из сложных':'Повторять чаще')+'</button></div>').join('')+
  (items.length===0?'<p class="tiny">Таких изученных слов пока нет.</p>':'')+
  '</div>'+
  (items.length<selected.length?'<button class="outline" data-vocab-more="1">Показать ещё слова</button>':'')+
  '</div>';
}

// Original Russian-only usage cues for 48 A0 words; no future English grammar.
const VOCAB_USAGE=Object.freeze({
  "hello": "Нейтральное приветствие.",
  "goodbye": "Прощание при уходе.",
  "name": "Имя человека вообще.",
  "country": "Страна, откуда приехал человек.",
  "tourist": "Человек, который путешествует.",
  "friend": "Человек, с которым дружим.",
  "please": "Вежливая просьба.",
  "thank you": "Благодарность за помощь.",
  "hi": "Короткое неформальное приветствие.",
  "good morning": "Приветствие утром.",
  "good afternoon": "Приветствие после полудня.",
  "good evening": "Приветствие вечером.",
  "good night": "Пожелание перед сном, а не приветствие.",
  "see you": "Неформальное прощание до следующей встречи.",
  "welcome": "Приветствие пришедшего гостя.",
  "excuse me": "Вежливо привлечь внимание.",
  "sorry": "Извиниться за свою ошибку.",
  "yes": "Утвердительный ответ.",
  "no": "Отрицательный ответ.",
  "okay": "«Ладно, договорились».",
  "fine": "«У меня всё хорошо».",
  "great": "Радостное одобрение.",
  "nice": "Приятный человек или предмет.",
  "happy": "Радостное настроение.",
  "sad": "Грустное настроение.",
  "first name": "Личное имя в анкете, не фамилия.",
  "last name": "Фамилия в анкете.",
  "age": "Возраст человека.",
  "years old": "Часть выражения «Мне ... лет».",
  "person": "Один человек.",
  "people": "Люди, больше одного человека.",
  "man": "Взрослый мужчина.",
  "woman": "Взрослая женщина.",
  "child": "Один ребёнок.",
  "family": "Родственники, члены семьи.",
  "mother": "Мама.",
  "father": "Папа.",
  "sister": "Сестра.",
  "brother": "Брат.",
  "husband": "Муж в семье.",
  "wife": "Жена в семье.",
  "language": "Язык общения.",
  "english": "Английский язык.",
  "russian": "Русский язык.",
  "i": "Говорим о себе.",
  "you": "Обращаемся к собеседнику.",
  "he": "Говорим о мужчине или мальчике.",
  "she": "Говорим о женщине или девочке."
});
function vocabUsage(item){if(item?.week===0)return VOCAB_USAGE[String(item.en).toLowerCase()]||'';return window.EJA1VocabContext?.context(item)||'';}
function vocabContext(item){const hint=vocabUsage(item);return hint?'<p class="vocab-usage">Ситуация: '+esc(hint)+'</p>':''}

const VOCAB_BANK = courses.map((lesson, week) => {
 const entries = [...lesson.words, ...VOCAB_EXTRA[week]];
 const seen = new Set();
 return entries.filter(pair => {
  const key = pair[0].toLocaleLowerCase('en').trim();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
 }).map(([en, ru]) => ({id:en.toLocaleLowerCase('en').trim(),en,ru,week}));
});
const VOCAB_MAP = new Map();
for(const item of VOCAB_BANK.flat())if(!VOCAB_MAP.has(item.id))VOCAB_MAP.set(item.id,item);
function ensureVocabulary(){
 if(!store.vocabulary || typeof store.vocabulary!=='object' || Array.isArray(store.vocabulary)) store.vocabulary={};
 if(!store.vocabDaily || typeof store.vocabDaily!=='object') store.vocabDaily={};
}
function vocToday(){return dateYMD(new Date())}
function vocNext(days){return dateYMD(plusDays(new Date(),days))}
function vocText(s){return String(s||'').trim().toLocaleLowerCase('en').replace(/[’`]/g,"'").replace(/[.,!?]/g,'').replace(/\s+/g,' ')}
function vocabForLesson(day){const week=Math.floor(day/6),offset=(day%6)*8,bank=VOCAB_BANK[week]||[];return bank.length?Array.from({length:Math.min(8,bank.length)},(_,i)=>bank[(offset+i)%bank.length]):[];}
function vocabDue(){ensureVocabulary();const now=vocToday();return Object.entries(store.vocabulary).filter(([id,s])=>VOCAB_MAP.has(id)&&s?.introducedAt&&s.due&&s.due<=now&&s.reviewedOn!==now).map(([id])=>VOCAB_MAP.get(id)).sort((a,b)=>{const da=store.vocabulary[a.id].due,db=store.vocabulary[b.id].due;return da.localeCompare(db)||Number(Boolean(store.vocabulary[b.id].focus))-Number(Boolean(store.vocabulary[a.id].focus))||a.week-b.week})}
function vocabStats(){ensureVocabulary();const recs=Object.values(store.vocabulary).filter(x=>x&&x.introducedAt);return {introduced:recs.length,mastered:recs.filter(x=>x.step>=4).length,needsWork:recs.filter(x=>x.lapses>0&&x.step<4).length,due:vocabDue().length,all:VOCAB_MAP.size}}
function vocabProgressPreview(){const s=vocabStats();return '<div class="vocab-summary"><div><small>Начали изучать</small><strong>'+s.introduced+'</strong></div><div><small>Уверенно вспомнили с интервалами</small><strong>'+s.mastered+'</strong></div><div><small>Повторить сегодня</small><strong>'+s.due+'</strong></div><button class="outline" data-page="vocabulary">Открыть словарь →</button></div>'}
// Small, due-only retrieval bridge inside the next lesson. It deliberately
// excludes today's cards and all words from unfinished/future lessons.
const LESSON_RECALL_LIMIT=3;
function previouslyCompletedVocabulary(index){
 const known=new Set();
 for(let i=0;i<index;i++){
  const rec=store.logs?.[String(i)];
  if(!rec?.steps?.[1])continue;
  for(const id of rec.vocabDoneIds||[])if(store.vocabulary?.[id]?.introducedAt)known.add(id);
 }
 return known;
}
function ensureLessonRecall(index,r){
 if(Array.isArray(r.lessonRecallIds))return;
 const earlier=previouslyCompletedVocabulary(index);
 const current=new Set(vocabForLesson(index).map(x=>x.id));
 r.lessonRecallIds=vocabDue().filter(x=>earlier.has(x.id)&&!current.has(x.id))
  .slice(0,LESSON_RECALL_LIMIT).map(x=>x.id);
 r.lessonRecallDoneIds=[];
 r.lessonRecallMistakes={};
 save();
}
function vocabularyStepReady(index,r){
 const cards=vocabForLesson(index);
 return cards.every(x=>r.vocabDoneIds?.includes(x.id)) &&
  (r.lessonRecallIds||[]).every(id=>r.lessonRecallDoneIds?.includes(id));
}
function lessonRecallPane(index,r){
 const next=(r.lessonRecallIds||[]).find(id=>!r.lessonRecallDoneIds?.includes(id));
 if(!next)return '';
 const item=VOCAB_MAP.get(next);
 if(!item)throw Error('Изученное выражение больше не найдено в словаре: '+next);
 const incorrect=Boolean(r.lessonRecallMistakes?.[next]);
 const done=(r.lessonRecallDoneIds||[]).length;
 return '<div class="vocab-practice lesson-recall" aria-label="Интервальное повторение">'+
  '<div class="tiny">Вспомни слово из прошлых уроков · '+(done+1)+'/'+r.lessonRecallIds.length+'</div>'+
  '<div class="vocab-prompt">'+esc(item.ru)+'</div>'+vocabContext(item)+
  '<input id="lesson-recall-answer" spellcheck="false" autocomplete="off" autocapitalize="off" '+
  'aria-label="Напиши старое английское слово по памяти" placeholder="Перевод на английский">'+
  '<button class="primary dark" data-lesson-recall="'+esc(item.id)+'">Проверить</button>'+
  (incorrect?'<p class="result error" role="status">Повтори: <b>'+esc(item.en)+'</b>. '+
   'Этот ответ будет повторён ещё раз завтра.</p>':'')+'</div>';
}
function gradeLessonRecall(id,answer){
 const r=record(dayFocus);
 ensureVocabulary();ensureLessonRecall(dayFocus,r);
 const expected=(r.lessonRecallIds||[]).find(x=>!r.lessonRecallDoneIds?.includes(x));
 if(id!==expected)return;
 const item=VOCAB_MAP.get(id),state=store.vocabulary[id];
 if(!item||!state?.introducedAt)return;
 const good=vocText(answer)===vocText(item.en);
 if(!good){
  r.lessonRecallMistakes=r.lessonRecallMistakes||{};
  r.lessonRecallMistakes[id]=true;
  save();render();return;
 }
 r.lessonRecallDoneIds=r.lessonRecallDoneIds||[];
 r.lessonRecallDoneIds.push(id);
 const hadError=Boolean(r.lessonRecallMistakes?.[id]);
 state.reviewedOn=vocToday();
 state.lastResult=!hadError;
 state.correct=(state.correct||0)+(hadError?0:1);
 state.lapses=(state.lapses||0)+(hadError?1:0);
 state.step=hadError?0:Math.min(7,(state.step||0)+1);
 state.due=vocNext(hadError?1:vocabIntervalDays(state));
 save();
 if(vocabularyStepReady(dayFocus,r)&&!r.steps[1])markStep(1);
 else render();
}
function vocabularyLessonPane(unit,day,r,index){
 ensureVocabulary();if(!Array.isArray(r.vocabDoneIds))r.vocabDoneIds=[];
 if(!r.steps[1])ensureLessonRecall(index,r);
 const items=vocabForLesson(index), remaining=items.filter(item=>!r.vocabDoneIds.includes(item.id));
 if(r.steps[1] && r.vocabDoneIds.length===0) return '<div class="donebanner">Шаг был завершён в прежней версии приложения. Твой прогресс сохранён. Новые карточки доступны в последующих уроках и разделе «Мой словарь».</div>';
 if(!remaining.length){
  const recall=lessonRecallPane(index,r);
  return recall||'<p class="tiny">Слова урока проверены. Повторение запланировано по интервалам.</p>';
 }
 const item=remaining[0],recall=r.vocabRecall===item.id;
 const err=r.vocabLastError===item.id;
 const studied=items.length-remaining.length;
 return '<div class="split"><span class="pill">Слова и выражения · '+studied+'/'+items.length+'</span><span class="tiny">Ориентир: 8–10 минут</span></div>'+ 
 '<h3>Сначала пойми — затем вспомни без подсказки</h3>'+ 
 '<p>Ознакомься с английским выражением и переводом. После нажатия «Проверить себя» английский вариант скроется — напечатай его по памяти. Просмотр сам по себе не засчитывается.</p>'+ 
 (recall ?
 '<div class="vocab-practice"><div class="tiny">Как сказать по-английски?</div><div class="vocab-prompt">'+esc(item.ru)+'</div>'+vocabContext(item)+'<input id="vocab-answer" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Напиши английское слово или выражение" aria-label="Ответ на английском"><button class="primary dark" data-vocab-submit="'+esc(item.id)+'">Проверить ответ</button>'+ 
 (err?'<div class="result error">Пока неверно. Правильный ответ: <b>'+esc(item.en)+'</b>. Повтори и напиши ещё раз — слово отметится для закрепления.</div>':'')+'</div>' :
 '<div class="vocab-practice"><div class="vocab-prompt">'+esc(item.en)+'</div><div class="vocab-translation">'+esc(item.ru)+'</div>'+vocabContext(item)+'<button class="outline" data-vocab-say="'+esc(item.id)+'">▶ Произношение</button><button class="primary dark" data-vocab-recall="'+esc(item.id)+'">Проверить себя без подсказки →</button></div>')+
 '<div class="tiny">Новые слова подобраны по теме «'+esc(unit.title)+'». Ошибочные слова возвращаются на повторение; многократный ввод сегодня не делает их «освоенными».</div>';
}
function vocabLearnAnswer(id,answer){
 ensureVocabulary();const item=VOCAB_MAP.get(id),r=record(dayFocus),items=vocabForLesson(dayFocus);
 if(!item||!items.some(x=>x.id===id)||r.vocabDoneIds?.includes(id)||r.vocabRecall!==id)return;
 if(vocText(answer)!==vocText(item.en)){
  r.vocabLastError=id;r.vocabMistakes=r.vocabMistakes||{};r.vocabMistakes[id]=(r.vocabMistakes[id]||0)+1;save();render();return;
 }
 r.vocabDoneIds=r.vocabDoneIds||[];r.vocabDoneIds.push(id);r.vocabRecall=null;r.vocabLastError=null;
 const old=store.vocabulary[id];
 if(!old?.introducedAt)store.vocabulary[id]={introducedAt:vocToday(),due:vocNext(1),step:0,correct:0,lapses:r.vocabMistakes?.[id]?1:0};
 save();if(vocabularyStepReady(dayFocus,r))markStep(1);else render();
}
function vocabReviewItem(item,answer){
 ensureVocabulary();if(!vocabDue().some(x=>x.id===item.id))return;
 const s=store.vocabulary[item.id],good=vocText(answer)===vocText(item.en);
 s.reviewedOn=vocToday();s.lastResult=good;s.correct=(s.correct||0)+(good?1:0);s.lapses=(s.lapses||0)+(good?0:1);
 s.step=good?Math.min(7,(s.step||0)+1):0;
 s.due=vocNext(good?vocabIntervalDays(s):1);
 store.vocabFeedback={id:item.id,good,correct:item.en};save();render();
}
function vocabularyDashboard(){
 ensureVocabulary();const s=vocabStats(),due=vocabDue(),next=due[0],feedback=store.vocabFeedback;
 return '<div class="lesson-head"><div><span class="pill">Адаптивный словарь</span><h2>Слова и выражения для путешествий</h2><p>Активное вспоминание · интервалы 1 / 3 / 7 / 14 / 30 дней · без увеличения уроков сверх 40 минут</p></div><button class="outline" data-page="lesson">Текущий урок →</button></div>'+vocabProgressPreview()+
 '<div class="panel"><h3>Повторение на сегодня</h3><p>Новые слова открываются в уроках. Здесь нужно вспомнить уже встречавшиеся выражения <b>без подсказки</b>. Успешные ответы увеличивают интервалы; ошибка назначает повторение на завтра.</p>'+ 
 (feedback?'<div class="result '+(feedback.good?'':'error')+'">'+(feedback.good?'Верно!':'Ошибка, повтори:')+' '+esc(feedback.correct)+'</div>':'')+
 (next?'<div class="vocab-practice"><div class="tiny">Осталось на сегодня: '+due.length+'</div><div class="vocab-prompt">'+esc(next.ru)+'</div>'+vocabContext(next)+'<input id="vocab-review-answer" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Английский вариант по памяти" aria-label="Слово на английском"><button class="primary dark" data-vocab-review="'+esc(next.id)+'">Проверить и сохранить</button></div>':'<div class="donebanner">На сегодня запланированных повторений больше нет. Можно продолжать уроки.</div>')+'</div>'+personalVocabularyPane()+
 '<div class="panel"><h3>Что значат показатели</h3><p class="tiny">В словарь входят отдельные слова и полезные выражения. «Освоено» считается только после нескольких правильных ответов в разные дни, а не после просмотра карточки. Это оценка словарной памяти, не официальный CEFR.</p><p class="tiny">В текущем банке '+s.all+' уникальных слов и выражений. Программа A1 содержит 25 тем; первые 6 тем A2 доступны. Полный A2 и B1 ещё требуют авторских уроков и комплексных экзаменов.</p></div>';
}
function vocabularyHandlers(){
 document.querySelectorAll('[data-vocab-focus]').forEach(b=>b.onclick=()=>toggleWordFocus(b.dataset.vocabFocus));
 const find=()=>{VOCAB_BROWSE_QUERY=document.getElementById('vocab-lookup')?.value||'';VOCAB_BROWSE_LIMIT=18;render();};
 const input=document.getElementById('vocab-lookup');
 if(input)input.onkeydown=e=>{if(e.key==='Enter')find()};
 document.querySelectorAll('[data-vocab-find]').forEach(b=>b.onclick=find);
 document.querySelectorAll('[data-vocab-more]').forEach(b=>b.onclick=()=>{VOCAB_BROWSE_LIMIT+=18;render()});

 document.querySelectorAll('[data-lesson-recall]').forEach(b=>{
  const action=()=>gradeLessonRecall(b.dataset.lessonRecall,document.getElementById('lesson-recall-answer')?.value||'');
  b.onclick=action;
  const input=document.getElementById('lesson-recall-answer');
  if(input)input.onkeydown=e=>{if(e.key==='Enter')action()};
 });
 document.querySelectorAll('[data-vocab-recall]').forEach(b=>b.onclick=()=>{record(dayFocus).vocabRecall=b.dataset.vocabRecall;record(dayFocus).vocabLastError=null;save();render();document.getElementById('vocab-answer')?.focus()});
 document.querySelectorAll('[data-vocab-submit]').forEach(b=>{const action=()=>vocabLearnAnswer(b.dataset.vocabSubmit,document.getElementById('vocab-answer')?.value||'');b.onclick=action;const input=document.getElementById('vocab-answer');if(input)input.onkeydown=e=>{if(e.key==='Enter')action()};});
 document.querySelectorAll('[data-vocab-review]').forEach(b=>{const action=()=>{const it=VOCAB_MAP.get(b.dataset.vocabReview);if(it)vocabReviewItem(it,document.getElementById('vocab-review-answer')?.value||'')};b.onclick=action;const input=document.getElementById('vocab-review-answer');if(input)input.onkeydown=e=>{if(e.key==='Enter')action()};});
 document.querySelectorAll('[data-vocab-say]').forEach(b=>b.onclick=()=>{const it=VOCAB_MAP.get(b.dataset.vocabSay);if(!it||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(it.en);u.lang='en-GB';u.rate=.82;speechSynthesis.speak(u)}catch(e){}});
}
