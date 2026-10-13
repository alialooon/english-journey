/* English Journey pedagogical contract audit:
 * all 100 topics, 300 bilingual grammar acts, 600 ordered lessons. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=[
 'course_data.js','vocabulary_data.js','skills_data.js','a1_extension.js',
 'a2_extension.js','curriculum_data.js','advanced_course.js','quality_data.js',
 'curriculum_contract.js','varied_curriculum.js','vocabulary.js'
];
const sandbox=vm.createContext({console,window:{},Math,Date});
for(const file of source)vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});
vm.runInContext(String.raw`const PROFILES={standard:{questions:4},boost:{questions:6},review:{questions:3}};
let dayFocus=0,total=600;
let qlist=()=>[],skillItem=()=>({}),skillReadingPane=()=>'',skillDialogPane=()=>'',lesson=()=>'';
let theoryPane=(u)=>'<h3>'+u.grammar+'</h3><p>'+u.theory+'</p><div class="notes">'+u.rule+'</div><h4>Примеры</h4>'+
u.examples.map(pair=>'<div class="ex"><b>'+pair[0]+'</b><span>'+pair[1]+'</span></div>').join('')+
'<p class="disclaimer">Изучи правило</p><div class="skill-section">Упражнения</div>';
function esc(x){return String(x)}
function record(){return {steps:[false,false,false,false,false]}}
function ejSkills(){return {}}
function save(){};`,sandbox);
vm.runInContext(fs.readFileSync('prerequisite_curriculum.js','utf8'),sandbox);
const output=vm.runInContext(String.raw`(()=>{
 const errors=[];
 const contract=window.EJLanguageContract.verify();
 for(let i=0;i<600;i++){
  dayFocus=i;
  const status=window.EJPrerequisites.validateLesson(i);
  if(!status.ok)errors.push({lesson:i,status});
  const before=theoryPane(courses[Math.floor(i/6)],i%6,{}).split('<div class="skill-section">')[0];
  const curated=window.EJVariety.curated(i);
  const assessed=curated?window.EJVariety.weekModels(i):SKILLS_DATA[Math.floor(i/6)].grammar;
  for(const m of assessed){
   if(before.toLowerCase().includes(m.en.toLowerCase()))errors.push({lesson:i,leak:m.en});
  }
  const text=window.EJPrerequisites.reading(i).text;
  if(curated){
   const today=window.EJVariety.practice(i);
   if(text.includes(today[2].en))errors.push({lesson:i,prematureWritingAnswer:today[2].en});
  }else for(const m of assessed)if(!text.includes(m.en))
   errors.push({lesson:i,punctuationNotPreserved:m.en});
 }
 return {contract,variety:window.EJVariety.audit(),errors,firstQuestion:SKILLS_DATA[0].grammar[2],
  originalImperative:SKILLS_DATA[24].grammar[1],correctedQuestion:SKILLS_DATA[94].grammar[0]};
})()`,sandbox);
assert.equal(output.contract.models,300);
assert.equal(output.contract.topics,100);
assert.equal(output.contract.errors.length,0);
assert.equal(output.variety.curatedLessons,36);
assert.deepEqual(output.variety.issues,[]);
assert.equal(output.errors.length,0,JSON.stringify(output.errors.slice(0,5)));
assert.equal(output.firstQuestion.en,'Are you from Spain?');
assert.equal(output.firstQuestion.ru,'Ты из Испании?');
assert.equal(output.originalImperative.en,'Do not use the lift.');
assert.equal(output.originalImperative.ru,'Не пользуйтесь лифтом.');
assert.equal(output.correctedQuestion.en,"Why don't we split the tasks between us?");
console.log('PASS: 100 topics, 300 bilingual sentence contracts, 600 lessons; every question has the right punctuation.');
console.log('PASS: varied original foundation lessons with no answer leaks into teaching or reading.');
console.log('PASS: original imperative remains imperative; unnatural why-question corrected.');
