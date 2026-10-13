/* English Journey 13.2 — real Chromium smoke tests. No test-server backend or private data.
 * Run: npm i --no-save playwright && npx playwright install chromium
 *      python3 -m http.server 8765 --bind 127.0.0.1 &
 *      node tests/browser-smoke.mjs
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const ORIGIN='http://127.0.0.1:8765/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let passed=0;
const cleanStore=()=>({started:null,planStartDate:'2026-10-12',logs:{},history:{},checkpoints:{},exams:{},
 vocabulary:{},vocabDaily:{},preferences:{adaptive:true},migratedTopicChecks:true});
function seeded(weeks=0){
 const s=cleanStore();
 for(let i=0;i<weeks*6;i++)s.logs[String(i)]={steps:[true,true,true,true,true],doneAt:'2026-10-12T11:00:00.000Z',answered:[]};
 for(let i=0;i<weeks;i++)s.checkpoints[String(i)]={passedAt:'2026-10-12T12:00:00.000Z',attempts:[]};
 return s;
}
async function fresh(seed=cleanStore()){
 const context=await browser.newContext();
 await context.addInitScript((value)=>{if(!sessionStorage.getItem('__ej_smoke_seeded')){localStorage.setItem('englishJourneyTravelV1',JSON.stringify(value));sessionStorage.setItem('__ej_smoke_seeded','1');}},seed);
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',err=>errors.push(String(err)));
 await page.goto(ORIGIN,{waitUntil:'load'});
 await page.locator('#root').waitFor();
 await page.waitForTimeout(200);
 return {page,context,errors};
}
async function scenario(label,run){
 const caseState=await fresh(run.seed||cleanStore());
 try{await run(caseState.page,caseState.context);
  assert.deepEqual(caseState.errors,[],'Browser JavaScript errors');
  console.log('PASS: '+label);passed++;
 }finally{await caseState.context.close();}
}
await scenario('startup, 100 topics, 600 lessons, optional listening',async page=>{
 assert.equal(await page.evaluate(()=>courses.length),100);
 assert.equal(await page.evaluate(()=>total),600);
 assert.equal(await page.evaluate(()=>APP_VERSION),'13.9.0');
 assert.equal(await page.evaluate(()=>nextTask().type),'lesson');
 await page.locator('[data-open="0"]').first().click();
 const r=await page.evaluate(()=>({steps:record(0).steps,blocked:nextTask().type}));
 assert.equal(r.steps[2],true,'Listening must be pre-marked optional');
 assert.ok(await page.locator('#root').innerText());
});
await scenario('prerequisite audit covers all 600 lessons: no future word in lesson or deferred review',async page=>{
 const audit=await page.evaluate(()=>{
  const errors=[];
  for(let i=0;i<600;i++){
   const validation=EJPrerequisites.validateLesson(i);
   if(!validation.ok)errors.push({i,...validation});
  }
  return {total:600,errors};
 });
 assert.deepEqual(audit.errors,[],'Every question, distractor, reading, dialog, deferred recall must be previously introduced');
 await page.locator('[data-open="0"]').first().click();
 const wordBank=await page.evaluate(()=>vocabForLesson(0).map(x=>x.en));
 const review=await page.evaluate(()=>{
  const a=EJPrerequisites.reviewTask({kind:'writing',lesson:0,ref:'text',revision:0});
  const b=EJPrerequisites.reviewTask({kind:'vocabulary',lesson:0,ref:vocabForLesson(0)[0].id,revision:0});
  return {a,b};
 });
 assert.equal(review.a.mode,'text','Legacy nine-word free-writing obligation is replaced');
 assert.ok(wordBank.includes(review.a.expected));
 assert.ok(wordBank.includes(review.b.expected));
 assert.ok(!wordBank.includes('welcome'),'Welcome is not taught in the first day.');
 const intro=await page.evaluate(()=>EJPrerequisites.models(0).map(m=>m.en));
 await page.evaluate(()=>{
  const r=record(0);r.steps[1]=true;r.flowStep=1;save();render();
 });
 const pane=await page.locator('.known-models').innerText();
 for(const model of intro)assert.equal(pane.includes(model),false,'Finished answers must not appear intact in the teaching panel');
 assert.ok(pane.includes('ВОПРОС:'),'Question order must be explicitly taught');
 assert.equal((await page.evaluate(()=>EJVariety.audit())).issues.length,0);
 const contract=await page.evaluate(()=>EJLanguageContract.verify());
 assert.equal(contract.models,300);
 assert.deepEqual(contract.errors,[]);
 await page.evaluate(()=>{
  const r=record(0);r.steps[0]=true;r.flowStep=2;save();render();
 });
 const quiz=await page.locator('.questiongroup').allInnerTexts();
 for(const q of quiz)assert.ok(!q.includes('welcome'),'No future vocabulary even in multiple-choice options');
 assert.match(await page.locator('.reading-source').innerText(),/tourist/i);
 assert.equal((await page.locator('.reading-source').innerText()).includes('Mia'),false,'Untaught long reading hidden');
});
await scenario('question and statement meaning agrees in both languages for all lessons',async page=>{
 const results=await page.evaluate(()=>{
  const issues=[];
  for(let w=0;w<100;w++){
   const topics=SKILLS_DATA[w].grammar;
   for(const m of topics){
    const type=EJLanguageContract.sentenceType(m.en);
    if((type==='question')!==m.ru.endsWith('?'))issues.push({w,m});
    if((type==='question')!==m.en.endsWith('?'))issues.push({w,m});
   }
  }
  for(let i=0;i<600;i++){
   dayFocus=i;
   const r=record(i),u=courses[Math.floor(i/6)];
   const src=theoryPane(u,i%6,r).split('<div class="skill-section">')[0];
   for(const model of SKILLS_DATA[Math.floor(i/6)].grammar){
    if(src.toLowerCase().includes(model.en.toLowerCase()))issues.push({i,leaked:model.en});
   }
   const read=EJPrerequisites.reading(i);
   if(EJVariety.curated(i)){
    const lesson=EJVariety.practice(i);
    if(read.text.includes(lesson[2].en))issues.push({i,writingAnswerVisibleBeforeWriting:lesson[2].en});
    if(new Set(lesson.map(x=>x.en)).size!==3)issues.push({i,duplicatePractice:true});
   }else for(const m of SKILLS_DATA[Math.floor(i/6)].grammar){
    if(!read.text.includes(m.en))issues.push({i,textNotPunctuated:m.en});
   }
  }
  return {issues,firstQuestion:SKILLS_DATA[0].grammar[2],reading:EJPrerequisites.reading(0).text};
 });
 assert.deepEqual(results.issues,[]);
 assert.equal(results.firstQuestion.ru,'Ты из Испании?');
 assert.equal(results.firstQuestion.en,'Are you from Spain?');
 assert.match(results.reading,/Are you a tourist\?/);
 await page.locator('[data-open="0"]').first().click();
 await page.evaluate(()=>{const r=record(0);r.steps[1]=true;r.flowStep=1;save();render();});
 assert.equal((await page.locator('.known-models').innerText()).includes('Are you from Spain?'),false);
 assert.match(await page.locator('.known-models').innerText(),/ВОПРОС:/);
});

await scenario('diagnostic visits all six variants, no repeated attempted tasks',async page=>{
 const result=await page.evaluate(()=>{
  const levels=['A1','A2','B1'];return levels.map(l=>{
   const rounds=[];const visited={};
   for(let i=0;i<6;i++){const tasks=EnglishJourneyCEFR13.taskSet(l,i,rounds);
    for(const t of tasks)(visited[t.domain]??=new Set()).add(t.variant);
    rounds.push({answers:tasks.map(t=>({id:t.id}))});
   }
   return {level:l,domains:Object.values(visited).map(s=>s.size)};
  });
 });
 for(const x of result)assert.deepEqual(x.domains,[6,6,6,6,6,6],x.level);
 await page.locator('[data-page="cefr-diagnostic"]').click();
 await page.locator('[data-ej13-start]').click();
 assert.ok(await page.locator('textarea#ej13-answer').isVisible());
 await page.locator('textarea#ej13-answer').fill('The train leaves at 7:15 from platform four.');
 await page.locator('[data-ej13-submit]').click();
 const record=await page.evaluate(()=>store.cefrDiagnostic.levels.A1.active);
 assert.equal(Object.keys(record.answers).length,1);
 await page.reload({waitUntil:'load'});
 assert.equal(await page.evaluate(()=>Object.keys(store.cefrDiagnostic.levels.A1.active.answers).length),1);
});
const checkpointSeed=seeded(1);checkpointSeed.checkpoints={};
await scenario('weekly checkpoint from completed lessons, no audio, pass',Object.assign(async page=>{
 assert.deepEqual(await page.evaluate(()=>nextTask()),{type:'topic',week:0});
 await page.locator('[data-page="assessments"]').click();
 await page.locator('[data-check-open="0"]').click();
 const mix=await page.evaluate(()=>{
  const cur=testsFor(0).current, types=cur.questions.map(q=>q.type);
  cur.questions.forEach((q,i)=>cur.answers[i]=q.answer);save();render();return types;
 });
 assert.equal(mix.length,12);assert.equal(mix.includes('listening'),false);
 await page.locator('[data-topic-submit]').click();
 assert.equal(await page.evaluate(()=>Boolean(testsFor(0).passedAt)),true);
 assert.equal(await page.evaluate(()=>nextTask().type),'lesson');
},{seed:checkpointSeed}));
await scenario('failed weekly checkpoint locks next lesson and creates remediation',Object.assign(async page=>{
 await page.locator('[data-page="assessments"]').click();await page.locator('[data-check-open="0"]').click();
 await page.evaluate(()=>{
  const cur=testsFor(0).current;
  cur.questions.forEach((q,i)=>cur.answers[i]=(q.answer+1)%q.options.length);save();render();
 });
 await page.locator('[data-topic-submit]').click();
 const result=await page.evaluate(()=>({passed:!!testsFor(0).passedAt,remedy:!!testsFor(0).remediation,task:nextTask().type}));
 assert.equal(result.passed,false);
 assert.equal(result.remedy,true);
 assert.equal(result.task,'topic');
},{seed:checkpointSeed}));
await scenario('A1 exam pass with every listening item skipped',Object.assign(async page=>{
 assert.deepEqual(await page.evaluate(()=>nextTask()),{type:'exam',level:'A1'});
 await page.locator('[data-page="exam"]').click();
 const details=await page.evaluate(()=>{
  const rec=examRecord(),cur=rec.current;assertUI(cur);
  cur.questions.forEach((q,i)=>cur.answers[i]=q.type==='listening'?-1:q.answer);
  cur.production.forEach((q,i)=>cur.productionAnswers[i]=q.en);
  cur.part=1;save();render();
  return {items:cur.questions.length,skipped:cur.questions.filter(q=>q.type==='listening').length,
   production:cur.production.length};
  function assertUI(x){if(!x||!x.questions||!x.questions.length)throw Error('Exam failed to initialize');}
 });
 assert.equal(details.items,36);assert.equal(details.skipped,6);assert.equal(details.production,4);
 await page.locator('[data-exam-submit]').click();
 assert.equal(await page.evaluate(()=>Boolean(store.exams.A1?.passedAt)),true);
 assert.equal(await page.evaluate(()=>nextTask().type),'lesson');
},{seed:seeded(12)}));
await scenario('A1 exam rejects weak grammar even if audio is skipped',Object.assign(async page=>{
 await page.locator('[data-page="exam"]').click();
 await page.evaluate(()=>{
  const cur=examRecord().current;
  cur.questions.forEach((q,i)=>cur.answers[i]=q.type==='listening'?-1:q.type==='grammar'?(q.answer+1)%q.options.length:q.answer);
  cur.production.forEach((q,i)=>cur.productionAnswers[i]=q.en);
  cur.part=1;save();render();
 });
 await page.locator('[data-exam-submit]').click();
 assert.equal(await page.evaluate(()=>Boolean(store.exams.A1?.passedAt)),false);
},{seed:seeded(12)}));
for(const [level,weeks] of [['A2',50],['B1',100]]){
 const state=seeded(weeks);
 state.exams.A1={passedAt:'2026-10-12T11:00:00.000Z',attempts:[]};
 state.exams.A1_full={passedAt:'2026-10-12T11:00:00.000Z',attempts:[]};
 if(level==='B1')state.exams.A2={passedAt:'2026-10-12T11:00:00.000Z',attempts:[]};
 await scenario(level+' final exam accepts voluntary audio skip',Object.assign(async page=>{
  assert.deepEqual(await page.evaluate(()=>nextTask()),{type:'exam',level});
  await page.locator('[data-page="exam"]').click();
  const items=await page.evaluate(()=>{
   const rec=examRecord(),cur=rec.current;
   if(!cur||cur.questions.length!==36||cur.production.length!==4)throw Error('Broken advanced exam');
   cur.questions.forEach((q,i)=>cur.answers[i]=q.type==='listening'?-1:q.answer);
   cur.production.forEach((q,i)=>cur.productionAnswers[i]=q.en);
   cur.part=1;save();render();
   return cur.questions.filter(q=>q.type==='listening').length;
  });
  assert.equal(items,6);
  await page.locator('[data-exam-submit]').click();
  assert.equal(await page.evaluate(l=>Boolean(store.exams[l]?.passedAt),level),true);
 },{seed:state}));
}
await scenario('IndexedDB creates and restores a verified local snapshot',async (page)=>{
 assert.equal(await page.evaluate(()=>typeof EJLocalRecovery.createCopy),'function');
 const original=await page.evaluate(async()=>{
  store.history['2030-01-01']=3;
  localStorage.setItem('englishJourneyTravelV1',JSON.stringify(store));
  await EJLocalRecovery.createCopy(true);
  store.history['2030-01-01']=11;
  // Intentionally bypass background save timer to test recovery of the older snapshot.
  localStorage.setItem('englishJourneyTravelV1',JSON.stringify(store));
  return (await EJLocalRecovery.allCopies())[0].data.includes('"2030-01-01":3');
 });
 assert.equal(original,true);
 page.on('dialog',dialog=>dialog.accept());
 const loaded=page.waitForEvent('load',{timeout:20000});
 await page.evaluate(()=>EJLocalRecovery.restoreLatest()).catch(()=>{});
 await loaded;
 assert.equal(await page.evaluate(()=>store.history['2030-01-01']),3);
});
await scenario('offline reload works after service worker installation',async (page,context)=>{
 await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));
 await page.reload({waitUntil:'load'}); // controlled by the worker on refresh
 await context.setOffline(true);
 await page.reload({waitUntil:'load'});
 assert.ok((await page.locator('#root').innerText()).length>100);
 await context.setOffline(false);
});


await scenario('lesson follows words -> theory -> quiz -> dialogue, keeps progress on reload',async page=>{
 await page.locator('[data-open="0"]').first().click();
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),0);
 assert.equal(await page.locator('.journey-step.active strong').innerText(),'Слова и выражения');
 assert.equal(await page.locator('.journey-step').count(),4);
 assert.equal(await page.locator('[data-journey-next]').isDisabled(),true);
 assert.equal(await page.evaluate(()=>record(0).steps[2]),true,'Listening never blocks the flow');
 await page.reload({waitUntil:'load'});
 await page.locator('[data-open="0"]').first().click();
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),0);
 for(let i=0;i<8;i++){
  await page.locator('[data-vocab-recall]').click();
  const answer=await page.evaluate(()=>VOCAB_MAP.get(record(0).vocabRecall).en);
  await page.locator('#vocab-answer').fill(answer);
  await page.locator('[data-vocab-submit]').click();
 }
 assert.equal(await page.evaluate(()=>record(0).steps[1]),true);
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),0);
 await page.locator('[data-journey-next]').click();
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),1);
 assert.equal(await page.locator('.journey-step.active strong').innerText(),'Правило и фразы');
 await page.reload({waitUntil:'load'});
 await page.locator('[data-open="0"]').first().click();
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),1,'Resume exactly where the learner stopped');
 for(let i=0;i<2;i++){
  const value=await page.evaluate(idx=>grammarExercises()[idx].en,i);
  await page.locator('[data-grammar-input="'+i+'"]').fill(value);
  await page.locator('[data-grammar-check="'+i+'"]').click();
 }
 assert.equal(await page.evaluate(()=>record(0).steps[0]),true);
 await page.locator('[data-journey-next]').click();
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),2);
 const questions=await page.evaluate(()=>qlist(courses[0],0,record(0).profile).map(q=>q[2]));
 for(let i=0;i<questions.length;i++)await page.locator('[data-answer="'+i+':'+questions[i]+'"]').click();
 const reading=await page.evaluate(()=>skillItem().reading.questions.map(q=>q.answer));
 for(let i=0;i<reading.length;i++)await page.locator('[data-skill-reading="'+i+':'+reading[i]+'"]').click();
 await page.locator('[data-skill-reading-submit]').click();
 assert.equal(await page.evaluate(()=>record(0).steps[3]),true);
 await page.locator('[data-journey-next]').click();
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),3);
 for(let i=0;i<2;i++){
  const correct=await page.evaluate(()=>{const s=ejSkills(record(0)).dialogue,branch=skillItem().dialogues[Number.isInteger(s.path)?s.path:dayFocus%2];return branch.turns[Number(s.turn)||0].correct;});
  await page.locator('[data-dialog-answer="'+correct+'"]').click();
 }
 for(const item of await page.evaluate(()=>EJWritingLesson.prompts())){
  await page.locator('[data-writing-answer="'+item.id+'"]').fill(item.en);
  await page.locator('[data-writing-check="'+item.id+'"]').click();
 }
 await page.locator('[data-mark="4"]').click();
 assert.equal(await page.evaluate(()=>!!record(0).doneAt),true);
 await page.locator('[data-journey-next]').click();
 assert.equal(await page.evaluate(()=>dayFocus),1);
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),0);
 assert.equal(await page.evaluate(()=>!!record(0).doneAt),true,'Completed prior lesson remains saved');
});



await scenario('A0: Russian prompts and dialog use only previously taught material',async page=>{
 await page.locator('[data-open="0"]').first().click();
 await page.evaluate(()=>{
  const r=record(0);r.steps[1]=true;r.steps[0]=true;r.steps[3]=true;r.flowStep=3;save();render();
 });
 assert.equal(await page.locator('#lesson-writing').count(),0,'Old meaningless free-text input must be gone');
 const translated=await page.locator('.writing-item').count();
 assert.equal(translated,4,'Exactly three prior vocabulary prompts plus one taught grammar phrase');
 assert.match(await page.locator('.writing-item').first().innerText(),/Переведи на английский: «привет»/);
 assert.equal(await page.locator('.writing-item .writing-ru').nth(3).innerText(),
  'Переведи на английский: «Ты из Испании?»');
 await page.locator('[data-dialog-path="1"]').click();
 assert.match(await page.locator('.course-meaning').innerText(),/показанных в разделе теории/);
 const first=await page.evaluate(()=>skillItem().dialogues[1].turns[0].correct);
 await page.locator('[data-dialog-answer="'+first+'"]').click();
 assert.match(await page.locator('.course-meaning').innerText(),/показанных в разделе теории/);
 assert.equal((await page.locator('.journey-current').innerText()).includes('Could you spell it'),false,
   'An untaught English phrase must not appear in the lesson dialog');
 const second=await page.evaluate(()=>skillItem().dialogues[1].turns[1].correct);
 await page.locator('[data-dialog-answer="'+second+'"]').click();
 await page.locator('[data-writing-answer="0"]').fill('country friend thank you please hello');
 await page.locator('[data-writing-check="0"]').click();
 assert.equal(await page.evaluate(()=>Boolean(record(0).writingValidated)),false);
 assert.equal(await page.locator('[data-mark="4"]').isDisabled(),true);
 await page.locator('[data-writing-answer="0"]').fill('hello');
 await page.locator('[data-writing-check="0"]').click();
 const others=await page.evaluate(()=>EJWritingLesson.prompts().slice(1));
 for(const item of others){
  await page.locator('[data-writing-answer="'+item.id+'"]').fill(item.en);
  await page.locator('[data-writing-check="'+item.id+'"]').click();
 }
 assert.equal(await page.evaluate(()=>Boolean(record(0).writingValidated)),true);
 assert.equal(await page.evaluate(()=>Boolean(record(0).steps[4])),true);
});
await scenario('writing hint and skip create a mandatory different translation review',async page=>{
 await page.locator('[data-open="0"]').first().click();
 await page.evaluate(()=>{const r=record(0);r.steps[1]=true;r.steps[0]=true;r.steps[3]=true;r.flowStep=3;save();render()});
 const firstPrompt=await page.evaluate(()=>EJWritingLesson.prompts()[0]);
 await page.locator('.writing-item').first().locator('.support-hint').click();
 assert.equal(await page.evaluate(()=>EnglishJourneySupport.pending().length),1);
 await page.locator('.writing-item').first().locator('.support-skip').click();
 assert.equal(await page.evaluate(()=>record(0).writingAnswers[0].skipped),true);
 const review=await page.evaluate(()=>{
  const debt=EnglishJourneySupport.pending()[0],task=EnglishJourneySupport.reviewTask();
  return {debt,task};
 });
 assert.equal(review.debt.kind,'writing');
 assert.notEqual(review.task.expected,firstPrompt.en,'Different vocabulary word required for later review');
 assert.match(review.task.body,/Переведи на английский/);
 assert.equal(await page.evaluate(()=>Boolean(record(0).steps[4])),false,'Skip cannot finish stage without other responses and dialogue');
});

await scenario('hint and skip defer a word, next lesson demands different same-topic answer',async page=>{
 await page.locator('[data-open="0"]').first().click();
 const first=await page.evaluate(()=>vocabForLesson(0)[0]);
 await page.locator('[data-vocab-recall]').first().waitFor();
 await page.locator('.journey-current .support-hint').first().click();
 assert.equal(await page.evaluate(()=>EnglishJourneySupport.pending().length),1);
 assert.equal(await page.evaluate(()=>EnglishJourneySupport.pending()[0].reason),'hint');
 await page.locator('.journey-current .support-skip').first().click();
 assert.equal(await page.evaluate(()=>EnglishJourneySupport.pending().length),1,'hint+skip same example creates one obligation');
 assert.equal(await page.evaluate(()=>EnglishJourneySupport.pending()[0].reason),'skip');
 for(let i=1;i<8;i++){
  await page.locator('[data-vocab-recall]').click();
  const answer=await page.evaluate(()=>VOCAB_MAP.get(record(0).vocabRecall).en);
  await page.locator('#vocab-answer').fill(answer);
  await page.locator('[data-vocab-submit]').click();
 }
 assert.equal(await page.evaluate(()=>record(0).steps[1]),true);
 await page.locator('[data-journey-next]').click();
 for(let i=0;i<2;i++){
  const value=await page.evaluate(idx=>grammarExercises()[idx].en,i);
  await page.locator('[data-grammar-input="'+i+'"]').fill(value);
  await page.locator('[data-grammar-check="'+i+'"]').click();
 }
 await page.locator('[data-journey-next]').click();
 const qs=await page.evaluate(()=>qlist(courses[0],0,record(0).profile).map(q=>q[2]));
 for(let i=0;i<qs.length;i++)await page.locator('[data-answer="'+i+':'+qs[i]+'"]').click();
 const reading=await page.evaluate(()=>skillItem().reading.questions.map(q=>q.answer));
 for(let i=0;i<reading.length;i++)await page.locator('[data-skill-reading="'+i+':'+reading[i]+'"]').click();
 await page.locator('[data-skill-reading-submit]').click();
 await page.locator('[data-journey-next]').click();
 for(let i=0;i<2;i++){
  const correct=await page.evaluate(()=>{const d=ejSkills(record(0)).dialogue,b=skillItem().dialogues[Number.isInteger(d.path)?d.path:dayFocus%2];return b.turns[Number(d.turn)||0].correct});
  await page.locator('[data-dialog-answer="'+correct+'"]').click();
 }
 for(const item of await page.evaluate(()=>EJWritingLesson.prompts())){
  await page.locator('[data-writing-answer="'+item.id+'"]').fill(item.en);
  await page.locator('[data-writing-check="'+item.id+'"]').click();
 }
 await page.locator('[data-mark="4"]').click();
 assert.equal(await page.evaluate(()=>Boolean(record(0).doneAt)),true);
 await page.locator('[data-journey-next]').click();
 assert.equal(await page.evaluate(()=>page),'reinforcement');
 const alternate=await page.evaluate(()=>EnglishJourneySupport.reviewTask());
 assert.equal(alternate.kind,'vocabulary');
 assert.notEqual(alternate.expected,first.en,'Recovery must use a different phrase from the same topic');
 const previous=alternate.expected;
 await page.locator('[data-review-alternate]').click();
 const newQuestion=await page.evaluate(()=>EnglishJourneySupport.reviewTask());
 assert.notEqual(newQuestion.expected,previous,'At least two alternative formulations should be available');
 await page.reload({waitUntil:'load'});
 await page.locator('[data-open="1"]').first().click();
 assert.equal(await page.evaluate(()=>page),'reinforcement','Cannot bypass reinforcement on reload');
 const answer=await page.evaluate(()=>EnglishJourneySupport.reviewTask().expected);
 await page.locator('#support-review-answer').fill(answer);
 await page.locator('[data-review-check]').click();
 assert.equal(await page.evaluate(()=>EnglishJourneySupport.pending().length),0);
 await page.locator('[data-review-continue]').click();
 assert.equal(await page.evaluate(()=>dayFocus),1);
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),0);
 assert.equal(await page.evaluate(()=>Boolean(record(0).doneAt)),true);
});

await scenario('skipped quiz answer stays wrong and completion remains provisional',async page=>{
 await page.locator('[data-open="0"]').first().click();
 await page.evaluate(()=>{
  const r=record(0);r.steps[1]=true;r.steps[0]=true;r.flowStep=2;save();render();
 });
 const t=await page.locator('.questiongroup').count();
 assert.ok(t>=3,'There must be several independent test questions');
 await page.locator('.journey-current .support-skip').first().click();
 assert.equal(await page.evaluate(()=>record(0).quizDraft[0]),-1);
 const q=await page.evaluate(()=>qlist(courses[0],0,record(0).profile).map(x=>x[2]));
 for(let i=1;i<q.length;i++)await page.locator('[data-answer="'+i+':'+q[i]+'"]').click();
 const read=await page.evaluate(()=>skillItem().reading.questions.map(x=>x.answer));
 for(let i=0;i<read.length;i++)await page.locator('[data-skill-reading="'+i+':'+read[i]+'"]').click();
 await page.locator('[data-skill-reading-submit]').click();
 assert.equal(await page.evaluate(()=>Boolean(record(0).steps[3])),true);
 assert.equal(await page.evaluate(()=>Boolean(record(0).learningQuizProvisional)),true);
 assert.equal(await page.evaluate(()=>record(0).firstAccuracy<1),true);
 assert.equal(await page.evaluate(()=>EnglishJourneySupport.pending().length),1);
});

const examDebtSeed=seeded(12);
examDebtSeed.practiceDebts=[{id:'test-exam-debt',lesson:0,week:0,kind:'grammar',ref:'0',
 reason:'skip',createdAt:'2026-10-12T12:00:00Z',revision:0,attempts:0,clearedAt:null}];
await scenario('exam locked until original topic is independently reinforced',Object.assign(async page=>{
 await page.locator('[data-page="exam"]').click();
 assert.equal(await page.evaluate(()=>page),'reinforcement');
 assert.equal(await page.locator('textarea#support-review-answer').count(),1);
 const expected=await page.evaluate(()=>EnglishJourneySupport.reviewTask().expected);
 await page.locator('#support-review-answer').fill(expected);
 await page.locator('[data-review-check]').click();
 assert.equal(await page.evaluate(()=>EnglishJourneySupport.pending().length),0);
 await page.locator('[data-review-continue]').click();
 assert.equal(await page.evaluate(()=>page),'exam');
 assert.equal(await page.evaluate(()=>nextTask().type),'exam');
},{seed:examDebtSeed}));

await scenario('dark / light / system themes persist without modifying learner progress',async (page)=>{
 const initial=await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('englishJourneyTravelV1'));return JSON.stringify({logs:d.logs,history:d.history,checkpoints:d.checkpoints,exams:d.exams,vocabulary:d.vocabulary});});
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');
 const button=page.locator('#appearance-toggle');
 assert.ok(await button.isVisible(),'Always-visible quick switch');
 await button.click();
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
 assert.equal(await page.evaluate(()=>localStorage.getItem('englishJourneyThemeV1')),'dark');
 const darkCSS=await page.evaluate(()=>{
  const panel=document.querySelector('.stat');
  return {background:getComputedStyle(document.body).backgroundColor,
   paper:panel?getComputedStyle(panel).backgroundColor:null};
 });
 assert.equal(darkCSS.background,'rgb(12, 19, 34)');
 assert.equal(darkCSS.paper,'rgb(23, 33, 52)');
 await page.locator('[data-page="settings"]').click();
 assert.ok(await page.locator('input[name="ej-appearance"][value="dark"]').isChecked());
 await page.locator('input[name="ej-appearance"][value="light"]').check();
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');
 assert.equal(await page.evaluate(()=>localStorage.getItem('englishJourneyThemeV1')),'light');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(246, 247, 252)');
 await page.emulateMedia({colorScheme:'dark'});
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');
 await page.locator('input[name="ej-appearance"][value="system"]').check();
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
 await page.emulateMedia({colorScheme:'light'});
 await page.waitForFunction(()=>document.documentElement.dataset.theme==='light',{timeout:5000});
 await page.locator('input[name="ej-appearance"][value="dark"]').check();
 await page.reload({waitUntil:'load'});
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
 assert.equal(await page.evaluate(()=>localStorage.getItem('englishJourneyThemeV1')),'dark');
 const after=await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('englishJourneyTravelV1'));return JSON.stringify({logs:d.logs,history:d.history,checkpoints:d.checkpoints,exams:d.exams,vocabulary:d.vocabulary});});
 assert.equal(after,initial,'Switching theme may not mutate learning data');
 await page.locator('[data-page="cefr-diagnostic"]').click();
 assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('.panel')).backgroundColor),'rgb(23, 33, 52)');
});
await browser.close();
console.log('ALL PASS: '+passed+' Chromium integration scenarios.');
