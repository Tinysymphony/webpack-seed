import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import run from './run';
import html from './html';
import MemoryFileSystem from 'memory-fs';
import webpackConfig from './webpack.config';

const RUN = !process.argv.includes('--no-server'),
  DEBUG = !process.argv.includes('--release');

async function start() {
  await run('clean');

  if(!DEBUG || !RUN) {
    await run('bundle');
    return;
  }

  // dev server
  await new Promise(resolve => {
    const publicPath = webpackConfig.output.publicPath;
    const bundler = webpack(webpackConfig);
    const memFs = bundler.outputFileSystem = new MemoryFileSystem();
    const wpMiddleware = webpackMiddleware(bundler, {
      publicPath: publicPath,
      stats: webpackConfig.stats,
      historyApiFallback: true,
      host: '127.0.0.1',
      port: 3000,
      hot: true,
      colors: true,
      quiet: false,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });

    const bs = browserSync.create();
    let doneTimes = 0;
    bundler.plugin('done', (stats) => {
      // const files = Object.keys(stats.compilation.assets);
      // html(files);
      // console.log(stats.compilation.assets['../index.html']);
      // console.log(Object.keys(stats.compilation));
      const outPath = path.resolve(__dirname, '../prebuild/index.html');
      const out = memFs.readFileSync(outPath).toString();
      fs.writeFileSync(outPath, out, 'utf-8');
      if(++doneTimes === 1) {
        bs.init({
          server: {
            baseDir: path.resolve(__dirname, '../prebuild'),
            middleware: [
              wpMiddleware,
              webpackHotMiddleware(bundler)
            ]
          }
          // proxy: 'http://localhost:8080',
        }, resolve);
      } else {
        // bs.reload();
      }
    });
  });
}

export default start;
