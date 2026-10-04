import { EXPERIMENTS, ExperimentDefinition, getExperimentById } from '../data/experiments';
import { GravityEngine } from '../physics/GravityEngine';
import { Body } from '../physics/Body';
import { Vector3 } from '../physics/Vector3';
import { OrbitalMechanics } from '../physics/OrbitalMechanics';
import { EARTH_MASS, EARTH_RADIUS, SOLAR_MASS, AU } from '../utils/constants';
import { t, getLanguage } from '../utils/i18n';

export class ExperimentPanel {
  public container: HTMLElement;
  private currentExperiment: ExperimentDefinition | null = null;
  private currentMode: 'guided' | 'sandbox' = 'guided';

  // Guided experiment parameters state
  private sliderValues: Map<string, number> = new Map();
  private userPredictionIndex: number | null = null;
  private observationLog: string[] = [];

  // Callbacks
  public onRunExperiment?: (expId: string, params: Record<string, number>) => void;
  public onResetExperiment?: () => void;
  public onAddSandboxBody?: (body: Body) => void;
  public onClose?: () => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'experiment-panel glass-panel hidden';
    this.container.setAttribute('aria-label', 'Panel Eksperimen & Sandbox');

    // Default select first experiment
    this.currentExperiment = EXPERIMENTS[0];
    this.initSliderValues(this.currentExperiment);

    this.render();
  }

  show(experimentId?: string): void {
    this.container.classList.remove('hidden');
    if (experimentId) {
      const exp = getExperimentById(experimentId);
      if (exp) {
        this.currentExperiment = exp;
        this.currentMode = 'guided';
        this.initSliderValues(exp);
      }
    }
    this.render();
  }

  hide(): void {
    this.container.classList.add('hidden');
    if (this.onClose) this.onClose();
  }

  refreshLanguage(): void {
    if (!this.container.classList.contains('hidden')) {
      this.render();
    }
  }

  private initSliderValues(exp: ExperimentDefinition): void {
    this.sliderValues.clear();
    this.userPredictionIndex = null;
    for (const s of exp.sliders) {
      this.sliderValues.set(s.id, s.defaultValue);
    }
  }

  private render(): void {
    const isEn = getLanguage() === 'en';
    const tr = t();

    this.container.innerHTML = `
      <div class="panel-header">
        <div class="header-titles">
          <div class="header-badges">
            <span class="badge badge-curriculum">${isEn ? 'GRAVITY LAB' : 'LABORATORIUM GRAVITASI'}</span>
          </div>
          <h2 class="planet-title">${this.currentMode === 'guided' ? (isEn ? 'Guided Experiments' : 'Eksperimen Terpandu') : (isEn ? 'Gravity Sandbox' : 'Gravity Sandbox Mandiri')}</h2>
          <span class="planet-subtitle">${isEn ? 'Explore ➔ Predict ➔ Experiment ➔ Observe ➔ Explain' : 'Eksplorasi ➔ Prediksi ➔ Eksperimen ➔ Amati ➔ Pahami'}</span>
        </div>
        <button class="btn-close" id="btn-close-exp" title="${isEn ? 'Close' : 'Tutup'}">&times;</button>
      </div>

      <!-- Mode switcher: Guided vs Sandbox -->
      <div class="exp-mode-toggle">
        <button class="btn-mode ${this.currentMode === 'guided' ? 'active' : ''}" id="mode-guided">
          ${tr.btnGuidedMode}
        </button>
        <button class="btn-mode ${this.currentMode === 'sandbox' ? 'active' : ''}" id="mode-sandbox">
          ${tr.btnSandboxMode}
        </button>
      </div>

      <!-- Portal Link Banner -->
      <div class="exp-portal-banner">
        <div class="exp-portal-info">
          <span class="exp-portal-icon">🧪</span>
          <div>
            <strong>${isEn ? 'Explore All Experiments' : 'Jelajahi Semua Eksperimen'}</strong>
            <p>${isEn ? 'Discover more interactive simulations on Buku Anak' : 'Kunjungi portal eksperimen Buku Anak untuk simulasi sains lainnya'}</p>
          </div>
        </div>
        <a href="https://experiment.bukuanak.id/" class="exp-portal-btn" target="_blank" rel="noopener noreferrer">
          experiment.bukuanak.id ↗
        </a>
      </div>

      <div class="exp-body-content">
        ${this.currentMode === 'guided' ? this.renderGuidedView() : this.renderSandboxView()}
      </div>
    `;

    this.attachEvents();
  }

  private renderGuidedView(): string {
    if (!this.currentExperiment) return '';
    const exp = this.currentExperiment;
    const isEn = getLanguage() === 'en';
    const tr = t();

    const expTitle = isEn && exp.titleEn ? exp.titleEn : exp.title;

    return `
      <!-- Experiment Selector dropdown -->
      <div class="exp-selector-bar">
        <label for="exp-select"><strong>${tr.selectExpLabel}:</strong></label>
        <select id="exp-select" class="custom-select">
          ${EXPERIMENTS.map(e => `
            <option value="${e.id}" ${e.id === exp.id ? 'selected' : ''}>
              ${isEn && e.titleEn ? e.titleEn : e.title}
            </option>
          `).join('')}
        </select>
      </div>

      <!-- Objective Card -->
      <div class="objective-card">
        <div class="card-icon">${exp.icon}</div>
        <div>
          <h4>${tr.objectiveTitle}:</h4>
          <p>${exp.objective}</p>
        </div>
      </div>

      <!-- Step 1: Prediction Question -->
      <div class="exp-section">
        <h4 class="section-badge">${tr.step1Prediction}</h4>
        <p class="prediction-question">${exp.predictionQuestion.question}</p>
        <div class="prediction-options">
          ${exp.predictionQuestion.options.map((opt, i) => `
            <button class="btn-option ${this.userPredictionIndex === i ? (opt.isCorrect ? 'correct' : 'incorrect') : ''}" data-idx="${i}">
              <span class="opt-indicator">${this.userPredictionIndex === i ? (opt.isCorrect ? '✓' : '✗') : String.fromCharCode(65 + i)}</span>
              <span class="opt-text">${opt.text}</span>
            </button>
          `).join('')}
        </div>
        ${this.userPredictionIndex !== null ? `
          <div class="prediction-feedback ${exp.predictionQuestion.options[this.userPredictionIndex].isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
            <strong>${exp.predictionQuestion.options[this.userPredictionIndex].isCorrect ? (isEn ? '🎉 Correct Prediction!' : '🎉 Prediksi Tepat!') : (isEn ? '💡 Take Note:' : '💡 Perhatikan:')}</strong>
            <p>${exp.predictionQuestion.options[this.userPredictionIndex].feedback}</p>
          </div>
        ` : ''}
      </div>

      <!-- Step 2: Sliders & Setup -->
      <div class="exp-section">
        <h4 class="section-badge">${tr.step2Setup}</h4>
        <div class="sliders-list">
          ${exp.sliders.map(s => {
            const val = this.sliderValues.get(s.id) ?? s.defaultValue;
            const sName = isEn && s.nameEn ? s.nameEn : s.name;
            return `
              <div class="slider-group">
                <div class="slider-labels">
                  <span>${sName}:</span>
                  <strong id="val-${s.id}">${val} ${s.unit}</strong>
                </div>
                <input type="range" class="exp-slider" id="slider-${s.id}" data-id="${s.id}" min="${s.min}" max="${s.max}" step="${s.step}" value="${val}">
                <span class="slider-desc">${s.description}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="action-run-row">
          <button class="btn-run-exp" id="btn-run-experiment">
            ${tr.btnRunExp}
          </button>
          <button class="btn-reset-exp" id="btn-reset-experiment">
            ${tr.btnResetExp}
          </button>
        </div>
      </div>

      <!-- Step 3: Observations & Points to Watch -->
      <div class="exp-section">
        <h4 class="section-badge">${tr.step3Observe}</h4>
        <ul class="points-list">
          ${exp.observationPoints.map(pt => `<li>${pt}</li>`).join('')}
        </ul>

        <!-- Student observation note recording -->
        <div class="student-notes-box">
          <label for="student-notes"><strong>${tr.studentNotesTitle}:</strong></label>
          <textarea id="student-notes" placeholder="${tr.notesPlaceholder}"></textarea>
          <div class="notes-actions">
            <button class="btn-note" id="btn-save-note">${tr.btnSaveNote}</button>
            <button class="btn-note" id="btn-export-notes">${tr.btnExportNotes}</button>
          </div>
        </div>
      </div>

      <!-- Step 4: Scientific Explanation -->
      <div class="exp-section explanation-section">
        <h4 class="section-badge">${tr.step4Explain}</h4>
        <div class="explanation-body">
          ${exp.explanation.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  }

  private renderSandboxView(): string {
    const isEn = getLanguage() === 'en';
    const tr = t();

    return `
      <div class="sandbox-wrapper">
        <div class="sandbox-intro">
          <p>${tr.sandboxIntro}</p>
        </div>

        <!-- Presets -->
        <div class="sandbox-card">
          <h4>${tr.sandboxPresetsTitle}</h4>
          <div class="preset-buttons">
            <button class="btn-preset" data-preset="earth">🌍 ${isEn ? 'Earth-like Planet' : 'Planet Mirip Bumi'}</button>
            <button class="btn-preset" data-preset="moon">🌕 ${isEn ? 'Moon' : 'Bulan'}</button>
            <button class="btn-preset" data-preset="asteroid">☄️ Asteroid</button>
            <button class="btn-preset" data-preset="comet">💫 ${isEn ? 'High-eccentricity Comet' : 'Komet Orbit Sangat Lonjong'}</button>
            <button class="btn-preset" data-preset="binary">⭐ ${isEn ? 'Binary Star System' : 'Bintang Biner (2 Bintang)'}</button>
          </div>
        </div>

        <!-- Create Body Form -->
        <div class="sandbox-card">
          <h4>${tr.sandboxCustomTitle}</h4>
          <div class="custom-form">
            <div class="form-row">
              <label>${tr.sbBodyName}:</label>
              <input type="text" id="sb-name" value="${isEn ? 'Custom Planet' : 'Planet Kustom'}" class="custom-input">
            </div>

            <div class="form-row">
              <label>${tr.sbMass}:</label>
              <input type="range" id="sb-mass" min="0.01" max="300" step="0.5" value="1.0">
              <span id="sb-mass-val">1.0 × ${isEn ? 'Earth Mass' : 'Massa Bumi'}</span>
            </div>

            <div class="form-row">
              <label>${tr.sbDistance}:</label>
              <input type="range" id="sb-dist" min="0.3" max="15.0" step="0.1" value="1.0">
              <span id="sb-dist-val">1.0 AU</span>
            </div>

            <div class="form-row">
              <label>${tr.sbSpeed}:</label>
              <input type="range" id="sb-speed" min="0" max="60" step="1" value="29.8">
              <span id="sb-speed-val">29.8 km/s</span>
            </div>

            <div class="form-row">
              <label>${tr.sbAngle}:</label>
              <input type="range" id="sb-angle" min="0" max="360" step="5" value="90">
              <span id="sb-angle-val">90° (${isEn ? 'Perpendicular' : 'Tegak Lurus'})</span>
            </div>

            <button class="btn-launch-body" id="btn-launch-sandbox">
              ${tr.btnLaunchBody}
            </button>
          </div>
        </div>

        <!-- Active Sandbox Bodies List -->
        <div class="sandbox-card">
          <h4>${isEn ? 'Active Sandbox Bodies:' : 'Benda Aktif di Sandbox:'}</h4>
          <div id="sandbox-bodies-list" class="bodies-list">
            <p class="text-muted">${isEn ? 'Use the controls above to launch new objects into the gravity field.' : 'Gunakan tombol di atas untuk meluncurkan objek baru ke sistem.'}</p>
          </div>
        </div>
      </div>
    `;
  }

  private attachEvents(): void {
    const isEn = getLanguage() === 'en';
    const closeBtn = this.container.querySelector('#btn-close-exp');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());

    // Mode Toggle
    const guidedBtn = this.container.querySelector('#mode-guided');
    const sandboxBtn = this.container.querySelector('#mode-sandbox');

    if (guidedBtn) {
      guidedBtn.addEventListener('click', () => {
        this.currentMode = 'guided';
        this.render();
      });
    }

    if (sandboxBtn) {
      sandboxBtn.addEventListener('click', () => {
        this.currentMode = 'sandbox';
        this.render();
      });
    }

    if (this.currentMode === 'guided') {
      this.attachGuidedEvents();
    } else {
      this.attachSandboxEvents();
    }
  }

  private attachGuidedEvents(): void {
    const isEn = getLanguage() === 'en';

    // Dropdown select
    const select = this.container.querySelector('#exp-select') as HTMLSelectElement;
    if (select) {
      select.addEventListener('change', () => {
        const exp = getExperimentById(select.value);
        if (exp) {
          this.currentExperiment = exp;
          this.initSliderValues(exp);
          this.render();
        }
      });
    }

    // Prediction options
    const optButtons = this.container.querySelectorAll('.btn-option');
    optButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx || '0', 10);
        this.userPredictionIndex = idx;
        this.render();
      });
    });

    // Sliders
    const sliders = this.container.querySelectorAll('.exp-slider');
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const input = e.currentTarget as HTMLInputElement;
        const id = input.dataset.id!;
        const val = parseFloat(input.value);
        this.sliderValues.set(id, val);

        const valDisplay = this.container.querySelector(`#val-${id}`);
        const sDef = this.currentExperiment?.sliders.find(x => x.id === id);
        if (valDisplay && sDef) {
          valDisplay.textContent = `${val} ${sDef.unit}`;
        }
      });
    });

    // Run Experiment
    const runBtn = this.container.querySelector('#btn-run-experiment');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        if (!this.currentExperiment) return;
        const params: Record<string, number> = {};
        for (const [k, v] of this.sliderValues.entries()) {
          params[k] = v;
        }
        if (this.onRunExperiment) {
          this.onRunExperiment(this.currentExperiment.id, params);
        }
      });
    }

    // Reset Experiment
    const resetBtn = this.container.querySelector('#btn-reset-experiment');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this.currentExperiment) {
          this.initSliderValues(this.currentExperiment);
          this.render();
        }
        if (this.onResetExperiment) {
          this.onResetExperiment();
        }
      });
    }

    // Save and Export Notes
    const saveNoteBtn = this.container.querySelector('#btn-save-note');
    const exportNotesBtn = this.container.querySelector('#btn-export-notes');
    const notesArea = this.container.querySelector('#student-notes') as HTMLTextAreaElement;

    if (saveNoteBtn && notesArea) {
      saveNoteBtn.addEventListener('click', () => {
        const noteText = notesArea.value.trim();
        if (noteText) {
          this.observationLog.push(`[${new Date().toLocaleTimeString(isEn ? 'en-US' : 'id-ID')}] ${this.currentExperiment?.title}: ${noteText}`);
          alert(isEn ? 'Observation note saved successfully!' : 'Catatan pengamatan berhasil disimpan!');
        }
      });
    }

    if (exportNotesBtn && notesArea) {
      exportNotesBtn.addEventListener('click', () => {
        const noteText = notesArea.value.trim();
        let content = `${isEn ? '3D SOLAR SYSTEM PHYSICS EXPERIMENT REPORT' : 'HASIL EKSPERIMEN FISIKA TATA SURYA 3D'}\nDate: ${new Date().toLocaleDateString(isEn ? 'en-US' : 'id-ID')}\n\n`;
        content += `${isEn ? 'Experiment' : 'Eksperimen'}: ${isEn && this.currentExperiment?.titleEn ? this.currentExperiment.titleEn : this.currentExperiment?.title}\n`;
        content += `${isEn ? 'Student Prediction' : 'Prediksi Siswa'}: ${this.userPredictionIndex !== null ? this.currentExperiment?.predictionQuestion.options[this.userPredictionIndex].text : (isEn ? 'Not selected' : 'Belum memilih')}\n`;
        content += `${isEn ? 'Observation Notes' : 'Catatan Pengamatan'}:\n${noteText || (isEn ? 'No notes written.' : 'Tidak ada catatan tertulis.')}\n\n`;
        content += `${isEn ? 'Log History' : 'Riwayat Log'}:\n` + this.observationLog.join('\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Experiment_Notes_${this.currentExperiment?.id || 'tata_surya'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  private attachSandboxEvents(): void {
    const isEn = getLanguage() === 'en';

    const massSlider = this.container.querySelector('#sb-mass') as HTMLInputElement;
    const distSlider = this.container.querySelector('#sb-dist') as HTMLInputElement;
    const speedSlider = this.container.querySelector('#sb-speed') as HTMLInputElement;
    const angleSlider = this.container.querySelector('#sb-angle') as HTMLInputElement;

    const massVal = this.container.querySelector('#sb-mass-val');
    const distVal = this.container.querySelector('#sb-dist-val');
    const speedVal = this.container.querySelector('#sb-speed-val');
    const angleVal = this.container.querySelector('#sb-angle-val');

    if (massSlider && massVal) {
      massSlider.addEventListener('input', () => {
        massVal.textContent = `${parseFloat(massSlider.value).toFixed(1)} × ${isEn ? 'Earth Mass' : 'Massa Bumi'}`;
      });
    }

    if (distSlider && distVal) {
      distSlider.addEventListener('input', () => {
        distVal.textContent = `${parseFloat(distSlider.value).toFixed(1)} AU`;
        if (speedSlider && speedVal) {
          const r = parseFloat(distSlider.value) * AU;
          const vCircKms = (OrbitalMechanics.circularVelocity(SOLAR_MASS, r) / 1000).toFixed(1);
          speedSlider.value = vCircKms;
          speedVal.textContent = `${vCircKms} km/s (${isEn ? 'Ideal Circular Speed' : 'Kecepatan Lingkaran Ideal'})`;
        }
      });
    }

    if (speedSlider && speedVal) {
      speedSlider.addEventListener('input', () => {
        speedVal.textContent = `${parseFloat(speedSlider.value).toFixed(1)} km/s`;
      });
    }

    if (angleSlider && angleVal) {
      angleSlider.addEventListener('input', () => {
        angleVal.textContent = `${angleSlider.value}°`;
      });
    }

    // Launch button
    const launchBtn = this.container.querySelector('#btn-launch-sandbox');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        const name = (this.container.querySelector('#sb-name') as HTMLInputElement).value || (isEn ? 'Custom Planet' : 'Planet Kustom');
        const massFactor = parseFloat(massSlider?.value || '1.0');
        const distAU = parseFloat(distSlider?.value || '1.0');
        const speedKms = parseFloat(speedSlider?.value || '29.8');
        const angleDeg = parseFloat(angleSlider?.value || '90');

        const distM = distAU * AU;
        const speedMs = speedKms * 1000;
        const rad = (angleDeg * Math.PI) / 180;

        const pos = new Vector3(distM, 0, 0);
        const vel = new Vector3(
          Math.cos(rad) * speedMs,
          0,
          Math.sin(rad) * speedMs
        );

        const newBody = new Body({
          id: `custom-${Date.now()}`,
          name: name,
          indonesianName: name,
          type: 'custom',
          mass: massFactor * EARTH_MASS,
          radius: EARTH_RADIUS * Math.cbrt(massFactor),
          position: pos,
          velocity: vel,
          color: '#38ef7d'
        });

        if (this.onAddSandboxBody) {
          this.onAddSandboxBody(newBody);
          alert(isEn ? `Celestial body "${name}" successfully launched into the gravity simulation!` : `Objek "${name}" berhasil diluncurkan ke sistem simulasi!`);
        }
      });
    }

    // Presets
    const presetBtns = this.container.querySelectorAll('.btn-preset');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = (e.currentTarget as HTMLElement).dataset.preset;
        if (!distSlider || !speedSlider || !massSlider) return;

        if (preset === 'earth') {
          distSlider.value = '1.0';
          massSlider.value = '1.0';
          speedSlider.value = '29.8';
        } else if (preset === 'moon') {
          distSlider.value = '1.05';
          massSlider.value = '0.012';
          speedSlider.value = '28.8';
        } else if (preset === 'asteroid') {
          distSlider.value = '2.8';
          massSlider.value = '0.0001';
          speedSlider.value = '17.8';
        } else if (preset === 'comet') {
          distSlider.value = '5.0';
          massSlider.value = '0.00001';
          speedSlider.value = '11.0';
        }
        distSlider.dispatchEvent(new Event('input'));
        massSlider.dispatchEvent(new Event('input'));
        speedSlider.dispatchEvent(new Event('input'));
      });
    });
  }
}
