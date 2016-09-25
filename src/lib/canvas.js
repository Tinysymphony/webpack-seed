var TINY = 'wytiny',
  singlePiece = false,
  redrawFlag = true,
  pieceState = 0,
  target = {
    x: NaN,
    y: NaN
  },
  randomMap = {},
  times = 0;
  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const drawCanvas = () => {
  var canvas = document.getElementById('canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d'),
    width = window.innerWidth,
    height = window.innerHeight,
    initPos = {
      x: 20,
      y: 20
    },
    space = {
      x: 50,
      y: 50
    },
    rectSize = {
      width: 4,
      height: 4
    },
    bigSize = {
      width: 10,
      height: 10
    },
    numX, numY, pointSize;
  if(!singlePiece) {
    target.x = Math.floor(Math.random() * (width - initPos.x) / space.x) * space.x + initPos.x,
    target.y = Math.floor(Math.random() * (height - initPos.y) / space.y) * space.y + initPos.y;
    singlePiece = true;
  }
  numX = target.x;
  numY = target.y;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.fillStyle = 'rgba(244, 250, 200, 0.5)';
  for(var i = initPos.x; i < width; i += space.x) {
    for(var j = initPos.y; j < height; j += space.y) {
      ctx.fillRect(i - rectSize.width / 2, j - rectSize.height / 2, rectSize.width, rectSize.height);
      ctx.save();
      if(!randomMap['' + i + j] || redrawFlag === true) {
        randomMap['' + i + j] = Math.random(i + j);
      }
      if(randomMap['' + i + j] > 0.88) {
        ctx.fillStyle = 'rgba(244, 250, 200, 0.06)';
        ctx.fillRect(i, j, space.x, space.y);
      }
      ctx.restore();
    }
  }
  if(redrawFlag) redrawFlag = false;
  if(times % 2 === 0){
    pieceState++;
  }
  if(pieceState === 80) pieceState = 0, singlePiece = false;
  ctx.fillStyle = 'rgba(244, 250, 10, 1)';
  if(pieceState <= 40) {
    pointSize = pieceState * 0.4;
  } else {
    pointSize = 32 - pieceState * 0.4;
  }
  numX && numY && ctx.fillRect(numX - pointSize / 2, numY - pointSize / 2, pointSize, pointSize);

  times++;
  times %= 10000;
  // console.log(times, redrawFlag);
  if(times % 1200 === 0){
    redrawFlag = true;
    // console.log(redrawFlag);
  }
  requestAnimationFrame(drawCanvas);
}

export default function () {
  window.onload = function () {
    requestAnimationFrame(drawCanvas);
  };

  window.onresize = function () {
    requestAnimationFrame(drawCanvas);
  };
}
