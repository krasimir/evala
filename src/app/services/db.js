import Dexie from 'dexie';

const db = new Dexie('DB__');

db.version(2).stores({
  notes: '++id, content, tags, created, edited, done, dates'
}).upgrade(function (trans) {
  trans.notes.each((n, cursor) => {
    n.dates = [];
    cursor.update(n);
  });
});
db.version(1).stores({
  notes: '++id, content, tags, created, edited, done'
});

export default db;
