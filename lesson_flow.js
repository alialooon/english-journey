/* English Journey 13.4 — sequential lessons, no skipping between stage tabs.
 * Stage order: vocabulary -> theory+production -> quiz+reading -> dialog+writing.
 * Listening stays optional in the separate authentic-audio lab and exams.
 * No legacy progress is deleted, the localStorage key remains unchanged. */
(function(){
'use strict';
const FLOW=[
 {stage:1,title:'Слова и выражения',icon:'🃏',hint:'Сначала выучи нужные слова и вспомни их по памяти'},
 {stage:0,title:'Правило и фразы',icon:'📚',hint:'Теперь разберись в правиле и составь предложения'},
 {stage:3,title:'Тест и чтение',icon:'✏️',hint:'Проверь грамматику, слова и понимание текста'},
 {stage:4,title:'Диалог и письмо',icon:'🗣️',hint:'Примени новые знания в ситуации и собственном ответе'}
];
function stepIndex(record){
 if(!Number.isInteger(record.flowStep)||record.flowStep<0||record.flowStep>=FLOW.length){
  const first=FLOW.findIndex(x=>!record.steps[x.stage]);
  record.flowStep=first<0?FLOW.length-1:first;
  // Save happens on the next normal lesson action; do not mutate previously completed fields.
 }
 return record.flowStep;
}
const existingLesson=lesson,existingNextButton=nextButton,existingWire=wire,existingRender=render;
nextButton=function(next){return page==='lesson'?'':existingNextButton(next);};
lesson=function(){
 const u=courses[Math.floor(dayFocus/6)],day=dayFocus%6,r=record(dayFocus);
 const index=stepIndex(r),part=FLOW[index],mode=PROFILES[r.profile];
 stage=part.stage;
 const complete=Boolean(r.steps[part.stage]),finished=Boolean(r.doneAt);
 const completeCount=FLOW.reduce((n,p)=>n+Number(Boolean(r.steps[p.stage])),0);
 const segment=FLOW.map((item,i)=>{
  const done=Boolean(r.steps[item.stage]);
  return '<div class="journey-step '+(i===index?'active ':'')+(done?'completed':'')+
   '"'+(i===index?' aria-current="step"':'')+'>'+
   '<span class="journey-step-icon">'+(done?'✓':item.icon)+'</span>'+
   '<span class="journey-step-copy"><strong>'+esc(item.title)+'</strong>'+
   '<small>'+(done?'Выполнено':i===index?'Сейчас изучаем':'Впереди')+'</small></span></div>';
 }).join('');
 let work=part.stage===1?vocabPane(u,day,r):
          part.stage===0?theoryPane(u,day,r):
          part.stage===3?quizPane(u,day,r):speakingPane(u,day,r);
 // The old speaking view contains its own finished-lesson banner/navigation.
 // The new flow uses a single predictable button, not a second "next" action.
 if(part.stage===4)work=work.replace(/<div class="donebanner">🎉 Урок завершён[\s\S]*?<\/div>/,'');
 const last=index===FLOW.length-1;
 let action='';
 if(complete){
  action='<button class="primary dark journey-continue" data-journey-next="1">'+
   (last?(dayFocus%6===5?'Перейти к зачёту темы →':'Следующий урок →'):'Следующее задание →')+
   '</button>';
 }else{
  action='<button class="primary dark journey-continue" data-journey-next="1" disabled aria-disabled="true">Следующее задание →</button>'+
   '<p class="tiny journey-hint">Чтобы продолжить, выполни задания текущего шага. Простое нажатие кнопки без проверки не засчитывается.</p>';
 }
 const nextLabel=finished?'Урок выполнен ✓':completeCount+' из 4 шагов выполнено';
 return '<div class="lesson-head"><div><span class="pill">'+esc(u.level)+' · Неделя '+
  (Math.floor(dayFocus/6)+1)+' · Урок '+(day+1)+'</span><h2>'+esc(u.title)+'</h2>'+
  '<p>Шаг '+(index+1)+' из 4 · '+esc(part.title)+'</p></div>'+
  '<button class="outline" data-page="course">Все уроки</button></div>'+
  '<div class="session-meta">'+modeChip(r.profile)+
  ' <span class="pill">⏱ Активное время: <b id="session-time">'+duration(r.activeSeconds)+'</b></span>'+
  ' <span class="tiny">'+esc(mode.desc)+'</span></div>'+
  '<div class="progress"><div style="width:'+pct(completeCount,4)+'%"></div></div>'+
  '<p class="tiny journey-progress">'+nextLabel+
  ' · Порядок: слова → теория → тест → диалог</p>'+
  '<div class="journey-layout"><div class="journey-steps" aria-label="Последовательность обучения">'+segment+
  '</div><section class="panel learn journey-current" aria-label="Текущее задание">'+
  '<div class="journey-current-heading"><span class="pill">Этап '+(index+1)+'/4</span>'+
  '<p>'+esc(part.hint)+'</p></div>'+
  work+'<div class="journey-footer">'+action+'</div></section></div>'+
  '<div class="journey-bonus tiny">🎧 Аудирование необязательно. Отдельный практикум доступен в меню «Живое аудио и диалоги» и не влияет на переход к следующему уроку.</div>';
};
wire=function(){
 existingWire();
 if(page!=='lesson')return;
 // Old tabs have been replaced with non-clickable progress indicators.
 document.querySelectorAll('[data-journey-next]').forEach(button=>button.onclick=()=>{
  const r=record(dayFocus),pos=stepIndex(r),s=FLOW[pos].stage;
  if(!r.steps[s])return; // never allow advancing by clicking without completing the skill.
  if(pos<FLOW.length-1){r.flowStep=pos+1;save();render();window.scrollTo(0,0);return;}
  if(!r.doneAt)return;
  if(dayFocus%6===5){
   const t=nextTask();
   navigate(t.type==='exam'?'exam':'checkpoint');return;
  }
  openLesson(Math.min(total-1,dayFocus+1));
 });
};
render=function(){
 if(page==='lesson'){
  const r=record(dayFocus);
  stage=FLOW[stepIndex(r)].stage;
 }
 existingRender();
};
window.EnglishJourneyFlow={
 order:FLOW.map(x=>x.stage),
 current:()=>page==='lesson'?stepIndex(record(dayFocus)):null
};
render();
})();