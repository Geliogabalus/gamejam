const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/client/client.ts',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist/client',
        hot: true,
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            gui: path.resolve(__dirname, '../../node_modules/three/examples/jsm/libs/dat.gui.module')
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist/client')
    },
    performance: {
        hints: false
    }
};