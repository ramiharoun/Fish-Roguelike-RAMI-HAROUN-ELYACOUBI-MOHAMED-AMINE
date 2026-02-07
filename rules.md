# 📏 Règles d'Implémentation - Steering Behaviors

Ce document détaille les règles techniques suivies pour respecter le modèle de **Craig Reynolds** (Steering Behaviors) dans ce projet.

## 1. Architecture Orientée Objet & Héritage 🧬

**Règle :** Tous les agents autonomes mobiles DOIVENT hériter d'une classe de base commune implémentant la physique.

**Dans notre code :**
- La classe `Vehicle` (dans `vehicle.js`) est la classe parente.
- Elle contient les propriétés physiques : `pos` (position), `vel` (vitesse), `acc` (accélération).
- Tous les agents mobiles étendent cette classe :
  - `Player extends Vehicle`
  - `Enemy extends Vehicle`
  - `Projectile extends Vehicle`

```javascript
class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    // ...
  }
}
```

## 2. Physique Newtonienne Simplifiée 🍎

**Règle :** Le mouvement est piloté par l'accumulation de forces, pas par la manipulation directe de la position.
`Force = Masse * Accélération` (ici Masse = 1, donc `Force = Accélération`).

**Implémentation :**
- La méthode `applyForce(force)` ajoute une force au vecteur accélération.
- L'accélération s'ajoute à la vitesse.
- La vitesse s'ajoute à la position.
- L'accélération est réinitialisée à 0 à chaque frame.

```javascript
applyForce(force) {
  this.acc.add(force);
}

update() {
  this.vel.add(this.acc);
  this.vel.limit(this.maxSpeed);
  this.pos.add(this.vel);
  this.acc.set(0, 0);
}
```

## 3. Le Concept de "Steering Force" 🚗

**Règle :** Les comportements ne définissent pas directement la vitesse, mais une "force de pilotage" (steering force).

**Formule de Reynolds :**
`Steering Force = Desired Velocity - Current Velocity`

**Exemple (Seek) :**
1. **Desired Velocity :** Vecteur allant de l'agent vers la cible (à vitesse max).
2. **Steering :** Différence entre ce que l'agent VEUT faire et ce qu'il FAIT actuellement.
3. **Limit :** La force est limitée par `maxForce` pour simuler l'inertie/manœuvrabilité.

```javascript
let desired = p5.Vector.sub(target, this.pos);
desired.setMag(this.maxSpeed);
let steer = p5.Vector.sub(desired, this.vel);
steer.limit(this.maxForce);
```

## 4. Séparation Comportement / Rendu 🎨

**Règle :** La logique de calcul des forces (`behave`) doit être séparée de la logique de mise à jour physique (`update`) et du dessin (`show`).

**Structure :**
1. **`behave()`** : Calcule et applique les forces (Seek, Wander, Flee...).
2. **`update()`** : Applique les lois de la physique (Euler integration).
3. **`show()`** : Dessine l'agent à sa position actuelle.

## 5. Combinaison de Comportements (Blending) 🤝

**Règle :** Un agent complexe combine plusieurs comportements simultanément via une somme pondérée des forces.

**Dans notre code (ex: Enemy) :**
- Un ennemi peut **Wander** (chercher) ET **Avoid** (éviter les murs).
- Si le joueur est proche, il bascule sur **Pursue** (poursuite).
- Les forces s'accumulent dans `this.acc` avant d'être appliquées.

```javascript
// Exemple conceptuel
applyBehaviors() {
  let wander = this.wander();
  let avoid = this.avoidObstacles();
  
  wander.mult(1.0);
  avoid.mult(2.0); // Éviter les obstacles est prioritaire
  
  this.applyForce(wander);
  this.applyForce(avoid);
}
```
