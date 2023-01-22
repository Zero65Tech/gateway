function authGet(req, session) {
  if(!session)
    return false;
  req.query.sessionId = session.id;
  return true;
}

function authPost(req, session) {
  if(!session || session != 'active')
    return false;
  req.body.sessionId = session.id;
  return true;
}

module.exports = {
  '/session'      : { 'GET': { auth: authGet }, 'POST': {} },
  '/google-login' : { 'POST': { auth: authPost } }
}