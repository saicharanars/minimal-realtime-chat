
const Sequelize = require("sequelize");
const sequelize = require("../util/database.js");
const { Model } = require('sequelize');


const GroupMember = sequelize.define("groupmember", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  
});


// Define the getExpenses function as an instance method



module.exports = GroupMember;