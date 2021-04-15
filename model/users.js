const User = require('./Schemas/users')

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email })
  return user
}

const findUserById = async (id) => {
  const user = User.findById({ _id: id })
  return user
}

const createNewUser = async ({ email, password, subscription, token, avatarURL, verifyToken }) => {
  const user = await new User({ email, password, subscription, token, avatarURL, verifyToken }).save()
  return user
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const modifySubscription = async (id, subscription) => {
  const user = await User.findByIdAndUpdate(id, { subscription: subscription }, { new: true })
  return user
}

const updateAvatar = async (id, url) => {
  return await User.updateOne({ _id: id }, { avatarURL: url })
}

const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken })
}

const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.findByIdAndUpdate(id, { verify, verifyToken })
}

module.exports = {
  findUserByEmail,
  findUserById,
  createNewUser,
  updateToken,
  modifySubscription,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken
}
