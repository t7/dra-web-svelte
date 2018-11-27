const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		extensions: ['.js', '.html']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	// split each node module into it's own bundle
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `npm.${packageName.replace('@', '')}`;
					},
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						skipIntroByDefault: true,
						nestedTransitions: true,
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins: [
		new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new BrotliGzipPlugin({
			asset: '[path].br[query]',
			algorithm: 'brotli',
			test: /\.(js|css|html|svg)$/,
			threshold: 10240,
			minRatio: 0.8,
			quality: 11
		}),
		new BrotliGzipPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.(js|css|html|svg)$/,
			threshold: 10240,
			minRatio: 0.8
		})
	],
	devtool: prod ? false : 'source-map'
};
