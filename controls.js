class Controls {
    constructor() {
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false
        };
    }

    update() {
        this.keys.up = keyIsDown(UP_ARROW);
        this.keys.down = keyIsDown(DOWN_ARROW);
        this.keys.left = keyIsDown(LEFT_ARROW);
        this.keys.right = keyIsDown(RIGHT_ARROW);
        this.keys.space = keyIsDown(32);
    }

    getMovementForce(magnitude = 1.0) {
        let force = createVector(0, 0);

        if (this.keys.up) {
            force.y -= 1;
        }
        if (this.keys.down) {
            force.y += 1;
        }
        if (this.keys.left) {
            force.x -= 1;
        }
        if (this.keys.right) {
            force.x += 1;
        }

        if (force.mag() > 0) {
            force.normalize();
            force.mult(magnitude);
        }

        return force;
    }

    isShooting() {
        return this.keys.space;
    }

    isMoving() {
        return this.keys.up || this.keys.down || this.keys.left || this.keys.right;
    }
}
