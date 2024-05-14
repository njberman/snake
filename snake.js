const randInt = (min, max) => {
  if (!max) {
    max = min;
    min = 0;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Snake {
  constructor(startX, startY, res, gameBounds) {
    this.res = res;
    this.gameBounds = gameBounds;

    this.head = createVector(startX * this.res, startY * this.res);
    this.tail = [];
    this.velocity = createVector(0, 0);
    this.randomApple();
    this.dead = false;
    this.score = 0;
  }

  updateScore() {
    this.score = this.tail.length;
  }

  checkTail(pos, checkAgainstHead) {
    if (checkAgainstHead)
      return (
        this.tail.some((item) => item.x === pos.x && item.y === pos.y) ||
        (this.head.x === pos.x && this.head.y === pos.y)
      );
    else return this.tail.some((item) => item.x === pos.x && item.y === pos.y);
  }

  randomApple() {
    const maxAttempts = 100;
    for (let i = 0; i < maxAttempts; i++) {
      this.apple = createVector(randInt(cols), randInt(rows));
      this.apple.mult(this.res);
      if (
        !this.checkTail(this.apple, true) &&
        this.apple.x >= 0 &&
        this.apple.y >= 0 &&
        this.apple.x < this.gameBounds.x &&
        this.apple.y < this.gameBounds.y
      ) {
        break;
      }
    }
  }

  show() {
    // Show Score
    textSize(500);
    noStroke();
    fill(255, 100);
    textAlign(CENTER, CENTER);
    text(this.score, this.gameBounds.x - width / 2, height / 2);

    // Draw line between each tailSegment
    for (let i = 0; i < this.tail.length - 1; i++) {
      stroke(255);
      line(
        this.tail[i].x + this.res / 2,
        this.tail[i].y + this.res / 2,
        this.tail[i + 1].x + this.res / 2,
        this.tail[i + 1].y + this.res / 2
      );
    }
    stroke(0);
    fill(230, 100, 34, 200);
    rect(this.head.x, this.head.y, this.res, this.res);
    fill(255, 0, 0, 200);
    for (const tailSegment of this.tail) {
      rect(tailSegment.x, tailSegment.y, this.res, this.res);
    }

    fill(76, 175, 80, 200);
    rect(this.apple.x, this.apple.y, this.res, this.res);

    if (this.dead) {
      strokeWeight(10);

      fill(255);
      textSize(125);
      text('YOU DED BOI', this.gameBounds.x - width / 2, height / 2 - 50);
      textSize(75);
      strokeWeight(10);
      text(
        '[space] to restart',
        this.gameBounds.x - width / 2,
        height / 2 + 40
      );
    }
  }

  move(key) {
    if (!this.dead) {
      if (this.tail.length !== 0) {
        if (
          (key === 'w' || key === 'ArrowUp') &&
          !(this.velocity.x === 0 && this.velocity.y === 1)
        ) {
          this.velocity = createVector(0, -1);
        } else if (
          (key === 's' || key === 'ArrowDown') &&
          !(this.velocity.x === 0 && this.velocity.y === -1)
        ) {
          this.velocity = createVector(0, 1);
        } else if (
          (key === 'a' || key === 'ArrowLeft') &&
          !(this.velocity.x === 1 && this.velocity.y === 0)
        ) {
          this.velocity = createVector(-1, 0);
        } else if (
          (key === 'd' || key === 'ArrowRight') &&
          !(this.velocity.x === -1 && this.velocity.y === 0)
        ) {
          this.velocity = createVector(1, 0);
        }
      } else {
        if (key === 'w' || key === 'ArrowUp') {
          this.velocity = createVector(0, -1);
        } else if (key === 's' || key === 'ArrowDown') {
          this.velocity = createVector(0, 1);
        } else if (key === 'a' || key === 'ArrowLeft') {
          this.velocity = createVector(-1, 0);
        } else if (key === 'd' || key === 'ArrowRight') {
          this.velocity = createVector(1, 0);
        }
      }
    }
  }

  checkHead(head) {
    return !(
      head.x < 0 ||
      head.x >= this.gameBounds.x ||
      head.y < 0 ||
      head.y >= this.gameBounds.y
    );
  }

  update() {
    if (
      !(this.velocity.x === this.velocity.y && this.velocity.x === 0) &&
      !this.dead
    ) {
      const newHead = p5.Vector.add(
        this.head,
        p5.Vector.mult(this.velocity, this.res)
      );
      if (this.checkHead(newHead)) {
        let prevEndTail = undefined;
        const prevTail = this.tail.slice();

        if (this.tail.length !== 0) {
          this.tail[0] = this.head;
          prevEndTail = prevTail[prevTail.length - 1];
          for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i + 1] = prevTail[i];
          }
          if (this.checkTail(newHead, false)) {
            this.tail = prevTail;
            this.dead = true;
            dieSound.play();
            music.pause();
            return;
          }
        } else {
          if (!this.checkHead(newHead)) {
            this.dead = true;
            dieSound.play();
            music.pause();
            return;
          }
        }

        if (!this.checkHead(newHead)) {
          this.tail = prevTail;
          this.dead = true;
          dieSound.play();
          music.pause();
          return;
        }
        this.head = newHead;

        // Check if we have hit ourselves

        // Check for new fruit
        this.eat(prevEndTail || this.head);
      } else {
        this.dead = true;
        dieSound.play();
        music.pause();
      }
    }
  }

  eat(endTail) {
    if (this.head.x === this.apple.x && this.head.y === this.apple.y) {
      this.tail.push(endTail);
      this.randomApple();
      this.updateScore();
      eatSound.play();
    }
  }
}
