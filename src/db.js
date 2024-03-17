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
export const searchItems = async({ offset = 0, query = '', limit = 10 }) => {
  console.log('start searching');
  const regex = new RegExp(query, 'i');
  const collection = query ? db.items.filter(item => regex.test(item.name)) : db.items;
  const startTime = performance.now();
  
  const result = await collection
  .offset(offset)
  .limit(limit)
  .sortBy('id');
  const endTime = performance.now();
  const consumedSeconds = (endTime - startTime) / 1000;
  return { result, consumedSeconds };
}
export const updateItem = async (id, updatedItem) => {
  await db.items.update(id, updatedItem);
};

export const deleteItem = async (id) => {
  await db.items.delete(id);
};

export const getLastItem = async () => {
  return await await db.items.orderBy('id').last();
}
export const bulkAddItems = async () => {
  // const numItems = 5000; // Adjust based on your test and browser limitations
  // const chunkSize = 1000000; // 1MB per item (example)
console.log('start');
const totalNum = 100000;
  const items = [];
  const lastItem = await getLastItem();
  const lastCount = lastItem ? lastItem.id : 0;
  const numItems = totalNum + lastCount;
  for (let i = lastCount; i < numItems; i++) {
    const name = `${i}abcdefghijklmnopqrstuv`.substring(0, 20);
    items.push({ name, purchased: false }); // Simulate data
  }

  const startTime = performance.now();
  await db.items.bulkAdd(items);
  const endTime = performance.now();
  console.log(`Added ${numItems} items (Est. size: ${numItems * 20 / (1024 * 1024)} MB) in ${(endTime - startTime) / 1000} seconds`);
}

export const multiBulkAdd = async () => {
  const times = 100;
  for(let j = 0; j < times; j++) {
    await bulkAddItems();
    console.log('time', j);
  }
}