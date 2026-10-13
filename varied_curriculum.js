/* English Journey — independently authored variations for the foundation course.
 * Each day gets three different translation targets. All components come from
 * the current lesson's words, its explained grammar, or earlier lessons.
 * No paid-course text or exercises are reproduced.
 */
(function(){
'use strict';
const authored=[
[
['Я турист.','I am a tourist.'],['Ты турист?','Are you a tourist?'],['Она моя подруга.','She is my friend.'],
['Ты мой друг.','You are my friend.'],['Он турист?','Is he a tourist?'],['Я из Испании.','I am from Spain.'],
['Он мой друг.','He is my friend.'],['Ты из Испании?','Are you from Spain?'],['Она турист?','Is she a tourist?'],
['Она из Испании.','She is from Spain.'],['Я турист?','Am I a tourist?'],['Он из Испании?','Is he from Spain?'],
['Ты турист.','You are a tourist.'],['Она турист.','She is a tourist.'],['Он из Испании.','He is from Spain.'],
['Ты мой друг?','Are you my friend?'],['Он турист.','He is a tourist.'],['Она из Испании?','Is she from Spain?']
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
 ['Я Анна.','I am Anna.'],
 ['То моя сумка.','That is my bag.'],
 ['Станция здесь.','The station is here.'],
 ['Чаю, пожалуйста.','Tea, please.'],
 ['Они живут в Лондоне.','They live in London.'],
 ['Ты говоришь по-английски?','Do you speak English?']
];
const teachingNotes=[
 'Местоимения и связка: I → am (я); you → are (ты); he/she → is (он/она). В вопросе am/are/is ставится ПЕРЕД местоимением. tourist — турист; friend — друг/подруга; my — мой/моя; from — из; Spain — Испания. Перед tourist нужен артикль a. Используй уже изученные карточки и меняй порядок слов по правилу.',
 'This — это; that — то (вон то); a — перед согласным звуком; an — перед гласным. Один билет — one ticket, два билета — two tickets: обычно добавляем -s. bag — сумка; apple — яблоко; ticket — билет; please — пожалуйста. Для вопроса перемести is в начало — этот порядок знаком по первой теме.',
 'Where — где; here — здесь; near — рядом; shop — магазин. Вопрос о месте: Where + is + предмет. There is + один предмет, There are + несколько. Потребуются hotel, station, airport из карточек; ticket и friend уже встречались ранее. Перед airport используй an.',
 'Can I have — можно мне; I would like — я хотел бы; I want — я хочу. После них выбирай нужное существительное из карточек: water, tea, coffee, menu, bill, sandwich. Артикль a нужен для одного исчисляемого предмета, а the в the menu / the bill обозначает конкретный предмет. «С собой» — to go.',
 'Привычки: I/you/we/they + work / drink / study; he/she + works / drinks. Отрицание: I/we/they + do not + действие; he/she + does not + действие БЕЗ окончания -s. every day — каждый день; live — жить; in London — в Лондоне. Для письма используй знакомые слова.',
 'Вопросы о привычках: Do + you/they + действие?; Does + he/she + действие? После does не добавляй -s к смысловому глаголу. often — часто; sometimes — иногда; never — никогда. travel — путешествовать; work, study уже знакомы; speak English — говорить по-английски; take a taxi — брать такси.'
];
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
 const first=practice(i).slice(0,2);
 const third=model(readingOnly[Math.floor(i/6)]);
 if(first.some(x=>clean(x.en)===clean(third.en)))throw Error('Reading overlaps writing');
 return [...first,third];
}
window.EJVariety={curated,practice,weekModels,readingModels,teachingNotes,normalized:clean,
 audit(){
  const issues=[];
  for(let i=0;i<bank.length*6;i++){
   const p=practice(i),r=readingModels(i);
   if(p.length!==3||new Set(p.map(x=>clean(x.en))).size!==3)issues.push('Lesson '+i+': repeated writing targets');
   if(r.some(x=>clean(x.en)===clean(p[2].en)))issues.push('Lesson '+i+': writing answer shown in reading');
  }
  return {curatedWeeks:bank.length,curatedLessons:bank.length*6,issues};
 }
};
})();
