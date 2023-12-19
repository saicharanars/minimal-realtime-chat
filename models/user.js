
const Sequelize = require("sequelize");
const sequelize = require("../util/database.js");
const { Model } = require('sequelize');


const Groupuser = sequelize.define("groupuser", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phonenumber:{
    type:Sequelize.STRING,
    allowNull:false,
  }
  
});


// Define the getExpenses function as an instance method



module.exports = Groupuser;