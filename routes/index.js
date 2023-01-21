const express = require('express');
const app     = express();

const Config      = require('../src/config');
const { Service } = require('@zero65/utils');



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


  let service, path;
  for(const arr of Config[req.hostname]) {
    if(req.path.startsWith(arr[0])) {
      service = arr[1];
      path = arr[2](req.path);
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


  let headers = {};

  if(req.headers['if-none-match'])
    headers['if-none-match'] = req.headers['if-none-match'];

  let ret;
  if(req.method == 'GET')
    ret = await Service.doGet(service, path, headers, req.query, false);
  else if(req.method == 'POST')
    ret = await Service.doPost(service, path, headers, req.body, false);

  // TODO: Set 'if-none-match' header
  
  res.status(ret.status).send(ret.data);

});



app.listen(process.env.PORT || 8080, console.log(`index: Server is up and listening at ${ process.env.PORT || 8080 } port.`));
