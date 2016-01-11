module.exports = {
    entry: './index.js',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    resolve: { extensions: ['', '.js'] },
    output: {
        path: '.',
        libraryTarget: 'commonjs2',
        filename: 'YsuraGarage.js'
    },
    target: 'node'
}
