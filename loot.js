class Loot {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.vel.mult(2);
        this.r = 8;
        this.attractionRadius = 100;
        this.collected = false;
    }

    update(player) {
        let d = p5.Vector.dist(this.pos, player.pos);

        if (d < this.attractionRadius) {
            let attraction = p5.Vector.sub(player.pos, this.pos);
            attraction.setMag(0.5);
            this.vel.add(attraction);
        }

        this.vel.mult(0.95);
        this.pos.add(this.vel);

        if (d < player.r + this.r) {
            this.onCollect(player);
            this.collected = true;
        }
    }

    onCollect(player) {
    }

    show() {
    }

    isCollected() {
        return this.collected;
    }
}

class HealthOrb extends Loot {
    constructor(x, y) {
        super(x, y);
        this.healAmount = 20;
    }

    onCollect(player) {
        player.heal(this.healAmount);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        fill(0, 255, 100, 200);
        stroke(0, 200, 80);
        strokeWeight(2);
        ellipse(0, 0, this.r * 2, this.r * 2);

        fill(100, 255, 150, 150);
        ellipse(-this.r * 0.3, -this.r * 0.3, this.r, this.r);

        noFill();
        stroke(255, 255, 255, 100);
        strokeWeight(1);
        ellipse(0, 0, this.r * 2.5 + sin(millis() * 0.005) * 3, this.r * 2.5 + sin(millis() * 0.005) * 3);

        pop();
    }
}

class XPOrb extends Loot {
    constructor(x, y, xpAmount = 5) {
        super(x, y);
        this.xpAmount = xpAmount;
    }

    onCollect(player) {
        player.addXP(this.xpAmount);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        fill(100, 150, 255, 200);
        stroke(70, 120, 230);
        strokeWeight(2);
        ellipse(0, 0, this.r * 2, this.r * 2);

        fill(150, 200, 255, 150);
        ellipse(-this.r * 0.3, -this.r * 0.3, this.r, this.r);

        noFill();
        stroke(255, 255, 255, 100);
        strokeWeight(1);
        ellipse(0, 0, this.r * 2.5 + sin(millis() * 0.005) * 3, this.r * 2.5 + sin(millis() * 0.005) * 3);

        pop();
    }
}
