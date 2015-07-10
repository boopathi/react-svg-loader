// do a simple dfs
module.exports = function traverse(o, fn) {
  var keys = Object.keys(o);
  var i = keys.length;
  while(i-- > 0) {
    var key = keys[i];
    fn.apply(this, [key, o[key], o]);
    // key has been deleted
    if (typeof o[key] === 'undefined') continue;
    // key is null / has been nullified
    if (o[key] === null) continue;
    // key is traversable
    if (typeof o[key] === 'object') traverse(o[key], fn);
  }
};
