class Spawner {
    constructor(worldWidth, worldHeight, camera) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.camera = camera;
        this.spawnMargin = 100;
        this.lastSpawnTime = 0;

        this.baseSpawnInterval = 2000;
        this.baseMaxEnemies = 15;
    }

    update(gameState, enemies, player) {
        // Don't spawn regular enemies during boss fight
        if (bossMode) {
            return;
        }

        let maxEnemies = this.getMaxEnemies(player.level);
        let spawnInterval = this.getSpawnInterval(player.level);

        if (enemies.length < maxEnemies && millis() - this.lastSpawnTime > spawnInterval) {
            this.spawnEnemy(gameState, enemies, player);
            this.lastSpawnTime = millis();
        }
    }

    getMaxEnemies(level) {
        return min(this.baseMaxEnemies + (level - 1) * 2, 40);
    }

    getSpawnInterval(level) {
        return max(this.baseSpawnInterval - (level - 1) * 100, 500);
    }

    spawnEnemy(gameState, enemies, player) {
        let spawnPos = this.getSpawnPosition(player);
        let level = player.level;

        let enemy;
        let roll = random();

        // Progressive difficulty curve - enemy types unlock gradually
        if (level <= 2) {
            // Levels 1-2: Basic enemies only (learning phase)
            enemy = new Enemy(spawnPos.x, spawnPos.y, level);
        }
        else if (level <= 5) {
            // Levels 3-5: Introduce Aggressive and Fast enemies
            if (roll < 0.5) {
                enemy = new Enemy(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.8) {
                enemy = new AggressiveFish(spawnPos.x, spawnPos.y, level);
            } else {
                enemy = new FastFish(spawnPos.x, spawnPos.y, level);
            }
        }
        else if (level <= 10) {
            // Levels 6-10: Add Tanks and Jellyfish
            if (roll < 0.25) {
                enemy = new Enemy(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.45) {
                enemy = new AggressiveFish(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.65) {
                enemy = new FastFish(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.85) {
                enemy = new HeavyFish(spawnPos.x, spawnPos.y, level);
            } else {
                enemy = new Jellyfish(spawnPos.x, spawnPos.y, level);
            }
        }
        else {
            // Levels 11+: All enemy types including Eel and Elite
            if (roll < 0.15) {
                enemy = new Enemy(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.30) {
                enemy = new AggressiveFish(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.45) {
                enemy = new FastFish(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.60) {
                enemy = new HeavyFish(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.75) {
                enemy = new Jellyfish(spawnPos.x, spawnPos.y, level);
            } else if (roll < 0.88) {
                enemy = new Eel(spawnPos.x, spawnPos.y, level);
            } else {
                enemy = new EliteFish(spawnPos.x, spawnPos.y, level);
            }
        }

        enemies.push(enemy);
    }

    spawnBoss(gameState, enemies, player) {
        let spawnPos = this.getSpawnPosition(player);
        let boss = new Boss(spawnPos.x, spawnPos.y, player.level);
        enemies.push(boss);

        // Elite guard spawns for high-level bosses
        let eliteCount = 0;
        if (player.level === 15) {
            eliteCount = 2;
        } else if (player.level === 20) {
            eliteCount = 4;
        }

        // Spawn elites in circular formation around boss
        for (let i = 0; i < eliteCount; i++) {
            let angle = (TWO_PI / eliteCount) * i;
            let distance = 200;
            let eliteX = spawnPos.x + cos(angle) * distance;
            let eliteY = spawnPos.y + sin(angle) * distance;

            // Clamp to world bounds
            eliteX = constrain(eliteX, 50, worldWidth - 50);
            eliteY = constrain(eliteY, 50, worldHeight - 50);

            let elite = new EliteFish(eliteX, eliteY, player.level);
            elite.isEliteGuard = true; // Special marker for visual distinction
            enemies.push(elite);
        }
    }

    getSpawnPosition(player) {
        let side = floor(random(4));
        let x, y;

        switch (side) {
            case 0:
                x = this.camera.x - width / 2 - this.spawnMargin;
                y = this.camera.y + random(-height / 2, height / 2);
                break;
            case 1:
                x = this.camera.x + width / 2 + this.spawnMargin;
                y = this.camera.y + random(-height / 2, height / 2);
                break;
            case 2:
                x = this.camera.x + random(-width / 2, width / 2);
                y = this.camera.y - height / 2 - this.spawnMargin;
                break;
            case 3:
                x = this.camera.x + random(-width / 2, width / 2);
                y = this.camera.y + height / 2 + this.spawnMargin;
                break;
        }

        x = constrain(x, 50, this.worldWidth - 50);
        y = constrain(y, 50, this.worldHeight - 50);

        return createVector(x, y);
    }
}
