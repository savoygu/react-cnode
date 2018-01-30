const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base');

const isDev = process.env.NODE_ENV === 'development';

const config = merge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
});

if (isDev) {
  config.entry = [
    'react-hot-loader/patch',
    path.join(__dirname, '../client/app.js')
  ];
  config.devServer = {
    host: '0.0.0.0',
    port: 8888,
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/public',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  };
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
