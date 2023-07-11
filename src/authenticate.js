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
    console.error(`Fetch auth error: ${error.message}`);
  }
}

exports.authenticate = authenticate;
