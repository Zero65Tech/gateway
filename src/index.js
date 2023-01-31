const express        = require('express');
const https          = require('https');
const { GoogleAuth } = require('google-auth-library');

const { Service } = require('@zero65/utils');
const Config = require('../src/config');

const app = express();

const httpsAgent = new https.Agent({
  keepAlive: true, 
  maxSockets: Infinity
});

const auth = new GoogleAuth();



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


  // Session

  let session = undefined;
  if(req.cookies.sessionId) {
    session = await Service.doGet('user', '/session', {}, { id: req.cookies.sessionId });
    if(session.status != 'active' && session.status != 'loggedin')
      return res.sendStatus(401);
  }


  // Service, host & path

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

 
  // Validation & Auth

  if(!service.endsWith('-app')) { // TODO: remove

    let config = require(`./services/${ service }.js`);

    config = config[path];
    if(!config)
      return res.status(404).send('Api not found !');

    config = config[req.method]
    if(!config)
      return res.status(405).send('Method not allowed !');

    if(config.auth && ! await config.auth(req, session))
      return res.sendStatus(403);

  }


  // Forward request and pipe response

  let client = await auth.getIdTokenClient('https://' + host);

  let headers = { 'User-Agent': req.headers['user-agent'] };
  if(req.headers['if-none-match'])
    headers['If-None-Match'] = req.headers['if-none-match'];

  let options = {
    url: 'https://' + host + path,
    method: req.method,
    headers: headers,
    agent: httpsAgent,
    responseType: 'stream';
    validateStatus: status => true;
  }

  if(req.method == 'GET')
    options.params = req.query;
  else if(req.method == 'POST')
    options.data = req.body;

  let response = await client.request(options);
  response.data.pipe(res.status(response.status).set(response.headers));  

});



app.listen(process.env.PORT || 8080, console.log(`index: Server is up and listening at ${ process.env.PORT || 8080 } port.`));
