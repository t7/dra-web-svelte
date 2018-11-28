const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    path: __dirname + '/dist',
    filename: '[name].js',
    chunkFilename: '[name].js'
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
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  mode,
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new BrotliGzipPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
