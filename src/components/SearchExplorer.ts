import { PLANETS_DATA } from '../data/planets';
import { MOONS_DATA } from '../data/moons';
import { EXPERIMENTS } from '../data/experiments';
import { t, getLanguage } from '../utils/i18n';

export interface SearchResult {
  id: string;
  type: 'planet' | 'moon' | 'experiment' | 'indonesia' | 'concept';
  title: string;
  subtitle: string;
  category: string;
  icon: string;
}

export class SearchExplorer {
  public container: HTMLElement;
  private inputEl: HTMLInputElement | null = null;
  private resultsEl: HTMLElement | null = null;

  public onSelectResult?: (result: SearchResult) => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'search-explorer';

    this.render();
    this.attachEvents();
  }

  public refreshLanguage(): void {
    if (this.inputEl) {
      this.inputEl.placeholder = t().searchPlaceholder;
    }
  }

  private render(): void {
    const tr = t();

    this.container.innerHTML = `
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="search" 
          id="global-search-input" 
          class="search-input" 
          placeholder="${tr.searchPlaceholder}" 
          autocomplete="off"
          aria-label="Pencarian Tata Surya dan Konsep Sains"
        />
      </div>
      <div class="search-results-dropdown hidden" id="search-results-dropdown" role="listbox"></div>
    `;
  }

  private attachEvents(): void {
    this.inputEl = this.container.querySelector('#global-search-input');
    this.resultsEl = this.container.querySelector('#search-results-dropdown');

    if (this.inputEl) {
      this.inputEl.addEventListener('input', () => {
        const query = this.inputEl!.value.trim().toLowerCase();
        if (query.length > 0) {
          const results = this.performSearch(query);
          this.renderResults(results);
        } else {
          this.hideResults();
        }
      });

      this.inputEl.addEventListener('focus', () => {
        const query = this.inputEl!.value.trim().toLowerCase();
        if (query.length > 0) {
          const results = this.performSearch(query);
          this.renderResults(results);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target as Node)) {
        this.hideResults();
      }
    });
  }

  private performSearch(q: string): SearchResult[] {
    const isEn = getLanguage() === 'en';
    const list: SearchResult[] = [];

    // 1. Search Planets
    for (const p of PLANETS_DATA) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.indonesianName.toLowerCase().includes(q) ||
        p.englishName.toLowerCase().includes(q) ||
        p.overview.toLowerCase().includes(q) ||
        (p.overviewEn && p.overviewEn.toLowerCase().includes(q))
      ) {
        list.push({
          id: p.id,
          type: 'planet',
          title: isEn ? p.englishName : p.indonesianName,
          subtitle: isEn ? p.indonesianName : p.englishName,
          category: isEn ? (p.type === 'star' ? 'Star' : 'Planet') : (p.type === 'star' ? 'Bintang' : 'Planet'),
          icon: p.type === 'star' ? '⭐' : '🪐'
        });
      }
    }

    // 2. Search Moons
    for (const m of MOONS_DATA) {
      if (
        m.name.toLowerCase().includes(q) ||
        m.indonesianName.toLowerCase().includes(q) ||
        m.englishName.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q) ||
        (m.overviewEn && m.overviewEn.toLowerCase().includes(q))
      ) {
        list.push({
          id: m.id,
          type: 'moon',
          title: isEn ? m.englishName : m.indonesianName,
          subtitle: isEn ? `Moon of ${m.parentId}` : `Bulan dari ${m.parentId}`,
          category: isEn ? 'Natural Satellite' : 'Satelit Alami',
          icon: '🌕'
        });
      }
    }

    // 3. Search Guided Experiments
    for (const exp of EXPERIMENTS) {
      if (
        exp.title.toLowerCase().includes(q) ||
        exp.titleEn.toLowerCase().includes(q) ||
        exp.objective.toLowerCase().includes(q)
      ) {
        list.push({
          id: exp.id,
          type: 'experiment',
          title: isEn ? exp.titleEn : exp.title,
          subtitle: isEn ? exp.title : exp.titleEn,
          category: isEn ? 'Gravity Experiment' : 'Eksperimen Gravitasi',
          icon: exp.icon
        });
      }
    }

    // 4. Search Indonesian Space Concepts
    const idConcepts = [
      { id: 'palapa', title: isEn ? 'Palapa Communications Satellite' : 'Satelit Palapa A1 s/d SATRIA-1', sub: isEn ? 'Geostationary GEO Network' : 'Satelit Komunikasi Geostasioner', cat: isEn ? 'Indonesia & Space' : 'Indonesia & Antariksa', icon: '🛰️' },
      { id: 'bosscha', title: isEn ? 'Bosscha Observatory Lembang' : 'Observatorium Bosscha Lembang', sub: isEn ? 'Historic 1923 Observatory' : 'Observatorium Tertua Indonesia (1923)', cat: isEn ? 'Indonesia & Space' : 'Indonesia & Antariksa', icon: '🔭' },
      { id: 'timau', title: isEn ? 'Timau National Observatory NTT' : 'Observatorium Nasional Timau NTT', sub: isEn ? '3.8m Optical Telescope' : 'Teleskop Optik 3,8 Meter', cat: isEn ? 'Indonesia & Space' : 'Indonesia & Antariksa', icon: '🌌' },
      { id: 'equator', title: isEn ? 'Indonesian Equatorial Advantage' : 'Keuntungan Khatulistiwa Indonesia', sub: isEn ? '465 m/s Surface Velocity Boost' : 'Dorongan Alami Rotasi Bumi 465 m/s', cat: isEn ? 'Orbital Mechanics' : 'Fisika Antariksa', icon: '🌍' },
      { id: 'kepler-1', title: isEn ? "Kepler's First Law (Ellipses)" : 'Hukum I Kepler (Orbit Elips)', sub: isEn ? 'Elliptical Orbits with Sun at Focus' : 'Bentuk Orbit Lonjong', cat: isEn ? 'Kepler Laws' : 'Hukum Kepler', icon: '📐' },
      { id: 'kepler-2', title: isEn ? "Kepler's Second Law (Equal Areas)" : 'Hukum II Kepler (Luas dan Waktu Sama)', sub: isEn ? 'Orbital Speed Peaks at Perihelion' : 'Kecepatan Orbit di Perihelion', cat: isEn ? 'Kepler Laws' : 'Hukum Kepler', icon: '📐' },
      { id: 'kepler-3', title: isEn ? "Kepler's Third Law (Harmonic T² ∝ a³)" : 'Hukum III Kepler (T² ∝ a³)', sub: isEn ? 'Harmony of Period and Distance' : 'Harmoni Periode dan Jarak Planet', cat: isEn ? 'Kepler Laws' : 'Hukum Kepler', icon: '📊' },
    ];

    for (const c of idConcepts) {
      if (c.title.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q)) {
        list.push({
          id: c.id,
          type: c.cat.includes('Kepler') ? 'concept' : 'indonesia',
          title: c.title,
          subtitle: c.sub,
          category: c.cat,
          icon: c.icon
        });
      }
    }

    return list.slice(0, 8);
  }

  private renderResults(results: SearchResult[]): void {
    if (!this.resultsEl) return;
    const isEn = getLanguage() === 'en';

    if (results.length === 0) {
      this.resultsEl.innerHTML = `<div class="search-empty">${isEn ? 'No results matched your search query.' : 'Tidak ada hasil yang cocok dengan pencarian Anda.'}</div>`;
      this.resultsEl.classList.remove('hidden');
      return;
    }

    this.resultsEl.innerHTML = results.map(r => `
      <div class="search-item" data-id="${r.id}" data-type="${r.type}">
        <span class="item-icon">${r.icon}</span>
        <div class="item-details">
          <div class="item-title">${r.title}</div>
          <div class="item-sub">${r.subtitle} • <span class="item-cat">${r.category}</span></div>
        </div>
      </div>
    `).join('');

    this.resultsEl.classList.remove('hidden');

    this.resultsEl.querySelectorAll('.search-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        const res = results[idx];
        if (this.onSelectResult) {
          this.onSelectResult(res);
        }
        this.hideResults();
        if (this.inputEl) this.inputEl.value = '';
      });
    });
  }

  private hideResults(): void {
    if (this.resultsEl) {
      this.resultsEl.classList.add('hidden');
    }
  }
}
