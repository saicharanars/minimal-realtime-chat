
const Sequelize = require("sequelize");
const sequelize = require("../util/database.js");
const { Model } = require('sequelize');


const Group = sequelize.define("group", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  groupname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  owner:{
    type: Sequelize.INTEGER,
    allowNull: false,
  }
  
  
});


// Define the getExpenses function as an instance method



module.exports = Group;