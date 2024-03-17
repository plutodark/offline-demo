import { useState, useEffect } from 'react';
import {
  // getItems,
  addItem,
  updateItem,
  deleteItem,
  bulkAddItems,
  multiBulkAdd,
  searchItems,
  //getLastItem,
  // db
} from './db';
// import { useLiveQuery } from "dexie-react-hooks";

const ItemList = () => {
  const [query, setQuery] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [items, setItems] = useState([]);
  const offset = 0;
  const limit = 10;
  // const handleSearchQuery = () => {
  //   const regex = new RegExp(query, 'i');
  //   const collection = query ? db.items.filter(item => regex.test(item.name)) : db.items;
    
  //   return collection
  //   .offset(offset)
  //   .limit(limit)
  //   .sortBy('id')
  // }
  // const items = useLiveQuery(
  //   handleSearchQuery,
  //     [query],
  //     []
  // );
  useEffect(() => {
    const fetchData = async () => {
      const { result, consumedSeconds } = await searchItems({ offset, limit, query });
      setItems(result);
      setSeconds(consumedSeconds);
    }
    fetchData();
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      // const item = await getLastItem();
      // console.log(item);
      // const count = item ? item.id : 1;
      // console.log('count', count);
    };

    fetchData();
  }, [items]);

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
      <div>It takes {seconds} seconds to finished the search!</div>
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
      <button onClick={multiBulkAdd}>Mulit bulk add</button>
    </div>
  );
};

export default ItemList;