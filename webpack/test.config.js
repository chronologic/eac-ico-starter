const path = require('path');

module.exports = {
  mode: 'development',

  // Webpack checks this file for any additional JS dependencies to be bundled
  module: {
    rules: [
      // Loader for the image files
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      },

      // Loader for the fonts
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },

      {
        test: /\.js[x]?$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, '../app'),
        loader: 'babel-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.js']
  }
};
