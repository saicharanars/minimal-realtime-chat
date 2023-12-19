const express = require("express");
const path = require('path');
const chatController = require("../controllers/chat");
const AWS = require('aws-sdk');
const auth = require("../middleware/auth");
const { uploadToS3 } = require("../services/s3service");
const multer = require("multer");
const multerS3 = require('multer-s3');
// const { S3Client } = require("@aws-sdk/client-s3");
// const s3 = new S3Client({
//     credentials: {
//         accessKeyId: "AKIA3ATJAGI6FR3NQE53",
//         secretAccessKey: "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",
//          // this is the region that you select in AWS account
//     },
//     region: "ap-south-1",
// })
// const s3Storage = multerS3({
//   s3: s3, // s3 instance
//   bucket: "group-talk", // change it as per your project requirement
//   acl: "public-read", // storage access type
//   metadata: (req, file, cb) => {
//     cb(null, { fieldname: file.fieldname });
//   },
//   key: (req, file, cb) => {
//     const fileName =
//       Date.now() + "_" + file.fieldname + "_" + file.originalname;
//     cb(null, fileName);
//   },
// });
// function sanitizeFile(file, cb) {
//   // Define the allowed extension
//   const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

//   // Check allowed extensions
//   const isAllowedExt = fileExts.includes(
//     path.extname(file.originalname.toLowerCase())
//   );

//   // Mime type must be an image
//   const isAllowedMimeType = file.mimetype.startsWith("image/");

//   if (isAllowedExt && isAllowedMimeType) {
//     return cb(null, true); // no errors
//   } else {
//     // pass error msg to callback, which can be displaye in frontend
//     cb("Error: File type not allowed!");
//   }
// }
// const upload = multer({
//   dest: "uploads/",
//   storage: s3Storage,
//   fileFilter: (req, file, callback) => {
//     sanitizeFile(file, callback);
//   },
//   limits: {
//     fileSize: 1024 * 1024 * 2, // 2mb file size
//   },
  
// });

const router = express.Router();

router.get("/get-chat", chatController.getChat);
router.post(
  "/message",
  auth.authenticate,
  uploadToS3.single("image"),
  chatController.postChat
);
router.get("/get-messages", chatController.getMessages);
//router.post("/upload",auth.authenticate,upload.single('image'), chatController.upload);

module.exports = router;
