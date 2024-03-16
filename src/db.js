import Dexie from 'dexie';

const db = new Dexie('myDatabase');

db.version(1).stores({
  items: '&id, name, purchased', // Define properties for each item
});

export const addItem = async (item) => {
  await db.items.add(item);
};

export const getItems = async () => {
  const allItems = await db.items.toArray();
  return allItems;
};

export const updateItem = async (id, updatedItem) => {
  await db.items.update(id, updatedItem);
};

export const deleteItem = async (id) => {
  await db.items.delete(id);
};