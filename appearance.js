/* English Journey 13.3 — accessible local appearance controls. No tracking or network calls. */
(function(){
'use strict';
const KEY='englishJourneyThemeV1';
const VALID=['system','light','dark'];
const media=typeof window.matchMedia==='function'?window.matchMedia('(prefers-color-scheme: dark)'):null;
let preference='system';
function readPreference(){
 try{const p=localStorage.getItem(KEY);return VALID.includes(p)?p:'system';}
 catch(e){return 'system';}
}
preference=readPreference();
function resolved(){return preference==='dark'||(preference==='system'&&Boolean(media?.matches))?'dark':'light';}
function apply(){
 const theme=resolved();
 document.documentElement.setAttribute('data-theme',theme);
 document.documentElement.style.colorScheme=theme;
 const meta=document.querySelector('meta[name="theme-color"]');
 if(meta)meta.setAttribute('content',theme==='dark'?'#101827':'#171e36');
 const toggle=document.getElementById('appearance-toggle');
 if(toggle){
  toggle.textContent=theme==='dark'?'☀️':'🌙';
  toggle.setAttribute('aria-label',theme==='dark'?'Включить светлую тему':'Включить тёмную тему');
  toggle.title=theme==='dark'?'Светлая тема':'Тёмная тема';
  toggle.setAttribute('aria-pressed',String(theme==='dark'));
 }
 document.querySelectorAll('input[name="ej-appearance"]').forEach(el=>el.checked=el.value===preference);
 const indicator=document.getElementById('ej-appearance-status');
 if(indicator)indicator.textContent=preference==='system'?
  'Сейчас используется '+(theme==='dark'?'тёмная':'светлая')+' тема по настройке устройства.':
  'Сейчас включена '+(theme==='dark'?'тёмная':'светлая')+' тема.';
}
function selectMode(value){
 if(!VALID.includes(value))return;
 preference=value;
 try{localStorage.setItem(KEY,value)}catch(e){console.info('Не удалось сохранить оформление',e);}
 apply();
}
function settingsPanel(){
 return '<div class="panel appearance-panel"><h3>🎨 Оформление</h3>'+
  '<p class="tiny">Выбери внешний вид приложения. Настройка сохраняется только в этом браузере и не влияет на прогресс уроков.</p>'+
  '<fieldset class="appearance-choices" aria-label="Тема оформления"><legend class="tiny">Тема интерфейса</legend>'+
  '<label class="appearance-choice"><input type="radio" name="ej-appearance" value="system"'+(preference==='system'?' checked':'')+'><span><b>⚙️ Системная</b><small>По настройке устройства</small></span></label>'+
  '<label class="appearance-choice"><input type="radio" name="ej-appearance" value="light"'+(preference==='light'?' checked':'')+'><span><b>☀️ Светлая</b><small>Светлый фон и карточки</small></span></label>'+
  '<label class="appearance-choice"><input type="radio" name="ej-appearance" value="dark"'+(preference==='dark'?' checked':'')+'><span><b>🌙 Тёмная</b><small>Тёмный фон и карточки</small></span></label>'+
  '</fieldset><p class="tiny" id="ej-appearance-status" role="status"></p></div>';
}
apply();
if(media){
 const listener=()=>{if(preference==='system')apply();};
 if(typeof media.addEventListener==='function')media.addEventListener('change',listener);
 else if(typeof media.addListener==='function')media.addListener(listener);
}
window.addEventListener('storage',event=>{
 if(event.key===KEY){preference=readPreference();apply();}
});
window.addEventListener('DOMContentLoaded',()=>{
 const originalSettings=settings,originalWire=wire;
 settings=function(){return originalSettings()+settingsPanel();};
 wire=function(){
  originalWire();
  document.querySelectorAll('input[name="ej-appearance"]').forEach(el=>{
   el.onchange=()=>{if(el.checked)selectMode(el.value)};
  });
  const shortcut=document.getElementById('appearance-toggle');
  if(shortcut)shortcut.onclick=()=>selectMode(resolved()==='dark'?'light':'dark');
  apply();
 };
 const shortcut=document.getElementById('appearance-toggle');
 if(shortcut)shortcut.onclick=()=>selectMode(resolved()==='dark'?'light':'dark');
 apply();
});
window.EnglishJourneyAppearance={getPreference:()=>preference,resolved,setPreference:selectMode};
})();