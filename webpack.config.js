var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  context: __dirname,
  entry: [
      'webpack-dev-server/client?http://localhost:3001',
      'webpack/hot/only-dev-server',
      './client/index'
  ],
  output: {
      path: path.resolve('./ptodo/core/static/js'),
      filename: "[name]-[hash].js",
      publicPath: 'http://localhost:3001/static/'
  },

  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
      }),
      new BundleTracker({filename: './webpack-stats.json'}),
  ],

  module: {
    loaders: [
      {
          test: /\.(js|jsx)?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },
}