import Database from 'better-sqlite3';
import path from 'path';

let db = null;

function getDatabase() {
  if (!db) {
    // ✅ path benar ke folder db/quran.db
    const dbPath = path.join(process.cwd(), 'db', 'quran.db');
    db = new Database(dbPath, { readonly: true }); // opsional readonly
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export { getDatabase };
