function requireHeader(name, value) {
  return function (req, res, next) {
    if (req.get(name) !== value) {
      console.log('Wrong Content-Type', { required: name, actual: req.get(name) });
      res.sendStatus(406);
    } else {
      next();
    }
  };
}

module.exports = requireHeader;
