var express = require('express');
var router = express.Router();
const http = require("node:http");
const url = require("url");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('proxy', { title: 'Proxy' }); // { title: 'Express' }
});

router.post('/', (req, res) => {
  const destinationHost = url.parse(req.body.dhost);
  console.log(destinationHost);

  if (destinationHost.protocol === 'http:') {

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
  } else if (destinationHost.protocol === 'https:') {
    console.log("https!");
    // HTTPS
  } else { // None
    // DNS lookup?
  }

})

module.exports = router;
