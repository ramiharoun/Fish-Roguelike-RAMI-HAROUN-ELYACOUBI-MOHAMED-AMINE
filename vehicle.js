class Vehicle {
  static debug = false;

  constructor(x, y, inputColor = null) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 10;
    this.maxForce = 0.6;
    this.r = 16;
    this.rayonZoneDeFreinage = 100;
    // Default blue or custom color
    this.color = inputColor || color(100, 200, 255);
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    fill(0, 255, 0);
    circle(target.x, target.y, 16);
    return this.seek(target);
  }

  arrive(target, d = 0) {
    // 2nd argument true enables the arrival behavior
    // 3rd argument d is the distance behind the target
    // for "snake" behavior
    return this.seek(target, true, d);
  }

  wander() {
    // Wander behavior - random steering
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(100); // Distance ahead
    wanderPoint.add(this.pos);

    let wanderRadius = 50;

    // Debug visualization
    if (Vehicle.debug) {
      push();
      // Point devant (rouge)
      fill(255, 0, 0);
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 8);

      // Cercle de wander
      noFill();
      stroke(255);
      strokeWeight(1);
      circle(wanderPoint.x, wanderPoint.y, wanderRadius * 2);

      // Ligne vers le point
      stroke(255, 255, 255, 80);
      strokeWeight(2);
      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
      pop();
    }

    let theta = random(TWO_PI);
    let wanderOffset = createVector(wanderRadius * cos(theta), wanderRadius * sin(theta));
    wanderPoint.add(wanderOffset);

    // Debug: point sur le cercle (vert)
    if (Vehicle.debug) {
      push();
      fill(0, 255, 0);
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 12);

      // Ligne vers le point vert
      stroke(255, 255, 0);
      strokeWeight(1);
      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
      pop();
    }

    return this.seek(wanderPoint);
  }

  flee(target) {
    let desired = p5.Vector.sub(this.pos, target);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  seek(target, arrival = false, d = 0) {
    let valueDesiredSpeed = this.maxSpeed;

    if (arrival) {
      // On définit un rayon de 100 pixels autour de la cible
      // si la distance entre le véhicule courant et la cible
      // est inférieure à ce rayon, on ralentit le véhicule
      // desiredSpeed devient inversement proportionnelle à la distance
      // si la distance est petite, force = grande
      // Vous pourrez utiliser la fonction P5 
      // distance = map(valeur, valeurMin, valeurMax, nouvelleValeurMin, nouvelleValeurMax)
      // qui prend une valeur entre valeurMin et valeurMax et la transforme en une valeur
      // entre nouvelleValeurMin et nouvelleValeurMax

      // 1 - dessiner le cercle de rayon 100 autour de la target
      if (Vehicle.debug) {
        push();
        stroke(255, 255, 255);
        noFill();
        circle(target.x, target.y, this.rayonZoneDeFreinage);
        pop();
      }

      // 2 - calcul de la distance entre la cible et le véhicule
      let distance = p5.Vector.dist(this.pos, target);

      // 3 - si distance < rayon du cercle, alors on modifie desiredSPeed
      // qui devient inversement proportionnelle à la distance.
      // si d = rayon alors desiredSpeed = maxSpeed
      // si d = 0 alors desiredSpeed = 0
      if (distance < this.rayonZoneDeFreinage) {
        valueDesiredSpeed = map(distance, d, this.rayonZoneDeFreinage, 0, this.maxSpeed);
      }
    }

    // Ici on calcule la force à appliquer au véhicule
    // pour aller vers la cible (avec ou sans arrivée)
    // un vecteur qui va vers la cible, c'est pour le moment la vitesse désirée
    let desiredSpeed = p5.Vector.sub(target, this.pos);
    desiredSpeed.setMag(valueDesiredSpeed);

    // Force = desiredSpeed - currentSpeed
    let force = p5.Vector.sub(desiredSpeed, this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    // Removed rotation to keep droplets upright

    // Draw water droplet shape
    // Draw water droplet shape
    fill(this.color); // Use instance color
    noStroke();

    // Droplet shape using beginShape
    beginShape();
    vertex(0, -this.r);  // Top point
    bezierVertex(this.r / 2, -this.r, this.r, -this.r / 3, this.r, this.r / 3); // Right curve
    bezierVertex(this.r, this.r * 0.6, this.r / 2, this.r, 0, this.r); // Bottom right
    bezierVertex(-this.r / 2, this.r, -this.r, this.r * 0.6, -this.r, this.r / 3); // Bottom left
    bezierVertex(-this.r, -this.r / 3, -this.r / 2, -this.r, 0, -this.r); // Left curve back to top
    endShape(CLOSE);

    // Add white highlight for water effect
    fill(255, 255, 255, 150);
    ellipse(-this.r / 4, -this.r / 3, this.r / 3, this.r / 3);

    pop();
  }

  showWithFace(target) {
    // Draw the droplet body first
    this.show();

    // Add cute eyes
    push();
    translate(this.pos.x, this.pos.y);
    // Removed rotation - face stays upright

    // Eyes
    fill(255); // White of eyes
    noStroke();
    ellipse(-this.r / 3, -this.r / 4, this.r / 2, this.r / 2); // Left eye white
    ellipse(this.r / 3, -this.r / 4, this.r / 2, this.r / 2); // Right eye white

    fill(0); // Pupils
    ellipse(-this.r / 3, -this.r / 4, this.r / 4, this.r / 4); // Left pupil
    ellipse(this.r / 3, -this.r / 4, this.r / 4, this.r / 4); // Right pupil

    // Cute white highlights in eyes
    fill(255);
    ellipse(-this.r / 3 + this.r / 12, -this.r / 4 - this.r / 12, this.r / 8, this.r / 8);
    ellipse(this.r / 3 + this.r / 12, -this.r / 4 - this.r / 12, this.r / 8, this.r / 8);

    // Emoji Mouth (🫦)
    textAlign(CENTER, CENTER);
    textSize(16);
    text('🫦', 0, this.r / 3);

    pop();
  }

  showWithTail() {
    // Draw the droplet body first (Upright)
    this.show();

    // Add mermaid tail (Rotated to follow movement)
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI / 2); // Tail aligns with velocity

    // Tail fin (Horizontal alignment like a dolphin/whale)
    fill(100, 200, 220);
    noStroke();

    // Start slightly inside body to ensure connection
    let startY = this.r * 0.8;

    // Symmetrical Tail Fluke
    beginShape();
    vertex(0, startY); // Center connection point

    // Left Fluke
    bezierVertex(-this.r, startY + 10, -this.r - 5, startY + 15, -this.r - 8, startY + 20);
    bezierVertex(-this.r - 5, startY + 18, -this.r, startY + 12, 0, startY + 8);

    // Right Fluke
    bezierVertex(this.r, startY + 12, this.r + 5, startY + 18, this.r + 8, startY + 20);
    bezierVertex(this.r + 5, startY + 15, this.r, startY + 10, 0, startY);

    endShape(CLOSE);

    // Tail highlights
    fill(150, 230, 255, 120);
    ellipse(-this.r / 2, startY + 15, this.r / 3, this.r / 4);
    ellipse(this.r / 2, startY + 15, this.r / 3, this.r / 4);

    pop();
  }

  showMermaid() {
    // 1. Draw Body (Upright)
    this.show();

    // 2. Draw Tail (Aligned with Velocity)
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI / 2); // Tail aligns with velocity

    fill(100, 200, 220);
    noStroke();

    let startY = this.r * 0.8;

    beginShape();
    vertex(0, startY);
    // Left Fluke
    bezierVertex(-this.r, startY + 10, -this.r - 5, startY + 15, -this.r - 8, startY + 20);
    bezierVertex(-this.r - 5, startY + 18, -this.r, startY + 12, 0, startY + 8);
    // Right Fluke
    bezierVertex(this.r, startY + 12, this.r + 5, startY + 18, this.r + 8, startY + 20);
    bezierVertex(this.r + 5, startY + 15, this.r, startY + 10, 0, startY);
    endShape(CLOSE);

    // Tail highlights
    fill(150, 230, 255, 120);
    ellipse(-this.r / 2, startY + 15, this.r / 3, this.r / 4);
    ellipse(this.r / 2, startY + 15, this.r / 3, this.r / 4);
    pop();

    // 3. Draw Face (Upright - Eyes + Mouth 🫦)
    push();
    translate(this.pos.x, this.pos.y);

    // Eyes
    fill(255);
    noStroke();
    ellipse(-this.r / 3, -this.r / 4, this.r / 2, this.r / 2);
    ellipse(this.r / 3, -this.r / 4, this.r / 2, this.r / 2);

    fill(0); // Pupils
    ellipse(-this.r / 3, -this.r / 4, this.r / 4, this.r / 4);
    ellipse(this.r / 3, -this.r / 4, this.r / 4, this.r / 4);

    // Highlights
    fill(255);
    ellipse(-this.r / 3 + this.r / 12, -this.r / 4 - this.r / 12, this.r / 8, this.r / 8);
    ellipse(this.r / 3 + this.r / 12, -this.r / 4 - this.r / 12, this.r / 8, this.r / 8);

    // Emoji Mouth (🫦)
    textAlign(CENTER, CENTER);
    textSize(16);
    text('🫦', 0, this.r / 3);

    pop();
  }

  edges() {
    // Bounce off edges instead of wrapping
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill("#F063A4");
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.r * 2);
    pop();
  }
}
