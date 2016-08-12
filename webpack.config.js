var path = require('path');


module.exports = {
    entry: {
        // 'webpack/hot/dev-server',
        // 'webpack-dev-server/client?http://localhost:8080',
        st: path.resolve(__dirname, 'build/es5/st.js'),
        test: path.resolve(__dirname, 'build/es5/test.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',   // '[name].js' // Template based on keys in entry above
    },
    module: {
        loaders: [
            // { test: /\.coffee$/, loader: 'coffee-loader' },
            // {
            //     test: /\.js$/,
            //     loader: 'babel-loader',
            //     query: {
            //         presets: ['es2015']
            //     }
            // }
        ]
    },
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.json']
    }
};


// webpack for building once for development
// webpack -p for building once for production (minification)
// webpack --watch for continuous incremental build in development (fast!)
// webpack -d to include source maps