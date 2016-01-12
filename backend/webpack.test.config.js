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
        path: './test',
        libraryTarget: 'commonjs2',
        filename: 'YsuraGarage.js'
    },
    target: 'node'
}
