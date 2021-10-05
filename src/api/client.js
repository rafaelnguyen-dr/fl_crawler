const axios = require("axios");

require("dotenv").config();

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
};
const client = axios.create({
	baseURL: API_ENDPOINT,
	headers,
});

module.exports = client;
