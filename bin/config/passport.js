const passport = require('passport')
const passportJWT = require('passport-jwt')
require('dotenv').config()
const { findUserById } = require('../../model/users')

const ExtractJWT = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy

const { SUPER_SECRET_KEY } = process.env

const params = {
  secretOrKey: SUPER_SECRET_KEY,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await findUserById(payload.id)
      if (!user) {
        return done(new Error('User not found'))
      }
      if (!user.token) {
        return done(null, false)
      }
      return done(null, user)
    } catch (err) {
      done(err)
    }
  }),
)
