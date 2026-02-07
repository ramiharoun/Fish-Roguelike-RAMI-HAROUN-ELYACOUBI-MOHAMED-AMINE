class Enemy extends Vehicle {
    constructor(x, y, level = 1) {
        super(x, y);

        this.level = level;

        // Base stats
        let baseHP = 20;
        let baseSpeed = 2.0;
        let baseDamage = 5;

        // Scaling formulas with soft exponential growth
        let levelMultiplier = 1 + (level - 1) * 0.15; // 1.0 → 2.35 at level 10
        let powerMultiplier = Math.pow(1.1, level - 1); // 1.0 → 2.36 at level 10

        this.maxHP = Math.floor(baseHP * levelMultiplier * powerMultiplier);
        this.currentHP = this.maxHP;

        this.maxSpeed = baseSpeed * (1 + (level - 1) * 0.08);
        this.maxForce = 0.1 * (1 + (level - 1) * 0.05);

        this.contactDamage = Math.floor(baseDamage * levelMultiplier);

        this.r = 15;

        // Scaling rewards
        this.xpValue = Math.floor(5 * levelMultiplier);
        this.scoreValue = Math.floor(10 * powerMultiplier);

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

    shouldPursue(player) {
        return p5.Vector.dist(this.pos, player.pos) < 800;
    }

    behave(player) {
        if (this.shouldPursue(player)) {
            let pursueForce = this.pursue(player);
            this.applyForce(pursueForce);
        } else {
            let wanderForce = this.wander();
            this.applyForce(wanderForce);
        }
    }

    getRoleIcon() {
        return '•'; // Basic enemy has simple dot
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        imageMode(CENTER);
        image(enemySprites['enemy'], 0, 0, this.r * 3, this.r * 3);

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

        // Draw role icon above enemy (outside rotation)
        push();
        translate(this.pos.x, this.pos.y);
        textAlign(CENTER, CENTER);
        textSize(14);
        fill(255, 255, 255, 200);
        strokeWeight(2);
        stroke(0, 0, 0, 150);
        text(this.getRoleIcon(), 0, -this.r - 25);
        pop();

        // Debug visualization
        if (Vehicle.debug) {
            push();
            noFill();
            strokeWeight(1);

            // Detection radius (red)
            stroke(255, 0, 0, 100);
            circle(this.pos.x, this.pos.y, this.detectionRadius * 2);

            // Attack range (green)
            stroke(0, 255, 0, 100);
            circle(this.pos.x, this.pos.y, this.attackRange * 2);

            // Hitbox (yellow)
            stroke(255, 255, 0, 150);
            circle(this.pos.x, this.pos.y, this.r * 2);

            pop();
        }
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
        if (!this.shouldPursue(player)) {
            this.applyForce(this.wander());
            return;
        }
        let pursueForce = this.pursue(player);
        pursueForce.mult(1.2);
        this.applyForce(pursueForce);
    }

    getRoleIcon() {
        return '⚔️'; // Aggressive - sword for attack
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        imageMode(CENTER);
        image(enemySprites['aggressive'], 0, 0, this.r * 3, this.r * 3);

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
        } else if (this.shouldPursue(player)) {
            let pursueForce = this.pursue(player);
            this.applyForce(pursueForce);
        } else {
            this.applyForce(this.wander());
        }
    }

    getRoleIcon() {
        return '⚡'; // Fast - lightning bolt
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        imageMode(CENTER);
        image(enemySprites['fast'], 0, 0, this.r * 3, this.r * 3);

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
        if (this.shouldPursue(player)) {
            let pursueForce = this.pursue(player);
            this.applyForce(pursueForce);
        } else {
            this.applyForce(this.wander());
        }
    }

    getRoleIcon() {
        return '🛡️'; // Heavy - shield for tank
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        imageMode(CENTER);
        image(enemySprites['heavy'], 0, 0, this.r * 3.5, this.r * 3.5);

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
        this.pulseRadius = 120; // Increased from 60 to 120 (+100%)
        this.pulseDamage = 1 + floor((level - 1) / 3);
        this.xpValue = 10 + (level - 1) * 2;
        this.scoreValue = 20 + (level - 1) * 6;
    }

    behave(player) {
        if (this.shouldPursue(player)) {
            let pursueForce = this.pursue(player);
            pursueForce.mult(0.3);
            this.applyForce(pursueForce);
        }

        let wanderForce = this.wander();
        wanderForce.mult(0.7);
        this.applyForce(wanderForce);
    }

    getRoleIcon() {
        return '🌀'; // Jellyfish - pulsing/area effect
    }

    damagesInRadius(player) {
        let d = p5.Vector.dist(this.pos, player.pos);
        return d < this.pulseRadius;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let pulse = sin(millis() * 0.003) * 0.2 + 1;

        imageMode(CENTER);
        image(enemySprites['jellyfish'], 0, 0, this.r * 3 * pulse, this.r * 3 * pulse);

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
            if (this.shouldPursue(player)) {
                let pursueForce = this.pursue(player);
                this.applyForce(pursueForce);
            } else {
                this.applyForce(this.wander());
            }
        }
    }

    getRoleIcon() {
        return '🎯'; // Eel - target/dash attack
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        if (this.isDashing) {
            tint(255, 255, 100);
        } else {
            tint(255);
        }

        imageMode(CENTER);
        image(enemySprites['eel'], 0, 0, this.r * 4, this.r * 3);
        noTint();

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
            if (this.shouldPursue(player)) {
                let pursueForce = this.pursue(player);
                this.applyForce(pursueForce);
            } else {
                this.applyForce(this.wander());
            }
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

        // Red aura for elite guards
        if (this.isEliteGuard) {
            noFill();
            let pulseAlpha = map(sin(millis() * 0.005), -1, 1, 50, 150);
            stroke(255, 0, 0, pulseAlpha);
            strokeWeight(2);
            circle(0, 0, this.r * 5);
        }

        imageMode(CENTER);
        image(enemySprites['elite'], 0, 0, this.r * 3.5, this.r * 3.5);

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

        // New exponential scaling for endgame challenge
        let baseHP = 300;
        let baseDamage = 25;
        let baseSpeed = 1.8;

        // Exponential multipliers for harder endgame
        let hpMultiplier = Math.pow(1.5, level - 1);
        let damageMultiplier = Math.pow(1.3, level - 1);

        this.maxHP = baseHP * hpMultiplier;
        this.currentHP = this.maxHP;
        this.contactDamage = baseDamage * damageMultiplier;
        this.maxSpeed = baseSpeed + (level - 1) * 0.1;
        this.maxForce = 0.15 + (level - 1) * 0.01;

        // Level 20 boss: massive buff
        if (level >= 20) {
            this.maxHP *= 2;
            this.currentHP = this.maxHP;
            this.contactDamage *= 1.5;
            this.maxSpeed *= 1.2;
        }

        this.r = 40;
        this.xpValue = 50 + (level - 1) * 15;
        this.scoreValue = 100 + (level - 1) * 25;

        this.behaviorTimer = 0;
        this.behaviorDuration = 2000; // Faster behavior switching
        this.currentBehavior = 'pursue';

        this.canShoot = true;
        this.fireRate = 0.4 + (level - 1) * 0.04; // Increased fire rate
        this.lastShotTime = 0;
    }

    behave(player) {
        if (millis() - this.behaviorTimer > this.behaviorDuration) {
            this.behaviorTimer = millis();

            let d = p5.Vector.dist(this.pos, player.pos);

            // More aggressive behavior selection
            if (d < 200) {
                this.currentBehavior = random() < 0.7 ? 'pursue' : 'circle';
            } else {
                this.currentBehavior = random(['pursue', 'circle']);
            }
        }

        let force;
        switch (this.currentBehavior) {
            case 'pursue':
                force = this.pursue(player);
                force.mult(1.8); // Much stronger pursuit
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
                force.mult(1.4);
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

        // Draw boss sprite with tint based on behavior
        if (this.currentBehavior === 'evade') {
            tint(255, 200, 200); // Slight red tint when evading
        } else {
            tint(255); // Normal color
        }

        imageMode(CENTER);
        image(bossSprite, 0, 0, this.r * 4, this.r * 4);

        noTint();

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
