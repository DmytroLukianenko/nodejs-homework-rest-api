const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const { DB_HOST } = process.env
const dbConnection = mongoose.connect(DB_HOST, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
  console.log('Database connection successful')
})

mongoose.connection.on('error', (err) => {
  console.log(`Database connection error: ${err.message}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected')
})

process.on('SIGINT', async () => {
  console.log('Connection for DB closed and app terminated')
  mongoose.connection.close(() => {
    process.exit(1)
  })
})

module.exports = dbConnection
