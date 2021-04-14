const User = require('./Schemas/users')

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email })
    return user
}

const findUserById = async (id) => {
    const user = User.findById({ _id: id })
    return user
}

const createNewUser = async ({ email, password, subscription, token }) => {
    const user = await new User({ email, password, subscription, token }).save()
    return user
}

const updateToken = async (id, token) => {
    return await User.updateOne({ _id: id }, { token })
}

const modifySubscription = async (id, subscription) => {
    const user = await User.findByIdAndUpdate(id, { subscription: subscription }, { new: true })
    return user
}

module.exports = {
    findUserByEmail,
    findUserById,
    createNewUser,
    updateToken,
    modifySubscription,
}
