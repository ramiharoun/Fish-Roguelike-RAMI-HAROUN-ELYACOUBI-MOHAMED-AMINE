class OceanBackground {
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.bubbles = [];
        this.marineSnow = [];

        // Initialize distinct bubble layers for parallax
        // Layer 1: Small, slow, background (Far)
        for (let i = 0; i < 200; i++) {
            this.bubbles.push({
                x: random(w),
                y: random(h),
                size: random(1, 3),
                speed: random(0.2, 0.8),
                layer: 0,
                alpha: 50
            });
        }
        // Layer 2: Medium, faster (Mid)
        for (let i = 0; i < 100; i++) {
            this.bubbles.push({
                x: random(w),
                y: random(h),
                size: random(3, 6),
                speed: random(1, 2),
                layer: 1,
                alpha: 100
            });
        }

        // Initialize Marine Snow (particulates)
        for (let i = 0; i < 300; i++) {
            this.marineSnow.push({
                x: random(w),
                y: random(h),
                size: random(0.5, 1.5),
                speedX: random(-0.2, 0.2),
                speedY: random(0.1, 0.5),
                offset: random(1000)
            });
        }

        // Caustics (Light rays)
        this.caustics = [];
        for (let i = 0; i < 20; i++) {
            this.caustics.push({
                x: random(width),
                width: random(50, 200),
                alpha: random(10, 30),
                speed: random(0.001, 0.005)
            });
        }

        // Initialize Sandy Background Elements
        this.sandTexture = [];
        // Generate random sand grains/pebbles
        for (let i = 0; i < 2000; i++) {
            this.sandTexture.push({
                x: random(w),
                y: random(h),
                type: random() < 0.9 ? 'grain' : 'pebble',
                size: random() < 0.9 ? random(1, 3) : random(3, 6),
                color: color(map(random(), 0, 1, 160, 200), map(random(), 0, 1, 150, 180), map(random(), 0, 1, 100, 140), 150)
            });
        }
    }

    update(camera) {
        let t = millis() * 0.001;

        // Update bubbles
        for (let b of this.bubbles) {
            b.y -= b.speed;
            b.x += sin(t + b.y * 0.01) * 0.5; // Gentle wobble

            // Loop vertical
            if (b.y < camera.y - height / 2) {
                b.y = camera.y + height + random(100);
                b.x = camera.x + random(-width, width);
            }
        }

        // Update Marine Snow
        for (let s of this.marineSnow) {
            s.y += s.speedY;
            s.x += s.speedX + sin(t + s.offset) * 0.2;

            if (s.y > this.height) {
                s.y = 0;
                s.x = random(this.width);
            }
        }
    }

    show(camera) {
        // 1. SANDY OCEAN FLOOR (Top-Down)
        push();

        // A. Base Sand Color
        background(210, 195, 150); // Light Sand

        // B. Sand Detail & Ripples
        // Draw in world space
        push();
        translate(-camera.x + width / 2, -camera.y + height / 2); // Apply camera transform manually

        // Sand Ripples (Light bands)
        noFill();
        stroke(190, 175, 130, 100); // Slightly darker sand color
        strokeWeight(2);

        // Draw ripples based on world coordinates
        // We can use a loop or noise, let's use sine waves for simple ripples
        let rippleSpacing = 40;
        let visibleWorldLeft = camera.x - width / 2 - 100;
        let visibleWorldRight = camera.x + width / 2 + 100;
        let visibleWorldTop = camera.y - height / 2 - 100;
        let visibleWorldBottom = camera.y + height / 2 + 100;

        // Align to grid to avoid jitter
        let startX = Math.floor(visibleWorldLeft / rippleSpacing) * rippleSpacing;

        // Simulating sand ripples
        /*
        for (let x = startX; x < visibleWorldRight; x += rippleSpacing) {
           // Draw vertical-ish wavy lines
           beginShape();
           for (let y = visibleWorldTop; y < visibleWorldBottom; y += 50) {
               let xOffset = sin(y * 0.01 + x * 0.005) * 20;
               vertex(x + xOffset, y);
           }
           endShape();
        } 
        */
        // Let's try drawing horizontal bands of differing brightness to simulate dunes/ripples
        noStroke();
        for (let y = Math.floor(visibleWorldTop / 50) * 50; y < visibleWorldBottom; y += 50) {
            fill(200, 185, 140, 80); // Shadow/Darker band
            // Wavy band
            beginShape();
            vertex(visibleWorldLeft, y);
            for (let x = visibleWorldLeft; x <= visibleWorldRight; x += 100) {
                let yOff = sin(x * 0.01 + y * 0.02) * 20;
                vertex(x, y + yOff);
            }
            vertex(visibleWorldRight, y);
            vertex(visibleWorldRight, y + 25); // Thickness
            for (let x = visibleWorldRight; x >= visibleWorldLeft; x -= 100) {
                let yOff = sin(x * 0.01 + y * 0.02) * 20;
                vertex(x, y + yOff + 25);
            }
            endShape(CLOSE);
        }

        noStroke();
        for (let t of this.sandTexture) {
            // Optimization: Simple cull
            if (t.x > camera.x - width / 2 - 50 && t.x < camera.x + width / 2 + 50 &&
                t.y > camera.y - height / 2 - 50 && t.y < camera.y + height / 2 + 50) {
                fill(t.color);
                if (t.type === 'grain') {
                    rect(t.x, t.y, t.size, t.size);
                } else {
                    ellipse(t.x, t.y, t.size, t.size);
                }
            }
        }
        pop();

        // C. Blue Water Filter (Stronger)
        // Darker blue, higher opacity
        fill(0, 80, 180, 100); // Stronger Blue Tint
        noStroke();
        rect(0, 0, width, height);

        pop();

        push();
        // Camera context for world objects could be applied here, BUT
        // Background elements like caustics should be screen space or world space?
        // Caustics are light rays, usually fixed relative to surface/camera. Screen space is easier.

        // 2. LIGHT RAYS (CAUSTICS) - Screen Space
        resetMatrix();
        blendMode(ADD); // Additive blending for light glow
        noStroke();
        let t = millis() * 0.001;

        for (let c of this.caustics) {
            let xOffset = sin(t * c.speed + c.x) * 50;
            fill(255, 255, 255, c.alpha + sin(t + c.x) * 5);

            // Angled rays
            beginShape();
            vertex(c.x + xOffset - c.width / 2, 0);
            vertex(c.x + xOffset + c.width / 2, 0);
            fill(255, 255, 255, 0); // Fade out at bottom
            vertex(c.x + xOffset + c.width + 100, height);
            vertex(c.x + xOffset - 100, height);
            endShape();
        }
        blendMode(BLEND); // Reset blend mode
        pop();

        // 3. MARINE SNOW (World Space but drifiting)
        // To make it look dense without millions of particles, screen space wrapping is best.
        push();
        resetMatrix();
        noStroke();
        fill(255, 255, 255, 150);

        for (let s of this.marineSnow) {
            // Parallax movement based on camera
            let px = (s.x - camera.x * 0.2) % width;
            let py = (s.y - camera.y * 0.2) % height;
            if (px < 0) px += width;
            if (py < 0) py += height;

            circle(px, py, s.size);
        }
        pop();

        // 4. BUBBLES (Parallax Layers)
        push();
        resetMatrix();
        noStroke();

        for (let b of this.bubbles) {
            let parallax = b.layer === 0 ? 0.4 : 0.7; // Far bubbles move slower
            let px = (b.x - camera.x * parallax) % width;
            let py = (b.y - camera.y * parallax) % height;
            if (px < 0) px += width;
            if (py < 0) py += height;

            fill(255, 255, 255, b.alpha);
            circle(px, py, b.size);

            // Shine on bubble
            fill(255, 255, 255, b.alpha + 50);
            circle(px - b.size * 0.3, py - b.size * 0.3, b.size / 3);
        }
        pop();

        // 5. SEABED (World Space - Foreground)
        // Only draw if within view
        if (camera.y + height > this.height - 300) {
            // 5. SEABED REMOVED
            // For top-down deep ocean, we don't see the floor unless shallow.
            // Assuming deep ocean for now.
            pop();
        }
    }
}
