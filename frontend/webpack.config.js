var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var sassOptions = 'indentedSyntax=true&includePaths=' + __dirname + '/src'

module.exports = {
    entry: './src/index.jsx',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.sass$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract('css-loader!sass-loader?'+sassOptions)
        }]
    },
    resolve: { extensions: ['', '.js', '.jsx'] },
    output: {
        path: './dist',
        filename: 'bundle.react.min.js'
    },
    plugins: [
        new ExtractTextPlugin("bundle.min.css"),
        new webpack.optimize.UglifyJsPlugin()
    ]
}
