const { getAsync, setAsync } = require("../../redis");

const initRedisData = async () => {
	const mockData = {
		binance: [
			{
				userId: "dc33d500-011f-4fc3-9f6a-bf86deb6c2e8",
				exchange_name: "binance",
				key: "4aed215a0437b7ddf330c9f87bc086b769d58ecf42750d397b99153ab58a7096",
				secret_key:
					"a44cbdb207342c07cf4671cf2f5af774bd5f49fec2eff6f30021c2ac7cd300e3",
				last_time_executed: new Date(),
				is_leader: true,
			},
		],
	};

	const available_exchanges = ["binance", "ftx", "bybit"];
	for (let i = 0; i < available_exchanges.length; i++) {
		const exchangeName = available_exchanges[i];
		const redisName = `available_${exchangeName}`;
		const value = await getAsync(redisName);
		if (!value) {
			if (mockData.hasOwnProperty(exchangeName)) {
				await setAsync(
					redisName,
					JSON.stringify(mockData[exchangeName])
				);
			}
		}
	}
};

module.exports = {
	initRedisData,
};
