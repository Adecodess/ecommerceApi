const nodemailer = require('nodemailer');

const user = process.env.USER_SECRET;
const pass = process.env.USER_PASSWORD;

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log('Check');
  console.log(name, email, confirmationCode, user, pass);

  transport
    .sendMail({
      from: user,
      to: email,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for registring. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:8080/confirm/${confirmationCode}> Click here</a>
        </div>`,
    })
    .then(() => {
      console.log('Email sent');
    })
    .catch((err) => console.log(err));
};
