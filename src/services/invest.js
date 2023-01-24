function loggedinOnly(req, session) {
  if(session && session.status == 'loggedin')
    req.query.userId = session.user.id;
  else
    return false;
  return true;
}

function loggedinOrDemo(req, session) {
  if(session && session.status == 'loggedin')
    req.query.userId = session.user.id;
  else
    req.query.account = 'demo@zero65.in';
  return true;
}



module.exports = {

  // Old ones

  '/users/profiles'             : { 'GET': { auth: loggedinOrDemo } },
  '/users/groups'               : { 'GET': { auth: loggedinOrDemo } },
  '/trades'                     : { 'GET': { auth: loggedinOrDemo } },
  '/trades/fo/mom'              : { 'GET': { auth: loggedinOrDemo } },
  '/trades/pnl'                 : { 'GET': { auth: loggedinOrDemo } },
  '/transactions'               : { 'GET': { auth: loggedinOrDemo } },
  '/transactions/funds'         : { 'GET': { auth: loggedinOrDemo } },
  '/statement/dates'            : { 'GET': { auth: loggedinOrDemo } },
  '/statement/summary'          : { 'GET': { auth: loggedinOrDemo } },
  '/sprints/trades'             : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio'                  : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio/yoy'              : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio/scripts'          : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio/performance'      : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio/summary'          : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio/symbol'           : { 'GET': { auth: loggedinOrDemo } },

  '/holding-gains/distribution' : { 'GET': { auth: loggedinOrDemo } },
  '/fo/positions'               : { 'GET': { auth: loggedinOrDemo } },


  // Test ENV

  '/zerodha/instruments'     : { 'GET': {} },


  // Chrome Extension

  '/zerodha/ids'             : { 'GET': { auth: loggedinOnly } },
  '/zerodha/session'         : { 'GET': { auth: loggedinOnly } },


  // Web App

  '/user/sets'               : { 'GET': { auth: loggedinOrDemo } },
  '/trades/scripts'          : { 'GET': { auth: loggedinOrDemo } },
  '/trades/about'            : { 'GET': { auth: loggedinOrDemo } },
  '/trades/organized'        : { 'GET': { auth: loggedinOrDemo } },
  '/sprints/summary'         : { 'GET': { auth: loggedinOrDemo } },
  '/sprints/trades-v2'       : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio-v4'            : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio-v4/dates'      : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio-v4/amount'     : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio-v4/amount/set' : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio-v4/pnl'        : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio-v4/pnl-tax'    : { 'GET': { auth: loggedinOrDemo } },
  '/portfolio-v4/fo'         : { 'GET': { auth: loggedinOrDemo } },
  
};
