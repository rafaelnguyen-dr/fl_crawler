require("dotenv").config();

const getEnv = (key, ignore = false) => {
	const value = process.env[key];
	if (!ignore && value === undefined) {
		console.log(`[ENV] ${key} not found!`);
	}
	return value;
};

/**------------------------DATABASE---------------------------*/
const PGHOST = getEnv("PGHOST");
const PGPORT = getEnv("PGPORT");
const PGUSER = getEnv("PGUSER");
const PGPASSWORD = getEnv("PGPASSWORD");
const PGDATABASE = getEnv("PGDATABASE");

/**------------------------REDIS---------------------------*/
const REDIS_HOST = getEnv("REDIS_HOST");
const REDIS_PORT = getEnv("REDIS_PORT");

/**------------------------API---------------------------*/
const API_ENDPOINT = getEnv("API_ENDPOINT");

/**------------------------BINANCE---------------------------*/
// Socket
const BINANCE_WEBSOCKET_ENDPOINT = getEnv("BINANCE_WEBSOCKET_ENDPOINT");
const BINANCE_WEBSOCKET_ENDPOINT_FUTURE = getEnv(
	"BINANCE_WEBSOCKET_ENDPOINT_FUTURE"
);
const BINANCE_WEBSOCKET_ENDPOINT_TESTNET = getEnv(
	"BINANCE_WEBSOCKET_ENDPOINT_TESTNET"
);

// Rest Api
const BINANCE_API_SPOT = getEnv("BINANCE_API_SPOT");
const BINANCE_API_FUTURES = getEnv("BINANCE_API_FUTURES");
const BINANCE_API_FUTURES_TESTNET = getEnv("BINANCE_API_FUTURES_TESTNET");

module.exports = {
	PGHOST,
	PGPORT,
	PGUSER,
	PGPASSWORD,
	PGDATABASE,
	REDIS_HOST,
	REDIS_PORT,
	API_ENDPOINT,
	BINANCE_WEBSOCKET_ENDPOINT,
	BINANCE_WEBSOCKET_ENDPOINT_FUTURE,
	BINANCE_WEBSOCKET_ENDPOINT_TESTNET,
	BINANCE_API_SPOT,
	BINANCE_API_FUTURES,
	BINANCE_API_FUTURES_TESTNET,
};
