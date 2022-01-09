const express = require('express');
const httpUtil = require('./.utils/http.js');

const app = express();
// Parse JSON bodies
app.use(express.json());
// Enable All CORS Requests
app.use(require('cors')());
// Easy access cookies
app.use(require('cookie-parser')());



app.get('*', async (req, res) => {

  let service = undefined, path = req.url, query = '';

  let i = path.indexOf('?');
  if(i != -1) {
    query = path.substring(i + 1);
    path = path.substring(0, i);
  }

  if(path == '' || path == '/' || path == '/api' || path == '/api/')
    return res.sendStatus(404);

  if(path.startsWith('/api/'))
    path = path.substring(5);
  else
    path = path.substring(1);

  if(path.endsWith('/'))
    path = path.substring(0, path.length -1);

  i = path.indexOf('/');
  if(i == -1) {
    service = path;
    path = '/';
  } else {
    service = path.substring(0, i);
    path = path.substring(i);
  }


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

  let ret = await httpsUtil.doGetService(service, path, headers, req.query);
  res.status(ret.status).send(ret.data);

});



app.listen(process.env.PORT, console.log(`index: Server is up and running.`));

if(process.env.NODE_ENV == 'devo')
  require('./resources/cron.js');