function authGet(req, session) {
  if(!session)
    return false;
  req.query.id = session.id;
  return true;
}

function authPost(req, session) {
  if(!session || session.status != 'active')
    return false;
  req.body.sessionId = session.id;
  return true;
}

module.exports = {
  '/session'      : {
    'GET': { auth: authGet },
    'POST': { auth: (req, session) => session == undefined }
  },
  '/google-login' : { 'POST': { auth: authPost } }
}