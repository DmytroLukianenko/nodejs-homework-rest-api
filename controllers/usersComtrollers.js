const jwt = require('jsonwebtoken')
require('dotenv').config()
const {
  findUserByEmail,
  findUserById,
  createNewUser,
  updateToken,
} = require('../model/users')

const { SUPER_SECRET_KEY } = process.env

const registration = async (req, res, next) => {
  const { email } = req.body
  const user = await findUserByEmail(email)
  if (user) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: 'Email already in use',
      data: 'Email conflict',
    })
  }
  try {
    const newUser = await createNewUser(req.body)
    await newUser.save()
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
        message: 'Registration successful',
      },
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await findUserByEmail(email)

    if (!user || !(await user.validPassword(password))) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Wrong email or password',
        data: null,
      })
    }
    const payload = { id: user._id }

    const token = jwt.sign(payload, SUPER_SECRET_KEY, { expiresIn: '1h' })

    await updateToken(payload.id, token)

    res.json({
      status: 'success',
      code: 200,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    const id = req.user.id
    await updateToken(id, null)

    return res.status(204).json({})
  } catch (err) {
    next(err)
  }
}

const currentUser = async (req, res, next) => {
  try {
    const { id, email, subscription } = req.user
    const user = await findUserById(id)
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Not authorized',
      })
    }

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        email,
        subscription,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registration,
  login,
  currentUser,
  logout,

}
