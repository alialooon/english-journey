/* English Journey 13.14 — atomic offline shell update.
 * Never caches third-party audio or transfers learner data. */
const CACHE_NAME='english-journey-local-v13-14-0';
const ASSETS=['./','./index.html','./style.css','./authentic_lab.css','./diagnostic.css','./theme.css','./appearance.js','./lesson_flow.css','./lesson_flow.js','./learning_support.css','./learning_support.js','./prerequisite_curriculum.js','./varied_curriculum.js','./a1_learning_patterns.js','./a1_vocab_contexts.js','./curriculum_contract.js','./curriculum_contract.css','./course_pedagogy.css','./course_pedagogy.js',
 './course_data.js','./vocabulary_data.js','./skills_data.js','./a1_extension.js',
 './a2_extension.js','./curriculum_data.js','./advanced_course.js','./quality_data.js',
 './vocabulary.js','./skills.js','./engine.js','./advanced_hooks.js','./quality_runtime.js',
 './authentic_lab.js','./autonomous_assessment.js','./diagnostic_data.js','./diagnostic_extra.js',
 './diagnostic.js','./local_recovery.js','./offline.js','./version.json'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith('english-journey-local-')&&k!==CACHE_NAME)await caches.delete(k);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 // Check fresh version and pages when online. Keep a working cached copy offline.
 if(req.mode==='navigate'||url.pathname.endsWith('/version.json')){
  event.respondWith(fetch(req).then(async res=>{
   if(res.ok){const cache=await caches.open(CACHE_NAME);await cache.put(req.mode==='navigate'?'./index.html':req,res.clone());}
   return res;
  }).catch(async()=>{
   const cached=await caches.match(req.mode==='navigate'?'./index.html':req);
   return cached||Response.error();
  }));
  return;
 }
 // All script/styles are prepared together during install, avoiding mixed releases offline.
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});