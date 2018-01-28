import Dexie from 'dexie';

const db = new Dexie('DB__');

db.version(1).stores({
  notes: '++id, content, tags, created, edited, done'
});

export default db;
