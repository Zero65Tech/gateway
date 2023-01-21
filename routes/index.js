const express = require('express');
const https   = require('https');

const Config   = require('../src/config');
const { Http } = require('@zero65/utils');

const app        = express();
const httpsAgent = new https.Agent({
  keepAlive: true, 
  maxSockets: Infinity
});



// Enable All CORS Requests
app.use(require('cors')());

// Parse JSON bodies
app.use(express.json());

// Easy access cookies
app.use(require('cookie-parser')());

app.use('/static', express.static(`${ __dirname }/../static`));



app.all('*', async (req, res) => {

  if(!Config[req.hostname])
    return res.status(404).send('App not found !');


  let service, host, path;
  for(const arr of Config[req.hostname]) {
    if(req.path.startsWith(arr[0])) {
      service = arr[1];
      host    = arr[2];
      path    = arr[3](req.path);
      break;
    }
  }

  if(path == '' || path == '/')
    path = '/';
  else if(path.endsWith('/'))
    path = path.substring(0, path.length - 1);

 
  if(!service.endsWith('-app')) { // TODO: remove

    let config = require(`./services/${ service }.js`);

    config = config[path];
    if(!config)
      return res.status(404).send('Api not found !');

    config = config[req.method]
    if(!config)
      return res.status(405).send('Method not allowed !');

    if(config.auth && ! await config.auth(req))
      return res.sendStatus(403);

  }


  // Headers

  let headers = {};

  headers['Authorization'] = 'Bearer ' + (await Http.doGet(
    'metadata.google.internal:80',
    '/computeMetadata/v1/instance/service-accounts/default/identity',
    { 'Metadata-Flavor': 'Google' },
    { 'audience': 'https://' + host }
  )).data;

  headers['User-Agent'] = process.env.ENV + '/' + (process.env.K_REVISION || process.env.USER);

  if(req.method == 'POST')
    headers['content-type'] = 'application/json';

  if(req.headers['if-none-match'])
    headers['if-none-match'] = req.headers['if-none-match'];


  // Request

  let request = https.request({
    hostname: host,
    port: 443,
    path: path + req.originalUrl.substring(req.path.length),
    method: req.method,
    headers: headers,
    agent: httpsAgent,
    timeout: 1000
  }, response => response.pipe(res.status(response.statusCode).set(response.headers)) );

  if(req.method == 'POST')
    request.write(JSON.stringify(req.body));

  request.on('error', (e) => {
    res.status(500).send(e.message);
  });

  request.end();

});



app.listen(process.env.PORT || 8080, console.log(`index: Server is up and listening at ${ process.env.PORT || 8080 } port.`));
