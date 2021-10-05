const generatePlaceHolders = (count) => {
	if (count === 0) {
		return "";
	}
	return new Array(count)
		.fill(0)
		.map((e, idx) => `$${idx + 1}`)
		.join(",");
};

module.exports = {
	generatePlaceHolders,
};
