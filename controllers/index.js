
const Contacts = require('../model/')

const getContactsList = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()

    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getContactByID = async (req, res, next) => {
  try {
    const { contactId } = req.params

    const contact = await Contacts.getContactById(contactId)

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const addContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body
    const reqFields = ['name', 'email', 'phone']
    if (!name || !email || !phone) {
      const errorMsg = reqFields.filter(item => !Object.keys(req.body).includes(item))
      return res.status(400).json({
        status: 'error',
        code: 400,
        data: { message: `missing required ${errorMsg} field` },
      })
    } else {
      const contact = await Contacts.addContact(req.body)

      return res.status(201).json({
        status: 'success',
        code: 201,
        data: {
          contact,
        },
      })
    }
  } catch (error) {
    next(error)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId)

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: { message: 'contact deletd' },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        data: { message: 'missing fields' },
      })
    }

    const contact = await Contacts.updateContact(req.params.contactId, req.body)

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getContactsList,
  getContactByID,
  addContact,
  removeContact,
  updateContact,
}
