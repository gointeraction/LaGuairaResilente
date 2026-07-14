const DB_NAME = 'guaira-resiliente';
const DB_VERSION = 1;

export const STORES = {
  PENDING_SYNC: 'pending_sync',
  CACHED_CONTENT: 'cached_content',
  LOCAL_PROGRESS: 'local_progress'
} as const;

let dbInstance: IDBDatabase | null = null;

export async function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORES.PENDING_SYNC)) {
        db.createObjectStore(STORES.PENDING_SYNC, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.CACHED_CONTENT)) {
        db.createObjectStore(STORES.CACHED_CONTENT, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.LOCAL_PROGRESS)) {
        db.createObjectStore(STORES.LOCAL_PROGRESS, { keyPath: 'id' });
      }
    };
  });
}

export async function addToStore<T>(storeName: string, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.add(data);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getFromStore<T>(storeName: string, id: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateInStore<T>(storeName: string, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(data);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteFromStore(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function queueForSync(data: {
  id: string;
  collection: string;
  action: 'create' | 'update' | 'delete';
  data: any;
}): Promise<void> {
  await addToStore(STORES.PENDING_SYNC, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

export async function getPendingSync(): Promise<any[]> {
  return getAllFromStore(STORES.PENDING_SYNC);
}

export async function clearPendingSync(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PENDING_SYNC, 'readwrite');
    const store = tx.objectStore(STORES.PENDING_SYNC);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
