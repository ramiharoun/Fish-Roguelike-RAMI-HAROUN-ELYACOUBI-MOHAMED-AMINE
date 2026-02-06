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
        let maxEnemies = this.getMaxEnemies(gameState.level);
        let spawnInterval = this.getSpawnInterval(gameState.level);

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
        let level = gameState.level;

        let enemy;
        let roll = random();

        if (level < 2) {
            enemy = new Enemy(spawnPos.x, spawnPos.y, level);
        } else if (level < 4) {
            if (roll < 0.6) enemy = new Enemy(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.9) enemy = new AggressiveFish(spawnPos.x, spawnPos.y, level);
            else enemy = new FastFish(spawnPos.x, spawnPos.y, level);
        } else if (level < 7) {
            if (roll < 0.3) enemy = new Enemy(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.5) enemy = new AggressiveFish(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.7) enemy = new FastFish(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.9) enemy = new HeavyFish(spawnPos.x, spawnPos.y, level);
            else enemy = new Jellyfish(spawnPos.x, spawnPos.y, level);
        } else {
            if (roll < 0.2) enemy = new Enemy(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.35) enemy = new AggressiveFish(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.5) enemy = new FastFish(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.65) enemy = new HeavyFish(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.8) enemy = new Jellyfish(spawnPos.x, spawnPos.y, level);
            else if (roll < 0.9) enemy = new Eel(spawnPos.x, spawnPos.y, level);
            else enemy = new EliteFish(spawnPos.x, spawnPos.y, level);
        }

        enemies.push(enemy);
    }

    spawnBoss(gameState, enemies, player) {
        let spawnPos = this.getSpawnPosition(player);
        let boss = new Boss(spawnPos.x, spawnPos.y, gameState.level);
        enemies.push(boss);
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
