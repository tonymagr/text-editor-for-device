const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    // Workbox plugins for a service worker and manifest file
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
        favicon: '../favicon.ico',
        title: 'Just Another Text Editor'
      }),

      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js'
      }),

      new WebpackPwaManifest({
        name: 'Just Another Text Editor',
        short_name: 'JATE',
        inject: true,
        start_url: './',
        publicPath: './',
        fingerprints: false,
        description: 'Text editor that can be installed on your device',
        background_color: '#38B1E4',
        theme_color: '#38B1E4',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            // src: path.resolve('dist/assets/icons/icon.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ], 
      }),
    ],
    // CSS loaders and babel added to webpack
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          // Using babel-loader in order to use ES6
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },   
      ],
    },
  };
};
