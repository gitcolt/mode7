const webpack = require('webpack');
const path = require('path');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',

    output: {
	filename: 'bundle.js',
	path: path.resolve(__dirname, 'dist')
    },

    devServer: {
        contentBase: './dist'
    },
    module: {
	rules: [
	    {
	        test: /\.js$/,
	        exclude: /node_modules/,
	        loader: 'babel-loader',

	        options: {
		    presets: ['env']
	        }
	    },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader'
            },
            {
                test: /\.glsl$/,
                loader: 'webpack-glsl-loader'
            }
	]
    },

    plugins: [new UglifyJSPlugin()]
};
