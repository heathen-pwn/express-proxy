var express = require('express');
var router = express.Router();
const http = require("node:http");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('proxy', { title: 'Proxy' }); // { title: 'Express' }
});

router.post('/', (req, res) => {
  const destinationHost = req.body.dhost;
  console.log(destinationHost);
  // Get the website of 'dhost'
  // Send the body; res.send
  http.get(destinationHost, (destinationResult) => {
    destinationResult.setEncoding('utf-8');
    let rawData = '';
    destinationResult.on('data', (chunk) => {
      rawData += chunk;
    })
    destinationResult.on('end', () => {
      try {
        console.log(`Sending... ${rawData}... to POST request`);
        res.send(rawData);
      }
      catch (e) {
        console.error(e);
      }
    })
  })
})

module.exports = router;
