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

        // Seabed Generation using noise (pre-calculated for performance)
        this.seabedPoints = [];
        let detail = 20; // Points every 20px
        for (let x = 0; x <= w + 200; x += detail) {
            // Mix of sine waves for rolling hills
            let y = h - 150 + sin(x * 0.005) * 50 + sin(x * 0.02) * 20;
            this.seabedPoints.push({ x: x, y: y });
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
        // 1. VIBRANT GRADIENT BACKGROUND
        // We draw this relative to screen.
        // We must ensure consistent coloring.

        // Since background() clears canvas, we draw a huge rect in screen space?
        // No, we can just draw lines on screen.

        push();
        resetMatrix();

        // Top: Surface Light (Turquoise/Cyan) -> Bottom: Deep Ocean (Dark Navy)
        let cTop = color(0, 150, 180);    // Bright Turquoise
        let cMid = color(0, 80, 140);     // Medium Blue
        let cBot = color(0, 20, 50);      // Deep Navy

        // Draw gradient mesh
        noStroke();
        beginShape(QUADS);
        // Top section
        fill(cTop); vertex(0, 0); vertex(width, 0);
        fill(cMid); vertex(width, height * 0.6); vertex(0, height * 0.6);
        // Bottom section
        fill(cMid); vertex(0, height * 0.6); vertex(width, height * 0.6);
        fill(cBot); vertex(width, height); vertex(0, height);
        endShape();
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
            push();
            camera.apply(); // Use actual camera transform

            // Sand Color
            fill(194, 178, 128); // Sand
            noStroke();

            beginShape();
            vertex(0, this.height); // Bottom Left (World Coords)

            // Draw generated terrain
            for (let p of this.seabedPoints) {
                // p.x is world x.
                // We only need to draw points near camera?
                // For now draw all is fine for 3000px width.
                vertex(p.x, p.y);
            }

            vertex(this.width, this.height); // Bottom Right
            endShape(CLOSE);

            // Add texture/stones on seabed
            fill(160, 150, 110);
            for (let i = 0; i < this.seabedPoints.length; i += 5) {
                let p = this.seabedPoints[i];
                // Simple scattering
                if ((p.x * 123 + p.y) % 10 < 3) {
                    ellipse(p.x, p.y + 10, 10, 6);
                }
            }

            pop();
        }
    }
}
