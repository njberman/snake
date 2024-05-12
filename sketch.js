const resolution = 50;
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  gameBounds = createVector(cols * resolution, rows * resolution);
  snake = new Snake(floor(cols / 2), floor(rows / 2), resolution, gameBounds);
  textFont('monospace');

  drawGrid();
  document.getElementById('defaultCanvas0').addEventListener('click', () => {
    if (!clicked) {
      clicked = true;
      music.play();
    }
  });
}

function draw() {
  background(96, 125, 139);
  translate((width - cols * resolution) / 2, (height - rows * resolution) / 2);

  drawGrid(); // Call drawGrid function here

  if (clicked) {
    snake.show();
    if (frameCount % 10 === 0) snake.update();
  } else {
    showStartMessage();
  }
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
  stroke(255);
  fill(0);
  textSize(100);
  textAlign(CENTER, CENTER);
  text('Click anywhere to start', width / 2, height / 2 - 20);
}

function keyPressed() {
  if (keyCode === 32) {
    // Check if spacebar is pressed
    if (snake.dead) {
      restartGame();
    }
  } else {
    snake.move(key);
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
