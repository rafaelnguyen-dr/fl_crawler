const { generatePlaceHolders } = require("../utils/helper");

const FIND_EXCHANGE_KEY_QUERY = `SELECT * FROM user_exchanges_keys WHERE user_id = $1 AND exchange = $2 and status = TRUE and is_selected = 'TRUE'`;

const INSERT_USER_ORDER_QUERY = `
	INSERT INTO user_orders(
		time,
		user_id,
		exchange_name,
		order_id,
		datetime,
		symbol,
		status,
		is_processed,
		client_order_id,
		time_in_force,
		side,
		price,
		average_price,
		amount,
		filled,
		remaining,
		cost,
		type
	)
	VALUES(${generatePlaceHolders(18)})
	RETURNING *
`;

module.exports = {
	FIND_EXCHANGE_KEY_QUERY,
	INSERT_USER_ORDER_QUERY,
};
