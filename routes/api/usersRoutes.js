const express = require('express')
const router = express.Router()
const userControllers = require('../../controllers/usersComtrollers')
const { userValidation } = require('../../validation/validation')
const guard = require('../../helpers/guard')

router.post('/registration', userValidation, userControllers.registration)
router.post('/login', userValidation, userControllers.login)
router.post('/logout', guard, userControllers.logout)
router.get('/current', guard, userControllers.currentUser)

module.exports = router