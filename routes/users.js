var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<a href="http://icanhazip.com">ICANHAZIP</a>respond with a resource<a href="http://icanhazip.com">ICANHAZIP</a><a href="http://icanhazip.com">ICANHAZIP</a>');
});

module.exports = router;
