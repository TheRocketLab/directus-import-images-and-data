const FormData = require('form-data');
const { getFileType, getFileName } = require('./utils');

async function uploadImageFromUrl(token, endpoint, slug, imageUrl) {
  const { default: fetch } = await import('node-fetch');
  const uploadUrl = `${endpoint}/files`;
  
  // Download the image from the URL
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.buffer();

  // Create form data with the image blob
  const formData = new FormData();
  const fileType = getFileType(imageResponse);
  const fileName = getFileName(imageResponse) || slug + '.' + fileType;
  formData.append('file', imageBuffer, { filename: fileName });

  try {
    // Upload the image to Directus
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
  
    const responseJson = await response.json();
    if (response.ok) {
      const fileId = responseJson.data.id;
  
      return fileId;
  
    } else {
      throw new Error(`Upload image failed: ${responseJson.error.message}`);
    }
  } catch (error) {
    console.error(`Fetch image error: ${error.message}`);
  }
}

exports.uploadImageFromUrl = uploadImageFromUrl;
