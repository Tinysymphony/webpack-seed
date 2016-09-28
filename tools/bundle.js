import webpack from 'webpack';
import html from './html';
import config from './webpack.config';

const bundle = () => new Promise((resolve, reject) => {
  webpack(config).run((err, stats) => {
    if(err) {
      console.log(`[${new Date()}] Create Bundle Failed. Error: ${err.stack}`);
      return reject(err);
    }
    const files = Object.keys(stats.compilation.assets);
    html(files);

    console.log(stats.toString(config.stats));
    return resolve();
  });
});

export default bundle;
