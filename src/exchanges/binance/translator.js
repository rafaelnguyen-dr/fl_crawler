"use strict";

const { symbolConverter } = require("../../utils/exchange-utils");

/*
{
  "e": "executionReport",        // Event type
  "E": 1499405658658,            // Event time
  "s": "ETHBTC",                 // Symbol
  "c": "mUvoqJxFIILMdfAW5iGSOW", // Client order ID
  "S": "BUY",                    // Side
  "o": "LIMIT",                  // Order type
  "f": "GTC",                    // Time in force
  "q": "1.00000000",             // Order quantity
  "p": "0.10264410",             // Order price
  "P": "0.00000000",             // Stop price
  "F": "0.00000000",             // Iceberg quantity
  "g": -1,                       // OrderListId
  "C": null,                     // Original client order ID; This is the ID of the order being canceled
  "x": "NEW",                    // Current execution type
  "X": "NEW",                    // Current order status
  "r": "NONE",                   // Order reject reason; will be an error code.
  "i": 4293153,                  // Order ID
  "l": "0.00000000",             // Last executed quantity
  "z": "0.00000000",             // Cumulative filled quantity
  "L": "0.00000000",             // Last executed price
  "n": "0",                      // Commission amount
  "N": null,                     // Commission asset
  "T": 1499405658657,            // Transaction time
  "t": -1,                       // Trade ID
  "I": 8641984,                  // Ignore
  "w": true,                     // Is the order on the book?
  "m": false,                    // Is this trade the maker side?
  "M": false,                    // Ignore
  "O": 1499405658657,            // Order creation time
  "Z": "0.00000000",             // Cumulative quote asset transacted quantity
  "Y": "0.00000000",              // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
  "Q": "0.00000000"              // Quote Order Qty
}
*/

const spotOrderSocketTranslator = (socketData, userId) => {
	// !! This is only socket object for SPOT-LIMIT order. Might need to update later.
	try {
		const newOrderObj = {
			order_id: socketData.i,
			user_id: userId,
			is_processed: false,
			exchange_name: "binance",
			side: socketData.S.toLowerCase(),
			status: socketData.X.toLowerCase(),
			type: socketData.o.toLowerCase(),
			datetime: new Date(socketData.T),
			amount: socketData.q,
			price: socketData.p,
			symbol: symbolConverter(socketData.s),
			timestamp: socketData.T,
			lastTradeTimestamp: socketData.T,
			timeInForce: socketData.f,
			// !! TODO: update post only later
			postOnly: false,
			stopPrice: socketData.P,
			// TODO: socketData.N is not surely equivalent to cost
			cost: socketData.N,
			// Average price can be found by doing Z divided by z.
			average: socketData.z > 0 ? socketData.Z / socketData.z : 0,
			filled: socketData.z,
			remaining: socketData.q - socketData.z,

			// TODO: need to update later
			fee: socketData.n,
			trades: [],
			fees: [],
		};

		return newOrderObj;
	} catch (error) {
		return null;
	}
};

// Future response
/*
	"e":"ORDER_TRADE_UPDATE",     // Event Type
  "E":1591274595442,            // Event Time
  "T":1591274595453,            // Transaction Time
  "i":"SfsR",                   // Account Alias
  "o":{                             
    "s":"BTCUSD_200925",        // Symbol
    "c":"TEST",                 // Client Order Id
    "S":"SELL",                 // Side
    "o":"TRAILING_STOP_MARKET", // Order Type
    "f":"GTC",                  // Time in Force
    "q":"2",                    // Original Quantity
    "p":"0",                    // Original Price
    "ap":"0",                   // Average Price
    "sp":"9103.1",              // Stop Price. Please ignore with TRAILING_STOP_MARKET order
    "x":"NEW",                  // Execution Type
    "X":"NEW",                  // Order Status
    "i":8888888,                // Order Id
    "l":"0",                    // Order Last Filled Quantity
    "z":"0",                    // Order Filled Accumulated Quantity
    "L":"0",                    // Last Filled Price
    "ma": "BTC",                // Margin Asset
    "N":"BTC",                  // Commission Asset of the trade, will not push if no commission
    "n":"0",                    // Commission of the trade, will not push if no commission
    "T":1591274595442,          // Order Trade Time
    "t":0,                      // Trade Id
    "b":"0",                    // Bid quantity of base asset
    "a":"0",                    // Ask quantity of base asset
    "m":false,                  // Is this trade the maker side?
    "R":false,                  // Is this reduce only
    "wt":"CONTRACT_PRICE",      // Stop Price Working Type
    "ot":"TRAILING_STOP_MARKET",// Original Order Type
    "ps":"LONG",                // Position Side
    "cp":false,                 // If Close-All, pushed with conditional order
    "AP":"9476.8",              // Activation Price, only puhed with TRAILING_STOP_MARKET order
    "cr":"5.0",                 // Callback Rate, only puhed with TRAILING_STOP_MARKET order
		"rp":"0"                    // Realized Profit of the trade

		COIN-M FUTURE
    "pP": false                 // If conditional order trigger is protected
  }
*/

const futureOrderSocketTranslator = (socketData, userId) => {
	try {
		const newOrderObj = {
			time: new Date(),
			symbol: socketData.s,
			client_order_id: socketData.c,
			side: socketData.S.toLowerCase(),
			order_type: socketData.o.toLowerCase(),
			time_in_force: socketData.f,
			original_quantity: socketData.q,
			original_price: socketData.p,
			average_price: socketData.ap,
			stop_price: socketData.sp,
			execution_type: socketData.x.toLowerCase(),
			status: socketData.X.toLowerCase(),
			order_id: socketData.i,
			order_last_filled_quantity: socketData.l,
			order_filled_accumulated_quantity: socketData.z,
			last_filled_price: socketData.L,
			margin_asset: socketData.ma,
			commission_asset: socketData.N,
			commission: socketData.n,
			datetime: socketData.T,
			// datetime: +new Date(),
			trade_id: socketData.t,
			bids_notional: socketData.b,
			ask_notional: socketData.a,
			is_trade_marker_side: socketData.m,
			is_reduce_only: socketData.R,
			stop_price_working_type: socketData.wt,
			original_order_type: socketData.ot,
			position_side: socketData.ps,
			callback_price: socketData.cp,
			activation_price: socketData.Ap,
			callback_rate: socketData.cr,
			realized_profit: socketData.rp,
			is_protected_order: socketData.pP,
			is_processed: false,
			user_id: userId,

			// TODO: update later!
			isolate: false,
			hedged: false,
			leverage: 0,
		};
		console.log(`newOrderObj`, newOrderObj);
		return newOrderObj;
	} catch (error) {
		console.log(`socketData`, socketData);
		console.log("error futureOrderSocketTranslator: ", error);
		return null;
	}
};

module.exports = {
	spotOrderSocketTranslator,
	futureOrderSocketTranslator,
};
