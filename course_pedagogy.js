/* English Journey 13.6 — explicit Russian instructions, prior exposure, and checked writing.
 * 31 early weeks: hand-authored sentence meanings; higher levels: stable Russian
 * situational explanations for recurring generated prompt types.
 */
(function(){
'use strict';
const EARLY_MEANINGS=[["Привет! Как тебя зовут?","Рад познакомиться, Алекс. Откуда ты?","Тебя зовут Алек?","Не мог бы ты произнести своё имя по буквам?"],["Сколько билетов тебе нужно?","Наличными или картой?","Билет стоит пятнадцать фунтов.","Это пятнадцать фунтов. Нужен чек?"],["Я могу тебе помочь?","Он находится рядом с банком.","Ты что-то ищешь?","Иди прямо и поверни налево."],["Что ты хотел бы заказать?","Что-нибудь попить?","Что я могу тебе принести?","Да, у нас это есть."],["Что ты обычно делаешь утром?","Ты работаешь вечером?","Ты свободен в субботу?","Может, встретимся утром?"],["Ты часто путешествуешь?","Ты ездишь на такси?","Автобусы ходят по воскресеньям?","Хочешь такси?"],["У тебя есть бронирование?","Можно посмотреть твой паспорт?","В чём проблема?","Прости. Хочешь новый ключ?"],["Что ты сейчас делаешь?","Автобус уже едет?","Где твоё такси?","Водитель звонит тебе?"],["Где ты был вчера?","Тебе понравилось?","Кафе было открыто?","Что ты делал?"],["Что случилось?","Где он был у тебя?","Ты нашёл телефон?","Где он был?"],["Что ты собираешься делать?","Когда ты уезжаешь?","На рейсе больше нет мест. Что ты будешь делать?","Мне это забронировать?"],["Я могу тебе помочь?","Тебе нужна другая пересадка?","Твой рейс отменён.","Да, мы можем помочь с этим."],["Что тебе нравится делать на выходных?","Может, посмотрим бесплатное танцевальное шоу?","Концерт отменён. Что можем сделать?","Фестиваль бесплатный?"],["Какой размер тебе нужен?","Хочешь примерить это?","Рубашка удобная?","Хочешь размер побольше?"],["Как выглядит Мария?","Где мне с ней встретиться?","Можешь описать своего коллегу?","Во что он одет?"],["Из какой ты страны?","Почему тебе нравится этот музей?","Какой язык ты предпочитаешь?","Хочешь аудиогид?"],["Ты свободен в пятницу вечером?","Встретимся в семь?","Можешь прийти в девять?","В субботу удобнее?"],["Ты читаешь новости каждый день?","Твоя сестра читает новости?","Библиотека открыта в четверг вечером?","Откуда ты знаешь?"],["Ты говоришь по-английски?","Ты хорошо умеешь помогать клиентам?","Когда можешь начать?","Можешь работать с девяти до пяти?"],["Как я могу тебе помочь?","Что-нибудь ещё?","Ты говоришь по-английски?","Можешь показать мне станцию на карте?"],["У тебя есть паспорт?","Пожалуйста, не кури в комнате.","Можешь прийти в субботу?","Тебе нужно что-нибудь принести?"],["Какая погода будет в субботу?","Погуляем в горах?","В пятницу будет дождь. Что будем делать?","Что мне взять с собой?"],["Что бы ты хотел поесть?","Есть ли аллергия?","Извини, курица закончилась.","Наличными или картой?"],["Что ты делал вчера?","Что произошло после обеда?","Почему ты вернулся в отель?","Тебе понравился день?"],["Я не могу найти свой отель. Что мне делать?","На этой улице безопасно ночью?","Звучит пожарная сигнализация. Что делать?","Где нам встретиться?"],["Я могу тебе помочь?","Он находится за библиотекой.","Что ты хочешь узнать?","Да, в одиннадцать. Пожалуйста, приходи заранее."],["Платформа изменилась.","Иди к шестой платформе.","В чём проблема?","Следующий поезд будет через тридцать минут."],["Тебе понравился Порту?","Что тебе понравилось больше всего?","Ты ездил на экскурсию на лодке?","Что ты сделал вместо этого?"],["Что произошло?","Можешь это описать?","Можно посмотреть твой билет?","Ты купил его онлайн?"],["Почему остановился автобус?","Все в безопасности?","Что ты делал в шесть?","Ты видел снег?"],["Что произошло вчера вечером?","Наш сотрудник приходил в твою комнату?","Когда ты заметил проблему?","Что делал администратор?"]];
function turnMeaning(turn,week,path,ix){
 if(EARLY_MEANINGS[week])return EARLY_MEANINGS[week][path*2+ix]||'';
 const lead=turn.lead||'';
 if(/What difficulty did you encounter while travelling/i.test(lead))return 'Сотрудник спрашивает, с какой трудностью ты столкнулся в описанной поездке или ситуации.';
 if(/How was the situation handled after you asked for help/i.test(lead))return 'Сотрудник спрашивает, как решилась проблема после твоей просьбы о помощи.';
 if(/What was the final outcome of your trip/i.test(lead))return 'Друг спрашивает, чем в итоге закончилась эта поездка или ситуация.';
 if(/What lesson would you take from this/i.test(lead))return 'Друг спрашивает, какой вывод ты сделал и чему научился.';
 return 'Ситуация по теме «'+courses[week].title+'». Подумай, какую информацию спрашивает собеседник.';
}
function phrasesBeforeTurn(week,path,ix){
 if(week===0&&path===1&&ix===1)return '<div class="course-glossary"><b>Новая фраза:</b> '+
  '<span lang="en">Could you spell it?</span> = «Не мог бы ты произнести это по буквам?».'+
  ' <span lang="en">spell</span> — произносить или писать по буквам; '+
  '<span lang="en">Could you…?</span> — вежливая просьба. '+
  'Это выражение раньше не объяснялось, поэтому теперь ты сначала узнаёшь его смысл, а затем отвечаешь.</div>';
 if(week===0&&path===0&&ix===1)return '<div class="course-glossary"><b>Полезная фраза:</b> '+
  '<span lang="en">Nice to meet you</span> — «Приятно познакомиться»; '+
  '<span lang="en">Where are you from?</span> — «Откуда ты?».</div>';
 return '';
}
function writingPrompts(){
 const bank=vocabForLesson(dayFocus);
 const day=dayFocus%6,week=Math.floor(dayFocus/6),grammar=SKILLS_DATA[week]?.grammar||[];
 // One translation model not used in this lesson's two earlier grammar exercises.
 const third=window.EJVariety?.curated(dayFocus)?window.EJVariety.practice(dayFocus)[2]:grammar.length?grammar[(day+2)%grammar.length]:{ru:'Я путешествую.',en:'I travel'};
 const first=bank.slice(0,3);
 return [...first.map((item,i)=>({id:String(i),ru:item.ru,en:item.en,kind:'vocabulary'})),
  {id:'3',ru:third.ru,en:third.en,kind:'grammar'}];
}
function passedWriting(r,items){
 r.writingAnswers=r.writingAnswers||{};
 return items.every(x=>r.writingAnswers[x.id]?.ok===true||r.writingAnswers[x.id]?.skipped===true);
}
function updateWriting(){
 const r=record(dayFocus),items=writingPrompts();
 r.writingValidated=passedWriting(r,items);
 save();
 if(r.writingValidated&&ejSkills(r).dialogue.passed&&!r.steps[4])markStep(4);
 else render();
}
const oldDialogPane=skillDialogPane;
skillDialogPane=function(r){
 const current=ejSkills(r).dialogue,ds=skillItem().dialogues;
 if(current.passed)return ''; // The lesson progress already records this success.
 const path=Number.isInteger(current.path)?current.path:dayFocus%2;
 const branch=ds[path],ix=Number(current.turn)||0,week=Math.floor(dayFocus/6);
 const turn=branch.turns[ix],meaning=turnMeaning(turn,week,path,ix),glossary=phrasesBeforeTurn(week,path,ix);
 const choices=turn.choices.map((choice,j)=>
  '<button class="choice" data-dialog-answer="'+j+'">'+String.fromCharCode(65+j)+'. '+esc(choice)+'</button>').join('');
 return '<section class="skill-section lesson-compact-section"><h3>Диалог</h3>'+
  '<div class="skill-paths">'+ds.map((b,i)=>
   '<button class="outline '+(i===path?'skill-active':'')+'" data-dialog-path="'+i+'">'+esc(b.title)+'</button>').join('')+'</div>'+
  '<div class="skill-question"><div class="qcounter">'+(ix+1)+'/'+branch.turns.length+'</div>'+
  '<b lang="en">'+esc(turn.lead)+'</b>'+
  '<div class="course-meaning"><b>Перевод:</b> '+esc(meaning)+'</div>'+glossary+
  '<div class="skill-choicegrid">'+choices+'</div></div>'+
  (current.lastWrong?'<p class="result error" role="alert">Не подходит по смыслу. Попробуй ещё раз.</p>':'')+
  '</section>';
};
speakingPane=function(u,day,r){
 if(r.steps[4]&&(!r.writingAnswers||Object.keys(r.writingAnswers).length===0)){
  return '<p class="tiny">Ранее выполненный этап зачтён. Прогресс сохранён.</p>';
 }
 const items=writingPrompts();
 r.writingAnswers=r.writingAnswers||{};
 r.writingDrafts=r.writingDrafts||{};
 r.writingValidated=passedWriting(r,items);
 const translation=items.map((item,i)=>{
  const current=r.writingAnswers[item.id]||{},good=current.ok===true,skipped=current.skipped===true;
  return '<div class="writing-item" data-writing-item="'+item.id+'">'+
   '<div class="qcounter">'+(i+1)+'/'+items.length+' · '+(item.kind==='vocabulary'?'Слово':'Предложение')+'</div>'+
   '<b class="writing-ru">'+esc(item.ru)+'</b>'+
   (good?'<div class="result"><span aria-label="Верно">✓</span> <span lang="en">'+esc(item.en)+'</span></div>':
    skipped?'<p class="tiny">Отложено для повторения</p>':
    '<div class="writing-inputrow"><input type="text" data-writing-answer="'+item.id+
    '" spellcheck="false" autocomplete="off" aria-label="Переведи на английский: '+esc(item.ru)+
    '" placeholder="Ответ на английском" value="'+esc(r.writingDrafts[item.id]||'')+'">'+
    '<button class="outline" data-writing-check="'+item.id+'">Проверить</button></div>'+
    (current.error?'<p class="result error" role="alert">Пока не совпало. Проверь правило или открой подсказку.</p>':''))+
   '</div>';
 }).join('');
 const correct=items.filter(x=>r.writingAnswers[x.id]?.ok).length,
  deferred=items.filter(x=>r.writingAnswers[x.id]?.skipped).length;
 return skillDialogPane(r)+
  '<section class="writing-lesson"><h3>Переведи на английский</h3>'+
  '<p class="tiny">Используй изученные слова и правила. Подсказка или пропуск отправят пример на повторение.</p>'+
  translation+
  (!r.steps[4]?'<p class="writing-summary tiny" role="status">Верно: '+correct+'/'+items.length+
    (deferred?' · На повторении: '+deferred:'')+'</p>':'')+
  '</section>';
};
// Completing all checked answers automatically marks the step.
// The only continue button belongs to lesson_flow.js.
const oldWire=wire,oldRender=render;
wire=function(){
 oldWire();
 if(page!=='lesson')return;
 document.querySelectorAll('[data-writing-answer]').forEach(input=>{
  input.oninput=()=>{
   const r=record(dayFocus);
   r.writingDrafts=r.writingDrafts||{};
   r.writingDrafts[input.dataset.writingAnswer]=input.value;save();
  };
  input.onkeydown=e=>{if(e.key==='Enter')document.querySelector('[data-writing-check="'+input.dataset.writingAnswer+'"]')?.click();};
 });
 document.querySelectorAll('[data-writing-check]').forEach(btn=>{
  btn.onclick=()=>{
   const id=btn.dataset.writingCheck,item=writingPrompts().find(x=>x.id===id);
   if(!item)return;
   const input=document.querySelector('[data-writing-answer="'+id+'"]');
   const answer=input?.value||'';
   const ok=item.kind==='vocabulary'?vocText(answer)===vocText(item.en):
     normalizeGrammar(answer)===normalizeGrammar(item.en);
   const r=record(dayFocus);
   r.writingAnswers=r.writingAnswers||{};
   r.writingAnswers[id]={ok,error:!ok};
   r.writingDrafts=r.writingDrafts||{};
   r.writingDrafts[id]=answer;
   save();updateWriting();
  };
 });
};
render=function(){
 if(page==='lesson'){
  const r=record(dayFocus);
  if(!r.steps[4]&&r.writingValidated===true&&ejSkills(r).dialogue.passed){
   markStep(4);return;
  }
 }
 oldRender();
};
window.EJWritingLesson={
 prompts:writingPrompts,
 skip:function(ref){
  const row=writingPrompts().find(x=>x.id===String(ref));
  if(!row)return;
  const r=record(dayFocus);
  r.writingAnswers=r.writingAnswers||{};
  r.writingAnswers[row.id]={ok:false,skipped:true};
  updateWriting();
 },
 complete:()=>passedWriting(record(dayFocus),writingPrompts()),
 meaning:turnMeaning
};
render();
})();