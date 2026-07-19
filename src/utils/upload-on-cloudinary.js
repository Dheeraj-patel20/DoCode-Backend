import cloudinary from "./cloudinary.js";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "docode/avatars",
    });

    // Delete the temporary file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
  console.error("Cloudinary Error:", error);

  if (localFilePath && fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }

  return null;
}
};

export default uploadOnCloudinary;