
const Sequelize = require("sequelize");
const sequelize = require("../util/database.js");


const archivedChat = sequelize.define("archivedChat", {
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



module.exports = archivedChat;