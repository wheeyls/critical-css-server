function requireParams(keys) {
  return function (req, res, next) {
    var paramKeys = Object.keys(req.body);

    if (keys.some(function (key) { return !paramKeys.includes(key); })) {
      console.log('Missing Keys', { required: keys, actual: paramKeys });
      res.sendStatus(406);
    } else {
      next();
    }
  };
}

module.exports = requireParams;
