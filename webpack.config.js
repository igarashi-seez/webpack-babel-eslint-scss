const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const MODE = "development";

const ENABLE_SOURCE_MAP = MODE === "development";

module.exports = {
  mode: MODE,
  entry: {
    main: "./src/js/index.js",
    style: "./src/sass/index.scss",
  },
  output: {
    filename: "js/[name].js",
    path: path.join(__dirname, "dist/assets"),
    publicPath:"/assets/"
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
  ],
  optimization: {
    //production minify
    minimizer: [
      new CSSMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: true,
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      //Babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      //ESlint
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: [
          {
            loader: "eslint-loader",
          },
        ],
      },
      // SCSS
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: ENABLE_SOURCE_MAP,
              importLoaders: 2,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: ENABLE_SOURCE_MAP,
            },
          },
        ],
      },
    ],
  },
  devtool: "source-map",
  devServer:{
    static:{
      directory:path.join(__dirname,'dist'),
    },
    client: {
      logging:'none',
      overlay: false,
    },
    host: "local-ip",
    open:true,
  }
};
