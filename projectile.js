class Projectile extends Vehicle {
    constructor(x, y, direction, damage) {
        super(x, y);

        this.maxSpeed = 8;
        this.maxForce = 0.5;
        this.r = 5;
        this.damage = damage;

        this.lifespan = 3000;
        this.createdTime = millis();

        this.vel = direction.copy();
        this.vel.mult(this.maxSpeed);

        this.target = null;
    }

    findTarget(enemies) {
        let closest = null;
        let record = Infinity;

        for (let enemy of enemies) {
            let d = p5.Vector.dist(this.pos, enemy.pos);
            if (d < record && d < 300) {
                record = d;
                closest = enemy;
            }
        }

        this.target = closest;
    }

    update() {
        if (this.target && !this.target.isDead()) {
            let seekForce = this.seek(this.target.pos);
            this.applyForce(seekForce);
        }

        super.update();
    }

    isDead() {
        return millis() - this.createdTime > this.lifespan;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        fill(255, 200, 0);
        stroke(255, 150, 0);
        strokeWeight(1);
        ellipse(0, 0, this.r * 2, this.r * 2);

        fill(255, 255, 200, 150);
        ellipse(-this.r * 0.3, -this.r * 0.3, this.r, this.r);

        pop();
    }
}

class EnemyProjectile extends Vehicle {
    constructor(x, y, direction, damage, target) {
        super(x, y);

        this.maxSpeed = 6;
        this.maxForce = 0.3;
        this.r = 4;
        this.damage = damage;
        this.target = target;

        this.lifespan = 3000;
        this.createdTime = millis();

        this.vel = direction.copy();
        this.vel.mult(this.maxSpeed);
    }

    update() {
        if (this.target && !this.target.isDead()) {
            let seekForce = this.seek(this.target.pos);
            seekForce.mult(0.5);
            this.applyForce(seekForce);
        }

        super.update();
    }

    isDead() {
        return millis() - this.createdTime > this.lifespan;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        fill(255, 50, 50);
        stroke(200, 0, 0);
        strokeWeight(1);
        ellipse(0, 0, this.r * 2, this.r * 2);

        fill(255, 150, 150, 150);
        ellipse(-this.r * 0.2, -this.r * 0.2, this.r, this.r);

        pop();
    }
}
