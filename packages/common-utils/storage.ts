//https://localforage.docschina.org/

import localforage from 'localforage';

export default localforage.createInstance({
  name: 'admin',
  version: 1, // version number (integer / float / string), 1 is treated same as '1'
  description: '本地缓存', // description (text)
});

export const createStorage = localforage.createInstance;
