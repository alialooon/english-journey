/* English Journey 11.2 — authentic listening lab and free-response speaking practice.
 * Original comprehension questions; recordings stay with British Council, no copying.
 * Data stays in English Journey's existing localStorage store.
 */
(function () {
  'use strict';
  const AUDIO_TRACKS = [
    {id:'a1-table', level:'A1', title:'Бронирование столика', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/a1/booking-table', questions:[
      ['How many people is the original reservation for?',['Two','Four','Six'],1],
      ['What time is the original confirmed reservation?',['7:30','8:30','9:00'],0],
      ['How many people does Jamie want in the changed reservation?',['Six','Eight','Four'],0]
    ]},
    {id:'a1-voicemail', level:'A1', title:'Голосовое сообщение', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/a1/voicemail-message', questions:[
      ['Who leaves a message for John?',['Alex','Marina','Anna'],1],
      ['Who gave her John’s telephone number?',['Alex','John','Marina'],0],
      ['What does she ask him to email?',['A hotel address','A train ticket','A brochure and price information'],2]
    ]},
    {id:'a1-library', level:'A1', title:'Как найти библиотеку', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/a1/finding-library', questions:[
      ['What is the library next to?',['The registration office','A restaurant','The airport'],0],
      ['What must the student have to borrow books?',['A passport','A library card','A train ticket'],1],
      ['How many books can the student borrow today?',['Four','Ten','Six'],2]
    ]},
    {id:'a2-transport', level:'A2', title:'Объявления на транспорте', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/a2/transport-announcements', questions:[
      ['Which platform will the delayed train to Bristol use?',['Platform 2','Platform 9','Platform 5'],1],
      ['How long is the train delayed?',['About 8 minutes','About 30 minutes','About 15 minutes'],0],
      ['Which gate is announced for the flight to Paris?',['Gate 3','Gate 9','Gate 13'],2]
    ]},
    {id:'a2-change', level:'A2', title:'Когда планы изменились', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/a2/changing-plans', questions:[
      ['Why can Francesco not go to the theatre this Friday?',['He has a concert','He is ill','He is travelling abroad'],0],
      ['When does he suggest going to the play?',['Tomorrow morning','Next Friday','Next month'],1],
      ['What does he suggest doing before his concert?',['Going shopping','Watching a film','Going out for dinner'],2]
    ]},
    {id:'a2-message', level:'A2', title:'Оставляем сообщение', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/a2/leaving-message', questions:[
      ['Why is Maria not available?',['She is on her lunch break','She is on holiday','She has left the company'],0],
      ['What project does Peter ask about?',['The LTO project','The PXO project','The XYZ project'],1],
      ['What does Peter ask Maria to do?',['Send a parcel','Book a flight','Call him back'],2]
    ]},
    {id:'b1-weather', level:'B1', title:'Прогноз погоды: прогноз и последствия', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/b1/weather-forecast', questions:[
      ['Which area may have heavy thundery showers today?',['Manchester and the Pennines','Kent and London','The south coast'],0],
      ['What is expected in most of England tomorrow morning?',['Snow and frost','A dry, bright start','Heavy rain everywhere'],1],
      ['What is forecast for the weekend?',['A dry heatwave','Temperatures below zero','Cloud and rain, with temperatures around 21°C'],2]
    ]},
    {id:'b1-customer', level:'B1', title:'Сложный звонок клиенту', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/b1/phone-call-customer', questions:[
      ['Why is Andrea calling?',['To discuss payment terms','To report a missing delivery','To cancel every order'],0],
      ['What change does Andrea ask for?',['From 60 days to 30','From 30 days to 60','From 30 days to 10'],1],
      ['What is causing difficulty for Andrea’s company?',['Staff holidays','A factory closure','Cash flow problems'],2]
    ]},
    {id:'b1-mars', level:'B1', title:'Обсуждение: Земля и Марс', source:'British Council LearnEnglish', url:'https://learnenglish.britishcouncil.org/free-resources/listening/b1/student-discussion', questions:[
      ['Approximately how cold is Mars most of the time, according to the discussion?',['Minus 55°C','Plus 55°C','Plus 15°C'],0],
      ['Approximately how far is Earth from the Sun?',['228 million kilometres','150 million kilometres','55 million kilometres'],1],
      ['How do the students approach their comparison?',['They agree immediately','They are discussing train tickets','They question each other’s claims'],2]
    ]}
  ];
  const CONVERSATIONS = [
    {id:'a1-direction',level:'A1', title:'Спросить дорогу', turns:[
      {prompt:'You are in a new city. Ask a local person where the train station is.',rules:[['where','how (?:do|can) i get'],['station','train']], min:5,tip:'Спроси, где станция, или как до неё добраться.'},
      {prompt:'Local: "Go straight and turn left." Thank the person.',rules:[['thank','thanks'],['you','so much','very much']],min:2,tip:'Поблагодари человека.'}
    ]},
    {id:'a1-cafe',level:'A1',title:'Заказать напиток', turns:[
      {prompt:'Waiter: "Hello! What would you like?" Order water politely.',rules:[['water'],['please','could','can i','would like']],min:3,tip:'Попроси воду вежливо.'},
      {prompt:'Waiter: "Anything else?" Say you do not need anything else.',rules:[['no','nothing','all','that'],['thank','thanks','please']],min:3,tip:'Скажи, что больше ничего не нужно, и поблагодари.'}
    ]},
    {id:'a1-hotel',level:'A1',title:'Заселение в отель', turns:[
      {prompt:'Receptionist: "Hello. How can I help?" Say you have a reservation.',rules:[['reservation','booking'],['have','booked']],min:4,tip:'Скажи, что у тебя есть бронирование.'},
      {prompt:'Receptionist: "Can I see your passport?" Agree politely.',rules:[['yes','sure','of course','certainly'],['here','passport','please']],min:3,tip:'Согласись и предложи паспорт.'}
    ]},
    {id:'a2-train',level:'A2',title:'Опоздание на пересадку', turns:[
      {prompt:'Station employee: "How can I help you?" Explain that your train was late and you missed a connection.',rules:[['late','delay'],['miss','connection','change']],min:8,tip:'Объясни задержку и пропущенную пересадку.'},
      {prompt:'Employee: "There is another train at 18:30." Ask whether your existing ticket is valid.',rules:[['ticket'],['valid','use','can','still']],min:6,tip:'Спроси, можно ли ехать по старому билету.'}
    ]},
    {id:'a2-hotel',level:'A2',title:'Проблема с номером', turns:[
      {prompt:'Receptionist: "Is everything OK with your room?" Explain that it is noisy and ask for a different room.',rules:[['noisy','noise','loud'],['another room','different room','change','move']],min:8,tip:'Опиши шум и попроси другой номер.'},
      {prompt:'Receptionist: "We can move you tomorrow." Explain why you need a solution tonight.',rules:[['tonight','today','now','this evening'],['sleep','rest','cannot','need']],min:8,tip:'Объясни, почему проблему нужно решить сегодня.'}
    ]},
    {id:'a2-meeting',level:'A2',title:'Перенести встречу', turns:[
      {prompt:'Colleague: "Can we meet on Friday?" Say you are busy Friday and suggest Monday.',rules:[['busy','cannot','can’t','not free'],['monday']],min:7,tip:'Отклони пятницу и предложи понедельник.'},
      {prompt:'Colleague: "Monday works. What time?" Suggest a time and politely ask for confirmation.',rules:[['10','11','two','three','morning','afternoon','o.clock'],['okay','work','suit','confirm','please']],min:7,tip:'Назови время и попроси подтвердить.'}
    ]},
    {id:'b1-connection',level:'B1',title:'Пропущенный рейс: аргументируем решение',turns:[
      {prompt:'Airline agent: "Your connection is gone. What would you like to do?" Explain what happened and propose a practical solution.',rules:[['miss','cancel','delay'],['because','due to','as a result'],['next flight','another flight','rebook','alternative']],min:16,tip:'Опиши причину, последствие и разумную альтернативу.'},
      {prompt:'Agent: "The next flight leaves tomorrow." Explain why that is a problem and ask about accommodation.',rules:[['tomorrow','overnight','tonight'],['hotel','accommodation','stay'],['because','since','as']],min:15,tip:'Объясни последствия и попроси размещение.'}
    ]},
    {id:'b1-refund',level:'B1',title:'Возврат денег и переговоры', turns:[
      {prompt:'Customer service: "The service was provided, so we cannot refund you." Explain the specific problem and why you disagree.',rules:[['service','booking','room','flight','train','tour'],['not','never','cancel','broken','failed','different'],['because','however','although','since']],min:17,tip:'Опиши услугу, что было не так, и почему.'},
      {prompt:'Agent: "We can only offer a voucher." Politely reject or negotiate the offer, giving a reason.',rules:[['voucher','refund','money','offer'],['prefer','would like','could','instead'],['because','since','as','however']],min:16,tip:'Вежливо обсуди ваучер и альтернативу с объяснением.'}
    ]},
    {id:'b1-choice',level:'B1',title:'Выбор транспорта: плюсы и минусы', turns:[
      {prompt:'Friend: "Should we take the train or fly?" Compare two options and recommend one with reasons.',rules:[['train'],['fly','flight','plane'],['because','although','however','cheaper','faster','more']],min:18,tip:'Сравни поезд и самолёт, объясни свой выбор.'},
      {prompt:'Friend: "But flying would save two hours." Respond, acknowledge the point and add a different consideration.',rules:[['yes','true','agree','understand','although'],['but','however','although','on the other hand'],['cost','price','station','airport','time','environment','comfort']],min:17,tip:'Признай аргумент собеседника и добавь свой.'}
    ]}
  ];
  const escLab = (value)=>esc(String(value));
  const ensureLab=()=>{
    if(!store.authenticLab||typeof store.authenticLab!=='object')store.authenticLab={};
    if(!store.authenticLab.listening||typeof store.authenticLab.listening!=='object')store.authenticLab.listening={};
    if(!store.authenticLab.speaking||typeof store.authenticLab.speaking!=='object')store.authenticLab.speaking={};
    return store.authenticLab;
  };
  let labMode='listening',labLevel='A1',labSelected=null,labDraft={},labSpeechRecognition=null,labMessage='';
  const norm=(s)=>String(s||'').toLocaleLowerCase('en').replace(/[’]/g,"'").replace(/[^a-z0-9'\s:-]/g,' ').replace(/\s+/g,' ').trim();
  function levelOfWeek(w){return w<25?'A1':w<50?'A2':'B1'}
  function labSummary(){const lab=ensureLab();return ['A1','A2','B1'].map(level=>({level,listen:AUDIO_TRACKS.filter(x=>x.level===level&&lab.listening[x.id]?.passed).length,listenTotal:3,spoken:CONVERSATIONS.filter(x=>x.level===level&&lab.speaking[x.id]?.passed).length,spokenTotal:3}));}
  function labCard(){let st=labSummary();return `<div class="panel ejlab-info"><h3>🎧 Реальная речь и свободные ответы</h3><p>Дополнительная диагностика на записях British Council и тренажёр самостоятельного разговора. Результаты хранятся в этом браузере; это не экзамен CEFR.</p><div class="ejlab-stats">${st.map(x=>`<span><b>${x.level}</b> · аудио ${x.listen}/${x.listenTotal} · диалоги ${x.spoken}/${x.spokenTotal}</span>`).join('')}</div><button class="outline" data-page="authentic-lab">Перейти к практике →</button></div>`;}
  function trackView(item){
    const lab=ensureLab(),rec=lab.listening[item.id],passed=!!rec?.passed;
    const questions=item.questions;
    const answerMarkup=questions.map((q,i)=>`<div class="skill-question"><b>${i+1}. ${escLab(q[0])}</b><div class="skill-choicegrid">${q[1].map((choice,j)=>`<button class="choice ${Number(labDraft[i])===j?'answer-selected':''}" data-lab-choice="${i}:${j}" aria-pressed="${Number(labDraft[i])===j}">${String.fromCharCode(65+j)}. ${escLab(choice)}</button>`).join('')}</div></div>`).join('');
    return `<div class="panel ejlab-detail"><h3>${escLab(item.title)}</h3><p>Сначала открой запись, послушай без текста, вернись сюда и ответь на вопросы. Расшифровка доступна у источника: постарайся не читать её до первой попытки.</p><p><a class="ejlab-source" href="${escLab(item.url)}" target="_blank" rel="noopener noreferrer">▶ Открыть настоящую аудиозапись на сайте British Council ↗</a></p><p class="tiny">Мы не копируем аудиофайл. Если запись перестанет открываться, её нужно будет заменить; ответы без прослушивания не подтверждают восприятие речи.</p>${passed?`<div class="donebanner">✓ Проверка пройдена. Лучший результат: ${rec.best}/3. Попыток: ${rec.attempts}.</div>`:`<div class="tiny">Ранее попыток: ${rec?.attempts||0}. Для зачёта 3/3 — без подсказок.</div>`}${answerMarkup}<button class="primary dark" data-lab-listen-submit="${escLab(item.id)}" ${Object.keys(labDraft).length!==questions.length?'disabled':''}>Проверить понимание записи</button></div>`;
  }
  function matchRule(text,arr){return arr.some(raw=>{try{return new RegExp('(?:^|\\b)(?:'+raw+')(?:\\b|$)','i').test(text)}catch(e){return text.includes(raw)}})}
  function gradeTurn(turn,text){const clean=norm(text),words=clean.split(' ').filter(Boolean),n=words.length;const marks=turn.rules.map(group=>matchRule(clean,group));const distinct=new Set(words).size,minDistinct=Math.min(5,Math.max(2,Math.ceil(turn.min/2)));return {passed:n>=turn.min&&distinct>=minDistinct&&marks.every(Boolean),met:marks.filter(Boolean).length,required:marks.length,words:n,min:turn.min,distinct,minDistinct};}
  function conversationView(item){const lab=ensureLab(),rec=lab.speaking[item.id]||{step:0,attempts:0,answers:[],passed:false},step=Math.min(item.turns.length-1,rec.step||0),turn=item.turns[step];
    return `<div class="panel ejlab-detail"><h3>${escLab(item.title)}</h3><p>Отвечай своими словами по-английски. Можно печатать или продиктовать ответ в браузере. Проверяется наличие ключевых смысловых элементов и минимальная развёрнутость, а не реальная беглость, точность грамматики или произношение.</p>${rec.passed?`<div class="donebanner">✓ Оба ответа содержат нужные смысловые элементы. Это тренировочный результат, а не независимая оценка уровня.</div>`:''}<div class="skill-question"><div class="tiny">Реплика ${step+1} из ${item.turns.length}</div><b lang="en">${escLab(turn.prompt)}</b><textarea id="ejlab-speak-input" rows="4" placeholder="Your own English answer..." spellcheck="false">${escLab(rec.draft||'')}</textarea><div class="ejlab-actions"><button class="outline" data-lab-mic="1">🎙️ Продиктовать (если поддерживается)</button><button class="primary dark" data-lab-speak-submit="${escLab(item.id)}" ${rec.passed?'disabled':''}>Оценить ответ</button></div><p class="tiny">При использовании распознавания речи браузер или его поставщик может обрабатывать звук на своих серверах. Аудиофайл в English Journey не сохраняется, сохраняется только текст ответа.</p>${rec.feedback?`<div class="result ${rec.feedback.ok?'':'error'}">${escLab(rec.feedback.text)}</div>`:''}</div><p class="tiny">Попыток: ${rec.attempts||0}. Если программа не приняла правильный ответ, попробуй другую формулировку: автоматическая проверка приближённая.</p><button class="outline" data-lab-copy="${escLab(item.id)}">Скопировать мои ответы (необязательно)</button></div>`;
  }
  function labPage(){const lab=ensureLab();const menu=labMode==='listening'?AUDIO_TRACKS:CONVERSATIONS;const list=menu.filter(x=>x.level===labLevel);const current=list.find(x=>x.id===labSelected)||list[0];if(current&&current.id!==labSelected){labSelected=current.id;labDraft={};}
    const stats=labSummary();return `<div class="lesson-head"><div><span class="pill">Дополнительная практика · A1 → B1</span><h2>🎧 Живая речь и свободные диалоги</h2><p>Упражнения на настоящих записях + самостоятельные ответы. Занимайся 10–15 минут внутри обычного учебного дня.</p></div><button class="outline" data-page="assessments">К экзаменам →</button></div>
    <div class="panel"><h3>Что действительно проверяется</h3><p>Ответы на вопросы по живым записям оцениваются автоматически. Свободные ответы оцениваются автоматически по смысловым элементам и развернутости. Проверка удобна для тренировки, но не является официальной сертификацией CEFR.</p><div class="ejlab-stats">${stats.map(x=>`<span><b>${x.level}</b> · живое аудио: ${x.listen}/3 · диалоги: ${x.spoken}/3</span>`).join('')}</div></div>
    <div class="panel"><div class="ejlab-filters"><div>${['A1','A2','B1'].map(v=>`<button class="outline ${labLevel===v?'skill-active':''}" data-lab-level="${v}">${v}</button>`).join('')}</div><div><button class="outline ${labMode==='listening'?'skill-active':''}" data-lab-mode="listening">🎧 Аудирование</button><button class="outline ${labMode==='speaking'?'skill-active':''}" data-lab-mode="speaking">🗣️ Свободный ответ</button></div></div><div class="ejlab-select">${list.map(x=>{let r=labMode==='listening'?lab.listening[x.id]:lab.speaking[x.id];return `<button class="outline ${current?.id===x.id?'skill-active':''}" data-lab-select="${x.id}">${r?.passed?'✓ ':''}${escLab(x.title)}</button>`}).join('')}</div></div>
    ${current?(labMode==='listening'?trackView(current):conversationView(current)):''}
    <div class="panel"><h3>Самостоятельная автоматическая диагностика</h3><p>Весь практикум выполняется и проверяется автоматически. Микрофон необязателен: при необходимости печатай ответы. Оценки приблизительные и не являются официальным сертификатом CEFR.</p><p><a href="https://www.cambridgeenglish.org/exams-and-tests/key/preparation/" target="_blank" rel="noopener noreferrer">Cambridge A2 Key — материалы для подготовки ↗</a> · <a href="https://www.cambridgeenglish.org/exams-and-tests/preliminary/preparation/" target="_blank" rel="noopener noreferrer">Cambridge B1 Preliminary — материалы ↗</a></p></div>${labMessage?`<p class="notes">${escLab(labMessage)}</p>`:''}`;
  }
  const originalRender=render,originalSkillAudio=skillAudioPane,originalAssessments=assessmentsPage;
  skillAudioPane=function(record){const result=originalSkillAudio(record),week=Math.floor(dayFocus/6),level=levelOfWeek(week);return result+`<div class="notes"><b>Дополнительно: настоящее аудио.</b> Пройди независимые от синтезатора упражнения ${level} с проверкой понимания. <button class="outline" data-page="authentic-lab">Живые записи и задания →</button></div>`;};
  assessmentsPage=function(){return originalAssessments()+labCard();};
  const originalRoadmap=roadmap;roadmap=function(){return originalRoadmap()+labCard()};
  const originalWire=wire;
  wire=function(){originalWire();if(page==='authentic-lab')labWire();};
  // render() calls wire() itself, no second attachment necessary.
  render=function(){if(page==='authentic-lab'){
    header();document.getElementById('root').innerHTML=labPage();wire();
  }else originalRender();};
  function labWire(){
    document.querySelectorAll('[data-lab-level]').forEach(b=>b.onclick=()=>{labLevel=b.dataset.labLevel;labSelected=null;labDraft={};labMessage='';render()});
    document.querySelectorAll('[data-lab-mode]').forEach(b=>b.onclick=()=>{labMode=b.dataset.labMode;labSelected=null;labDraft={};labMessage='';render()});
    document.querySelectorAll('[data-lab-select]').forEach(b=>b.onclick=()=>{labSelected=b.dataset.labSelect;labDraft={};labMessage='';render()});
    document.querySelectorAll('[data-lab-choice]').forEach(b=>b.onclick=()=>{const [i,j]=b.dataset.labChoice.split(':').map(Number);labDraft[i]=j;render()});
    document.querySelectorAll('[data-lab-listen-submit]').forEach(b=>b.onclick=()=>{
      const tr=AUDIO_TRACKS.find(a=>a.id===b.dataset.labListenSubmit);if(!tr||Object.keys(labDraft).length!==tr.questions.length)return;
      const correct=tr.questions.reduce((n,q,i)=>n+(Number(labDraft[i])===q[2]?1:0),0);const lab=ensureLab();const rec=lab.listening[tr.id]||{attempts:0,best:0,passed:false};rec.attempts++;rec.best=Math.max(rec.best,correct);if(correct===3)rec.passed=true;rec.lastAt=new Date().toISOString();lab.listening[tr.id]=rec;labMessage=`Результат: ${correct}/3. ${correct===3?'Упражнение зачтено.':'Переслушай запись без расшифровки и попробуй снова.'}`;labDraft={};save();render();
    });
    const input=document.getElementById('ejlab-speak-input');if(input)input.oninput=()=>{const lab=ensureLab(),r=lab.speaking[labSelected]||(lab.speaking[labSelected]={step:0,attempts:0,answers:[],passed:false});r.draft=input.value;save()};
    document.querySelectorAll('[data-lab-speak-submit]').forEach(b=>b.onclick=()=>{
      const x=CONVERSATIONS.find(a=>a.id===b.dataset.labSpeakSubmit);if(!x)return;const lab=ensureLab(),r=lab.speaking[x.id]||(lab.speaking[x.id]={step:0,attempts:0,answers:[],passed:false});if(r.passed)return;
      const turn=x.turns[r.step||0],value=document.getElementById('ejlab-speak-input')?.value||'';const score=gradeTurn(turn,value);r.attempts++;r.draft=value;
      if(score.passed){r.answers[r.step]=value;r.step++;r.draft='';r.feedback={ok:true,text:`Есть ${score.met}/${score.required} смысловых элементов и ${score.words} слов. ${r.step>=x.turns.length?'Тренировочный диалог завершён.':'Перейди к следующему ответу.'}`};if(r.step>=x.turns.length){r.passed=true;r.step=x.turns.length-1;}}
      else r.feedback={ok:false,text:`Распознано ${score.met}/${score.required} смысловых элементов; слов ${score.words}, ориентир не менее ${score.min}. Подсказка: ${turn.tip}`};r.updatedAt=new Date().toISOString();save();render();
    });
    document.querySelectorAll('[data-lab-mic]').forEach(b=>b.onclick=()=>{
      const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!SpeechRecognition){labMessage='В этом браузере распознавание речи недоступно. Напечатай ответ — он проверяется теми же правилами.';render();return;}
      try{if(labSpeechRecognition)labSpeechRecognition.abort();labSpeechRecognition=new SpeechRecognition();labSpeechRecognition.lang='en-US';labSpeechRecognition.interimResults=false;labSpeechRecognition.maxAlternatives=1;
        const activeId=labSelected;labSpeechRecognition.onresult=e=>{if(labSelected!==activeId)return;const phrase=e.results[0][0].transcript;const field=document.getElementById('ejlab-speak-input');if(field){field.value=phrase;field.dispatchEvent(new Event('input',{bubbles:true}));}labMessage='Речь распознана. Проверь текст и нажми «Оценить ответ».';};
        labSpeechRecognition.onerror=e=>{labMessage='Не удалось распознать голос ('+e.error+'). Введи ответ вручную.';render();};
        labSpeechRecognition.start();labMessage='Слушаю. Говори по-английски; для оценки нажми «Оценить ответ».';
      }catch(error){labMessage='Микрофон недоступен: '+error.message;render();}
    });
    document.querySelectorAll('[data-lab-copy]').forEach(b=>b.onclick=()=>{
      const x=CONVERSATIONS.find(a=>a.id===b.dataset.labCopy),r=ensureLab().speaking[x?.id];if(!x)return;
      const txt=x.title+' ('+x.level+')\n'+x.turns.map((t,i)=>t.prompt+'\nMy answer: '+(r?.answers?.[i]||r?.draft||'')).join('\n\n');
      if(navigator.clipboard?.writeText)navigator.clipboard.writeText(txt).then(()=>{labMessage='Ответы скопированы. Приложение уже проверило их автоматически.';render()}).catch(()=>{labMessage='Не удалось скопировать автоматически — выдели текст ответа и скопируй вручную.';render()});
      else{labMessage='Браузер не разрешает автоматическое копирование. Выдели ответы и скопируй вручную.';render();}
    });
  }
  window.EnglishJourneyLabDebug={tracks:AUDIO_TRACKS,conversations:CONVERSATIONS,gradeTurn,labSummary};
  ensureLab();render();
})();