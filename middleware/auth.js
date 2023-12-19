const jwt = require("jsonwebtoken");

const User = require("../models/user");
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token)
  const user = await jwt.verify(token, "hgtyf1f51ge5ef555sb1f5");
  project = await User.findOne({ where: { id: user.userid } });
  if (project.dataValues.id === user.userid) {
    req.user = project.dataValues;
    console.log(req.user, "user from auth js");
    next();
  } else {
    console.log("Not found!");
    return res.status(401).json({ error: "Authentication failed" });
  }
};