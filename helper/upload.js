const { createWriteStream } = require('fs');
const { EXTENSION } = require('./constant');

const storeUpload = async ({ createReadStream, path}) => {
	const id = Date.now();

	return new Promise((resolve, reject) =>
		createReadStream()
			.pipe(createWriteStream(path))
			.on('finish', () => resolve({ id: `${id}${EXTENSION}`, path }))
			.on('error', reject)
	);
};
module.exports = { storeUpload };
