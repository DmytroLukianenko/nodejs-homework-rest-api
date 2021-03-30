const mongoose = require('mongoose')
const { Schema, model } = mongoose

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  phone: {
    type: String,
    minlength: 5,
    maxlength: 20,
  },
  subscription: {
    type: String,
    required: [true, 'Subscription is required'],
    minlength: 3,
    maxlength: 50,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    maxlength: 20,
  },
  token: {
    type: String,
    default: '',
  },
},
{ versionKey: false, timestamps: true },
)
const Contact = new model('contact', contactSchema)

module.exports = Contact
