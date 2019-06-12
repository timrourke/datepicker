// @see https://github.com/liady/webpack-node-externals
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
	cache: false,
	entry: './src/index.ts',
	externals: [nodeExternals()],
	mode: process.env.NODE_ENV || 'production',
	module: {
		rules: [
			{
				enforce: 'pre',
				exclude: /node_modules/,
				test: /\.ts$/,
				use: [
					{
						loader: 'tslint-loader',
					}
				]
			},
			{
				exclude: /node_modules/,
				test: /\.ts$/,
				use: 'ts-loader',
			},
		],
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: [
			'.js',
			'.ts',
		],
	},
	target: 'web',
};
