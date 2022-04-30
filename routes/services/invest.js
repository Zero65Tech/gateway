const { OAuth2Client } = require('google-auth-library');
const { Service } = require('@zero65tech/common-utils');
const oAuth2Client = new OAuth2Client();

async function auth1(req) {

  let token = req.headers.authorization || req.cookies.authorization;
  if(token && token.startsWith('Bearer ')) {
    req.query.account = token.length > 500 // TODO: Fix - Use ID tokens only
      ? (await oAuth2Client.verifyIdToken({ idToken:token.substring('Bearer '.length), audience:'220251834863-p6gimkv0cgepodik4c1s8cs471dv9ioq.apps.googleusercontent.com' })).payload.email
      : (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email;
    return true;
  } else {
    return false;
  }

}

async function auth2(req) {

  let token = req.headers.authorization || req.cookies.authorization;
  if(token && token.startsWith('Bearer ')) {
    req.query.account = token.length > 500 // TODO: Fix - Use ID tokens only
      ? (await oAuth2Client.verifyIdToken({ idToken:token.substring('Bearer '.length), audience:'220251834863-p6gimkv0cgepodik4c1s8cs471dv9ioq.apps.googleusercontent.com' })).payload.email
      : (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email;
  } else {
    req.query.account = 'demo@zero65.in';
  }

  if(req.query.profile) {
    let profiles = (await Service.doGet('invest', '/users/profiles', {}, { account: req.query.account }));
    if(!profiles[req.query.profile])
      return false;
  }

  // TODO: Verify porfolioIds

  return true;

}

module.exports = {
  '/users/profiles':             { 'GET': { auth: auth1 } },
  '/users/groups':               { 'GET': { auth: auth2 } },
  '/trades':                     { 'GET': { auth: auth2 } },
  '/trades/organized':           { 'GET': { auth: auth2 } },
  '/trades/fo/mom':              { 'GET': { auth: auth2 } },
  '/trades/pnl':                 { 'GET': { auth: auth2 } },
  '/transactions':               { 'GET': { auth: auth2 } },
  '/transactions/funds':         { 'GET': { auth: auth2 } },
  '/sprints/trades':             { 'GET': { auth: auth2 } },
  '/portfolio':                  { 'GET': { auth: auth2 } },
  '/portfolio/yoy':              { 'GET': { auth: auth2 } },
  '/portfolio/scripts':          { 'GET': { auth: auth2 } },
  '/portfolio/performance':      { 'GET': { auth: auth2 } },
  '/portfolio/summary':          { 'GET': { auth: auth2 } },
  '/portfolio/symbol':           { 'GET': { auth: auth2 } },
  '/holding-gains/distribution': { 'GET': { auth: auth2 } },
  '/fo/positions':               { 'GET': { auth: auth2 } }
};
