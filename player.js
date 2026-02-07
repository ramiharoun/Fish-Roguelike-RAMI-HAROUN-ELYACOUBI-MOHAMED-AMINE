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

        this.fireRate = 2.0;
        this.lastShotTime = 0;

        this.baseSpeed = 5;
        this.maxSpeed = this.baseSpeed;
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
        this.aoeRadius = 200; // Increased range
        this.aoeDamage = 300; // Massive damage buff (was 50)

        // Dash properties
        this.dashCooldown = 5000; // 5 seconds
        this.lastDashTime = -5000; // Ready immediately
        this.dashForce = 20;
        this.dashDuration = 250; // ms to keep high speed
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

        // Unlock AOE at level 5
        if (this.level === 5 && !this.hasAOE) {
            this.hasAOE = true;
            if (typeof ui !== 'undefined') {
                ui.addMessage("AOE ABILITY UNLOCKED! Press Q", color(255, 200, 0));
            }
        }

        return true;
    }

    update() {
        // Handle Dash Speed Boost
        if (millis() - this.lastDashTime < this.dashDuration) {
            this.maxSpeed = this.baseSpeed * 4; // Allow high speed during dash
        } else {
            this.maxSpeed = this.baseSpeed;
        }

        super.update();
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

    canDash() {
        return millis() - this.lastDashTime > this.dashCooldown;
    }

    dash() {
        if (!this.canDash()) return false;

        this.lastDashTime = millis();

        // Dash in direction of movement or facing
        let dashDir = this.vel.copy();
        if (dashDir.mag() === 0) {
            dashDir = p5.Vector.fromAngle(this.heading || 0);
        }
        dashDir.normalize();
        dashDir.mult(this.dashForce);
        this.applyForce(dashDir);

        // Sound effect
        if (typeof soundManager !== 'undefined' && soundManager.playDash) {
            soundManager.playDash();
        }

        // Invulnerability during dash? Maybe short duration
        // this.invulnerableTime = millis(); 
        // this.invulnerableDuration = 200; // Short i-frame?

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
                this.baseSpeed += 0.5; // New upgrade option
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
                // Add musical bubble note during gameplay
                if (soundManager.musicGenerator) {
                    soundManager.musicGenerator.addBubbleNote();
                }
            }

            this.lastShotTime = currentTime;
        }
    }

    die() {
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
        } else {
            noTint();
        }

        // Draw the player sprite
        // Sprite is 64x48. We should scale it to match player size (r=20 -> diameter 40).
        // Let's keep aspect ratio somewhat.
        imageMode(CENTER);
        if (typeof playerSprite !== 'undefined') {
            image(playerSprite, 0, 0, this.r * 2.5, this.r * 2);
        } else {
            // Fallback if sprite not loaded
            fill(0, 150, 255);
            ellipse(0, 0, this.r * 2, this.r * 1.5);
        }

        pop();

        // Debug visualization
        if (Vehicle.debug) {
            push();
            noFill();
            strokeWeight(1);

            // AOE radius (cyan)
            if (this.hasAOE) {
                stroke(0, 255, 255, 100);
                circle(this.pos.x, this.pos.y, this.aoeRadius * 2);
            }

            // Hitbox (white)
            stroke(255, 255, 255, 150);
            circle(this.pos.x, this.pos.y, this.r * 2);

            pop();
        }
    }

    edges() {
    }
}
