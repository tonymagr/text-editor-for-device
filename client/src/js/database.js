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

// TODO: Add logic to a method that accepts some content and adds it to the database

// export const putDb = async (content) => console.error('putDb not implemented');
export const putDb = async (id, content) => {
  console.log('PUT to the database');
  const textDB = await openDB('jate', 1);
  const trans = textDB.transaction('jate', 'readwrite');
  const store = trans.objectStore('jate');
  const request = store.put({ id: id, text: content });
  const result = await request;
  console.log('Data saved to the database', result);
  // return result;
};

// TODO: Add logic for a method that gets all the content from the database

// export const getDb = async () => console.error('getDb not implemented');
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
