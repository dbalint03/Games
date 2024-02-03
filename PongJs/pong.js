const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const state = {
    left: {
        points: 0,
        position: 50, //%
        getPosition: function () {
            return this.position;
        },
        moveUp: function () {
            if (this.position <= 0) {
                return;
            }
            this.position -= 1.5;
        },
        moveDown: function () {
            if (this.position >= 100) {
                return;
            }
            this.position += 1.5;
        }
    },
    right: {
        points: 0,
        position: 50,
        getPosition: function () {
            return this.position;
        },
        moveUp: function () {
            if (this.position <= 0) {
                return;
            }
            this.position -= 1.5;
        },
        moveDown: function () {
            if (this.position >= 100) {
                return;
            }
            this.position += 1.5;
        }
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

                    if (state.left.getPosition() - 6 < this.position.y && state.left.getPosition() + 6 > this.position.y) {

                        this.speed.x *= -1;
                        this.angleBall(state.left);
                    }
                    else {
                        alert("balfasz");
                        location.reload();
                    }
                }
                else{
                    
                    if (state.right.getPosition() - 6 < this.position.y && state.right.getPosition() + 6 > this.position.y) {

                        this.speed.x *= -1;
                        this.angleBall(state.right);
                    }
                    else {
                        alert("balfasz");
                        location.reload();
                    }
                }

            }

            if (this.position.y + speedx > 99 || this.position.y + speedx < 1){
                this.speed.y *= -1;
            }

            this.position.x += speedx;
            this.position.y += this.speed.y;
        },
        angleBall: function(pong){
            console.log(pong.getPosition());
            var diff = pong.getPosition() - this.position.y;
            console.log(diff);
            this.speed.y = -diff/7;
        }
    }
}

const view = {
    leftPosition: -1,
    rightPosition: -1,
    pongWidth: 10,
    pongHeight: 100,
    ballPosition: {
        x: -1,
        x: -1
    },
    updatePositions: function () {
        this.leftPosition = 700 * (state.left.getPosition() / 100)
        this.rightPosition = 700 * (state.right.getPosition() / 100)
        this.ballPosition.x = 700 * (state.ball.getX() / 100)
        this.ballPosition.y = 700 * (state.ball.getY() / 100)
    },
    drawPositions: function () {
        context.beginPath()
        context.rect(0, this.leftPosition - this.pongHeight / 2, this.pongWidth, this.pongHeight);
        context.rect(700 - this.pongWidth, this.rightPosition - this.pongHeight / 2, this.pongWidth, this.pongHeight);
        context.arc(this.ballPosition.x, this.ballPosition.y, state.ball.width, 0, 2 * Math.PI);
        context.fill();
    },
    drawState: function () {
        this.updatePositions();
        this.drawPositions();
    }
}

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
    context.clearRect(0, 0, 700, 700)
    view.drawState();
}

document.body.addEventListener('keydown', event => {
    //console.log(event.key);
    if (event.key == 'w') {
        state.left.moveUp();
    }
    if (event.key == 's') {
        state.left.moveDown();
    }
    if (event.key == 'ArrowUp') {
        state.right.moveUp();
    }
    if (event.key == 'ArrowDown') {
        state.right.moveDown();
    }
})