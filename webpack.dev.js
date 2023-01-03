const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const config = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
    compress: true,
    open: true,
    host: '127.0.0.1',
    port: 80
  },
};

module.exports = merge(common, config);
