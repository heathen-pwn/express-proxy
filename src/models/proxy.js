const http = require('node:http');
const https = require('node:https');
const cheerio = require('cheerio');
class Proxy {
    constructor(destination, response) {
        this.destination = destination; // url object or url string
        this.response = response;
    }

    get() { 
        if(this.destination.protocol === 'http:') {
          this.getHttp();
        } else {
          this.destination.protocol = 'https:';
          this.getHttps();
        }
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
            console.log(`Sending... ${parsedData.slice(0, 250)}... to GET request`);
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
              const parsedData = HTMLParser.parse(rawData);
              console.log(`Sending... ${parsedData.slice(0, 250)}... to GET request`);
              this.response.send(parsedData);

            }
            catch (e) {
              console.error(e);
            }
          })
    
        })
  }
  parse(raw) {
    const $ = cheerio.load(raw);

    console.log('href:', $('a').attr('href'));
    $('a').each((element, index) => {
      element.attr('href', 'http://localhost/proxy?dhost='+element.attr('href'))
      console.log(element.attr('href'));
    })

    // $('a').attr('href', 'http://localhost/proxy?dhost='+this.attr('href'));
    // $('script').attr('src', 'http://localhost/proxy?dhost='+$('script').attr('src'));
    // $('img').attr('src', 'http://localhost/proxy?dhost='+$('img').attr('src'));
    // $('link').attr('href', 'http://localhost/proxy?dhost='+$('link').attr('href'));

    return $.html();
}

}

module.exports = {
  Proxy: Proxy
}