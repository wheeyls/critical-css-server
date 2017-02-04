function requireHeader(name, value) {
  return function (req, res, next) {
    if (req.get(name) !== value) {
      console.log('Wrong Header', { required: name, value: req.get(name) });
      res.sendStatus(406);
    } else {
      next();
    }
  };
}

module.exports = requireHeader;
