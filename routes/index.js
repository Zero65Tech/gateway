const fs = require('fs');
const express = require('express');
const https = require('https');
const { Http, Service } = require('@Zero65Tech/utils');

const app = express();

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

  let service = req.hostname.substring(0, req.hostname.indexOf('.'));  
  if(service.endsWith('-sgp'))
    service = service.substring(0, service.length - '-sgp'.length);
  let path = req.path;

 
  if(!path.startsWith('/api/')) {

    if(req.method != 'GET')
      return res.status(405).send('Method not allowed !');

    if(service != 'invest' && service != 'paisa')
      return res.status(404).send('Page not found !');

    let host = `${ service }-app-ci6dfndpjq-el.a.run.app`;
    if(!path.startsWith('/images/') && !path.startsWith('/css/') && !path.startsWith('/js/'))
      path = '/';

    let headers = {};
    headers['Authorization'] = 'Bearer ' + (await Http.doGet(
      'metadata.google.internal:80',
      '/computeMetadata/v1/instance/service-accounts/default/identity',
      { 'Metadata-Flavor': 'Google' },
      { 'audience': 'https://' + host }
    )).data;

    https.request({
      hostname: host,
      port: 443,
      path: path,
      method: 'GET',
      headers: headers,
      agent: httpsAgent,
      timeout: 1000
    }, response => response.pipe(res.status(response.statusCode).set(response.headers)) ).end();

    return;

  }


  path = path.substring(4);
  if(path == '' || path == '/')
    path = '/';
  else if(path.endsWith('/'))
    path = path.substring(0, path.length - 1);


  if(!fs.existsSync(`${ __dirname }/services/${ service }.js`))
    return res.status(404).send('Service not found !');

  let config = require(`./services/${ service }.js`);

  config = config[path];
  if(!config)
    return res.status(404).send('Api not found !');

  config = config[req.method]
  if(!config)
    return res.status(405).send('Method not allowed !');


  if(config.auth && ! await config.auth(req))
    return res.sendStatus(403);


  let headers = {};

  if(req.headers['if-none-match'])
    headers['if-none-match'] = req.headers['if-none-match'];

  let ret = await Service.doGet(service, path, headers, req.query, false);
  // TODO: Set 'if-none-match' header
  res.status(ret.status).send(ret.data);

});



app.listen(process.env.PORT, console.log(`index: Server is up and running.`));
