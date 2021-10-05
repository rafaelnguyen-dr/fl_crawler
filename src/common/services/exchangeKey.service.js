const db = require("../../database");

const { FIND_EXCHANGE_KEY_QUERY } = require("../queries");

const findExchangeKey = async (userId, exchange_name) => {
	try {
		const exchangeKeyResponse = await db.query(FIND_EXCHANGE_KEY_QUERY, [
			userId,
			exchange_name,
		]);

		return exchangeKeyResponse?.rows?.[0];
	} catch (error) {
		console.log("error findExchangeKey: ", error);
		return null;
	}
};

module.exports = {
	findExchangeKey,
};
