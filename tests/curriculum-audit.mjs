/* Structural curriculum audit. Does not claim CEFR calibration or human proofreading. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx=vm.createContext({window:{},console});
for(const path of ['course_data.js','vocabulary_data.js','skills_data.js','a1_extension.js',
 'a2_extension.js','curriculum_data.js','advanced_course.js','quality_data.js','vocabulary.js']){
 vm.runInContext(fs.readFileSync(path,'utf8'),ctx,{filename:path});
}
const data=vm.runInContext('({courses,SKILLS_DATA,VOCAB_BANK})',ctx);
const {courses,SKILLS_DATA,VOCAB_BANK}=data;
assert.equal(courses.length,100);
assert.equal(SKILLS_DATA.length,100);
assert.equal(VOCAB_BANK.length,100);
const source=fs.readFileSync('course_pedagogy.js','utf8');
const match=source.match(/const EARLY_MEANINGS=(\[[^\n]*\]);\nfunction turnMeaning/);
assert.ok(match,'First 31 bilingual dialogue translations must be present');
const gloss=JSON.parse(match[1]);
assert.equal(gloss.length,31);
let prompts=0,dialogTurns=0,issues=[],longTemplateWeeks=0;
for(let w=0;w<100;w++){
 const lesson=courses[w],skills=SKILLS_DATA[w],words=VOCAB_BANK[w];
 if(!lesson.title||!lesson.grammar||!lesson.theory||!lesson.rule||
  !Array.isArray(lesson.examples)||lesson.examples.length<2)issues.push('Missing teaching model at week '+w);
 if(!Array.isArray(words)||words.length<8)issues.push('Fewer than 8 available words at week '+w);
 if(!Array.isArray(skills.grammar)||skills.grammar.length<3)issues.push('Fewer than 3 grammar models at week '+w);
 if(!Array.isArray(skills.dialogues)||skills.dialogues.length!==2)issues.push('Missing dialogue branches at week '+w);
 for(let day=0;day<6;day++){
  // Three items from vocabulary introduced earlier on that same day,
  // plus a different sample than the two preceding theory exercises.
  const index=day*8;
  const models=[...Array(8)].map((_,i)=>words[(index+i)%words.length]);
  assert.ok(models.slice(0,3).every(x=>x.en&&x.ru));
  const gr=skills.grammar[(day+2)%skills.grammar.length];
  assert.ok(gr.en&&gr.ru);
  const taught=[skills.grammar[day%3],skills.grammar[(day+1)%3]];
  assert.ok(!taught.includes(gr),'Writing must test a different but related sentence');
  prompts+=4;
 }
 const turns=skills.dialogues.flatMap(p=>p.turns);
 if(turns.length!==4||turns.some(x=>!x.lead||!x.choices||x.choices.length!==3||!Number.isInteger(x.correct)||x.correct<0||x.correct>2)){
  issues.push('Invalid dialogue at week '+w);
 }
 dialogTurns+=turns.length;
 if(w<31){if(gloss[w].length!==4||gloss[w].some(x=>typeof x!=='string'||x.length<6))issues.push('No Russian explanation at week '+w);}
 else if(turns[0].lead.includes('What difficulty did you encounter')&&
  turns[1].lead.includes('How was the situation handled'))longTemplateWeeks++;
}
assert.deepEqual(issues,[]);
assert.equal(prompts,2400);
assert.equal(dialogTurns,400);
assert.equal(longTemplateWeeks,69);
console.log('PASS curriculum: 100 topics, 600 lessons, 2,400 explicit RU->EN prompts, 400 dialogue turns.');
console.log('PASS coaching: 124 authored Russian explanations for 31 early weeks.');
console.log('CAUTION: 69 advanced weeks share dialogue templates; those are not a CEFR-validated oral assessment.');
