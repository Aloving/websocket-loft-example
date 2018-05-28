const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const path = require('path');

module.exports = merge(webpackConfig, {

    devServer: {
        port: 9000,
        contentBase: path.join(__dirname, 'public'),
        proxy: {
            '/api': {
              target: "http://localhost:3000"
            },
            'ws://': {
              target: "ws://localhost:1330"
            }
          }
      },

    devtool: 'cheap-eval-source-map',

    output: {
        pathinfo: true,
        publicPath: '/',
        filename: '[name].js'
    }

});
