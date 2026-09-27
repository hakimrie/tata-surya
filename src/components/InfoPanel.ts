import { PlanetData, CurriculumLevel } from '../data/planets';
import { MoonData, getMoonsByPlanetId } from '../data/moons';
import { UnitConverter, UnitSystem } from '../utils/units';
import { formatEnergy, formatGravity, formatTemperature, formatNumberId } from '../utils/formatting';
import { Body } from '../physics/Body';
import { G, SOLAR_MASS } from '../utils/constants';
import { t, getLanguage } from '../utils/i18n';

export class InfoPanel {
  public container: HTMLElement;
  private currentPlanet: PlanetData | null = null;
  private currentMoon: MoonData | null = null;
  private activeTab: 'overview' | 'physical' | 'orbit' | 'atmosphere' | 'moons' | 'energy' = 'overview';

  public curriculumLevel: CurriculumLevel = 'smp';
  public unitSystem: UnitSystem = 'student';

  // Callbacks
  public onFocusClick?: (id: string) => void;
  public onFollowClick?: (id: string) => void;
  public onViewSurfaceClick?: (id: string) => void;
  public onSelectMoon?: (moonId: string) => void;
  public onClose?: () => void;

  constructor() {
    this.container = document.createElement('aside');
    this.container.className = 'info-panel glass-panel hidden';
    this.container.setAttribute('aria-label', 'Informasi Benda Langit');
    this.container.setAttribute('role', 'region');
  }

  showPlanet(planet: PlanetData, level: CurriculumLevel, units: UnitSystem): void {
    this.currentPlanet = planet;
    this.currentMoon = null;
    this.curriculumLevel = level;
    this.unitSystem = units;
    this.container.classList.remove('hidden');
    this.render();
  }

  showMoon(moon: MoonData, level: CurriculumLevel, units: UnitSystem): void {
    this.currentMoon = moon;
    this.currentPlanet = null;
    this.curriculumLevel = level;
    this.unitSystem = units;
    this.container.classList.remove('hidden');
    this.render();
  }

  hide(): void {
    this.container.classList.add('hidden');
    this.currentPlanet = null;
    this.currentMoon = null;
    if (this.onClose) this.onClose();
  }

  setCurriculumLevel(level: CurriculumLevel): void {
    this.curriculumLevel = level;
    this.render();
  }

  setUnitSystem(units: UnitSystem): void {
    this.unitSystem = units;
    this.render();
  }

  refreshLanguage(): void {
    if (!this.container.classList.contains('hidden')) {
      this.render();
    }
  }

  /**
   * Update real-time energy readouts if energy tab is open
   */
  updateEnergyReadout(body: Body, centralMass: number = SOLAR_MASS): void {
    if (this.activeTab !== 'energy') return;
    const keEl = this.container.querySelector('#info-ke');
    const peEl = this.container.querySelector('#info-pe');
    const totEl = this.container.querySelector('#info-tot-e');
    const speedEl = this.container.querySelector('#info-live-speed');
    const distEl = this.container.querySelector('#info-live-dist');

    if (!keEl || !peEl || !totEl || !speedEl || !distEl) return;

    const v = body.velocity.length();
    const r = body.position.length();
    const ke = 0.5 * body.mass * v * v;
    const pe = r > 0 ? -(G * centralMass * body.mass) / r : 0;
    const totalE = ke + pe;

    keEl.textContent = formatEnergy(ke);
    peEl.textContent = formatEnergy(pe);
    totEl.textContent = formatEnergy(totalE);
    speedEl.textContent = UnitConverter.formatVelocity(v, this.unitSystem);
    distEl.textContent = UnitConverter.formatDistance(r, this.unitSystem);
  }

  private render(): void {
    if (this.currentMoon) {
      this.renderMoon(this.currentMoon);
    } else if (this.currentPlanet) {
      this.renderPlanet(this.currentPlanet);
    }
  }

  private renderPlanet(p: PlanetData): void {
    const isEn = getLanguage() === 'en';
    const tr = t();

    const typeLabel = p.type === 'star'
      ? (isEn ? '⭐ Host Star' : '⭐ Bintang Induk')
      : p.type === 'dwarf'
      ? (isEn ? '🪐 Dwarf Planet' : '🪐 Planet Kerdil')
      : (isEn ? '🪐 Planet' : '🪐 Planet');

    const primaryTitle = isEn ? p.englishName : p.indonesianName;
    const secondaryTitle = isEn ? p.indonesianName : p.englishName;

    const curriculumText = isEn && p.curriculumEn
      ? p.curriculumEn[this.curriculumLevel]
      : p.curriculum[this.curriculumLevel];

    this.container.innerHTML = `
      <div class="panel-header">
        <div class="header-titles">
          <div class="header-badges">
            <span class="badge badge-type">${typeLabel}</span>
            <span class="badge badge-curriculum">${tr.levelPrefix}: ${this.curriculumLevel.toUpperCase()}</span>
          </div>
          <h2 class="planet-title">${primaryTitle}</h2>
          <span class="planet-subtitle">${secondaryTitle}</span>
        </div>
        <button class="btn-close" id="btn-close-info" title="Close Panel" aria-label="Close Panel">&times;</button>
      </div>

      <!-- Action Buttons -->
      <div class="panel-actions">
        <button class="btn-action" id="btn-focus" title="${tr.btnFocus}">
          <span class="action-icon">🎯</span> ${tr.btnFocus}
        </button>
        <button class="btn-action" id="btn-follow" title="${tr.btnFollow}">
          <span class="action-icon">🛰️</span> ${tr.btnFollow}
        </button>
        ${p.type !== 'star' ? `
        <button class="btn-action" id="btn-surface" title="${tr.btnSurface}">
          <span class="action-icon">👀</span> ${tr.btnSurface}
        </button>` : ''}
      </div>

      <!-- Tabs Navigation -->
      <div class="panel-tabs" role="tablist">
        <button class="tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">${tr.tabOverview}</button>
        <button class="tab-btn ${this.activeTab === 'physical' ? 'active' : ''}" data-tab="physical">${tr.tabPhysical}</button>
        <button class="tab-btn ${this.activeTab === 'orbit' ? 'active' : ''}" data-tab="orbit">${tr.tabOrbit}</button>
        <button class="tab-btn ${this.activeTab === 'atmosphere' ? 'active' : ''}" data-tab="atmosphere">${tr.tabAtmosphere}</button>
        ${p.knownMoonsCount > 0 ? `<button class="tab-btn ${this.activeTab === 'moons' ? 'active' : ''}" data-tab="moons">${tr.tabMoons} (${p.knownMoonsCount})</button>` : ''}
        <button class="tab-btn ${this.activeTab === 'energy' ? 'active' : ''}" data-tab="energy">${tr.tabEnergy}</button>
      </div>

      <!-- Tab Contents -->
      <div class="tab-content-container">
        ${this.renderTabContent(p)}
      </div>

      <!-- Educational Note according to Curriculum -->
      <div class="curriculum-box">
        <div class="curriculum-box-header">
          <span class="icon">📚</span>
          <strong>${tr.curriculumTitle} (${this.curriculumLevel.toUpperCase()})</strong>
        </div>
        <p class="curriculum-box-text">${curriculumText}</p>
      </div>
    `;

    this.attachEvents(p.id);
  }

  private renderMoon(m: MoonData): void {
    const isEn = getLanguage() === 'en';
    const tr = t();

    const typeLabel = isEn ? '🌕 Natural Satellite (Moon)' : '🌕 Satelit Alami (Bulan)';
    const primaryTitle = isEn ? m.englishName : m.indonesianName;
    const secondaryTitle = isEn ? `${m.indonesianName} (Moon of ${m.parentId})` : `${m.englishName} (Satelit ${m.parentId})`;
    const overviewText = isEn && m.overviewEn ? m.overviewEn : m.overview;
    const funFactText = isEn && m.funFactEn ? m.funFactEn : m.funFact;
    const curriculumNoteText = isEn && m.curriculumNoteEn ? m.curriculumNoteEn : m.curriculumNote;

    this.container.innerHTML = `
      <div class="panel-header">
        <div class="header-titles">
          <div class="header-badges">
            <span class="badge badge-type">${typeLabel}</span>
            <span class="badge badge-curriculum">${tr.levelPrefix}: ${this.curriculumLevel.toUpperCase()}</span>
          </div>
          <h2 class="planet-title">${primaryTitle}</h2>
          <span class="planet-subtitle">${secondaryTitle}</span>
        </div>
        <button class="btn-close" id="btn-close-info" title="Close Panel" aria-label="Close Panel">&times;</button>
      </div>

      <div class="panel-actions">
        <button class="btn-action" id="btn-focus" title="${tr.btnFocus}">
          <span class="action-icon">🎯</span> ${tr.btnFocus}
        </button>
        <button class="btn-action" id="btn-follow" title="${tr.btnFollow}">
          <span class="action-icon">🛰️</span> ${tr.btnFollow}
        </button>
      </div>

      <div class="tab-content-container">
        <div class="tab-pane active">
          <p class="overview-text">${overviewText}</p>
          <div class="data-grid">
            <div class="data-card">
              <span class="data-label">${tr.labelMass}</span>
              <span class="data-value">${UnitConverter.formatMass(m.mass, this.unitSystem)}</span>
            </div>
            <div class="data-card">
              <span class="data-label">${tr.labelRadius}</span>
              <span class="data-value">${UnitConverter.formatDistance(m.radius, this.unitSystem)}</span>
            </div>
            <div class="data-card">
              <span class="data-label">${tr.labelGravity}</span>
              <span class="data-value">${formatGravity(m.surfaceGravity)}</span>
            </div>
            <div class="data-card">
              <span class="data-label">${isEn ? 'Distance to Planet' : 'Jarak ke Induk'}</span>
              <span class="data-value">${UnitConverter.formatDistance(m.orbitalDistance, this.unitSystem)}</span>
            </div>
            <div class="data-card">
              <span class="data-label">${tr.labelOrbitalPeriod}</span>
              <span class="data-value">${UnitConverter.formatPeriod(m.orbitalPeriod, this.unitSystem)}</span>
            </div>
            <div class="data-card">
              <span class="data-label">Tidal Locking</span>
              <span class="data-value">${m.tidalLocked ? (isEn ? 'Yes (Tidally Locked)' : 'Ya (Terkunci Pasang Surut)') : (isEn ? 'No' : 'Tidak')}</span>
            </div>
          </div>

          <div class="funfact-box">
            <span class="funfact-icon">💡</span>
            <div>
              <strong>${tr.didYouKnowTitle}</strong>
              <p>${funFactText}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="curriculum-box">
        <div class="curriculum-box-header">
          <span class="icon">📚</span>
          <strong>${tr.curriculumTitle}</strong>
        </div>
        <p class="curriculum-box-text">${curriculumNoteText}</p>
      </div>
    `;

    this.attachEvents(m.id);
  }

  private renderTabContent(p: PlanetData): string {
    const isEn = getLanguage() === 'en';
    const tr = t();

    switch (this.activeTab) {
      case 'overview': {
        const overviewText = isEn && p.overviewEn ? p.overviewEn : p.overview;
        const facts = isEn && p.didYouKnowEn ? p.didYouKnowEn : p.didYouKnow;

        return `
          <div class="tab-pane active">
            <p class="overview-text">${overviewText}</p>
            <div class="data-grid">
              <div class="data-card">
                <span class="data-label">${isEn ? 'Mean Distance' : 'Jarak Rata-Rata'}</span>
                <span class="data-value">${p.meanDistance > 0 ? UnitConverter.formatDistance(p.meanDistance, this.unitSystem) : (isEn ? 'Solar Center' : 'Pusat Tata Surya')}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelOrbitalPeriod}</span>
                <span class="data-value">${p.orbitalPeriod > 0 ? UnitConverter.formatPeriod(p.orbitalPeriod, this.unitSystem) : 'N/A'}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelRotationPeriod}</span>
                <span class="data-value">${UnitConverter.formatPeriod(Math.abs(p.rotationPeriod), this.unitSystem)} ${p.rotationPeriod < 0 ? (isEn ? '(Retrograde)' : '(Retrograd)') : ''}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelGravity}</span>
                <span class="data-value">${formatGravity(p.surfaceGravity)}</span>
              </div>
            </div>

            <div class="funfact-box">
              <span class="funfact-icon">💡</span>
              <div>
                <strong>${tr.didYouKnowTitle}</strong>
                <ul class="fact-list">
                  ${facts.map(fact => `<li>${fact}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `;
      }

      case 'physical':
        return `
          <div class="tab-pane active">
            <div class="data-grid">
              <div class="data-card">
                <span class="data-label">${tr.labelMass}</span>
                <span class="data-value">${UnitConverter.formatMass(p.mass, this.unitSystem)}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelRadius}</span>
                <span class="data-value">${UnitConverter.formatDistance(p.radius, this.unitSystem)}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelDensity}</span>
                <span class="data-value">${formatNumberId(p.density, 0)} kg/m³</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelGravity}</span>
                <span class="data-value">${formatGravity(p.surfaceGravity)}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelEscapeVelocity}</span>
                <span class="data-value">${UnitConverter.formatVelocity(p.escapeVelocity, this.unitSystem)}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelAxialTilt}</span>
                <span class="data-value">${p.axialTilt.toFixed(2)}°</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelMeanTemp}</span>
                <span class="data-value">${formatTemperature(p.temperatureRange.min, p.temperatureRange.max, p.temperatureRange.mean)}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelHasRings}</span>
                <span class="data-value">${p.hasRings ? (isEn ? 'Yes (Prominent Rings)' : 'Memiliki Cincin') : (isEn ? 'None' : 'Tidak Ada')}</span>
              </div>
            </div>
          </div>
        `;

      case 'orbit':
        return `
          <div class="tab-pane active">
            <div class="data-grid">
              <div class="data-card">
                <span class="data-label">${tr.labelSemiMajorAxis}</span>
                <span class="data-value">${p.semiMajorAxis > 0 ? UnitConverter.formatDistance(p.semiMajorAxis, this.unitSystem) : 'N/A'}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelEccentricity}</span>
                <span class="data-value">${p.eccentricity.toFixed(4)} ${p.eccentricity < 0.02 ? (isEn ? '(Near Circular)' : '(Mendekati Lingkaran)') : (isEn ? '(Elliptical)' : '(Elips)')}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelOrbitalVelocity}</span>
                <span class="data-value">${UnitConverter.formatVelocity(p.orbitalVelocity, this.unitSystem)}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelOrbitalPeriod}</span>
                <span class="data-value">${p.orbitalPeriod > 0 ? UnitConverter.formatPeriod(p.orbitalPeriod, this.unitSystem) : 'N/A'}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelInclination}</span>
                <span class="data-value">${p.inclination.toFixed(2)}°</span>
              </div>
            </div>
          </div>
        `;

      case 'atmosphere':
        return `
          <div class="tab-pane active">
            <h4 class="section-title">${tr.atmosphereCompositionTitle}</h4>
            <div class="gas-bars">
              ${p.atmosphereComposition.map(gas => {
                const gasLabel = isEn && gas.nameEn ? gas.nameEn : gas.name;
                return `
                  <div class="gas-item">
                    <div class="gas-info">
                      <span class="gas-name">${gasLabel}</span>
                      <span class="gas-pct">${gas.percentage.toFixed(1)}%</span>
                    </div>
                    <div class="gas-bar-track">
                      <div class="gas-bar-fill" style="width: ${Math.min(100, Math.max(3, gas.percentage))}%;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;

      case 'moons':
        return `
          <div class="tab-pane active">
            <h4 class="section-title">${tr.moonsTitle}</h4>
            <div class="moons-list" id="moons-list-container">
              <!-- Dynamically populated -->
            </div>
          </div>
        `;

      case 'energy':
        return `
          <div class="tab-pane active">
            <div class="energy-meters">
              <div class="data-card highlight">
                <span class="data-label">${tr.labelKineticEnergy}</span>
                <span class="data-value" id="info-ke">${isEn ? 'Calculating...' : 'Menghitung...'}</span>
              </div>
              <div class="data-card highlight">
                <span class="data-label">${tr.labelPotentialEnergy}</span>
                <span class="data-value" id="info-pe">${isEn ? 'Calculating...' : 'Menghitung...'}</span>
              </div>
              <div class="data-card highlight">
                <span class="data-label">${tr.labelTotalEnergy}</span>
                <span class="data-value text-accent" id="info-tot-e">${isEn ? 'Calculating...' : 'Menghitung...'}</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelInstantSpeed}</span>
                <span class="data-value" id="info-live-speed">...</span>
              </div>
              <div class="data-card">
                <span class="data-label">${tr.labelInstantDistance}</span>
                <span class="data-value" id="info-live-dist">...</span>
              </div>
            </div>
            <p class="energy-note">${tr.energyConservationNote}</p>
          </div>
        `;
    }
  }

  private attachEvents(id: string): void {
    const isEn = getLanguage() === 'en';

    // Close button
    const closeBtn = this.container.querySelector('#btn-close-info');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    // Action buttons
    const focusBtn = this.container.querySelector('#btn-focus');
    if (focusBtn) {
      focusBtn.addEventListener('click', () => {
        if (this.onFocusClick) this.onFocusClick(id);
      });
    }

    const followBtn = this.container.querySelector('#btn-follow');
    if (followBtn) {
      followBtn.addEventListener('click', () => {
        if (this.onFollowClick) this.onFollowClick(id);
      });
    }

    const surfaceBtn = this.container.querySelector('#btn-surface');
    if (surfaceBtn) {
      surfaceBtn.addEventListener('click', () => {
        if (this.onViewSurfaceClick) this.onViewSurfaceClick(id);
      });
    }

    // Tabs
    const tabButtons = this.container.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as any;
        if (tab) {
          this.activeTab = tab;
          this.render();
        }
      });
    });

    // Populate moons list if active
    if (this.activeTab === 'moons' && this.currentPlanet) {
      const moonsContainer = this.container.querySelector('#moons-list-container');
      if (moonsContainer) {
        const moons = getMoonsByPlanetId(this.currentPlanet.id);
        if (moons.length === 0) {
          moonsContainer.innerHTML = `<p class="text-muted">${isEn ? 'This planet has other minor satellites not shown in the primary model.' : 'Planet ini memiliki satelit kecil lain yang tidak ditampilkan dalam model utama.'}</p>`;
        } else {
          moonsContainer.innerHTML = moons.map(m => `
            <button class="moon-item-btn" data-moon-id="${m.id}">
              <div class="moon-item-info">
                <strong>${isEn ? m.englishName : m.indonesianName}</strong>
                <span class="moon-sub">R: ${(m.radius / 1000).toLocaleString(isEn ? 'en-US' : 'id-ID')} km | T: ${(m.orbitalPeriod / 86400).toFixed(1)} ${isEn ? 'days' : 'hari'}</span>
              </div>
              <span class="action-arrow">➔</span>
            </button>
          `).join('');

          moonsContainer.querySelectorAll('.moon-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const mId = (e.currentTarget as HTMLElement).getAttribute('data-moon-id');
              if (mId && this.onSelectMoon) {
                this.onSelectMoon(mId);
              }
            });
          });
        }
      }
    }
  }
}
