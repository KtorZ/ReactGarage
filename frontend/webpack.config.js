var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: './src/index.jsx',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract('css-loader')
        }]
    },
    resolve: { extensions: ['', '.js', '.jsx'] },
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    plugins: [new ExtractTextPlugin("[name].css")]
}
