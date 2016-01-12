module.exports = {
    entry: './src/index.js',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    resolve: { extensions: ['', '.js'] },
    output: {
        path: './dist',
        library: 'YsuraGarage',
        libraryTarget: 'var',
        filename: 'YsuraGarage.js'
    },
    target: 'web'
}
