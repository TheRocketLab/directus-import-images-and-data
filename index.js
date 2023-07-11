const { username, password, endpoint, collection } = require('./src/constants');
const fs = require('fs')
const { authenticate } = require('./src/authenticate');
const { uploadImageFromUrl } = require('./src/uploadImageFromUrl');
const { uploadJsonData } = require('./src/uploadJsonData');

// Read data from JSON file
const data = fs.readFileSync('./data/data-sample.json', 'utf-8');
const jsonData = JSON.parse(data);

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
