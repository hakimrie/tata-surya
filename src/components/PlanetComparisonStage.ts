import { PLANETS_DATA } from '../data/planets';
import { MOONS_DATA } from '../data/moons';
import { t, getLanguage } from '../utils/i18n';
import { formatNumberId } from '../utils/formatting';

export class PlanetComparisonStage {
  public container: HTMLElement;
  private userEarthWeightKg: number = 60;
  private filterCategory: 'all' | 'terrestrial' | 'giants' | 'moons' = 'all';

  public onClose?: () => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'scale-theater-modal';
    this.container.className = 'scale-theater glass-panel hidden';
    this.container.setAttribute('aria-label', 'Teater Komparasi Skala Tata Surya');

    this.render();
  }

  public show(): void {
    this.container.classList.remove('hidden');
    this.render();
  }

  public hide(): void {
    this.container.classList.add('hidden');
    if (this.onClose) this.onClose();
  }

  public refreshLanguage(): void {
    if (!this.container.classList.contains('hidden')) {
      this.render();
    }
  }

  private render(): void {
    const isEn = getLanguage() === 'en';

    // Bodies dataset for comparison
    const comparisonItems = [
      { id: 'sun', nameId: 'Matahari', nameEn: 'Sun', diamKm: 1392700, g: 274.0, col: '#f59e0b', cat: 'giants', icon: '☀️' },
      { id: 'jupiter', nameId: 'Jupiter', nameEn: 'Jupiter', diamKm: 139820, g: 24.79, col: '#d97706', cat: 'giants', icon: '🪐' },
      { id: 'saturn', nameId: 'Saturnus', nameEn: 'Saturn', diamKm: 116460, g: 10.44, col: '#fde047', cat: 'giants', icon: '🪐' },
      { id: 'uranus', nameId: 'Uranus', nameEn: 'Uranus', diamKm: 50724, g: 8.69, col: '#67e8f9', cat: 'giants', icon: '🔵' },
      { id: 'neptune', nameId: 'Neptunus', nameEn: 'Neptune', diamKm: 49244, g: 11.15, col: '#3b82f6', cat: 'giants', icon: '🔷' },
      { id: 'earth', nameId: 'Bumi', nameEn: 'Earth', diamKm: 12742, g: 9.807, col: '#38bdf8', cat: 'terrestrial', icon: '🌍' },
      { id: 'venus', nameId: 'Venus', nameEn: 'Venus', diamKm: 12104, g: 8.87, col: '#facc15', cat: 'terrestrial', icon: '🟡' },
      { id: 'mars', nameId: 'Mars', nameEn: 'Mars', diamKm: 6779, g: 3.72, col: '#ef4444', cat: 'terrestrial', icon: '🔴' },
      { id: 'ganymede', nameId: 'Ganymede', nameEn: 'Ganymede', diamKm: 5268, g: 1.428, col: '#94a3b8', cat: 'moons', icon: '🌑' },
      { id: 'titan', nameId: 'Titan', nameEn: 'Titan', diamKm: 5149, g: 1.352, col: '#fbbf24', cat: 'moons', icon: '🌑' },
      { id: 'mercury', nameId: 'Merkurius', nameEn: 'Mercury', diamKm: 4879, g: 3.7, col: '#a8a29e', cat: 'terrestrial', icon: '⚪' },
      { id: 'moon', nameId: 'Bulan (Bumi)', nameEn: 'Moon (Earth)', diamKm: 3474, g: 1.62, col: '#e2e8f0', cat: 'moons', icon: '🌕' },
      { id: 'pluto', nameId: 'Pluto', nameEn: 'Pluto', diamKm: 2376, g: 0.62, col: '#d6d3d1', cat: 'moons', icon: '🪐' },
      { id: 'ceres', nameId: 'Ceres', nameEn: 'Ceres', diamKm: 940, g: 0.28, col: '#78716c', cat: 'terrestrial', icon: '🪨' }
    ];

    const filtered = comparisonItems.filter(item => {
      if (this.filterCategory === 'all') return true;
      if (this.filterCategory === 'terrestrial') return item.cat === 'terrestrial';
      if (this.filterCategory === 'giants') return item.cat === 'giants';
      if (this.filterCategory === 'moons') return item.cat === 'moons';
      return true;
    });

    // Reference max diameter for proportional bar
    const maxDiam = this.filterCategory === 'all' || this.filterCategory === 'giants'
      ? 1392700
      : 12742;

    this.container.innerHTML = `
      <div class="panel-header">
        <div class="header-titles">
          <span class="badge badge-curriculum">${isEn ? 'SCALE THEATER' : 'TEATER KOMPARASI SKALA'}</span>
          <h2 class="planet-title">${isEn ? 'Planetary Scale & Weight Lab' : 'Laboratorium Ukuran & Berat Antariksa'}</h2>
          <span class="planet-subtitle">${isEn ? 'Explore relative sizes, volume comparisons, and your weight across other worlds' : 'Bandingkan perbandingan ukuran nyata, volume planet, dan timbangan beratmu di dunia lain'}</span>
        </div>
        <button class="btn-close" id="btn-close-theater" title="${isEn ? 'Close' : 'Tutup'}">&times;</button>
      </div>

      <!-- Category Filter Tabs -->
      <div class="theater-tabs">
        <button class="tab-btn ${this.filterCategory === 'all' ? 'active' : ''}" data-cat="all">
          ${isEn ? '🌌 All Objects' : '🌌 Semua Objek'}
        </button>
        <button class="tab-btn ${this.filterCategory === 'terrestrial' ? 'active' : ''}" data-cat="terrestrial">
          ${isEn ? '🪨 Terrestrial Worlds' : '🪨 Planet Kebumian'}
        </button>
        <button class="tab-btn ${this.filterCategory === 'giants' ? 'active' : ''}" data-cat="giants">
          ${isEn ? '🪐 Gas & Ice Giants' : '🪐 Planet Raksasa'}
        </button>
        <button class="tab-btn ${this.filterCategory === 'moons' ? 'active' : ''}" data-cat="moons">
          ${isEn ? '🌑 Major Moons' : '🌑 Satelit Alami'}
        </button>
      </div>

      <div class="theater-body">
        <!-- Interactive Weight Calculator Box -->
        <div class="weight-calculator-card">
          <div class="weight-calc-header">
            <div>
              <strong>${isEn ? '⚖️ Your Weight on Other Worlds' : '⚖️ Berapa Beratmu di Planet Lain?'}</strong>
              <p class="text-muted" style="font-size: 11px;">
                ${isEn ? 'Enter your weight on Earth (kg) and see how gravity changes your weight!' : 'Masukkan berat badanmu di Bumi (kg) dan lihat perubahan gaya tarik gravitasinya!'}
              </p>
            </div>
            <div class="weight-input-group">
              <label for="input-earth-weight">${isEn ? 'Weight on Earth:' : 'Berat di Bumi:'}</label>
              <input type="number" id="input-earth-weight" value="${this.userEarthWeightKg}" min="1" max="500" step="1">
              <span>kg</span>
            </div>
          </div>
        </div>

        <!-- Comparative Size Bars & Weight Readouts -->
        <div class="theater-comparison-list">
          ${filtered.map(item => {
            const pct = Math.max(0.6, (item.diamKm / maxDiam) * 100);
            const userWeightHere = (this.userEarthWeightKg * (item.g / 9.807)).toFixed(1);
            const ratioEarth = (item.diamKm / 12742).toFixed(item.diamKm < 10000 ? 2 : 1);
            const name = isEn ? item.nameEn : item.nameId;

            return `
              <div class="comparison-row">
                <div class="row-header">
                  <div class="row-title">
                    <span class="row-icon">${item.icon}</span>
                    <strong>${name}</strong>
                    <span class="row-meta text-muted">Ø ${(item.diamKm).toLocaleString(isEn ? 'en-US' : 'id-ID')} km (${ratioEarth}× Bumi)</span>
                  </div>
                  <div class="row-weight-badge" title="${isEn ? 'Gravity: ' + item.g + ' m/s²' : 'Gravitasi: ' + item.g + ' m/s²'}">
                    <span>${isEn ? 'Weight:' : 'Berat:'}</span>
                    <strong style="color: ${item.col}; font-size: 14px;">${userWeightHere} kg</strong>
                    <span class="text-muted">(${item.g.toFixed(1)} m/s²)</span>
                  </div>
                </div>

                <div class="row-scale-bar-track">
                  <div class="row-scale-bar-fill" style="width: ${pct}%; background-color: ${item.col};"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Marble Scale Analogy Educational Box -->
        <div class="marble-analogy-box">
          <div class="analogy-header">
            <span class="icon">🔮</span>
            <strong>${isEn ? 'Cosmic Analogy: "If Earth were a 1 cm Marble..."' : 'Analogi Edukasi: "Jika Bumi Seukuran Kelereng 1 cm..."'}</strong>
          </div>
          <div class="analogy-grid">
            <div class="analogy-item">
              <span class="analogy-label">Matahari (The Sun)</span>
              <strong>${isEn ? '1.09-meter Giant Gym Ball (117 m away)' : 'Bola Senam Raksasa 1,09 meter (berjarak 117 meter)'}</strong>
            </div>
            <div class="analogy-item">
              <span class="analogy-label">Bulan (The Moon)</span>
              <strong>${isEn ? '2.7 mm Peppercorn (30 cm away)' : 'Butir Lada 2,7 mm (berjarak 30 cm dari kelereng)'}</strong>
            </div>
            <div class="analogy-item">
              <span class="analogy-label">Jupiter</span>
              <strong>${isEn ? '11 cm Grapefruit (610 m away)' : 'Jeruk Bali 11 cm (berjarak 610 meter)'}</strong>
            </div>
            <div class="analogy-item">
              <span class="analogy-label">Neptunus (Neptune)</span>
              <strong>${isEn ? '3.9 cm Golf Ball (3.5 km away!)' : 'Bola Golf 3,9 cm (berjarak 3,5 km jauhnya!)'}</strong>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents(): void {
    this.container.querySelector('#btn-close-theater')?.addEventListener('click', () => this.hide());

    // Category filter tabs
    this.container.querySelectorAll('.theater-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') as any;
        if (cat) {
          this.filterCategory = cat;
          this.render();
        }
      });
    });

    // Weight input
    const weightInput = this.container.querySelector('#input-earth-weight') as HTMLInputElement;
    if (weightInput) {
      weightInput.addEventListener('input', () => {
        const val = parseFloat(weightInput.value);
        if (!isNaN(val) && val > 0) {
          this.userEarthWeightKg = val;
          // Fast update weight badges without full redraw
          const rows = this.container.querySelectorAll('.comparison-row');
          // re-render list
          this.render();
          const updatedInput = this.container.querySelector('#input-earth-weight') as HTMLInputElement;
          if (updatedInput) {
            updatedInput.value = String(val);
            updatedInput.focus();
          }
        }
      });
    }
  }
}
