const http = require('node:http');
const https = require('node:https');
const cheerio = require('cheerio');
const { execArgv } = require('node:process');

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
            console.log(this.destination);
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
          console.log(`Sending... ${parsedData.slice(0, 150)}... to HTTPS GET request`);
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
      const rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      })

      res.on('end', () => {
        try {
          const parsedData = this.parse(rawData);
          console.log(`Sending... ${parsedData.slice(0, 150)}... to HTTP GET request`);
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

    function handleAnchor(number, element) {
      const CurrentElement = $(element);
      const proxyName = "http://localhost/proxy?dhost=";
      const extractedUrl = CurrentElement.attr('href');
      const newHref = `${proxyName}${extractedUrl}`;
      
      CurrentElement.attr("href", newHref);
    }

    function handleScript(number, element) {
      const CurrentElement = $(element);
      const proxyName = "http://localhost/proxy?dhost=";
      const extractedUrl = CurrentElement.attr('src');
      const newSrc = `${proxyName}${extractedUrl}`;
      
      CurrentElement.attr("src", newSrc);
    }

    function handleImage(number, element) {
      const CurrentElement = $(element);
      const proxyName = "http://localhost/proxy?dhost=";
      const extractedUrl = CurrentElement.attr('src');
      const newSrc = `${proxyName}${extractedUrl}`;
      
      CurrentElement.attr("src", newSrc);
    }

    const handleLink = (number, element) => {
      const CurrentElement = $(element);
      const proxyName = "http://localhost/proxy?dhost=";
      // const newRel = `${proxyName}${CurrentElement.attr('rel')}`;
      // const newHref = `${proxyName}${extractedUrl}`;
      if(CurrentElement.attr('rel') === 'stylesheet') { 
        const extractedUrl = CurrentElement.attr('href');
        const newHref = `${proxyName}${this.destination.host}${extractedUrl}`;
        CurrentElement.attr("href", newHref);
      }

      $('link').each(handleLink());

      // CurrentElement.attr("rel", newRel);
    }

    // $('a').attr('href', 'http://localhost/proxy?dhost='+this.attr('href'));
    // $('script').attr('src', 'http://localhost/proxy?dhost='+$('script').attr('src'));
    // $('img').attr('src', 'http://localhost/proxy?dhost='+$('img').attr('src'));
    // $('link').attr('href', 'http://localhost/proxy?dhost='+$('link').attr('href'));

    return $.html();
  }
  static isUrlRelative(url) { // This is only applicable in this.parse
    try {
      const Url = new URL(url);
      return true;
    }
    catch(e) {
      return false;
    }
  }
}

module.exports = {
  Proxy: Proxy
}