const { OAuth2Client } = require('google-auth-library');
const { Service } = require('@Zero65Tech/utils');
const oAuth2Client = new OAuth2Client();

async function auth(req) {

  let token = req.headers.authorization || req.cookies.authorization;
  if(token && token.startsWith('Bearer ')) {
    try {
      req.query.email = (await oAuth2Client.verifyIdToken({
        idToken  : token.substring('Bearer '.length),
        audience : '220251834863-p6gimkv0cgepodik4c1s8cs471dv9ioq.apps.googleusercontent.com',
      })).payload.email
    } catch(e) {
      console.log(e);
      return false;
    }
  } else {
    req.query.email = 'demo@zero65.in';
  }

  return true;

}

module.exports = {
  '/fys'              : { 'GET': { auth: auth } },
  '/accounts'         : { 'GET': { auth: auth } },
  '/accounts/summary' : { 'GET': { auth: auth } },
  '/sources'          : { 'GET': { auth: auth } },
  '/itr'              : { 'GET': { auth: auth } },
  '/heads'            : { 'GET': { auth: auth } },
  '/heads/yoy'        : { 'GET': { auth: auth } },
  '/heads/filter'     : { 'GET': { auth: auth } },
  '/transactions'     : { 'GET': { auth: auth } },
};
