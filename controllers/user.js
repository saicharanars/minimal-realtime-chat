const path = require("path");
const rootDir = path.dirname(__dirname);
const Users = require("../models/user");
const Group = require("../models/groups");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  try {
    //const { name, email, phone } = req.body;
    const Username = req.body.username;
    const Email = req.body.email;
    const Password = req.body.password;
    const Phonenumber = req.body.phonenumber;
    console.log(Username, Email, Password);
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(Password, 10);
    const [user, created] = await Users.findOrCreate({
      where: { email: Email },
      defaults: {
        username: Username,
        password: hashedPassword,
        phonenumber: Phonenumber,
      },
    });
    if (!created) {
      res
        .status(200)
        .json({ users: "email already used", emailexist: created }); // This will certainly be 'Technical Lead JavaScript'
    } else {
      res.status(200).json({ users: user, emailexist: created });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

exports.getSignup = async (req, res, next) => {
  console.log(rootDir,"gugfygtyfd");
  res.sendFile(path.join(rootDir, "views", "signup.html"));
};
exports.getLogin = async (req, res, next) => {
    console.log(rootDir,"gugfygtyfd");
  res.sendFile(path.join(rootDir, "views", "login.html"));
};
exports.postLogin = async (req, res, next) => {
  try {
    const Email = req.body.email;
    const Password = req.body.password;
    //console.log(Email, Password);
    console.log(req.body);

    const emailfind = await Users.findOne({
      where: {
        email: Email,
      },
      include: Group,
    });

    console.log(emailfind, "emailfind");
    function jwtToken() {
      return jwt.sign(
        {
          useremail: emailfind.email,
          userid: emailfind.id,
        },
        "hgtyf1f51ge5ef555sb1f5"
      );
    }

    if (!emailfind) {
      res.status(404).json({ users: "email not exits please signup" });
    } else {
      const resp = await bcrypt.compare(Password, emailfind.password);

      if (resp) {
        
        res
          .status(200)
          .json({
            login: resp,
            data:  emailfind ,
            token: jwtToken(),
          });
      } else {
        res.status(401).json({ login: "check your password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};
