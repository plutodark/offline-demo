import React, { useState, useEffect } from 'react';
import './App.css';
import { openDB } from 'idb';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const db = await openDB('offline-demo-db', 1, {
        upgrade(db) {
          db.createObjectStore('data-store', { autoIncrement: true, keyPath: 'id' });
        },
      });

      const tx = db.transaction('data-store', 'readonly');
      const store = tx.objectStore('data-store');
      const items = await store.getAll();
      setData(items);
    }

    fetchData();
  }, []);

  const handleAddData = async () => {
    const newData = { name: `Item ${data.length + 1}` };

    const db = await openDB('offline-demo-db', 1);
    const tx = db.transaction('data-store', 'readwrite');
    const store = tx.objectStore('data-store');
    await store.add(newData);

    setData([...data, newData]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Offline Demo with IndexedDB</h1>
        <button onClick={handleAddData}>Add Data</button>
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
