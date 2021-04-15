const jwt = require('jsonwebtoken')
const path = require('path')
const gravatar = require('gravatar')
const Jimp = require('jimp')
const fs = require('fs')
require('dotenv').config()
const {
  findUserByEmail,
  findUserById,
  createNewUser,
  updateToken,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken
} = require('../model/users')
const {
  downloadAvatarFromUrl,
  saveAvatarToStatic,
  deletePreviousAvatar,
} = require('../utils/create-avatar')
const { nanoid } = require('nanoid')
const sendMail = require('../utils/mailSendler')

// const createFolderIsNotExist = require('../helpers/creat-folder')

const { SUPER_SECRET_KEY } = process.env
// const uploadDirectory = path.join(process.cwd(), UPLOADDIR)

const registration = async (req, res, next) => {
  try {
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
    const verifyToken = nanoid()
    const newUser = await createNewUser({ ...req.body, verifyToken })
    await sendMail(verifyToken, email)

    const { tmpPath, nameAvatar } = await downloadAvatarFromUrl(newUser)
    const avatarURL = await saveAvatarToStatic(newUser.id, tmpPath, nameAvatar)
    await updateAvatar(newUser.id, avatarURL)

    res.status(201).json({
      status: 'success',
      code: 200,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
      },
    })
  } catch (err) {
    next(err)
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

    const token = jwt.sign(payload, SUPER_SECRET_KEY, { expiresIn: '5h' })

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

// const patch = async (req, res, next) => {
//   try {
//     const { subscription } = req.body
//     const subOptions = Object.values(Subscription)
//     if (!subOptions.includes(subscription)) {
//       return res.status(400).json({
//         status: 'error',
//         code: 400,
//         message: `invalid subscription, must be one of the following: ${subOptions}`,
//       })
//     }
//     const user = await patchSub(req.user.id, subscription)
//     return res.status(200).json({
//       status: 'success',
//       code: 200,
//       message: `subscription changed to ${subscription}`,
//       data: {
//         email: user.email,
//         subscription: user.subscription,
//       },
//     })
//   } catch (err) {
//     next(err)
//   }
// }

const avatar = async (req, res, next) => {
  try {
    const id = req.user.id

    const pathFile = req.file.path

    const fileName = `${Date.now()}-${req.file.originalname}`

    const newAvatarUrl = await saveAvatarToStatic(id, pathFile, fileName)

    await updateAvatar(id, newAvatarUrl)

    await deletePreviousAvatar(req.user.avatarURL)

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: { newAvatarUrl },
    })
  } catch (err) {
    next(err)
  }
}

const verify = async (req, res, next) => {
  try {
    const result = await findByVerifyToken(req.params.verificationToken)
    await updateVerifyToken(result.id, true, null)
    if (result) {
      return res.status(200).json({
        Status: '200 OK',
        code: '200',
        ResponseBody: {
          message: 'Verification successful',
        },

      })
    } else {
      return next({
        Status: '404 Not Found',
        ResponseBody: {
          message: 'User not found'
        }
      })
    }
  } catch (error) {
    next(error)
  }
}

const resend = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing required field email',
      })
    }
    const user = await findUserByEmail(email)
    if (user.verify) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Verification has already been passed',
      })
    }
    const verifyToken = user.verifyToken
    await sendMail(verifyToken, email)

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Verification email sent',
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
  avatar,
  verify,
  resend
}
