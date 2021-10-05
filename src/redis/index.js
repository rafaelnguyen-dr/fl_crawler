/**
 * Redis data structure:
 * available: [{userId: "", last_time_executed: Date, is_leader: boolean}]
 */

const redis = require("redis");
const { promisify } = require("util");

const { REDIS_HOST, REDIS_PORT } = require("../config/secrets");
const { TEN_SECONDS } = require("../constants");

const redisClient = redis.createClient({
	host: REDIS_HOST,
	port: REDIS_PORT,
	retry_strategy: (options) => {
		console.log(new Date(), options);
		return TEN_SECONDS;
	},
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

module.exports = {
	getAsync,
	setAsync,
};
