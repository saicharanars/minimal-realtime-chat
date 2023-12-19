const AWS = require('aws-sdk');
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require('multer-s3');
const path = require('path');
require('dotenv').config();
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
         // this is the region that you select in AWS account
    },
    region: "ap-south-1",
})
console.log(s3)
const s3Storage = multerS3({
  s3: s3,
  bucket: "group-talk",
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName =
      Date.now() + "_" + file.fieldname + "_" + file.originalname;
    cb(null, fileName);
  },
});

function sanitizeFile(file, cb) {
  const fileExts = [".png", ".jpg", ".jpeg", ".gif"];
  const isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );
  const isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true);
  } else {
    cb("Error: File type not allowed!");
  }
}

const upload = multer({
  dest: "uploads/",
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2mb file size
  },
});

module.exports = {
  uploadToS3: upload,
};
