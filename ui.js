class UI {
    constructor() {
        this.menuButtonX = 0;
        this.menuButtonY = 0;
        this.menuButtonW = 200;
        this.menuButtonH = 60;

        this.upgradeButtons = [];
        this.selectedUpgrade = null;

        // Roulette animation state
        this.rouletteStartTime = 0;
        this.rouletteDuration = 3000; // 3 seconds total animation
        this.selectedUpgrades = [];
        this.isSpinning = false;
    }

    drawMenu() {
        background(0, 50, 100);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(64);
        text('AQUA ROGUE', width / 2, height / 3);

        textSize(24);
        text('Jeu de rogue-like aquatique', width / 2, height / 3 + 70);

        this.menuButtonX = width / 2 - this.menuButtonW / 2;
        this.menuButtonY = height / 2;

        fill(50, 150, 255);
        stroke(255);
        strokeWeight(3);
        rect(this.menuButtonX, this.menuButtonY, this.menuButtonW, this.menuButtonH, 10);

        fill(255);
        noStroke();
        textSize(32);
        text('JOUER', width / 2, this.menuButtonY + this.menuButtonH / 2);

        textSize(16);
        fill(200);
        text('Contrôles: Flèches pour bouger, Espace pour tirer', width / 2, height - 100);
        text('Survivez et tuez les ennemis pour monter de niveau!', width / 2, height - 70);

        // Enemy guide
        this.drawEnemyGuide();
    }

    drawEnemyGuide() {
        let startX = 50;
        let startY = height / 2 + 100;
        let columnWidth = (width - 100) / 2;

        fill(255, 255, 0);
        textAlign(LEFT, TOP);
        textSize(24);
        text('📖 Guide des Ennemis', startX, startY);

        let enemies = [
            { sprite: 'enemy', name: 'Basique', desc: 'Faible, lent, parfait pour débuter', unlock: '🔓 Niv. 1' },
            { sprite: 'aggressive', name: 'Chasseur', desc: 'Agressif, poursuit activement', unlock: '🔓 Niv. 3' },
            { sprite: 'fast', name: 'Rapide', desc: 'Très rapide, fuit et contre-attaque', unlock: '🔓 Niv. 3' },
            { sprite: 'heavy', name: 'Blindé', desc: 'Lent mais beaucoup de HP', unlock: '🔓 Niv. 6' },
            { sprite: 'jellyfish', name: 'Méduse', desc: 'Dégâts de zone constants', unlock: '🔓 Niv. 6' },
            { sprite: 'eel', name: 'Anguille', desc: 'Dash soudain et dévastateur', unlock: '🔓 Niv. 11' },
            { sprite: 'elite', name: 'Élite', desc: 'Tire et manœuvre tactiquement', unlock: '🔓 Niv. 11' },
            { sprite: 'boss', name: 'BOSS', desc: 'Combat de boss tous les 5 niveaux', unlock: '⚠️ Niv. 5, 10, 15, 20' }
        ];

        textSize(16);
        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i];
            let col = Math.floor(i / 4);
            let row = i % 4;
            let x = startX + col * columnWidth;
            let y = startY + 40 + row * 40;

            // Sprite image (larger)
            push();
            imageMode(CENTER);
            let spriteImg = e.sprite === 'boss' ? bossSprite : enemySprites[e.sprite];
            image(spriteImg, x + 18, y + 14, 36, 36);
            pop();

            // Name
            fill(100, 200, 255);
            textAlign(LEFT, TOP);
            text(e.name, x + 42, y);

            // Unlock level (closer to name)
            fill(150, 150, 150);
            textSize(13);
            let nameWidth = textWidth(e.name);
            text(e.unlock, x + 47 + nameWidth, y + 2);
            textSize(16);

            // Description
            fill(200);
            text(e.desc, x + 42, y + 20);
        }
    }

    drawHUD(player, gameState) {
        push();

        fill(0, 0, 0, 150);
        noStroke();
        rect(10, 10, 300, 100, 10);

        fill(255);
        textAlign(LEFT, TOP);
        textSize(16);
        text(`Niveau: ${player.level}`, 20, 20);
        text(`Score: ${gameState.score}`, 20, 45);

        fill(255, 0, 0);
        textAlign(LEFT, TOP);
        text('HP:', 20, 70);

        let hpBarX = 60;
        let hpBarY = 70;
        let hpBarW = 200;
        let hpBarH = 20;

        noFill();
        stroke(255);
        strokeWeight(2);
        rect(hpBarX, hpBarY, hpBarW, hpBarH);

        let hpPercent = player.currentHP / player.maxHP;
        fill(0, 255, 0);
        noStroke();
        rect(hpBarX, hpBarY, hpBarW * hpPercent, hpBarH);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(`${Math.floor(player.currentHP)}/${player.maxHP}`, hpBarX + hpBarW / 2, hpBarY + hpBarH / 2);

        let xpBarX = 60;
        let xpBarY = 95;
        let xpBarW = 200;
        let xpBarH = 10;

        fill(100, 100, 255);
        textAlign(LEFT, TOP);
        textSize(12);
        text('XP:', 20, 95);

        noFill();
        stroke(255);
        strokeWeight(1);
        rect(xpBarX, xpBarY, xpBarW, xpBarH);

        let xpPercent = player.xp / player.xpToNextLevel;
        fill(100, 100, 255);
        noStroke();
        rect(xpBarX, xpBarY, xpBarW * xpPercent, xpBarH);

        // AOE Ability Indicator
        if (player.hasAOE) {
            let aoeIconX = 320;
            let aoeIconY = 10;
            let iconSize = 50;

            // Background box
            if (player.canUseAOE()) {
                fill(255, 215, 0, 200); // Gold - available
                stroke(255, 255, 255);
            } else {
                fill(100, 100, 100, 200); // Gray - cooldown
                stroke(150, 150, 150);
            }
            strokeWeight(2);
            rect(aoeIconX, aoeIconY, iconSize, iconSize, 5);

            // Icon
            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(24);
            text('⚡', aoeIconX + iconSize / 2, aoeIconY + iconSize / 2 - 5);

            // Key label
            textSize(12);
            text('Q', aoeIconX + iconSize / 2, aoeIconY + iconSize - 8);

            // Cooldown bar
            if (!player.canUseAOE()) {
                let elapsed = millis() - player.lastAOETime;
                let percent = elapsed / player.aoeCooldown;
                fill(0, 255, 0);
                noStroke();
                rect(aoeIconX, aoeIconY + iconSize + 2, iconSize * percent, 4);
            }
        }

        // Navigation icons at top-right
        this.drawNavigationIcons();

        pop();
    }

    drawNavigationIcons() {
        let iconSize = 40;
        let spacing = 50;
        let startX = width - 110;
        let y = 20;

        // Restart icon
        fill(50, 150, 255, 200);
        stroke(255);
        strokeWeight(2);
        rect(startX, y, iconSize, iconSize, 5);

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(24);
        text('↻', startX + iconSize / 2, y + iconSize / 2);

        // Home icon
        fill(100, 100, 100, 200);
        stroke(255);
        strokeWeight(2);
        rect(startX + spacing, y, iconSize, iconSize, 5);

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(20);
        text('🏠', startX + spacing + iconSize / 2, y + iconSize / 2);
    }

    drawLevelUpScreen(player) {
        push();

        fill(0, 0, 0, 200);
        rect(0, 0, width, height);

        fill(255, 255, 0);
        textAlign(CENTER, CENTER);
        textSize(48);
        text('NIVEAU SUPÉRIEUR!', width / 2, height / 4);

        // All available upgrades
        let allUpgrades = [
            { type: 'maxHP', label: '+20 HP Max', description: 'Augmente votre santé maximale', color: [255, 100, 100] },
            { type: 'fireRate', label: '+Cadence de tir', description: 'Tirez plus rapidement', color: [255, 200, 100] },
            { type: 'damage', label: '+8 Dégâts', description: 'Infligez plus de dégâts', color: [255, 150, 150] },
            { type: 'speed', label: '+Vitesse', description: 'Déplacez-vous plus rapidement', color: [100, 200, 255] },
            { type: 'regen', label: '+Régénération', description: '+0.5 HP/s de régénération', color: [100, 255, 150] }
        ];

        // Initialize roulette on first draw
        if (!this.isSpinning && this.selectedUpgrades.length === 0) {
            this.isSpinning = true;
            this.rouletteStartTime = millis();

            // Pre-select 3 random different upgrades
            let shuffled = allUpgrades.slice();
            for (let i = shuffled.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            this.selectedUpgrades = shuffled.slice(0, 3);
        }

        let elapsed = millis() - this.rouletteStartTime;
        let isAnimating = elapsed < this.rouletteDuration;

        let buttonW = 250;
        let buttonH = 120;
        let spacing = 50;
        let startX = width / 2 - (buttonW * 3 + spacing * 2) / 2;
        let startY = height / 2;

        this.upgradeButtons = [];

        for (let slot = 0; slot < 3; slot++) {
            let x = startX + slot * (buttonW + spacing);
            let y = startY;

            // Draw slot background
            fill(30, 30, 30);
            stroke(255, 215, 0);
            strokeWeight(3);
            rect(x, y, buttonW, buttonH, 10);

            if (isAnimating) {
                // Spinning animation - each slot stops at different times
                let slotStopTime = 1000 + slot * 800; // Stagger the stops
                let slotElapsed = elapsed - slotStopTime;

                if (slotElapsed < 0) {
                    // Still spinning
                    let spinSpeed = map(elapsed, 0, slotStopTime, 50, 200);
                    let currentIndex = floor((millis() / spinSpeed) % allUpgrades.length);
                    let upgrade = allUpgrades[currentIndex];

                    // Draw spinning upgrade with blur effect
                    fill(...upgrade.color, 200);
                    noStroke();
                    rect(x + 10, y + 10, buttonW - 20, buttonH - 20, 5);

                    fill(255, 200);
                    textSize(18);
                    text(upgrade.label, x + buttonW / 2, y + buttonH / 2 - 10);

                    textSize(12);
                    fill(200, 200);
                    text(upgrade.description, x + buttonW / 2, y + buttonH / 2 + 15);
                } else {
                    // Stopped - show selected upgrade with bounce
                    let bounceProgress = min(slotElapsed / 300, 1);
                    let bounce = sin(bounceProgress * PI) * 20;

                    let upgrade = this.selectedUpgrades[slot];

                    fill(...upgrade.color);
                    noStroke();
                    rect(x + 10, y + 10 - bounce, buttonW - 20, buttonH - 20, 5);

                    fill(255);
                    textSize(20);
                    text(upgrade.label, x + buttonW / 2, y + buttonH / 2 - 10 - bounce);

                    textSize(13);
                    fill(220);
                    text(upgrade.description, x + buttonW / 2, y + buttonH / 2 + 20 - bounce);
                }
            } else {
                // Animation complete - show clickable buttons
                let upgrade = this.selectedUpgrades[slot];

                this.upgradeButtons.push({ x, y, w: buttonW, h: buttonH, upgrade: upgrade.type });

                // Hover effect
                let isHovering = mouseX > x && mouseX < x + buttonW && mouseY > y && mouseY < y + buttonH;

                if (isHovering) {
                    fill(...upgrade.color, 255);
                    stroke(255, 255, 255);
                    strokeWeight(4);
                } else {
                    fill(...upgrade.color, 220);
                    stroke(200, 200, 200);
                    strokeWeight(2);
                }

                rect(x + 5, y + 5, buttonW - 10, buttonH - 10, 8);

                fill(255);
                noStroke();
                textSize(22);
                text(upgrade.label, x + buttonW / 2, y + buttonH / 2 - 15);

                textSize(14);
                fill(240);
                text(upgrade.description, x + buttonW / 2, y + buttonH / 2 + 15);
            }
        }

        // Show instruction when animation is done
        if (!isAnimating) {
            fill(255, 255, 255);
            textSize(20);
            text('Cliquez pour choisir', width / 2, height / 2 + buttonH + 60);
        } else {
            fill(255, 215, 0);
            textSize(24);
            text('🎰 Roulette en cours... 🎰', width / 2, height / 2 + buttonH + 60);
        }

        pop();
    }

    drawGameOver(gameState, player) {
        push();
        background(0, 0, 0, 180);

        fill(255, 50, 50);
        textAlign(CENTER, CENTER);
        textSize(64);
        text('GAME OVER', width / 2, height / 2 - 100);

        fill(255);
        textSize(24);
        text(`Score Final: ${gameState.score}`, width / 2, height / 2);
        text(`Niveau Joueur: ${player.level}`, width / 2, height / 2 + 40);
        text(`Ennemis Tués: ${gameState.enemiesKilled}`, width / 2, height / 2 + 80);

        // Restart button
        fill(50, 150, 255);
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - 100, height / 2 + 140, 200, 50, 10);

        fill(255);
        noStroke();
        textSize(24);
        text('REJOUER', width / 2, height / 2 + 165);

        // Home button
        fill(100, 100, 100);
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - 100, height / 2 + 200, 200, 50, 10);

        fill(255);
        noStroke();
        textSize(24);
        text('🏠 ACCUEIL', width / 2, height / 2 + 225);
        pop();
    }

    drawVictory(gameState, player) {
        push();
        background(0, 100, 0, 180);

        fill(255, 215, 0);
        textAlign(CENTER, CENTER);
        textSize(64);
        text('🎉 VICTOIRE! 🎉', width / 2, height / 2 - 100);

        fill(255);
        textSize(24);
        text(`Score Final: ${gameState.score}`, width / 2, height / 2);
        text(`Niveau Joueur: ${player.level}`, width / 2, height / 2 + 40);
        text(`Boss Vaincus: ${gameState.bossesDefeated}`, width / 2, height / 2 + 80);
        text(`Ennemis Tués: ${gameState.enemiesKilled}`, width / 2, height / 2 + 120);

        // Restart button
        fill(255, 215, 0);
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - 100, height / 2 + 170, 200, 50, 10);

        fill(0);
        noStroke();
        textSize(24);
        text('REJOUER', width / 2, height / 2 + 195);

        // Home button
        fill(100, 150, 100);
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - 100, height / 2 + 230, 200, 50, 10);

        fill(255);
        noStroke();
        textSize(24);
        text('🏠 ACCUEIL', width / 2, height / 2 + 255);
        pop();
    }

    drawPauseScreen() {
        push();
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(64);
        text('PAUSE', width / 2, height / 2);

        textSize(24);
        text('Appuyez sur P pour continuer', width / 2, height / 2 + 60);

        pop();
    }

    checkMenuClick(mx, my) {
        return mx > this.menuButtonX && mx < this.menuButtonX + this.menuButtonW &&
            my > this.menuButtonY && my < this.menuButtonY + this.menuButtonH;
    }

    resetRoulette() {
        this.isSpinning = false;
        this.selectedUpgrades = [];
        this.rouletteStartTime = 0;
        this.upgradeButtons = [];
    }

    checkUpgradeClick(mx, my) {
        for (let btn of this.upgradeButtons) {
            if (mx > btn.x && mx < btn.x + btn.w &&
                my > btn.y && my < btn.y + btn.h) {
                return btn.upgrade;
            }
        }
        return null;
    }

    checkGameOverClick(mx, my) {
        let buttonW = 200;
        let buttonH = 60;
        let buttonX = width / 2 - buttonW / 2;
        let buttonY = height - 200;

        return mx > buttonX && mx < buttonX + buttonW &&
            my > buttonY && my < buttonY + buttonH;
    }
}
