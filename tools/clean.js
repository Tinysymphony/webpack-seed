import del from 'del';

async function clean() {
  await del(['prebuild/*', '!prebuild/.git', 'build/*'], { dot: true });
}

export default clean;
