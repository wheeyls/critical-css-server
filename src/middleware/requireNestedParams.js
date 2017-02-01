function requireNestedParams(parentKey, keys) {
  return function (req, res, next) {
    var hash = req.body && req.body[parentKey];
    if (!hash) {
      console.log('Missing Required Key', parentKey);
      return res.sendStatus(406);
    }

    var paramKeys = Object.keys(hash);

    if (keys.some(function (key) { return !paramKeys.includes(key); })) {
      console.log('Missing Required Key', { required: keys, actual: paramKeys });
      res.sendStatus(406);
    } else {
      next();
    }
  };
}

module.exports = requireNestedParams;
