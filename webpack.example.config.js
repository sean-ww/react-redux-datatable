const webpack = require('webpack');
const path = require('path');
const colors = require('colors/safe');

module.exports = {
  context: __dirname,
  devtool: 'eval',
  entry: ['babel-polyfill', 'example/index.jsx'],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|\.spec\.js)/,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'react-html-attrs',
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-object-assign',
            'webpack-alias',
          ],
        },
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname),
      'node_modules',
    ],
    alias: {},
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: `${__dirname}/example/`,
    filename: 'index.min.js',
  },
  plugins: [
    function () {
      this.plugin('watch-run', (watching, callback) => {
        console.log(colors.green('Start (Example Build): '), colors.bgBlue.white(new Date()));
        callback();
      });
    },
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      sourcemap: false,
      compress: {
        warnings: false,
      },
    }),
  ],
};
