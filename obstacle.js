class Obstacle {
    constructor(x, y, type) {
        this.pos = createVector(x, y);
        this.type = type; // 'rock', 'coral', 'seaweed', 'small_rock'

        // Visual randomization
        this.seed = random(1000);
        this.angle = random(TWO_PI);

        if (type === 'seaweed') {
            this.r = random(40, 60);
            this.color = color(40, 180, 80, 200);
            this.segments = floor(random(5, 8));
            this.height = random(80, 140);
        } else if (type === 'small_rock') {
            this.r = random(12, 20);
            this.color = color(100, 95, 90); // Dark grey/brown
        } else if (type === 'coral') {
            this.r = random(40, 70);
            // Vibrant Coral Colors: Pink, Purple, Orange
            let colors = [
                color(255, 100, 150), // Pink
                color(150, 100, 255), // Purple
                color(255, 150, 100)  // Orange
            ];
            this.color = random(colors);
        } else {
            // Big Rock
            this.r = random(50, 90);
            this.color = color(80, 75, 70); // Darker organic rock
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        if (this.type === 'seaweed') {
            this.drawSeaweed();
        } else if (this.type === 'coral') {
            this.drawCoral();
        } else {
            this.drawRock();
        }

        pop();
    }

    drawRock() {
        // Organic Rock Shape using noise
        fill(this.color);
        noStroke();

        // Main mass
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.2) {
            let xoff = map(cos(a), -1, 1, 0, 2);
            let yoff = map(sin(a), -1, 1, 0, 2);
            let r = this.r + map(noise(xoff + this.seed, yoff + this.seed), 0, 1, -10, 10);
            vertex(r * cos(a), r * sin(a));
        }
        endShape(CLOSE);

        // Highlights/Cracks
        fill(0, 0, 0, 50);
        circle(0, 0, this.r * 0.5); // Shadow center
        fill(255, 255, 255, 20);
        circle(-this.r * 0.3, -this.r * 0.3, this.r * 0.3); // Highlight top left
    }

    drawCoral() {
        fill(this.color);
        stroke(red(this.color) - 30, green(this.color) - 30, blue(this.color) - 30);
        strokeWeight(1);

        // Brain Coral / Tubular shape
        let branches = 6;
        for (let i = 0; i < branches; i++) {
            let angle = (TWO_PI / branches) * i;
            let len = this.r * 0.8;
            push();
            rotate(angle);
            ellipse(len / 2, 0, len, this.r * 0.4);
            // Dot pore
            noStroke();
            fill(255, 255, 255, 150);
            circle(len / 2, 0, 4);
            pop();
        }
        // Center
        circle(0, 0, this.r * 0.6);
    }

    drawSeaweed() {
        stroke(this.color);
        strokeWeight(6);
        strokeCap(ROUND);
        noFill();

        // Swaying motion
        let time = millis() * 0.002;

        // Draw a clump of 3 strands
        for (let j = -1; j <= 1; j++) {
            let h = this.height - abs(j) * 20;
            let offset = j * 10;

            beginShape();
            vertex(offset, 0); // Base grounded

            // Control points for curve
            let cp1x = offset + sin(time + this.seed) * 20;
            let cp1y = -h * 0.3;
            let cp2x = offset + sin(time + this.seed + 1) * 40;
            let cp2y = -h * 0.7;
            let endx = offset + sin(time + this.seed + 2) * 60;
            let endy = -h;

            bezierVertex(cp1x, cp1y, cp2x, cp2y, endx, endy);
            endShape();

            // Leaf bits
            noStroke();
            fill(this.color);
            circle(endx, endy, 8);
        }
    }

    checkCollision(entity) {
        let d = p5.Vector.dist(this.pos, entity.pos);

        if (this.type === 'seaweed' || this.type === 'coral') {
            // Slow down effect for plants (Seaweed and Coral/Flowers)
            if (d < this.r && entity.vel) {
                entity.vel.mult(0.95); // Drag effect
                return false; // No physical collision
            }
        } else {
            // Solid collision for rocks/coral
            if (d < this.r * 0.8 + entity.r) {
                let repulsion = p5.Vector.sub(entity.pos, this.pos);
                repulsion.normalize();

                // Stronger repulsion to prevent sticking
                // Push out to edge + buffer
                let overlap = (this.r * 0.8 + entity.r) - d;
                repulsion.mult(overlap + 2);
                entity.pos.add(repulsion);

                // Kill velocity colliding into it
                if (entity.vel) {
                    entity.vel.mult(0.5);
                }
                return true;
            }
        }
        return false;
    }

    checkProjectileCollision(proj) {
        // Projectiles only hit solid rocks, ignore seaweed and coral
        if (this.type === 'seaweed' || this.type === 'coral') return false;

        let d = p5.Vector.dist(this.pos, proj.pos);
        if (d < this.r * 0.7 + proj.r) {
            return true;
        }
        return false;
    }
}

class ObstacleManager {
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.obstacles = [];

        this.generateObstacles(100); // More obstacles for ambience
    }

    generateObstacles(count) {
        for (let i = 0; i < count; i++) {
            let x = random(100, this.width - 100);
            let y = random(100, this.height - 100);

            // Weighted random for types
            let r = random();
            let type;
            if (r < 0.4) type = 'small_rock';     // 40% small rocks
            else if (r < 0.7) type = 'seaweed';   // 30% seaweed
            else if (r < 0.9) type = 'rock';      // 20% big rocks
            else type = 'coral';                  // 10% corals

            // Randomize placement
            let valid = true;
            for (let other of this.obstacles) {
                let d = dist(x, y, other.pos.x, other.pos.y);
                if (d < 50) { // Allow closer grouping
                    valid = false;
                    break;
                }
            }

            if (valid) {
                this.obstacles.push(new Obstacle(x, y, type));
            }
        }
    }

    update(player, enemies, projectiles, enemyProjectiles) {
        // Check collisions with player
        for (let obs of this.obstacles) {
            obs.checkCollision(player);
        }

        // Check collisions with enemies
        if (enemies) {
            for (let enemy of enemies) {
                for (let obs of this.obstacles) {
                    obs.checkCollision(enemy);
                }
            }
        }

        // Check collisions with player projectiles
        if (projectiles) {
            for (let i = projectiles.length - 1; i >= 0; i--) {
                let proj = projectiles[i];
                let hit = false;
                for (let obs of this.obstacles) {
                    if (obs.checkProjectileCollision(proj)) {
                        hit = true;
                        break;
                    }
                }
                if (hit) {
                    projectiles.splice(i, 1);
                }
            }
        }

        // Check collisions with enemy projectiles
        if (enemyProjectiles) {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                let proj = enemyProjectiles[i];
                let hit = false;
                for (let obs of this.obstacles) {
                    if (obs.checkProjectileCollision(proj)) {
                        hit = true;
                        break;
                    }
                }
                if (hit) {
                    enemyProjectiles.splice(i, 1);
                }
            }
        }
    }

    show() {
        for (let obs of this.obstacles) {
            obs.show();
        }
    }
}
