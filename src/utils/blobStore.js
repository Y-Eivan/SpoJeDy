const DB_NAME = 'spojedy'
const STORE = 'profile'
const VERSION = 1

function openDB() {
//opens a connection to the database before we can do anything with it
//every save / load / delete calls this first.
  return new Promise((resolve, reject) => {

    const req = indexedDB.open(DB_NAME, VERSION)    //ask browser to create DB

    req.onupgradeneeded = () => {     //Creates the "drawer" where we'll store things.
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE) //if it does exist, no need to create a draawer
      }
    }


    req.onsuccess = () => resolve(req.result)     //database opened successfully — hand back the connection
    req.onerror = () => reject(req.error)
  })
}

export async function saveBlob(key, blob) {

  const db = await openDB()

  return new Promise((resolve, reject) => {

    //creates a "protected session", readwrite -> overwrite for saving
    const tx = db.transaction(STORE, 'readwrite')
    //store blob under a key name
    tx.objectStore(STORE).put(blob, key)


    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadBlob(key) {

  const db = await openDB()

  return new Promise((resolve, reject) => {

    //readonly -> reading
    const tx = db.transaction(STORE, 'readonly')
    //lookup with key
    const req = tx.objectStore(STORE).get(key)


    req.onsuccess = () => resolve(req.result || null) //if found, returns the result. otherwise, NULL
    req.onerror = () => reject(req.error)
  })
}


export async function deleteBlob(key) {


  const db = await openDB()

  return new Promise((resolve, reject) => {

    const tx = db.transaction(STORE, 'readwrite')

    tx.objectStore(STORE).delete(key)
    
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
