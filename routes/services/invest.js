const { OAuth2Client } = require('google-auth-library');
const { Service } = require('@zero65tech/common-utils');
const oAuth2Client = new OAuth2Client();

async function auth(req) {

  let token = req.headers.authorization || req.cookies.authorization;
  if(token && token.startsWith('Bearer ')) {
    try {
      req.query.account = token.length > 500 // TODO: Fix - Use ID tokens only
        ? (await oAuth2Client.verifyIdToken({ idToken:token.substring('Bearer '.length), audience:'220251834863-p6gimkv0cgepodik4c1s8cs471dv9ioq.apps.googleusercontent.com' })).payload.email
        : (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email;
    } catch(e) {
      console.log(e);
      return false;
    }
  } else {
    req.query.account = 'demo@zero65.in';
  }

  if(req.query.profile && req.query.profile != 'Demo') {
    let profiles = (await Service.doGet('invest', '/users/profiles', {}, { account: req.query.account }));
    if(!profiles[req.query.profile])
      return false;
  }

  // TODO: Verify porfolioIds

  return true;

}

module.exports = {
  '/users/profiles':             { 'GET': { auth: auth } },
  '/users/groups':               { 'GET': { auth: auth } },
  '/trades':                     { 'GET': { auth: auth } },
  '/trades/organized':           { 'GET': { auth: auth } },
  '/trades/fo/mom':              { 'GET': { auth: auth } },
  '/trades/pnl':                 { 'GET': { auth: auth } },
  '/transactions':               { 'GET': { auth: auth } },
  '/transactions/funds':         { 'GET': { auth: auth } },
  '/statement/day-summary':      { 'GET': { auth: auth } },
  '/sprints/trades':             { 'GET': { auth: auth } },
  '/portfolio':                  { 'GET': { auth: auth } },
  '/portfolio/yoy':              { 'GET': { auth: auth } },
  '/portfolio/scripts':          { 'GET': { auth: auth } },
  '/portfolio/performance':      { 'GET': { auth: auth } },
  '/portfolio/summary':          { 'GET': { auth: auth } },
  '/portfolio/symbol':           { 'GET': { auth: auth } },
  '/holding-gains/distribution': { 'GET': { auth: auth } },
  '/fo/positions':               { 'GET': { auth: auth } }
};
