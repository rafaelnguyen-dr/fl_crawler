const db = require("../../database");

const { INSERT_USER_ORDER_QUERY } = require("../queries");

const saveUserOrder = async (order, user_id, exchange) => {
	try {
		const response = await db.query(INSERT_USER_ORDER_QUERY, [
			order.time,
			user_id,
			exchange,
			order.order_id,
			order.datetime,
			order.symbol,
			order.status,
			order.is_processed,
			order.client_order_id,
			order.time_in_force,
			order.side,
			order.price,
			order.average_price,
			order.amount,
			order.filled,
			order.remaining,
			order.cost,
			order.type,
		]);

		return response?.rows?.[0];
	} catch (error) {
		console.log("error saveUserOrder: ", error);
	}
};

module.exports = {
	saveUserOrder,
};
