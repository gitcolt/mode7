const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: './dist'
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.(png|jpg)$/,
            use: [
                'file-loader'
            ]
        }]
    }
};
