
const Sequelize = require("sequelize");
const sequelize = require("../util/database.js");
const { Model } = require('sequelize');


const Chat = sequelize.define("chat", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageurl:{
    type: Sequelize.STRING,
    allowNull: true,
  }
  
  
});


// Define the getExpenses function as an instance method



module.exports = Chat;