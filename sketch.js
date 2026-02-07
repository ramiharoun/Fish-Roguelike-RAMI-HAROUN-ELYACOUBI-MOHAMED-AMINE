// World dimensions
let worldWidth = 3000;
let worldHeight = 2000;

// Game Core
let gameState;
let player;
let enemies = [];
let projectiles = [];
let enemyProjectiles = [];
let loot = [];
let particles = [];

// Systems
let camera;
let controls;
let ui;
let spawner;
let soundManager;

// Visuals
let bubbles = [];
let waveOffset = 0;
let oceanBackground;
let obstacleManager;

// Boss tracking
let bossSpawned = false;
let previousLevel = 1;
let lastBossLevel = 0;

// Boss environment effects
let bossMode = false;
let bossWarningTime = 0;
let dangerParticles = [];

// Debug mode
let debugMode = false;

// Assets
let bossSprite;
let playerSprite; // New procedural player sprite
let enemySprites = {}; // Individual enemy sprites


function preload() {
  // Generate procedural sprites instead of loading images
  // This bypasses the need for external assets and quota limits
  // generateAssets() will be called in setup() because createGraphics needs p5 to be initialized

  if (typeof soundManager !== 'undefined') {
    // soundManager.preload(); 
  }
}




function setup() {
  createCanvas(windowWidth, windowHeight);

  // Generate procedural sprites and assign to globals
  let assets = generateAssets();
  enemySprites = assets.enemies;
  bossSprite = assets.boss;
  playerSprite = assets.player;

  gameState = new GameState();
  camera = new Camera(worldWidth, worldHeight);
  controls = new Controls();
  ui = new UI();
  oceanBackground = new OceanBackground(worldWidth, worldHeight);
  obstacleManager = new ObstacleManager(worldWidth, worldHeight);
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
    // Start menu music if not already playing
    if (soundManager && soundManager.musicGenerator && soundManager.musicGenerator.musicType !== 'menu') {
      soundManager.musicGenerator.playMenuMusic();
    }
    ui.drawMenu();
  } else if (gameState.isPlaying()) {
    updateGame();
    renderGame();
    ui.drawHUD(player, gameState);
  } else if (gameState.isLevelUp()) {
    renderGame();
    ui.drawLevelUpScreen(player);
  } else if (gameState.isGameOver()) {
    ui.drawGameOver(gameState, player);
  } else if (gameState.isVictory()) {
    ui.drawVictory(gameState, player);
  } else if (gameState.isPaused()) {
    renderGame();
    ui.drawHUD(player, gameState);
    ui.drawPauseScreen();
  }
}

function updateGame() {
  controls.update();
  obstacleManager.update(player, enemies, projectiles, enemyProjectiles);

  let movementForce = controls.getMovementForce(player.maxForce);
  player.applyForce(movementForce);

  if (controls.isShooting()) {
    player.shoot(projectiles);
  }

  if (controls.isDashing()) {
    player.dash();
  }

  player.update();

  if (player.pos.x < 0) player.pos.x = 0;
  if (player.pos.x > worldWidth) player.pos.x = worldWidth;
  if (player.pos.y < 0) player.pos.y = 0;
  if (player.pos.y > worldHeight) player.pos.y = worldHeight;

  camera.follow(player);

  spawner.update(gameState, enemies, player);

  if (gameState.shouldSpawnBoss(player.level) && player.level > lastBossLevel) {
    // Clear all regular enemies for exclusive boss fight
    enemies = enemies.filter(e => e instanceof Boss); // Keep any existing bosses

    spawner.spawnBoss(gameState, enemies, player);
    lastBossLevel = player.level;
    bossSpawned = true;
    bossMode = true;
    bossWarningTime = millis();
    if (soundManager) {
      soundManager.playBossSpawn();
      // Start boss music
      if (soundManager.musicGenerator) {
        soundManager.musicGenerator.playBossMusic();
      }
    }
  }

  // Exit boss mode when all bosses are defeated
  if (bossMode && enemies.every(e => !(e instanceof Boss))) {
    bossMode = false;
  }

  // HP Regeneration (1 HP per second)
  if (millis() - player.lastRegenTime >= 1000) {
    if (player.currentHP < player.maxHP) {
      player.currentHP = min(player.currentHP + player.hpRegen, player.maxHP);
    }
    player.lastRegenTime = millis();
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

        // Victory condition: check if the boss that was spawned matches victory level
        // Use lastBossLevel which stores the level when boss spawned
        let isFinalBoss = (lastBossLevel >= gameState.getVictoryLevel());

        if (isFinalBoss) {
          gameState.setState(GameState.STATES.VICTORY);
          if (soundManager) {
            soundManager.playVictory();
            if (soundManager.musicGenerator) {
              soundManager.musicGenerator.playVictoryMusic();
            }
          }
        } else {
          // Boss defeated but not final boss - restart normal gameplay music
          if (soundManager && soundManager.musicGenerator) {
            soundManager.musicGenerator.playGameplayMusic();
          }
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
    // Level up - but skip if we're already in victory state
    if (!gameState.isVictory()) {
      gameState.setState(GameState.STATES.LEVELUP);
    }
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
  if (oceanBackground) {
    oceanBackground.update(camera);
    oceanBackground.show(camera);
  } else {
    background(0, 100, 200);
  }

  push();
  camera.apply();

  // Draw Obstacles
  if (obstacleManager) {
    obstacleManager.show();
  }



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

  // Boss environment effects (drawn outside camera)
  updateBossEffects();
  drawBossWarning();
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
  // Initialize sound on first interaction
  if (soundManager && !soundManager.initialized) {
    soundManager.init();
  }

  if (gameState.isMenu()) {
    if (ui.checkMenuClick(mouseX, mouseY)) {
      startNewGame();
    }
  } else if (gameState.isPaused()) {
    // Check if resume button clicked
    if (ui.checkPauseClick(mouseX, mouseY)) {
      gameState.setState(GameState.STATES.PLAYING);
    }
  } else if (gameState.isLevelUp()) {
    let upgrade = ui.checkUpgradeClick(mouseX, mouseY);
    if (upgrade) {
      player.applyUpgrade(upgrade);
      ui.resetRoulette(); // Reset animation for next time
      gameState.setState(GameState.STATES.PLAYING);
    }
  } else if (gameState.isGameOver()) {
    // Check restart button
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 140 && mouseY < height / 2 + 190) {
      startNewGame();
    }
    // Check home button
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 200 && mouseY < height / 2 + 250) {
      gameState.reset();
    }
  } else if (gameState.isVictory()) {
    // Check victory screen buttons
    let action = ui.checkVictoryClick(mouseX, mouseY);
    if (action === 'restart') {
      startNewGame();
    } else if (action === 'home') {
      gameState.reset();
    }
  } else if (gameState.isPlaying()) {
    // In-game navigation icons
    let iconSize = 40;
    let spacing = 50;
    let startX = width - 110;
    let y = 20;

    // Restart icon
    if (mouseX > startX && mouseX < startX + iconSize &&
      mouseY > y && mouseY < y + iconSize) {
      startNewGame();
    }

    // Home icon
    if (mouseX > startX + spacing && mouseX < startX + spacing + iconSize &&
      mouseY > y && mouseY < y + iconSize) {
      gameState.reset();
    }
  }
}

function keyPressed() {
  if (key === 'd' || key === 'D') {
    Vehicle.debug = !Vehicle.debug;
    debugMode = !debugMode;
  }

  // Pause with ESC key
  if (keyCode === ESCAPE) {
    if (gameState.isPlaying()) {
      gameState.setState(GameState.STATES.PAUSED);
    } else if (gameState.isPaused()) {
      gameState.setState(GameState.STATES.PLAYING);
    }
    return false; // Prevent default ESC behavior
  }

  // AOE attack (Q key)
  if ((key === 'q' || key === 'Q') && gameState.isPlaying()) {
    if (player && player.useAOE) {
      player.useAOE(enemies, particles);
    }
  }
}

function startNewGame() {
  gameState.startGame();

  // Initialize and start ambience
  if (soundManager) {
    soundManager.init();
    soundManager.startAmbience();
    // Start gameplay music
    if (soundManager.musicGenerator) {
      soundManager.musicGenerator.playGameplayMusic();
    }
  }

  player = new Player(worldWidth / 2, worldHeight / 2);
  enemies = [];
  projectiles = [];
  enemyProjectiles = [];
  loot = [];
  particles = [];
  bossSpawned = false;
  previousLevel = player.level;
  lastBossLevel = 0;

  // Reset boss mode
  bossMode = false;
  dangerParticles = [];

  for (let i = 0; i < 5; i++) {
    let x = random(worldWidth);
    let y = random(worldHeight);
    enemies.push(new Enemy(x, y, 1));
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// Boss Environment Effects

function updateBossEffects() {
  if (!bossMode) return;

  // Spawn red danger particles  
  if (frameCount % 10 === 0) {
    dangerParticles.push({
      x: random(width),
      y: 0,
      size: random(3, 8),
      speed: random(1, 3),
      alpha: 255
    });
  }

  // Update and render particles
  for (let i = dangerParticles.length - 1; i >= 0; i--) {
    let p = dangerParticles[i];
    p.y += p.speed;
    p.alpha -= 2;

    if (p.alpha <= 0 || p.y > height) {
      dangerParticles.splice(i, 1);
    } else {
      push();
      noStroke();
      fill(255, 50, 50, p.alpha);
      circle(p.x, p.y, p.size);
      pop();
    }
  }
}

function drawBossWarning() {
  if (!bossMode) return;

  let timeSinceWarning = millis() - bossWarningTime;

  // Flash warning for first 3 seconds
  if (timeSinceWarning < 3000) {
    if (Math.floor(millis() / 500) % 2 === 0) {
      push();
      fill(255, 0, 0, 150);
      textAlign(CENTER, CENTER);
      textSize(48);
      text('⚠️ BOSS APPROCHE ⚠️', width / 2, 100);
      pop();
    }
  }

  // Boss HP bar at top
  let boss = enemies.find(e => e instanceof Boss);
  if (boss) {
    push();
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, 0, width, 60);

    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text('BOSS', width / 2, 15);

    // HP bar
    let barW = width - 100;
    let barH = 20;
    let barX = 50;
    let barY = 35;

    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    rect(barX, barY, barW, barH);

    let hpPercent = boss.currentHP / boss.maxHP;
    fill(255, 0, 0);
    noStroke();
    rect(barX, barY, barW * hpPercent, barH);

    pop();
  }
}
