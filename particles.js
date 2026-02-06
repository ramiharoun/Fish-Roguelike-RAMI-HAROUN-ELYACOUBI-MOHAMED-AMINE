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
