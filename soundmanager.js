// PHASE 4 - PROCEDURAL MUSIC ENGINE
// Generative ocean-themed music for all game states

class MusicGenerator {
    constructor(masterVolume) {
        this.masterVolume = masterVolume || 0.3;
        this.currentMusic = null;
        this.musicType = null;
        this.oscillators = [];
        this.sequences = [];
        this.initialized = false;
    }

    init() {
        this.initialized = true;
    }

    stopMusic() {
        try {
            // Clear all sequences
            for (let seq of this.sequences) {
                clearInterval(seq);
            }
            this.sequences = [];

            // Stop all oscillators
            for (let osc of this.oscillators) {
                osc.amp(0, 0.5);
                setTimeout(() => {
                    try {
                        osc.stop();
                    } catch (e) { }
                }, 600);
            }
            this.oscillators = [];
            this.musicType = null;
        } catch (e) {
            console.warn('⚠️ Error stopping music:', e);
        }
    }

    playMenuMusic() {
        if (this.musicType === 'menu') return;

        this.stopMusic();
        this.musicType = 'menu';

        try {
            // "Tidal Lullaby" - C Major (joyful)
            const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C4, D4, E4, F4, G4, A4, B4
            const bassDrone = [130.81]; // C3

            // Bass drone
            let bass = new p5.Oscillator('sine');
            bass.freq(bassDrone[0]);
            bass.amp(0);
            bass.start();
            bass.amp(0.06 * this.masterVolume, 2);
            this.oscillators.push(bass);

            // Joyful ascending melody
            let melodyIndex = 0;
            const melodyPattern = [0, 2, 4, 2, 4, 5, 4, 2, 0, 4, 6, 4]; // Uplifting pattern

            let melodySeq = setInterval(() => {
                try {
                    let note = scale[melodyPattern[melodyIndex % melodyPattern.length]];
                    let osc = new p5.Oscillator('sine');
                    osc.freq(note);
                    osc.amp(0);
                    osc.start();
                    osc.amp(0.06 * this.masterVolume, 0.1);
                    osc.amp(0, 1.5);

                    setTimeout(() => {
                        try {
                            osc.stop();
                        } catch (e) { }
                    }, 1600);

                    melodyIndex++;
                } catch (e) { }
            }, 1000); // Slow tempo (60 BPM)

            this.sequences.push(melodySeq);
        } catch (e) {
            console.warn('⚠️ Error playing menu music:', e);
        }
    }

    playGameplayMusic() {
        if (this.musicType === 'gameplay') return;

        this.stopMusic();
        this.musicType = 'gameplay';

        try {
            // "Deep Blue Exploration" - D Major (joyful exploration)
            const scale = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88]; // D4, E4, F#4, G4, A4, B4
            const bass = [146.83]; // D3

            // Bass pulse
            let bassOsc = new p5.Oscillator('triangle');
            bassOsc.freq(bass[0]);
            bassOsc.amp(0);
            bassOsc.start();
            bassOsc.amp(0.10 * this.masterVolume, 2);
            this.oscillators.push(bassOsc);

            // Flowing joyful melody
            let melodyIndex = 0;
            const melodyPattern = [0, 2, 4, 2, 5, 4, 2, 0, 3, 4, 5, 4, 2];

            let melodySeq = setInterval(() => {
                try {
                    let note = scale[melodyPattern[melodyIndex % melodyPattern.length]];
                    let osc = new p5.Oscillator('sine');
                    osc.freq(note);
                    osc.amp(0);
                    osc.start();
                    osc.amp(0.07 * this.masterVolume, 0.05);
                    osc.amp(0, 0.6);

                    setTimeout(() => {
                        try {
                            osc.stop();
                        } catch (e) { }
                    }, 700);

                    melodyIndex++;
                } catch (e) { }
            }, 750); // Medium tempo (80 BPM)

            this.sequences.push(melodySeq);

            // Harmony layer
            let harmonyIndex = 0;
            const harmonyPattern = [0, 3, 1, 4];

            let harmonySeq = setInterval(() => {
                try {
                    let note = scale[harmonyPattern[harmonyIndex % harmonyPattern.length]] * 0.5;
                    let osc = new p5.Oscillator('triangle');
                    osc.freq(note);
                    osc.amp(0);
                    osc.start();
                    osc.amp(0.04 * this.masterVolume, 0.1);
                    osc.amp(0, 1.4);

                    setTimeout(() => {
                        try {
                            osc.stop();
                        } catch (e) { }
                    }, 1500);

                    harmonyIndex++;
                } catch (e) { }
            }, 1500);

            this.sequences.push(harmonySeq);
        } catch (e) {
            console.warn('⚠️ Error playing gameplay music:', e);
        }
    }

    playBossMusic() {
        if (this.musicType === 'boss') return;

        this.stopMusic();
        this.musicType = 'boss';

        try {
            // "Leviathan's Wrath" - Dissonant and menacing
            const scale = [155.56, 164.81, 185.00, 207.65, 233.08]; // Eb3, E3, F#3, G#3, Bb3 (diminished)

            // Menacing melody with wider intervals
            let melodyIndex = 0;
            const melodyPattern = [0, 4, 1, 3, 0, 2, 4, 1, 0]; // Dissonant jumps

            let melodySeq = setInterval(() => {
                try {
                    let note = scale[melodyPattern[melodyIndex % melodyPattern.length]] * 2;
                    let osc = new p5.Oscillator('sawtooth'); // Sawtooth for more aggressive sound
                    osc.freq(note);
                    osc.amp(0);
                    osc.start();
                    osc.amp(0.12 * this.masterVolume, 0.01); // Quick attack for intensity
                    osc.amp(0, 0.3);

                    setTimeout(() => {
                        try {
                            osc.stop();
                        } catch (e) { }
                    }, 450);

                    melodyIndex++;
                } catch (e) { }
            }, 400); // Faster tempo (150 BPM) for more tension

            this.sequences.push(melodySeq);
        } catch (e) {
            console.warn('⚠️ Error playing boss music:', e);
        }
    }

    playVictoryMusic() {
        this.stopMusic();
        this.musicType = 'victory';

        try {
            // "Surface Triumph" - C Major arpeggio
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

            notes.forEach((freq, i) => {
                setTimeout(() => {
                    try {
                        let osc = new p5.Oscillator('triangle');
                        osc.freq(freq);
                        osc.amp(0);
                        osc.start();

                        let duration = i === notes.length - 1 ? 0.8 : 0.3;
                        osc.amp(0.15 * this.masterVolume, 0.05);
                        osc.amp(0, duration);

                        setTimeout(() => {
                            try {
                                osc.stop();
                            } catch (e) { }
                        }, (duration + 0.1) * 1000);
                    } catch (e) { }
                }, i * 200);
            });


        } catch (e) {
            console.warn('⚠️ Error playing victory music:', e);
        }
    }

    addBubbleNote() {
        if (this.musicType !== 'gameplay') return;

        try {
            // Musical bubble sound in scale
            const bubbleNotes = [440, 523.25, 659.25, 783.99]; // A4, C5, E5, G5
            let note = bubbleNotes[Math.floor(Math.random() * bubbleNotes.length)];

            let osc = new p5.Oscillator('sine');
            osc.freq(note);
            osc.amp(0);
            osc.start();
            osc.amp(0.05 * this.masterVolume, 0.01);
            osc.amp(0, 0.15);

            setTimeout(() => {
                try {
                    osc.stop();
                } catch (e) { }
            }, 200);
        } catch (e) { }
    }
}

// PHASE 3 - PROCEDURAL AUDIO ENGINE (SIMPLIFIED)
// Using p5.sound oscillators with basic Web Audio API for effects

class SoundManager {
    constructor() {
        this.enabled = true;
        this.masterVolume = 0.3;

        // Ambience
        this.ambientDrones = [];
        this.ambienceStarted = false;

        // Music Generator
        this.musicGenerator = new MusicGenerator(this.masterVolume);

        // Initialize after user interaction
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            // Enable audio context on user interaction
            if (typeof userStartAudio !== 'undefined') {
                userStartAudio();
            }

            this.musicGenerator.init();

            this.initialized = true;
        } catch (e) {
            console.warn('⚠️ Could not initialize p5.sound:', e);
        }
    }

    startAmbience() {
        // Disabled - using only music generator for ambience
    }

    stopAmbience() {
        // Disabled - no ambient drones to stop
    }

    playPlayerShoot() {
        if (!this.enabled || !this.initialized) return;

        try {
            let osc = new p5.Oscillator('square');
            osc.amp(0);
            osc.freq(440);
            osc.start();

            osc.amp(0.15 * this.masterVolume, 0.01);
            osc.amp(0, 0.1);

            setTimeout(() => osc.stop(), 150);
        } catch (e) {
            console.warn('⚠️ Error playing shoot sound:', e);
        }
    }

    playEnemyShoot() {
        if (!this.enabled || !this.initialized) return;

        try {
            let osc = new p5.Oscillator('sawtooth');
            osc.amp(0);
            osc.freq(330);
            osc.start();

            osc.amp(0.12 * this.masterVolume, 0.01);
            osc.amp(0, 0.08);

            setTimeout(() => osc.stop(), 120);
        } catch (e) {
            console.warn('⚠️ Error playing enemy shoot:', e);
        }
    }

    playEnemyHit() {
        if (!this.enabled || !this.initialized) return;

        try {
            let noise = new p5.Noise('white');
            noise.amp(0);
            noise.start();

            noise.amp(0.2 * this.masterVolume, 0.01);
            noise.amp(0, 0.05);

            setTimeout(() => noise.stop(), 100);
        } catch (e) {
            console.warn('⚠️ Error playing hit sound:', e);
        }
    }

    playEnemyDeath(enemyType = 'normal') {
        if (!this.enabled || !this.initialized) return;

        try {
            let osc = new p5.Oscillator('triangle');
            osc.amp(0);
            osc.freq(440);
            osc.start();

            osc.amp(0.18 * this.masterVolume, 0.01);
            osc.freq(110, 0.3);
            osc.amp(0, 0.3);

            setTimeout(() => osc.stop(), 350);
        } catch (e) {
            console.warn('⚠️ Error playing death sound:', e);
        }
    }

    playBossSpawn() {
        if (!this.enabled || !this.initialized) return;

        try {
            let osc = new p5.Oscillator('sine');
            osc.amp(0);
            osc.freq(55);
            osc.start();

            osc.amp(0.25 * this.masterVolume, 0.1);
            osc.freq(110, 0.5);
            osc.amp(0, 0.4);

            setTimeout(() => osc.stop(), 1000);
        } catch (e) {
            console.warn('⚠️ Error playing boss spawn:', e);
        }
    }

    playLevelUp() {
        if (!this.enabled || !this.initialized) return;

        try {
            const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

            notes.forEach((freq, i) => {
                setTimeout(() => {
                    try {
                        let osc = new p5.Oscillator('sine');
                        osc.amp(0);
                        osc.freq(freq);
                        osc.start();

                        osc.amp(0.2 * this.masterVolume, 0.01);
                        osc.amp(0, 0.15);

                        setTimeout(() => osc.stop(), 200);
                    } catch (e) {
                        console.warn('⚠️ Error in level up note:', e);
                    }
                }, i * 100);
            });
        } catch (e) {
            console.warn('⚠️ Error playing level up:', e);
        }
    }

    playVictory() {
        if (!this.enabled || !this.initialized) return;

        try {
            const notes = [523, 659, 784, 1047];

            notes.forEach((freq, i) => {
                setTimeout(() => {
                    try {
                        let osc = new p5.Oscillator('triangle');
                        osc.amp(0);
                        osc.freq(freq);
                        osc.start();

                        let duration = i === notes.length - 1 ? 0.5 : 0.15;
                        osc.amp(0.25 * this.masterVolume, 0.02);
                        osc.amp(0, duration);

                        setTimeout(() => osc.stop(), (duration + 0.1) * 1000);
                    } catch (e) {
                        console.warn('⚠️ Error in victory note:', e);
                    }
                }, i * 150);
            });
        } catch (e) {
            console.warn('⚠️ Error playing victory:', e);
        }
    }

    playDash() {
        if (!this.enabled || !this.initialized) return;

        try {
            let noise = new p5.Noise('white');
            noise.amp(0);
            noise.start();

            noise.amp(0.25 * this.masterVolume, 0.01);
            noise.amp(0, 0.15);

            setTimeout(() => noise.stop(), 200);
        } catch (e) {
            console.warn('⚠️ Error playing dash:', e);
        }
    }

    playAOE() {
        if (!this.enabled || !this.initialized) return;

        try {
            // Low rumble
            let osc = new p5.Oscillator('sine');
            osc.amp(0);
            osc.freq(100);
            osc.start();

            osc.amp(0.3 * this.masterVolume, 0.05);
            osc.freq(50, 0.25);
            osc.amp(0, 0.2);

            // Noise burst
            let noise = new p5.Noise('pink');
            noise.amp(0);
            noise.start();

            noise.amp(0.2 * this.masterVolume, 0.01);
            noise.amp(0, 0.15);

            setTimeout(() => {
                osc.stop();
                noise.stop();
            }, 300);
        } catch (e) {
            console.warn('⚠️ Error playing AOE:', e);
        }
    }

    setVolume(vol) {
        this.masterVolume = constrain(vol, 0, 1);
    }

    toggle() {
        this.enabled = !this.enabled;

        if (!this.enabled) {
            this.stopAmbience();
        } else if (this.initialized) {
            this.startAmbience();
        }

        return this.enabled;
    }
}
