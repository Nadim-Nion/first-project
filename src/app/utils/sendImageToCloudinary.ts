import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import config from '../config';

// Configuration
cloudinary.config({
  cloud_name: `${config.cloudinary_cloud_name}`,
  api_key: `${config.cloudinary_api_key}`,
  api_secret: `${config.cloudinary_api_secret}`,
});

export const sendImageToCloudinary = async (
  path: string,
  imageName: string,
) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });

  console.log('Cloudinary result:', uploadResult);

  // Delete file named from path
  fs.unlink(path, (err) => {
    if (err) {
      console.error('An error occurred:', err);
    } else {
      console.log('File deleted successfully!');
    }
  });

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url('shoes', {
    fetch_format: 'auto',
    quality: 'auto',
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url('shoes', {
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);

  return uploadResult;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
