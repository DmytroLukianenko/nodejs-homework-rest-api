const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/index')

router.get('/', controllers.getContactsList)

router.get('/:contactId', controllers.getContactByID)

router.post('/', controllers.addContact)

router.delete('/:contactId', controllers.removeContact)

router.patch('/:contactId', controllers.updateContact)

module.exports = router
