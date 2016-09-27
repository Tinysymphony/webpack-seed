import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import config from './webpack.config';

const DEBUG = !process.argv.includes('--release');
const DIR = DEBUG ? '../prebuild' : '../build';
const ejsFile = path.resolve(__dirname, '../src/index.ejs');
const htmlFile = path.resolve(__dirname, `${DIR}/index.html`);

function html(files) {
  const scripts = files.filter(file => /\.js$/.test(file) || /\.js\?/.test(file));
  const styles = files.filter(file => /\.css$/.test(file) || /\.css\?/.test(file));
  const template = fs.readFileSync(ejsFile, 'utf8');
  const render = ejs.compile(template, { filename: ejsFile });
  const output = render({
    styles: styles,
    scripts: scripts,
    publicPath: config.output.publicPath
  });
  fs.writeFileSync(htmlFile, output, 'utf8');
}

export default html;
