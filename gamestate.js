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
        this.level = 1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.bossesDefeated = 0;
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
        this.level = 1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.bossesDefeated = 0;
    }

    nextLevel() {
        this.level++;
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

    shouldSpawnBoss() {
        return this.level % 5 === 0;
    }

    reset() {
        this.currentState = GameState.STATES.MENU;
        this.level = 1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.bossesDefeated = 0;
    }
}
