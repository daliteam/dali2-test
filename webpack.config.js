require("dotenv").config();

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const babelConfig = require('./babel.config');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (webpackEnv) => {
  const isEnvDevelopment = !!webpackEnv.development;
  const isEnvProduction = !!webpackEnv.production;

  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].bundle.js",
      publicPath: "/",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "./index.html",
        template: path.resolve(__dirname, "./index.html"),
        favicon: "logo.png",
      }),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: "[name].css",
        }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            // options: babelConfig,
          },
        },
        {
          test: /\.s?css$/i,
          use: [
            isEnvProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              ...(isEnvDevelopment
                ? {
                    options: {
                      sourceMap: true,
                    },
                  }
                : {}),
            },
            {
              loader: "sass-loader",
              ...(isEnvDevelopment
                ? {
                    options: {
                      sourceMap: true,
                    },
                  }
                : {}),
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|mp3)$/i,
          type: "asset/resource",
        },
      ],
    },
    ...(isEnvDevelopment
      ? {
          devtool: "source-map",
          devServer: {
            historyApiFallback: true,
            hot: true,
            compress: true,
            port: 9000,
          },
        }
      : {}),
  };
};
