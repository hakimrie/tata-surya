import { formatSimulationDate, formatSimulationDateTime } from '../utils/formatting';
import { SECONDS_PER_DAY, SECONDS_PER_MONTH, SECONDS_PER_YEAR } from '../utils/constants';
import { t, getLanguage } from '../utils/i18n';

export class SimulationControls {
  public container: HTMLElement;

  public isPaused: boolean = false;
  // Simulation speed factor: 1 real second = simulationSpeed simulation seconds
  // Default: 1 real second = 86,400s * 2 (2 days per real second)
  public simulationSpeed: number = 86400 * 2;
  public simulationDate: Date;
  public initialDate: Date;

  // Timestep setting
  public subStepDtHours: number = 2; // 2 hours per RK4 sub-step

  // Callbacks
  public onPlayPauseToggle?: (isPaused: boolean) => void;
  public onSpeedChange?: (speed: number) => void;
  public onResetSimulation?: () => void;
  public onStepSimulation?: (seconds: number) => void;

  constructor() {
    this.initialDate = new Date(2026, 0, 1, 12, 0, 0); // 1 Jan 2026 12:00 UTC
    this.simulationDate = new Date(this.initialDate.getTime());

    this.container = document.createElement('div');
    this.container.className = 'simulation-controls glass-panel';
    this.container.setAttribute('aria-label', 'Kontrol Simulasi Waktu');

    this.render();
    this.attachEvents();
  }

  public advanceTime(simSeconds: number): void {
    this.simulationDate.setTime(this.simulationDate.getTime() + simSeconds * 1000);
    this.updateClockDisplay();
  }

  public resetDate(): void {
    this.simulationDate.setTime(this.initialDate.getTime());
    this.updateClockDisplay();
  }

  public refreshLanguage(): void {
    const activeMultiplier = this.simulationSpeed / SECONDS_PER_DAY;
    this.render();
    this.attachEvents();
    this.setSpeedMultiplier(activeMultiplier);
    this.setPaused(this.isPaused);
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
    const playBtn = this.container.querySelector('#btn-play-pause');
    if (playBtn) {
      const tr = t();
      playBtn.innerHTML = this.isPaused
        ? `<span class="icon">▶</span> ${tr.playBtn}`
        : `<span class="icon">⏸</span> ${tr.pauseBtn}`;
      playBtn.classList.toggle('is-paused', this.isPaused);
    }
  }

  public setSpeedMultiplier(multiplier: number): void {
    this.simulationSpeed = multiplier * SECONDS_PER_DAY;
    const isEn = getLanguage() === 'en';
    const speedDisplay = this.container.querySelector('#speed-value-display');
    if (speedDisplay) {
      speedDisplay.textContent = `${multiplier >= 1000 ? (multiplier / 1000).toLocaleString(isEn ? 'en-US' : 'id-ID') + 'k' : multiplier}×`;
    }

    const presetBtns = this.container.querySelectorAll('.btn-speed-preset');
    presetBtns.forEach(btn => {
      const val = parseFloat((btn as HTMLElement).dataset.speed || '1');
      btn.classList.toggle('active', Math.abs(val - multiplier) < 0.01);
    });

    if (this.onSpeedChange) {
      this.onSpeedChange(this.simulationSpeed);
    }
  }

  private updateClockDisplay(): void {
    const isEn = getLanguage() === 'en';
    const dateEl = this.container.querySelector('#sim-date-display');
    const timeEl = this.container.querySelector('#sim-time-display');
    if (dateEl) {
      dateEl.textContent = formatSimulationDate(this.simulationDate);
    }
    if (timeEl) {
      timeEl.textContent = this.simulationDate.toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' });
    }
  }

  private render(): void {
    const isEn = getLanguage() === 'en';
    const tr = t();

    this.container.innerHTML = `
      <div class="sim-clock-wrapper">
        <div class="sim-badge-row">
          <span class="sim-clock-badge">${tr.simTimeBadge}</span>
          <span class="sim-status-badge stable" id="sim-stability-badge" title="Status Integrator RK4">${tr.rk4Stable}</span>
        </div>
        <div class="sim-date" id="sim-date-display">${formatSimulationDate(this.simulationDate)}</div>
        <div class="sim-time" id="sim-time-display">${this.simulationDate.toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>

      <div class="sim-button-group">
        <button class="btn-ctrl primary" id="btn-play-pause" title="${this.isPaused ? tr.playBtn : tr.pauseBtn}">
          <span class="icon">${this.isPaused ? '▶' : '⏸'}</span> ${this.isPaused ? tr.playBtn : tr.pauseBtn}
        </button>
        <button class="btn-ctrl" id="btn-step-prev" title="${isEn ? 'Step Back 1 Day' : 'Mundur 1 Hari'}">
          ◀ 1d
        </button>
        <button class="btn-ctrl" id="btn-step-next" title="${isEn ? 'Step Forward 1 Day' : 'Maju 1 Hari'}">
          1d ▶
        </button>
        <button class="btn-ctrl" id="btn-reset" title="${isEn ? 'Reset Simulation to Start' : 'Kembalikan Simulasi ke Awal'}">
          ${tr.resetBtn}
        </button>
      </div>

      <!-- Quick speed multipliers -->
      <div class="speed-control-container">
        <div class="speed-header">
          <span class="speed-label">${tr.timeSpeedLabel}:</span>
          <span class="speed-val" id="speed-value-display">2×</span>
        </div>
        <div class="speed-presets">
          <button class="btn-speed-preset" data-speed="0.1" title="${isEn ? '0.1 days / sec' : '0.1 hari / detik'}">0.1×</button>
          <button class="btn-speed-preset" data-speed="1" title="${isEn ? '1 day / sec' : '1 hari / detik'}">1×</button>
          <button class="btn-speed-preset active" data-speed="2" title="${isEn ? '2 days / sec' : '2 hari / detik'}">2×</button>
          <button class="btn-speed-preset" data-speed="10" title="${isEn ? '10 days / sec' : '10 hari / detik'}">10×</button>
          <button class="btn-speed-preset" data-speed="100" title="${isEn ? '100 days / sec' : '100 hari / detik'}">100×</button>
          <button class="btn-speed-preset" data-speed="1000" title="${isEn ? '1000 days / sec' : '1000 hari / detik'}">1.000×</button>
        </div>
      </div>

      <!-- Jump Timeline Buttons -->
      <div class="time-jump-row">
        <span class="jump-label">${tr.jumpLabel}:</span>
        <button class="btn-jump" data-jump="${SECONDS_PER_MONTH}">${tr.jump1Month}</button>
        <button class="btn-jump" data-jump="${SECONDS_PER_YEAR}">${tr.jump1Year}</button>
        <button class="btn-jump" data-jump="${SECONDS_PER_YEAR * 10}">${tr.jump10Years}</button>
      </div>
    `;
  }

  private attachEvents(): void {
    // Play / Pause
    const playBtn = this.container.querySelector('#btn-play-pause');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.setPaused(!this.isPaused);
        if (this.onPlayPauseToggle) {
          this.onPlayPauseToggle(this.isPaused);
        }
      });
    }

    // Step buttons
    const stepPrev = this.container.querySelector('#btn-step-prev');
    if (stepPrev) {
      stepPrev.addEventListener('click', () => {
        if (this.onStepSimulation) this.onStepSimulation(-SECONDS_PER_DAY);
      });
    }

    const stepNext = this.container.querySelector('#btn-step-next');
    if (stepNext) {
      stepNext.addEventListener('click', () => {
        if (this.onStepSimulation) this.onStepSimulation(SECONDS_PER_DAY);
      });
    }

    // Reset button
    const resetBtn = this.container.querySelector('#btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetDate();
        if (this.onResetSimulation) this.onResetSimulation();
      });
    }

    // Speed Presets
    const presetBtns = this.container.querySelectorAll('.btn-speed-preset');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const speed = parseFloat((e.currentTarget as HTMLElement).dataset.speed || '1');
        this.setSpeedMultiplier(speed);
      });
    });

    // Jump buttons
    const jumpBtns = this.container.querySelectorAll('.btn-jump');
    jumpBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sec = parseFloat((e.currentTarget as HTMLElement).dataset.jump || '0');
        if (this.onStepSimulation) {
          this.onStepSimulation(sec);
        }
      });
    });

    // Spacebar shortcut (attach once on window)
    if (!(window as any).__sim_space_attached) {
      (window as any).__sim_space_attached = true;
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
          e.preventDefault();
          this.setPaused(!this.isPaused);
          if (this.onPlayPauseToggle) {
            this.onPlayPauseToggle(this.isPaused);
          }
        }
      });
    }
  }
}
