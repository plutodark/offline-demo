import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

db.version(1).stores({
  items: '++id, name, purchased', // Define properties for each item
});

export const addItem = async (item) => {
  await db.items.add(item);
};

export const getItems = async ({ offset = 0, query = '', limit = 10 }) => {
  const allItems = await db.items.where("name").startsWithAnyOfIgnoreCase([query]).offset(offset).limit(limit).toArray();
  return allItems;
};

export const updateItem = async (id, updatedItem) => {
  await db.items.update(id, updatedItem);
};

export const deleteItem = async (id) => {
  await db.items.delete(id);
};

export const bulkAddItems = async () => {
  // const numItems = 5000; // Adjust based on your test and browser limitations
  // const chunkSize = 1000000; // 1MB per item (example)
console.log('start');
const numItems = 100000;
  const items = [];
  for (let i = 0; i < numItems; i++) {
    const name = `a${i}bcdefghi`.substring(0, 10);
    items.push({ name, purchased: false }); // Simulate data
  }

  const startTime = performance.now();
  await db.items.bulkAdd(items);
  const endTime = performance.now();
  console.log(`Added ${numItems} items (Est. size: ${numItems * 10 / (1024 * 1024)} MB) in ${(endTime - startTime) / 1000} seconds`);
}