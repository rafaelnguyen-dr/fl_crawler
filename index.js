const binance = require("./src/exchanges/binance");
const { initRedisData } = require("./src/common/services/mock.service");

(async () => {
	// Note that this is for testing only, might remove on production
	await initRedisData();

	const exchanges = [binance];
	exchanges.forEach((exchange) => exchange.startCrawl());
})();
