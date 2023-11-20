import { LRUCache } from 'lru-cache';

const options = {
  max: 100,
  //   length: function (n, key) { return n * 2 + key.length },
  //   dispose: function (key, n) { n.close() },
  ttl: 1000 * 60 * 2,
};
const cache = new LRUCache(options);

export default cache;
