let _uniqueId_counter = 0;
const MAX_VALUE = 10000000000;

export default function(prefix) {
  _uniqueId_counter++;
  if (_uniqueId_counter >= MAX_VALUE) {
    _uniqueId_counter = 0;
  }
  return `_${prefix || ''}${Date.now()}_${_uniqueId_counter}`;
}
