// socket
const Crawler = require("../crawler");
const BinaceWebSocket = require("./binance.websocket");

const startCrawl = async () => {
	const crawler = new Crawler(BinaceWebSocket, "binance", "FUTURE");
	crawler.run();
};

module.exports = {
	startCrawl,
};
