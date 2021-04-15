const Mailgen = require('mailgen')
const nodemailer = require('nodemailer')
require('dotenv').config()

const config = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'craigadlert@gmail.com',
    pass: 'password generated in google acc',
  },
}
const transporter = nodemailer.createTransport(config)

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Developer of this server',
    link: 'https://localhost:3000/',
  },
})

const sendMail = async (verifyToken, email) => {
  const template = {
    body: {
      name: email,
      intro: 'Email verification',
      action: {
        instructions: 'Please conform your email address to keep using our services',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Confirm email',
          link: `http://localhost:3000/api/users/verify/${verifyToken}`,
        },
      },
      outro: "Need help, or have questions? Please figure it out yourselves, we can't be bothered to help you",
    },
  }

  const verificationMail = mailGenerator.generate(template)

  const emailOptions = {
    from: 'craigadlert@gmail.com',
    to: email,
    subject: 'Email verification',
    html: verificationMail,
  }

  await transporter.sendMail(emailOptions)
}

module.exports = sendMail
