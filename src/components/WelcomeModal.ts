import { CurriculumLevel } from '../data/planets';
import { t, getLanguage } from '../utils/i18n';

export class WelcomeModal {
  public container: HTMLElement;
  public onStart?: (level: CurriculumLevel) => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'welcome-modal-overlay hidden';
    this.container.setAttribute('role', 'dialog');
    this.container.setAttribute('aria-modal', 'true');
    this.container.setAttribute('aria-label', 'Selamat Datang di Tata Surya 3D');

    this.render();
    this.attachEvents();
  }

  show(): void {
    this.container.classList.remove('hidden');
  }

  hide(): void {
    this.container.classList.add('hidden');
  }

  refreshLanguage(): void {
    this.render();
    this.attachEvents();
  }

  private render(): void {
    const isEn = getLanguage() === 'en';
    const tr = t();

    this.container.innerHTML = `
      <div class="welcome-card glass-panel">
        <div class="welcome-header">
          <div class="welcome-badge">${tr.welcomeBadge}</div>
          <h1 class="welcome-title">${tr.welcomeTitle}</h1>
          <p class="welcome-subtitle">${tr.welcomeSubtitle}</p>
        </div>

        <div class="welcome-features">
          <div class="feature-item">
            <span class="feature-icon">🌞</span>
            <div>
              <strong>${tr.welcomeFeat1Title}</strong>
              <p>${tr.welcomeFeat1Desc}</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-icon">🪐</span>
            <div>
              <strong>${tr.welcomeFeat2Title}</strong>
              <p>${tr.welcomeFeat2Desc}</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-icon">🧲</span>
            <div>
              <strong>${tr.welcomeFeat3Title}</strong>
              <p>${tr.welcomeFeat3Desc}</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-icon">🚀</span>
            <div>
              <strong>${tr.welcomeFeat4Title}</strong>
              <p>${tr.welcomeFeat4Desc}</p>
            </div>
          </div>

          <div class="feature-item">
            <span class="feature-icon">🇮🇩</span>
            <div>
              <strong>${tr.welcomeFeat5Title}</strong>
              <p>${tr.welcomeFeat5Desc}</p>
            </div>
          </div>
        </div>

        <div class="welcome-level-selection">
          <label><strong>${tr.selectLevelPrompt}</strong></label>
          <div class="level-radios">
            <label class="level-choice">
              <input type="radio" name="welcome-level" value="sd">
              <span class="choice-box">
                <strong>${tr.levelSdTitle}</strong>
                <small>${tr.levelSdDesc}</small>
              </span>
            </label>
            <label class="level-choice">
              <input type="radio" name="welcome-level" value="smp" checked>
              <span class="choice-box">
                <strong>${tr.levelSmpTitle}</strong>
                <small>${tr.levelSmpDesc}</small>
              </span>
            </label>
            <label class="level-choice">
              <input type="radio" name="welcome-level" value="sma">
              <span class="choice-box">
                <strong>${tr.levelSmaTitle}</strong>
                <small>${tr.levelSmaDesc}</small>
              </span>
            </label>
          </div>
        </div>

        <div class="welcome-actions">
          <button class="btn-start-exploring" id="btn-welcome-start">
            ${tr.btnStartExploring}
          </button>
        </div>
      </div>
    `;
  }

  private attachEvents(): void {
    const startBtn = this.container.querySelector('#btn-welcome-start');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const checkedRadio = this.container.querySelector('input[name="welcome-level"]:checked') as HTMLInputElement;
        const level = (checkedRadio?.value || 'smp') as CurriculumLevel;
        this.hide();
        localStorage.setItem('tata_surya_visited', 'true');
        if (this.onStart) {
          this.onStart(level);
        }
      });
    }
  }
}
