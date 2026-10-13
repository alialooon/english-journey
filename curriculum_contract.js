/* English Journey 13.8: lesson-language contracts (offline, no API).
 * All assessment models carry an explicit speech-act type and matching
 * English/Russian punctuation. Run after advanced/quality data, before engine.
 */
(function(){
'use strict';
const AUX=/^(?:am|are|is|was|were|do|does|did|can|could|would|will|shall|should|have|has|had|may|might|must|where|when|why|who|whose|which|how|what)\b/i;
const exceptions=[/^do not\b/i,/^don't\b/i,/^what i mean is\b/i];
const end=s=>String(s||'').trim().replace(/[.!?？]+$/u,'').trim();
function sentenceType(en){
 const s=end(en);
 if(/^why do not we\b/i.test(s))return 'question';
 if(exceptions.some(rx=>rx.test(s)))return /^do(?: not|n't)\b/i.test(s)?'imperative':'statement';
 return AUX.test(s)?'question':'statement';
}
function english(raw){
 const original=end(raw).replace(/^Why do not we\b/i,"Why don't we");
 return original+(sentenceType(original)==='question'?'?':'.');
}
function russian(raw,en){
 return end(raw)+(sentenceType(en)==='question'?'?':'.');
}
const contracts=[];
for(let w=0;w<SKILLS_DATA.length;w++){
 const models=SKILLS_DATA[w]?.grammar||[];
 if(models.length<3)throw Error('План обучения: нет трёх образцов для темы '+(w+1));
 const rows=[];
 for(let j=0;j<models.length;j++){
  const model=models[j],en=english(model.en),ru=russian(model.ru,en),kind=sentenceType(en);
  if(kind==='question'&&(!en.endsWith('?')||!ru.endsWith('?')))throw Error('Несогласованные вопросы: тема '+(w+1));
  if(kind!=='question'&&(en.endsWith('?')||ru.endsWith('?')))throw Error('Несогласованные утверждения: тема '+(w+1));
  model.en=en;model.ru=ru;
  rows.push({id:'w'+w+'-g'+j,type:kind,en,ru,week:w,source:'explicitly_taught_model'});
 }
 contracts.push(rows);
}
function auditedPrompt(model){
 const kind=sentenceType(model.en);
 const en=english(model.en),ru=russian(model.ru,en);
 if(kind==='question'&&(!en.endsWith('?')||!ru.endsWith('?')))throw Error('Вопрос без согласованной пунктуации');
 if(kind!=='question'&&(en.endsWith('?')||ru.endsWith('?')))throw Error('Утверждение размечено вопросом');
 return {en,ru,type:kind};
}
window.EJLanguageContract={
 models:contracts,sentenceType,english,russian,auditedPrompt,
 verify(){
  const errors=[];
  for(let w=0;w<contracts.length;w++)for(const model of contracts[w]){
   const cur=auditedPrompt(model);
   if(cur.ru!==model.ru||cur.en!==model.en)errors.push(model.id);
  }
  return {topics:contracts.length,models:contracts.flat().length,errors};
 }
};
})();
