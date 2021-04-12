const passport = require('passport')
require('../bin/config/passport')
const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null

    if (err || !user || token !== user.token) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
