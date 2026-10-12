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
 assert.equal(await page.evaluate(()=>APP_VERSION),'13.4.0');
 assert.equal(await page.evaluate(()=>nextTask().type),'lesson');
 await page.locator('[data-open="0"]').first().click();
 const r=await page.evaluate(()=>({steps:record(0).steps,blocked:nextTask().type}));
 assert.equal(r.steps[2],true,'Listening must be pre-marked optional');
 assert.ok(await page.locator('#root').innerText());
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
 await page.locator('#lesson-writing').fill('I would like to ask for information about my hotel reservation please');
 await page.locator('[data-mark="4"]').click();
 assert.equal(await page.evaluate(()=>!!record(0).doneAt),true);
 await page.locator('[data-journey-next]').click();
 assert.equal(await page.evaluate(()=>dayFocus),1);
 assert.equal(await page.evaluate(()=>EnglishJourneyFlow.current()),0);
 assert.equal(await page.evaluate(()=>!!record(0).doneAt),true,'Completed prior lesson remains saved');
});

await scenario('dark / light / system themes persist without modifying learner progress',async (page)=>{
 const initial=await page.evaluate(()=>localStorage.getItem('englishJourneyTravelV1'));
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
 const after=await page.evaluate(()=>localStorage.getItem('englishJourneyTravelV1'));
 assert.equal(after,initial,'Switching theme may not mutate learning data');
 await page.locator('[data-page="cefr-diagnostic"]').click();
 assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('.panel')).backgroundColor),'rgb(23, 33, 52)');
});
await browser.close();
console.log('ALL PASS: '+passed+' Chromium integration scenarios.');
