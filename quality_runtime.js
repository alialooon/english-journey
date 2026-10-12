/* English Journey 11.1 — unseen assessment items and transparent CEFR evidence.
 * Loaded after advanced_hooks.js; does not replace or reset the localStorage format.
 */
(function(){
 'use strict';
 // Each of these passages and spoken scripts is NEW: neither the regular lesson nor topic quiz uses them.
 // One question per unseen text. This reduces rehearsal, not a psychometrically validated CEFR exam.
 const UNSEEN={
  A2:{
   reading:[
    [`City bus notice: Route 14 will not stop at the library between 11:00 and 15:00 on Saturday because of road repairs. Passengers for the library should leave the bus at Market Square and walk five minutes. All other stops will be served as usual.`, 'How can someone reach the library on Saturday afternoon?', 'Get off at Market Square and walk', 'Wait at the library stop', 'Take Route 14 to the airport'],
    [`Dear Sofia, your hotel booking is confirmed for two nights starting 18 June. Breakfast is included, but the underground car park costs eight euros per night. Please bring your booking number to reception. You can check in after 15:00.`, 'What is NOT included in the room price?', 'Parking', 'Breakfast', 'Two nights'],
    [`Community centre notice: The swimming pool opens at nine on weekdays and at ten on Sundays. On Friday the pool closes one hour early for staff training. The gym remains open until eight on Friday evening.`, 'What changes on Friday?', 'The pool closes earlier', 'The gym is closed all day', 'The pool opens at ten'],
    [`Hello, we have received your request to change tomorrow's appointment. The dentist is not available at 10:30, but there is a free time at 12:15. Please call before six this evening to confirm the later appointment.`, 'What should the patient do?', 'Confirm the 12:15 appointment by six', 'Arrive at 10:30 without calling', 'Visit the dentist next week'],
    [`Restaurant menu: Vegetable soup is six pounds. The chicken sandwich is nine pounds and includes a small salad. Our lunch offer costs twelve pounds and includes soup, a sandwich and water. Other drinks cost extra.`, 'What does the lunch offer include?', 'Soup, sandwich and water', 'Only a sandwich and coffee', 'Salad and any drink'],
    [`Rail company email: Your 17:45 train has been cancelled. You may travel on the 18:15 service using your original ticket. There is no additional charge. If you prefer not to travel, you can request a refund before midnight tomorrow.`, 'Which statement is correct?', 'The later train costs no extra money', 'The original ticket is no longer valid', 'Refund requests closed yesterday']
   ],
   listening:[
    [`Hello. This is the travel information desk. The museum tour begins at eleven fifteen today, not at eleven. Please meet the guide at the east entrance. Tickets bought online remain valid.`, 'When does the museum tour start?', '11:15', '11:00', '10:15'],
    [`Good morning. This is a message for Mr Green. Your new room is on the fourth floor. Collect your key from reception after breakfast. The old room is being repaired.`, 'Where should Mr Green get the key?', 'At reception', 'On the third floor', 'At the restaurant'],
    [`Hello, Anna. I'm calling because our meeting has moved to Thursday afternoon. I can't come on Wednesday because I have to visit the doctor. Please text me if Thursday is difficult for you.`, 'Why was the meeting moved?', 'The caller has a medical appointment', 'Anna is leaving the city', 'The office is closed'],
    [`Attention passengers. The bus to Oxford leaves from stop six today. The ticket office is closed, but tickets can be bought from the driver using a bank card. Cash will not be accepted.`, 'How can passengers pay for tickets?', 'With a bank card on the bus', 'With cash at stop six', 'With cash at the ticket office'],
    [`Hi, this is your host. I will leave the apartment key in the small box next to the front door. The code is sent in your booking message. If you arrive after eight, please be quiet in the hall.`, 'Where will the key be?', 'In a box next to the front door', 'At the bus station', 'Under the kitchen table'],
    [`Hello everyone. Tomorrow's walking tour will happen only if the weather improves. We will send a message at seven in the morning. If it is cancelled, everyone will get their money back automatically.`, 'What happens if the tour is cancelled?', 'Guests receive an automatic refund', 'Guests must book a different hotel', 'The tour moves to the evening']
   ]
  },
  B1:{
   reading:[
    [`A traveller wrote to a rail company after missing a connection. Her first train was delayed by forty minutes, but staff explained that the second train belonged to a different company. Although she had bought both tickets at the same time, a refund was not automatic. She was advised to send both receipts and an explanation of the delay. She decided to keep copies of all documents.`, 'What made getting compensation less straightforward?', 'The trains were operated by different companies', 'She had lost every ticket', 'The first train arrived early'],
    [`An apartment review praised the central location but warned future guests about the noise. The reviewer had expected a quiet place to work because the listing mentioned a private study. However, construction work began next door at seven each morning. The owner offered a small discount rather than alternative accommodation. The reviewer thought this was a reasonable gesture but would not stay there again.`, "Which best describes the reviewer's opinion?", 'The response was fair but the accommodation was unsuitable', 'The apartment was perfect for remote work', 'The owner refused to discuss the complaint'],
    [`After her flight was diverted, Nina received a hotel voucher. It covered one night and transport from the airport, but it did not include meals. Some passengers assumed food was free and later found unexpected charges on their bills. Nina asked the reception staff to explain the voucher before ordering.`, 'Why did Nina avoid an unexpected expense?', 'She checked exactly what the voucher covered', 'She booked a more expensive room', 'She refused the airport transfer'],
    [`A local council plans to reduce traffic in the historic centre by limiting private cars during busy weekends. Shop owners are concerned about deliveries, while residents expect safer streets. The council has suggested morning delivery hours and a free shuttle from the car park. A trial will run for three months before a final decision.`, 'What is the purpose of the three-month trial?', 'To assess the changes before deciding permanently', 'To close every shop in the centre', 'To remove the shuttle immediately'],
    [`In a travel forum, Leo described an excursion that started well but ended early because of heavy rain. The guide had warned that the route could become unsafe, yet some visitors wanted to continue. The group eventually agreed to return, and the operator offered a different activity the next morning. Leo appreciated the decision because it balanced safety with the visitors' interests.`, 'Why did Leo support the decision?', 'It put safety first while offering an alternative', 'The group finished the original route', 'The guide promised that the rain would stop'],
    [`A training programme offers evening English classes for workers. Applicants can attend online or in person, but anyone choosing the classroom option must register in advance because places are limited. The programme is free; participants pay only for optional printed materials. The organiser recommends attending regularly to benefit from group discussions.`, 'Why is advance registration necessary for classroom learners?', 'The number of classroom places is limited', 'Every lesson is paid', 'Online classes are not available']
   ],
   listening:[
    [`We have reviewed your claim about the damaged suitcase. Although the report was filed promptly, the airline requires a copy of the purchase receipt before it can decide on compensation. You may submit a photo of the original receipt, so there is no need to visit the airport again.`, "What is the passenger's next step?", 'Send a copy of the purchase receipt', 'Buy another ticket', 'Return to the airport immediately'],
    [`Our team considered moving the conference online because of transport problems. In the end, we decided to keep the in-person meeting but start an hour later. This should allow most delegates to arrive safely while preserving the networking session.`, 'Why was the start time changed?', 'To make travel easier without cancelling the meeting', 'To shorten the networking session', 'Because the venue was unavailable'],
    [`The weather forecast has improved, but conditions on the mountain remain uncertain. We will make the final decision at half past six tomorrow morning. Participants should not leave their accommodation before receiving our message. Anyone who cannot join a postponed hike can request a refund.`, 'What should participants do before setting off?', 'Wait for the organiser’s final message', 'Start walking at six', 'Book a second guide'],
    [`When I moved to another country, I thought finding an apartment would be the hardest part. In fact, understanding local banking rules took longer. My colleagues helped me compare accounts, and I eventually chose one with lower fees, even though the application process was slightly slower.`, 'What mattered most in the speaker’s final decision?', 'Lower ongoing bank charges', 'The fastest possible application', 'Living close to colleagues'],
    [`The museum has introduced timed admission to reduce queues. Some visitors worry this makes spontaneous visits difficult, but staff say that a limited number of tickets will still be sold at the door. The system will be reviewed after the summer season, once visitor feedback has been collected.`, 'What is the museum trying to balance?', 'Shorter queues and some flexibility for visitors', 'Higher prices and fewer exhibits', 'Faster repairs and longer closing times'],
    [`I had planned to take the direct coach, but the departure was brought forward without much notice. Instead of rushing, I compared the alternatives and booked a train that arrived thirty minutes later. Although it was more expensive, it gave me enough time to reach the station without stress.`, 'What influenced the speaker’s choice?', 'A less stressful journey despite a higher price', 'The cheapest possible ticket', 'Arriving exactly at the original time']
   ]
  }
 };
 function qfrom(row,level,index,kind){
  const [script,prompt,good,bad1,bad2]=row;
  const options=[good,bad1,bad2];
  const rot=(index*5+(level==='B1'?1:0)+(kind==='listening'?1:0))%3;
  const moved=options.map((_,i)=>options[(i+rot)%3]);
  const q={id:`unseen-${level}-${kind}-${index}`,type:kind,prompt,options:moved,answer:moved.indexOf(good),review:'Незнакомый материал итоговой диагностики. Обрати внимание на содержание, а не только на отдельные слова.'};
  if(kind==='reading')q.passage=script;
  else{q.spoken=script;q.audioTitle='Новый сценарий — озвучка браузера, НЕ живое аудио';}
  return q;
 }
 const originalGenerate=generateFinalQuestions;
 generateFinalQuestions=function(attempt,mode=examMode()){
  const questions=originalGenerate(attempt,mode);
  if(!UNSEEN[mode])return questions;
  const reading=UNSEEN[mode].reading.map((row,i)=>qfrom(row,mode,i,'reading'));
  const listening=UNSEEN[mode].listening.map((row,i)=>qfrom(row,mode,i,'listening'));
  const newQuestions=[];let ri=0,li=0;
  for(const q of questions){
   if(q.type==='reading')newQuestions.push(reading[ri++%reading.length]);
   else if(q.type==='listening')newQuestions.push(listening[li++%listening.length]);
   else newQuestions.push(q);
  }
  if(ri!==6||li!==6||newQuestions.length!==36)throw Error('Неверная структура независимых вопросов экзамена '+mode);
  return newQuestions;
 };
 // A wrong attempt must not display the exact answer before the learner recalls it.
 const baseGrammarPane=skillGrammarPane;
 skillGrammarPane=function(r){
  return baseGrammarPane(r).replace(/Пока не совпало\. Образец: <b>[\s\S]*?<\/b>\. Напиши ещё раз без подсказки\./g,
   'Пока не совпало. Проверь порядок слов и правило темы, затем попробуй ещё раз самостоятельно.');
 };
 // The synthetic-audio result is not counted or described as verified natural-language comprehension.
 const baseAudioPane=skillAudioPane;
 skillAudioPane=function(r){
  const html=baseAudioPane(r),w=Math.floor(dayFocus/6);
  if(w<31)return html;
  const u=courses[w],link=u.qualitySource||('https://learnenglish.britishcouncil.org/free-resources/listening/'+u.level.toLowerCase());
  return html.replace('</div><h3>🎧',`</div><h3>🎧`).replace('Дополнительная практика с настоящей речью:',
    `Для независимой практики реального аудирования выбери оригинальное упражнение и выполни задания на сайте правообладателя (результат не синхронизируется):`)
    .replace(/href="https:\/\/learnenglish\.britishcouncil\.org\/free-resources\/listening\/(a2|b1)"/,
     `href="${esc(link)}"`);
 };
 const originalAssessment=assessmentsPage;
 assessmentsPage=function(){
  return originalAssessment()+`<div class="panel"><h3>Как понимать результаты</h3><p><b>Внутренние зачёты</b> оценивают ответы в приложении. В A2/B1 итоговый тест теперь содержит 12 незнакомых заранее заданий на чтение и сценарное аудирование. Голос синтезирован браузером — это <b>не подтверждение понимания живой речи</b>.</p><p>Для внешней проверки используй реальные записи и упражнения <a href="https://learnenglish.britishcouncil.org/free-resources/listening/a2" target="_blank" rel="noopener noreferrer">A2</a> или <a href="https://learnenglish.britishcouncil.org/free-resources/listening/b1" target="_blank" rel="noopener noreferrer">B1</a>, а для устной речи и письма — преподавателя или официальный экзамен. Внутренний результат не равен сертификату CEFR.</p></div>`;
 };
 if(typeof APP_VERSION==='string' && APP_VERSION!=='11.1.0')console.info('English Journey quality update requires engine version bump');
 render();
})();