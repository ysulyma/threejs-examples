const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: `${__dirname}/src/main.ts`,
  output: {
    filename: "script.js",
    path: __dirname
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "three": "THREE"
  },

  mode: process.env.NODE_ENV,

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "ts-loader"
      }
    ],
  },

  // necessary due to bug in old versions of mobile Safari
  devtool: false,

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          safari10: true
        }
      })
    ],
    noEmitOnErrors: false
  },
  
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  }
};
