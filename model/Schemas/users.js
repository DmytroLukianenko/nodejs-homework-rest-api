const mongoose = require('mongoose')
const bCrypt = require('bcryptjs')
const { Schema, model } = mongoose
// const gravatar = require('gravatar')
const SALT_FACTOR = 10
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    minlength: 3,
    maxlength: 50,
    validate(value) {
      const re = /\S+@\S+\.\S+/
      return re.test(String(value).toLowerCase())
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: String,
  avatarURL: String,
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bCrypt.hash(this.password, bCrypt.genSaltSync(SALT_FACTOR))
  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bCrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = User
