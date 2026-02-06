// AUDIO INSTRUCTIONS - PLACEHOLDER BEEP SOUNDS
// These are JavaScript-generated beep sounds using Web Audio API
// To replace with actual audio files, place .wav or .mp3 files in /sounds/ folder

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.3;

        // Try to initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('✅ Audio system initialized with Web Audio API');
        } catch (e) {
            console.warn('⚠️ Web Audio API not available, using console placeholders');
        }
    }

    playBeep(frequency, duration, volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(volume * this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playPlayerShoot() {
        console.log('🔫 Player shoot');
        this.playBeep(440, 0.1, 0.2); // A4 note, short
    }

    playEnemyShoot() {
        console.log('💥 Enemy shoot');
        this.playBeep(330, 0.1, 0.15); // E4 note, short
    }

    playEnemyHit() {
        console.log('💢 Enemy hit');
        this.playBeep(220, 0.05, 0.25); // A3 note, very short
    }

    playEnemyDeath(enemyType = 'normal') {
        console.log(`💀 Enemy ${enemyType} death`);
        // Descending beep for death
        this.playBeep(440, 0.05, 0.2);
        setTimeout(() => this.playBeep(330, 0.05, 0.2), 50);
        setTimeout(() => this.playBeep(220, 0.1, 0.2), 100);
    }

    playBossSpawn() {
        console.log('👹 BOSS SPAWN!');
        // Ominous low rumble
        this.playBeep(110, 0.3, 0.3); // A2 note, long
        setTimeout(() => this.playBeep(165, 0.3, 0.3), 150); // E3 note
    }

    playLevelUp() {
        console.log('⬆️ Level up!');
        // Ascending victory beeps
        this.playBeep(523, 0.1, 0.25); // C5
        setTimeout(() => this.playBeep(659, 0.1, 0.25), 100); // E5  
        setTimeout(() => this.playBeep(784, 0.2, 0.25), 200); // G5
    }

    playVictory() {
        console.log('🎉 VICTORY!');
        // Victory fanfare
        this.playBeep(523, 0.15, 0.3); // C5
        setTimeout(() => this.playBeep(659, 0.15, 0.3), 150); // E5
        setTimeout(() => this.playBeep(784, 0.15, 0.3), 300); // G5
        setTimeout(() => this.playBeep(1047, 0.4, 0.3), 450); // C6 - long
    }

    setVolume(vol) {
        this.volume = constrain(vol, 0, 1);
    }

    toggle() {
        this.enabled = !this.enabled;
        console.log(`🔊 Sound ${this.enabled ? 'ON' : 'OFF'}`);
        return this.enabled;
    }
}

/*
TO ADD ACTUAL AUDIO FILES:
1. Create a /sounds/ folder in your project
2. Add .wav or .mp3 files:
   - player_shoot.wav
   - enemy_shoot.wav
   - enemy_hit.wav
   - enemy_death.wav
   - boss_spawn.wav
   - level_up.wav
   - victory.wav

3. Load them in constructor:
   this.sounds.playerShoot = loadSound('sounds/player_shoot.wav');
   
4. Play them:
   this.sounds.playerShoot.play();
*/
