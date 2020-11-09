const path = require("path")

module.exports = {
    mode: "development",
    entry: {
        app: path.join(__dirname, "demo.tsx")
    },
    target: "web",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader"
                }],

                exclude: "/node_modules/",
            }
        ],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        contentBase: path.resolve(__dirname),

    }
}
