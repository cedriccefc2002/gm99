"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack = require("webpack");
const Configuration = {
    context: __dirname,
    entry: {
        app: `./src`,
    },
    resolve: {
        extensions: ['.json', '.jsx', '.js']
    },
    module: {
        loaders: [
            { test: /\.json$/, loaders: ["json-loader"] }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery'
        })
    ],
    target: "electron-renderer",
    output: {
        path: path.join(__dirname, 'Build'),
        filename: "[name].js"
    }
};
if (require.main === module) {
    webpack(Configuration, (error, stats) => {
        if (error) {
            console.error(error);
        }
    });
}
else {
    module.exports = Configuration;
}
