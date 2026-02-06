function generateAssets() {
    let generatedEnemies = {};
    let bossGfx;
    let playerGfx;

    // Basic Enemy (Red Fish)
    generatedEnemies['enemy'] = createGraphics(48, 48);
    drawFishSprite(generatedEnemies['enemy'], color(255, 100, 100), color(200, 50, 50));

    // Fast Enemy (Silver/Blue)
    generatedEnemies['fast'] = createGraphics(48, 48);
    drawFishSprite(generatedEnemies['fast'], color(100, 200, 255), color(50, 100, 200), true);

    // Heavy Enemy (Round/Green)
    generatedEnemies['heavy'] = createGraphics(64, 64);
    drawHeavyFishSprite(generatedEnemies['heavy'], color(100, 200, 100), color(50, 150, 50));

    // Aggressive Enemy (Shark-like)
    generatedEnemies['aggressive'] = createGraphics(64, 48);
    drawSharkSprite(generatedEnemies['aggressive'], color(150, 150, 150), color(100, 100, 100));

    // Jellyfish (Translucent)
    generatedEnemies['jellyfish'] = createGraphics(48, 48);
    drawJellyfishSprite(generatedEnemies['jellyfish'], color(200, 100, 255, 200));

    // Eel (Long)
    generatedEnemies['eel'] = createGraphics(64, 32);
    drawEelSprite(generatedEnemies['eel'], color(100, 255, 100));

    // Elite (Golden)
    generatedEnemies['elite'] = createGraphics(64, 64);
    drawFishSprite(generatedEnemies['elite'], color(255, 215, 0), color(218, 165, 32), false, true);

    // Boss (Giant Kraken/Monster)
    bossGfx = createGraphics(128, 128);
    drawBossSprite(bossGfx);

    // Player Sprite
    playerGfx = createGraphics(64, 48);
    drawPlayerSprite(playerGfx);

    return {
        enemies: generatedEnemies,
        boss: bossGfx,
        player: playerGfx
    };
}

function drawPlayerSprite(g) {
    g.noSmooth();
    g.clear();
    let w = g.width;
    let h = g.height;

    // Submarine/Fish hybrid design

    // Propeller
    g.fill(200);
    g.rect(5, h / 2 - 8, 5, 16);

    // Tail fins
    g.fill(255, 100, 0); // Orange accents
    g.triangle(10, h / 2, 25, h / 2 - 10, 25, h / 2 + 10);

    // Main Body
    g.fill(255, 255, 0); // Yellow submarine
    g.ellipse(w / 2 + 5, h / 2, w - 15, h - 15);

    // Cockpit/Window
    g.fill(200, 240, 255); // Blue glass
    g.stroke(0, 100, 200);
    g.strokeWeight(2);
    g.circle(w / 2 + 15, h / 2 - 5, 12);

    // Reflection
    g.noStroke();
    g.fill(255, 255, 255, 200);
    g.circle(w / 2 + 17, h / 2 - 7, 4);

    // Details
    g.noFill();
    g.stroke(200, 100, 0);
    g.strokeWeight(2);
    g.arc(w / 2, h / 2 + 10, 20, 10, 0, PI);
}

function drawFishSprite(g, bodyColor, finColor, isSlender = false, isElite = false) {
    g.noSmooth();
    g.clear();
    let w = g.width;
    let h = g.height;

    // Tail
    g.fill(finColor);
    g.noStroke();
    g.triangle(5, h / 2, 15, h / 2 - 10, 15, h / 2 + 10);

    // Fins
    g.triangle(w / 2, h / 2 - 5, w / 2 + 10, h / 2 - 15, w / 2 - 5, h / 2 - 5); // Top
    g.triangle(w / 2, h / 2 + 5, w / 2 + 10, h / 2 + 15, w / 2 - 5, h / 2 + 5); // Bottom

    // Body
    g.fill(bodyColor);
    if (isSlender) {
        g.ellipse(w / 2 + 5, h / 2, w - 15, h / 2);
    } else {
        g.ellipse(w / 2 + 5, h / 2, w - 15, h - 15);
    }

    // Eye
    g.fill(255);
    g.circle(w - 15, h / 2 - 5, 8);
    g.fill(0);
    g.circle(w - 13, h / 2 - 5, 3);

    // Elite details
    if (isElite) {
        g.stroke(255, 200, 0);
        g.strokeWeight(2);
        g.noFill();
        g.ellipse(w / 2 + 5, h / 2, w - 15, isSlender ? h / 2 : h - 15);
    }
}

function drawHeavyFishSprite(g, bodyColor, finColor) {
    g.noSmooth();
    g.clear();
    let w = g.width;
    let h = g.height;

    // Fins (Spikes)
    g.fill(finColor);
    g.noStroke();
    for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let x = w / 2 + cos(angle) * (w / 2 - 5);
        let y = h / 2 + sin(angle) * (h / 2 - 5);
        g.circle(x, y, 8);
    }

    // Body
    g.fill(bodyColor);
    g.circle(w / 2, h / 2, w - 10);

    // Face
    g.fill(255);
    g.circle(w / 2 + 10, h / 2 - 10, 10);
    g.fill(0);
    g.circle(w / 2 + 12, h / 2 - 10, 4);

    // Mouth
    g.stroke(0);
    g.strokeWeight(2);
    g.line(w / 2 + 15, h / 2 + 10, w / 2 + 5, h / 2 + 10);
}

function drawSharkSprite(g, bodyColor, finColor) {
    g.noSmooth();
    g.clear();
    let w = g.width;
    let h = g.height;

    // Tail
    g.fill(finColor);
    g.noStroke();
    g.triangle(0, h / 2, 15, 5, 15, h - 5);

    // Dorsal Fin
    g.triangle(w / 2, h / 2 - 10, w / 2 + 10, 5, w / 2 + 20, h / 2 - 10);

    // Body
    g.fill(bodyColor);
    g.ellipse(w / 2 + 5, h / 2, w - 10, h / 2 + 5);

    // Eye (Angry)
    g.fill(255);
    g.circle(w - 15, h / 2 - 5, 6);
    g.fill(0);
    g.circle(w - 15, h / 2 - 5, 2);
    g.stroke(0);
    g.strokeWeight(1);
    g.line(w - 20, h / 2 - 8, w - 10, h / 2 - 6); // Eyebrow
}

function drawJellyfishSprite(g, colorVal) {
    g.noSmooth();
    g.clear();
    let w = g.width;
    let h = g.height;

    // Head
    g.fill(colorVal);
    g.noStroke();
    g.arc(w / 2, h / 2 - 5, w - 10, h - 15, PI, 0);

    // Tentacles
    g.stroke(colorVal);
    g.strokeWeight(2);
    for (let i = 0; i < 4; i++) {
        let x = w / 4 + i * (w / 6);
        g.line(x, h / 2 - 5, x + sin(i) * 5, h - 5);
    }
}

function drawEelSprite(g, colorVal) {
    g.noSmooth();
    g.clear();
    let w = g.width;
    let h = g.height;

    g.noFill();
    g.stroke(colorVal);
    g.strokeWeight(h / 2);
    g.strokeCap(ROUND);

    // S-shape body
    g.beginShape();
    g.vertex(10, h / 2);
    g.bezierVertex(w / 3, 0, w * 2 / 3, h, w - 10, h / 2);
    g.endShape();

    // Eye
    g.noStroke();
    g.fill(255);
    g.circle(w - 12, h / 2 - 5, 5);
    g.fill(0);
    g.circle(w - 11, h / 2 - 5, 2);
}

function drawBossSprite(g) {
    g.noSmooth();
    g.clear();
    let w = g.width;
    let h = g.height;

    // Tentacles
    g.stroke(100, 0, 100);
    g.strokeWeight(8);
    for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let x1 = w / 2 + cos(angle) * 30;
        let y1 = h / 2 + sin(angle) * 30;
        let x2 = w / 2 + cos(angle + 0.5) * 60;
        let y2 = h / 2 + sin(angle + 0.5) * 60;
        g.line(x1, y1, x2, y2);
    }

    // Body (Head)
    g.fill(150, 0, 150);
    g.noStroke();
    g.ellipse(w / 2, h / 2, 70, 80);

    // Eye (Giant)
    g.fill(255, 255, 0);
    g.ellipse(w / 2, h / 2, 30, 30);

    // Pupil (Slit)
    g.fill(0);
    g.ellipse(w / 2, h / 2, 5, 25);
}
