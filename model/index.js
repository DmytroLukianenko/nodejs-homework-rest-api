const Contact = require('./Schemas/schema')

const listContacts = async () => {
  const contactsList = await Contact.find({})
  return contactsList
}

const getContactById = async contactId => {
  const contact = await Contact.findById(contactId)
  return contact
}

const removeContact = async contactId => {
  const removedContact = await Contact.findByIdAndDelete(contactId)
  return removedContact
}

const addContact = async body => {
  const newContact = await Contact.create(body)
  return newContact
}

const updateContact = async (contactId, body) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, { new: true })
  return updatedContact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
