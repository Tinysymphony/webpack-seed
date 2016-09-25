import path from 'path';
import ejs from 'ejs';
import express from 'express';
import browserSync from 'browser-sync';

const webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('../webpack.config.js');

const CONST = {
  port: 4000
};

const app = express();

const compiler = webpack(webpackDevConfig);

let Stats = {};

// compiler.plugin('done', (stats) => {
//   Stats = stats;
// });

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackDevConfig.output.publicPath,
  noInfo: true,
  stats: {
    colors: true
  }
}));
app.use(webpackHotMiddleware(compiler));

app.get('*', async(req, res, next) => {
  const files = Stats.compilation.chunks.find(x => x.name === 'main').files;
  const scripts = files.filter(file => /\.js\?/.test(file));
  const styles = files.filter(file => /\.css\?/.test(file));
  const template = fs.readFileSync('../prebuild/index.ejs', 'utf8');
  const render = ejs.compile(template, { filename: './prebuild/index.ejs' });
  const output = render({
    styles: styles,
    scripts: scripts,
    publicPath: publicPath
  });
  res.send(output);
});

const bs = browserSync.create();
app.listen(CONST.port, () => {
  console.log(`Express Server Started! [http://localhost:${CONST.port}]/`);
  bs.init({
    proxy: `localhost:${CONST.port}`,
    files: ['../prebuild/**'],
    port: 8000
  });
});
