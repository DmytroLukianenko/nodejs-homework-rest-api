const express = require('express')
const router = express.Router()
const userControllers = require('../../controllers/usersComtrollers')
const { userValidation } = require('../../validation/validation')
const guard = require('../../helpers/guard')
const uploadMiddleware = require('../../helpers/avUpload')


router.post('/registration', userValidation, userControllers.registration)
router.post('/login', userValidation, userControllers.login)
router.post('/logout', guard, userControllers.logout)
router.get('/current', guard, userControllers.currentUser)
router.patch('/avatars', [guard, uploadMiddleware.single('avatar')], userControllers.avatar)
router.get('/verify/:verificationToken', userControllers.verify)
router.post('/verify', userControllers.resend)

module.exports = router