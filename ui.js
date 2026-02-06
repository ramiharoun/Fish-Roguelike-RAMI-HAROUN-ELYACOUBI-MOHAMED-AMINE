class UI {
    constructor() {
        this.menuButtonX = 0;
        this.menuButtonY = 0;
        this.menuButtonW = 200;
        this.menuButtonH = 60;

        this.upgradeButtons = [];
        this.selectedUpgrade = null;
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

        let hpPercentage = player.currentHP / player.maxHP;
        fill(0, 255, 0);
        noStroke();
        rect(hpBarX, hpBarY, hpBarW * hpPercentage, hpBarH);

        fill(100, 150, 255);
        textAlign(LEFT, TOP);
        text('XP:', 20, 95);

        let xpBarX = 60;
        let xpBarY = 95;
        let xpBarW = 200;
        let xpBarH = 15;

        noFill();
        stroke(255);
        strokeWeight(2);
        rect(xpBarX, xpBarY, xpBarW, xpBarH);

        let xpPercentage = player.xp / player.xpToNextLevel;
        fill(100, 200, 255);
        noStroke();
        rect(xpBarX, xpBarY, xpBarW * xpPercentage, xpBarH);

        pop();
    }

    drawLevelUpScreen(player) {
        push();

        fill(0, 0, 0, 200);
        rect(0, 0, width, height);

        fill(255, 255, 0);
        textAlign(CENTER, CENTER);
        textSize(48);
        text('NIVEAU SUPÉRIEUR!', width / 2, height / 4);

        fill(255);
        textSize(24);
        text('Choisissez une amélioration:', width / 2, height / 3);

        this.upgradeButtons = [];
        let upgrades = [
            { type: 'maxHP', label: '+20 HP Max', description: 'Augmente votre santé maximale' },
            { type: 'fireRate', label: '+Cadence de tir', description: 'Tirez plus rapidement' },
            { type: 'damage', label: '+5 Dégâts', description: 'Infligez plus de dégâts' }
        ];

        let buttonW = 250;
        let buttonH = 100;
        let spacing = 50;
        let startX = width / 2 - (buttonW * 3 + spacing * 2) / 2;
        let startY = height / 2;

        for (let i = 0; i < upgrades.length; i++) {
            let upgrade = upgrades[i];
            let x = startX + i * (buttonW + spacing);
            let y = startY;

            this.upgradeButtons.push({ x, y, w: buttonW, h: buttonH, upgrade: upgrade.type });

            fill(50, 150, 255);
            stroke(255);
            strokeWeight(3);
            rect(x, y, buttonW, buttonH, 10);

            fill(255);
            noStroke();
            textSize(20);
            text(upgrade.label, x + buttonW / 2, y + buttonH / 3);

            textSize(14);
            fill(200);
            text(upgrade.description, x + buttonW / 2, y + 2 * buttonH / 3);
        }

        pop();
    }

    drawGameOver(gameState) {
        push();

        fill(0, 0, 0, 200);
        rect(0, 0, width, height);

        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(64);
        text('GAME OVER', width / 2, height / 3);

        fill(255);
        textSize(24);
        text(`Score Final: ${gameState.score}`, width / 2, height / 2);
        text(`Niveau Atteint: ${gameState.level}`, width / 2, height / 2 + 40);
        text(`Ennemis Tués: ${gameState.enemiesKilled}`, width / 2, height / 2 + 80);

        fill(50, 150, 255);
        stroke(255);
        strokeWeight(3);
        let buttonW = 200;
        let buttonH = 60;
        rect(width / 2 - buttonW / 2, height - 200, buttonW, buttonH, 10);

        fill(255);
        noStroke();
        textSize(32);
        text('REJOUER', width / 2, height - 170);

        pop();
    }

    drawVictory(gameState) {
        push();

        fill(0, 0, 0, 230);
        rect(0, 0, width, height);

        fill(255, 215, 0);
        textAlign(CENTER, CENTER);
        textSize(72);
        text('🎉 VICTOIRE! 🎉', width / 2, height / 3 - 50);

        fill(255, 255, 100);
        textSize(36);
        text('Boss Final Vaincu!', width / 2, height / 3 + 30);

        fill(255);
        textSize(24);
        text(`Score Final: ${gameState.score}`, width / 2, height / 2);
        text(`Niveau Atteint: ${gameState.level}`, width / 2, height / 2 + 40);
        text(`Boss Vaincus: ${gameState.bossesDefeated}`, width / 2, height / 2 + 80);
        text(`Ennemis Tués: ${gameState.enemiesKilled}`, width / 2, height / 2 + 120);

        fill(255, 215, 0);
        stroke(255);
        strokeWeight(3);
        let buttonW = 200;
        let buttonH = 60;
        rect(width / 2 - buttonW / 2, height - 150, buttonW, buttonH, 10);

        fill(0);
        noStroke();
        textSize(32);
        text('REJOUER', width / 2, height - 120);

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
