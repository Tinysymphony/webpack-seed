import path from 'path';
import webpack from 'webpack';
import ExtractCssPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';

const DEBUG = !process.argv.includes('--release');
const DIR = DEBUG ? '../prebuild' : '../build';
const EXT = ['', '.js', '.jsx', '.woff', '.png', '.jpg', '.scss', '.css'];
const BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];

const config = {
  entry: {
    index: path.resolve(__dirname, '../src/index.js'),
    main: path.resolve(__dirname, '../src/main.js')
  },
  // [
  //   // 'webpack-hot-middleware/client',
  //   path.resolve(__dirname, '../src/index.js')
  // ],
  output: {
    path: path.resolve(__dirname, `${DIR}/assets`),
    publicPath: '/assets/',
    filename: DEBUG ? 'js/[name].js?[hash]' : 'js/[name].[hash].js',
    chunkFilename: DEBUG ? 'js/[id].js?[chunkhash]' : 'js/[id].[chunkhash].js'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.(css|scss)$/,
      loader: ExtractCssPlugin.extract('style', 'css!postcss!sass')
    }, {
      test: /\.woff$/,
      loader: 'url?limit=100000'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'file?name=./img/[name].[ext]'
    }]
  },
  resolve: {
    root: path.resolve(__dirname, '../src'),
    modulesDirectories: ['node_modules'],
    extensions: EXT
  },
  plugins: [
    ... DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ],
    new ExtractCssPlugin(DEBUG ? 'css/[name].css?[hash]' : 'css/[name].[hash].css', {
      allChunks: true
    }),
    new AssetsPlugin({
      path: path.resolve(__dirname, `${DIR}/assets`),
      filename: 'assets.json',
      prettyPrint: true
      // processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    colors: true,
    timings: true,
    chunks: false
  },
  // watchOptions: {
  //   aggregateTimeout: 300,
  //   poll: true
  // },
  lazy: false,
  noInfo: false,
  postcss: function(bundle) {
    return [
      require('postcss-import')(),
      require('pleeease-filters')(),
      require('autoprefixer')({
        browsers: BROWSERS
      })
    ]
  }
};

export default config;

if (require.main === module) {
  webpack(config).run((err, stats) => {
    if (err) {
      console.log(err);
    }
    console.log(stats.toString(config.stats));
  });
}
