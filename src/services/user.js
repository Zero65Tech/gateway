function auth(req, session) {
  if(!session)
    return false;
  req.query.sessionId = session.id;
  return true;
}

module.exports = {
  '/session'      : { 'GET': { auth: auth }, 'POST': {} },
  '/google-login' : { 'POST': {} }
}