class Player extends Vehicle {
    constructor(x, y) {
        super(x, y);

        this.maxHP = 100;
        this.currentHP = 100;

        this.xp = 0;
        this.level = 1;
        this.xpToNextLevel = 10;

        this.damage = 10;
        this.fireRate = 2.0;
        this.lastShotTime = 0;

        this.maxSpeed = 5;
        this.maxForce = 0.3;
        this.r = 20;

        this.invulnerableTime = 0;
        this.invulnerableDuration = 1000;

        // HP Regeneration
        this.hpRegen = 1; // 1 HP per second by default
        this.lastRegenTime = millis();

        // AOE Attack properties
        this.hasAOE = false;
        this.aoeCooldown = 8000; // 8 seconds
        this.lastAOETime = 0;
        this.aoeRadius = 150;
        this.aoeDamage = 50;
    }

    takeDamage(amount) {
        if (millis() - this.invulnerableTime < this.invulnerableDuration) {
            return;
        }

        this.currentHP -= amount;
        this.invulnerableTime = millis();

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.die();
        }
    }

    heal(amount) {
        this.currentHP = min(this.currentHP + amount, this.maxHP);
    }

    addXP(amount) {
        this.xp += amount;

        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp = 0;

        // New logarithmic formula: 10 + level * 8 + floor(log(level) * 15)
        // Example: Level 1→2: 18 XP, Level 5→6: 58 XP, Level 10→11: 106 XP
        this.xpToNextLevel = 10 + this.level * 8 + Math.floor(Math.log(this.level + 1) * 15);

        // Unlock AOE at level 10
        if (this.level === 10 && !this.hasAOE) {
            this.hasAOE = true;
        }

        return true;
    }

    canUseAOE() {
        return this.hasAOE && (millis() - this.lastAOETime > this.aoeCooldown);
    }

    useAOE(enemies, particles) {
        if (!this.canUseAOE()) return false;

        this.lastAOETime = millis();

        // Create visual effect
        particles.push(new AOEExplosion(this.pos.x, this.pos.y, this.aoeRadius));

        // Deal damage to all enemies in radius
        let hitCount = 0;
        for (let enemy of enemies) {
            let d = p5.Vector.dist(this.pos, enemy.pos);
            if (d < this.aoeRadius) {
                enemy.takeDamage(this.aoeDamage);
                hitCount++;
            }
        }

        // Play sound if available
        if (typeof soundManager !== 'undefined' && soundManager.playAOE) {
            soundManager.playAOE();
        }

        return true;
    }

    applyUpgrade(upgradeType) {
        switch (upgradeType) {
            case 'maxHP':
                this.maxHP += 20;
                this.currentHP = this.maxHP;
                break;
            case 'fireRate':
                this.fireRate = min(this.fireRate + 0.5, 5.0);
                break;
            case 'damage':
                this.damage += 8; // Increased from 5 to 8
                break;
            case 'speed':
                this.maxSpeed += 0.5; // New upgrade option
                break;
            case 'regen':
                this.hpRegen += 0.5; // +0.5 HP/s per upgrade
                break;
        }
    }

    shoot(projectiles) {
        let currentTime = millis() / 1000;

        if (currentTime - this.lastShotTime >= 1 / this.fireRate) {
            let direction = this.vel.copy();
            if (direction.mag() === 0) {
                direction = createVector(1, 0);
            }
            direction.normalize();

            let spawnPos = p5.Vector.add(this.pos, p5.Vector.mult(direction, this.r + 10));

            let projectile = new Projectile(spawnPos.x, spawnPos.y, direction, this.damage);
            projectiles.push(projectile);

            if (typeof soundManager !== 'undefined') {
                soundManager.playPlayerShoot();
            }

            this.lastShotTime = currentTime;
        }
    }

    die() {
        console.log('Player died!');
    }

    isDead() {
        return this.currentHP <= 0;
    }

    isInvulnerable() {
        return millis() - this.invulnerableTime < this.invulnerableDuration;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        let angle = this.vel.heading();
        rotate(angle);

        if (this.isInvulnerable() && Math.floor(millis() / 100) % 2 === 0) {
            tint(255, 100);
        }

        fill(100, 100, 200);
        stroke(50, 50, 150);
        strokeWeight(2);

        triangle(
            this.r * 1.5, 0,
            -this.r, -this.r * 0.8,
            -this.r, this.r * 0.8
        );

        fill(80, 80, 180);
        triangle(-this.r, -this.r * 0.5, -this.r * 1.3, -this.r * 1.2, -this.r * 0.7, -this.r * 0.3);
        triangle(-this.r, this.r * 0.5, -this.r * 1.3, this.r * 1.2, -this.r * 0.7, this.r * 0.3);

        fill(255);
        ellipse(this.r * 0.3, -this.r * 0.3, this.r * 0.3, this.r * 0.3);
        fill(0);
        ellipse(this.r * 0.3, -this.r * 0.3, this.r * 0.15, this.r * 0.15);

        pop();
    }

    edges() {
    }
}
