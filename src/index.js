import s from 'common/style';
import draw from 'lib/canvas';
draw();
console.log(123);
if (module.hot) {
  module.hot.accept();
}
