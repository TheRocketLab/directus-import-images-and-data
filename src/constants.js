require('dotenv').config()

const username = process.env.DIRECTUS_USERNAME;
const password = process.env.DIRECTUS_PASSWORD;
const endpoint = process.env.DIRECTUS_API_ENDPOINT;
const collection = process.env.DIRECTUS_COLLECTION;

exports.username = username;
exports.password = password;
exports.endpoint = endpoint;
exports.collection = collection;