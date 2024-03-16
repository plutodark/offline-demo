import { useState } from 'react';
import {
  // getItems,
  addItem,
  updateItem,
  deleteItem,
  bulkAddItems,
  db
} from './db';
import { useLiveQuery } from "dexie-react-hooks";

const ItemList = () => {
 // const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const offset = 0;
  const limit = 10;
  const handleSearchQuery = () => {
    console.log('query', query)
    return db.items
    .where('name')
    .startsWith(query)
    //.anyOf(query)
    .offset(offset)
    .limit(limit)
    .sortBy('id')
  }
  const items = useLiveQuery(
    handleSearchQuery,
      [query],
      []
  );
  console.log('items', items);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const allItems = await getItems({ offset: 0, limit: 10 });
  //     setItems(allItems);
  //   };

  //   fetchData();
  // }, []);

  const handleAdd = (newItem) => {
    addItem(newItem);
    //setItems([...items, newItem]);
  };

  const handleUpdate = (id, updatedItem) => {
    updateItem(id, updatedItem);
    //setItems(items.map((item) => (item.id === id ? updatedItem : item)));
  };

  const handleDelete = (id) => {
    deleteItem(id);
    //setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div>search</div>
      <input type="text" name="name" onChange={e => setQuery(e.target.value)} value={query} />
      <h2>My Items</h2>
      
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.purchased ? 'Purchased' : 'Not Purchased'}
            <button onClick={() => handleUpdate(item.id, { ...item, purchased: !item.purchased })}>
              Toggle Purchased
            </button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={(e) => {
        e.preventDefault();
        const newItem = { name: e.target.name.value, purchased: false };
        handleAdd(newItem);
        e.target.reset();
      }}>
        <input type="text" name="name" placeholder="Enter item name" />
        <button type="submit">Add Item</button>
      </form>
      <button onClick={bulkAddItems}>Bulk add</button>
    </div>
  );
};

export default ItemList;