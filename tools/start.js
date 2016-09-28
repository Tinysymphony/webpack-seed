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
      stats: webpackConfig.stats
    });

    const bs = browserSync.create();
    let doneTimes = 0;
    bundler.plugin('done', (stats) => {
      // const files = Object.keys(stats.compilation.assets);
      // html(files);
      const outPath = path.resolve(__dirname, '../prebuild/index.html');
      const out = memFs.readFileSync(outPath).toString();
      fs.writeFileSync(outPath, out, 'utf-8');
      if(++doneTimes === 1) {
        bs.init({
          server: {
            baseDir: path.resolve(__dirname, '../prebuild'),
            middleware: [
              wpMiddleware,
              webpackHotMiddleware(bundler),
            ]
          }
        }, resolve);
      }
    });
  });
}

export default start;
