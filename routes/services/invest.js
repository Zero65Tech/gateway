const { OAuth2Client } = require('google-auth-library');

const { Service } = require('@zero65tech/common-utils');

const oAuth2Client = new OAuth2Client();



const DEMO_ACCOUNT = 'demo@zero65.in';

const paths = [
  '/users/profiles',
  '/users/groups',
  '/trades',
  '/trades/organized',
  '/trades/fo/mom',
  '/trades/pnl',
  '/transactions',
  '/transactions/funds',
  '/sprints/trades',
  '/portfolio',
  '/portfolio/yoy',
  '/portfolio/scripts',
  '/portfolio/performance',
  '/portfolio/summary',
  '/portfolio/symbol',
  '/holding-gains/distribution',
  '/fo/positions'
];

async function auth(req) {

  let token = req.headers.authorization || req.cookies.authorization;
  if(token && token.startsWith('Bearer ')) {
    req.query.account = token.length > 500 // TODO: Fix - Use ID tokens only
      ? (await oAuth2Client.verifyIdToken({ idToken:token.substring('Bearer '.length), audience:'220251834863-p6gimkv0cgepodik4c1s8cs471dv9ioq.apps.googleusercontent.com' })).payload.email
      : (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email;
  } else {
    req.query.account = DEMO_ACCOUNT;
  }

  if(req.query.profile) {
    let profiles = (await Service.doGet('invest', '/users/profiles', {}, { account: req.query.account }));
    if(!profiles[req.query.profile])
      return false;
  }

  // TODO: Verify porfolioIds

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
