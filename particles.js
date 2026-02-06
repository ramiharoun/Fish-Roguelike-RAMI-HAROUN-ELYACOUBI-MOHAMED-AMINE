class Particle {
    constructor(x, y, color = [255, 255, 255]) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-2, 2), random(-2, 2));
        this.lifespan = 255;
        this.color = color;
        this.size = random(3, 8);
    }

    update() {
        this.pos.add(this.vel);
        this.vel.mult(0.95);
        this.lifespan -= 5;
    }

    isDead() {
        return this.lifespan <= 0;
    }

    show() {
        push();
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], this.lifespan);
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
        pop();
    }
}

class AOEExplosion {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.maxRadius = radius;
        this.currentRadius = 0;
        this.alpha = 255;
        this.lifetime = 500; // ms
        this.startTime = millis();
    }

    update() {
        let elapsed = millis() - this.startTime;
        let progress = elapsed / this.lifetime;

        this.currentRadius = this.maxRadius * progress;
        this.alpha = 255 * (1 - progress);
    }

    show() {
        push();
        noFill();

        // Outer ring
        stroke(255, 215, 0, this.alpha);
        strokeWeight(4);
        circle(this.x, this.y, this.currentRadius * 2);

        // Inner ring
        stroke(255, 255, 255, this.alpha * 0.5);
        strokeWeight(2);
        circle(this.x, this.y, this.currentRadius * 1.5);

        // Core flash
        fill(255, 215, 0, this.alpha * 0.3);
        noStroke();
        circle(this.x, this.y, this.currentRadius * 0.5);

        pop();
    }

    isDead() {
        return millis() - this.startTime > this.lifetime;
    }
}

function createEnemyDeathParticles(x, y) {
    let particles = [];
    let count = random(8, 15);

    for (let i = 0; i < count; i++) {
        let color = [
            random(200, 255),
            random(100, 200),
            random(50, 100)
        ];
        particles.push(new Particle(x, y, color));
    }

    return particles;
}
