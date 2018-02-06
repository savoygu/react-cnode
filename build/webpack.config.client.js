const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base');
const { cdn: { host } } = require('../app.config');

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
  config.devtool = '#cheap-module-eval-source-map';
  config.entry = [
    'react-hot-loader/patch',
    path.join(__dirname, '../client/app.js')
  ];
  config.devServer = {
    host: '0.0.0.0',
    port: 8888,
    // contentBase: path.join(__dirname, '../dist'),
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
} else {
  config.entry = {
    app: path.join(__dirname, '../client/app.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'prop-types',
      'mobx',
      'mobx-react',
      'react-helmet',
      'axios',
      'query-string',
      'dateformat',
      'marked',
      'classnames'
    ]
  };
  config.output.filename = '[name].[chunkhash].js';
  config.output.publicPath = host;
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.NamedModulesPlugin(), // 异步加载
    new NameAllModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.mapModules(m => path.join(m.context, m.request)).join('_');
    })
  );
}

module.exports = config;
