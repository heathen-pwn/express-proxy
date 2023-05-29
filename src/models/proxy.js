const http = require("node:http");
const https = require("node:https");
const url = require("url");

class Proxy {
    constructor(destination, response) {
        this.destination = destination; // url object or url string
        this.response = response;
    }
    getHttps() {
        https.get(this.destination, (res) => {
            res.setEncoding('utf-8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk });
            res.on('end', () => {
              try {
                console.log(`Sending... ${rawData}... to POST https request`);
                this.response.send(rawData);
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
                console.log(`Sending... ${rawData}... to POST request`);
                this.response.send(rawData);
              }
              catch (e) {
                console.error(e);
              }
            })
      
          })
    }

    get() { 
        if(this.destination.protocol === "http:") {
          this.getHttp();
        } else {
          this.destination.protocol = "https:";
          this.getHttps();
        }
    }
}

module.exports = {
  Proxy: Proxy
}