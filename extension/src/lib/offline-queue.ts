import { openDB, type IDBPDatabase } from 'idb';
import type { QueueItem } from './types';
import { postActivities, postScreenshots } from './api-client';

const DB_NAME = 'tabtrail-queue';
const DB_VERSION = 1;
const STORE_ACTIVITIES = 'activity-queue';
const STORE_SCREENSHOTS = 'screenshot-queue';

let db: IDBPDatabase | null = null;

async function getDb(): Promise<IDBPDatabase> {
  if (db) return db;
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_ACTIVITIES)) {
        const store = database.createObjectStore(STORE_ACTIVITIES, {
          keyPath: 'id',
        });
        store.createIndex('nextAt', 'nextAt');
      }
      if (!database.objectStoreNames.contains(STORE_SCREENSHOTS)) {
        const store = database.createObjectStore(STORE_SCREENSHOTS, {
          keyPath: 'id',
        });
        store.createIndex('nextAt', 'nextAt');
      }
    },
  });
  return db;
}

export async function enqueue(item: QueueItem): Promise<void> {
  const database = await getDb();
  const storeName = item.kind === 'activity' ? STORE_ACTIVITIES : STORE_SCREENSHOTS;
  await database.put(storeName, item);
}

export async function peek(kind: 'activity' | 'screenshot', limit: number = 50): Promise<QueueItem[]> {
  const database = await getDb();
  const storeName = kind === 'activity' ? STORE_ACTIVITIES : STORE_SCREENSHOTS;
  const now = Date.now();
  const tx = database.transaction(storeName, 'readonly');
  const index = tx.store.index('nextAt');
  const items: QueueItem[] = [];
  let cursor = await index.openCursor();
  while (cursor) {
    if (cursor.value.nextAt <= now) {
      items.push(cursor.value);
    }
    if (items.length >= limit) break;
    cursor = await cursor.continue();
  }
  await tx.done;
  return items;
}

export async function remove(ids: string[], kind: 'activity' | 'screenshot'): Promise<void> {
  const database = await getDb();
  const storeName = kind === 'activity' ? STORE_ACTIVITIES : STORE_SCREENSHOTS;
  const tx = database.transaction(storeName, 'readwrite');
  for (const id of ids) {
    tx.store.delete(id);
  }
  await tx.done;
}

export async function getQueueSize(kind: 'activity' | 'screenshot'): Promise<number> {
  const database = await getDb();
  const storeName = kind === 'activity' ? STORE_ACTIVITIES : STORE_SCREENSHOTS;
  return database.count(storeName);
}

export async function persistFailed(item: QueueItem): Promise<void> {
  const database = await getDb();
  const storeName = item.kind === 'activity' ? STORE_ACTIVITIES : STORE_SCREENSHOTS;
  await database.put(storeName, item);
}

export async function flushQueue(userId: string, clientId: string): Promise<{ synced: number; failed: number }> {
  let synced = 0;
  let failed = 0;

  const activityItems = await peek('activity', 50);
  if (activityItems.length > 0) {
    const payloads = activityItems.map(i => i.payload);
    const ok = await postActivities(userId, clientId, payloads);
    if (ok) {
      await remove(activityItems.map(i => i.id), 'activity');
      synced += activityItems.length;
    } else {
      for (const item of activityItems) {
        item.retries += 1;
        item.nextAt = Date.now() + Math.min(Math.pow(2, item.retries) * 1000, 60000);
        if (item.retries >= 5) {
          continue;
        }
        await persistFailed(item);
      }
      failed += activityItems.length;
    }
  }

  const screenshotItems = await peek('screenshot', 10);
  if (screenshotItems.length > 0) {
    const payloads = screenshotItems.map(i => i.payload);
    const ok = await postScreenshots(userId, clientId, payloads);
    if (ok) {
      await remove(screenshotItems.map(i => i.id), 'screenshot');
      synced += screenshotItems.length;
    } else {
      for (const item of screenshotItems) {
        item.retries += 1;
        item.nextAt = Date.now() + Math.pow(2, item.retries) * 1000;
        if (item.retries >= 10) {
          continue;
        }
        await persistFailed(item);
      }
      failed += screenshotItems.length;
    }
  }

  return { synced, failed };
}