const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: [/node_modules/, /public/],
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
		new BundleAnalyzerPlugin(),
		new HtmlWebpackPlugin({
			template: 'public/index.html',
		}),
	],
	devtool: prod ? false : 'source-map'
};
