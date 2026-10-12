/* English Journey 13.1 — local IndexedDB recovery snapshots.
 * Original localStorage key stays authoritative. IndexedDB is a rotating shadow backup;
 * never silently overwrites progress. No internet, account or third-party API. */
(function(){
'use strict';
if(!('indexedDB' in window))return;
const DB_NAME='english-journey-local-recovery-v1',STORE_NAME='snapshots',MAX_COPIES=3;
let dbPromise=null,pending=false,lastBackupAt=0,lastJSON='',statusText='';
function requestDone(req){return new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Ошибка чтения локальной базы'));});}
function openDB(){
 if(dbPromise)return dbPromise;
 dbPromise=new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE_NAME))req.result.createObjectStore(STORE_NAME,{keyPath:'id'});};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error||new Error('Локальное хранилище недоступно'));
  req.onblocked=()=>reject(new Error('Закрой другие вкладки English Journey и попробуй ещё раз.'));
 }).catch(err=>{dbPromise=null;throw err});
 return dbPromise;
}
async function allCopies(){
 const db=await openDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE_NAME,'readonly'),req=tx.objectStore(STORE_NAME).getAll();
  req.onsuccess=()=>resolve((req.result||[]).sort((a,b)=>b.savedAt.localeCompare(a.savedAt)));
  req.onerror=()=>reject(req.error);
 });
}
async function checksum(payload){
 if(!crypto?.subtle)return null;
 const data=new TextEncoder().encode(payload);
 const buffer=await crypto.subtle.digest('SHA-256',data);
 return Array.from(new Uint8Array(buffer),v=>v.toString(16).padStart(2,'0')).join('');
}
async function createCopy(force=false){
 const raw=JSON.stringify(store);
 if(!force&&raw===lastJSON)return {unchanged:true};
 if(!store?.logs||!store?.history)throw new Error('Не удалось проверить структуру прогресса');
 const [old,hash]=await Promise.all([allCopies(),checksum(raw)]);
 const db=await openDB();
 await new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE_NAME,'readwrite'),ob=tx.objectStore(STORE_NAME);
  ob.put({id:String(Date.now())+'-'+Math.random().toString(36).slice(2,8),savedAt:new Date().toISOString(),
   hash,bytes:raw.length,data:raw});
  old.slice(MAX_COPIES-1).forEach(x=>ob.delete(x.id));
  tx.oncomplete=()=>resolve();
  tx.onerror=()=>reject(tx.error||new Error('Не удалось сохранить резервную копию'));
  tx.onabort=()=>reject(tx.error||new Error('Сохранение прервано'));
 });
 lastJSON=raw;lastBackupAt=Date.now();
 return {saved:true};
}
function scheduleCopy(){
 if(pending||Date.now()-lastBackupAt<120000)return;
 pending=true;
 setTimeout(()=>{pending=false;createCopy(false).catch(err=>{statusText='Локальная копия не обновлена: '+err.message;});},1500);
}
const originalSave=save;
save=function(){originalSave();scheduleCopy();};
function info(message){statusText=message;const node=document.getElementById('ej131-backup-status');if(node)node.textContent=message;}
async function updateInfo(){
 try{
  const copies=await allCopies();
  const latest=copies[0];
  info(latest?'Сохранено локальных копий: '+copies.length+'. Последняя: '+new Date(latest.savedAt).toLocaleString('ru-RU')+'.':
   'Локальные резервные копии ещё не созданы.');
 }catch(err){info('IndexedDB недоступна: '+err.message);}
}
async function restoreLatest(){
 const rows=await allCopies(),copy=rows[0];
 if(!copy){info('Локальной копии пока нет.');return;}
 if(copy.hash&&await checksum(copy.data)!==copy.hash)throw new Error('Контрольная сумма не совпадает, восстановление отменено');
 let parsed=JSON.parse(copy.data);
 if(!parsed||typeof parsed!=='object'||!parsed.logs||typeof parsed.logs!=='object'||
    !parsed.history||typeof parsed.history!=='object'||!parsed.exams||typeof parsed.exams!=='object')throw new Error('Копия повреждена');
 if(!confirm('Восстановить прогресс из копии от '+new Date(copy.savedAt).toLocaleString('ru-RU')+'? Текущие результаты будут заменены.'))return;
 store=Object.assign(freshStore(),parsed);
 store.preferences=Object.assign({adaptive:true},store.preferences||{});
 store.checkpoints=store.checkpoints||{};
 store.exams=store.exams||{};
 normalizePlanAnchor();
 originalSave(); // restore must not overwrite the older snapshot before page reload
 alert('Прогресс восстановлен. Страница обновится.');
 location.reload();
}
const originalSettings=settings,originalWire=wire;
settings=function(){return originalSettings()+
 '<div class="panel"><h3>🛡️ Резервные копии на этом устройстве</h3>'+
 '<p>English Journey сохраняет обычный прогресс в браузере и до трёх дополнительных копий в IndexedDB. Они создаются автоматически, но могут быть удалены вместе с данными сайта. Интернет не нужен.</p>'+
 '<p class="tiny">Это не синхронизация устройств и не облачное хранилище. Для переноса на другое устройство используй экспорт и импорт в настройках.</p>'+
 '<p id="ej131-backup-status" class="tiny">'+esc(statusText||'Проверяем наличие локальных копий...')+'</p>'+
 '<button class="outline" data-ej131-backup="1">Создать копию сейчас</button> '+
 '<button class="outline" data-ej131-restore="1">Восстановить последнюю копию</button></div>';};
wire=function(){
 originalWire();
 const b=document.querySelector('[data-ej131-backup]'),r=document.querySelector('[data-ej131-restore]');
 if(b){b.onclick=async()=>{b.disabled=true;try{await createCopy(true);await updateInfo();}catch(e){info('Копия не сохранена: '+e.message);}finally{b.disabled=false;}};}
 if(r)r.onclick=async()=>{r.disabled=true;try{await restoreLatest();}catch(e){info('Восстановление не удалось: '+e.message);}finally{r.disabled=false;}};
 if(b||r)updateInfo();
};
window.EJLocalRecovery={createCopy,allCopies,restoreLatest};
setTimeout(()=>{createCopy(false).catch(()=>{});},5000);
})();