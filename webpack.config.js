const path = require('path');

module.exports = {
	cache: false,
	entry: './src/index.ts',
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
				exclude: [
					/node_modules/
				],
				test: /\.ts$/,
				use: {
					loader: 'babel-loader',
				}
			},
			{
				enforce: "pre",
				test: /\.js$/,
				use: ["source-map-loader"],
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
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		compress: true,
		port: 9000,
	},
};
