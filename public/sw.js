// ----- Service Worker Kurulumu -----
self.addEventListener("install", () => {
  console.log("Service worker installed.");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service worker activated.");
  self.clients.claim();
});


// ----- IndexedDB Outbox -----
const DB_NAME = "skt-takip-db";
const DB_VERSION = 1;
const OUTBOX_STORE = "outbox";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OUTBOX_STORE)) {
        db.createObjectStore(OUTBOX_STORE, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllOutboxItems() {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(OUTBOX_STORE, "readonly");
        const store = tx.objectStore(OUTBOX_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

function deleteOutboxItem(id) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(OUTBOX_STORE, "readwrite");
        const store = tx.objectStore(OUTBOX_STORE);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}


// ----- Kuyruğu Sunucuya Gönder -----
async function flushOutbox() {
  const items = await getAllOutboxItems();
  if (!items.length) return;

  for (const item of items) {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload)
      });

      if (res.ok) {
        await deleteOutboxItem(item.id);
      } else {
        console.warn("Sunucu hatası, işlem durduruldu.");
        break;
      }
    } catch (err) {
      console.warn("Ağ hatası, işlem durduruldu.");
      break;
    }
  }
}


// ----- Background Sync -----
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-outbox") {
    console.log("Background Sync tetiklendi.");
    event.waitUntil(flushOutbox());
  }
});


// ----- Online Olduğunda (fallback) -----
self.addEventListener("online", () => {
  console.log("Online olduk, outbox flush ediliyor.");
  flushOutbox();
});
