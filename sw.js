// เก็บหน้าทางเข้าไว้ในเครื่อง เปิดไอคอนแล้วขึ้นทันที (ตัวระบบจริงยังโหลดจาก Google ทุกครั้ง)
const CACHE = 'hero-launcher-v1';
const FILES = ['./', './index.html', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  // config.js ดึงใหม่ก่อนเสมอ (แก้ลิงก์แล้วมีผลทันที) ถ้าไม่มีเน็ตค่อยใช้ของเก่า
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
