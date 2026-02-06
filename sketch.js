let gameState;
let camera;
let controls;
let ui;
let spawner;
let soundManager;

let player;
let enemies = [];
let projectiles = [];
let enemyProjectiles = [];
let loot = [];
let particles = [];

let worldWidth = 3000;
let worldHeight = 3000;

let bossSpawned = false;
let previousLevel = 1;
let lastBossLevel = 0;

let bubbles = [];
let waveOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gameState = new GameState();
  camera = new Camera(worldWidth, worldHeight);
  controls = new Controls();
  ui = new UI();
  spawner = new Spawner(worldWidth, worldHeight, camera);
  soundManager = new SoundManager();

  for (let i = 0; i < 50; i++) {
    bubbles.push({
      x: random(worldWidth),
      y: random(worldHeight),
      size: random(5, 20),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  background(0, 50, 100);

  if (gameState.isMenu()) {
    ui.drawMenu();
  } else if (gameState.isPlaying()) {
    updateGame();
    renderGame();
    ui.drawHUD(player, gameState);
  } else if (gameState.isLevelUp()) {
    renderGame();
    ui.drawLevelUpScreen(player);
  } else if (gameState.isGameOver()) {
    ui.drawGameOver(gameState);
  } else if (gameState.isVictory()) {
    ui.drawVictory(gameState);
  } else if (gameState.isPaused()) {
    renderGame();
    ui.drawHUD(player, gameState);
    ui.drawPauseScreen();
  }
}

function updateGame() {
  controls.update();

  let movementForce = controls.getMovementForce(player.maxForce);
  player.applyForce(movementForce);

  if (controls.isShooting()) {
    player.shoot(projectiles);
  }

  player.update();

  if (player.pos.x < 0) player.pos.x = 0;
  if (player.pos.x > worldWidth) player.pos.x = worldWidth;
  if (player.pos.y < 0) player.pos.y = 0;
  if (player.pos.y > worldHeight) player.pos.y = worldHeight;

  camera.follow(player);

  spawner.update(gameState, enemies, player);

  if (gameState.shouldSpawnBoss() && gameState.level > lastBossLevel) {
    spawner.spawnBoss(gameState, enemies, player);
    lastBossLevel = gameState.level;
    bossSpawned = true;
    soundManager.playBossSpawn();
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];

    enemy.behave(player);
    enemy.update();

    if (enemy.canShoot) {
      enemy.shoot(player, enemyProjectiles);
    }

    if (enemy instanceof Jellyfish && enemy.damagesInRadius(player)) {
      if (frameCount % 30 === 0) {
        player.takeDamage(enemy.pulseDamage);
      }
    }

    if (enemy.pos.x < 0) enemy.pos.x = 0;
    if (enemy.pos.x > worldWidth) enemy.pos.x = worldWidth;
    if (enemy.pos.y < 0) enemy.pos.y = 0;
    if (enemy.pos.y > worldHeight) enemy.pos.y = worldHeight;

    let d = p5.Vector.dist(player.pos, enemy.pos);
    if (d < player.r + enemy.r) {
      player.takeDamage(enemy.contactDamage);
    }

    if (enemy.isDead()) {
      gameState.addScore(enemy.scoreValue);

      if (enemy instanceof Boss) {
        gameState.bossDefeated();
        bossSpawned = false;
        if (gameState.level === 30) {
          gameState.setState(GameState.STATES.VICTORY);
          soundManager.playVictory();
        }
      } else {
        gameState.enemyKilled();
      }

      if (enemy.xpDropType === 'direct') {
        player.addXP(enemy.xpValue);
      } else {
        loot.push(new XPOrb(enemy.pos.x, enemy.pos.y, enemy.xpValue));
      }

      if (random() < 0.3) {
        loot.push(new HealthOrb(enemy.pos.x, enemy.pos.y));
      }

      let enemyType = enemy.constructor.name.toLowerCase();
      soundManager.playEnemyDeath(enemyType);

      let newParticles = createEnemyDeathParticles(enemy.pos.x, enemy.pos.y);
      particles.push(...newParticles);

      enemies.splice(i, 1);
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    let proj = projectiles[i];

    proj.findTarget(enemies);
    proj.update();

    let hit = false;
    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      let d = p5.Vector.dist(proj.pos, enemy.pos);

      if (d < proj.r + enemy.r) {
        enemy.takeDamage(proj.damage);
        soundManager.playEnemyHit();
        hit = true;
        break;
      }
    }

    if (hit || proj.isDead() || proj.pos.x < 0 || proj.pos.x > worldWidth ||
      proj.pos.y < 0 || proj.pos.y > worldHeight) {
      projectiles.splice(i, 1);
    }
  }

  for (let i = loot.length - 1; i >= 0; i--) {
    let orb = loot[i];
    orb.update(player);

    if (orb.isCollected()) {
      loot.splice(i, 1);
    }
  }

  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    let proj = enemyProjectiles[i];

    proj.update();

    let d = p5.Vector.dist(proj.pos, player.pos);
    if (d < proj.r + player.r) {
      player.takeDamage(proj.damage);
      enemyProjectiles.splice(i, 1);
    } else if (proj.isDead() || proj.pos.x < 0 || proj.pos.x > worldWidth ||
      proj.pos.y < 0 || proj.pos.y > worldHeight) {
      enemyProjectiles.splice(i, 1);
    }
  }

  if (player.level > previousLevel) {
    gameState.setState(GameState.STATES.LEVELUP);
    previousLevel = player.level;
    soundManager.playLevelUp();
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  if (player.isDead()) {
    gameState.setState(GameState.STATES.GAMEOVER);
  }
}

function renderGame() {
  drawOceanBackground();

  push();
  camera.apply();

  drawWaves();

  updateBubbles();

  for (let orb of loot) {
    orb.show();
  }

  for (let enemy of enemies) {
    enemy.show();
  }

  for (let proj of projectiles) {
    proj.show();
  }

  for (let proj of enemyProjectiles) {
    proj.show();
  }

  for (let particle of particles) {
    particle.show();
  }

  player.show();

  if (Vehicle.debug) {
    stroke(255, 0, 0);
    noFill();
    rect(0, 0, worldWidth, worldHeight);
  }

  pop();
}

function drawOceanBackground() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(0, 50, 100), color(30, 100, 150), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawWaves() {
  noFill();
  waveOffset += 0.02;

  for (let i = 0; i < 3; i++) {
    stroke(50, 120, 180, 50);
    strokeWeight(2);
    beginShape();
    for (let x = camera.x - width / 2 - 100; x < camera.x + width / 2 + 100; x += 10) {
      let y = sin(x * 0.01 + waveOffset + i) * 30 + (i * 100);
      vertex(x, y);
    }
    endShape();
  }
}

function updateBubbles() {
  for (let bubble of bubbles) {
    if (camera.isOnScreen(createVector(bubble.x, bubble.y), 50)) {
      push();
      noStroke();
      fill(200, 240, 255, 80);
      circle(bubble.x, bubble.y, bubble.size);

      fill(255, 255, 255, 120);
      circle(bubble.x - bubble.size / 4, bubble.y - bubble.size / 4, bubble.size / 3);
      pop();
    }

    bubble.y -= bubble.speed;
    bubble.x += sin(bubble.y * 0.01) * 0.5;

    if (bubble.y < 0) {
      bubble.y = worldHeight;
      bubble.x = random(worldWidth);
    }
  }
}

function mousePressed() {
  if (gameState.isMenu()) {
    if (ui.checkMenuClick(mouseX, mouseY)) {
      startNewGame();
    }
  } else if (gameState.isLevelUp()) {
    let upgrade = ui.checkUpgradeClick(mouseX, mouseY);
    if (upgrade) {
      player.applyUpgrade(upgrade);
      gameState.setState(GameState.STATES.PLAYING);
    }
  } else if (gameState.isGameOver()) {
    if (ui.checkGameOverClick(mouseX, mouseY)) {
      startNewGame();
    }
  }
}

function keyPressed() {
  if (key === 'd' || key === 'D') {
    Vehicle.debug = !Vehicle.debug;
  }

  if (key === 'p' || key === 'P') {
    if (gameState.isPlaying()) {
      gameState.setState(GameState.STATES.PAUSED);
    } else if (gameState.isPaused()) {
      gameState.setState(GameState.STATES.PLAYING);
    }
  }
}

function startNewGame() {
  gameState.startGame();

  player = new Player(worldWidth / 2, worldHeight / 2);
  enemies = [];
  projectiles = [];
  enemyProjectiles = [];
  loot = [];
  particles = [];
  bossSpawned = false;
  previousLevel = 1;
  lastBossLevel = 0;

  for (let i = 0; i < 5; i++) {
    let x = random(worldWidth);
    let y = random(worldHeight);
    enemies.push(new Enemy(x, y, 1));
  }

  camera.x = player.pos.x;
  camera.y = player.pos.y;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}