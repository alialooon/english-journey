/* No server of our own: optional service worker caches static app on same origin. */
if('serviceWorker' in navigator){window.addEventListener('load',()=>{
 navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(error=>console.info('Offline cache unavailable',error));
});}