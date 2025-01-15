import NodeCache from 'node-cache';

const readingsCache = new NodeCache();

// Set cache data with TTL (time-to-live)
export async function setCacheData(key, data, ttl = 60) {
  if (typeof key !== 'string' || typeof data !== 'object') {
    throw new Error('Invalid arguments. Key must be a string and data must be an object.');
  }

  if (!key || !data) {
    throw new Error('Both key and data must be provided.');
  }

  try {
    // Setting TTL (default 60 seconds if not provided)
    readingsCache.set(key, data, ttl);
    console.log(`Data has been cached with TTL of ${ttl} seconds.`);
  } catch (error) {
    console.error('Error occurred while caching data:', error.message);
  }
};

// Get cache data with TTL handling
export async function getCacheData(key) {
  const inMemoryData = await readingsCache.get(key);
  if (inMemoryData !== undefined) {
    console.log('Cache hit (in-memory)');
    return inMemoryData;
  } else {
    console.log('Cache miss or expired data.');
    return false;
  }
};
