// const fs = require('fs/promises')
const fs = require('fs')
const path = require('path')
const { nanoid } = require('nanoid')
const { promises: fsPromises } = fs

const contacts = path.join(__dirname, './contacts.json')

const listContacts = async () => {
  return JSON.parse(await fsPromises.readFile(contacts, 'utf-8'))
}

const getContactById = async (contactId) => {
  const list = await listContacts()
  return list.filter((item) => item.id === contactId)
}

const removeContact = async (contactId) => {
  const list = await listContacts()
  const result = list.filter((item) => item.id !== contactId)
  await fsPromises.writeFile(contacts, JSON.stringify(result))
}

const addContact = async (body) => {
  const list = await listContacts()
  const newUser = { id: nanoid(), ...body }
  await fsPromises.writeFile(contacts, JSON.stringify([...list, newUser]))
  return newUser
}
const updateContact = async (contactId, body) => {
  const list = await listContacts()
  const contactIndex = list.findIndex((user) => String(user.id) === contactId)
  if (contactIndex === -1) {
    return null
  }
  list[contactIndex] = { ...list[contactIndex], ...body }
  console.log(list[contactIndex])
  await fsPromises.writeFile(contacts, JSON.stringify([...list]))
  return list[contactIndex]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
