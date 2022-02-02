const { OAuth2Client } = require('google-auth-library');

const oAuth2Client = new OAuth2Client();

const userAccess = {
  'antshpra@gmail.com':        ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'gshiv009@gmail.com':        ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'nextshivendra@gmail.com':   ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'shivendraec1088@gmail.com': ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'gupta.disha30@gmail.com':   ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'kiteswear.jbp@gmail.com':   ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'cloud-run@zero65.iam.gserviceaccount.com': ['LV0248', 'IQ6382', 'NH6133', 'AJ8534']
}

async function auth(req) {
  let token = req.headers.authorization;
  if(token && token.startsWith('Bearer ')) {
    let email = (await oAuth2Client.getTokenInfo(token.substring('Bearer '.length))).email;
    return email && userAccess[email] && userAccess[email].indexOf(req.query.userId) != -1;
  }
  return false;
}

module.exports = {
  '/session': {
    'GET': { auth: auth }
  },
  '/enctoken': {
    'GET': { auth: auth }
  }
}