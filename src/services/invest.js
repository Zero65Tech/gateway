const { OAuth2Client } = require('google-auth-library');
const { Service } = require('@zero65/utils');
const oAuth2Client = new OAuth2Client();

async function auth(req, session) {

  try {
    if(req.headers.authorization) { // Chrome Extension
      req.query.account = (await oAuth2Client.getTokenInfo(req.headers.authorization.substring('Bearer '.length))).email;
    } else if(session && session.status == 'loggedin') { // Web Apps
      let user = await Service.doGet('user', '/',  {}, { id: session.user.id });
      req.query.account = user.email;
    } else {
      req.query.account = 'demo@zero65.in';
    }
  } catch(e) {
    console.log(e);
    return false;
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

  '/users/profiles'             : { 'GET': { auth: auth } },
  '/users/groups'               : { 'GET': { auth: auth } },
  '/trades'                     : { 'GET': { auth: auth } },
  '/trades/fo/mom'              : { 'GET': { auth: auth } },
  '/trades/pnl'                 : { 'GET': { auth: auth } },
  '/transactions'               : { 'GET': { auth: auth } },
  '/transactions/funds'         : { 'GET': { auth: auth } },
  '/statement/dates'            : { 'GET': { auth: auth } },
  '/statement/summary'          : { 'GET': { auth: auth } },
  '/sprints/trades'             : { 'GET': { auth: auth } },
  '/portfolio'                  : { 'GET': { auth: auth } },
  '/portfolio/yoy'              : { 'GET': { auth: auth } },
  '/portfolio/scripts'          : { 'GET': { auth: auth } },
  '/portfolio/performance'      : { 'GET': { auth: auth } },
  '/portfolio/summary'          : { 'GET': { auth: auth } },
  '/portfolio/symbol'           : { 'GET': { auth: auth } },

  '/user/zerodha-ids'           : { 'GET': { auth: auth } },
  '/user/sets'                  : { 'GET': { auth: auth } },
  '/trades/scripts'             : { 'GET': { auth: auth } },
  '/trades/about'               : { 'GET': { auth: auth } },
  '/trades/organized'           : { 'GET': { auth: auth } },
  '/sprints/summary'            : { 'GET': { auth: auth } },
  '/sprints/trades-v2'          : { 'GET': { auth: auth } },
  '/portfolio-v4'               : { 'GET': { auth: auth } },
  '/portfolio-v4/dates'         : { 'GET': { auth: auth } },
  '/portfolio-v4/amount'        : { 'GET': { auth: auth } },
  '/portfolio-v4/amount/set'    : { 'GET': { auth: auth } },
  '/portfolio-v4/pnl'           : { 'GET': { auth: auth } },
  '/portfolio-v4/pnl-tax'       : { 'GET': { auth: auth } },
  '/portfolio-v4/fo'            : { 'GET': { auth: auth } },

  '/holding-gains/distribution' : { 'GET': { auth: auth } },
  '/fo/positions'               : { 'GET': { auth: auth } },
  
};
