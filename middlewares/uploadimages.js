const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");


// 🔴 create storage - in server
const storage = multer.diskStorage({
 
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/images/"));
  },

  filename: function (req, file, callback) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});


// 🔴 create fileter - conform allow only images
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback({ message: "Unsupported file format" }, false);
  }
};

// 🔴 file uploaded
const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});


// 🔴 re-size product image - create file uploading path
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      fs.unlinkSync(`public/images/products/${file.filename}`);
    })
  );
  next();
};


// 🔴 re-size blog image - create file uploading path
const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
      fs.unlinkSync(`public/images/blogs/${file.filename}`);
    })
  );
  next();
};
module.exports = { uploadPhoto, productImgResize, blogImgResize };
