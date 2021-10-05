const { generatePlaceHolders } = require("../../utils/helper");

// SPOT
const SEARCH_SPOT_ORDER_BY_ID_QUERY =
	"SELECT * FROM user_orders WHERE order_id = $1";

// TODO: Might be update later, currently still missing some fields
const INSERT_SPOT_ORDER_QUERY = `
	INSERT INTO user_orders(
		order_id,
		user_id,
		is_processed,
		exchange_name,
		side,
		status,
		type,
		datetime,
		amount,
		price,
		symbol,
		timestamp,
		"lastTradeTimestamp",
		"timeInForce",
		"postOnly",
		"stopPrice",
		cost,
		average,
		filled,
		remaining,
		fee,
		trades,
		fees
	)
	VALUES(${generatePlaceHolders(23)})
	RETURNING *
`;

// TODO: Do we need to update entire order?
const UPDATE_SPOT_ORDER_QUERY = `
	UPDATE user_orders
	SET
		is_processed = $1,
		status = $2,
		filled = $3,
		remaining = $4,
		cost = $5,
		average = $6,
		fees = $7,
		trades = $8
	WHERE order_id = $9
	RETURNING *
`;

// FUTURE
const SEARCH_FUTURE_ORDER_BY_ID_QUERY =
	"SELECT * FROM user_future_orders WHERE order_id = $1";

const INSERT_FUTURE_ORDER_QUERY = `
		INSERT INTO user_binance_future_orders(
			time,
			symbol,
			client_order_id,
			side,
			order_type,
			time_in_force,
			original_quantity,
			original_price,
			average_price,
			stop_price,
			execution_type,
			status,
			order_id,
			order_last_filled_quantity,
			order_filled_accumulated_quantity,
			last_filled_price,
			margin_asset,
			commission_asset,
			commission,
			datetime,
			trade_id,
			bids_notional,
			ask_notional,
			is_trade_marker_side,
			is_reduce_only,
			stop_price_working_type,
			original_order_type,
			position_side,
			callback_price,
			activation_price,
			callback_rate,
			realized_profit,
			is_protected_order,
			is_processed,
			user_id,
			isolate,
			hedged,
			leverage
	)
	VALUES(${generatePlaceHolders(38)})
	RETURNING *
`;

const UPDATE_FUTURE_ORDER_QUERY = `
	UPDATE user_future_orders
	SET
			side = $1,
			order_type = $2,
			time_in_force = $3,
			original_quantity = $4,
			original_price = $5,
			average_price = $6,
			stop_price = $7,
			execution_type = $8,
			status = $9,
			order_last_filled_quantity = $10,
			order_filled_accumulated_quantity = $11,
			last_filled_price = $12,
			margin_asset = $13,
			commission_asset = $14,
			commission = $15,
			order_trade_time = $16,
			bids_notional = $17,
			ask_notional = $18,
			is_trade_marker_side = $19,
			is_reduce_only = $20,
			stop_price_working_type = $21,
			original_order_type = $22,
			position_side = $23,
			callback_price = $24,
			activation_price = $25,
			callback_rate = $26,
			realized_profit = $27,
			is_protected_order = $28,
			is_processed = $29,
			isolate = $30,
			hedged = $31,
			leverage = $32
	WHERE order_id = $33
	RETURNING *
`;

module.exports = {
	// SPOT
	SEARCH_SPOT_ORDER_BY_ID_QUERY,
	INSERT_SPOT_ORDER_QUERY,
	UPDATE_SPOT_ORDER_QUERY,

	// FUTURE
	SEARCH_FUTURE_ORDER_BY_ID_QUERY,
	INSERT_FUTURE_ORDER_QUERY,
	UPDATE_FUTURE_ORDER_QUERY,
};
