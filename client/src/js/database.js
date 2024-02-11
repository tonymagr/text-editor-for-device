import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Method that accepts entered code content and adds it to the database
export const putDb = async (id, content) => {
  console.log('PUT to the database');
  const textDB = await openDB('jate', 1);
  const trans = textDB.transaction('jate', 'readwrite');
  const store = trans.objectStore('jate');
  const request = store.put({ id: id, text: content });
  const result = await request;
  console.log('Data saved to the database', result);
};

// Method that gets all the content from the database 
// (The content is one IndexedDB array element, index 0, of one string containing all content and line feeds)
export const getDb = async (id) => {
  console.log('GET from the database');
  const textDb = await openDB('jate', 1);
  const trans = textDb.transaction('jate', 'readonly');
  const store = trans.objectStore('jate');
  const request = store.get(id);
  const result = await request;
  console.log('Result:', result);
  return result;
};

initdb();
