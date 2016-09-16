'use strict';

var webpack = require('webpack'),
    path = require('path');

var appPath = __dirname + '/app';
var configPath = __dirname + '/config';

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: appPath,

    entry: {
        app: ['webpack/hot/dev-server', './index.js'],
        vendor: ['./vendor.js']
    },

    devtool: 'source-map',

    resolve: {
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },

    module: {
        loaders: [
            {test: /\.html$/, loader: "html"},
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.(png|gif|jpg)$/, loader: "url-loader?limit=10000"},
            {test: /\.scss$/, loader: "style-loader!css-loader!sass-loader"},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"},
            {test: /\.hbs$/, loader: "handlebars-loader"}
        ]
    },

    plugins: [

        // Hot module replacement
        new webpack.HotModuleReplacementPlugin(),

        // Split vendor code
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash].js'),

        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
            favicon: './favicon.png'
        })
    ],

    devServer: {
        // Redirect routes to index.html in development server
        historyApiFallback: true
    }
};
