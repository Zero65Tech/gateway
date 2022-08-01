const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client();



async function auth(req) {
  let token = req.headers.authorization;
  if(token && token.startsWith('Bearer '))
    return (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email == 'cloud-run@zero65.iam.gserviceaccount.com';
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