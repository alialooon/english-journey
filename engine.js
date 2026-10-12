'use strict';
const labelDays=['Основы темы','Слова и фразы','Слушаем и понимаем','Строим предложения','Ситуация из поездки','Повторение и мини-тест'];
const STAGE_NAMES=['Теория','Словарь','Аудирование','Мини-тест','Речь и письмо'];
const STORAGE_KEY='englishJourneyTravelV1'; // Сохраняем совместимость с первой версией.
const APP_VERSION='11.1.0'; // Версия запущенного приложения; версия на Netlify хранится в version.json.
// Согласованная дата старта для личного плана (первый день — 12 октября 2026 года).
const PLAN_START_YMD='2026-10-12';
const A1_COURSE_WEEKS=25;
const A2_OPEN_WEEKS=25;
const total=courses.length*6;
const PROFILES={standard:{title:'Основной',desc:'Сбалансированные упражнения',questions:4,words:4},boost:{title:'Ускоренный',desc:'Больше новых слов и заданий',questions:6,words:6},review:{title:'Закрепление',desc:'Меньше нового, больше внимания ошибкам',questions:3,words:4}};
function readStore(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{}}catch(e){return {}}}
function freshStore(){return {started:null,planStartDate:PLAN_START_YMD,logs:{},history:{},checkpoints:{},exams:{},vocabulary:{},vocabDaily:{},preferences:{adaptive:true}}}
let store=Object.assign(freshStore(),readStore());
if(!store.logs || typeof store.logs!=='object'||Array.isArray(store.logs))store.logs={};
if(!store.history || typeof store.history!=='object'||Array.isArray(store.history))store.history={};
if(!store.preferences || typeof store.preferences!=='object')store.preferences={adaptive:true};
if(!store.checkpoints || typeof store.checkpoints!=='object')store.checkpoints={};
if(!store.exams || typeof store.exams!=='object')store.exams={};
// Для старых сохранений засчитываем прошлые пройденные темы, не удаляя прогресс.
if(!store.migratedTopicChecks){for(let w=0;w<courses.length;w++){if(store.logs[String((w+1)*6)]?.doneAt && !store.checkpoints[String(w)])store.checkpoints[String(w)]={passedAt:'legacy',attempts:[],legacy:true};}store.migratedTopicChecks=true;}

let checkpointViewWeek=null;let page='home',dayFocus=0,stage=0,message='',activeAt=performance.now(),lastActivity=performance.now(),saveSeconds=0;
const keyDay=i=>String(i);
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(store))}catch(e){message='Не удалось сохранить прогресс. Попробуй экспортировать резервную копию.'}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function pct(x,y){return y?Math.round(100*x/y):0}
function duration(sec){let m=Math.floor((sec||0)/60),s=Math.floor((sec||0)%60);return `${m}:${String(s).padStart(2,'0')}`}
function dateYMD(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function todayLabel(){return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',weekday:'long'}).format(new Date())}
// Прогноз — учебная модель, а не оценка владения английским по CEFR.
// A1: 150 уроков; затем первые 36 занятий A2; полный A2 и B1 в разработке.
const LEVEL_GOALS=[
 {level:'A1', title:'Уверенная начальная база', details:'Знакомство, кафе, покупки, просьбы, понимание речи и простое письмо.', weeks:25, units:150, label:'≈ 6 месяцев',available:true},
 {level:'A2', title:'Самостоятельные стандартные поездки', details:'Билеты, транспорт, отель, перенос брони и повседневные проблемы.', weeks:50, units:300, label:'≈ 12 месяцев',available:false},
 {level:'B1', title:'Уверенное общение без сценария', details:'Неподготовленные диалоги, объяснение сложных ситуаций и обсуждение решений.', weeks:100, units:600, label:'≈ 23 месяца',available:false}
];
const DAY_MS=86400000;
function localDay(raw){
 // Не превращаем пустой started: null в 01.01.1970.
 if(raw===null||raw===undefined||raw==='')return null;
 if(typeof raw==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw)){
  const [y,m,d]=raw.split('-').map(Number),v=new Date(y,m-1,d);
  return dateYMD(v)===raw?v:null;
 }
 const d=raw instanceof Date?raw:new Date(raw);
 return Number.isNaN(d.getTime())?null:new Date(d.getFullYear(),d.getMonth(),d.getDate());
}
function daysBetween(a,b){return Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/DAY_MS)}
function plusDays(d,n){const v=new Date(d.getFullYear(),d.getMonth(),d.getDate());v.setDate(v.getDate()+n);return v}
function ruDate(d){return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric'}).format(d)}
function timeLeft(days){
 if(days<=0)return '0 дней';
 // Округление только для удобства чтения. Исходные даты точные, календарные.
 const months=Math.floor(days/30.44),rem=Math.max(0,Math.round(days-months*30.44));
 if(months===0)return `≈ ${days} дн.`;
 return `≈ ${months} мес. ${rem} дн.`;
}
function normalizePlanAnchor(){
 const d=localDay(store.planStartDate);
 if(!d||d.getFullYear()<2020||d.getFullYear()>2100)store.planStartDate=PLAN_START_YMD;
}
normalizePlanAnchor();
function planStart(){return localDay(store.planStartDate)||localDay(PLAN_START_YMD)}
function paceEstimate(){
 const today=localDay(new Date()),start=planStart(),finished=doneCount();
 const elapsed=Math.max(0,daysBetween(start,today));
 const observedDays=Math.max(1,Math.min(28,elapsed+1));
 const since=plusDays(today,-27);
 const relevant=Object.values(store.logs).filter(r=>r?.doneAt).filter(r=>{
  const when=localDay(r.doneAt);return when&&when>=since&&when<=today&&when>=start;
 });
 const priorDays=21,priorWeekly=6;
 // Без выполненных уроков в день запуска показываем строго первоначальный план,
 // а не ложное отставание за счёт математического сглаживания.
 let weekly=(finished===0&&elapsed===0)?priorWeekly:(relevant.length+priorDays*priorWeekly/7)/(observedDays+priorDays)*7;
 const scores=relevant.filter(r=>Number.isFinite(r.firstAccuracy));
 let quality=1;
 if(scores.length>=3){
  const avg=scores.reduce((s,r)=>s+r.firstAccuracy,0)/scores.length;
  if(avg<.7)quality=.8;else if(avg<.82)quality=.92;
  if(scores.filter(r=>(r.quizAttempts||0)>1).length/scores.length>=.45)quality=Math.min(quality,.9);
 }
 weekly=Math.max(1.5,Math.min(18,weekly*quality));
 return {weekly,recent:relevant.length,observedDays:Math.max(0,elapsed+1),hasHistory:finished>0,lowEvidence:finished<6,quality};
}
function forecast(goal,pace){
 const start=planStart(),today=localDay(new Date()),finished=doneCount();
 const baseline=plusDays(start,goal.weeks*7);
 if(finished>=goal.units){
  const doneEntries=Object.values(store.logs).filter(r=>r?.doneAt).map(r=>new Date(r.doneAt)).filter(d=>!Number.isNaN(d.getTime())).sort((a,b)=>a-b);
  const actual=localDay(doneEntries[goal.units-1]||new Date());
  return {baseline,projected:actual,remaining:0,difference:daysBetween(baseline,actual),finished:true};
 }
 const remaining=Math.max(0,goal.units-finished);
 // До первого занятия (в день старта) прогноз обязан совпадать с исходной датой.
 const projected=(finished===0&&daysBetween(start,today)===0)?baseline:plusDays(today,Math.ceil(remaining/pace.weekly*7));
 return {baseline,projected,remaining,difference:daysBetween(baseline,projected),finished:false};
}
function trendText(diff){
 if(diff===0)return '<span class="eta-trend neutral">● По первоначальному плану</span>';
 if(diff<0)return `<span class="eta-trend faster">↗ Раньше плана на ${Math.abs(diff)} дн.</span>`;
 return `<span class="eta-trend slower">↘ Позже плана на ${diff} дн.</span>`;
}
function goalCard(goal,compact=false){
 const f=forecast(goal,paceEstimate());
 return `<div class="eta-card ${compact?'eta-mini':''}">
 <div class="eta-level"><strong>${goal.level}</strong><span>${goal.label}</span></div>
 <div class="eta-remain">${f.finished?(goal.level==='A1'&&store.exams.A1_full?.passedAt?'Учебный модуль и экзамен пройдены':'Уроки пройдены · нужен итоговый тест'):timeLeft(daysBetween(localDay(new Date()),f.projected))}</div>
 <div class="eta-sub">${f.finished?'Прогресс не равен официальному подтверждению уровня':`Осталось ${f.remaining} ${goal.available?'уроков':'плановых занятий'}`}</div>
 <div class="eta-dates"><div><span>Первоначальная дата</span><b>${ruDate(f.baseline)}</b></div><div><span>${f.finished?'Дата завершения':'По твоему темпу'}</span><b>${ruDate(f.projected)}</b></div></div>
 <div class="eta-bottom">${trendText(f.difference)}</div>
 ${!goal.available?'<p class="eta-caution">Уроки этого уровня пока не добавлены; расчёт предварительный.</p>':''}
 </div>`;
}

function streak(){const keys=Object.keys(store.history).filter(k=>store.history[k]>0);let s=0,d=new Date();if(!keys.includes(dateYMD(d)))d.setDate(d.getDate()-1);while(keys.includes(dateYMD(d))){s++;d.setDate(d.getDate()-1)}return s}
function existingRecord(i){return store.logs[keyDay(i)]||null}
function weekStats(week){
 const list=Array.from({length:6},(_,j)=>existingRecord(week*6+j)).filter(x=>x&&x.doneAt);
 const scored=list.filter(x=>Number.isFinite(x.firstAccuracy));
 const timed=list.filter(x=>Number.isFinite(x.activeSeconds)&&x.activeSeconds>=60);
 const avgAccuracy=scored.length?scored.reduce((v,x)=>v+x.firstAccuracy,0)/scored.length:null;
 const avgSeconds=timed.length?timed.reduce((v,x)=>v+x.activeSeconds,0)/timed.length:null;
 const retries=scored.filter(x=>(x.quizAttempts||0)>1).length;
 return {count:list.length,avgAccuracy,avgSeconds,scoredCount:scored.length,timedCount:timed.length,retries};
}
function pickProfile(week){
 if(!store.preferences.adaptive||week===0)return 'standard';
 const p=weekStats(week-1);
 if(p.count<6 || p.scoredCount<4)return 'standard';
 if(p.avgAccuracy<0.70 || p.retries>=3)return 'review';
 if(p.avgAccuracy>=0.85 && p.timedCount>=4 && p.avgSeconds<25*60 && p.retries<=1)return 'boost';
 return 'standard';
}
function profileFor(i){const r=existingRecord(i);return r?.profile&&PROFILES[r.profile]?r.profile:pickProfile(Math.floor(i/6))}
function record(i){
 if(!store.logs[keyDay(i)])store.logs[keyDay(i)]={steps:[false,false,false,false,false],answered:[],doneAt:null};
 const r=store.logs[keyDay(i)];
 if(!Array.isArray(r.steps)||r.steps.length!==5)r.steps=[false,false,false,false,false];
 if(!r.profile||!PROFILES[r.profile])r.profile=pickProfile(Math.floor(i/6));
 if(!Array.isArray(r.seenWords))r.seenWords=[];
 if(!Array.isArray(r.listened))r.listened=[];
 if(!r.quizDraft||typeof r.quizDraft!=='object')r.quizDraft={};
 if(!Number.isFinite(r.activeSeconds))r.activeSeconds=0;
 if(!Number.isInteger(r.quizAttempts))r.quizAttempts=0;
 ejSkills(r);
 return r;
}
function doneCount(){return Object.values(store.logs).filter(x=>x.doneAt).length}
function nextIndex(){let n=0;while(n<total&&store.logs[keyDay(n)]?.doneAt)n++;return Math.min(n,total-1)}
function navigate(p){if(p!=='checkpoint')checkpointViewWeek=null;else if(checkpointViewWeek===null&&nextTask().type==='topic')checkpointViewWeek=nextTask().week;page=p;document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===p));render();window.scrollTo(0,0)}
function openLesson(i){
 i=Math.max(0,Math.min(total-1,i));
 const next=nextIndex(), task=nextTask();
 if(i>next){alert('Урок пока закрыт. Сначала заверши предыдущие занятия и обязательную проверку темы.');navigate('course');return}
 if(!existingRecord(i)?.doneAt && task.type!=='lesson'){
  alert(task.type==='topic'?'Сначала сдай тест по завершённой теме.':'Сначала пройди обязательный экзамен соответствующего этапа.');navigate(task.type==='topic'?'checkpoint':'exam');return;
 }
 dayFocus=i;stage=0;if(!store.started)store.started=new Date().toISOString();record(dayFocus);save();activeAt=performance.now();lastActivity=performance.now();navigate('lesson');
}
function markStep(s){
 const r=record(dayFocus),skills=ejSkills(r);
 if(!r.steps[s]&&((s===0&&!skills.grammar.passed)||(s===2&&!skills.listening.passed)||(s===3&&(!skills.reading.passed||!skills.quizPassed))||(s===4&&!skills.dialogue.passed)))return;
 if(s===4&&!r.steps[4]&&(String(r.writingPractice||'').match(/[a-z]+(?:'[a-z]+)?/gi)||[]).length<8)return;if(r.steps[s]){render();return}r.steps[s]=true;
 if(r.steps.every(Boolean)&&!r.doneAt){r.doneAt=new Date().toISOString();if(!store.started)store.started=r.doneAt;let day=dateYMD(new Date());store.history[day]=(store.history[day]||0)+1;message='Урок завершён и сохранён автоматически!';}
 save();if(r.doneAt && dayFocus%6===5 && !store.checkpoints[String(Math.floor(dayFocus/6))]?.passedAt){navigate('checkpoint');return}render();
}
function trackActivity(){lastActivity=performance.now()}
['pointerdown','keydown','scroll','touchstart'].forEach(e=>document.addEventListener(e,trackActivity,{passive:true}));
function pulse(){
 const now=performance.now(),delta=Math.min(2,Math.max(0,(now-activeAt)/1000));activeAt=now;
 if(page==='lesson'&&document.visibilityState==='visible'&&document.hasFocus()&&now-lastActivity<180000){
  const r=record(dayFocus);if(!r.doneAt){r.activeSeconds+=delta;saveSeconds+=delta;if(saveSeconds>=5){save();saveSeconds=0}}
 }
 const time=document.getElementById('session-time');if(time)time.textContent=duration(existingRecord(dayFocus)?.activeSeconds||0);
}
setInterval(pulse,1000);window.addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{activeAt=performance.now();if(document.visibilityState==='visible')lastActivity=performance.now()});
function header(){document.getElementById('greet').textContent=todayLabel();document.getElementById('top-chip').textContent=`✦ ${courses[Math.floor(nextIndex()/6)].level} · ${doneCount()} из ${total}`;document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page))}
function render(){header();document.getElementById('root').innerHTML=page==='home'?home():page==='lesson'?lesson():page==='course'?course():page==='roadmap'?roadmap():page==='analytics'?analytics():page==='vocabulary'?vocabularyDashboard():page==='checkpoint'?checkpointPage():page==='exam'?examPage():page==='assessments'?assessmentsPage():settings();wire();vocabularyHandlers();skillsHandlers()}
function modeChip(mode){return `<span class="pill">Режим: ${PROFILES[mode].title}</span>`}
function home(){
 const n=nextIndex(),unit=courses[Math.floor(n/6)],done=doneCount(),week=Math.floor(n/6),w=weekStats(Math.max(0,week-1)),mode=profileFor(n);
 const days=Array.from({length:6},(_,j)=>{let i=week*6+j;return `<button class="daytile ${store.logs[keyDay(i)]?.doneAt?'complete':''} ${i===n?'current':''}" data-open="${i}"><span class="tiny">День ${j+1}</span><span class="dot">${store.logs[keyDay(i)]?.doneAt?'✓':j+1}</span><small>${['Пн','Вт','Ср','Чт','Пт','Сб'][j]}</small></button>`}).join('');
 return `<section class="hero"><div><div class="eyebrow">Твой английский для путешествий · адаптивное обучение</div><h1>Учись в собственном темпе ✨</h1><p>Урок рассчитан примерно на 40 минут, но закончить его можно и раньше. Результат и активное время учитываются автоматически.</p><button class="primary" data-open="${n}">${done?'Продолжить обучение':'Начать первый урок'} →</button></div><div class="hero-emoji">🧳</div></section>
 <div class="stats"><div class="stat"><div class="muted">Уроков завершено</div><strong>${done}<span style="font-size:15px;color:#acb5c9"> / ${total}</span></strong><small>Курс A1–B1</small></div><div class="stat"><div class="muted">Серия занятий</div><strong>${streak()} 🔥</strong><small>Дней подряд</small></div><div class="stat"><div class="muted">Текущий режим</div><strong style="font-size:19px">${PROFILES[mode].title}</strong><small>${store.preferences.adaptive?'Адаптация включена':'Адаптация выключена'}</small></div></div>
 ${homeNextSection(n,unit,week,mode)}
 ${vocabProgressPreview()}
 ${skillsOverview()}
 <div class="section-head"><h2>Когда достигнешь A1, A2 и B1</h2><button class="outline" data-page="roadmap">Все прогнозы →</button></div>
 <div class="eta-grid">${LEVEL_GOALS.map(g=>goalCard(g,true)).join('')}</div>
 <p class="tiny eta-note">Старт плана: ${ruDate(planStart())}. Исходные даты фиксированы; персональные меняются после уроков. A1 — 150 занятий, A2 — 150, B1 — 300. Уровни открываются после обязательных экзаменов.</p>
 <div class="section-head"><h2>Учебная неделя ${week+1}</h2><button class="outline" data-page="analytics">Мой прогресс →</button></div><div class="weekly">${days}</div><div class="panel" style="margin-top:16px"><b>Как приложение адаптируется?</b><p class="tiny">В конце 6 завершённых уроков оно анализирует точность первой попытки, повторные прохождения и активное время. Успеваешь быстро и правильно — следующая неделя становится насыщеннее; часто ошибаешься — включается закрепление. Только скорость не считается знанием.</p>${week>0&&w.count===6?`<div class="adapt-row"><span>Предыдущая неделя: ${pct(w.avgAccuracy||0,1)}% точности</span><span>${w.avgSeconds===null?'Время пока неизвестно':`В среднем ${duration(w.avgSeconds)}`}</span></div>`:''}</div><div class="footerhint">Можно проходить следующий урок сразу после предыдущего. Программа не заставляет ждать нового дня.</div>`;
}
function lesson(){
 const u=courses[Math.floor(dayFocus/6)],day=dayFocus%6,r=record(dayFocus),mode=PROFILES[r.profile],w=Math.floor(dayFocus/6)+1,percent=pct(r.steps.filter(Boolean).length,5);
 return `<div class="lesson-head"><div><span class="pill">${u.level} · Неделя ${w} · Урок ${day+1}</span><h2>${esc(u.title)}</h2><p>${labelDays[day]} · План 40 минут, закончить можно раньше</p></div><button class="outline" data-page="course">Все уроки</button></div>
 <div class="session-meta">${modeChip(r.profile)} <span class="pill">⏱ Активное время: <b id="session-time">${duration(r.activeSeconds)}</b></span><span class="tiny">${esc(mode.desc)}</span></div>
 <div class="progress"><div style="width:${percent}%"></div></div><div class="tiny">${r.steps.filter(Boolean).length} из 5 шагов ${r.doneAt?'· Урок пройден ✓':''}</div>
 ${r.doneAt?`<div class="donebanner">✓ Урок завершён за ${duration(r.activeSeconds)} активного времени. ${Number.isFinite(r.firstAccuracy)?`Первая попытка: ${pct(r.firstAccuracy,1)}%.`:''} ${dayFocus+1<total?`<button class="outline" ${dayFocus%6===5?'data-page="checkpoint"':`data-open="${dayFocus+1}"`}>${dayFocus%6===5?'Проверка темы →':'Следующий урок →'}</button>`:''}</div>`:''}
 ${r.profile==='review'?`<div class="notes" style="margin-top:13px">На этой неделе режим закрепления: сначала повторяй правило, затем проходи короткий тест. Скорость не важнее понимания.</div>`:''}
 <div class="lessongrid"><div class="stepmenu">${STAGE_NAMES.map((name,i)=>`<button class="stepbtn ${i===stage?'selected':''} ${r.steps[i]?'done':''}" data-stage="${i}"><span class="stepicon">${r.steps[i]?'✓':['📚','🃏','🎧','✏️','🗣️'][i]}</span><span class="steptext">${name}</span></button>`).join('')}</div><div class="panel learn">${stage===0?theoryPane(u,day,r):stage===1?vocabPane(u,day,r):stage===2?listenPane(u,day,r):stage===3?quizPane(u,day,r):speakingPane(u,day,r)}</div></div>`;
}
function nextButton(i){return `<button class="outline" data-stage="${i}">Следующий шаг →</button>`}
function theoryPane(u,day,r){let alphabet=dayFocus===0?`<div class="ex"><b>Английский алфавит — 26 букв</b><span style="font-size:16px;line-height:2">A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</span><div class="tiny">Произнеси буквы вслух и попробуй продиктовать своё имя.</div></div>`:'';
 return `<div class="split"><span class="pill">Шаг 1 · ориентир 8 мин</span>${r.steps[0]?'✅ Готово':''}</div><h3>${day===0?'Знакомимся с темой':day===5?'Вспоминаем главное':labelDays[day]+': основное правило'}</h3><p>${esc(u.grammar)}</p><p>${esc(u.theory)}</p><div class="notes"><b>Формула:</b> ${esc(u.rule)}</div>${alphabet}<h4>Примеры</h4>${u.examples.map(pair=>`<div class="ex"><b>${esc(pair[0])}</b><span>${esc(pair[1])}</span></div>`).join('')}<p class="disclaimer">Прочитай правило и затем составь две фразы по памяти. Письменные предложения проверяются на совпадение с заданной моделью.</p>${skillGrammarPane(r)}<div class="split"><button class="primary dark" data-mark="0" ${!r.steps[0]&&!ejSkills(r).grammar.passed?'disabled':''}>${r.steps[0]?'✓ Прочитано':'Я изучил(а) правило ✓'}</button>${r.steps[0]?nextButton(1):''}</div>`;
}
function vocabPane(u,day,r){return vocabularyLessonPane(u,day,r,dayFocus)}
function listenPane(u,day,r){return skillAudioPane(r)}

function qlist(u,day,profile){const start=(day*2)%u.quiz.length;return Array.from({length:PROFILES[profile].questions},(_,i)=>u.quiz[(start+i)%u.quiz.length])}
function scoreDraft(questions,r){return questions.reduce((s,q,i)=>s+(Number(r.quizDraft[i])===q[2]?1:0),0)}
function quizPane(u,day,r){const questions=qlist(u,day,r.profile),keys=Object.keys(r.quizDraft),answered=keys.length,score=scoreDraft(questions,r),need=Math.ceil(questions.length*0.72),skills=ejSkills(r);
 return `<div class="split"><span class="pill">Шаг 4 · ориентир 10 мин</span>${r.steps[3]?'✅ Зачёт':''}</div><h3>Грамматика и слова: мини-тест</h3><p>Сначала реши ${questions.length} вопросов (${need} правильных для зачёта). Затем прочитай реальный бытовой текст и ответь на вопросы к нему. Оба результата обязательны.</p>
 ${questions.map((q,i)=>{let chosen=r.quizDraft[i];return `<div class="questiongroup"><div class="qcounter">Вопрос ${i+1} из ${questions.length}</div><div class="question">${esc(q[0])}</div>${q[1].map((opt,j)=>`<button class="choice ${chosen!==undefined&&j===q[2]?'correct':chosen===j&&j!==q[2]?'incorrect':''}" data-answer="${i}:${j}" ${chosen!==undefined?'disabled':''}>${String.fromCharCode(65+j)}. ${esc(opt)} ${chosen!==undefined&&j===q[2]?'✓':''}</button>`).join('')}</div>`}).join('')}
 ${answered===questions.length?`<div class="result ${score<need?'error':''}">Результат: ${score}/${questions.length}. ${score>=need?'Мини-тест зачтён.':'Повтори правило.'}</div>${score<need?'<button class="outline" data-resetquiz="1">Повторить мини-тест ↻</button>':''}`:`<div class="tiny">Ответов: ${answered}/${questions.length}</div>`}
 ${skillReadingPane(r)}
 ${skills.quizPassed&&skills.reading.passed?`<div class="donebanner">✓ Оба блока зачтены. ${nextButton(4)}</div>`:''}
 ${r.quizAttempts?`<p class="tiny">Попыток теста: ${r.quizAttempts} · точность первой: ${pct(r.firstAccuracy||0,1)}%</p>`:''}`;
}

function speakingPane(u,day,r){
 const p=u.dialog[(day+2)%3],text=String(r.writingPractice||''),enWords=text.match(/[a-z]+(?:'[a-z]+)?/gi)||[];
 const complete=enWords.length>=8;
 const lines=u.dialog.map(x=>x[0]).join(' ');
 return `<div class="split"><span class="pill">Шаг 5 · ориентир 8 мин</span>${r.steps[4]?'✅ Готово':''}</div><h3>Читаем, пишем и говорим</h3><p>Прочитай мини-диалог и попробуй передать смысл своими словами. Затем произнеси собственный ответ вслух и напиши минимум 8 английских слов по теме урока.</p><div class="ex"><b>Мини-диалог</b><span>${esc(lines)}</span></div><div class="notes"><b>Фраза для практики:</b> ${esc(p[0])} — ${esc(p[1])}</div>${skillDialogPane(r)}<textarea class="writing-practice" id="lesson-writing" rows="3" placeholder="Напиши свой ответ на английском..." ${r.steps[4]?'readonly':''}>${esc(text)}</textarea><div class="tiny">Написано ${enWords.length} английских слов из 8. Текст сохраняется; автоматической проверки смысла и грамматики пока нет.</div><p class="disclaimer">Произнеси ответ вслух. Приложение не распознаёт речь и не оценивает произношение. Подтверди упражнение самостоятельно.</p><button class="primary dark" data-mark="4" ${(!complete||!ejSkills(r).dialogue.passed)&&!r.steps[4]?'disabled':''}>${r.steps[4]?'✓ Чтение, письмо и речь выполнены':'Я написал(а) текст и проговорил(а) ответ ✓'}</button>${r.steps[4]&&r.steps.every(Boolean)?`<div class="donebanner">🎉 Урок завершён за ${duration(r.activeSeconds)}. ${dayFocus+1<total?`<button class="outline" ${dayFocus%6===5?'data-page="checkpoint"':`data-open="${dayFocus+1}"`}>${dayFocus%6===5?'Проверка темы →':'Следующий урок →'}</button>`:''}</div>`:''}`;
}
function course(){return `<div class="lesson-head"><div><span class="pill">${total} занятий · ${courses.length} недель</span><h2>Твоя учебная программа</h2><p>Уроки можно проходить быстрее календаря — ограничений по дням нет</p></div><button class="outline" data-open="${nextIndex()}">Продолжить →</button></div><div class="section-head"><h2>A0–A1: полный учебный модуль · A2: первые шесть тем</h2></div><div class="weeks">${courses.map((w,i)=>{let count=Array.from({length:6},(_,j)=>i*6+j).filter(n=>existingRecord(n)?.doneAt).length;let mode=profileFor(i*6);return `<button class="week" data-open="${i*6}" ${i*6>nextIndex()?'disabled title="Сначала сдай предыдущие темы"':''}><span class="mini">${w.level} · Неделя ${i+1} · ${PROFILES[mode].title}</span><h3>${esc(w.title)}</h3><p>${esc(w.grammar)}</p><div class="progress"><div style="width:${pct(count,6)}%"></div></div><small class="tiny">${count}/6 уроков · ${store.checkpoints[String(i)]?.passedAt?'✓ Тема зачтена':count===6?'🔒 Нужен тест по теме':'Тест после 6 уроков'}</small></button>`}).join('')}</div><p class="footerhint">Доступны 150 занятий A1 и первые 36 занятий A2 (всего 186). Для входа в A2 нужен итоговый экзамен A1. Это внутреннее обучение, не сертификат CEFR. Остальные A2 и B1 будут добавлены позже.</p>`}
function roadmap(){
 const pace=paceEstimate();
 return `<div class="lesson-head"><div><span class="pill">Цель — уверенный B1</span><h2>Путь к самостоятельным путешествиям</h2><p>Две даты для каждого уровня: первоначальная и с учётом твоей скорости</p></div></div>
 <div class="panel eta-overview"><div><b>Текущий расчётный темп: ${pace.weekly.toFixed(1).replace('.',',')} урока в неделю</b><p class="tiny">Ориентир — 6 уроков в неделю. ${pace.hasHistory?`За последние ${pace.observedDays} дн.: ${pace.recent} завершённых уроков.`:'Пока нет пройденных уроков, прогноз совпадает с исходным планом.'} ${pace.lowEvidence?'Первый прогноз приблизительный: данных пока немного.':''}</p></div><span class="pill">Учимся до 40 минут за урок</span></div>
 <div class="road"><div class="roadrow"><div class="round">A0</div><div><b>Основа · 150 уроков A1 + 36 уроков A2</b><p>Две части A1: первые 72 занятия и дальнейшие 78 занятий. Переход к расширенному блоку требует промежуточного экзамена.</p><span class="pill">Доступно сейчас</span></div></div>
 ${LEVEL_GOALS.map(goal=>`<div class="roadrow road-goal"><div class="round">${goal.level}</div><div class="road-goal-content"><b>${goal.title}</b><p>${goal.details}</p>${goalCard(goal)}</div></div>`).join('')}</div>
 ${assessmentBanner()}
 ${futureCurriculumPanel()}
 <p class="disclaimer">Первоначальные ориентиры основаны на примерных часах обучения Cambridge и нагрузке до 40 минут 6 раз в неделю: A1 — 25 недель (150 плановых занятий), A2 — 50 недель (300), B1 — 100 недель (600). Готовы 150 занятий A1 и первые 36 занятий A2. Остальные 114 плановых занятий A2 и весь B1 пока отсутствуют, поэтому сроки ориентировочные. Прогноз пересчитывается по выполненным урокам (несколько в день учитываются отдельно) и качеству ответов, с защитой от резких колебаний в первые дни. Время в уроке не является доказательством усвоения языка. Реальный уровень нужно подтвердить аудированием, говорением и проверкой знаний.</p>`;
}
function futureCurriculumPanel(){
 return `<div class="section-head"><h2>Последующие ступени: A2 и B1</h2></div><p class="tiny">Первые 6 недель A2 доступны после A1. Остальные темы A2 и весь B1 представлены только планом: без проверенных уроков не считаются пройденными.</p>`+
 ['A2','B1'].map(level=>`<details class="panel syllabus-panel"><summary><b>${level} — ${FUTURE_SYLLABUS[level].length} тематических недель</b> · показать программу</summary><div class="syllabus-list">${FUTURE_SYLLABUS[level].map((item,i)=>`<div class="syllabus-item"><span class="pill">${level} · ${i+1}${level==='A2'&&i<A2_OPEN_WEEKS?' · доступно':''}</span><strong>${esc(item[0])}</strong><small>${esc(item[1])} · ${esc(item[2])}</small></div>`).join('')}</div></details>`).join('');
}
function analytics(){let weeks=courses.map((x,i)=>({...weekStats(i),week:i}));const done=doneCount(),w=Math.floor(nextIndex()/6), current=Math.min(w,courses.length-1),mode=profileFor(nextIndex()),totalSec=Object.values(store.logs).reduce((s,r)=>s+(Number(r.activeSeconds)||0),0);
 return `<div class="lesson-head"><div><span class="pill">Адаптация каждые 6 уроков</span><h2>Результаты и скорость</h2><p>Время измеряется по активности в открытом уроке; простой вкладки и время вне приложения не считаются.</p></div></div><div class="stats"><div class="stat"><div class="muted">Завершено</div><strong>${done}</strong><small>Уроков</small></div><div class="stat"><div class="muted">Учебное время</div><strong>${Math.round(totalSec/60)} мин</strong><small>Приблизительно, по активности</small></div><div class="stat"><div class="muted">Следующий режим</div><strong style="font-size:19px">${PROFILES[mode].title}</strong><small>${store.preferences.adaptive?'Адаптивно':'Стандартный'}</small></div></div>
 <div class="section-head"><h2>Прогноз по уровням</h2><button class="outline" data-page="roadmap">Подробно →</button></div><div class="eta-grid">${LEVEL_GOALS.map(g=>goalCard(g,true)).join('')}</div>
 <p class="tiny eta-note">Базовая скорость — 6 уроков в неделю. Завершённые уроки, а не дни занятий, влияют на прогноз. Если результатов пока мало, расчёт сглаживается. Отсчёт ведётся с 12 октября 2026 года.</p>
 <div class="panel"><h3>Как приложение принимает решение</h3><p class="tiny">После шести завершённых уроков сравниваются правильные ответы в первой попытке, число пересдач и среднее активное время. При ≥85% верных ответов, среднем времени менее 25 минут и не более одной пересдачи добавляется нагрузка. При &lt;70% или трёх и более пересдачах включается закрепление. Иначе остаётся базовый режим.</p><p class="tiny">Если на старых уроках нет данных времени и оценки — ускорение не включается автоматически. Режим закрепления никогда не назначается просто из-за долгого прохождения.</p></div>
 <div class="section-head"><h2>Отчёты по неделям</h2></div><div class="report-grid">${weeks.filter(x=>x.count>0).map(x=>`<div class="report"><div class="split"><b>Неделя ${x.week+1}</b><span class="pill">${x.count}/6</span></div><div class="metric">Точность первой попытки: <b>${x.avgAccuracy===null?'нет данных':pct(x.avgAccuracy,1)+'%'}</b></div><div class="metric">Среднее активное время: <b>${x.avgSeconds===null?'нет данных':duration(x.avgSeconds)}</b></div><div class="metric">Повторные попытки: <b>${x.retries}</b></div>${x.count===6&&x.week+1<courses.length?`<div class="notes">Следующая неделя: ${PROFILES[pickProfile(x.week+1)].title}</div>`:''}</div>`).join('')||'<div class="empty">Здесь появятся результаты после первых завершённых уроков.</div>'}</div>`;
}
function settings(){return `<div class="lesson-head"><div><span class="pill">Данные и управление</span><h2>Настройки</h2><p>Здесь можно скачать резервную копию и управлять адаптацией.</p></div></div><div class="panel"><h3>Обновления без скачивания</h3><p class="muted" style="font-size:14px">Версия приложения: <b>${APP_VERSION}</b>. Новые версии публикуются на том же адресе через GitHub Pages после обновления репозитория. Во время занятия обновление не прерывает работу: можно закончить урок и обновить страницу.</p><div class="toolbar"><button class="outline" id="check-update">↻ Проверить обновления</button><span class="tiny" id="update-status">Проверим версию на сайте.</span></div><hr style="border:0;border-top:1px solid var(--stroke);margin:20px 0"><h3>Как измеряется прогресс</h3><p class="tiny">600 плановых занятий A1–B1 не являются сертифицированным подтверждением уровня. Прогнозы по A1, A2, B1 основаны на приблизительных объёмах обучения; до проверки устной речи, аудирования, чтения и письма они не подтверждают уровень CEFR.</p><h3>Адаптация программы</h3><label class="switchline"><input id="adaptive" type="checkbox" ${store.preferences.adaptive?'checked':''}><span><b>Автоматически подстраивать следующие недели</b><br><span class="tiny">Точность важнее скорости; новую нагрузку приложение назначает после завершения учебной недели. Уже начатые уроки сохраняют свой режим.</span></span></label><p class="tiny">Ориентир одного урока — около 40 минут, но завершение не зависит от таймера. Можно проходить больше одного урока за день. Плановый старт: ${ruDate(planStart())}; первоначальные даты рубежей сохраняются от него. Дата начала плана фиксирована и не зависит от числа пройденных уроков.</p><hr style="border:0;border-top:1px solid var(--stroke);margin:20px 0"><h3>Резервное копирование</h3><p class="muted" style="font-size:14px">Прогресс хранится на этом устройстве в локальном хранилище браузера. Синхронизации аккаунта нет. При очистке данных браузера прогресс может исчезнуть.</p><div class="toolbar"><button class="primary dark" id="export">↓ Скачать прогресс (.json)</button><label class="outline" style="cursor:pointer;display:inline-flex">↑ Восстановить из файла<input id="import" type="file" accept=".json,application/json" style="display:none"></label></div><hr style="border:0;border-top:1px solid var(--stroke);margin:20px 0"><button class="outline" id="reset" style="color:#bd5364">Сбросить прогресс</button></div>`}
function finishQuiz(r,u,d){const qs=qlist(u,d,r.profile),score=scoreDraft(qs,r),accuracy=score/qs.length,need=Math.ceil(qs.length*.72);r.quizAttempts++;if(!Number.isFinite(r.firstAccuracy))r.firstAccuracy=accuracy;r.bestAccuracy=Math.max(r.bestAccuracy||0,accuracy);if(score>=need)ejSkills(r).quizPassed=true;save();if(score>=need&&ejSkills(r).reading.passed)markStep(3);else render()}
function markListened(i){const r=record(dayFocus);if(!r.listened.includes(i))r.listened.push(i);save();if(r.listened.includes(0)&&r.listened.includes(1))markStep(2);else render()}
function wire(){
 document.querySelectorAll('[data-page]').forEach(x=>x.onclick=()=>navigate(x.dataset.page));
 document.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>openLesson(+x.dataset.open));
 document.querySelectorAll('[data-stage]').forEach(x=>x.onclick=()=>{stage=+x.dataset.stage;render()});
 document.querySelectorAll('[data-mark]').forEach(x=>x.onclick=()=>markStep(+x.dataset.mark));
 document.querySelectorAll('[data-say]').forEach(x=>x.onclick=()=>{const i=+x.dataset.say,u=courses[Math.floor(dayFocus/6)],d=dayFocus%6,arr=[u.dialog[d%3],u.dialog[(d+1)%3]];if(!('speechSynthesis'in window)){alert('Синтез речи недоступен. Открой внешний урок по ссылке и после него нажми кнопку подтверждения.');return}try{window.speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(arr[i][0]);utter.lang='en-US';utter.rate=.8;utter.onend=()=>markListened(i);utter.onerror=()=>alert('Не удалось воспроизвести речь. Используй внешний урок ниже.');window.speechSynthesis.speak(utter)}catch(e){alert('Синтез речи недоступен. Воспользуйся внешним аудиоуроком.')}});
 document.querySelectorAll('[data-listen-manual]').forEach(x=>x.onclick=()=>markStep(2));
 document.querySelectorAll('[data-answer]').forEach(x=>x.onclick=()=>{const [i,j]=x.dataset.answer.split(':').map(Number),r=record(dayFocus);if(r.quizDraft[i]!==undefined)return;r.quizDraft[i]=j;save();const u=courses[Math.floor(dayFocus/6)],d=dayFocus%6,qs=qlist(u,d,r.profile);if(Object.keys(r.quizDraft).length===qs.length)finishQuiz(r,u,d);else render()});
 const write=document.getElementById('lesson-writing');if(write)write.oninput=e=>{const r=record(dayFocus);r.writingPractice=e.target.value;save();const b=document.querySelector('[data-mark="4"]');if(b)b.disabled=(String(e.target.value).match(/[a-z]+(?:'[a-z]+)?/gi)||[]).length<8||!ejSkills(r).dialogue.passed};
 document.querySelectorAll('[data-resetquiz]').forEach(x=>x.onclick=()=>{const r=record(dayFocus);r.quizDraft={};save();render()});
 const exp=document.getElementById('export');if(exp)exp.onclick=()=>{save();const blob=new Blob([JSON.stringify({version:4,exportedAt:new Date().toISOString(),data:store},null,2)],{type:'application/json'}),href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download='english-journey-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(href),3000)};
 const imp=document.getElementById('import');if(imp)imp.onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const parsed=JSON.parse(await file.text());if(!parsed.data||!parsed.data.logs||typeof parsed.data.logs!=='object'||!parsed.data.history)throw Error('Неверный файл');if(!confirm('Восстановление заменит текущий прогресс, включая экзамены и зачёты. Продолжить?'))return;store=Object.assign(freshStore(),parsed.data);store.preferences=Object.assign({adaptive:true},store.preferences||{});store.checkpoints=store.checkpoints||{};store.exams=store.exams||{};normalizePlanAnchor();if(!store.migratedTopicChecks){for(let w=0;w<courses.length;w++){if(store.logs[String((w+1)*6)]?.doneAt && !store.checkpoints[String(w)])store.checkpoints[String(w)]={passedAt:'legacy',attempts:[],legacy:true};}store.migratedTopicChecks=true;}save();alert('Прогресс восстановлен');navigate('home')}catch(err){alert('Невозможно прочитать резервную копию: '+err.message)}};
 const reset=document.getElementById('reset');if(reset)reset.onclick=()=>{if(confirm('Удалить весь прогресс? Без резервной копии его нельзя вернуть.')){store=freshStore();save();navigate('home')}};
 const adaptive=document.getElementById('adaptive');if(adaptive)adaptive.onchange=e=>{store.preferences.adaptive=e.target.checked;save();render()};
 const checkUpdate=document.getElementById('check-update');if(checkUpdate)checkUpdate.onclick=async()=>{const st=document.getElementById('update-status');if(st)st.textContent='Проверяем...';const result=await checkForUpdates();if(st)st.textContent=result==='new'?'Новая версия готова!':'У тебя актуальная версия или проверка временно недоступна.'};
 
 document.querySelectorAll('[data-resume]').forEach(x=>x.onclick=()=>{const t=nextTask();if(t.type==='lesson')openLesson(t.index);else navigate(t.type==='exam'?'exam':t.type==='topic'?'checkpoint':'roadmap')});
 document.querySelectorAll('[data-check-open]').forEach(x=>x.onclick=()=>{const w=Number(x.dataset.checkOpen);if(!daysReady(w))return;const task=nextTask();if(task.type==='topic'&&task.week!==w&&!testsFor(w).passedAt){alert('Сначала пройди предыдущий зачёт.');return}checkpointViewWeek=w;navigate('checkpoint')});
 document.querySelectorAll('[data-topic-answer]').forEach(x=>x.onclick=()=>{const task=nextTask(),w=Number.isInteger(checkpointViewWeek)?checkpointViewWeek:task.week;if(task.type!=='topic'&&testsFor(w).passedAt)return;const rec=testsFor(w),cur=rec.current;if(!cur||readyTomorrow(rec.retryAfter))return;const [i,j]=x.dataset.topicAnswer.split(':').map(Number);cur.answers[i]=j;save();render()});
 document.querySelectorAll('[data-topic-submit]').forEach(x=>x.onclick=submitTopic);
 document.querySelectorAll('[data-remedy-answer]').forEach(x=>x.onclick=()=>{const task=nextTask();if(task.type!=='topic')return;const rec=testsFor(task.week),r=rec.remediation;if(!r||r.passedAt)return;const [i,j]=x.dataset.remedyAnswer.split(':').map(Number);r.answers[i]=j;save();render()});
 document.querySelectorAll('[data-remedy-submit]').forEach(x=>x.onclick=submitRemediation);
 document.querySelectorAll('[data-exam-answer]').forEach(x=>x.onclick=()=>{const c=examRecord().current;if(!c)return;const [i,j]=x.dataset.examAnswer.split(':').map(Number);c.answers[i]=j;save();render()});
 document.querySelectorAll('[data-assess-speak]').forEach(x=>x.onclick=()=>{const isExam=page==='exam';const t=nextTask(),qs=isExam?examRecord().current?.questions:testsFor(t.week).current?.questions;const q=qs?.[Number(x.dataset.assessSpeak)];if(!q||!q.spoken)return;if(!('speechSynthesis'in window)){alert('Голосовой синтез недоступен в этом браузере. Можно выбрать другой браузер или воспользоваться внешним материалом.');return}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(q.spoken);u.lang='en-US';u.rate=.83;speechSynthesis.speak(u)}catch(e){alert('Не удалось воспроизвести фразу.')}});
 const writing=document.getElementById('exam-writing');if(writing)writing.oninput=e=>{const c=examRecord().current;if(c){c.writing=e.target.value;save();const sub=document.querySelector('[data-exam-submit]');if(sub)sub.disabled=Object.keys(c.answers).length!==c.questions.length||!c.speaking||c.writing.trim().length<40;}};
 const speaking=document.getElementById('exam-speaking');if(speaking)speaking.onchange=e=>{const c=examRecord().current;if(c){c.speaking=e.target.checked;save();const sub=document.querySelector('[data-exam-submit]');if(sub)sub.disabled=Object.keys(c.answers).length!==c.questions.length||!c.speaking||c.writing.trim().length<40;}};
 document.querySelectorAll('[data-exam-next]').forEach(x=>x.onclick=()=>{const c=examRecord().current;if(c&&Array.from({length:18},(_,i)=>c.answers[i]!==undefined).every(Boolean)){c.part=1;save();render();window.scrollTo(0,0)}});
 document.querySelectorAll('[data-exam-back]').forEach(x=>x.onclick=()=>{const c=examRecord().current;if(c){c.part=0;save();render();window.scrollTo(0,0)}});
 document.querySelectorAll('[data-exam-submit]').forEach(x=>x.onclick=submitExam);

}

// ===== Проверки знаний: тематические зачёты и внутренний экзамен A1 =====
const CHECKPOINT_PASS=.80;
const FINAL_PASS=.80;
const OFFICIAL_LINKS={
 A1:'https://www.cambridgeenglish.org/exams-and-tests/qualifications/young-learners/paper/movers/preparation/',
 A2:'https://www.cambridgeenglish.org/exams-and-tests/qualifications/key/preparation/',
 B1:'https://www.cambridgeenglish.org/exams-and-tests/qualifications/preliminary/preparation/'
};
function testsFor(week){
 if(!store.checkpoints[String(week)])store.checkpoints[String(week)]={attempts:[],passedAt:null,current:null};
 return store.checkpoints[String(week)];
}
function examMode(){const t=nextTask();return (t.type==='exam'&&t.level==='A1_full')||nextIndex()>=A1_COURSE_WEEKS*6?'A1_full':'A1'}
function examRecord(){const mode=examMode();if(!store.exams[mode])store.exams[mode]={attempts:[],passedAt:null,current:null};return store.exams[mode]}
function daysReady(w){return Array.from({length:6},(_,i)=>existingRecord(w*6+i)?.doneAt).every(Boolean)}
function nextTask(){
 for(let w=0;w<courses.length;w++){
  if(w===12&&!store.exams.A1?.passedAt)return {type:'exam',level:'A1'};
  if(w===A1_COURSE_WEEKS&&!store.exams.A1_full?.passedAt)return {type:'exam',level:'A1_full'};
  if(daysReady(w)&&!store.checkpoints[String(w)]?.passedAt)return {type:'topic',week:w};
  if(!daysReady(w))return {type:'lesson',index:nextIndex()};
 }
 return {type:'awaitingContent',level:'A2',completedUnits:total};
}
function seedHash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function prng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
function shuffleItems(arr,rand){let a=[...arr];for(let i=a.length-1;i>0;i--){let j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function makeQuestion(id,type,prompt,correct,others,review,spoken=''){
 let opts=[correct,...others.filter(x=>x!==correct && String(x).trim()).filter((x,i,a)=>a.indexOf(x)===i)].slice(0,3);
 return {id,type,prompt,options:opts,answer:0,review,spoken};
}
function topicBank(w){
 const u=courses[w],pool=[];
 u.quiz.forEach((q,i)=>pool.push({id:`w${w}-g${i}`,type:'grammar',prompt:q[0],options:q[1].slice(),answer:q[2],review:u.grammar+': '+u.rule,spoken:''}));
 VOCAB_BANK[w].forEach((word,i)=>{
  const pair=[word.en,word.ru];
  const incorrect=VOCAB_BANK[w].filter((_,j)=>j!==i).map(x=>x.en);
  const incorrectRu=VOCAB_BANK[w].filter((_,j)=>j!==i).map(x=>x.ru);
  pool.push(makeQuestion(`w${w}-w${i}`,'vocabulary',`Как по-английски: «${pair[1]}»?`,pair[0],incorrect,`Слово: ${pair[0]} — ${pair[1]}.`));
  pool.push(makeQuestion(`w${w}-r${i}`,'vocabulary',`Что означает «${pair[0]}»?`,pair[1],incorrectRu,`Слово: ${pair[0]} — ${pair[1]}.`));
 });
 [...u.examples,...u.dialog].forEach((pair,i,arr)=>{
  const others=arr.filter((_,j)=>j!==i).map(p=>p[1]);
  pool.push(makeQuestion(`w${w}-s${i}`,'reading',`Что значит фраза «${pair[0]}»?`,pair[1],others,`Перевод: ${pair[0]} — ${pair[1]}.`));
 });
 const practice=SKILLS_DATA[w];
 practice.reading.questions.forEach((q,i)=>pool.push({id:`w${w}-context-${i}`,type:'reading',prompt:q.q,options:q.options.slice(),answer:q.answer,review:'Повтори чтение бытового текста и найди информацию по вопросу.',passage:practice.reading.text}));
 practice.audio.questions.forEach((q,i)=>pool.push({id:`w${w}-real-audio-${i}`,type:'listening',prompt:q.q,options:q.options.slice(),answer:q.answer,review:'Переслушай оригинальную запись и обрати внимание на смысл.',audioUrl:practice.audio.url,audioTitle:practice.audio.title}));
 return pool;
}
function readyTomorrow(date){return Boolean(date) && dateYMD(new Date())<date}
function nextLocalDay(){return dateYMD(plusDays(localDay(new Date()),1))}
function newTopicAttempt(w){
 const rec=testsFor(w),attemptNumber=rec.attempts.length;
 const rand=prng(seedHash(`${w}::${attemptNumber}::${dateYMD(new Date())}::checkpoint`));
 const pool=topicBank(w),grammar=shuffleItems(pool.filter(q=>q.type==='grammar'),rand).slice(0,4),
 words=shuffleItems(pool.filter(q=>q.type==='vocabulary'),rand).slice(0,4),
 reading=shuffleItems(pool.filter(q=>q.type==='reading'&&q.passage),rand).slice(0,2),
 listening=shuffleItems(pool.filter(q=>q.type==='listening'&&q.audioUrl),rand).slice(0,2);
 const items=shuffleItems([...grammar,...words,...reading,...listening],rand).map(q=>{
  const correct=q.options[q.answer],options=shuffleItems(q.options,rand);
  return {...q,options,answer:options.indexOf(correct)};
 });
 rec.current={date:dateYMD(new Date()),questions:items,answers:{},startedAt:new Date().toISOString()};save();return rec.current;
}
function answerRatio(items,answers){return items.reduce((n,q,i)=>n+(Number(answers[i])===q.answer?1:0),0)}
function mistakeList(items,answers){return items.filter((q,i)=>Number(answers[i])!==q.answer).map(q=>({id:q.id,type:q.type,prompt:q.prompt,correct:q.options[q.answer],review:q.review}))}
function createRemediation(week,rec){
 const bad=rec.lastMistakes||[],types=new Set(bad.map(q=>q.type));
 const excluded=new Set(bad.map(q=>q.id)),rand=prng(seedHash(`remedy-${week}-${rec.attempts.length}`));
 const preferred=shuffleItems(topicBank(week).filter(q=>types.has(q.type)&&!excluded.has(q.id)),rand);
 const other=shuffleItems(topicBank(week).filter(q=>types.has(q.type)&&excluded.has(q.id)),rand);
 const chosen=[...preferred,...other].slice(0,6);
 rec.remediation={questions:chosen.map(q=>{const correct=q.options[q.answer],options=shuffleItems(q.options,rand);return {...q,options,answer:options.indexOf(correct)}}),answers:{},passedAt:null,retries:0};
}
function remediationPanel(week,rec){
 const r=rec.remediation;
 if(!r)return '';
 if(r.passedAt)return '<div class="donebanner">✓ Упражнения на слабые места выполнены. Повторный зачёт откроется на следующий день после неудачной попытки.</div>';
 const n=Object.keys(r.answers).length;
 return `<div class="retry-box"><h3>Обязательное закрепление слабых мест</h3><p>Шесть дополнительных вопросов по темам, где были ошибки. Нужно ответить правильно минимум на пять. Упражнения можно повторять сегодня; сам итоговый зачёт — только завтра.</p>${testChoiceMarkup(r.questions,r.answers,'remedy')}<div class="assessment-submit"><span class="tiny">Ответы ${n}/${r.questions.length}</span><button class="primary dark" data-remedy-submit="1" ${n!==r.questions.length?'disabled':''}>Проверить закрепление</button></div></div>`;
}
function submitRemediation(){
 const task=nextTask();if(task.type!=='topic')return;
 const rec=testsFor(task.week),r=rec.remediation;if(!r||r.passedAt)return;
 if(Object.keys(r.answers).length!==r.questions.length)return;
 const score=answerRatio(r.questions,r.answers);r.retries++;
 if(score>=Math.ceil(r.questions.length*.8))r.passedAt=new Date().toISOString();
 else {const rand=prng(seedHash(`remedy-${task.week}-${rec.attempts.length}-${r.retries}`));r.questions=r.questions.map(q=>{const correct=q.options[q.answer],options=shuffleItems(q.options,rand);return {...q,options,answer:options.indexOf(correct)}});r.answers={};}
 save();render();
}
function reviewPanel(mistakes,week){
 const u=courses[week];return `<div class="retry-box"><h3>Что повторить перед новой попыткой</h3><p><b>${esc(u.grammar)}</b> — ${esc(u.rule)}</p><p>${esc(u.theory)}</p>${mistakes.length?mistakes.slice(0,8).map((q,i)=>`<div class="mistake"><div class="tiny">${i+1}. ${esc(q.type)}</div><b>${esc(q.prompt)}</b><div>Правильно: <strong>${esc(q.correct)}</strong></div></div>`).join(''):'Повтори все примеры, слова и диалоги темы.'}<p>Полезный материал: <a href="${esc(u.resource)}" target="_blank" rel="noopener noreferrer">Бесплатный урок по теме ↗</a></p><button class="outline" data-open="${week*6}">Повторить первый урок темы</button></div>`;
}
function testChoiceMarkup(qs,answers,kind,offset=0){
 return qs.map((q,i)=>{
  const idx=i+offset,selected=answers[idx];return `<div class="questiongroup assessment-q"><div class="qcounter">Вопрос ${idx+1} из ${kind==='exam'?36:qs.length} · ${q.type==='listening'?'Аудирование':q.type==='reading'?'Чтение':q.type==='vocabulary'?'Слова':'Грамматика'}</div>${q.passage?`<div class="reading-source assessment-text" lang="en">${esc(q.passage)}</div>`:''}${q.audioUrl?`<div class="audio-resource"><a href="${esc(q.audioUrl)}" target="_blank" rel="noopener noreferrer">▶ Реальная запись: ${esc(q.audioTitle||'Открыть')} ↗</a></div>`:''}<div class="question">${esc(q.prompt)}</div>${q.spoken?`<button class="sound" data-assess-speak="${idx}">▶ Прослушать фразу</button><div class="tiny">Звук синтезируется браузером. Используй наушники.</div>`:''}${q.options.map((opt,j)=>`<button class="choice ${selected===j?'answer-selected':''}" data-${kind}-answer="${idx}:${j}" aria-pressed="${selected===j}">${String.fromCharCode(65+j)}. ${esc(opt)}</button>`).join('')}</div>`;
 }).join('');
}
function testCooldown(rec){
 const date=new Date(rec.retryAfter+'T12:00:00');return `<div class="lock-panel"><h2>Повторный тест откроется завтра</h2><p>Сегодняшняя попытка не зачтена. Следующие уроки временно закрыты, но пройденные доступны для повторения.</p><p><b>Можно повторить: ${ruDate(date)}</b></p></div>`;
}
function checkpointPage(){
 const task=nextTask(),w=Number.isInteger(checkpointViewWeek)?checkpointViewWeek:task.type==='topic'?task.week:Math.max(0,Math.min(courses.length-1,Math.floor((nextIndex()-1)/6)));
 if(task.type==='topic'&&task.week===w)checkpointViewWeek=w;
 const rec=testsFor(w),u=courses[w],completed=daysReady(w);
 let body='';
 if(!completed){body='<div class="notes">Сначала выполни шесть уроков темы. Затем откроется зачёт.</div>';}
 else if(rec.passedAt){body=`<div class="donebanner">✓ Тема зачтена. Попыток: ${rec.attempts.length}${rec.legacy?' (перенесено из прежней версии)':''}. <button class="primary dark" data-resume="1">Продолжить обучение →</button></div>`;}
 else if(rec.retryAfter&&!rec.remediation?.passedAt){body=reviewPanel(rec.lastMistakes||[],w)+remediationPanel(w,rec)+(readyTomorrow(rec.retryAfter)?testCooldown(rec):'<div class="notes">Новый вариант тематического зачёта откроется после выполнения закрепления.</div>');}
 else if(readyTomorrow(rec.retryAfter)){body=testCooldown(rec)+reviewPanel(rec.lastMistakes||[],w);}
 else {
  if(!rec.current) newTopicAttempt(w);
  const cur=rec.current,qs=cur.questions,answers=cur.answers,answered=Object.keys(answers).length;
  body=`<div class="notes">12 вопросов: грамматика, слова, понимание текста и реального аудио. Нужно минимум 10 верных ответов, включая правильные ответы по чтению и аудированию. Тест не ограничен таймером. Ошибки будут показаны после отправки.</div>${testChoiceMarkup(qs,answers,'topic')}<div class="assessment-submit"><span class="tiny">Ответы: ${answered}/12</span><button class="primary dark" data-topic-submit="1" ${answered!==qs.length?'disabled':''}>Проверить тему →</button></div>`;
 }
 return `<div class="lesson-head"><div><span class="pill">Обязательный зачёт · неделя ${w+1}</span><h2>${esc(u.title)}</h2><p>После пройденной темы · до 40 минут · попытки разных дней</p></div><button class="outline" data-page="assessments">Все зачёты →</button></div><div class="panel assessment-panel">${body}</div><p class="disclaimer">Если не набрать 80%, следующий раздел останется закрыт. Приложение покажет слабые места и предложит повторный вариант начиная со следующего календарного дня (по часам устройства).</p>`;
}
function submitTopic(){
 const task=nextTask();if(task.type!=='topic')return;
 const w=task.week,rec=testsFor(w),cur=rec.current;if(!cur)return;
 const qs=cur.questions,answers=cur.answers;if(Object.keys(answers).length<qs.length)return;
 const score=answerRatio(qs,answers),wrong=mistakeList(qs,answers),bySkill={reading:0,listening:0};qs.forEach((q,i)=>{if(Object.hasOwn(bySkill,q.type)&&Number(answers[i])===q.answer)bySkill[q.type]++});const passed=score>=Math.ceil(qs.length*CHECKPOINT_PASS)&&bySkill.reading>=1&&bySkill.listening>=1;
 rec.attempts.push({on:new Date().toISOString(),score,total:qs.length,passed,weakTags:[...new Set(wrong.map(q=>q.type))],bySkill});
 rec.lastMistakes=wrong;rec.lastScore=score;rec.current=null;
 if(passed){rec.passedAt=new Date().toISOString();rec.retryAfter=null;message='Тема зачтена! Доступна следующая неделя.';}
 else {rec.retryAfter=nextLocalDay();createRemediation(w,rec);message='Следующая тема закрыта. Сначала закрепи слабые места, затем пересдай завтра.';}
 save();render();
}
function generateFinalQuestions(attempt,mode=examMode()){
 const random=prng(seedHash(`${mode}-exam-${attempt}-${dateYMD(new Date())}`));
 const grammar=[],vocab=[],reading=[],listening=[];
 const first=mode==='A1_full'?12:0,last=mode==='A1_full'?A1_COURSE_WEEKS:12;
 for(let w=first;w<last;w++){
  const bank=topicBank(w);
  grammar.push(shuffleItems(bank.filter(q=>q.type==='grammar'),random)[0]);
  vocab.push(shuffleItems(bank.filter(q=>q.type==='vocabulary'),random)[0]);
  if((w-first)%2===0)listening.push(shuffleItems(bank.filter(q=>q.type==='listening'&&q.audioUrl),random)[0]);
  else reading.push(shuffleItems(bank.filter(q=>q.type==='reading'&&q.passage),random)[0]);
 }
 // 12 + 12 + 6 + 6 = 36 questions regardless of whether a block has 12 or 13 topics.
 return shuffleItems([...shuffleItems(grammar,random).slice(0,12),...shuffleItems(vocab,random).slice(0,12),...shuffleItems(reading,random).slice(0,6),...shuffleItems(listening,random).slice(0,6)],random).map(q=>{
  let correct=q.options[q.answer],options=shuffleItems(q.options,random);return {...q,options,answer:options.indexOf(correct)};
 });
}

function newFinalAttempt(){const rec=examRecord(),qs=generateFinalQuestions(rec.attempts.length);rec.current={startedAt:new Date().toISOString(),questions:qs,answers:{},part:0,writing:'',speaking:false};save();return rec.current}
function assessmentBanner(){
 const task=nextTask(),accepted=Object.values(store.checkpoints).filter(c=>c?.passedAt).length;
 return `<div class="panel assessment-banner"><div><div class="pill">Контроль усвоения · ${accepted}/${courses.length} тем</div><h3>${task.type==='topic'?'Пора проверить тему: '+esc(courses[task.week].title):task.type==='exam'?(task.level==='A1_full'?'Все 150 занятий пройдены — итоговый тест A1':'Начальный блок завершён — промежуточный экзамен'):task.type==='awaitingContent'?'Первые шесть тем A2 завершены; продолжение в разработке':'После каждой темы — обязательный тест'}</h3><p>${task.type==='topic'?'Следующая неделя откроется после зачёта. При ошибках повторный вариант доступен завтра.':task.type==='exam'?'Пройди внутренний итоговый тест, затем можешь проверить себя официальными образцами Cambridge.':task.type==='awaitingContent'?'Твой прогресс сохранён. Следующие темы A2 ещё не опубликованы.':'Для зачёта нужно минимум 80%. При ошибках приложение покажет, что повторить.'}</p></div><button class="primary dark" data-page="${task.type==='topic'?'checkpoint':task.type==='exam'?'exam':'roadmap'}">${task.type==='topic'?'Сдать тему →':task.type==='exam'?'Начать экзамен →':'План обучения →'}</button></div>`;
}
function homeNextSection(n,unit,week,mode){
 const task=nextTask();
 if(task.type!=='lesson')return `<div class="section-head"><h2>${task.type==='awaitingContent'?'Начало A2 пройдено':'Следующий обязательный шаг'}</h2></div>${assessmentBanner()}`;
 const rec=existingRecord(n),steps=rec?.steps||[];
 return `<div class="section-head"><h2>Следующий урок</h2><span class="tiny">Ориентир до 40 минут · без ожидания таймера</span></div><div class="panel today"><div>${modeChip(mode)} <span class="pill">Неделя ${week+1}, день ${n%6+1}</span><h3>${esc(unit.title)} — ${labelDays[n%6]}</h3><p>${esc(unit.grammar)}. Карточки, аудирование, мини-тест и устная практика.</p><div class="progress" style="max-width:430px"><div style="width:${pct(steps.filter(Boolean).length,5)}%"></div></div><span class="tiny">Шаги ${steps.filter(Boolean).length}/5 · активное время ${duration(rec?.activeSeconds||0)}</span></div><button class="primary dark" data-open="${n}">Открыть урок →</button></div>`;
}
function examPage(){
 const task=nextTask(),full=examMode()==='A1_full',end=full?A1_COURSE_WEEKS:12,ready=Array.from({length:end},(_,i)=>daysReady(i)&&store.checkpoints[String(i)]?.passedAt).every(Boolean);
 const rec=examRecord(),links=`<div class="external-links"><h3>Независимая проверка уровня</h3><p><b>Внутренний экзамен не даёт сертификат CEFR.</b> Cambridge предлагает бесплатные официальные образцы заданий. A1 Movers рассчитан на детей; для взрослого более подходящая внешняя оценка — A2 Key, по результатам которого может быть указан A1. Сам сертификационный экзамен проводится через экзаменационный центр и обычно платный.</p><p><a target="_blank" rel="noopener noreferrer" href="${OFFICIAL_LINKS.A1}">Cambridge A1 Movers — образцы тестов ↗</a></p><p><a target="_blank" rel="noopener noreferrer" href="${OFFICIAL_LINKS.A2}">Cambridge A2 Key — материалы взрослого экзамена ↗</a></p></div>`;
 let body='';
 if(!ready){body=`<div class="notes">${full?'Итоговый тест A1 откроется после 150 уроков и 25 тематических зачётов.':'Промежуточный экзамен откроется после 72 уроков и 12 зачётов.'}</div>`;}
 else if(rec.passedAt){body=`<div class="donebanner">✓ ${full?'Итоговый тест A1':'Промежуточный тест'} пройден. ${rec.lastScore||0}/36 вопросов. Это не официальный сертификат и не подтверждение качества говорения или письма.</div>`;}
 else if(readyTomorrow(rec.retryAfter)){body=testCooldown(rec)+`<div class="notes"><b>Повтори темы, в которых были ошибки:</b><p>${(rec.lastMistakes||[]).slice(0,10).map(m=>`${esc(m.prompt)} → ${esc(m.correct)}`).join('<br>')}</p></div>`;}
 else {
  if(!rec.current)newFinalAttempt();const c=rec.current,q=c.questions,n=Object.keys(c.answers).length;
  const part=c.part||0;
  const instructions=`<div class="notes">Часть ${part+1} из 2 · 18 заданий на часть. Полная проверка: 36 вопросов (грамматика, слова, чтение и аудирование) с порогом 80% и минимум 4 из 6 в чтении и аудировании. Каждую часть можно выполнить отдельно, без таймера. Ответы сохраняются.</div>`;
  if(part===0){
   const count=Array.from({length:18},(_,i)=>c.answers[i]!==undefined).filter(Boolean).length;
   body=instructions+testChoiceMarkup(q.slice(0,18),c.answers,'exam',0)+`<div class="assessment-submit"><span class="tiny">Ответы ${count}/18 · часть 1/2</span><button class="primary dark" data-exam-next="1" ${count!==18?'disabled':''}>Перейти к части 2 →</button></div>`;
  }else{
   const count=Array.from({length:18},(_,i)=>c.answers[i+18]!==undefined).filter(Boolean).length;
   body=instructions+`<button class="outline" data-exam-back="1">← Вернуться к части 1</button>`+testChoiceMarkup(q.slice(18),c.answers,'exam',18)+`<div class="writing"><h3>Короткое письмо (самопроверка)</h3><p>Напиши на английском 4–5 предложений: кто ты, откуда ты, куда хочешь поехать и чем любишь заниматься. Это упражнение сохраняется, но автоматически <b>не оценивается</b> по языковым критериям.</p><textarea id="exam-writing" rows="4" placeholder="Hello! My name is...">${esc(c.writing||'')}</textarea><label class="switchline"><input id="exam-speaking" type="checkbox" ${c.speaking?'checked':''}> <span>Я вслух рассказал(а) о себе и ответил(а) на 3 простых вопроса (самостоятельное подтверждение).</span></label></div><div class="assessment-submit"><span class="tiny">Ответы ${count}/18 · часть 2/2 · письмо и говорение — самопроверка</span><button class="primary dark" data-exam-submit="1" ${n!==q.length||!c.speaking||String(c.writing||'').trim().length<40?'disabled':''}>Завершить экзамен →</button></div>`;
  }
 }
 return `<div class="lesson-head"><div><span class="pill">Внутренний учебный экзамен · ${full?'A1':'основы'}</span><h2>${full?'Итоговый экзамен A1':'Промежуточный экзамен'}</h2><p>После ${end} зачтённых тем; проверка не равна сертификации</p></div><button class="outline" data-page="assessments">Все проверки</button></div><div class="panel assessment-panel">${body}</div>${links}`;
}
function submitExam(){const rec=examRecord(),c=rec.current;if(!c||c.part!==1||Object.keys(c.answers).length!==c.questions.length||!c.speaking||c.writing.trim().length<40)return;
 const score=answerRatio(c.questions,c.answers),wrong=mistakeList(c.questions,c.answers),bySkill={};
 for(const type of ['listening','reading'])bySkill[type]=c.questions.filter((q,i)=>q.type===type&&Number(c.answers[i])===q.answer).length;
 const passed=score>=Math.ceil(c.questions.length*FINAL_PASS)&&bySkill.listening>=4&&bySkill.reading>=4;
 rec.attempts.push({on:new Date().toISOString(),score,total:c.questions.length,bySkill,passed,writing:c.writing});rec.lastScore=score;rec.lastMistakes=wrong;rec.current=null;
 if(passed){rec.passedAt=new Date().toISOString();rec.retryAfter=null}else{rec.retryAfter=nextLocalDay()}
 save();render();
}
function assessmentsPage(){
 const task=nextTask();return `<div class="lesson-head"><div><span class="pill">Проверки после каждой темы и уровня</span><h2>Зачёты и итоговые тесты</h2><p>Следующая тема закрыта, пока предыдущая не усвоена. Проваленный зачёт можно пересдать завтра.</p></div></div>
 <div class="panel"><h3>Тематические проверки A0–A2 · ${courses.length} тем</h3><div class="check-grid">${courses.map((u,w)=>{const c=store.checkpoints[String(w)],done=daysReady(w),active=task.type==='topic'&&task.week===w,pass=!!c?.passedAt;return `<button class="check-card ${pass?'checked':active?'need-check':'locked'}" data-check-open="${w}" ${!done?'disabled':''}><span class="pill">Неделя ${w+1}</span><b>${esc(u.title)}</b><span>${pass?'✓ Тема зачтена':!done?'🔒 После 6 уроков':readyTomorrow(c?.retryAfter)?'⏳ Пересдача завтра':'📝 Нужно сдать тест'}</span><small>${c?.attempts?.length||0} попыток</small></button>`}).join('')}</div></div>
 <div class="panel"><h3>${task.type==='exam'&&task.level==='A1_full'?'Итоговый тест A1':'Промежуточный экзамен и итоговый A1'}</h3><p>36 вопросов + письменное и устное упражнение для самопроверки. <b>Это внутренний учебный зачёт, не официальный сертификат.</b></p><button class="outline" data-page="exam">Открыть A1 →</button></div>
 <div class="panel"><h3>Внешние и будущие экзамены</h3><p><a href="${OFFICIAL_LINKS.A1}" target="_blank" rel="noopener noreferrer">A1 Movers — официальный образец (ориентирован на детей) ↗</a></p><p><a href="${OFFICIAL_LINKS.A2}" target="_blank" rel="noopener noreferrer">A2 Key — официальные образцы ↗</a></p><p><a href="${OFFICIAL_LINKS.B1}" target="_blank" rel="noopener noreferrer">B1 Preliminary — официальные образцы ↗</a></p><p class="tiny">Первые шесть тем A2 доступны, но полный A2 и B1 ещё не разработаны. Итоговые экзамены этих уровней появятся только после завершения соответствующих курсов. Сертификаты выдаёт только уполномоченная экзаменационная организация.</p></div>`;
}



// Проверка наличия нового опубликованного выпуска. Никаких загрузок ZIP-файлов.
// Если открыт незавершённый урок/зачёт, приложение не перезагружается без согласия.
let updateShown=false;
function versionIsNewer(remote, current){
 const a=String(remote).split('.').map(Number), b=String(current).split('.').map(Number);
 for(let i=0;i<Math.max(a.length,b.length);i++){
  const x=a[i]||0,y=b[i]||0;if(x>y)return true;if(x<y)return false;
 }
 return false;
}
function showUpdateNotice(info){
 if(updateShown)return;
 const bar=document.getElementById('update-banner');if(!bar)return;
 updateShown=true;
 bar.hidden=false;
 const desc=bar.querySelector('[data-update-message]');
 if(desc)desc.textContent=`Доступна версия ${info.version}. Сначала заверши текущее упражнение, затем обнови приложение.`;
 const b=bar.querySelector('[data-update-apply]');
 if(b)b.onclick=()=>{save();window.location.reload()};
}
async function checkForUpdates(){
 if(!/^https?:$/.test(window.location.protocol))return 'unavailable';
 try{
  const res=await fetch('./version.json?check='+Date.now(),{cache:'no-store'});
  if(!res.ok)return 'unavailable';
  const latest=await res.json();
  if(latest.version&&versionIsNewer(latest.version,APP_VERSION)){
   showUpdateNotice(latest);return 'new';
  }
  return 'current';
 }catch(_){return 'unavailable'}
}
window.addEventListener('load',()=>{checkForUpdates();setInterval(checkForUpdates,15*60*1000)});

render();

function skillsOverview(){const s=skillStats();return `<div class="panel skill-overview"><h3>Проверенные языковые навыки</h3><div class="skill-metrics"><span>Составление фраз: <b>${s.grammar}</b></span><span>Понимание текста: <b>${s.reading}</b></span><span>Живое аудио: <b>${s.listening}</b></span><span>Диалоги: <b>${s.dialogue}</b></span></div><p class="tiny">Показаны только новые упражнения, реально зачтённые в уроках. Старые уроки не обнуляются. Показатели не подтверждают CEFR или произношение.</p></div>`}
