const presets = [
  'react',
  'es2015',
  'stage-0',
];

const plugins = [
  'react-html-attrs',
  'transform-decorators-legacy',
  'transform-class-properties',
  'transform-object-assign',
  'webpack-alias',
];

module.exports = {
  env: {
    commonjs: {
      presets,
      plugins,
      ignore: [
        "**/*.spec.jsx",
      ],
    },
    dev: {
      presets,
      plugins,
    },
    test: {
      presets,
      plugins : [
        'istanbul',
        ...plugins,
      ],
    },
  },
};
