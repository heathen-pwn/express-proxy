var express = require('express');
var router = express.Router();
const ProxyAPI = require('../src/models/proxy');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('proxy', { title: 'Proxy' }); // { title: 'Express' }
});

router.post('/', (req, res) => {
  console.log(typeof req.body.dhost);
  const proxy = new ProxyAPI.Proxy(new URL(req.body.dhost), res);
  proxy.get();
  console.log(proxy);
})

module.exports = router;
