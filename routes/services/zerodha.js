const userAccess = {
  'antshpra@gmail.com':        ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'gshiv009@gmail.com':        ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'nextshivendra@gmail.com':   ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'shivendraec1088@gmail.com': ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'gupta.disha30@gmail.com':   ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'kiteswear.jbp@gmail.com':   ['LV0248', 'IQ6382', 'NH6133', 'AJ8534'],
  'cli-prashant@zero65.iam.gserviceaccount.com': ['LV0248', 'IQ6382', 'NH6133', 'AJ8534']
}

module.exports = {
  '/session': {
    'GET': {
      auth: (email, params) => {
        return email && userAccess[email] && userAccess[email].indexOf(params.userId) != -1;
      }
    }
  },
  '/enctoken': {
    'GET': {
      auth: (email, params) => {
        return email && userAccess[email] && userAccess[email].indexOf(params.userId) != -1;
      }
    }
  }
}