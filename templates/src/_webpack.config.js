var path = require('path');

module.exports = {
    context: path.join(process.cwd(), '<%= srcFolder %>'),
    progress: true,
    entry: {
        '<%= appName %>': './<%= appName %>.ts'
    },
    devtool: 'source-map',
    output: {
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            }
        ]
    }
}