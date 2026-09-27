import { PLANETS_DATA, PlanetData } from '../data/planets';
import { AU, SOLAR_MASS } from '../utils/constants';
import { OrbitalMechanics } from '../physics/OrbitalMechanics';
import { t, getLanguage } from '../utils/i18n';

export class KeplerLab {
  public container: HTMLElement;
  private currentLaw: 1 | 2 | 3 = 1;
  private selectedPlanetId: string = 'mars';

  // Law 1 state
  private law1Eccentricity: number = 0.0934; // Mars default
  private law1SemiMajorAxisAU: number = 1.524;

  // Law 2 animation state
  private law2SweepAngle: number = 0;
  private law2AnimTimer: number | null = null;
  private law2Eccentricity: number = 0.5;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'kepler-lab glass-panel hidden';
    this.container.setAttribute('aria-label', 'Laboratorium Hukum Kepler');

    this.render();
  }

  show(): void {
    this.container.classList.remove('hidden');
    this.render();
    if (this.currentLaw === 2) {
      this.startLaw2Animation();
    }
  }

  hide(): void {
    this.container.classList.add('hidden');
    this.stopLaw2Animation();
  }

  refreshLanguage(): void {
    if (!this.container.classList.contains('hidden')) {
      this.render();
    }
  }

  private setLaw(law: 1 | 2 | 3): void {
    this.currentLaw = law;
    if (law !== 2) {
      this.stopLaw2Animation();
    }
    this.render();
    if (law === 2) {
      this.startLaw2Animation();
    }
  }

  private render(): void {
    const isEn = getLanguage() === 'en';
    const tr = t();

    this.container.innerHTML = `
      <div class="panel-header">
        <div class="header-titles">
          <span class="badge badge-curriculum">${isEn ? 'ASTRONOMY & PHYSICS LAB' : 'EKSPERIMEN FISIKA ASTRONOMI'}</span>
          <h2 class="planet-title">${tr.keplerTitle}</h2>
          <span class="planet-subtitle">${tr.keplerSubtitle}</span>
        </div>
        <button class="btn-close" id="btn-close-kepler" title="${isEn ? 'Close' : 'Tutup'}">&times;</button>
      </div>

      <!-- Navigation tabs for 3 laws -->
      <div class="kepler-tabs">
        <button class="tab-btn ${this.currentLaw === 1 ? 'active' : ''}" data-law="1">
          <strong>${tr.law1Title}</strong>
          <span>${tr.law1Sub}</span>
        </button>
        <button class="tab-btn ${this.currentLaw === 2 ? 'active' : ''}" data-law="2">
          <strong>${tr.law2Title}</strong>
          <span>${tr.law2Sub}</span>
        </button>
        <button class="tab-btn ${this.currentLaw === 3 ? 'active' : ''}" data-law="3">
          <strong>${tr.law3Title}</strong>
          <span>${tr.law3Sub}</span>
        </button>
      </div>

      <div class="kepler-content">
        ${this.renderLawContent()}
      </div>
    `;

    this.attachEvents();
    if (this.currentLaw === 1) this.drawLaw1Canvas();
    if (this.currentLaw === 2) this.drawLaw2Canvas();
    if (this.currentLaw === 3) this.drawLaw3Graph();
  }

  private renderLawContent(): string {
    const isEn = getLanguage() === 'en';
    const tr = t();

    if (this.currentLaw === 1) {
      return `
        <div class="law-container">
          <div class="law-explanation-box">
            <h3 class="law-title">${tr.law1Heading}</h3>
            <p>${tr.law1Desc}</p>
          </div>

          <div class="kepler-interactive-grid">
            <div class="kepler-canvas-wrapper">
              <canvas id="kepler-law1-canvas" width="460" height="340"></canvas>
              <div class="canvas-legend">
                <span class="legend-item"><span class="dot sun-dot"></span> ${isEn ? 'Sun (Focus 1)' : 'Matahari (Fokus 1)'}</span>
                <span class="legend-item"><span class="dot empty-dot"></span> ${isEn ? 'Empty Focus (Focus 2)' : 'Fokus Kosong (Fokus 2)'}</span>
                <span class="legend-item"><span class="dot peri-dot"></span> Perihelion</span>
                <span class="legend-item"><span class="dot aph-dot"></span> Aphelion</span>
              </div>
            </div>

            <div class="kepler-controls-sidebar">
              <h4 class="sidebar-title">${isEn ? 'Parameter Controls' : 'Eksplorasi Parameter'}</h4>

              <div class="slider-group">
                <div class="slider-labels">
                  <span>${tr.selectPlanetPreset}:</span>
                </div>
                <select id="select-kepler-planet" class="custom-select">
                  ${PLANETS_DATA.filter(p => p.type !== 'star').map(p => `
                    <option value="${p.id}" ${p.id === this.selectedPlanetId ? 'selected' : ''}>
                      ${isEn ? p.englishName : p.indonesianName} (e = ${p.eccentricity.toFixed(4)})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="slider-group">
                <div class="slider-labels">
                  <span>${tr.eccentricityLabel}:</span>
                  <strong id="val-eccentricity">${this.law1Eccentricity.toFixed(4)}</strong>
                </div>
                <input type="range" id="slider-eccentricity" min="0.0" max="0.75" step="0.01" value="${this.law1Eccentricity}">
                <div class="range-subtext">
                  <span>e = 0 (${isEn ? 'Circle' : 'Lingkaran'})</span>
                  <span>e = 0.75 (${isEn ? 'High Ellipse' : 'Sangat Lonjong'})</span>
                </div>
              </div>

              <div class="calculated-metrics">
                <div class="metric-row">
                  <span>${tr.perihelionLabel}:</span>
                  <strong>${(this.law1SemiMajorAxisAU * (1 - this.law1Eccentricity)).toFixed(2)} AU</strong>
                </div>
                <div class="metric-row">
                  <span>${tr.aphelionLabel}:</span>
                  <strong>${(this.law1SemiMajorAxisAU * (1 + this.law1Eccentricity)).toFixed(2)} AU</strong>
                </div>
                <div class="metric-row">
                  <span>${tr.semiMinorLabel}:</span>
                  <strong>${(this.law1SemiMajorAxisAU * Math.sqrt(Math.max(0, 1 - this.law1Eccentricity * this.law1Eccentricity))).toFixed(2)} AU</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.currentLaw === 2) {
      return `
        <div class="law-container">
          <div class="law-explanation-box">
            <h3 class="law-title">${tr.law2Heading}</h3>
            <p>${tr.law2Desc}</p>
          </div>

          <div class="kepler-interactive-grid">
            <div class="kepler-canvas-wrapper">
              <canvas id="kepler-law2-canvas" width="460" height="340"></canvas>
              <div class="canvas-legend">
                <span class="legend-item"><span class="box area-a"></span> ${isEn ? 'Area A (Near Perihelion)' : 'Luas Wilayah A (Dekat Matahari)'}</span>
                <span class="legend-item"><span class="box area-b"></span> ${isEn ? 'Area B (Near Aphelion)' : 'Luas Wilayah B (Jauh Matahari)'}</span>
              </div>
            </div>

            <div class="kepler-controls-sidebar">
              <h4 class="sidebar-title">${isEn ? 'Area & Speed Invariance' : 'Kekekalan Luas & Kecepatan'}</h4>

              <div class="slider-group">
                <div class="slider-labels">
                  <span>${isEn ? 'Orbit Eccentricity:' : 'Eksentrisitas Simulasi:'}</span>
                  <strong id="val-law2-e">${this.law2Eccentricity.toFixed(2)}</strong>
                </div>
                <input type="range" id="slider-law2-e" min="0.1" max="0.7" step="0.05" value="${this.law2Eccentricity}">
              </div>

              <div class="speedometer-box">
                <div class="speed-indicator-label">${tr.instantSpeedLabel}:</div>
                <div class="speed-readout" id="law2-live-speed">${isEn ? 'Calculating...' : 'Menghitung...'}</div>
                <div class="speed-bar-track">
                  <div class="speed-bar-fill" id="law2-speed-bar" style="width: 50%;"></div>
                </div>
              </div>

              <div class="physics-card">
                <strong>${isEn ? 'Physics Principle:' : 'Prinsip Fisika:'}</strong>
                <p>$$L = m \\cdot r \\cdot v = \\text{constant}$$</p>
                <p>${isEn ? 'As distance r decreases near perihelion, velocity v increases to conserve angular momentum L!' : 'Ketika jari-jari r mengecil (perihelion), kecepatan v wajib membesar agar momentum sudut L kekal!'}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Law 3
    return `
      <div class="law-container">
        <div class="law-explanation-box">
          <h3 class="law-title">${tr.law3Heading}</h3>
          <p>${tr.law3Desc}</p>
        </div>

        <div class="kepler-interactive-grid">
          <div class="kepler-canvas-wrapper">
            <canvas id="kepler-law3-canvas" width="460" height="340"></canvas>
            <div class="canvas-legend">
              <span class="legend-item"><span class="line harmonic-line"></span> ${isEn ? 'Theoretical line T² = a³' : 'Garis Teori T² = a³'}</span>
              <span class="legend-item"><span class="dot planet-dot"></span> ${isEn ? 'Planetary data points' : 'Titik Data Nyata Planet'}</span>
            </div>
          </div>

          <div class="kepler-controls-sidebar">
            <h4 class="sidebar-title">${isEn ? 'Solar System Harmonic Data Table' : 'Tabel Uji Harmoni Tata Surya'}</h4>
            <div class="table-scroll-container">
              <table class="kepler-table">
                <thead>
                  <tr>
                    <th>${tr.tableColPlanet}</th>
                    <th>${tr.tableColA}</th>
                    <th>${tr.tableColT}</th>
                    <th>${tr.tableColA3}</th>
                    <th>${tr.tableColT2}</th>
                    <th>${tr.tableColRatio}</th>
                  </tr>
                </thead>
                <tbody>
                  ${PLANETS_DATA.filter(p => p.type !== 'star').map(p => {
                    const aAU = p.semiMajorAxis / AU;
                    const tYears = p.orbitalPeriod / (86400 * 365.25);
                    const a3 = Math.pow(aAU, 3);
                    const t2 = Math.pow(tYears, 2);
                    const ratio = a3 > 0 ? t2 / a3 : 1;
                    const pName = isEn ? p.englishName : p.indonesianName;
                    return `
                      <tr class="table-row-planet" data-planet="${p.id}">
                        <td><strong>${pName}</strong></td>
                        <td>${aAU.toFixed(2)}</td>
                        <td>${tYears.toFixed(2)}</td>
                        <td>${a3.toFixed(1)}</td>
                        <td>${t2.toFixed(1)}</td>
                        <td class="text-accent">${ratio.toFixed(3)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
            <p class="kepler-table-note">${tr.tableProofNote}</p>
          </div>
        </div>
      </div>
    `;
  }

  // --- DRAW LAW 1 ---
  private drawLaw1Canvas(): void {
    const isEn = getLanguage() === 'en';
    const canvas = this.container.querySelector('#kepler-law1-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const a = 180;
    const e = this.law1Eccentricity;
    const b = a * Math.sqrt(Math.max(0, 1 - e * e));
    const c = a * e;

    // Draw coordinate axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();

    // Draw Ellipse
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Focus 1 (Sun)
    const sunX = cx - c;
    const sunY = cy;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffaa00';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px system-ui';
    ctx.fillText(isEn ? 'Sun (F1)' : 'Matahari (F1)', sunX - 35, sunY - 14);

    // Focus 2 (Empty)
    const emptyX = cx + c;
    ctx.beginPath();
    ctx.arc(emptyX, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#445566';
    ctx.fill();
    ctx.strokeStyle = '#8899aa';
    ctx.stroke();
    ctx.fillText(isEn ? 'Empty Focus (F2)' : 'Fokus Kosong (F2)', emptyX - 45, cy + 20);

    // Perihelion marker
    const periX = cx - a;
    ctx.beginPath();
    ctx.arc(periX, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#38ef7d';
    ctx.fill();
    ctx.fillText('Perihelion', periX - 10, cy - 10);

    // Aphelion marker
    const aphX = cx + a;
    ctx.beginPath();
    ctx.arc(aphX, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();
    ctx.fillText('Aphelion', aphX - 45, cy - 10);
  }

  // --- DRAW LAW 2 ---
  private drawLaw2Canvas(): void {
    const canvas = this.container.querySelector('#kepler-law2-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const a = 170;
    const e = this.law2Eccentricity;
    const b = a * Math.sqrt(Math.max(0, 1 - e * e));
    const c = a * e;

    const sunX = cx - c;
    const sunY = cy;

    // Draw Ellipse
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Swept Wedge A
    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    for (let th = -0.4; th <= 0.4; th += 0.05) {
      const px = cx - a * Math.cos(th);
      const py = cy + b * Math.sin(th);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();

    // Swept Wedge B
    ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    for (let th = -0.15; th <= 0.15; th += 0.02) {
      const px = cx + a * Math.cos(th);
      const py = cy + b * Math.sin(th);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ff6b6b';
    ctx.stroke();

    // Sun
    ctx.beginPath();
    ctx.arc(sunX, sunY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffaa00';
    ctx.fill();

    // Moving Planet along ellipse
    const theta = this.law2SweepAngle;
    const planetX = cx - a * Math.cos(theta);
    const planetY = cy + b * Math.sin(theta);

    // Connecting line to Sun
    ctx.strokeStyle = '#ffeaa7';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(planetX, planetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Planet
    ctx.beginPath();
    ctx.arc(planetX, planetY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();

    // Vis-Viva speed calculation
    const distToSun = Math.hypot(planetX - sunX, planetY - sunY);
    const speedFactor = Math.sqrt(Math.max(0.1, 2.0 / (distToSun / a) - 1.0));
    const speedKms = (25.0 * speedFactor).toFixed(1);

    const speedReadout = this.container.querySelector('#law2-live-speed');
    const speedBar = this.container.querySelector('#law2-speed-bar') as HTMLElement;
    if (speedReadout) speedReadout.textContent = `${speedKms} km/s`;
    if (speedBar) {
      const pct = Math.min(100, Math.max(10, ((parseFloat(speedKms) - 10) / 35) * 100));
      speedBar.style.width = `${pct}%`;
    }
  }

  private startLaw2Animation(): void {
    this.stopLaw2Animation();
    const anim = () => {
      const e = this.law2Eccentricity;
      const r = 1 - e * Math.cos(this.law2SweepAngle);
      const dTheta = 0.02 / (r * r);

      this.law2SweepAngle = (this.law2SweepAngle + dTheta) % (Math.PI * 2);
      this.drawLaw2Canvas();
      this.law2AnimTimer = requestAnimationFrame(anim);
    };
    this.law2AnimTimer = requestAnimationFrame(anim);
  }

  private stopLaw2Animation(): void {
    if (this.law2AnimTimer !== null) {
      cancelAnimationFrame(this.law2AnimTimer);
      this.law2AnimTimer = null;
    }
  }

  // --- DRAW LAW 3 ---
  private drawLaw3Graph(): void {
    const isEn = getLanguage() === 'en';
    const canvas = this.container.querySelector('#kepler-law3-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const pad = 45;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;

    // Draw Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad, pad); ctx.lineTo(pad, h - pad); ctx.lineTo(w - pad, h - pad);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#8899aa';
    ctx.font = '11px system-ui';
    ctx.fillText(isEn ? 'Semi-Major Axis Cubed: a³ (AU³)' : 'Jarak Rata-Rata Pangkat Tiga: a³ (AU³)', pad + 40, h - 12);

    ctx.save();
    ctx.translate(15, h / 2 + 50);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(isEn ? 'Orbital Period Squared: T² (Years²)' : 'Kuadrat Periode: T² (Tahun²)', 0, 0);
    ctx.restore();

    const logMin = -1.5;
    const logMax = 4.8;

    const toScreenX = (logVal: number) => pad + ((logVal - logMin) / (logMax - logMin)) * plotW;
    const toScreenY = (logVal: number) => (h - pad) - ((logVal - logMin) / (logMax - logMin)) * plotH;

    // Draw theoretical T^2 = a^3 line
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toScreenX(logMin), toScreenY(logMin));
    ctx.lineTo(toScreenX(logMax), toScreenY(logMax));
    ctx.stroke();

    // Plot planets
    for (const p of PLANETS_DATA) {
      if (p.type === 'star') continue;

      const aAU = p.semiMajorAxis / AU;
      const tYears = p.orbitalPeriod / (86400 * 365.25);
      const a3 = Math.pow(aAU, 3);
      const t2 = Math.pow(tYears, 2);

      const logX = Math.log10(a3);
      const logY = Math.log10(t2);

      const px = toScreenX(logX);
      const py = toScreenY(logY);

      // Dot
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px system-ui';
      ctx.fillText(isEn ? p.englishName : p.indonesianName, px + 8, py + 3);
    }
  }

  private attachEvents(): void {
    const closeBtn = this.container.querySelector('#btn-close-kepler');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());

    // Law tabs
    const tabs = this.container.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const law = parseInt((e.currentTarget as HTMLElement).dataset.law || '1', 10) as any;
        this.setLaw(law);
      });
    });

    // Law 1 Planet Select
    const planetSelect = this.container.querySelector('#select-kepler-planet') as HTMLSelectElement;
    if (planetSelect) {
      planetSelect.addEventListener('change', () => {
        this.selectedPlanetId = planetSelect.value;
        const p = PLANETS_DATA.find(x => x.id === this.selectedPlanetId);
        if (p) {
          this.law1Eccentricity = p.eccentricity;
          this.law1SemiMajorAxisAU = p.semiMajorAxis / AU;
          const eccSlider = this.container.querySelector('#slider-eccentricity') as HTMLInputElement;
          const eccVal = this.container.querySelector('#val-eccentricity');
          if (eccSlider) eccSlider.value = this.law1Eccentricity.toString();
          if (eccVal) eccVal.textContent = this.law1Eccentricity.toFixed(4);
          this.drawLaw1Canvas();
        }
      });
    }

    // Law 1 Slider
    const eccSlider = this.container.querySelector('#slider-eccentricity') as HTMLInputElement;
    const eccVal = this.container.querySelector('#val-eccentricity');
    if (eccSlider && eccVal) {
      eccSlider.addEventListener('input', () => {
        this.law1Eccentricity = parseFloat(eccSlider.value);
        eccVal.textContent = this.law1Eccentricity.toFixed(4);
        this.drawLaw1Canvas();
      });
    }

    // Law 2 Slider
    const law2Slider = this.container.querySelector('#slider-law2-e') as HTMLInputElement;
    const law2Val = this.container.querySelector('#val-law2-e');
    if (law2Slider && law2Val) {
      law2Slider.addEventListener('input', () => {
        this.law2Eccentricity = parseFloat(law2Slider.value);
        law2Val.textContent = this.law2Eccentricity.toFixed(2);
      });
    }
  }
}
