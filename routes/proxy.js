var express = require('express');
var router = express.Router();
const Url = require('url');
const ProxyAPI = require('../src/models/proxy');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('proxy', { title: 'Proxy' }); // { title: 'Express' }
});

router.post('/', (req, res) => {
  // Deprecated
  // const proxy = new ProxyAPI.Proxy(new URL(req.body.dhost), res);
  // proxy.get();
})

router.get('/proxy', (req, res) => {
  console.log("dhost:", req.query.dhost);
  const proxy = new ProxyAPI.Proxy(req.query.dhost, res);
  proxy.get();
})

module.exports = router;
