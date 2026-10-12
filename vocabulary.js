/* English Journey — lexical learning with active recall and day-spaced review.
   This module runs in the same (non-module) browser scope as engine.js. */
const VOCAB_INTERVALS = [1,3,7,14,30,60,90];
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
function vocabDue(){ensureVocabulary();const now=vocToday();return Object.entries(store.vocabulary).filter(([id,s])=>VOCAB_MAP.has(id)&&s?.introducedAt&&s.due&&s.due<=now&&s.reviewedOn!==now).map(([id])=>VOCAB_MAP.get(id)).sort((a,b)=>{const da=store.vocabulary[a.id].due,db=store.vocabulary[b.id].due;return da.localeCompare(db)||a.week-b.week})}
function vocabStats(){ensureVocabulary();const recs=Object.values(store.vocabulary).filter(x=>x&&x.introducedAt);return {introduced:recs.length,mastered:recs.filter(x=>x.step>=4).length,needsWork:recs.filter(x=>x.lapses>0&&x.step<4).length,due:vocabDue().length,all:VOCAB_MAP.size}}
function vocabProgressPreview(){const s=vocabStats();return '<div class="vocab-summary"><div><small>Начали изучать</small><strong>'+s.introduced+'</strong></div><div><small>Уверенно вспомнили с интервалами</small><strong>'+s.mastered+'</strong></div><div><small>Повторить сегодня</small><strong>'+s.due+'</strong></div><button class="outline" data-page="vocabulary">Открыть словарь →</button></div>'}
function vocabularyLessonPane(unit,day,r,index){
 ensureVocabulary();if(!Array.isArray(r.vocabDoneIds))r.vocabDoneIds=[];
 const items=vocabForLesson(index), remaining=items.filter(item=>!r.vocabDoneIds.includes(item.id));
 if(r.steps[1] && r.vocabDoneIds.length===0) return '<div class="donebanner">Шаг был завершён в прежней версии приложения. Твой прогресс сохранён. Новые карточки доступны в последующих уроках и разделе «Мой словарь».</div>';
 if(!remaining.length) return '<div class="donebanner">✓ Все '+items.length+' выражений проверены. Они будут появляться в интервальных повторениях. '+nextButton(2)+'</div>';
 const item=remaining[0],recall=r.vocabRecall===item.id;
 const err=r.vocabLastError===item.id;
 const studied=items.length-remaining.length;
 return '<div class="split"><span class="pill">Слова и выражения · '+studied+'/'+items.length+'</span><span class="tiny">Ориентир: 8–10 минут</span></div>'+ 
 '<h3>Сначала пойми — затем вспомни без подсказки</h3>'+ 
 '<p>Ознакомься с английским выражением и переводом. После нажатия «Проверить себя» английский вариант скроется — напечатай его по памяти. Просмотр сам по себе не засчитывается.</p>'+ 
 (recall ?
 '<div class="vocab-practice"><div class="tiny">Как сказать по-английски?</div><div class="vocab-prompt">'+esc(item.ru)+'</div><input id="vocab-answer" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Напиши английское слово или выражение" aria-label="Ответ на английском"><button class="primary dark" data-vocab-submit="'+esc(item.id)+'">Проверить ответ</button>'+ 
 (err?'<div class="result error">Пока неверно. Правильный ответ: <b>'+esc(item.en)+'</b>. Повтори и напиши ещё раз — слово отметится для закрепления.</div>':'')+'</div>' :
 '<div class="vocab-practice"><div class="vocab-prompt">'+esc(item.en)+'</div><div class="vocab-translation">'+esc(item.ru)+'</div><button class="outline" data-vocab-say="'+esc(item.id)+'">▶ Произношение</button><button class="primary dark" data-vocab-recall="'+esc(item.id)+'">Проверить себя без подсказки →</button></div>')+
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
 save();if(items.every(x=>r.vocabDoneIds.includes(x.id)))markStep(1);else render();
}
function vocabReviewItem(item,answer){
 ensureVocabulary();if(!vocabDue().some(x=>x.id===item.id))return;
 const s=store.vocabulary[item.id],good=vocText(answer)===vocText(item.en);
 s.reviewedOn=vocToday();s.lastResult=good;s.correct=(s.correct||0)+(good?1:0);s.lapses=(s.lapses||0)+(good?0:1);
 s.step=good?Math.min(7,(s.step||0)+1):0;
 s.due=vocNext(good?VOCAB_INTERVALS[Math.min(s.step,VOCAB_INTERVALS.length-1)]:1);
 store.vocabFeedback={id:item.id,good,correct:item.en};save();render();
}
function vocabularyDashboard(){
 ensureVocabulary();const s=vocabStats(),due=vocabDue(),next=due[0],feedback=store.vocabFeedback;
 return '<div class="lesson-head"><div><span class="pill">Адаптивный словарь</span><h2>Слова и выражения для путешествий</h2><p>Активное вспоминание · интервалы 1 / 3 / 7 / 14 / 30 дней · без увеличения уроков сверх 40 минут</p></div><button class="outline" data-page="lesson">Текущий урок →</button></div>'+vocabProgressPreview()+
 '<div class="panel"><h3>Повторение на сегодня</h3><p>Новые слова открываются в уроках. Здесь нужно вспомнить уже встречавшиеся выражения <b>без подсказки</b>. Успешные ответы увеличивают интервалы; ошибка назначает повторение на завтра.</p>'+ 
 (feedback?'<div class="result '+(feedback.good?'':'error')+'">'+(feedback.good?'Верно!':'Ошибка, повтори:')+' '+esc(feedback.correct)+'</div>':'')+
 (next?'<div class="vocab-practice"><div class="tiny">Осталось на сегодня: '+due.length+'</div><div class="vocab-prompt">'+esc(next.ru)+'</div><input id="vocab-review-answer" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Английский вариант по памяти" aria-label="Слово на английском"><button class="primary dark" data-vocab-review="'+esc(next.id)+'">Проверить и сохранить</button></div>':'<div class="donebanner">На сегодня запланированных повторений больше нет. Можно продолжать уроки.</div>')+'</div>'+ 
 '<div class="panel"><h3>Что значат показатели</h3><p class="tiny">В словарь входят отдельные слова и полезные выражения. «Освоено» считается только после нескольких правильных ответов в разные дни, а не после просмотра карточки. Это оценка словарной памяти, не официальный CEFR.</p><p class="tiny">В текущем банке '+s.all+' уникальных слов и выражений. Программа A1 содержит 25 тем; первые 6 тем A2 доступны. Полный A2 и B1 ещё требуют авторских уроков и комплексных экзаменов.</p></div>';
}
function vocabularyHandlers(){
 document.querySelectorAll('[data-vocab-recall]').forEach(b=>b.onclick=()=>{record(dayFocus).vocabRecall=b.dataset.vocabRecall;record(dayFocus).vocabLastError=null;save();render();document.getElementById('vocab-answer')?.focus()});
 document.querySelectorAll('[data-vocab-submit]').forEach(b=>{const action=()=>vocabLearnAnswer(b.dataset.vocabSubmit,document.getElementById('vocab-answer')?.value||'');b.onclick=action;const input=document.getElementById('vocab-answer');if(input)input.onkeydown=e=>{if(e.key==='Enter')action()};});
 document.querySelectorAll('[data-vocab-review]').forEach(b=>{const action=()=>{const it=VOCAB_MAP.get(b.dataset.vocabReview);if(it)vocabReviewItem(it,document.getElementById('vocab-review-answer')?.value||'')};b.onclick=action;const input=document.getElementById('vocab-review-answer');if(input)input.onkeydown=e=>{if(e.key==='Enter')action()};});
 document.querySelectorAll('[data-vocab-say]').forEach(b=>b.onclick=()=>{const it=VOCAB_MAP.get(b.dataset.vocabSay);if(!it||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(it.en);u.lang='en-GB';u.rate=.82;speechSynthesis.speak(u)}catch(e){}});
}
