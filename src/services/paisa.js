function auth(req, session) {
  if(session && session.status == 'loggedin')
    req.query.userId = session.user.id;
  else
    req.query.userId = '#demo';
  return true;
}



module.exports = {
  '/fys'              : { 'GET': { auth: auth } },
  '/accounts'         : { 'GET': { auth: auth } },
  '/accounts/summary' : { 'GET': { auth: auth } },
  '/sources'          : { 'GET': { auth: auth } },
  '/itr'              : { 'GET': { auth: auth } },
  '/heads'            : { 'GET': { auth: auth } },
  '/heads/yoy'        : { 'GET': { auth: auth } },
  '/heads/filter'     : { 'GET': { auth: auth } },
  '/transactions'     : { 'GET': { auth: auth } },
};
