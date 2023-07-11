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
    console.log('responseJson', responseJson)
    if (response.ok) {
      return responseJson.data;
    } else {
      throw new Error(`Upload JSON failed: ${responseJson.error.message}`);
    }
  } catch (error) {
    console.error(`Fetch JSON error: ${error.message}`);
  }
}

exports.uploadJsonData = uploadJsonData;
