/**
 * CosmicAudio - Procedural Web Audio Ambient Space Synthesizer & Sound Effects
 * 100% pure Web Audio API without external audio file dependencies.
 * Provides deep space ambient drones, planetary radio emissions, flyby whooshes, and interactive UI feedback.
 */

export class CosmicAudio {
  private static instance: CosmicAudio | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Ambient Drone nodes
  private isPlayingAmbient: boolean = false;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private droneLfo: OscillatorNode | null = null;

  // Planetary Radio Resonance node
  private planetaryNoiseNode: AudioNode | null = null;
  private planetaryGain: GainNode | null = null;

  public isMuted: boolean = true; // default muted for browser compliance and user comfort

  private constructor() {
    try {
      const saved = localStorage.getItem('tata_surya_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      // ignore
    }
  }

  public static getInstance(): CosmicAudio {
    if (!CosmicAudio.instance) {
      CosmicAudio.instance = new CosmicAudio();
    }
    return CosmicAudio.instance;
  }

  /**
   * Initialize AudioContext on first user interaction
   */
  public init(): void {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.planetaryGain = this.ctx.createGain();
      this.planetaryGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.planetaryGain.connect(this.masterGain);

      if (!this.isMuted) {
        this.startAmbientDrone();
      }
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  }

  /**
   * Toggle Mute / Unmute
   */
  public toggleMute(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return this.isMuted;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('tata_surya_muted', String(this.isMuted));
    } catch {
      // ignore
    }

    const now = this.ctx.currentTime;
    if (this.isMuted) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
    } else {
      if (!this.isPlayingAmbient) {
        this.startAmbientDrone();
      }
      this.masterGain.gain.linearRampToValueAtTime(0.8, now + 0.3);
      this.playBeep(520, 0.1, 'sine');
    }

    return this.isMuted;
  }

  /**
   * Start procedural deep space ambient drone
   */
  private startAmbientDrone(): void {
    if (!this.ctx || !this.ambientGain || this.isPlayingAmbient) return;

    try {
      const now = this.ctx.currentTime;

      // Low frequency foundation (55 Hz - A1 note)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, now);

      // Subtle detuned 5th harmonic (82.4 Hz - E2)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(82.4, now);

      // Warm low-pass filter
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(140, now);
      this.droneFilter.Q.setValueAtTime(2.5, now);

      // LFO for slow breathing cosmic pulse
      this.droneLfo = this.ctx.createOscillator();
      this.droneLfo.frequency.setValueAtTime(0.12, now); // 8-second slow cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(45, now);
      this.droneLfo.connect(lfoGain);
      lfoGain.connect(this.droneFilter.frequency);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.ambientGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.droneLfo.start();

      this.isPlayingAmbient = true;
    } catch {
      // ignore
    }
  }

  /**
   * Play camera travel / flyby whoosh with Doppler pitch sweep
   */
  public playFlybyWhoosh(): void {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Doppler sweep: starts high (420Hz), drops quickly to 110Hz
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.7);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.7);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch {
      // ignore
    }
  }

  /**
   * Play interactive UI button click tone
   */
  public playUiClick(): void {
    this.playBeep(680, 0.04, 'sine', 0.15);
  }

  /**
   * Play time-warp simulation speed shift tone
   */
  public playSpeedShift(multiplier: number): void {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    try {
      const baseFreq = Math.min(1200, Math.max(220, 220 + Math.log10(multiplier + 1) * 300));
      this.playBeep(baseFreq, 0.12, 'triangle', 0.2);
    } catch {
      // ignore
    }
  }

  /**
   * Synthesize atmospheric / radio sounds for the focused celestial body
   */
  public playPlanetaryRadio(planetId: string): void {
    if (this.isMuted || !this.ctx || !this.planetaryGain) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.stopPlanetaryRadio();

      const now = this.ctx.currentTime;

      if (planetId === 'sun') {
        // Sun: deep solar flare rumble with low noise
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45, now);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(90, now);
        osc.connect(filter);
        filter.connect(this.planetaryGain);
        osc.start();
        this.planetaryNoiseNode = osc;
      } else if (planetId === 'jupiter') {
        // Jupiter: decametric radio whistler burst
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.linearRampToValueAtTime(260, now + 1.2);
        osc.connect(this.planetaryGain);
        osc.start();
        this.planetaryNoiseNode = osc;
      } else if (planetId === 'saturn') {
        // Saturn: ethereal high-altitude aurora oscillation
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(3.2, now);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(15, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(this.planetaryGain);
        osc.start();
        lfo.start();
        this.planetaryNoiseNode = osc;
      } else if (planetId === 'earth') {
        // Earth: ionospheric chorus chirp
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now);
        osc.connect(this.planetaryGain);
        osc.start();
        this.planetaryNoiseNode = osc;
      }
    } catch {
      // ignore
    }
  }

  public stopPlanetaryRadio(): void {
    if (this.planetaryNoiseNode) {
      try {
        (this.planetaryNoiseNode as any).stop?.();
        this.planetaryNoiseNode.disconnect();
      } catch {
        // ignore
      }
      this.planetaryNoiseNode = null;
    }
  }

  private playBeep(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.2): void {
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // ignore
    }
  }
}
