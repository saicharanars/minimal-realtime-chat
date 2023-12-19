const CronJob = require("cron").CronJob;
const Sequelize = require("sequelize");
const sequelize = require("../util/database.js");
const Chat = require("../models/chat");
const archivechat = require("../models/archivedchats");

const job = new CronJob("0 0 * * *", async () => {
  try {
    const daybefore = new Date(Date.now - 24 * 60 * 60 * 1000);
    const chats = await Chat.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: daybefore,
        },
      },
    });
    const archive = await archivechat.bulkCreate(chats);
    const destroy = await Chat.destroy({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: daybefore,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = job;
