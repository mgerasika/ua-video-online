const withTwin = require('./withTwin.js');

/**
 * @type {import('next').NextConfig}
 */
module.exports = withTwin({
	reactStrictMode: true,
	experimental: {
		largePageDataBytes: 10* 1024 * 1024,
	}
});
