const { OAuth2Client } = require('google-auth-library');

const { Service } = require('@zero65tech/common-utils');

const oAuth2Client = new OAuth2Client();



const DEMO_ACCOUNT = 'demo@zero65.in';

const paths = [
  '/fys',
  '/accounts',
  '/accounts/summary',
  '/sources',
  '/itr',
  '/heads',
  '/heads/yoy',
  '/heads/filter',
  '/transactions',
];

async function auth(req) {

  let token = req.headers.authorization;
  if(token && token.startsWith('Bearer ')) {
    let email = (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email;
    if(req.query.account) {
      if(req.query.account != email)
        return false;
    } else {
      req.query.account = email;
    }
  } else if(req.cookies.account) { // TODO: stop using req.cookies.account cookie
    if(req.query.account) {
      if(req.query.account != req.cookies.account)
        return false;
    } else {
      req.query.account = req.cookies.account;
    }
  } else if(req.query.account) {
    if(req.query.account != DEMO_ACCOUNT)
      return false;
  } else {
    req.query.account = DEMO_ACCOUNT;
  }

  return true;

}

module.exports = paths.reduce((obj, path) => {
  obj[path] = {
    'GET': {
      auth: auth
    }
  };
  return obj;
}, {});
