const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    historyApiFallback: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
