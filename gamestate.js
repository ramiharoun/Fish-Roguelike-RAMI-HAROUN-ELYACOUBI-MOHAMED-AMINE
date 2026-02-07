class GameState {
    static STATES = {
        MENU: 'MENU',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        LEVELUP: 'LEVELUP',
        GAMEOVER: 'GAMEOVER',
        VICTORY: 'VICTORY'
    };

    constructor() {
        this.currentState = GameState.STATES.MENU;
        // Note: level tracking removed - using player.level for everything
        this.score = 0;
        this.enemiesKilled = 0;
        this.bossesDefeated = 0;

        // Difficulty system
        this.difficulty = 'MEDIUM'; // Default: EASY, MEDIUM, HARD, PRO
    }

    getVictoryLevel() {
        const victoryLevels = {
            'EASY': 5,
            'MEDIUM': 10,
            'HARD': 15,
            'PRO': 20
        };
        return victoryLevels[this.difficulty] || 10;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    setState(newState) {
        this.currentState = newState;
    }

    isMenu() {
        return this.currentState === GameState.STATES.MENU;
    }

    isPlaying() {
        return this.currentState === GameState.STATES.PLAYING;
    }

    isPaused() {
        return this.currentState === GameState.STATES.PAUSED;
    }

    isLevelUp() {
        return this.currentState === GameState.STATES.LEVELUP;
    }

    isGameOver() {
        return this.currentState === GameState.STATES.GAMEOVER;
    }

    isVictory() {
        return this.currentState === GameState.STATES.VICTORY;
    }

    startGame() {
        this.currentState = GameState.STATES.PLAYING;
        this.score = 0;
        this.enemiesKilled = 0;
        this.bossesDefeated = 0;
    }


    addScore(points) {
        this.score += points;
    }

    enemyKilled() {
        this.enemiesKilled++;
    }

    bossDefeated() {
        this.bossesDefeated++;
        this.enemyKilled();
    }

    shouldSpawnBoss(playerLevel) {
        return playerLevel % 5 === 0;
    }

    reset() {
        this.currentState = GameState.STATES.MENU;
        this.score = 0;
        this.enemiesKilled = 0;
        this.bossesDefeated = 0;
    }
}
