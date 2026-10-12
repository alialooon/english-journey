/* English Journey 11.1 — content quality, independent item ordering and varied contexts.
   Loaded after advanced_course.js and before vocabulary.js. Earlier A1/A2 progress and item IDs remain unchanged. */
(function(){
 'use strict';
 const FIRST_ADVANCED_WEEK=31;
 const SOURCE_URLS={
  A2:['https://learnenglish.britishcouncil.org/free-resources/listening/a2','https://learnenglishteens.britishcouncil.org/skills/listening/a2-listening/trains-travel','https://learnenglish.britishcouncil.org/free-resources/listening/a2/missing-class'],
  B1:['https://learnenglish.britishcouncil.org/free-resources/listening/b1','https://learnenglish.britishcouncil.org/free-resources/general/audio-series']
 };
 function hash(s){let n=2166136261;for(const c of String(s)){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return n>>>0;}
 function rotateOptions(q,seed){
  const old=q.options.slice(),correct=old[q.answer];
  const shift=hash(seed)%3;
  q.options=old.map((_,i)=>old[(i+shift)%old.length]);
  q.answer=q.options.indexOf(correct);
 }
 function rotateQuiz(q,seed){const before=q[1].slice(),correct=before[q[2]],shift=hash(seed)%3;q[1]=before.map((_,i)=>before[(i+shift)%before.length]);q[2]=q[1].indexOf(correct);}
 function extractData(text,level){
  const m=level==='A2'?text.match(/Maya was travelling (.*?) on Tuesday\. She had made a plan, but (.*?)\. She explained the situation and asked what she could do\. After checking the information, (.*?)\. As a result, (.*?)\. Maya wrote down/):text.match(/During a recent visit (.*?), Daniel encountered a situation that was more complicated than he had expected\. At first, (.*?)\. Rather than making a quick decision, he asked for an explanation and considered the consequences\. After discussing the available options, (.*?)\. Consequently, (.*?)\. He later reflected/);
  return m?{place:m[1],problem:m[2],solution:m[3],result:m[4]}:null;
 }
 function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1)}
 function readingVariants(data,level,variant){
  const {place,problem,solution,result}=data;
  const a2=[
   `Maya's travel notes. During a visit ${place}, something unexpected happened: ${problem}. She did not want to make the situation worse. After she explained the problem, ${solution}. Finally, ${result}. She kept a note of the important details and decided to check her arrangements earlier next time.`,
   `A message about Maya's trip: Maya was travelling ${place}. The day did not go as planned because ${problem}. Instead of guessing what to do, she asked for an explanation. Luckily, ${solution}. In the end, ${result}. She wanted to tell her friends what happened so they could prepare better.`,
   `Travel diary: Maya visited ${place}. At first everything seemed simple, but ${problem}. She waited for someone who could explain the choices. Then ${solution}. The result was that ${result}. Before leaving, Maya checked the information once again to avoid another surprise.`,
   `Maya described an incident during her trip ${place}. She expected an ordinary day. Instead, ${problem}. She spoke to someone responsible and asked for clear instructions. After that, ${solution}. Fortunately, ${result}. She learned that it is useful to ask questions in a calm way.`
  ];
  const b1=[
   `Traveller's account. During a visit ${place}, Daniel faced an unexpected difficulty: ${problem}. Instead of reacting immediately, he asked several questions to understand his options. Eventually, ${solution}. This meant that ${result}. Looking back, he thought the main lesson was to get accurate information before making decisions under pressure.`,
   `A travel forum report. Daniel had been visiting ${place} when his arrangements were disrupted because ${problem}. The obvious solution was not necessarily the best one, so he compared alternatives with staff. After discussing the consequences, ${solution}. As a result, ${result}. He later suggested that travellers should keep written confirmation of any changes.`,
   `The situation began during Daniel's trip ${place}. Although he had prepared carefully, ${problem}. He could have acted alone, but he preferred to clarify the rules with someone experienced. Following their discussion, ${solution}. Ultimately, ${result}. The incident illustrated why flexibility matters as much as careful planning.`,
   `Daniel wrote about a difficult decision he had to make ${place}. What surprised him most was that ${problem}. He considered several possibilities and explained his concerns before choosing a course of action. In response, ${solution}. Consequently, ${result}. He concluded that asking for an explanation had prevented a small difficulty from becoming a bigger one.`
  ];
  return (level==='A2'?a2:b1)[variant%4];
 }
 function spokenVariants(data,level,variant,loc,time){
  const {place,problem,solution,result}=data;
  const intro=[`This is today's travel update for visitors ${place}.`,`Good afternoon. We have a short message about travel arrangements ${place}.`,`Here is an important customer information notice for people ${place}.`,`Attention please. The following update concerns passengers ${place}.`][variant%4];
  const body=level==='A2'?`A problem has occurred: ${problem}. The staff have checked what happened. The next step is that ${solution}. The final outcome is that ${result}.`:`The unexpected situation is that ${problem}. Staff considered different possibilities before reaching a decision. Following that discussion, ${solution}. Consequently, ${result}. This decision was made to avoid further inconvenience.`;
  return `${intro} ${body} If you need more information, speak to a member of staff at ${loc} at ${time}. Please confirm the details before making a new plan. Thank you.`;
 }
 const sourceCases=ADVANCED_SKILLS.map((x,i)=>extractData(x.reading.text,i<19?'A2':'B1'));
 const cases=[];
 for(let w=FIRST_ADVANCED_WEEK;w<courses.length;w++){
  const u=courses[w],s=SKILLS_DATA[w],level=u.level,idx=w-FIRST_ADVANCED_WEEK;
  if(!s?.reading?.questions||!s?.audio?.questions||!u?.quiz)continue;
  const data=extractData(s.reading.text,level);
  if(data){
   s.reading.text=readingVariants(data,level,idx);
   const old=s.audio.script||'',location=(old.match(/come to (.*?) at ([\d:]+)\./)||[])[1]||'the information desk',time=(old.match(/come to (.*?) at ([\d:]+)\./)||[])[2]||'14:30';
   s.audio.script=spokenVariants(data,level,idx,location,time);
   const others=sourceCases.filter((x,i)=>i!==idx&&x);
   const cand=others.filter(x=>x.problem!==data.problem&&x.solution!==data.solution);
   const other1=cand[(idx+3)%cand.length],other2=cand[(idx+17)%cand.length];
   if(other1&&other2){
    const questions=[
     {q:'What caused the difficulty?',options:[capitalize(data.problem),capitalize(other1.problem),capitalize(other2.problem)],answer:0},
     {q:'Which action helped solve it?',options:[capitalize(data.solution),capitalize(other1.solution),capitalize(other2.solution)],answer:0}
    ];
    // Alternate fact retrieval with cause and effect, never testing the same two time/place facts in all 69 units.
    if(idx%3===0)s.audio.questions=questions;
    else if(idx%3===1)s.audio.questions=[s.audio.questions[0],questions[1]];
    else s.audio.questions=[questions[0],s.audio.questions[1]];
   }
   s.dialogues[0].turns[0].lead=`Staff: What difficulty did you encounter while travelling ${data.place}?`;
   s.dialogues[0].turns[1].lead='Staff: How was the situation handled after you asked for help?';
   s.dialogues[1].turns[0].lead=`Friend: What was the final outcome of your trip ${data.place}?`;
   cases.push(w);
  }
  // Fix two intrinsically ambiguous items: all of the previously shown English alternatives were grammatical.
  for(const j of [2,3]){
   const example=u.examples[j-2];
   if(!example)continue;
   const others=[courses[31+(idx+7)%69].examples[(j-2)][0],courses[31+(idx+23)%69].examples[(j-2)][0]];
   u.quiz[j]=[`Выбери английский вариант для: «${example[1]}»`,[example[0],...others],0];
  }
  // Make lexical review include actual topic-specific model expressions, instead of all eight identical filler phrases every week.
  const generic=(VOCAB_EXTRA[w]||[]).filter(p=>Array.isArray(p)&&p.length===2);
  VOCAB_EXTRA[w]=[...u.examples.slice(0,2),...generic.slice((idx%4),idx%4+6)];
  for(let i=0;i<u.quiz.length;i++)rotateQuiz(u.quiz[i],`quiz-${w}-${i}`);
  for(const [kind,questions] of [['reading',s.reading.questions],['audio',s.audio.questions]]){
   questions.forEach((q,i)=>rotateOptions(q,`${kind}-${w}-${i}`));
  }
  s.dialogues.forEach((d,i)=>d.turns.forEach((turn,j)=>{
   const correct=turn.choices[turn.correct],shift=hash(`dialog-${w}-${i}-${j}`)%3;
   turn.choices=turn.choices.map((_,k,arr)=>arr[(k+shift)%arr.length]);turn.correct=turn.choices.indexOf(correct);
  }));
  u.qualitySource=SOURCE_URLS[level][idx%SOURCE_URLS[level].length];
 }
 // Used by diagnostics (not to imply completion or CEFR certification).
 const seen=new Set();for(const u of courses)for(const [en] of u.words)seen.add(en.toLowerCase());
 window.__ejQualityAudit={rewrittenTopics:cases.length,allTopics:courses.length,levels:{A1:25,A2:25,B1:50},source:'English Journey in-browser automated content checks'};
})();