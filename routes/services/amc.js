const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client();



async function auth(req) {
  let token = req.headers.authorization;
  if(token && token.startsWith('Bearer ')) {
    let email = (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email
    return email == 'antshpra@gmail.com' || email == 'run-invest@zero65.iam.gserviceaccount.com';
  }
  return false;
}

module.exports = {
  '/transactions': {
    'GET': { auth: auth }
  },
  '/portfolio': {
    'GET': { auth: auth }
  }
}
