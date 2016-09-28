import path from 'path';
import webpack from 'webpack';
import ExtractCssPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import webpackHotMiddleware from 'webpack-hot-middleware';
import pkg from '../package.json';

const DEBUG = !process.argv.includes('--release'),
  HMR = !process.argv.includes('--no-hmr'),
  EXTRACT = process.argv.includes('--no-server');

const DIR = DEBUG ? '../prebuild' : '../build';
const EXT = ['', '.js', '.jsx', '.web.js', '.woff', '.png', '.jpg', '.scss', '.css', '.json'];
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

const COMMON_CSS = path.resolve(__dirname, '../src/common');
const CSS_CONF = (isModule) => [
  `css?${JSON.stringify({
    sourceMap: DEBUG,
    modules: isModule,
    localIdentName: DEBUG ? '[name]--[local]--[hash:base64:3]' : '[hash:base64:6]',
    minimize: !DEBUG,
    importLoaders: 1
  })}`,
  `postcss${DEBUG ? '?sourceMap=true' : ''}`
];

const HOT_ENTRY = ['react-hot-loader/patch', 'webpack-hot-middleware/client'];

const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: HMR,
});
if (HMR) babelConfig.plugins.unshift('react-hot-loader/babel');

const config = {
  entry: {
    index: [...HMR ? HOT_ENTRY : [], path.resolve(__dirname, '../src/index.js')],
    main: [...HMR ? HOT_ENTRY : [], path.resolve(__dirname, '../src/main.js')]
  },
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
      loaders: [
        `babel?${JSON.stringify(babelConfig)}`
      ]
    }, {
      // match module css
      test: /\.(css|scss)$/,
      exclude: COMMON_CSS,
      loader: EXTRACT ? '' : ExtractCssPlugin.extract('style', CSS_CONF(true).join('!')),
      loaders: EXTRACT ? ['style'].concat(CSS_CONF(true)) : []
    }, {
      // match lib css
      test: /\.(css|scss)$/,
      include: COMMON_CSS,
      loader: EXTRACT ? '' : ExtractCssPlugin.extract('style', CSS_CONF(false).join('!')),
      loaders: EXTRACT ? ['style'].concat(CSS_CONF(false)) : []
    }, {
      test: /\.(woff|eot|ttf)$/,
      loader: 'url?limit=100000&name=fonts/[name].[ext]?[hash:5]'
    }, {
      test: /\.(png|jpg|svg|gif|jpeg)$/,
      loader: 'file?name=img/[name].[ext]?[hash:5]'
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },
  resolve: {
    root: path.resolve(__dirname, '../src'),
    alias: {
      '@components': 'components'
    },
    modulesDirectories: ['node_modules', 'components'],
    // directoryDescriptionFiles: {
    //   "package.json": true
    // },
    extensions: EXT
  },
  plugins: [
    new ExtractCssPlugin(DEBUG ? 'css/[name].css?[hash]' : 'css/[name].[hash].css', {
      allChunks: true
    }),
    ...DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ],
    new AssetsPlugin({
      path: path.resolve(__dirname, `${DIR}/assets`),
      filename: 'assets.json',
      prettyPrint: true
    }),
    new HtmlPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      },
      filename: path.resolve(__dirname, `${DIR}/index.html`)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    colors: true,
    timings: true,
    chunks: false
  },
  lazy: false,
  noInfo: false,
  postcss: function(bundle) {
    return [
      require('postcss-import')({
        addDependencyTo: bundle
      }),
      require('pleeease-filters')(),
      require('autoprefixer')({
        browsers: BROWSERS
      })
    ]
  },
  // devtool: 'cheap-module-eval-source-map'
  devtool: DEBUG ? 'source-map' : false
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
