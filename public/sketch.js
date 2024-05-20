const resolution = 70;
let rows;
let cols;
let snake;
let clicked = false;
const music = new Audio('/music.wav');
music.loop = true;
music.volume = 0.4;
const eatSound = new Audio('/eat.mp3');
const dieSound = new Audio('/die.mp3');
let gameBounds;
let myFilterShader;
let noiseFilterShader;
let glitchFilterShader;

function preload() {
  myFilterShader = loadShader('/shader.vert', '/shader.frag');
  noiseFilterShader = loadShader('/shader.vert', '/noise.frag');
  glitchFilterShader = loadShader('/shader.vert', '/glitch.frag');
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  gameBounds = createVector(cols * resolution, rows * resolution);
  snake = new Snake(floor(cols / 2), floor(rows / 2), resolution, gameBounds);

  document.getElementById('defaultCanvas0').addEventListener('click', () => {
    if (!clicked && !leaderBoardShowing) {
      clicked = true;
      music.play();
    }
  });

  textFont('monospace');

  // await updateLeaderBoard();
}

async function draw() {
  background(0);
  translate((width - cols * resolution) / 2, (height - rows * resolution) / 2);

  drawGrid();

  if (clicked) {
    if (!leaderBoardShowing && frameCount % 5 === 0) {
      snake.update();
    }
    snake.show();
  } else {
    showStartMessage();
  }

  if (leaderBoardShowing) {
    noiseFilterShader.setUniform('millis', millis());
    noiseFilterShader.setUniform('grainAmp', 0.1);
    filterShader(noiseFilterShader);

    glitchFilterShader.setUniform('noise', getNoiseValue());
    filterShader(glitchFilterShader);
    drawLeaderboard();
  } else {
    myFilterShader.setUniform('u_bounds', [
      (width - cols * resolution) / 2 / width,
      (height - rows * resolution) / 2 / height,
    ]);
    myFilterShader.setUniform('u_resolution', [width, height]);
    filterShader(myFilterShader);
  }
  // if (frameCount % 60 === 0) await updateLeaderBoard();
}

function getNoiseValue() {
  let v = noise(millis() / 100);
  const cutOff = 0.4;

  if (v < cutOff) {
    return 0;
  }

  v = pow(((v - cutOff) * 1) / (1 - cutOff), 2);

  return v;
}

function drawGrid() {
  stroke(0);
  strokeWeight(5);
  fill(17);
  for (let x = 0; x < cols; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      rect(x * resolution, y * resolution, resolution, resolution);
    }
  }
}

function showStartMessage() {
  strokeWeight(10);
  stroke(0);
  fill(255);
  textSize(100);
  textAlign(CENTER, CENTER);
  text(
    'Click anywhere to start',
    snake.gameBounds.x - width / 2,
    height / 2 - 20
  );
  textSize(25);
  text(
    'Press L anytime to view leaderboard (and pause game)',
    snake.gameBounds.x - width / 2,
    height / 2 + 50
  );
}

function keyPressed() {
  if (key === 'l') leaderBoardShowing = !leaderBoardShowing;
  if (!leaderBoardShowing) {
    if (key === ' ') {
      // Check if spacebar is pressed
      if (snake.dead) {
        restartGame();
      }
    } else {
      snake.move(key);
    }
  }
}

function restartGame() {
  snake = new Snake(floor(cols / 2), floor(rows / 2), resolution, gameBounds);
  dieSound.pause();
  dieSound.currentTime = 0;
  clicked = true;
  music.currentTime = 0;
  music.play();
}
