const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const state = {
  left: {
    points: 0,
    position: 50, //%
    speed: 2,
    getPosition: function () {
      return this.position;
    },
    moveUp: function () {
      if (this.position <= 0) {
        return;
      }
      this.position -= this.speed;
    },
    moveDown: function () {
      if (this.position >= 100) {
        return;
      }
      this.position += this.speed;
    },
  },
  right: {
    points: 0,
    position: 50,
    speed: 2,
    getPosition: function () {
      return this.position;
    },
    moveUp: function () {
      if (this.position <= 0) {
        return;
      }
      this.position -= this.speed;
    },
    moveDown: function () {
      if (this.position >= 100) {
        return;
      }
      this.position += this.speed;
    },
  },
  ball: {
    position: {
      x: 50,
      y: 50,
    },
    speed: {
      x: -1,
      y: 0,
    },
    width: 10,
    getX: function () {
      return this.position.x;
    },
    getY: function () {
      return this.position.y;
    },
    moveLeft: function () {
      this.position.x -= 1;
    },
    moveRight: function () {
      this.position.x += 1;
    },
    move: function () {
      var speedx = this.speed.x;
      console.log(this.position.y);
      console.log(state.left.getPosition());
      if (this.position.x + speedx > 99 || this.position.x + speedx < 1) {
        if (speedx < 0) {
          if (
            state.left.getPosition() - 9 < this.position.y &&
            state.left.getPosition() + 6 > this.position.y
          ) {
            this.speed.x *= -1;
            this.angleBall(state.left);
          } else {
            alert("right win");
            location.reload();
          }
        } else {
          if (
            state.right.getPosition() - 6 < this.position.y &&
            state.right.getPosition() + 6 > this.position.y
          ) {
            this.speed.x *= -1;
            this.angleBall(state.right);
          } else {
            alert("left win");
            location.reload();
          }
        }
      }

      if (this.position.y + speedx > 99 || this.position.y + speedx < 1) {
        this.speed.y *= -1;
      }

      this.position.x += speedx;
      this.position.y += this.speed.y;
    },
    angleBall: function (pong) {
      console.log(pong.getPosition());
      var diff = pong.getPosition() - this.position.y;
      console.log(diff);
      this.speed.y = -diff / 7;
    },
  },
};

const view = {
  leftPosition: -1,
  rightPosition: -1,
  pongWidth: 10,
  pongHeight: 100,
  canvasWidth: 600,
  ballPosition: {
    x: -1,
    x: -1,
  },
  updatePositions: function () {
    this.leftPosition = this.canvasWidth * (state.left.getPosition() / 100);
    this.rightPosition = this.canvasWidth * (state.right.getPosition() / 100);
    this.ballPosition.x = this.canvasWidth * (state.ball.getX() / 100);
    this.ballPosition.y = this.canvasWidth * (state.ball.getY() / 100);
  },
  drawPositions: function () {
    context.beginPath();
    context.rect(
      0,
      this.leftPosition - this.pongHeight / 2,
      this.pongWidth,
      this.pongHeight
    );
    context.rect(
      this.canvasWidth - this.pongWidth,
      this.rightPosition - this.pongHeight / 2,
      this.pongWidth,
      this.pongHeight
    );
    context.arc(
      this.ballPosition.x,
      this.ballPosition.y,
      state.ball.width,
      0,
      2 * Math.PI
    );
    context.fill();
  },
  drawState: function () {
    this.updatePositions();
    this.drawPositions();
  },
};

function next() {
  update(); // Update current state
  render(); // Rerender the frame
  requestAnimationFrame(next);
}

next(); // Start the loop

function update() {
  //state.ball.moveLeft();
  state.ball.move();
}

function render() {
  context.clearRect(0, 0, 700, 700);
  view.drawState();
}

document.body.addEventListener("keydown", (event) => {
  //console.log(event.key);
  switch (event.key) {
    case "w":
      state.left.moveUp();
      break;
    case "s":
      state.left.moveDown();
      break;
    case "ArrowUp":
      state.right.moveUp();
      break;
    case "ArrowDown":
      state.right.moveDown();
      break;
  }
  //   if (event.key == "w") {
  //     state.left.moveUp();
  //   }
  //   if (event.key == "s") {
  //     state.left.moveDown();
  //   }
  //   if (event.key == "ArrowUp") {
  //     state.right.moveUp();
  //   }
  //   if (event.key == "ArrowDown") {
  //     state.right.moveDown();
  //   }
});
