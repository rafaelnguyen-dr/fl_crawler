// Borrowed: https://github.com/binance/binance-websocket-examples/blob/master/src/lib/requestClient.js

const crypto = require("crypto");
const getRequestInstance = require("../../api/getRequestInstance");
const {
	BINANCE_API_SPOT,
	BINANCE_API_FUTURES,
} = require("../../config/secrets");

const publicRequest = () =>
	getRequestInstance({
		headers: {
			"content-type": "application/json",
		},
	});

const spotPublicRequest = () =>
	getRequestInstance({
		baseURL: BINANCE_API_SPOT,
		headers: {
			"content-type": "application/json",
		},
	});

const buildQueryString = (q) =>
	q
		? `?${Object.keys(q)
				.map(
					(k) =>
						`${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`
				)
				.join("&")}`
		: "";

const privateRequest =
	(apiKey, apiSecret, baseURL) =>
	(method = "GET", path, data = {}) => {
		if (!apiKey) {
			throw new Error("API key is missing");
		}

		if (!apiSecret) {
			throw new Error("API secret is missing");
		}

		const timestamp = Date.now();

		const signature = crypto
			.createHmac("sha256", apiSecret)
			.update(buildQueryString({ ...data, timestamp }).substr(1))
			.digest("hex");

		return getRequestInstance({
			baseURL,
			headers: {
				"content-type": "application/json",
				"X-MBX-APIKEY": apiKey,
			},
			method,
			url: path,
		});
	};

const publicDataRequest =
	(apiKey, baseURL) =>
	(method = "GET", path, data = {}) => {
		if (!apiKey) {
			throw new Error("API key is missing");
		}

		return getRequestInstance({
			baseURL,
			headers: {
				"content-type": "application/json",
				"X-MBX-APIKEY": apiKey,
			},
			method,
			url: path,
		});
	};

const spotMarketDataRequest = (apiKey, baseURL = BINANCE_API_SPOT) =>
	publicDataRequest(apiKey, baseURL);

const spotPrivateRequest = (apiKey, apiSecret, baseURL = BINANCE_API_SPOT) =>
	privateRequest(apiKey, apiSecret, baseURL);

const futuresPrivateRequest = (
	apiKey,
	apiSecret,
	baseURL = BINANCE_API_FUTURES
) => privateRequest(apiKey, apiSecret, baseURL);

const deliveryFuturesPrivateRequest = (apiKey, apiSecret, testnet) => {
	let baseURL = "https://dapi.binance.com";
	if (testnet) {
		baseURL = "https://testnet.binancefuture.com";
	}
	return privateRequest(apiKey, apiSecret, baseURL);
};

module.exports = {
	publicRequest,
	privateRequest,
	spotPublicRequest,
	spotPrivateRequest,
	spotMarketDataRequest,
	futuresPrivateRequest,
	deliveryFuturesPrivateRequest,
};
