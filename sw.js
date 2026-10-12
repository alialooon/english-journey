/* Offline cache for same-origin static English Journey files; NO analytics or remote evaluation. */
const CACHE_NAME='english-journey-local-v13-0-0';
const ASSETS=['./','./index.html','./style.css','./authentic_lab.css','./diagnostic.css',
 './course_data.js','./vocabulary_data.js','./skills_data.js','./a1_extension.js',
 './a2_extension.js','./curriculum_data.js','./advanced_course.js','./quality_data.js',
 './vocabulary.js','./skills.js','./engine.js','./advanced_hooks.js','./quality_runtime.js',
 './authentic_lab.js','./autonomous_assessment.js','./diagnostic_data.js','./diagnostic.js','./version.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(async cache=>{
 const results=await Promise.allSettled(ASSETS.map(a=>cache.add(a)));
 if(results.some(r=>r.status==='rejected'))console.warn('Some offline files not cached',results.filter(r=>r.status==='rejected').length);
 return self.skipWaiting();
}));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('english-journey-local-')&&key!==CACHE_NAME)await caches.delete(key);
 await self.clients.claim();
})());});
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(async res=>{if(res.ok){const c=await caches.open(CACHE_NAME);await c.put('./index.html',res.clone());}return res;}).catch(()=>caches.match('./index.html')));
  return;
 }
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
  if(res.ok){const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,clone)).catch(()=>{});}
  return res;
 })));
});