// redis
const redisClient = require("../redis");

// constants
const { TEN_SECONDS, FIVE_SECONDS, THIRTY_SECONDS } = require("../constants");

class Crawler {
	constructor(webSocket, exchange, exchange_type) {
		this.webSocket = webSocket;
		this.exchange = exchange;
		this.exchange_type = exchange_type;
		this.redisKey = `available_${this.exchange}`;
	}

	async getAvailableUsers() {
		try {
			const value = await redisClient.getAsync(this.redisKey);
			return JSON.parse(value || "[]");
		} catch (error) {
			console.log("error getAvailableUsers: ", error);
		}
		return [];
	}

	async pickUser() {
		const users = await this.getAvailableUsers();

		console.log(`users`, users);

		// find a user which last time executed is more than 30 second ago
		const pickedUser = users.find((user) => {
			return (
				new Date(user.last_time_executed).getTime() + THIRTY_SECONDS <
				Date.now()
			);
		});

		console.log(`pickedUser`, pickedUser);

		return pickedUser;
	}

	async socket_crawler(pickedUser, type = "SPOT") {
		try {
			const { key, secret_key, userId, is_leader } = pickedUser;
			const socketConnector = new this.webSocket(
				key,
				secret_key,
				userId,
				type,
				is_leader
			);

			// Check if socket starts successfully
			const socketConnectorOk = await socketConnector.start();
			if (socketConnectorOk) {
				return socketConnector;
			} else {
				socketConnector.stop();
			}
			return null;
		} catch (error) {
			console.log("error crawl_by_socket: ", error.message);
			return null;
		}
	}

	async updateUserLastTimeExecuted(pickedUser) {
		const users = await this.getAvailableUsers();
		const updatedUsers = users.map((user) => {
			if (user.userId === pickedUser.userId) {
				user.last_time_executed = new Date();
			}
			return user;
		});

		try {
			await redisClient.setAsync(
				this.redisKey,
				JSON.stringify(updatedUsers)
			);
		} catch (error) {
			console.log("error updateUserLastTimeExecuted: ", error);
		}
	}

	async getUserLatestState(pickedUser) {
		const users = await this.getAvailableUsers();
		return users?.find((user) => user.userId === pickedUser.userId);
	}

	async runRetry(message) {
		if (message) {
			console.log("message: ", message);
		}
		setTimeout(() => {
			this.run();
		}, TEN_SECONDS);
	}

	async run() {
		console.log("Start run function...");
		let pickedUser = await this.pickUser();

		// if we can find x user which last time executed is more than 30 seconds ago
		if (pickedUser) {
			// start crawling...
			const socketConnector = await this.socket_crawler(
				pickedUser,
				this.exchange_type
			);

			if (socketConnector) {
				// update last time executed of this user in redis
				await this.updateUserLastTimeExecuted(pickedUser);

				// Update user last time executed every 5 seconds
				const updateLastExecutedTimeInterval = setInterval(async () => {
					// check if user is still leader
					try {
						// update user latest state in redis
						pickedUser = await this.getUserLatestState(pickedUser);

						if (pickedUser) {
							await this.updateUserLastTimeExecuted(pickedUser);
						} else {
							// if picked user is not in redis anymore, stop crawling and try to pick another user
							socketConnector.stop();
							clearInterval(updateLastExecutedTimeInterval);
							this.run();
						}
					} catch (error) {
						console.log(`error`, error);
					}
				}, FIVE_SECONDS);
			} else {
				this.runRetry("Error on init socket connector, retrying... ");
			}
		} else {
			// if we can't find any user which last time executed is more than 30 second ago
			// wait for 10 second and try again
			this.runRetry("There is no user, retrying... ");
		}
	}
}

module.exports = Crawler;
