var LRU = require("lru-cache"),
    options = {
        max: 500,
        length: function(n) {
            return n * 2
        },
        maxAge: 1000 * 60 * 60
    },
    cache = LRU(options),
    otherCache = LRU(50) // sets just the max size
module.exports = {
    get: function(key) {
        return cache.get(key);
    },
    set: function(key, val) {
        return cache.set(key, val);
    },
    del: function(key) {
        return cache.del(key);
    }
}