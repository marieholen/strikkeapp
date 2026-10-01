const DB_NAME = "strikkeapp";
const DB_VERSION = 1;
const STORE_NAME = "pdfs";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Kunne ikke åpne PDF-lageret."));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function savePdf(file: File): Promise<string> {
  const database = await openDatabase();

  const id = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put(file, id);

    request.onsuccess = () => {
      resolve(id);
    };

    request.onerror = () => {
      reject(new Error("Kunne ikke lagre PDF-filen."));
    };

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onerror = () => {
      database.close();
      reject(new Error("Kunne ikke lagre PDF-filen."));
    };
  });
}

export async function getPdf(id: string): Promise<Blob> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(id);

    request.onsuccess = () => {
      if (!request.result) {
        reject(new Error("PDF-filen ble ikke funnet."));
        return;
      }

      resolve(request.result as Blob);
    };

    request.onerror = () => {
      reject(new Error("Kunne ikke hente PDF-filen."));
    };

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onerror = () => {
      database.close();
      reject(new Error("Kunne ikke hente PDF-filen."));
    };
  });
}

export async function deletePdf(id: string): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Kunne ikke slette PDF-filen."));
    };

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onerror = () => {
      database.close();
      reject(new Error("Kunne ikke slette PDF-filen."));
    };
  });
}
