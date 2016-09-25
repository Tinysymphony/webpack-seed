const run = (task, options) => {
  const fn = require(`./${task}.js`).default;
  const startTime = new Date();
  console.log(`[${startTime}] Start -${fn.name}-`);

  return fn(options).then(resolve => {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`[${endTime}] Finished -${fn.name}- after ${duration} ms`);
  }, reject => {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`[${endTime}] Failed -${fn.name}- after ${duration} ms`);
  });
}

export default run;

if(require.main === module && process.argv.length >= 2) {
  let task = 'start';
  if(process.argv.length > 2) task = process.argv[2];
  run(task).catch(err => {
    console.log(err.stack);
    process.exit(1);
  });
}
