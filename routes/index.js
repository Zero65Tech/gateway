const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const httpUtil = require('../.utils/http.js');

const app = express();
// Enable All CORS Requests
app.use(require('cors')());

const oAuth2Client = new OAuth2Client();

const config  = require('./config.js');



app.get('*', async (req, res) => {

  let service = req.hostname.substring(0, req.hostname.indexOf('.'));

  if(!config[service])
    return res.sendStatus(404);


  let path = req.url;

  if(path.indexOf('?') != -1)
    path = path.substring(0, path.indexOf('?'));

  path = path.substring(4);
  if(path == '' || path == '/')
    path = '/';
  else if(path.endsWith('/'))
    path = path.substring(0, path.length - 1);

  if(!config[service][path])
    return res.sendStatus(404);


  if(config[service][path].validate && !config[service][path].validate(emailId, req.query))
    return res.sendStatus(400);


  let email = undefined;
  let token = req.headers.authorization;
  if(token && token.startsWith('Bearer '))
    email = (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email;

  if(config[service][path].auth && !config[service][path].auth(email, req.query))
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

  let ret = await httpUtil.doGetService(service, path, headers, req.query);
  res.status(ret.status).send(ret.data);

});



app.listen(process.env.PORT, console.log(`index: Server is up and running.`));
