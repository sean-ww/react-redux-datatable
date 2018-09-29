// this is just to build a umd build for https://npmcdn.com/
// and for users that don't use webpack or browserify

// For npm package authors, npmcdn relieves the burden of publishing
// your code to a CDN in addition to the npm registry.
// All you need to do is include your UMD build in your npm package
// (not your repo, that's different!).

// You can do this easily using the following setup:

// - Add the umd (or dist in this case) directory to your .gitignore file
// - Add the dist directory to your files array in package.json
// - Use a build script to generate your UMD build in the dist directory just before you publish
// - That's it! Now when you npm publish you'll have a version available on npmcdn as well

const webpack = require('webpack');
const path = require('path');
const colors = require('colors/safe');

const isCoverage = process.env.BABEL_ENV === 'test';

module.exports = {
  context: __dirname,
  devtool: '#cheap-module-source-map',
  entry: {
    'react-redux-datatable': 'src/index.jsx',
  },
  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  }, {
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  }],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|\.spec\.js)/,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [].concat(isCoverage ? ['istanbul'] : [],
            [
              'react-html-attrs',
              'transform-decorators-legacy',
              'transform-class-properties',
              'transform-object-assign',
              'webpack-alias',
            ]),
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
    path: `${__dirname}/dist/`,
    filename: '[name].js',
    library: 'ReactReduxDataTable',
    libraryTarget: 'umd',
  },
  plugins: [
    function () {
      this.plugin('watch-run', (watching, callback) => {
        console.log(colors.green('Start (UMD Build): '), colors.bgBlue.white(new Date()));
        callback();
      });
    },
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Ignore all optional deps of moment.js
  ],
};
