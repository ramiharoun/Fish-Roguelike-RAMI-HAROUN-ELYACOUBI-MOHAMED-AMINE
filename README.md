# 🌊 AQUA ROGUE - Aquatic Roguelike Game

Un jeu roguelike aquatique avec des ennemis variés, un système de progression par niveau et des boss tous les 5 niveaux.

## 🎮 Comment Jouer

1. **Ouvrir le jeu** : Double-cliquez sur `index.html` dans votre navigateur
2. **Contrôles** :
   - **Flèches directionnelles** : Déplacer votre poisson
   - **Espace** : Tirer des projectiles
   - **P** : Pause
   - **D** : Mode debug (affiche les vecteurs de mouvement)

## 🐠 Types d'Ennemis

Le jeu contient **7 types d'ennemis différents** qui apparaissent progressivement :

| Type | Couleur | Niveau d'apparition | Caractéristiques |
|------|---------|---------------------|------------------|
| **Enemy** | Orange | Niveau 1 | Poisson de base, tir lent |
| **AggressiveFish** | Rouge | Niveau 2+ | Plus rapide, tire plus souvent |
| **FastFish** | Jaune | Niveau 2+ | Très rapide, esquive |
| **HeavyFish** | Bleu foncé | Niveau 4+ | Tanky, beaucoup de HP |
| **Jellyfish** | Violet | Niveau 4+ | Dégâts de zone pulsants |
| **Eel** | Vert | Niveau 7+ | Dash rapide vers le joueur |
| **EliteFish** | Violet élite | Niveau 7+ | Tire en cercle autour du joueur |
| **BOSS** | Massif | Niveaux 5, 10, 15, 20, 25, **30** | Boss final au niveau 30 = VICTOIRE |

## 📈 Progression

- **XP** : Gagnez de l'XP en tuant des ennemis (80% directe, 20% orbes)
- **Level Up** : Choisissez une amélioration à chaque niveau
- **Difficulté** : Augmente progressivement avec votre niveau
  - Plus d'ennemis (15 → 40)
  - Spawn plus rapide (2000ms → 500ms)
  - Ennemis plus forts

## 🎯 Objectif

Battez le **Boss Final au niveau 30** pour gagner !

## ⚙️ Architecture Technique

Le jeu utilise **Craig Reynolds Steering Behaviors** :
- Toutes les entités étendent la classe `Vehicle`
- Mouvements basés sur des forces (`applyForce`)
- Comportements : `seek`, `pursue`, `flee`, `wander`, `evade`

## 🔊 Audio

Sons générés dynamiquement avec Web Audio API (beeps).
Pour ajouter vos propres sons, placez des fichiers .wav dans `/sounds/`.

## 📁 Structure du Projet

```
AquaRogue/
├── index.html          # Point d'entrée
├── sketch.js           # Boucle de jeu principale
├── vehicle.js          # Classe de base Vehicle
├── player.js           # Joueur
├── enemy.js            # Tous les types d'ennemis
├── projectile.js       # Projectiles
├── spawner.js          # Système de spawn
├── gamestate.js        # État du jeu
├── ui.js               # Interface utilisateur
├── particles.js        # Effets visuels
├── soundmanager.js     # Gestion audio
├── loot.js             # Objets ramassables (XP, HP)
├── camera.js           # Caméra
├── controls.js         # Contrôles
├── style.css           # Styles
└── libraries/          # p5.js
```

## 🐛 Débogage

Si vous ne voyez pas la variété d'ennemis :
1. Ouvrez F12 (console développeur)
2. Vérifiez les erreurs en rouge
3. Rafraîchissez avec Ctrl+F5 (vidage du cache)

## 🎉 Bon jeu !

Créé avec Processing.js (p5.js) et Craig Reynolds Steering Behaviors.
