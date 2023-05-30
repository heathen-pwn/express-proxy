const http = require('node:http');
const https = require('node:https');
const cheerio = require('cheerio');

class Proxy {
  constructor(destination, response) {
    try {
      this.destination = new URL(destination);
    }
    catch (e) {
      if (e.code === 'ERR_INVALID_URL') {
        if (!destination.startsWith("http:") || !destination.startsWith("https:")) {
          const proto = "http:"; // Can add protocol determinator here later
          
          try {
            this.destination = new URL(`${proto}${destination}`);
          }
          catch (e) {
            console.error("Could not determine provided URL on Proxy construction:" + e.message);
          }
        }
      }
    }
    this.response = response;
  }

  get() {
    this.destination.protocol === 'http:' ? this.getHttp() : this.getHttps();
  }

  getHttps() {
    https.get(this.destination, (res) => {
      res.setEncoding('utf-8');
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      })

      res.on('end', () => {
        try {
          const parsedData = this.parse(rawData);
          console.log(`Sending... ${parsedData.slice(0, 150)}... to GET request`);
          this.response.send(parsedData);

        }
        catch (e) {
          console.error(e);
        }
      })

    })
  }
  getHttp() {
    http.get(this.destination, (res) => {
      res.setEncoding('utf-8');
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      })

      res.on('end', () => {
        try {
          const parsedData = this.parse(rawData);
          console.log(`Sending... ${parsedData.slice(0, 150)}... to GET request`);
          this.response.send(parsedData);

        }
        catch (e) {
          console.error(e);
        }
      })

    })
  }
  /*
    -- Need to add a handler for such events when the href/src/rel is relative
    dhost: /static/js/src/infer-preferred-language.js?v=b69e09e
    GET /proxy?dhost=/static/js/src/infer-preferred-language.js?v=b69e09e 500 2.253 ms - 880
    dhost: undefined
  */
  parse(raw) {
    const $ = cheerio.load(raw, null, false);


    $('a').each(handleAnchor);
    $('script').each(handleScript);
    $('img').each(handleImage);
    $('link').each(handleLink);

    function handleAnchor(number, element) {
      const CurrentElement = $(element);
      // console.log(CurrentElement);
      const ProxyName = "http://localhost/proxy?dhost=";
      let newHref = `${ProxyName}${CurrentElement.attr('href')}`;
      CurrentElement.attr("href", newHref);
    }

    function handleScript(number, element) {
      const CurrentElement = $(element);
      // console.log(CurrentElement);
      const ProxyName = "http://localhost/proxy?dhost=";
      let newSrc = `${ProxyName}${CurrentElement.attr('src')}`;
      CurrentElement.attr("src", newSrc);
    }

    function handleImage(number, element) {
      const CurrentElement = $(element);
      // console.log(CurrentElement);
      const ProxyName = "http://localhost/proxy?dhost=";
      let newSrc = `${ProxyName}${CurrentElement.attr('src')}`;
      CurrentElement.attr("src", newSrc);
    }

    function handleLink(number, element) {
      const CurrentElement = $(element);
      // console.log(CurrentElement);
      const ProxyName = "http://localhost/proxy?dhost=";
      let newRel = `${ProxyName}${CurrentElement.attr('rel')}`;
      CurrentElement.attr("rel", newRel);
    }

    // $('a').attr('href', 'http://localhost/proxy?dhost='+this.attr('href'));
    // $('script').attr('src', 'http://localhost/proxy?dhost='+$('script').attr('src'));
    // $('img').attr('src', 'http://localhost/proxy?dhost='+$('img').attr('src'));
    // $('link').attr('href', 'http://localhost/proxy?dhost='+$('link').attr('href'));

    return $.html();
  }

}

new Proxy('localhost.com', {});
module.exports = {
  Proxy: Proxy
}