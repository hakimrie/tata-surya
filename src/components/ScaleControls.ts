import { ScaleMode, ScaleConfig } from './SolarSystem';
import { AU } from '../utils/constants';
import { t, getLanguage } from '../utils/i18n';

export class ScaleControls {
  public container: HTMLElement;
  public warningBanner: HTMLElement;

  private currentMode: ScaleMode = 'visual';

  // Sliders values for Custom Scale
  private planetSizeMultiplier: number = 600;
  private distanceMultiplier: number = 1.0;
  private moonSizeMultiplier: number = 1200;
  private moonOrbitMultiplier: number = 18;

  public onScaleChange?: (mode: ScaleMode, customConfig?: Partial<ScaleConfig>) => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'scale-controls glass-panel';
    this.container.setAttribute('aria-label', 'Pengaturan Skala Visual');

    this.warningBanner = document.createElement('div');
    this.warningBanner.className = 'scale-warning-banner';

    this.updateWarningBanner();
    this.render();
    this.attachEvents();
  }

  public updateWarningBanner(): void {
    const tr = t();
    this.warningBanner.innerHTML = `
      <span class="warning-icon">⚠️</span>
      <div class="warning-text">
        <strong>${tr.scaleWarningNotice}:</strong>
        ${tr.scaleWarningText}
      </div>
    `;
  }

  public refreshLanguage(): void {
    this.updateWarningBanner();
    this.render();
    this.attachEvents();
  }

  public setMode(mode: ScaleMode): void {
    this.currentMode = mode;

    if (mode === 'trueScale') {
      this.warningBanner.classList.add('hidden');
    } else {
      this.warningBanner.classList.remove('hidden');
    }

    const customSliders = this.container.querySelector('#custom-scale-sliders');
    if (customSliders) {
      customSliders.classList.toggle('hidden', mode !== 'custom');
    }

    const modeBtns = this.container.querySelectorAll('.btn-scale-mode');
    modeBtns.forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.mode === mode);
    });

    if (this.onScaleChange) {
      if (mode === 'custom') {
        this.emitCustomConfig();
      } else {
        this.onScaleChange(mode);
      }
    }
  }

  private emitCustomConfig(): void {
    const baseDist = 150 / (30 * AU);
    const customConfig: Partial<ScaleConfig> = {
      planetSizeScale: this.planetSizeMultiplier,
      distanceScale: baseDist * this.distanceMultiplier,
      moonSizeScale: this.moonSizeMultiplier,
      moonOrbitScale: this.moonOrbitMultiplier,
      sunSizeScale: Math.max(1, this.planetSizeMultiplier * 0.06)
    };
    if (this.onScaleChange) {
      this.onScaleChange('custom', customConfig);
    }
  }

  private render(): void {
    const isEn = getLanguage() === 'en';
    const tr = t();

    this.container.innerHTML = `
      <div class="scale-header">
        <span class="scale-title">${tr.scaleTitle}</span>
      </div>

      <!-- Mode selection buttons -->
      <div class="scale-mode-selector">
        <button class="btn-scale-mode ${this.currentMode === 'visual' ? 'active' : ''}" data-mode="visual" title="${isEn ? 'Planets enlarged for educational observation' : 'Ukuran planet diperbesar agar jelas diamati'}">
          ${tr.scaleModeVisual}
        </button>
        <button class="btn-scale-mode ${this.currentMode === 'trueScale' ? 'active' : ''}" data-mode="trueScale" title="${isEn ? 'Astronomically true scale (planets appear as dots)' : 'Proporsi ukuran astronomis nyata (planet sangat kecil)'}">
          ${tr.scaleModeTrue}
        </button>
        <button class="btn-scale-mode ${this.currentMode === 'custom' ? 'active' : ''}" data-mode="custom" title="${isEn ? 'Custom scaling ratios' : 'Atur rasio skala secara bebas'}">
          ${tr.scaleModeCustom}
        </button>
      </div>

      <!-- Custom scale sliders drawer -->
      <div class="custom-scale-drawer ${this.currentMode === 'custom' ? '' : 'hidden'}" id="custom-scale-sliders">
        <div class="slider-group">
          <div class="slider-labels">
            <span>${tr.planetSizeScale}:</span>
            <span id="label-planet-scale">${this.planetSizeMultiplier}×</span>
          </div>
          <input type="range" id="slider-planet-scale" min="1" max="1500" step="10" value="${this.planetSizeMultiplier}">
        </div>

        <div class="slider-group">
          <div class="slider-labels">
            <span>${tr.distanceScale}:</span>
            <span id="label-distance-scale">${this.distanceMultiplier.toFixed(1)}×</span>
          </div>
          <input type="range" id="slider-distance-scale" min="0.2" max="3.0" step="0.1" value="${this.distanceMultiplier}">
        </div>

        <div class="slider-group">
          <div class="slider-labels">
            <span>${tr.moonSizeScale}:</span>
            <span id="label-moon-scale">${this.moonSizeMultiplier}×</span>
          </div>
          <input type="range" id="slider-moon-scale" min="100" max="3000" step="50" value="${this.moonSizeMultiplier}">
        </div>

        <div class="slider-group">
          <div class="slider-labels">
            <span>${tr.moonOrbitScale}:</span>
            <span id="label-moon-orbit">${(this.moonOrbitMultiplier / 18).toFixed(1)}×</span>
          </div>
          <input type="range" id="slider-moon-orbit" min="6" max="54" step="2" value="${this.moonOrbitMultiplier}">
        </div>
      </div>
    `;
  }

  private attachEvents(): void {
    const modeBtns = this.container.querySelectorAll('.btn-scale-mode');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = (e.currentTarget as HTMLElement).dataset.mode as ScaleMode;
        if (mode) this.setMode(mode);
      });
    });

    const planetSlider = this.container.querySelector('#slider-planet-scale') as HTMLInputElement;
    const distanceSlider = this.container.querySelector('#slider-distance-scale') as HTMLInputElement;
    const moonSlider = this.container.querySelector('#slider-moon-scale') as HTMLInputElement;
    const moonOrbitSlider = this.container.querySelector('#slider-moon-orbit') as HTMLInputElement;

    const planetLabel = this.container.querySelector('#label-planet-scale');
    const distLabel = this.container.querySelector('#label-distance-scale');
    const moonLabel = this.container.querySelector('#label-moon-scale');
    const moonOrbitLabel = this.container.querySelector('#label-moon-orbit');

    if (planetSlider && planetLabel) {
      planetSlider.addEventListener('input', () => {
        this.planetSizeMultiplier = parseFloat(planetSlider.value);
        planetLabel.textContent = `${this.planetSizeMultiplier}×`;
        this.emitCustomConfig();
      });
    }

    if (distanceSlider && distLabel) {
      distanceSlider.addEventListener('input', () => {
        this.distanceMultiplier = parseFloat(distanceSlider.value);
        distLabel.textContent = `${this.distanceMultiplier.toFixed(1)}×`;
        this.emitCustomConfig();
      });
    }

    if (moonSlider && moonLabel) {
      moonSlider.addEventListener('input', () => {
        this.moonSizeMultiplier = parseFloat(moonSlider.value);
        moonLabel.textContent = `${this.moonSizeMultiplier}×`;
        this.emitCustomConfig();
      });
    }

    if (moonOrbitSlider && moonOrbitLabel) {
      moonOrbitSlider.addEventListener('input', () => {
        this.moonOrbitMultiplier = parseFloat(moonOrbitSlider.value);
        moonOrbitLabel.textContent = `${(this.moonOrbitMultiplier / 18).toFixed(1)}×`;
        this.emitCustomConfig();
      });
    }
  }
}
