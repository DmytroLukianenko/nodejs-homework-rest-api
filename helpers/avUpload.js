const path = require('path')
const multer = require('multer')

const uploadDirect = path.join(process.cwd(), 'temp')
const uploadOptions = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirect)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
  limits: {
    fileSize: 1200000,
  },
})

const uploadMiddleware = multer({
  storage: uploadOptions,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true)
      return
    }
    cb(null, false)
  },
})

module.exports = uploadMiddleware
