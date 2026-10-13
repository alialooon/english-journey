/* English Journey — independently authored variations for the foundation course.
 * Each day gets three different translation targets. All components come from
 * the current lesson's words, its explained grammar, or earlier lessons.
 * No paid-course text or exercises are reproduced.
 */
(function(){
'use strict';
const authored=[
[
['Я Алекс.','I am Alex.'],['Ты Анна.','You are Anna.'],['Я Анна.','I am Anna.'],
['Он Алекс.','He is Alex.'],['Она Анна.','She is Anna.'],['Ты Алекс.','You are Alex.'],
['Я Анна?','Am I Anna?'],['Ты Алекс?','Are you Alex?'],['Она Анна?','Is she Anna?'],
['Я из России.','I am from Russia.'],['Она из Испании.','She is from Spain.'],['Ты из России?','Are you from Russia?'],
['Он не Алекс.','He is not Alex.'],['Я не Анна.','I am not Anna.'],['Ты не из Испании.','You are not from Spain.'],
['Он из России?','Is he from Russia?'],['Мы из Испании.','We are from Spain.'],['Они из России.','They are from Russia.']
],
[
['Это сумка.','This is a bag.'],['Вон то — билет.','That is a ticket.'],['Это яблоко.','This is an apple.'],
['Вон то — яблоко.','That is an apple.'],['Два билета, пожалуйста.','Two tickets, please.'],['Это билет.','This is a ticket.'],
['Это один билет.','This is one ticket.'],['Вон то — сумка.','That is a bag.'],['Две сумки, пожалуйста.','Two bags, please.'],
['Это билет?','Is this a ticket?'],['Вон то — яблоко?','Is that an apple?'],['Это одна сумка.','This is one bag.'],
['Один билет, пожалуйста.','One ticket, please.'],['Это сумка?','Is this a bag?'],['Это яблоко?','Is this an apple?'],
['Два билета.','Two tickets.'],['Вон то — билет?','Is that a ticket?'],['Одну сумку, пожалуйста.','One bag, please.']
],
[
['Где отель?','Where is the hotel?'],['Здесь есть отель.','There is a hotel here.'],['Где станция?','Where is the station?'],
['Здесь есть магазин.','There is a shop here.'],['Отель рядом со станцией.','The hotel is near the station.'],['Где аэропорт?','Where is the airport?'],
['Здесь есть станция.','There is a station here.'],['Где магазин?','Where is the shop?'],['Станция рядом с отелем.','The station is near the hotel.'],
['Где мой отель?','Where is my hotel?'],['Отель здесь.','The hotel is here.'],['Рядом есть магазин.','There is a shop near here.'],
['Где мой билет?','Where is my ticket?'],['Мой билет здесь.','My ticket is here.'],['Здесь есть аэропорт.','There is an airport here.'],
['Отель рядом с аэропортом.','The hotel is near the airport.'],['Здесь есть две станции.','There are two stations here.'],['Где мой друг?','Where is my friend?']
],
[
['Можно мне воды?','Can I have water?'],['Я хотел бы чаю.','I would like tea.'],['Я хочу сэндвич.','I want a sandwich.'],
['Можно мне меню?','Can I have the menu?'],['Я хотел бы кофе.','I would like a coffee.'],['Я хочу воды.','I want water.'],
['Можно мне чаю?','Can I have tea?'],['Я хотел бы сэндвич.','I would like a sandwich.'],['Можно мне счёт?','Can I have the bill?'],
['Можно мне кофе?','Can I have a coffee?'],['Я хочу чаю.','I want tea.'],['Я хотел бы воды.','I would like water.'],
['Можно мне сэндвич?','Can I have a sandwich?'],['Я хотел бы меню.','I would like the menu.'],['Я хочу кофе.','I want coffee.'],
['Можно мне счёт, пожалуйста?','Can I have the bill, please?'],['Я хотел бы чай, пожалуйста.','I would like a tea, please.'],['Я хочу кофе с собой.','I want a coffee to go.']
],
[
['Я работаю.','I work.'],['Она работает.','She works.'],['Я не работаю.','I do not work.'],
['Он работает каждый день.','He works every day.'],['Я учусь.','I study.'],['Они работают.','They work.'],
['Я пью чай.','I drink tea.'],['Она пьёт чай.','She drinks tea.'],['Мы не работаем.','We do not work.'],
['Они учатся.','They study.'],['Он пьёт чай.','He drinks tea.'],['Ты работаешь.','You work.'],
['Она работает в Лондоне.','She works in London.'],['Я не пью кофе.','I do not drink coffee.'],['Мы живём в Лондоне.','We live in London.'],
['Он не работает.','He does not work.'],['Они пьют кофе.','They drink coffee.'],['Я работаю каждый день.','I work every day.']
],
[
['Ты путешествуешь?','Do you travel?'],['Он работает?','Does he work?'],['Я иногда путешествую.','I sometimes travel.'],
['Она путешествует?','Does she travel?'],['Ты работаешь?','Do you work?'],['Я никогда не путешествую.','I never travel.'],
['Они путешествуют?','Do they travel?'],['Она говорит по-английски?','Does she speak English?'],['Я часто путешествую.','I often travel.'],
['Он говорит по-английски?','Does he speak English?'],['Ты изучаешь английский?','Do you study English?'],['Мы иногда путешествуем.','We sometimes travel.'],
['Ты часто путешествуешь?','Do you often travel?'],['Она часто работает?','Does she often work?'],['Я никогда не беру такси.','I never take a taxi.'],
['Он часто путешествует?','Does he travel often?'],['Они работают?','Do they work?'],['Я иногда беру такси.','I sometimes take a taxi.']
]
];
const readingOnly=[
 [
  ['Ты Мия.','You are Mia.'],['Он Сэм.','He is Sam.'],
  ['Он Сэм?','Is he Sam?'],['Он из России.','He is from Russia.'],
  ['Она не Мия.','She is not Mia.'],['Они из Испании.','They are from Spain.']
 ],
 [
  ['Это одна сумка.','This is one bag.'],['Это одно яблоко.','This is one apple.'],
  ['Вон то — одна сумка.','That is one bag.'],['Вон то — один билет?','Is that one ticket?'],
  ['Это одна сумка?','Is this one bag?'],['Вон то — одна сумка?','Is that one bag?']
 ],
 [
  ['Станция здесь.','The station is here.'],['Отель здесь?','Is the hotel here?'],
  ['Мой отель здесь.','My hotel is here.'],['Здесь есть сумка.','There is a bag here.'],
  ['Аэропорт рядом с отелем.','The airport is near the hotel.'],['Здесь рядом есть отель.','There is a hotel near here.']
 ],
 [
  ['Чаю, пожалуйста.','Tea, please.'],['Кофе, пожалуйста.','Coffee, please.'],
  ['Воды, пожалуйста.','Water, please.'],['Сэндвич, пожалуйста.','A sandwich, please.'],
  ['Счёт, пожалуйста.','The bill, please.'],['Меню, пожалуйста.','The menu, please.']
 ],
 [
  ['Они живут в Лондоне.','They live in London.'],['Я живу в Лондоне.','I live in London.'],
  ['Мы учимся каждый день.','We study every day.'],['Он не пьёт чай.','He does not drink tea.'],
  ['Мы пьём чай.','We drink tea.'],['Ты не работаешь.','You do not work.']
 ],
 [
  ['Ты говоришь по-английски?','Do you speak English?'],['Он учится?','Does he study?'],
  ['Я никогда не работаю.','I never work.'],['Они часто путешествуют.','They often travel.'],
  ['Он часто путешествует?','Does he often travel?'],['Они говорят по-английски?','Do they speak English?']
 ]
];
const teachingNotes=[
 'В первой теме изучаем только I / you / he / she / we / they и формы am / are / is: артикли a, an, the изучаются в СЛЕДУЮЩЕЙ теме и здесь не используются в предложениях. Новые элементы подробно разобраны для каждого урока ниже.',
 'Артикль — короткое служебное слово перед существительным. В русском «сумка» может стоять само, а в английском перед ОДНИМ исчисляемым предметом обычно нужен определитель. A/AN указывают на одного представителя группы, когда не уточняем, какого именно: a bag = какая-то сумка; an apple = какое-то яблоко. A ставят перед согласным ЗВУКОМ, an — перед гласным ЗВУКОМ. THE используют, когда речь об уже известном или конкретном предмете; THIS = этот, THAT = тот. Перед существительным с my/this/that второй артикль не нужен. One = один, two = два; two tickets = два билета (обычно добавляем -s). Bag = сумка; apple = яблоко; ticket = билет; please = пожалуйста. В вопросах с is глагол идёт в начале — это правило уже знакомо.',
 'Where — где; here — здесь; near — рядом; shop — магазин. Вопрос о месте: Where + is + предмет. There is + один предмет, There are + несколько. Потребуются hotel, station, airport из карточек; ticket и friend уже встречались ранее. Перед airport используй an.',
 'Can I have — можно мне; I would like — я хотел бы; I want — я хочу. После них выбирай нужное существительное из карточек: water, tea, coffee, menu, bill, sandwich. Артикль a нужен для одного исчисляемого предмета, а the в the menu / the bill обозначает конкретный предмет. «С собой» — to go.',
 'Привычки: I/you/we/they + work / drink / study; he/she + works / drinks. Отрицание: I/we/they + do not + действие; he/she + does not + действие БЕЗ окончания -s. every day — каждый день; live — жить; in London — в Лондоне. Для письма используй знакомые слова.',
 'Вопросы о привычках: Do + you/they + действие?; Does + he/she + действие? После does не добавляй -s к смысловому глаголу. often — часто; sometimes — иногда; never — никогда. travel — путешествовать; work, study уже знакомы; speak English — говорить по-английски; take a taxi — брать такси.'
];
// A0 has no implicit prerequisites. Every model is composed only of tokens
// explicitly introduced on that day or on earlier days of the first topic.
const foundationNewTokens=[
 ['i','am','alex','you','are','anna','mia'],
 ['he','she','is','sam'],
 [],['from','russia','spain'],['not'],['we','they']
];
const foundationLessons=[
 {
  title:'Урок 1. I am / You are: называем имя',
  rule:'I = я; am = форма глагола «быть» после I. You = ты или вы; are = форма этого глагола после you. В русском «Я Алекс» мы не говорим «есть», но в английском am обязательно.',
  words:'Alex = Алекс; Anna = Анна; Mia = Мия (имена людей). Это имена, поэтому перед ними не требуется артикль.',
  examples:[['I am Mia.','Я Мия.'],['You are Mia.','Ты Мия.']],
  task:'Напиши имя человека после I am или You are. Других грамматических правил пока не требуется.'
 },
 {
  title:'Урок 2. He is / She is: говорим о другом человеке',
  rule:'He = он; she = она. С he и she говорим is, не am и не are. Ранее изученные I am и You are тоже остаются в использовании.',
  words:'Sam = Сэм — ещё одно имя. Используй уже знакомые Anna, Alex и Mia.',
  examples:[['He is Sam.','Он Сэм.'],['She is Mia.','Она Мия.']],
  task:'Выбери подходящее местоимение, затем поставь правильную форму am, is или are.'
 },
 {
  title:'Урок 3. Вопросы с am, is и are',
  rule:'В обычной фразе: He is ... (Он ...). В вопросе меняем порядок: Is he ...? (Он ...?). Аналогично: Am I ...? (Я ...?) и Are you ...? (Ты ...?). Знак вопроса обязателен по смыслу, но при проверке допустим ответ и без него.',
  words:'Новых слов нет: I, you, he, she, Anna, Alex, Mia и Sam уже знакомы.',
  examples:[['Are you Mia?','Ты Мия?'],['Is he Sam?','Он Сэм?']],
  task:'Вопрос начинается с am, is или are. Ответы ниже не совпадают с примерами.'
 },
 {
  title:'Урок 4. From: откуда человек',
  rule:'From означает «из»: I am from ... = «Я из ...»; She is from ... = «Она из ...». В вопросе: Are you from ...? = «Ты из ...?». Порядок вопроса мы уже разобрали.',
  words:'Russia = Россия; Spain = Испания. Это названия стран. Перед ними в этих фразах нет артикля.',
  examples:[['He is from Russia.','Он из России.'],['Is she from Spain?','Она из Испании?']],
  task:'Используй from вместе с уже пройденными I, you, he, she и названиями стран.'
 },
 {
  title:'Урок 5. Not: простое отрицание',
  rule:'Not = не. После am / is / are ставим not: He is not ... = «Он не ...»; I am not ... = «Я не ...». Вопросы и положительные предложения уже знакомы.',
  words:'Новых слов не требуется — только одно новое правило not.',
  examples:[['She is not Mia.','Она не Мия.'],['He is not from Spain.','Он не из Испании.']],
  task:'Чтобы получить отрицание, добавь not после am, is или are.'
 },
 {
  title:'Урок 6. We / They и закрепление',
  rule:'We = мы; they = они. После обоих местоимений используем are: We are ... = «Мы ...»; They are ... = «Они ...». Повторяем вопросы и from из предыдущих уроков.',
  words:'Все остальные слова и конструкции были разобраны в этой теме.',
  examples:[['They are from Spain.','Они из Испании.'],['We are from Russia.','Мы из России.']],
  task:'Самостоятельно применяй знакомые конструкции в новой комбинации.'
 }
];
// Original pattern cards inspired by structural transformation drills, not
// derived from course worksheets. Fragments only: never a complete test answer.
const foundationPatterns=[
 {rows:[['Я','I + am'],['Ты / вы','You + are']],
  drill:[['Начало фразы «Я ...»','I am'],['Начало фразы «Ты ...»','You are']]},
 {rows:[['Он','He + is'],['Она','She + is']],
  drill:[['Начало фразы «Он ...»','He is'],['Начало фразы «Она ...»','She is']]},
 {rows:[['Утверждение','You + are + ...'],['Вопрос','Are + you + ...?'],
  ['Утверждение','He + is + ...'],['Вопрос','Is + he + ...?']],
  drill:[['Начало вопроса «Ты ...?»','Are you'],['Начало вопроса «Он ...?»','Is he']]},
 {rows:[['Я из ...','I + am + from + ...'],['Она из ...','She + is + from + ...']],
  drill:[['Начало фразы «Я из ...»','I am from'],['Начало фразы «Она из ...»','She is from']]},
 {rows:[['Утверждение','I + am + ...'],['Отрицание','I + am + not + ...'],
  ['Утверждение','She + is + ...'],['Отрицание','She + is + not + ...']],
  drill:[['Начало фразы «Я не ...»','I am not'],['Начало фразы «Она не ...»','She is not']]},
 {rows:[['Мы','We + are'],['Они','They + are']],
  drill:[['Начало фразы «Мы ...»','We are'],['Начало фразы «Они ...»','They are']]}
];
function foundationPatternPane(i,escape,r){
 const map=foundationPatterns[i];if(!map)return '';
 const done=r?.formulaDrills||{};
 const chart='<details class="formula-help"><summary>Посмотреть схему построения</summary>'+
  '<div class="formula-grid">'+map.rows.map(pair=>
   '<div class="formula-cell"><span>'+escape(pair[0])+'</span><b lang="en">'+escape(pair[1])+'</b></div>').join('')+
  '</div></details>';
 const drills=map.drill.map((pair,j)=>{
  const answered=Boolean(done[j]);
  return '<div class="formula-task"><span>'+escape(pair[0])+'</span>'+
   (answered?'<span class="tiny" aria-label="Ответ проверен">✓ Верно</span>':
    '<div class="skill-inputrow"><input data-formula-input="'+j+'" spellcheck="false" autocomplete="off" '+
    'placeholder="Английское начало фразы" aria-label="'+escape(pair[0])+'. Напиши на английском">'+
    '<button class="outline" data-formula-check="'+j+'">Проверить</button></div>'+
    (r?.formulaMistakes?.[j]?'<p class="tiny">Проверь схему выше и попробуй ещё раз.</p>':''))+
   '</div>';
 }).join('');
 return '<section class="formula-training"><h4>Схема: учимся менять форму</h4>'+
 '<p class="tiny">Сначала разбери схему, затем закрой её и попробуй вспомнить начало фразы. '+
 'Это дополнительная тренировка, она не заменяет самостоятельный перевод.</p>'+
 chart+'<div class="formula-tasks">'+drills+'</div></section>';
}
function foundationPanel(i,escape,r){
 if(i<0||i>=6)return null;
 const item=foundationLessons[i];
 return '<div class="known-models"><h3>'+escape(item.title)+'</h3>'+
 '<p><b>Правило:</b> '+escape(item.rule)+'</p>'+
 '<p><b>Слова:</b> '+escape(item.words)+'</p>'+
 '<h4>Разобранные примеры (не ответы на проверку)</h4>'+
 item.examples.map(p=>'<div class="ex"><b lang="en">'+escape(p[0])+'</b><span>'+escape(p[1])+'</span></div>').join('')+
 '<p class="tiny">'+escape(item.task)+'</p>'+foundationPatternPane(i,escape,r)+'</div>';
}
function foundationAudit(){
 const errors=[],seen=new Set();
 for(let d=0;d<6;d++){
  foundationNewTokens[d].forEach(t=>seen.add(t));
  const rows=[...practice(d),...readingModels(d)];
  for(const item of rows)for(const word of item.en.toLowerCase().match(/[a-z]+/g)||[]){
   if(!seen.has(word))errors.push({day:d+1,word,model:item.en});
  }
 }
 return errors;
}
const clean=s=>String(s||'').trim().toLowerCase().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
function model(pair){
 const audited=window.EJLanguageContract.auditedPrompt({ru:pair[0],en:pair[1]});
 return {...audited,source:'original_graded_variation'};
}
const bank=authored.map((unit,w)=>{
 if(unit.length!==18)throw Error('Expected 18 independent practice sentences in topic '+w);
 const rows=unit.map(model),all=new Set(rows.map(x=>clean(x.en)));
 if(all.size!==18||new Set(rows.map(x=>x.ru.trim().toLowerCase())).size!==18)throw Error('Duplicate sentence in topic '+w);
 return rows;
});
function curated(i){return Math.floor(i/6)<bank.length;}
function practice(i){
 const w=Math.floor(i/6),day=i%6;
 if(bank[w])return bank[w].slice(day*3,day*3+3);
 const grammar=SKILLS_DATA[w].grammar;
 return [0,1,2].map(j=>window.EJLanguageContract.auditedPrompt(grammar[(day+j)%grammar.length]));
}
function weekModels(i){return bank[Math.floor(i/6)]||SKILLS_DATA[Math.floor(i/6)].grammar;}
function readingModels(i){
 if(!curated(i))return null;
 const day=i%6;
 const first=practice(day===0?i:i-1).slice(0,2);
 const third=model(readingOnly[Math.floor(i/6)][day]);
 const assessed=practice(i);
 if(assessed.some(x=>clean(x.en)===clean(third.en))||
    first.some(x=>clean(x.en)===clean(assessed[2].en)))throw Error('Reading reveals a writing answer');
 return [...first,third];
}
window.EJVariety={curated,practice,weekModels,readingModels,teachingNotes,foundationPanel,foundationPatternPane,foundationPatterns,foundationAudit,foundationHint:i=>foundationLessons[i]?.rule||'',normalized:clean,
 audit(){
  const issues=[];
  for(let i=0;i<bank.length*6;i++){
   const p=practice(i),r=readingModels(i);
   if(p.length!==3||new Set(p.map(x=>clean(x.en))).size!==3)issues.push('Lesson '+i+': repeated writing targets');
   if(r.some(x=>clean(x.en)===clean(p[2].en)))issues.push('Lesson '+i+': writing answer shown in reading');
   if(i%6>0&&r.some(x=>p.some(y=>clean(x.en)===clean(y.en))))issues.push('Lesson '+i+': duplicate same-day grammar in reading');
  }
  return {curatedWeeks:bank.length,curatedLessons:bank.length*6,issues:[...issues,...foundationAudit()]};
 }
};
})();
