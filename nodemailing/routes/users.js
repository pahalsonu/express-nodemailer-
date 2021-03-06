var express = require('express');
const nodemailer = require("nodemailer");
const config = require('../config/default.json');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/contact', async (req, res) => {
  const { choice, name, email, service, budget, message } = req.body;


  let transporter = nodemailer.createTransport({
    
    host: "mail.pahalsonu.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    }
  });
  
  transporter.sendMail({
    from: '"pahal" <pahal@pahalsonu.com>', // sender address
    to: `iprash011@gmail.com, ${email}`, // list of receivers
    subject: `Hello ${name}! Nodamailer Test`, // Subject line
    html: `<b>Hello I am Sonu Pahal</b> <br />
        <p> My Email ID is : ${email} </p>
        <p> My Choice is test nodemailer test for this app: ${choice} </p>
        <p> I am looking for your response, reply on same mail   : ${service} </p>
        <p> within this this week.(neglect these form variables)  : ${budget} </p>
        <br />
        <p> Remarks : ${message}</p>
    `,
  }).then((info) => {
    console.log("Message sent: %s", info.messageId);
    res.redirect('/');
  })
    .catch((err) => {
      console.error(err);
    })
});

module.exports = router;