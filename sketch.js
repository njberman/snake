const resolution = 50;
let rows;
let cols;

let snake;

let clicked = false;

const music = new Audio('/music.wav');
music.loop = true;
music.volume = 0.4;

const eatSound = new Audio('/eat.mp3');
eatSound.playbackRate = 2.0;

const dieSound = new Audio('/die.mp3');

function setup() {
  createCanvas(windowWidth, windowHeight);

  cols = floor(width / resolution);
  rows = floor(height / resolution);

  snake = new Snake(floor(cols / 2), floor(rows / 2), resolution);

  textFont('monospace');

  document.getElementById('defaultCanvas0').addEventListener('click', () => {
    if (!clicked) {
      clicked = true;
      music.play();
      console.log('HI');
    }
  });
}

function draw() {
  background(96, 125, 139);

  translate((width - cols * resolution) / 2, (height - rows * resolution) / 2);

  stroke(0);
  strokeWeight(5);
  fill(17);
  for (let x = 0; x < cols; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      rect(x * resolution, y * resolution, resolution, resolution);
    }
  }
  if (clicked) {
    snake.show();
    if (frameCount % 10 === 0) snake.update();
  } else {
    stroke(255);
    fill(0);
    textSize(100);
    textAlign(CENTER, CENTER);
    text('Click anywhere to start', width / 2, height / 2 - 20);
  }
}

function keyPressed() {
  snake.move(key);
}
