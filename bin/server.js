const app = require('../app')
// const dbConnection = require('../model/db')
const PORT = process.env.PORT || 3000

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const { DB_HOST } = process.env

mongoose.Promise = global.Promise
const dbConnection = mongoose.connect(DB_HOST, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

dbConnection.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`)
  })
}).catch((err) => {
  console.log(`Server not running. Error message: ${err.message}`)
  process.exit(1)
})
