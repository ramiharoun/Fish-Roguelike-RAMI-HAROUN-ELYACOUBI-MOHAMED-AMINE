class Enemy extends Vehicle {
    constructor(x, y, level = 1) {
        super(x, y);

        this.level = level;

        let baseHP = 20;
        let baseSpeed = 2.0;
        let baseDamage = 5;

        this.maxHP = baseHP + (level - 1) * 3;
        this.currentHP = this.maxHP;

        this.maxSpeed = baseSpeed + (level - 1) * 0.15;
        this.maxForce = 0.1 + (level - 1) * 0.01;

        this.contactDamage = baseDamage + (level - 1) * 1;

        this.r = 15;
        this.xpValue = 5 + (level - 1) * 2;
        this.scoreValue = 10 + (level - 1) * 5;

        this.xpDropType = random() < 0.8 ? 'direct' : 'orb';

        this.canShoot = true;
        this.fireRate = 0.3 + (level - 1) * 0.02;
        this.lastShotTime = 0;
    }

    takeDamage(amount) {
        this.currentHP -= amount;

        if (this.currentHP <= 0) {
            this.currentHP = 0;
        }
    }

    isDead() {
        return this.currentHP <= 0;
    }

    shoot(player, enemyProjectiles) {
        if (!this.canShoot) return;

        let currentTime = millis() / 1000;

        if (currentTime - this.lastShotTime >= 1 / this.fireRate) {
            let direction = p5.Vector.sub(player.pos, this.pos);
            direction.normalize();

            let spawnPos = p5.Vector.add(this.pos, p5.Vector.mult(direction, this.r + 5));

            let projectile = new EnemyProjectile(spawnPos.x, spawnPos.y, direction, 3 + floor(this.level / 2), player);
            enemyProjectiles.push(projectile);

            if (typeof soundManager !== 'undefined') {
                soundManager.playEnemyShoot();
            }

            this.lastShotTime = currentTime;
        }
    }

    behave(player) {
        let pursueForce = this.pursue(player);
        this.applyForce(pursueForce);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        fill(255, 150, 100);
        stroke(200, 100, 50);
        strokeWeight(2);

        ellipse(0, 0, this.r * 2, this.r * 1.3);

        fill(255, 180, 130);
        triangle(this.r, 0, this.r + 8, -5, this.r + 8, 5);

        fill(255);
        ellipse(this.r * 0.3, -this.r * 0.3, this.r * 0.4, this.r * 0.4);
        fill(0);
        ellipse(this.r * 0.3, -this.r * 0.3, this.r * 0.2, this.r * 0.2);

        let hpPercentage = this.currentHP / this.maxHP;
        if (hpPercentage < 1) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            let barWidth = this.r * 2;
            let barHeight = 3;
            rect(-this.r, -this.r - 10, barWidth, barHeight);

            fill(0, 255, 0);
            noStroke();
            rect(-this.r, -this.r - 10, barWidth * hpPercentage, barHeight);
        }

        pop();
    }
}

class AggressiveFish extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, level);

        let baseSpeed = 2.3;
        let baseDamage = 7;
        let baseHP = 25;

        this.maxHP = baseHP + (level - 1) * 4;
        this.currentHP = this.maxHP;
        this.maxSpeed = baseSpeed + (level - 1) * 0.18;
        this.maxForce = 0.15 + (level - 1) * 0.01;
        this.contactDamage = baseDamage + (level - 1) * 1.5;
        this.xpValue = 8 + (level - 1) * 2;
        this.scoreValue = 15 + (level - 1) * 6;

        this.r = 16;
        this.fireRate = 0.5 + (level - 1) * 0.03;
    }

    behave(player) {
        let pursueForce = this.pursue(player);
        pursueForce.mult(1.2);
        this.applyForce(pursueForce);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        fill(220, 50, 50);
        stroke(180, 20, 20);
        strokeWeight(2);

        ellipse(0, 0, this.r * 2, this.r * 1.4);

        fill(255, 80, 80);
        triangle(this.r, 0, this.r + 10, -6, this.r + 10, 6);
        triangle(-this.r * 0.2, -this.r * 0.9, 0, -this.r * 1.3, this.r * 0.2, -this.r * 0.9);

        fill(255, 200, 0);
        ellipse(this.r * 0.4, -this.r * 0.3, this.r * 0.4, this.r * 0.4);
        fill(0);
        ellipse(this.r * 0.4, -this.r * 0.3, this.r * 0.2, this.r * 0.2);

        let hpPercentage = this.currentHP / this.maxHP;
        if (hpPercentage < 1) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            let barWidth = this.r * 2;
            let barHeight = 3;
            rect(-this.r, -this.r - 10, barWidth, barHeight);

            fill(0, 255, 0);
            noStroke();
            rect(-this.r, -this.r - 10, barWidth * hpPercentage, barHeight);
        }

        pop();
    }
}

class FastFish extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, level);

        this.maxSpeed = 4.5 + (level - 1) * 0.2;
        this.maxForce = 0.15 + (level - 1) * 0.01;
        this.r = 14;
        this.xpValue = 6 + (level - 1) * 2;
        this.scoreValue = 15 + (level - 1) * 5;
    }

    behave(player) {
        let d = p5.Vector.dist(this.pos, player.pos);

        if (d < 100) {
            let fleeForce = this.flee(player.pos);
            this.applyForce(fleeForce);
        } else if (d < 200) {
            let offset = p5.Vector.sub(this.pos, player.pos);
            offset.rotate(PI / 4);
            offset.setMag(150);
            let target = p5.Vector.add(player.pos, offset);
            let seekForce = this.seek(target);
            this.applyForce(seekForce);
        } else {
            let pursueForce = this.pursue(player);
            this.applyForce(pursueForce);
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        fill(255, 200, 50);
        stroke(230, 170, 20);
        strokeWeight(2);

        ellipse(0, 0, this.r * 2, this.r * 1.2);

        fill(255, 220, 100);
        triangle(this.r, 0, this.r + 12, -4, this.r + 12, 4);
        triangle(-this.r * 0.3, -this.r * 0.7, -this.r * 0.1, -this.r * 1.1, 0, -this.r * 0.6);

        fill(50, 50, 50);
        ellipse(this.r * 0.4, -this.r * 0.2, this.r * 0.3, this.r * 0.3);

        let hpPercentage = this.currentHP / this.maxHP;
        if (hpPercentage < 1) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            let barWidth = this.r * 2;
            let barHeight = 3;
            rect(-this.r, -this.r - 10, barWidth, barHeight);

            fill(0, 255, 0);
            noStroke();
            rect(-this.r, -this.r - 10, barWidth * hpPercentage, barHeight);
        }

        pop();
    }
}

class HeavyFish extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, level);

        this.maxHP = 60 + (level - 1) * 5;
        this.currentHP = this.maxHP;
        this.maxSpeed = 1.5 + (level - 1) * 0.1;
        this.maxForce = 0.08 + (level - 1) * 0.008;
        this.r = 25;
        this.contactDamage = 10 + (level - 1) * 2;
        this.xpValue = 12 + (level - 1) * 3;
        this.scoreValue = 25 + (level - 1) * 8;
    }

    behave(player) {
        let pursueForce = this.pursue(player);
        this.applyForce(pursueForce);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        fill(80, 80, 120);
        stroke(50, 50, 90);
        strokeWeight(3);

        ellipse(0, 0, this.r * 2, this.r * 1.5);

        fill(100, 100, 140);
        triangle(this.r, 0, this.r + 10, -8, this.r + 10, 8);
        ellipse(-this.r * 0.3, -this.r * 0.8, this.r * 0.5, this.r * 0.3);
        ellipse(-this.r * 0.3, this.r * 0.8, this.r * 0.5, this.r * 0.3);

        fill(255, 255, 100);
        ellipse(this.r * 0.5, -this.r * 0.4, this.r * 0.4, this.r * 0.4);
        fill(0);
        ellipse(this.r * 0.5, -this.r * 0.4, this.r * 0.2, this.r * 0.2);

        let hpPercentage = this.currentHP / this.maxHP;
        if (hpPercentage < 1) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            let barWidth = this.r * 2;
            let barHeight = 3;
            rect(-this.r, -this.r - 10, barWidth, barHeight);

            fill(0, 255, 0);
            noStroke();
            rect(-this.r, -this.r - 10, barWidth * hpPercentage, barHeight);
        }

        pop();
    }
}

class Jellyfish extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, level);

        this.maxHP = 40 + (level - 1) * 4;
        this.currentHP = this.maxHP;
        this.maxSpeed = 1.0 + (level - 1) * 0.08;
        this.maxForce = 0.05 + (level - 1) * 0.005;
        this.r = 20;
        this.contactDamage = 3 + (level - 1) * 1;
        this.pulseRadius = 60;
        this.pulseDamage = 1 + floor((level - 1) / 3);
        this.xpValue = 10 + (level - 1) * 2;
        this.scoreValue = 20 + (level - 1) * 6;
    }

    behave(player) {
        let pursueForce = this.pursue(player);
        pursueForce.mult(0.3);
        this.applyForce(pursueForce);

        let wanderForce = this.wander();
        wanderForce.mult(0.7);
        this.applyForce(wanderForce);
    }

    damagesInRadius(player) {
        let d = p5.Vector.dist(this.pos, player.pos);
        return d < this.pulseRadius;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let pulse = sin(millis() * 0.003) * 0.2 + 1;

        fill(200, 100, 200, 150);
        stroke(180, 80, 180);
        strokeWeight(2);

        ellipse(0, 0, this.r * 2 * pulse, this.r * 2 * pulse);

        noStroke();
        fill(220, 120, 220, 100);
        for (let i = 0; i < 8; i++) {
            let angle = (TWO_PI / 8) * i;
            let x = cos(angle) * this.r * 0.5;
            let y = sin(angle) * this.r * 0.5;
            ellipse(x, y, 5, 5);
        }

        for (let i = 0; i < 6; i++) {
            let x = random(-this.r * 0.3, this.r * 0.3);
            let y = this.r;
            let len = random(10, 20);
            stroke(200, 100, 200, 100);
            strokeWeight(2);
            line(x, y, x + random(-3, 3), y + len);
        }

        if (this.damagesInRadius(player)) {
            noFill();
            stroke(255, 100, 255, 100);
            strokeWeight(2);
            ellipse(0, 0, this.pulseRadius * 2, this.pulseRadius * 2);
        }

        let hpPercentage = this.currentHP / this.maxHP;
        if (hpPercentage < 1) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            let barWidth = this.r * 2;
            let barHeight = 3;
            rect(-this.r, -this.r - 10, barWidth, barHeight);

            fill(0, 255, 0);
            noStroke();
            rect(-this.r, -this.r - 10, barWidth * hpPercentage, barHeight);
        }

        pop();
    }
}

class Eel extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, level);

        this.maxHP = 35 + (level - 1) * 4;
        this.currentHP = this.maxHP;
        this.maxSpeed = 3.5 + (level - 1) * 0.18;
        this.maxForce = 0.2 + (level - 1) * 0.015;
        this.r = 18;
        this.contactDamage = 8 + (level - 1) * 1.5;
        this.xpValue = 9 + (level - 1) * 2;
        this.scoreValue = 18 + (level - 1) * 6;
        this.dashTimer = 0;
        this.dashCooldown = max(2000 - (level - 1) * 100, 1000);
        this.isDashing = false;
    }

    behave(player) {
        let d = p5.Vector.dist(this.pos, player.pos);

        if (d < 200 && millis() - this.dashTimer > this.dashCooldown && !this.isDashing) {
            this.isDashing = true;
            this.dashTimer = millis();
            let dashForce = this.seek(player.pos);
            dashForce.mult(3);
            this.applyForce(dashForce);

            setTimeout(() => { this.isDashing = false; }, 500);
        } else if (!this.isDashing) {
            let pursueForce = this.pursue(player);
            this.applyForce(pursueForce);
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        if (this.isDashing) {
            fill(255, 255, 100, 200);
            stroke(255, 200, 0);
        } else {
            fill(100, 150, 100);
            stroke(70, 120, 70);
        }
        strokeWeight(2);

        ellipse(0, 0, this.r * 2.5, this.r * 1);
        ellipse(this.r * 0.5, 0, this.r * 1.5, this.r * 0.8);

        fill(120, 170, 120);
        triangle(this.r * 1.25, 0, this.r * 1.5 + 8, -5, this.r * 1.5 + 8, 5);

        fill(255, 255, 0);
        ellipse(this.r * 0.8, -this.r * 0.3, this.r * 0.3, this.r * 0.3);
        fill(0);
        ellipse(this.r * 0.8, -this.r * 0.3, this.r * 0.15, this.r * 0.15);

        let hpPercentage = this.currentHP / this.maxHP;
        if (hpPercentage < 1) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            let barWidth = this.r * 2.5;
            let barHeight = 3;
            rect(-this.r * 1.25, -this.r - 10, barWidth, barHeight);

            fill(0, 255, 0);
            noStroke();
            rect(-this.r * 1.25, -this.r - 10, barWidth * hpPercentage, barHeight);
        }

        pop();
    }
}

class EliteFish extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, level);

        this.maxHP = 50 + (level - 1) * 5;
        this.currentHP = this.maxHP;
        this.maxSpeed = 2.5 + (level - 1) * 0.15;
        this.maxForce = 0.12 + (level - 1) * 0.01;
        this.r = 22;
        this.contactDamage = 8 + (level - 1) * 1.5;
        this.xpValue = 15 + (level - 1) * 3;
        this.scoreValue = 30 + (level - 1) * 8;
        this.canShoot = true;
        this.fireRate = 0.5 + (level - 1) * 0.05;
        this.lastShotTime = 0;
    }

    behave(player) {
        let d = p5.Vector.dist(this.pos, player.pos);

        if (d < 300) {
            if (d < 150) {
                let fleeForce = this.flee(player.pos);
                this.applyForce(fleeForce);
            } else {
                let offset = p5.Vector.sub(this.pos, player.pos);
                offset.rotate(PI / 3);
                offset.setMag(200);
                let target = p5.Vector.add(player.pos, offset);
                let seekForce = this.seek(target);
                this.applyForce(seekForce);
            }
        } else {
            let pursueForce = this.pursue(player);
            this.applyForce(pursueForce);
        }
    }

    shoot(player, enemyProjectiles) {
        if (!this.canShoot) return;

        let currentTime = millis() / 1000;

        if (currentTime - this.lastShotTime >= 1 / this.fireRate) {
            let direction = p5.Vector.sub(player.pos, this.pos);
            direction.normalize();

            let spawnPos = p5.Vector.add(this.pos, p5.Vector.mult(direction, this.r + 5));

            let projectile = new EnemyProjectile(spawnPos.x, spawnPos.y, direction, 5 + floor(this.level / 2), player);
            enemyProjectiles.push(projectile);

            this.lastShotTime = currentTime;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        fill(150, 50, 150);
        stroke(120, 30, 120);
        strokeWeight(2);

        ellipse(0, 0, this.r * 2, this.r * 1.4);

        fill(170, 70, 170);
        triangle(this.r, 0, this.r + 12, -7, this.r + 12, 7);
        triangle(-this.r * 0.4, -this.r * 0.9, -this.r * 0.2, -this.r * 1.4, 0, -this.r * 0.8);
        triangle(-this.r * 0.4, this.r * 0.9, -this.r * 0.2, this.r * 1.4, 0, this.r * 0.8);

        fill(255, 100, 255);
        ellipse(this.r * 0.5, -this.r * 0.3, this.r * 0.4, this.r * 0.4);
        fill(255, 0, 0);
        ellipse(this.r * 0.5, -this.r * 0.3, this.r * 0.2, this.r * 0.2);

        fill(255, 255, 0);
        textAlign(CENTER, CENTER);
        textSize(10);
        text('E', 0, this.r + 15);

        let hpPercentage = this.currentHP / this.maxHP;
        if (hpPercentage < 1) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            let barWidth = this.r * 2;
            let barHeight = 3;
            rect(-this.r, -this.r - 10, barWidth, barHeight);

            fill(0, 255, 0);
            noStroke();
            rect(-this.r, -this.r - 10, barWidth * hpPercentage, barHeight);
        }

        pop();
    }
}

class Boss extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, level);

        this.maxHP = 200 + (level - 1) * 50;
        this.currentHP = this.maxHP;
        this.maxSpeed = 2.5 + (level - 1) * 0.1;
        this.maxForce = 0.15 + (level - 1) * 0.01;
        this.r = 40;
        this.contactDamage = 15 + (level - 1) * 2;
        this.xpValue = 50 + (level - 1) * 10;
        this.scoreValue = 100 + (level - 1) * 20;

        this.behaviorTimer = 0;
        this.behaviorDuration = 3000;
        this.currentBehavior = 'pursue';

        this.canShoot = true;
        this.fireRate = 0.3 + (level - 1) * 0.03;
        this.lastShotTime = 0;
    }

    behave(player) {
        if (millis() - this.behaviorTimer > this.behaviorDuration) {
            this.behaviorTimer = millis();
            this.currentBehavior = random(['pursue', 'evade', 'circle']);
        }

        let force;
        switch (this.currentBehavior) {
            case 'pursue':
                force = this.pursue(player);
                break;
            case 'evade':
                force = this.evade(player);
                break;
            case 'circle':
                let offset = p5.Vector.sub(this.pos, player.pos);
                offset.rotate(PI / 2);
                offset.setMag(100);
                let circleTarget = p5.Vector.add(player.pos, offset);
                force = this.seek(circleTarget);
                break;
        }

        this.applyForce(force);
    }

    shoot(player, enemyProjectiles) {
        if (!this.canShoot) return;

        let currentTime = millis() / 1000;

        if (currentTime - this.lastShotTime >= 1 / this.fireRate) {
            let direction = p5.Vector.sub(player.pos, this.pos);
            direction.normalize();

            let spawnPos = p5.Vector.add(this.pos, p5.Vector.mult(direction, this.r + 5));

            let projectile = new EnemyProjectile(spawnPos.x, spawnPos.y, direction, 8 + floor(this.level / 2), player);
            enemyProjectiles.push(projectile);

            this.lastShotTime = currentTime;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        fill(100, 50, 150);
        stroke(70, 30, 120);
        strokeWeight(3);

        ellipse(0, 0, this.r * 2, this.r * 1.5);

        fill(120, 70, 170);
        triangle(this.r, 0, this.r + 20, -12, this.r + 20, 12);
        triangle(-this.r * 0.5, -this.r, -this.r * 0.2, -this.r * 1.5, 0, -this.r * 0.8);
        triangle(-this.r * 0.5, this.r, -this.r * 0.2, this.r * 1.5, 0, this.r * 0.8);

        fill(255, 0, 0);
        ellipse(this.r * 0.5, -this.r * 0.4, this.r * 0.5, this.r * 0.5);
        fill(0);
        ellipse(this.r * 0.5, -this.r * 0.4, this.r * 0.25, this.r * 0.25);

        let hpPercentage = this.currentHP / this.maxHP;
        noFill();
        stroke(255, 0, 0);
        strokeWeight(3);
        let barWidth = this.r * 2.5;
        let barHeight = 5;
        rect(-this.r * 1.25, -this.r - 20, barWidth, barHeight);

        fill(255, 0, 0);
        noStroke();
        rect(-this.r * 1.25, -this.r - 20, barWidth * hpPercentage, barHeight);

        fill(255, 255, 0);
        textAlign(CENTER, CENTER);
        textSize(12);
        text('BOSS', 0, -this.r - 35);

        pop();
    }
}
