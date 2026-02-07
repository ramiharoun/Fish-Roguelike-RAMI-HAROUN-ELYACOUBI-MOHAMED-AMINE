# 🐟 Fish Roguelike - Projet TP

**Jouer en ligne:** [https://rami-elyacoubi.itch.io/fish-rogue-like](https://rami-elyacoubi.itch.io/fish-rogue-like)

**Vidéo de Démo:**
[![Demo Fish Roguelike](https://img.youtube.com/vi/e1IqszDrMCM/0.jpg)](https://www.youtube.com/watch?v=e1IqszDrMCM)

**Développeurs:** RAMI, HAROUN, ELYACOUBI Mohamed Amine

---

## 📖 Description du Projet

Fish Roguelike est un jeu d'action roguelike aquatique développé avec p5.js utilisant des comportements autonomes (steering behaviors) pour l'intelligence artificielle des ennemis. Le joueur incarne un poisson qui doit survivre dans un environnement sous-marin hostile, affronter des vagues d'ennemis et vaincre des boss pour progresser.

---

## 🎮 Comment Jouer



### Contrôles
- **Flèches** - Déplacer le poisson
- **Espace** - Tirer
- **Shift** - Dash (compétence débloquable)
- **Q** - Attaque AOE (compétence débloquable)
- **ESC** - Pause
- **D** - Debug mode (développement)

### Système de Difficulté
Choisissez votre difficulté en début de partie:
- **😊 Facile** - Victoire au niveau 5
- **🙂 Moyen** - Victoire au niveau 10
- **😐 Difficile** - Victoire au niveau 15
- **😈 Pro** - Victoire au niveau 20

---

##  Comportements (Steering Behaviors)

#### Wander (Errance)
**Quand:** Comportement par défaut quand le joueur est loin ou hors de vue.
**Comment:** Calcule un point cible aléatoire sur un cercle devant l'ennemi pour créer un mouvement naturel et imprévisible.
**Qui:** Tous les ennemis (Enemy, HeavyFish, Jellyfish) quand ils ne chassent pas.
**Pourquoi:** Donne vie à l'environnement même quand le joueur n'interagit pas, évitant que les ennemis restent statiques.

#### Pursue (Poursuite)
**Quand:** Quand le joueur entre dans le rayon de détection.
**Comment:** Poursuit la *future* position du joueur (basée sur sa vitesse) plutôt que sa position actuelle.
**Qui:** 
- **AggressiveFish:** Poursuite rapide et directe.
- **HeavyFish:** Poursuite lente mais tenace.
- **Boss:** Poursuite agressive en phase d'attaque.
**Pourquoi:** Rend les ennemis plus difficiles à esquiver car ils "anticipent" vos mouvements.

#### Evade (Évitement)
**Quand:** Utilisé par le Boss pour esquiver les attaques ou par les poissons rapides.
**Comment:** Inverse de Pursue : fuit la future position de la menace.
**Qui:** 
- **Boss:** En phase défensive ou aléatoire.
- **FastFish:** Pour éviter d'être coincé.
**Pourquoi:** Crée des combats dynamiques où l'IA ne se contente pas de foncer sur le joueur.

#### Flee (Fuite)
**Quand:** Quand le joueur est trop proche (comportement de "harcèlement").
**Comment:** S'éloigne directement de la position du joueur à vitesse maximale.
**Qui:** 
- **FastFish:** Fuit si le joueur est trop près (< 100px) pour garder ses distances.
- **EliteFish:** Maintient une distance de sécurité pour tirer.
**Pourquoi:** Permet aux ennemis à distance de ne pas se faire tuer au corps-à-corps et de maintenir la pression (kiting).

#### Seek/Arrive (Recherche/Arrivée)
**Quand:** Utilisé par les projectiles, le Boss (phase cercle) et FastFish.
**Comment:** 
- **Seek:** Rejoint une cible précise.
- **Arrive:** Rejoint une cible en ralentissant (freinage).
**Qui:** 
- **Projectiles:** Se guident vers les ennemis/joueur.
- **Boss:** Utilise Seek pour tourner autour du joueur (Circle state).
- **FastFish:** Utilise Seek pour se repositionner en flanc.
**Pourquoi:** Essentiel pour la précision des tirs et les mouvements tactiques complexes (encerclement).

---

##  Fonctionnalités Principales

- **Système de Niveaux** - Progression RPG avec XP et montée de niveau
- **5 Types d'Ennemis** - Chacun avec des comportements IA uniques basés sur les steering behaviors
- **Boss Fights** - Boss tous les 5 niveaux avec musique et effets spéciaux
- **Système d'Upgrades** - Roulette animée avec 5 améliorations différentes
- **4 Niveaux de Difficulté** - De Facile (niveau 5) à Pro (niveau 20)
- **Musique Procédurale** - Système de génération musicale dynamique
- **Environnement Vivant** - Obstacles, particules, effets visuels
- **États de Jeu** - Menu, jeu, pause, level-up, victoire, game over

---

##  Architecture Technique

### Structure du Code
- `sketch.js` - Boucle principale du jeu
- `vehicle.js` - Classe de base avec steering behaviors 
- `player.js` - Gestion du joueur
- `enemy.js` - 5 classes d'ennemis avec comportements distincts
- `gamestate.js` - Machine à états du jeu
- `ui.js` - Interface utilisateur
- `soundmanager.js` - Système audio procédural
- `spawner.js` - Gestion du spawn des ennemis
- `obstacle.js` - Obstacles décoratifs
- `background.js` - Gestionnaire de fond océanique
- `particles.js` - Système de particules
- `projectile.js` - Gestion des projectiles
- `loot.js` - Objets ramassables (XP, HP)

### Héritage
Tous les éléments mobiles héritent de `Vehicle` pour bénéficier des comportements:
- `Player extends Vehicle`
- `Enemy extends Vehicle` (+ sous-classes: AggressiveFish, GuardFish, etc.)
- `Projectile extends Vehicle`
- `EnemyProjectile extends Vehicle`

---

##  Aspects Visuels

- **Sprites Procéduraux** - Génération de sprites via code (pas d'assets externes)
- **Particules** - Effets de tir, explosion, mort, AOE
- **Background Dynamique** - Coraux, algues, rochers procéduraux
- **Animations** - Roulette de level-up, apparition de boss, effets de dash

---

##  Difficultés Rencontrées

   - Problème: La gestion de la courbe de difficulté et l'équilibrage du jeu.
   - Solution: Nous avons utilisé un système de niveaux et de difficultés pour que le jeu soit de plus en plus difficile au fur et à mesure que le joueur progresse. Et on a fait en sorte que des ennemis plus forts apparaissent à des niveaux plus élevés. 
   - Problème: La gestion de l'avancement dans le jeu qui était trop lent.
   - Solution: Nous avons diminué la quantité de points d'expérience nécessaires pour monter de niveau.
--- 

##  Ce Dont Nous Sommes Le Plus Fiers

 **[La gestion de la difficulté et de l'avancement dans le jeu]**
   - Description: [Parceque ça a été un vrai défi de trouver le bon équilibre entre la difficulté et l'avancement dans le jeu, et maintenant que nous avons réussi à le faire, nous sommes très fiers de cette réalisation malgrès le fait qu'il y ait encore des améliorations à faire]

---

##  Utilisation d'Outils IA

### 1. Gemini (via IDE Agent "Antigravity")
**Cas d'Usage:** Développement principal, débogage complexe et analyse de code.
**Fréquence:** Systématique tout au long du développement.

### 2. ChatGPT (OpenAI)
**Cas d'Usage:** Génération d'idées, rédaction de textes et création de prompts spécifiques.
**Fréquence:** Ponctuelle pour des besoins créatifs.

#### Exemples de Prompts Utilisés

**Prompt 1: Génération de Sprites Procéduraux**
```
Génère une fonction p5.js createGraphics pour dessiner un poisson aggressif rouge avec des dents pointues, sans utiliser d'images externes.
```
**Résultat:** Obtention de la fonction `drawAggressiveFishSprite` qui dessine le sprite vectoriel utilisé pour les ennemis rouges.

**Prompt 2: Débogage des Collisions**
```
Mes projectiles traversent parfois les ennemis. Aides moi à régler ça.
```
**Résultat:** Pour résoudre le problème des projectiles traversant les ennemis, nous avons implémenté plusieurs boucles de mise à jour pour les physiques rapides et ajusté la taille des hitboxes pour qu'elles soient légèrement plus grandes que les sprites visuels.

#### Réflexion sur l'Usage de l'IA
L'utilisation de l'IA a considérablement accéléré le développement, mais si on ne garde pas le contrôle sur le code, il peut devenir difficile de le maintenir et de le comprendre. Il faut l'utiliser tout en suivant les changement effectuer sur le code. Sur certains points c'était plus difficile à faire. Certaines parties du code sont sans doute géneré par IA de la mauvaise manière sans pour autant qu'on aie pu suivre exectement ce que l'IA avait fait. Et par exemple pour la génération des sprites et des musique nous n'avons aucune idée de comment l'IA avait fait. Mais c'est quand même un outil très utile et agréable à utiliser.

---

##  Technologies Utilisées

- **p5.js** - Framework graphique et de rendu
- **p5.sound** - Génération audio procédurale
- **JavaScript ES6** - Langage de programmation
- **HTML5/CSS3** - Interface web

---

##  Notes Techniques

- Le jeu utilise un système de coordonnées monde (3000x2000) avec caméra mobile
- Les sprites sont générés procéduralement pour éviter les limitations de quota
- La musique est entièrement générée par code (pas de fichiers audio)
- Le système de spawning s'adapte au niveau du joueur
- Les boss apparaissent tous les 5 niveaux avec scaling de difficulté

---

## Crédits
Projet réalisé dans le cadre du cours IA REACTIVE - 2026

**Professeur:** Michel BUFFA

**Développeurs:**
- RAMI Haroun  
- ELYACOUBI Mohamed Amine

---

*Bon jeu! 🐟💙*
