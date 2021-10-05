// TODO: might be update later?
const MARKETS = [
	"BTC",
	"ETH",
	"USDT",
	"BNB",
	"USD",
	"USDC",
	"PAX",
	"TUSD",
	"USDS",
];

function insert(str, index, value) {
	return str.substr(0, index) + value + str.substr(index);
}

const symbolConverter = (input) => {
	if (input.includes("/")) {
		return input;
	}

	if (input.length == 6) {
		return insert(input, 3, "/").replace(/bcc/i, "BCH");
	}

	let result = undefined;

	MARKETS.forEach((market) => {
		if (input.substr(input.length - market.length) === market) {
			result = insert(input, input.length - market.length, "/");
		}
	});

	if (result == undefined) {
		console.log("Failure to lookup symbol correctly " + input);
	}

	return result;
};

module.exports = {
	symbolConverter,
};
