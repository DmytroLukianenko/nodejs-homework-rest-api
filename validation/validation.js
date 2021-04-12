const Joi = require('joi')

module.exports.userValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).max(18).required(),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    const [{ message }] = error.details
    return res.status(400).json({
      statusMessage: 'Error',
      data: {
        message,
        status: 400,
      },
    })
  }
  next()
}
