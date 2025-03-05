import { openDB } from 'idb';

const DB_NAME = 'LearningPathDB';
const STORE_NAME = 'Journey';


async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'journey_id' });
            
            }
        }
    });
}

export async function saveLearningPath(id, learningPath) {
    const db = await initDB();
    await db.put(STORE_NAME, { journey_id: id, learningPath }); 
    console.log(`Learning path saved for ID: ${id}`);
}


export async function getLearningPath() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

