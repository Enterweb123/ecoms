const cloudinary = require("cloudinary");

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRECT_KEY,
  });
  
  
  const cloudinaryUploadImg = async (upload_file_path) => {
    
    return new Promise( (resolve) => {

      cloudinary.uploader.upload(upload_file_path, (result) => {

        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    } );
  
  };
  
  
  const cloudinaryDeleteImg = async (delete_img_id) => {

    return new Promise((resolve) => {

      cloudinary.uploader.destroy(delete_img_id, (result) => {

        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  };
  
  module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
  