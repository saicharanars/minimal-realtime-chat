const path = require("path");
const rootDir = path.dirname(__dirname);
const Chat = require("../models/chat");
const { Op } = require("sequelize");
const multer = require("multer");
const { uploadToS3 } = require("../services/s3service");
const upload = multer({ dest: "uploads/" });

exports.getChat = async (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "chat.html"));
};
exports.postChat = async (req, res, next) => {
  try {
    //const { name, email, phone } = req.body;
    //console.log("Request Body:", req.body);
    //console.log("Request File:", req.file);
    //console.log(req.user);
    //console.log(req.body);
    const message = req.body.message;
    const groupid = req.body.groupid;

    const userId = req.user.id;
    console.log(userId);
    //console.log(image);
    //console.log(req.file.location, "filekru>>>>>>");
    //const { image } = req.file;

    //const s3response = await uploadToS3(image.path, image.filename);
    if (!req.file) {
      const data = await Chat.create({
        message: message,
        groupuserId: userId,
        groupId: groupid,

        //imageUrl: s3response,
      });
      console.log(data);
      res
        .status(200)
        .json({ message: "success", data: data, username: req.user.username });
    } else {
      const image = req.file.location;
      const data = await Chat.create({
        message: message,
        groupuserId: userId,
        groupId: groupid,
        imageurl: image,
        //imageUrl: s3response,
      });
      console.log(data);
      res
        .status(200)
        .json({ message: "success", data: data, username: req.user.username });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};
exports.getMessages = async (req, res, next) => {
  try {
    const lastmessageid = req.query.after;
    //console.log(lastReceivedTimestamp)
    const resp = await Chat.findAll({
      where: { id: { [Op.gt]: lastmessageid } },
      attributes: ["id", "message"],
    });
    console.log(resp);
    res.status(200).json({ message: "success", data: resp });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};
