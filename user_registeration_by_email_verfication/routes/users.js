var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const randomString = require("randomstring");

const { body, validationResult } = require('express-validator');
//import user schema

const Users = require('../models/user_schema');

//immpliment user registration, log in verification and verify by email

router.post('/', [
  body('firstName', "First Name is Required").notEmpty(),
  body('lastName', "Last Name is Required").isString(),
  body('email', "Enter Valid Email").isEmail(),
  body('password', "Enter Password").isLength({ min: 6 }),
  body('password2', "Passwords Do Not Match").custom((value, { req }) => {
    if (value === req.body.password) {
      return true;
    } else {
      return false;
    }
  })
],

  async (req, res) => {
    console.log('yes')
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let { email, firstName, lastName, password } = req.body;
      const user = await Users.findOne({ email: email });

      if (user) {
        return res.status(401).json({ "Error": "User Account Exists" });
      }
      //salt  password
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      password = await bcrypt.hash(password, salt);

      const token = randomString.generate();

      const userData = {
        email, password, lastName, firstName, token
      };
      const newUser = new Users(userData);
      await newUser.save();

      res.status(200).json({ "Success": "User Registered" });

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
        to: `pahalsonu@gmail.com, ${email}`, // list of receivers
        subject: `Hello ${name}! Nodamailer Test`, // Subject line
        html: `
        <p> Thank you for Signing up with us! Here is the Link to verify your email id
        </p> <b><a href='http://hfs.iprashanth.com/users/verify/${token}'> Click Here to Verify </a>  </b>
      `,
      }).then((info) => {
        console.log("Message sent: %s", info.messageId);
        res.redirect('/');
      })

    } catch {
        res.status(500).json({ "Error": "Server Error" });

    }


  }


)


router.all('/example', (req, res) => {
  console.log(req.method)
  res.send(req.body);
})

module.exports = router;
