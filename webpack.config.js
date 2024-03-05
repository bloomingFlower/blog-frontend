const webpack = require('webpack');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist",
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html' // 기본 HTML 파일 경로
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.', filter: async (resourcePath) => {
            if (resourcePath.endsWith('index.html')) {
              return false;
            }
            return true;
          }},
      ],
    }),
    new Dotenv({
      path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    alias: {
      "@styles": path.resolve(__dirname, "/src/styles/"), // CSS 파일이 있는 경로
      "@img": path.resolve(__dirname, "/src/static/img/"), // 이미지 파일이 있는 경로
    },
  },
};
