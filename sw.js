const CACHE='briefing-commissaire-v7';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('briefing-commissaire-')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',e=>e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(e.request);
  if(cached)return cached;
  try{
    const response=await fetch(e.request);
    if(e.request.method==='GET'&&new URL(e.request.url).origin===self.location.origin)cache.put(e.request,response.clone());
    return response;
  }catch(error){return cached||Response.error();}
})()));
