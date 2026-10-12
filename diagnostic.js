/* English Journey 13.0 — offline-capable CEFR-inspired skill evidence.
   Original texts and fixed transparent local rubrics. NOT validated CEFR certification.
   Optional listening never gates lessons or exams. No external evaluation service. */
(function(){
'use strict';
if(typeof EJ13_TASKS==='undefined'||typeof store==='undefined'||EJ13_TASKS.length!==108){console.error('CEFR diagnostic bank unavailable');return;}
const LEVELS=['A1','A2','B1'];
const DOMAINS=[
 ['reading','Чтение и поиск информации'],
 ['practical','Практическая просьба'],
 ['grammar','Грамматическое построение'],
 ['interaction','Реакция в диалоге'],
 ['coherence','Связное высказывание'],
 ['problem','Решение ситуации']
];
const STORAGE_VERSION=2;
const MAX_CHARS=1600;
let selectedLevel='A1',flash='';
function ed(){
 if(!store.cefrDiagnostic||typeof store.cefrDiagnostic!=='object'||Array.isArray(store.cefrDiagnostic))store.cefrDiagnostic={};
 const data=store.cefrDiagnostic;
 if(!data.levels||typeof data.levels!=='object')data.levels={};
 if(!data.version)data.version=STORAGE_VERSION;
 for(const level of LEVELS){if(!data.levels[level]||typeof data.levels[level]!=='object')data.levels[level]={rounds:[],active:null};
  if(!Array.isArray(data.levels[level].rounds))data.levels[level].rounds=[];
 }
 return data;
}
function localDate(){return dateYMD(new Date())}
function shiftDays(ymd,offset){let d=localDay(ymd);return dateYMD(plusDays(d||new Date(),offset));}
function esc13(x){return esc(String(x??''))}
function normalize13(v){return String(v||'').normalize('NFKD').toLowerCase().replace(/\p{M}/gu,'').replace(/[’‘]/g,"'")
 .replace(/\bdon't\b/g,'do not').replace(/\bdoesn't\b/g,'does not').replace(/\bcan't\b/g,'cannot').replace(/\bi'm\b/g,'i am').replace(/\bwe're\b/g,'we are').replace(/\bit's\b/g,'it is')
 .replace(/[^a-z0-9:\s']/g,' ').replace(/\s+/g,' ').trim();}
function isMatch13(v,pattern){try{return new RegExp('(?:^|\\b)(?:'+pattern+')(?:\\b|$)','i').test(v)}catch(e){return false;}}
function evaluate13(task,input){
 // Local conservative rubric: two independent facts + appropriate form + sufficient useful language.
 // No claim of full semantic/grammar understanding; only explicit validated evidence is credited.
 const normalized=normalize13(input),tokens=normalized.match(/[a-z0-9]+(?:'[a-z]+)?/g)||[];
 const checks=task.checks.map(c=>({label:c.label,ok:c.patterns.some(p=>isMatch13(normalized,p))}));
 // In the first A1 reading task, naming the weekday alone is NOT the requested time.
 if(task.id==='A1-R-1'){
  const day=/\bfriday\b/.test(normalized),hour=/\b(?:five(?:\s*o'?clock)?|5(?::00)?(?:\s*pm)?)\b/.test(normalized);
  checks[1].ok=day&&hour;
  checks[1].label='пятница и время 5:00';
 }
 if(task.id==='A1-R-2')checks[1].ok=/\bdining room\b/.test(normalized);
 const form=task.forms.some(p=>isMatch13(normalized,p));
 const enough=tokens.length>=task.minWords;
 const lexical=tokens.filter(w=>!['a','an','the','i','you','we','he','she','it','is','are','was','were','and','to','of','in','on','for','at','do','does'].includes(w));
 const freq={};for(const t of lexical)freq[t]=(freq[t]||0)+1;
 const distinct=new Set(tokens).size;
 const repetitive=distinct<Math.min(7,Math.max(3,Math.ceil(task.minWords*0.52)))||
  Object.values(freq).some(count=>count>=5)||
  /\b(?:blah|asdf|qwerty|lorem|ipsum)\b/.test(normalized);
 const hasVerb=/\b(?:am|is|are|was|were|have|has|had|can|could|would|will|should|must|do|does|did|went|came|got|took|lost|want|wanted|need|needed|like|liked|prefer|preferred|book|booked|arrived|missed|called|contact|contacted|check|checked|give|gave|tell|told|help|helped|show|shown|change|changed|move|moved|visit|visited|pay|paid|buy|bought|choose|chose|decide|decided|plan|planned|go|going|get|getting|take|taking|meet|met|see|saw|live|lived|work|worked|eat|ate|drink|drank|stay|stayed|open|opens|close|closes|leave|leaves|start|starts|cost|costs|cancel|cancelled|delay|delayed|wait|waited|lost|found|receive|received|send|sent|offer|offered|learn|learned|realized|realised|speak|spoke|walk|walked|travel|travelled|be|been)\b/.test(normalized);
 const requiresVerb=(task.domain==='grammar'||(task.level==='B1'&&['interaction','coherence','problem','practical'].includes(task.domain)));
 const grammatical=!requiresVerb||hasVerb;
 const contextCopy=Boolean(task.context)&&normalize13(task.context).length>95&&normalized.includes(normalize13(task.context).slice(0,80));
 const complete=checks.every(x=>x.ok)&&form&&enough&&!repetitive&&grammatical&&!contextCopy;
 const points=checks.filter(x=>x.ok).length+Number(form)+Number(enough&&!repetitive&&grammatical&&!contextCopy);
 return {points:Math.min(4,points),pass:complete,checks,form,enough,repetitive:repetitive||contextCopy,grammatical,words:tokens.length};
}
function selectedData(){return ed().levels[selectedLevel]}
function getTask(level,domain,variant){return EJ13_TASKS.find(x=>x.level===level&&x.domain===domain&&x.variant===variant);}
function testTasks(level,roundIndex){return DOMAINS.map(([domain],i)=>{
 const variant=(roundIndex*2+i+3)%6;
 const row=getTask(level,domain,variant);
 if(!row)throw Error('Нет диагностического задания '+level+' '+domain);
 return row;
});}
function summary13(level){const obj=ed().levels[level],rounds=obj.rounds;
 let chain=0,previousDate=null;
 for(const r of rounds){if(r.passed){
   if(chain===0)chain=1;else if(previousDate&&r.date>previousDate)chain++;else chain=1;
   previousDate=r.date;
 }else{chain=0;previousDate=null;}}
 const last=rounds.at(-1),stable=chain>=3;
 const next=stable?null:(last?.passed?shiftDays(last.date,chain===1?7:30):last?shiftDays(last.date,2):null);
 return {chain,stable,next,last,attempts:rounds.length,active:!!obj.active,ready:!next||localDate()>=next};}
function start13(){const obj=selectedData(),s=summary13(selectedLevel);
 if(obj.active||s.stable||!s.ready)return;
 obj.active={date:localDate(),startedAt:new Date().toISOString(),ids:testTasks(selectedLevel,obj.rounds.length).map(x=>x.id),answers:{},cursor:0};
 flash='';save();render();}
function currentTask13(active){return EJ13_TASKS.find(t=>t.id===active.ids[active.cursor]);}
function saveAnswer13(){const obj=selectedData(),a=obj.active,t=a&&currentTask13(a);
 if(!a||!t||a.answers[t.id])return;
 const field=document.getElementById('ej13-answer');const value=(field?.value||'').trim();
 if(value.length<4){flash='Ответ слишком короткий. Напиши хотя бы несколько английских слов.';render();return;}
 if(value.length>MAX_CHARS){flash='Ответ слишком длинный для диагностического задания.';render();return;}
 a.answers[t.id]={text:value,result:evaluate13(t,value),date:new Date().toISOString()};flash='';save();render();}
function next13(){const obj=selectedData(),a=obj.active;if(!a)return;
 if(!a.answers[a.ids[a.cursor]])return;
 if(a.cursor<a.ids.length-1){a.cursor++;flash='';save();render();return;}
 const rows=a.ids.map(id=>({id,result:a.answers[id]?.result,text:a.answers[id]?.text||''}));
 const count=rows.filter(r=>r.result?.pass).length;
 const points=rows.reduce((n,r)=>n+(r.result?.points||0),0);
 const pass=count>=5 && points>=19 && rows.some(r=>r.id.includes('-R-')&&r.result?.pass) && rows.some(r=>r.id.includes('-S-')&&r.result?.pass);
 obj.rounds.push({date:localDate(),submittedAt:new Date().toISOString(),score:points,max:24,correctTasks:count,passed:pass,answers:rows});
 obj.active=null;flash=pass?'Этап диагностики выполнен. Устойчивость навыков проверим позже на других заданиях.':'Диагностика показала пробелы. Повтори их и пройди другой вариант позже.';
 save();render();}
function latestDomain(level,domain){const r=ed().levels[level].rounds.at(-1);return r?.answers?.find(x=>x.id.includes('-'+({reading:'R',practical:'P',grammar:'G',interaction:'I',coherence:'C',problem:'S'}[domain])+'-'))||null;}
function diagnosticCard(){const levels=LEVELS.map(level=>{const s=summary13(level);return `<div class="ej13-smallstat"><b>${level}</b><span>${s.stable?'Устойчиво в проверяемых заданиях':s.attempts?`Проверок ${s.attempts} · подряд ${s.chain}/3`:'Нет результатов'}</span></div>`}).join('');
 return `<div class="panel ej13-intro"><h3>🧭 Диагностика навыков A1–B1</h3><p>Незнакомые задания со свободными ответами. Проверка полностью локальная; аудирование добровольное и не влияет на учебный доступ.</p><div class="ej13-minirow">${levels}</div><button class="outline" data-page="cefr-diagnostic">Открыть диагностику →</button></div>`;}
function diagnosticView(){const obj=selectedData(),s=summary13(selectedLevel),a=obj.active;
 const root=`<div class="lesson-head"><div><span class="pill">Самостоятельная диагностика · офлайн</span><h2>🧭 Насколько устойчивы знания?</h2><p>Практические задания по принципам CEFR: чтение, просьбы, вопросы, грамматика, связность, решение ситуаций.</p></div><button class="outline" data-page="assessments">К зачётам →</button></div>`;
 const intro=`<div class="panel"><h3>Правила оценки</h3><p>За один этап — 6 новых заданий со свободным ответом, по одному на каждое умение. Максимум 24 балла; для зачёта этапа нужны не менее <b>19/24</b>, успешное решение хотя бы <b>5 из 6</b> задач, включая чтение и решение проблемы.</p><p>Повторная проверка другим вариантом — через 7 дней и ещё через 30 дней после успешных результатов. Неудачную попытку можно повторить через 2 дня. <b>Ни одна диагностическая попытка не закрывает дальнейшие уроки.</b></p><p class="tiny">Это прозрачная автоматическая проверка конкретных элементов ответа, а не полноценная экспертная оценка свободной речи. Уровень CEFR, письмо и аудирование в полном объёме не подтверждаются.</p></div>`;
 const nav=`<div class="panel"><div class="ej13-levels">${LEVELS.map(level=>`<button class="outline ${selectedLevel===level?'skill-active':''}" data-ej13-level="${level}">${level}</button>`).join('')}</div><div class="ej13-status"><b>${selectedLevel}: ${s.stable?'Три успешные проверки в разные дни':s.attempts?`Успешных проверок подряд ${s.chain}/3`:'Диагностика ещё не начата'}</b>${s.last?`<span>Последняя проверка: ${s.last.correctTasks}/6 задач · ${s.last.score}/24 балла</span>`:''}</div></div>`;
 let body='';
 if(a){const task=currentTask13(a),existing=a.answers[task.id],k=a.cursor;
  body=`<div class="panel ej13-task"><div class="ej13-progress"><span class="pill">Задание ${k+1} из ${a.ids.length}</span><span>${esc13(task.competency)}</span></div>${task.context?`<div class="reading-source" lang="en">${esc13(task.context)}</div>`:''}<h3>${esc13(task.prompt)}</h3><p class="tiny">Отвечай по-английски самостоятельно. В одной попытке каждый ответ можно отправить один раз, чтобы не превращать диагностику в подбор слов.</p>${existing?`<div class="ej13-result ${existing.result.pass?'ej13-good':'ej13-weak'}"><b>${existing.result.pass?'Задание зачтено':'Есть пробелы'} · ${existing.result.points}/4</b><p>${existing.result.checks.map(x=>`${x.ok?'✓':'○'} ${esc13(x.label)}`).join(' · ')}</p><p class="tiny">${existing.result.form?'✓ Подходящая конструкция':'○ Нужна более подходящая языковая конструкция'} · ${existing.result.enough&&!existing.result.repetitive?'✓ Достаточная развёрнутость':'○ Ответ слишком краток либо содержит повторы'}</p></div><button class="primary dark" data-ej13-next="1">${k===5?'Завершить этап →':'Следующее задание →'}</button>`:`<textarea id="ej13-answer" rows="4" maxlength="${MAX_CHARS}" placeholder="Your English answer ..." spellcheck="false"></textarea><button class="primary dark" data-ej13-submit="1">Сохранить ответ и проверить →</button>`}</div>`;
 }else{
  const enable=!s.stable&&s.ready;
  body=`<div class="panel"><h3>${s.stable?'Навыки устойчиво подтверждены в данном наборе заданий':enable?'Готов к следующему этапу?':'Повторное подтверждение пока не наступило'}</h3><p>${s.stable?'Три успешные проверки проводились в разные дни на разных вариантах. Это локальный показатель по ограниченному набору умений, не сертификация CEFR.':!enable?`Следующая проверка доступна ${esc13(s.next)}. До неё можно продолжать любые уроки и повторять материал.`:'Можно начать проверку сейчас. Она занимает примерно 12–20 минут.'}</p>${enable?'<button class="primary dark" data-ej13-start="1">Начать 6 самостоятельных заданий →</button>':''}</div>`;
 }
 const matrix=`<div class="panel"><h3>Матрица проверяемых умений ${selectedLevel}</h3><div class="ej13-skillgrid">${DOMAINS.map(([domain,title])=>{const evidence=latestDomain(selectedLevel,domain);return `<div class="ej13-skill"><b>${esc13(title)}</b><p>${evidence?`${evidence.result.pass?'✓ Подтверждено в последней проверке':'Нужно повторить'} · ${evidence.result.points}/4`:'Пока не проверено'}</p></div>`}).join('')}</div></div>`;
 const details=`<details class="panel"><summary>Что оценивается и чего эта проверка не умеет</summary><p>Правила ищут ключевые смысловые элементы, подходящую конструкцию и достаточную развёрнутость. Более свободные, но корректные формулировки иногда могут быть не распознаны. Случайный подбор слов тоже не полностью исключён.</p><p>Слушание реальных записей остаётся в дополнительном практикуме. Беглость устной речи и произношение здесь не оцениваются. Надёжность этой диагностики не проверена на группе учащихся и не откалибрована по экзаменам CEFR.</p><p>Все ответы и результаты хранятся в браузере под прежним ключом прогресса. Нет учётных записей, отправки текстов на наш сервер или обязательного ИИ.</p></details>`;
 return root+intro+nav+body+(flash?`<div class="notes">${esc13(flash)}</div>`:'')+matrix+details;
}
const prevRender=render,prevWire=wire,prevAssessments=assessmentsPage,prevRoadmap=roadmap;
wire=function(){prevWire();if(page!=='cefr-diagnostic')return;
 document.querySelectorAll('[data-ej13-level]').forEach(el=>el.onclick=()=>{selectedLevel=el.dataset.ej13Level;flash='';render()});
 document.querySelectorAll('[data-ej13-start]').forEach(el=>el.onclick=start13);
 document.querySelectorAll('[data-ej13-submit]').forEach(el=>el.onclick=saveAnswer13);
 document.querySelectorAll('[data-ej13-next]').forEach(el=>el.onclick=next13);
};
render=function(){if(page==='cefr-diagnostic'){header();document.getElementById('root').innerHTML=diagnosticView();wire();}else prevRender();};
assessmentsPage=function(){return prevAssessments()+diagnosticCard();};
roadmap=function(){return prevRoadmap()+diagnosticCard();};
window.EnglishJourneyCEFR13={tasks:EJ13_TASKS,grade:evaluate13,summary:summary13,start:start13,taskSet:testTasks};
ed();
render();
})();