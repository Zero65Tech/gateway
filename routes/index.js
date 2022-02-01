const fs = require('fs');
const express = require('express');
const { Service } = require('@zero65tech/common-utils');

const app = express();



// Enable All CORS Requests
app.use(require('cors')());

// Parse JSON bodies
app.use(express.json());

// Easy access cookies
app.use(require('cookie-parser')());

app.use('/api/static', express.static(`${ __dirname }/../static`));



app.all('*', async (req, res) => {

  let service = req.hostname.substring(0, req.hostname.indexOf('.'));
  
  let [ path ] = req.url.split('?');
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

  if(config.validate && !config.validate(emailId, req.query))
    return res.sendStatus(400);


  if(config.auth && ! await config.auth(req))
    return res.sendStatus(403);


  let headers = {};

  if(req.headers['if-none-match'])
    headers['if-none-match'] = req.headers['if-none-match'];

  let traceContext = req.headers['x-cloud-trace-context'];
  if(traceContext) {
    i = traceContext.indexOf('/');
    if(i != -1)
      traceContext = traceContext.substring(0, i);
    i = traceContext.indexOf(':');
    if(i != -1)
      traceContext = traceContext.substring(0, i);
    headers['x-cloud-trace-context'] = traceContext;
  }


  let ret = await Service.doGet(service, path, headers, req.query, false);
  res.status(ret.status).send(ret.data);

});



app.listen(process.env.PORT, console.log(`index: Server is up and running.`));
