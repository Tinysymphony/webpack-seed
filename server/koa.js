import path from 'path';
import koa from 'koa';
import koaStatic from 'koa-static';
import koaServeIndex from 'koa-serve-index';
import webpack from 'webpack';
import Dashboard from 'webpack-dashboard';
import DashboardPlugin from 'webpack-dashboard/plugin';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import webpackConfig from '../tools/webpack.config';

const app = koa(),
  bundler = webpack(webpackConfig),
  dashboard = new Dashboard(),
  PORT = 4000;

bundler.apply(new DashboardPlugin(dashboard.setData));

app.use(webpackDevMiddleware(bundler), {
  quiet: true,
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  lazy: false
});

app.use(webpackHotMiddleware(bundler), {log: () => {}});

app.use(koaStatic(path.join(process.cwd(), '/assets')));
app.use(koaServeIndex(path.join(process.cwd(), '/src')));

app.listen(PORT, (err) => {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Listening at localhost:${PORT}`);
});
