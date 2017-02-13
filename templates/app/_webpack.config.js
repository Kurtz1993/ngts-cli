var webpack = require("webpack");

module.exports = {
    entry: {
        "<%= hAppName %>": "./<%= srcFolder %>/<%= hAppName %>.ts",
        "vendor": "./<%= srcFolder %>/vendor.ts"
    },
    devtool: "source-map",
    output: {
        path: "./<%= outFolder %>/js",
        filename: "[name].js",
        devtoolModuleFilenameTemplate: "../../[resource-path]"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        loaders: [
            {
                test: /\.ts?$/,
                loader: "awesome-typescript-loader"
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ["<%= hAppName %>", "vendor"]
        })
    ]
}