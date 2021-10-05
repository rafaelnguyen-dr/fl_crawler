"use strict";

// socket
const WebSocketClient = require("../../websocket/WebSocketClient");

// services
const binanceService = require("./binance.service");

// translator
const {
	spotOrderSocketTranslator,
	futureOrderSocketTranslator,
} = require("./translator");

// constants
const {
	BINANCE_WEBSOCKET_ENDPOINT,
	BINANCE_API_FUTURES_TESTNET,
	BINANCE_WEBSOCKET_ENDPOINT_TESTNET,
} = require("../../config/secrets");
const { THIRTY_MINS } = require("../../constants");

/**
 *
 *  BINANCE web socket connection
 *  https://github.com/binance/binance-spot-api-docs/blob/master/user-data-stream.md
 *
 **/

const WEBSOCKET_ENDPOINTS = {
	SPOT: BINANCE_WEBSOCKET_ENDPOINT,
	// FUTURE: process.env.BINANCE_WEBSOCKET_ENDPOINT_FUTURE,
	FUTURE: BINANCE_WEBSOCKET_ENDPOINT_TESTNET,
	TESTNET_FUTURE: BINANCE_WEBSOCKET_ENDPOINT_TESTNET,
};

class BinanceWebSocket {
	constructor(key, secret_key, user_id, type) {
		this.key = key;
		this.type = type;
		this.user_id = user_id;
		this.secret_key = secret_key;
		this.orderSocket = new WebSocketClient();
		this.listenKeys = {
			SPOT: null,
			FUTURE: null,
		};
	}

	async fetchListenKey() {
		let key = null;
		try {
			switch (this.type) {
				case "SPOT": {
					key = await binanceService.getSpotListenKey(this.key);
					break;
				}
				case "FUTURE":
					{
						key = await binanceService.getFutureListenKey(
							this.key,
							this.secret_key,
							// TODO: Update to real future account
							BINANCE_API_FUTURES_TESTNET
						);
					}
					break;
				default:
					throw new Error("Invalid type");
			}
		} catch (e) {
			if (e?.response?.status === 401) {
				console.error("Binance API key is invalid");
			} else {
				console.error("Unhanlded error: ");
			}
		}
		this.listenKeys[this.type] = key;
		return key;
	}

	async renewListenKey() {
		try {
			console.log("Renew listen key");
			switch (this.type) {
				case "SPOT": {
					if (this.listenKeys[this.type]) {
						await binanceService.extendUserDataStreamSpot(this.key)(
							this.listenKeys[this.type]
						);
					}
					break;
				}
				case "FUTURE":
					if (this.listenKeys[this.type]) {
						await binanceService.extendUserDataStreamFuture(
							this.key,
							this.secret_key,

							// TODO: Update to future endpoint
							BINANCE_API_FUTURES_TESTNET
						);
					}
			}
		} catch (error) {
			console.error("Error renewing listen key: ", error);
		}
	}

	initSocket = async () => {
		let userListenKey = this.listenKeys[this.type];

		// if we haven't had a listen key yet, fetch one
		if (!userListenKey) {
			userListenKey = await this.fetchListenKey(this.type);
		}

		// fetch listen key ok, now connect to websocket
		if (userListenKey) {
			const HOST_URI = WEBSOCKET_ENDPOINTS[this.type];
			console.log("Starting BINANCE WebSocket Listener");
			this.orderSocket.open(`${HOST_URI}stream?streams=${userListenKey}`);
			this.orderSocket.onopen = () => {
				console.log("BINANCE WebSocket Listener started");
				// ping to keep connection alive
				this.pingInterval = setInterval(async () => {
					await this.renewListenKey();
				}, THIRTY_MINS);
			};
			this.orderSocket.onclose = () => {
				console.log("on close websocket");
				clearInterval(this.pingInterval);
			};
			this.orderSocket.onmessage = this.handleMessage;
			return true;
		} else {
			// If we can't fetch a listen key -> failed to connect
			console.log("Failed to fetch listen key");
			return false;
		}
	};

	handleMessage = async (data, flags, messageNumber) => {
		const inputData = JSON.parse(data);
		console.log("inputData: ", inputData);
		if (inputData?.data?.e) {
			switch (inputData.data.e) {
				case "executionReport":
					{
						const orderUpdatedData = spotOrderSocketTranslator(
							inputData.data,
							this.user_id
						);
						await binanceService.saveSpotOrder(
							orderUpdatedData,
							this.user_id
						);
					}
					break;
				case "ACCOUNT_UPDATE":
					{
						// TODO: Might use some information from this event.
					}
					break;
				case "ORDER_TRADE_UPDATE":
					{
						const orderUpdatedData = futureOrderSocketTranslator(
							inputData.data.o,
							this.user_id
						);
						await binanceService.saveFutureOrder(
							orderUpdatedData,
							this.user_id
						);
					}
					break;
			}
		}
	};

	async start() {
		return this.initSocket();
	}

	async stop() {
		return new Promise((resolve) => {
			console.log("Terminating Binance WebSocket Listener");
			this.orderSocket.terminate(false);
			resolve();
		}).catch((e) => {
			console.log(
				new Date(),
				"Error stopping Binance WebSocket Listener: ",
				e.message
			);
		});
	}
}

module.exports = BinanceWebSocket;
