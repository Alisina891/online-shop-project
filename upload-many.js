const cloudinary = require('./lib/cloudinary');
const path = require('path');

async function uploadOne(file) {
  try {
    const result = await cloudinary.uploader.upload(path.resolve(file), {
      folder: 'my_folder',
    });
    console.log('✅ Uploaded:', result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error('❌ Failed:', file, err.message);
  }
}

// دانه‌به‌دانه







