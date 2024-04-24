const path = require("path");
module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.js",
        recommendation: "./src/recommendation.js",
        basket: "./src/basket.js",
        data: "./src/getData.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }],
            },
        ],
    },
    devServer: {
        static: "./dist",
    },
};