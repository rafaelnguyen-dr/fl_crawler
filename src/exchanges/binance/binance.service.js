// Borrowed: https://github.com/binance/binance-websocket-examples/blob/master/src/lib/services

const {
	futuresPrivateRequest,
	spotMarketDataRequest,
} = require("./requestClient");

const db = require("../../database");

const { FUTURE_PATHS, SPOT_PATHS } = require("./binance.constants");
const {
	// INSERT_SPOT_ORDER_QUERY,
	INSERT_FUTURE_ORDER_QUERY,
	SEARCH_SPOT_ORDER_BY_ID_QUERY,
	// SEARCH_FUTURE_ORDER_BY_ID_QUERY,
} = require("./binance.queries");
const { saveUserOrder } = require("../../common/services/order.service");

const getFutureListenKey = async (apiKey, apiSecret, baseURL) =>
	futuresPrivateRequest(
		apiKey,
		apiSecret,
		baseURL
	)("POST", FUTURE_PATHS.LISTEN_KEY)
		.post(FUTURE_PATHS.LISTEN_KEY)
		.then(({ data }) => data.listenKey);

const getSpotListenKey = async (apiKey) =>
	spotMarketDataRequest(apiKey)("POST", SPOT_PATHS.LISTEN_KEY)
		.post(SPOT_PATHS.LISTEN_KEY)
		.then(({ data }) => data.listenKey);

const extendUserDataStreamFuture = async (apiKey, apiSecret, baseURL) =>
	futuresPrivateRequest(
		apiKey,
		apiSecret,
		baseURL
	)("PUT", FUTURE_PATHS.LISTEN_KEY).put(FUTURE_PATHS.LISTEN_KEY);

const extendUserDataStreamSpot = async (apiKey) => (listenKey) =>
	spotMarketDataRequest(apiKey)("PUT", SPOT_PATHS.LISTEN_KEY, {
		listenKey,
	}).put(`${SPOT_PATHS.LISTEN_KEY}?listenKey=${listenKey}`);

const findSpotOrder = async (orderId) => {
	try {
		const result = await db.query(SEARCH_SPOT_ORDER_BY_ID_QUERY, [orderId]);
		return result?.rows?.[0];
	} catch (error) {
		console.log("error on findOrder: ", error);
		return null;
	}
};

const saveFutureOrder = async (order, user_id) => {
	const {
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
		isolate,
		hedged,
		leverage,
	} = order;

	try {
		result = await db.query(INSERT_FUTURE_ORDER_QUERY, [
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
			leverage,
		]);

		// also save order to user_order table
		await saveUserOrder(
			{
				time,
				order_id,
				datetime,
				symbol,
				status,
				is_processed,
				client_order_id,
				time_in_force,
				side,
				price: original_price,
				average_price,
				amount: original_quantity,
				filled: order_filled_accumulated_quantity,
				remaining:
					original_quantity - order_filled_accumulated_quantity,
				cost: original_price * order_last_filled_quantity,
				type: order_type,
			},
			user_id,
			"binance"
		);

		return result?.rows?.[0];
	} catch (error) {
		console.log("error from saveFutureOrder: ", error);
	}
};

module.exports = {
	getSpotListenKey,
	getFutureListenKey,
	extendUserDataStreamFuture,
	extendUserDataStreamSpot,
	saveFutureOrder,
};

// const saveSpotOrder = async (order, user_id) => {
// 	try {
// 		// TODO: Might improve performance by using upsert
// 		let result = null;

// 		const {
// 			order_id,
// 			is_processed,
// 			exchange_name,
// 			side,
// 			status,
// 			type,
// 			datetime,
// 			amount,
// 			price,
// 			symbol,
// 			timestamp,
// 			lastTradeTimestamp,
// 			timeInForce,
// 			postOnly,
// 			stopPrice,
// 			cost,
// 			average,
// 			filled,
// 			remaining,
// 			fee,
// 			trades,
// 			fees,
// 		} = order;

// 		result = await db.query(INSERT_SPOT_ORDER_QUERY, [
// 			order_id,
// 			user_id,
// 			is_processed,
// 			exchange_name,
// 			side,
// 			status,
// 			type,
// 			datetime,
// 			amount,
// 			price,
// 			symbol,
// 			timestamp,
// 			lastTradeTimestamp,
// 			timeInForce,
// 			postOnly,
// 			stopPrice,
// 			cost,
// 			average,
// 			filled,
// 			remaining,
// 			fee,
// 			trades,
// 			fees,
// 		]);

// 		return result?.rows?.[0];
// 	} catch (error) {
// 		console.log("error on createOrder: ", error);
// 		return null;
// 	}
// };

// const findFutureOrder = async (orderId) => {
// 	try {
// 		const result = await db.query(SEARCH_FUTURE_ORDER_BY_ID_QUERY, [
// 			orderId,
// 		]);
// 		return result?.rows?.[0];
// 	} catch (error) {
// 		console.log("error on findFutureOrder: ", error);
// 		return null;
// 	}
// };
