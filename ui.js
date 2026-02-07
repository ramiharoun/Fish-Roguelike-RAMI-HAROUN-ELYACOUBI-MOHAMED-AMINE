class UI {
    constructor() {
        this.menuButtonX = 0;
        this.menuButtonY = 0;
        this.menuButtonW = 200;
        this.menuButtonH = 60;

        // Guide button
        this.guideButtonX = 0;
        this.guideButtonY = 0;
        this.guideButtonW = 200;
        this.guideButtonH = 60;

        this.upgradeButtons = [];
        this.selectedUpgrade = null;

        // Roulette animation state
        this.rouletteStartTime = 0;
        this.rouletteDuration = 3000; // 3 seconds total animation
        this.selectedUpgrades = [];
        this.isSpinning = false;

        this.messages = [];

        // Menu enhancement
        this.menuBubbles = [];
        this.initMenuBubbles();
        this.showGuide = false;
        this.checkFirstLaunch();

        // Difficulty selector
        this.difficultyButtons = [
            { name: 'EASY', label: '😊 Facile', color: [100, 200, 100], level: 5 },
            { name: 'MEDIUM', label: '🙂 Moyen', color: [100, 150, 255], level: 10 },
            { name: 'HARD', label: '😐 Difficile', color: [255, 150, 50], level: 15 },
            { name: 'PRO', label: '😈 Pro', color: [200, 50, 50], level: 20 }
        ];
    }

    initMenuBubbles() {
        // Create floating bubbles for menu background
        for (let i = 0; i < 30; i++) {
            this.menuBubbles.push({
                x: random(width),
                y: random(height),
                size: random(10, 40),
                speed: random(0.5, 2),
                wobble: random(TWO_PI),
                wobbleSpeed: random(0.02, 0.05)
            });
        }
    }

    checkFirstLaunch() {
        // Check if this is the first time the user opens the game
        if (typeof (Storage) !== "undefined") {
            const hasVisited = localStorage.getItem('fishRogueVisited');
            if (!hasVisited) {
                this.showGuide = true;
            }
        }
    }

    closeGuide(dontShowAgain = false) {
        this.showGuide = false;
        if (dontShowAgain && typeof (Storage) !== "undefined") {
            localStorage.setItem('fishRogueVisited', 'true');
        }
    }

    openGuide() {
        this.showGuide = true;
    }

    addMessage(text, color, duration = 3000) {
        this.messages.push({
            text: text,
            color: color || [255, 255, 255],
            startTime: millis(),
            duration: duration
        });
    }

    drawMessages() {
        if (this.messages.length === 0) return;

        push();
        textAlign(CENTER, TOP);
        textSize(24);

        for (let i = this.messages.length - 1; i >= 0; i--) {
            let msg = this.messages[i];
            let elapsed = millis() - msg.startTime;

            if (elapsed > msg.duration) {
                this.messages.splice(i, 1);
                continue;
            }

            // Fade out
            let alpha = 255;
            if (elapsed > msg.duration - 1000) {
                alpha = map(elapsed, msg.duration - 1000, msg.duration, 255, 0);
            }

            fill(msg.color.levels ? msg.color : color(msg.color));
            // p5 color object fix if array passed
            if (Array.isArray(msg.color)) {
                fill(msg.color[0], msg.color[1], msg.color[2], alpha);
            } else {
                let c = color(msg.color);
                c.setAlpha(alpha);
                fill(c);
            }

            stroke(0, alpha);
            strokeWeight(2);
            text(msg.text, width / 2, 80 + i * 30);
        }
        pop();
    }

    drawMenuBubbles() {
        // Animate and draw bubbles
        push();
        noStroke();
        for (let bubble of this.menuBubbles) {
            // Update position
            bubble.y -= bubble.speed;
            bubble.x += sin(bubble.wobble) * 0.5;
            bubble.wobble += bubble.wobbleSpeed;

            // Wrap around
            if (bubble.y < -bubble.size) {
                bubble.y = height + bubble.size;
                bubble.x = random(width);
            }

            // Draw bubble with shimmer
            let opacity = map(sin(millis() * 0.002 + bubble.wobble), -1, 1, 100, 180);
            fill(100, 150, 255, opacity);
            circle(bubble.x, bubble.y, bubble.size);

            // Shimmer highlight
            fill(255, 255, 255, opacity * 0.5);
            circle(bubble.x - bubble.size * 0.2, bubble.y - bubble.size * 0.2, bubble.size * 0.3);
        }
        pop();
    }

    drawFishRogueTitle() {
        push();
        textAlign(CENTER, CENTER);

        // Title: "FISH ROGUE"
        let yPos = height / 3;

        // Shadow
        fill(0, 50, 100, 150);
        textSize(80);
        textStyle(BOLD);
        text('FISH ROGUE', width / 2 + 4, yPos + 4);

        // Gradient text effect (simulate with layers)
        // Bottom layer - deep blue
        fill(0, 80, 150);
        text('FISH ROGUE', width / 2, yPos + 2);

        // Middle layer - cyan
        fill(0, 180, 255);
        text('FISH ROGUE', width / 2, yPos);

        // Top layer - white highlights
        fill(150, 230, 255);
        textSize(78);
        text('FISH ROGUE', width / 2, yPos - 2);

        // Animated fish silhouettes around title
        let fishY = yPos;
        let fishTime = millis() * 0.001;

        // Left fish
        let fishX1 = width / 2 - 250 + sin(fishTime) * 20;
        fill(255, 200, 100, 200);
        textSize(40);
        text('🐠', fishX1, fishY + sin(fishTime * 2) * 10);

        // Right fish
        let fishX2 = width / 2 + 250 + sin(fishTime + PI) * 20;
        text('🐟', fishX2, fishY + sin(fishTime * 2 + PI) * 10);

        // Subtitle
        fill(150, 220, 255);
        textSize(24);
        textStyle(NORMAL);
        text('Jeu de rogue-like aquatique', width / 2, yPos + 80);

        pop();
    }

    drawMenu() {
        background(0, 50, 100);

        // Draw animated bubbles
        this.drawMenuBubbles();

        // Draw stylized title
        this.drawFishRogueTitle();

        // Play button
        this.menuButtonX = width / 2 - this.menuButtonW / 2;
        this.menuButtonY = height / 2 + 20;

        fill(50, 150, 255);
        stroke(255);
        strokeWeight(3);
        rect(this.menuButtonX, this.menuButtonY, this.menuButtonW, this.menuButtonH, 10);

        fill(255);
        noStroke();
        textSize(32);
        textAlign(CENTER, CENTER);
        text('JOUER', width / 2, this.menuButtonY + this.menuButtonH / 2);

        // Difficulty selector
        fill(150, 220, 255);
        textSize(18);
        text('🎯 Difficulté:', width / 2, this.menuButtonY + this.menuButtonH + 30);

        let diffButtonW = 140;
        let diffButtonH = 45;
        let spacing = 10;
        let totalWidth = (diffButtonW + spacing) * 4 - spacing;
        let startX = width / 2 - totalWidth / 2;
        let diffY = this.menuButtonY + this.menuButtonH + 60;

        for (let i = 0; i < this.difficultyButtons.length; i++) {
            let diff = this.difficultyButtons[i];
            let x = startX + i * (diffButtonW + spacing);

            // Store button positions for click detection
            diff.x = x;
            diff.y = diffY;
            diff.w = diffButtonW;
            diff.h = diffButtonH;

            // Check if selected
            let isSelected = (typeof gameState !== 'undefined' && gameState.difficulty === diff.name);

            if (isSelected) {
                fill(diff.color[0], diff.color[1], diff.color[2]);
                stroke(255, 255, 0);
                strokeWeight(4);
            } else {
                fill(diff.color[0] * 0.6, diff.color[1] * 0.6, diff.color[2] * 0.6);
                stroke(200);
                strokeWeight(2);
            }

            rect(x, diffY, diffButtonW, diffButtonH, 8);

            fill(255);
            noStroke();
            textSize(16);
            text(diff.label, x + diffButtonW / 2, diffY + diffButtonH / 2 - 8);
            textSize(12);
            fill(220);
            text(`Niv. ${diff.level}`, x + diffButtonW / 2, diffY + diffButtonH / 2 + 10);
        }

        // Guide button (repositioned below difficulty selector)
        this.guideButtonX = width / 2 - this.guideButtonW / 2;
        this.guideButtonY = diffY + diffButtonH + 30;

        fill(100, 200, 150);
        stroke(255);
        strokeWeight(3);
        rect(this.guideButtonX, this.guideButtonY, this.guideButtonW, this.guideButtonH, 10);

        fill(255);
        noStroke();
        textSize(28);
        text('📖 GUIDE', width / 2, this.guideButtonY + this.guideButtonH / 2);

        // Footer hints
        textSize(16);
        fill(200);
        textAlign(CENTER);
        text('Survivez et montez de niveau pour devenir le roi des océans!', width / 2, height - 50);

        // Enemy guide (existing)
        this.drawEnemyGuide();

        // Draw guide modal if open
        if (this.showGuide) {
            this.drawGuideModal();
        }
    }

    drawEnemyGuide() {
        let startX = 50;
        let startY = height / 2 + 100;
        let columnWidth = 350; // Fixed width instead of dynamic (was (width - 100) / 2)

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

    drawGuideModal() {
        push();

        // Semi-transparent overlay
        fill(0, 0, 0, 200);
        rect(0, 0, width, height);

        // Modal box
        let modalW = min(700, width - 100);
        let modalH = min(600, height - 100);
        let modalX = (width - modalW) / 2;
        let modalY = (height - modalH) / 2;

        fill(20, 60, 100);
        stroke(100, 180, 255);
        strokeWeight(4);
        rect(modalX, modalY, modalW, modalH, 15);

        // Title
        fill(150, 230, 255);
        noStroke();
        textAlign(CENTER, TOP);
        textSize(36);
        textStyle(BOLD);
        text('📖 GUIDE DU JEU', width / 2, modalY + 20);

        // Content area
        let contentX = modalX + 30;
        let contentY = modalY + 80;
        let contentW = modalW - 60;

        fill(255);
        textAlign(LEFT, TOP);
        textSize(18);
        textStyle(BOLD);

        // Controls section
        text('🎮 COMMANDES:', contentX, contentY);
        textStyle(NORMAL);
        textSize(16);
        let y = contentY + 30;

        text('• Déplacement: Flèches directionnelles ou WASD', contentX + 20, y);
        y += 25;
        text('• Tirer: Espace ou Clic gauche', contentX + 20, y);
        y += 25;
        text('• Dash: Shift (Cooldown: 5 secondes)', contentX + 20, y);
        y += 25;
        text('• AOE (Explosion): Q (Débloqué au niveau 5, Cooldown: 10s)', contentX + 20, y);
        y += 25;
        text('• Pause: ESC', contentX + 20, y);
        y += 40;

        // Mechanics section
        textStyle(BOLD);
        textSize(18);
        text('🎯 MÉCANIQUES DE JEU:', contentX, y);
        y += 30;

        textStyle(NORMAL);
        textSize(16);
        text('• Éliminez des ennemis pour gagner de l\'XP et monter de niveau', contentX + 20, y);
        y += 25;
        text('• Chaque niveau vous donne le choix entre 3 améliorations', contentX + 20, y);
        y += 25;
        text('• Un BOSS apparaît tous les 5 niveaux', contentX + 20, y);
        y += 25;
        text('• Les rochers ralentissent, les coraux ne bloquent pas', contentX + 20, y);
        y += 25;
        text('• Atteignez le niveau 20 pour GAGNER!', contentX + 20, y);
        y += 40;

        // Objective (dynamic based on difficulty)
        textStyle(BOLD);
        textSize(18);
        fill(255, 215, 0);
        let victoryLevel = (typeof gameState !== 'undefined') ? gameState.getVictoryLevel() : 10;
        text(`🏆 OBJECTIF: Survivez et atteignez le niveau ${victoryLevel}!`, contentX, y);

        // Close button
        let closeW = 200;
        let closeH = 50;
        let closeX = width / 2 - closeW / 2;
        let closeY = modalY + modalH - closeH - 20;

        fill(200, 50, 50);
        stroke(255);
        strokeWeight(3);
        rect(closeX, closeY, closeW, closeH, 10);

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(24);
        textStyle(NORMAL);
        text('FERMER', width / 2, closeY + closeH / 2);

        // Store close button position for click detection
        this.guideCloseX = closeX;
        this.guideCloseY = closeY;
        this.guideCloseW = closeW;
        this.guideCloseH = closeH;

        pop();
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

        // Dash Ability Indicator
        let dashIconX = 380;
        let dashIconY = 10;
        let iconSize = 50;

        // Background box
        if (player.canDash()) {
            fill(0, 191, 255, 200); // Sky blue - available
            stroke(255, 255, 255);
        } else {
            fill(100, 100, 100, 200); // Gray - cooldown
            stroke(150, 150, 150);
        }
        strokeWeight(2);
        rect(dashIconX, dashIconY, iconSize, iconSize, 5);

        // Icon
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(24);
        text('💨', dashIconX + iconSize / 2, dashIconY + iconSize / 2 - 5);

        // Key label
        textSize(12);
        text('Shift', dashIconX + iconSize / 2, dashIconY + iconSize - 8);

        // Cooldown bar
        if (!player.canDash()) {
            let elapsed = millis() - player.lastDashTime;
            let percent = elapsed / player.dashCooldown;
            fill(0, 255, 255);
            noStroke();
            rect(dashIconX, dashIconY + iconSize + 2, iconSize * percent, 4);
        }

        // Navigation icons at top-right
        this.drawNavigationIcons();

        // Debug mode display
        if (typeof debugMode !== 'undefined' && debugMode) {
            this.drawDebugInfo(player, gameState);
        }

        // Draw messages
        this.drawMessages();

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

        // Semi-transparent overlay
        fill(0, 0, 0, 200);
        rect(0, 0, width, height);

        // Victory modal
        let modalW = 600;
        let modalH = 500;
        let modalX = (width - modalW) / 2;
        let modalY = (height - modalH) / 2;

        fill(20, 100, 60);
        stroke(100, 255, 150);
        strokeWeight(4);
        rect(modalX, modalY, modalW, modalH, 15);

        // Trophy and title
        fill(255, 215, 0);
        noStroke();
        textAlign(CENTER, TOP);
        textSize(100);
        text('🏆', width / 2, modalY + 40);

        textSize(56);
        textStyle(BOLD);
        fill(255, 255, 100);
        text('VICTOIRE!', width / 2, modalY + 160);

        // Stats
        fill(200, 255, 200);
        textSize(24);
        textStyle(NORMAL);
        text(`Score: ${gameState.score}`, width / 2, modalY + 245);
        text(`Ennemis vaincus: ${gameState.enemiesKilled}`, width / 2, modalY + 280);

        // Buttons
        let buttonW = 250;
        let buttonH = 60;
        let buttonSpacing = 20;
        let restartX = width / 2 - buttonW - buttonSpacing / 2;
        let homeX = width / 2 + buttonSpacing / 2;
        let buttonY = modalY + modalH - buttonH - 40;

        // Restart button
        fill(100, 200, 100);
        stroke(255);
        strokeWeight(3);
        rect(restartX, buttonY, buttonW, buttonH, 10);

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(28);
        text('🔄 REJOUER', restartX + buttonW / 2, buttonY + buttonH / 2);

        // Home button
        fill(100, 150, 255);
        stroke(255);
        strokeWeight(3);
        rect(homeX, buttonY, buttonW, buttonH, 10);

        fill(255);
        noStroke();
        text('🏠 ACCUEIL', homeX + buttonW / 2, buttonY + buttonH / 2);

        // Store button positions
        this.victoryRestartX = restartX;
        this.victoryRestartY = buttonY;
        this.victoryRestartW = buttonW;
        this.victoryRestartH = buttonH;

        this.victoryHomeX = homeX;
        this.victoryHomeY = buttonY;
        this.victoryHomeW = buttonW;
        this.victoryHomeH = buttonH;

        pop();
    }

    checkVictoryClick(mx, my) {
        // Check restart button
        if (mx > this.victoryRestartX && mx < this.victoryRestartX + this.victoryRestartW &&
            my > this.victoryRestartY && my < this.victoryRestartY + this.victoryRestartH) {
            return 'restart';
        }

        // Check home button
        if (mx > this.victoryHomeX && mx < this.victoryHomeX + this.victoryHomeW &&
            my > this.victoryHomeY && my < this.victoryHomeY + this.victoryHomeH) {
            return 'home';
        }

        return null;
    }

    drawPauseScreen() {
        push();

        // Semi-transparent overlay
        fill(0, 0, 0, 200);
        rect(0, 0, width, height);

        // Pause modal box
        let modalW = 500;
        let modalH = 400;
        let modalX = (width - modalW) / 2;
        let modalY = (height - modalH) / 2;

        fill(20, 60, 100);
        stroke(100, 180, 255);
        strokeWeight(4);
        rect(modalX, modalY, modalW, modalH, 15);

        // Pause icon and title
        fill(150, 230, 255);
        noStroke();
        textAlign(CENTER, TOP);
        textSize(80);
        textStyle(BOLD);
        text('⏸️', width / 2, modalY + 40);

        textSize(48);
        text('PAUSE', width / 2, modalY + 140);

        // Instructions
        fill(200, 220, 255);
        textSize(20);
        textStyle(NORMAL);
        text('Le jeu est en pause', width / 2, modalY + 210);

        // Resume button
        let resumeW = 300;
        let resumeH = 60;
        let resumeX = width / 2 - resumeW / 2;
        let resumeY = modalY + 260;

        fill(50, 200, 100);
        stroke(255);
        strokeWeight(3);
        rect(resumeX, resumeY, resumeW, resumeH, 10);

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(28);
        text('▶️ REPRENDRE (ESC)', width / 2, resumeY + resumeH / 2);

        // Hint
        fill(150);
        textSize(16);
        text('Appuyez sur ESC ou cliquez pour continuer', width / 2, modalY + modalH - 30);

        // Store button position for click detection
        this.pauseResumeX = resumeX;
        this.pauseResumeY = resumeY;
        this.pauseResumeW = resumeW;
        this.pauseResumeH = resumeH;

        pop();
    }

    checkPauseClick(mx, my) {
        // Check if resume button was clicked
        return mx > this.pauseResumeX && mx < this.pauseResumeX + this.pauseResumeW &&
            my > this.pauseResumeY && my < this.pauseResumeY + this.pauseResumeH;
    }

    checkMenuClick(mx, my) {
        // Check if guide modal is open
        if (this.showGuide) {
            // Check close button
            if (mx > this.guideCloseX && mx < this.guideCloseX + this.guideCloseW &&
                my > this.guideCloseY && my < this.guideCloseY + this.guideCloseH) {
                this.closeGuide(true); // Mark as visited
                return false;
            }
            return false; // Ignore other clicks when guide is open
        }

        // Check difficulty buttons
        for (let diff of this.difficultyButtons) {
            if (mx > diff.x && mx < diff.x + diff.w &&
                my > diff.y && my < diff.y + diff.h) {
                if (typeof gameState !== 'undefined') {
                    gameState.setDifficulty(diff.name);
                }
                return false;
            }
        }

        // Check guide button
        if (mx > this.guideButtonX && mx < this.guideButtonX + this.guideButtonW &&
            my > this.guideButtonY && my < this.guideButtonY + this.guideButtonH) {
            this.openGuide();
            return false;
        }

        // Check play button
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

    drawDebugInfo(player, gameState) {
        push();

        // Debug overlay box
        let boxX = width - 310;
        let boxY = height - 250;
        let boxW = 300;
        let boxH = 240;

        fill(0, 0, 0, 200);
        stroke(0, 255, 0);
        strokeWeight(2);
        rect(boxX, boxY, boxW, boxH, 5);

        // Debug title
        fill(0, 255, 0);
        noStroke();
        textAlign(LEFT, TOP);
        textSize(18);
        textStyle(BOLD);
        text('🐛 DEBUG MODE (D)', boxX + 10, boxY + 10);

        // Debug info
        textStyle(NORMAL);
        textSize(14);
        let y = boxY + 40;
        let lineHeight = 20;

        // FPS
        text(`FPS: ${Math.round(frameRate())}`, boxX + 10, y);
        y += lineHeight;

        // Entity counts
        if (typeof enemies !== 'undefined') {
            text(`Enemies: ${enemies.length}`, boxX + 10, y);
        }
        y += lineHeight;

        if (typeof projectiles !== 'undefined') {
            text(`Projectiles: ${projectiles.length}`, boxX + 10, y);
        }
        y += lineHeight;

        if (typeof loot !== 'undefined') {
            text(`Loot: ${loot.length}`, boxX + 10, y);
        }
        y += lineHeight;

        // Player stats
        text(`Player Pos: (${Math.round(player.pos.x)}, ${Math.round(player.pos.y)})`, boxX + 10, y);
        y += lineHeight;

        text(`Player Speed: ${player.vel.mag().toFixed(2)}`, boxX + 10, y);
        y += lineHeight;

        text(`Max Speed: ${player.maxSpeed}`, boxX + 10, y);
        y += lineHeight;

        text(`Damage: ${player.damage}`, boxX + 10, y);
        y += lineHeight;

        // Boss mode indicator
        if (typeof bossMode !== 'undefined' && bossMode) {
            fill(255, 0, 0);
            text('⚠️ BOSS MODE ACTIVE', boxX + 10, y);
        }

        pop();
    }
}
