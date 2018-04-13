const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // Webpack checks this file for any additional JS dependencies to be bundled
  entry: [path.resolve(__dirname, '../app/index.js')],

  output: {
    // Output folder in which the files will be built
    path: path.resolve(__dirname, '../dist'),
    // All the JS files will be bundled in this one minified/obfuscated file
    filename: './js/eac-schedule.js'
  },

  node: {
    fs: 'empty',
    repl: 'empty'
  },

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
  },

  plugins: [
    // Directly copies certain files
    new CopyWebpackPlugin([{ from: './demo/index.html', to: 'index.html' }])
  ]
};
