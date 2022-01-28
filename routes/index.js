const fs = require('fs');
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { Http, Service } = require('@zero65tech/common-utils');

const app = express();
// Enable All CORS Requests
app.use(require('cors')());

const oAuth2Client = new OAuth2Client();



app.get('*', async (req, res) => {

  let service = req.hostname.substring(0, req.hostname.indexOf('.'));
  let [ path, query ] = req.url.split('?');

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


  let email = undefined;
  let token = req.headers.authorization;
  if(token && token.startsWith('Bearer '))
    email = (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email;

  if(config.auth && !config.auth(email, req.query))
    return res.sendStatus(403);


  let headers = {};

  if(req.headers['cookie'])
    headers['cookie'] = req.headers['cookie'];
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

  let ret = await Service.doGet(service, path, headers, query, false);
  res.status(ret.status).send(ret.data);

});



app.listen(process.env.PORT, console.log(`index: Server is up and running.`));
