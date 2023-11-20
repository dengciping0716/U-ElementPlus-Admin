import mitt from 'mitt';
const emitter = mitt();
export default {
  $on: emitter.on,
  // $once: (...args) => emitter.once(...args),
  $off: emitter.off,
  $emit: emitter.emit,
  $clear: (...args) => emitter.all.clear(),
};
