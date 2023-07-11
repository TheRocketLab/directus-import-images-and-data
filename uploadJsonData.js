require('dotenv').config()
const fs = require('fs')
const FormData = require('form-data');

// Read data from JSON file
const data = fs.readFileSync('data-sample.json', 'utf-8');
const jsonData = JSON.parse(data);

const username = process.env.DIRECTUS_USERNAME;
const password = process.env.DIRECTUS_PASSWORD;
const endpoint = process.env.DIRECTUS_API_ENDPOINT;
// Replace this with the name of your collection
const collection = 'blog_articles';

const getFileName = (response) => {
  const contentDispositionHeader = response.headers.get('Content-Disposition');
  if (contentDispositionHeader) {
    const fileNameMatch = contentDispositionHeader.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (fileNameMatch && fileNameMatch[1]) {
      const fileName = fileNameMatch[1].replace(/['"]/g, '');
      console.log('File name:', fileName);
      return fileName;
    }
  }
}

const getFileType = (response) => {
  const contentTypeHeader = response.headers.get('Content-Type');
  if (contentTypeHeader) {
    const fileType = contentTypeHeader.split('/').pop();
    console.log('File type:', fileType);
    return fileType;
  }
}

async function authenticate(username, password, endpoint) {
  const { default: fetch } = await import('node-fetch');
  const authUrl = `${endpoint}/auth/login`;
  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: username,
        password: password
      })
    });
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson.data.access_token;
    } else {
      throw new Error(`Authentication failed: ${responseJson.toString()}`);
    }

  } catch (error) {
    console.error(`Fetch Auth error: ${error.message}`);
  }
}

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
    console.error(`Fetch Image error: ${error.message}`);
  }
}

async function uploadJsonData(token, endpoint, collection, jsonData) {
  const { default: fetch } = await import('node-fetch');
  const uploadUrl = `${endpoint}/items/${collection}`;
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jsonData)
    });
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson.data;
    } else {
      throw new Error(`Upload json failed: ${responseJson.error.message}`);
    }
  } catch (error) {
    console.error(`Fetch JSON error: ${error.message}`);
  }
}

(async () => {
  try {
    // Authenticate and get the access token
    const token = await authenticate(username, password, endpoint);
    // Loop through the JSON data
    jsonData.map(async (item) => {
      // Upload the image to Directus
      const imageId = await uploadImageFromUrl(token, endpoint, item.slug, item.feature_image);
      // map the returned image UID to the feature_image property
      const jsonDataWithImage = [{
        ...item,
        feature_image: imageId
      }]

      // Upload the JSON data to the collection
      const uploadedData = await uploadJsonData(token, endpoint, collection, jsonDataWithImage);
      console.log('uploadedData', uploadedData);
    });

    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();