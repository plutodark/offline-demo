import { useState, useEffect } from 'react';
import './App.css';
import { openDB } from 'idb';

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Offline Demo with IndexedDB</h1>
        <button onClick={handleAddData}>Add Data</button>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <ul>
          {filteredData.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
