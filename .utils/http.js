const fs = require('fs');
const unzipper = require('unzipper');
const http = require('http');
const https = require('https');
const querystring = require('querystring');

const httpAgent = new http.Agent({
  keepAlive: true, 
  maxSockets: Infinity
});

const httpsAgent = new https.Agent({
  keepAlive: true, 
  maxSockets: Infinity
});

const SERVICES = require('./config/services.json');



exports.download = (host, path, headers = {}, message = {}, downloadPath) => {

  return new Promise((resolve, reject) => {

    const options = {
      hostname: host,
      port: 443,
      path: Object.keys(message).length ? path + '?' + querystring.stringify(message) : path,
      method: 'GET',
      headers: {},
      agent: httpsAgent
    };

    const req = https.request(options, (res) => {

      if(res.statusCode == 200) {

        let i = downloadPath.lastIndexOf('/');
        if(i != -1) {
          let downloadDir = downloadPath.substring(0, i);
          if(!fs.existsSync(downloadDir))
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        let file = fs.createWriteStream(downloadPath);
        file.on('finish', () => resolve({ status: res.statusCode, headers: res.headers }) );
        res.pipe(file);
        
      } else {
        resolve({ status: res.statusCode, headers: res.headers });
      }

    });

    req.on('error', (e) => resolve({ status: 0, error: e }) );

    req.end();

  });

}

exports.downloadAndUnzip = (host, path, headers = {}, message = {}, downloadPath) => {

  return new Promise((resolve, reject) => {

    const options = {
      hostname: host,
      port: 443,
      path: Object.keys(message).length ? path + '?' + querystring.stringify(message) : path,
      method: 'GET',
      headers: headers,
      agent: httpsAgent
    };

    const req = https.request(options, (res) => {

      if(res.statusCode == 200) {
        res.pipe(unzipper.Extract({ path: downloadPath }))
          .on('close', () => resolve({ status: res.statusCode, headers: res.headers }))
          .on('error', e  => resolve({ status: 0, error: e }));
      } else {
        resolve({ status: res.statusCode, headers: res.headers });
      }

    });

    req.on('error', (e) => { resolve({ status: 0, error: e }); });

    req.end();

  });

}

exports.doGet = (host, path, headers = {}, message = {}) => {

  return new Promise((resolve, reject) => {

    const options = {
      hostname: host,
      port: 443,
      path: Object.keys(message).length ? path + '?' + querystring.stringify(message) : path,
      method: 'GET',
      headers: headers,
      agent: httpsAgent
    };

    let i = options.hostname.indexOf(':');
    if(i != -1) {
      options.port = parseInt(options.hostname.substring(i + 1));
      options.hostname = options.hostname.substring(0, i);
      options.agent = httpAgent;
    }

    const req = (options.port == 443 ? https : http).request(options, (res) => {

      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data && res.headers['content-type'].indexOf('application/json') != -1 ? JSON.parse(data) : data
        });
      });

    });

    req.on('error', (e) => {
      resolve({ status: 0, error: e });
    });

    req.end();

  });

}

exports.doPost = (host, path, headers = {}, message = {}) => {

  return new Promise((resolve, reject) => {

    const postData = typeof message == 'object' ? querystring.stringify(message) : message;

    const options = {
      hostname: host,
      port: 443,
      path: path,
      method: 'POST',
      headers: headers,
      agent: httpsAgent
    };

    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers['Content-Length'] = Buffer.byteLength(postData);

    const req = https.request(options, (res) => {

      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: res.headers['content-type'].indexOf('application/json') != -1 ? JSON.parse(data) : data
        });
      });

    });

    req.on('error', (e) => {
      resolve({ status: 0, error: e });
    });

    req.write(postData);
    req.end();

  });

}



exports.doGetService = async (name, api, headers = {}, message) => {

  if(!SERVICES[name] || !SERVICES[name][process.env.NODE_ENV])
    return { status: 404 };

  let host = SERVICES[name][process.env.NODE_ENV];

  headers['User-Agent'] = process.env.NODE_ENV + '/' + (process.env.K_REVISION || process.env.USER);
  if(process.env.NODE_ENV == 'prod')
    headers['Authorization'] = 'Bearer ' + (await exports.doGet(
      'metadata.google.internal:80',
      '/computeMetadata/v1/instance/service-accounts/default/identity',
      { 'Metadata-Flavor': 'Google' },
      { 'audience': 'https://' + host }
    )).data;

  return exports.doGet(host, api, headers, message);

}
