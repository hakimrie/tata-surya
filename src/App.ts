import * as THREE from 'three';
import { SolarSystemScene } from './scenes/SolarSystemScene';
import { GravityEngine } from './physics/GravityEngine';
import { Body } from './physics/Body';
import { Vector3 as PhysVector3 } from './physics/Vector3';
import { PLANETS_DATA, getPlanetById, CurriculumLevel } from './data/planets';
import { MOONS_DATA, getMoonById } from './data/moons';
import { OrbitalMechanics } from './physics/OrbitalMechanics';
import { UnitSystem } from './utils/units';
import { SOLAR_MASS, G, AU, EARTH_MASS, EARTH_RADIUS } from './utils/constants';
import { t, getLanguage, setLanguage, Language } from './utils/i18n';

import { InfoPanel } from './components/InfoPanel';
import { SimulationControls } from './components/SimulationControls';
import { ScaleControls } from './components/ScaleControls';
import { KeplerLab } from './components/KeplerLab';
import { ExperimentPanel } from './components/ExperimentPanel';
import { IndonesiaSpacePanel } from './components/IndonesiaSpacePanel';
import { SearchExplorer, SearchResult } from './components/SearchExplorer';
import { WelcomeModal } from './components/WelcomeModal';

export class App {
  private container: HTMLElement;
  private scene: SolarSystemScene;
  private engine: GravityEngine;
  private initialPhysicsSnapshot: Body[] = [];

  // UI Components
  private infoPanel: InfoPanel;
  private simControls: SimulationControls;
  private scaleControls: ScaleControls;
  private keplerLab: KeplerLab;
  private experimentPanel: ExperimentPanel;
  private indonesiaPanel: IndonesiaSpacePanel;
  private searchExplorer: SearchExplorer;
  private welcomeModal: WelcomeModal;

  // Global Settings
  private curriculumLevel: CurriculumLevel = 'smp';
  private unitSystem: UnitSystem = 'student';

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Create 3D Scene
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';
    this.container.appendChild(canvasContainer);
    this.scene = new SolarSystemScene(canvasContainer);

    // 2. Initialize Pure Physics Engine
    this.engine = new GravityEngine();
    this.initPhysicsBodies();
    this.initialPhysicsSnapshot = this.engine.snapshot();

    // 3. Initialize UI Components
    this.infoPanel = new InfoPanel();
    this.simControls = new SimulationControls();
    this.scaleControls = new ScaleControls();
    this.keplerLab = new KeplerLab();
    this.experimentPanel = new ExperimentPanel();
    this.indonesiaPanel = new IndonesiaSpacePanel();
    this.searchExplorer = new SearchExplorer();
    this.welcomeModal = new WelcomeModal();

    this.buildHeaderUI();
    this.buildViewTogglesUI();

    // Append panels to container
    this.container.appendChild(this.scaleControls.warningBanner);
    this.container.appendChild(this.scaleControls.container);
    this.container.appendChild(this.simControls.container);
    this.container.appendChild(this.infoPanel.container);
    this.container.appendChild(this.keplerLab.container);
    this.container.appendChild(this.experimentPanel.container);
    this.container.appendChild(this.indonesiaPanel.container);
    this.container.appendChild(this.welcomeModal.container);

    this.wireEvents();

    // Set initial language texts
    this.switchLanguage(getLanguage());

    // 4. Start Render & Simulation Loop
    this.startLoop();

    // 5. Check URL parameter ?focus=planetId
    try {
      const params = new URLSearchParams(window.location.search);
      const focusTarget = params.get('focus') || window.location.hash.replace('#', '');
      if (focusTarget) {
        setTimeout(() => {
          this.scene.focusOn(focusTarget);
          const p = getPlanetById(focusTarget);
          if (p) this.infoPanel.showPlanet(p, this.curriculumLevel, this.unitSystem);
        }, 150);
      } else if (!localStorage.getItem('tata_surya_visited')) {
        this.welcomeModal.show();
      }
    } catch {
      // ignore
    }
  }

  /**
   * Set up initial physical bodies with scientifically realistic positions & velocities
   */
  private initPhysicsBodies(): void {
    this.engine.clear();

    // 1. Sun at Origin
    const sunData = PLANETS_DATA.find(p => p.id === 'sun')!;
    const sunBody = new Body({
      id: 'sun',
      name: sunData.name,
      indonesianName: sunData.indonesianName,
      type: 'star',
      mass: sunData.mass,
      radius: sunData.radius,
      position: new PhysVector3(0, 0, 0),
      velocity: new PhysVector3(0, 0, 0),
      fixed: true, // Anchor Sun at origin
      color: sunData.color
    });
    this.engine.addBody(sunBody);

    // 2. Planets orbiting Sun
    for (const p of PLANETS_DATA) {
      if (p.type === 'star') continue;

      const r = p.semiMajorAxis;
      // Ideal circular/mean orbital velocity: v = sqrt(GM/r)
      const v = OrbitalMechanics.circularVelocity(SOLAR_MASS, r);

      // Start on +X axis, moving in +Z direction
      const planetBody = new Body({
        id: p.id,
        name: p.name,
        indonesianName: p.indonesianName,
        type: p.type === 'dwarf' ? 'asteroid' : 'planet',
        mass: p.mass,
        radius: p.radius,
        position: new PhysVector3(r, 0, 0),
        velocity: new PhysVector3(0, 0, v),
        color: p.color
      });
      this.engine.addBody(planetBody);
    }

    // 3. Moons orbiting their parent planet
    for (const m of MOONS_DATA) {
      const parentBody = this.engine.getBody(m.parentId);
      if (!parentBody) continue;

      const rMoon = m.orbitalDistance;
      const vRelMoon = OrbitalMechanics.circularVelocity(parentBody.mass, rMoon);

      // Position relative to parent planet
      const moonBody = new Body({
        id: m.id,
        name: m.name,
        indonesianName: m.indonesianName,
        type: 'moon',
        parentId: m.parentId,
        mass: m.mass,
        radius: m.radius,
        position: new PhysVector3(parentBody.position.x + rMoon, 0, 0),
        velocity: new PhysVector3(0, 0, parentBody.velocity.z + (m.orbitalPeriod < 0 ? -vRelMoon : vRelMoon)),
        color: m.color
      });
      this.engine.addBody(moonBody);
    }
  }

  /**
   * Build Top Navigation Header
   */
  private buildHeaderUI(): void {
    const tr = t();
    const isEn = getLanguage() === 'en';

    const header = document.createElement('header');
    header.id = 'app-header';
    header.className = 'glass-panel';

    header.innerHTML = `
      <div class="header-brand" id="btn-brand-home" title="${isEn ? 'Return to Solar System' : 'Kembali ke Tata Surya'}">
        <span class="brand-icon">🌞</span>
        <div>
          <h1 class="brand-title">${tr.appTitle}</h1>
          <span class="brand-subtitle">${tr.appSubtitle}</span>
        </div>
      </div>

      <!-- App Mode Navigation -->
      <nav class="header-nav" role="navigation">
        <button class="nav-btn active" id="nav-solar" title="${tr.navSolar}">
          ${tr.navSolar}
        </button>
        <button class="nav-btn" id="nav-kepler" title="${tr.navKepler}">
          ${tr.navKepler}
        </button>
        <button class="nav-btn" id="nav-exp" title="${tr.navExperiments}">
          ${tr.navExperiments}
        </button>
        <button class="nav-btn" id="nav-id" title="${tr.navIndonesia}">
          ${tr.navIndonesia}
        </button>
        <button class="nav-btn" id="nav-quiz" title="${tr.navQuiz}">
          ${tr.navQuiz}
        </button>
      </nav>

      <!-- Global Settings & Level Switcher -->
      <div class="header-settings">
        <!-- Language Switcher -->
        <div class="lang-switch-wrapper" title="Ganti Bahasa / Switch Language">
          <button class="lang-toggle-btn ${!isEn ? 'active' : ''}" id="btn-lang-id" data-lang="id">
            🇮🇩 ID
          </button>
          <button class="lang-toggle-btn ${isEn ? 'active' : ''}" id="btn-lang-en" data-lang="en">
            🇬🇧 EN
          </button>
        </div>

        <!-- Curriculum Level Selector -->
        <select id="select-curriculum-level" class="custom-select" title="${tr.levelPrefix}">
          <option value="sd">${tr.levelPrefix}: SD</option>
          <option value="smp" selected>${tr.levelPrefix}: SMP</option>
          <option value="sma">${tr.levelPrefix}: SMA / Univ</option>
        </select>

        <!-- Unit System Selector -->
        <select id="select-unit-system" class="custom-select" title="${tr.unitPrefix}">
          <option value="student" selected>${isEn ? 'Units: Student (km, days)' : 'Satuan: Siswa (km, hari)'}</option>
          <option value="astronomical">${isEn ? 'Units: Astronomical (AU, yr)' : 'Satuan: Astronomi (AU, thn)'}</option>
          <option value="si">${isEn ? 'Units: SI Standard (m, s, kg)' : 'Satuan: Standar SI (m, s, kg)'}</option>
        </select>

        <button class="nav-btn" id="btn-help-guide" title="${tr.navGuide}">
          ${tr.navGuide}
        </button>
      </div>
    `;

    // Append Search explorer into header between brand and nav
    const brandEl = header.querySelector('.header-brand');
    if (brandEl && brandEl.nextSibling) {
      header.insertBefore(this.searchExplorer.container, brandEl.nextSibling);
    }

    this.container.appendChild(header);
  }

  /**
   * Build View Toggles Bar (Bottom Right)
   */
  private buildViewTogglesUI(): void {
    const tr = t();

    const viewToggles = document.createElement('div');
    viewToggles.className = 'view-toggles glass-panel';
    viewToggles.setAttribute('aria-label', 'Opsi Tampilan Visual');

    viewToggles.innerHTML = `
      <label class="toggle-item">
        <input type="checkbox" id="toggle-orbits" checked>
        <span id="label-toggle-orbits">${tr.toggleOrbits}</span>
      </label>
      <label class="toggle-item">
        <input type="checkbox" id="toggle-asteroids" checked>
        <span id="label-toggle-asteroids">${tr.toggleAsteroids}</span>
      </label>
      <label class="toggle-item">
        <input type="checkbox" id="toggle-gravity-field">
        <span id="label-toggle-gravity">${tr.toggleGravityField}</span>
      </label>
      <label class="toggle-item">
        <button class="btn-ctrl" id="btn-camera-top" style="padding: 2px 6px; font-size: 10px; width: 100%;">
          ${tr.toggleTopView}
        </button>
      </label>
    `;

    this.container.appendChild(viewToggles);

    // Attach toggle listeners
    const orbitCb = viewToggles.querySelector('#toggle-orbits') as HTMLInputElement;
    const astCb = viewToggles.querySelector('#toggle-asteroids') as HTMLInputElement;
    const gravCb = viewToggles.querySelector('#toggle-gravity-field') as HTMLInputElement;
    const topBtn = viewToggles.querySelector('#btn-camera-top');

    if (orbitCb) {
      orbitCb.addEventListener('change', () => {
        this.scene.solarSystem.setOrbitLinesVisible(orbitCb.checked);
      });
    }

    if (astCb) {
      astCb.addEventListener('change', () => {
        this.scene.solarSystem.asteroidBeltGroup.visible = astCb.checked;
      });
    }

    if (gravCb) {
      gravCb.addEventListener('change', () => {
        this.scene.solarSystem.gravityFieldGroup.visible = gravCb.checked;
      });
    }

    if (topBtn) {
      topBtn.addEventListener('click', () => {
        this.scene.cameraController.setEclipticTopView();
      });
    }
  }

  /**
   * Switch Language (Bahasa Indonesia <-> English)
   */
  public switchLanguage(lang: Language): void {
    setLanguage(lang);
    const tr = t();
    const isEn = lang === 'en';

    document.documentElement.lang = lang;
    document.title = isEn
      ? '3D Solar System & Educational Gravity Sandbox'
      : 'Tata Surya 3D & Gravity Sandbox Edukasi';

    // Update Brand
    const brandTitle = document.querySelector('.brand-title');
    const brandSub = document.querySelector('.brand-subtitle');
    if (brandTitle) brandTitle.textContent = tr.appTitle;
    if (brandSub) brandSub.textContent = tr.appSubtitle;

    // Update Nav Buttons
    const navSolar = document.querySelector('#nav-solar');
    const navKepler = document.querySelector('#nav-kepler');
    const navExp = document.querySelector('#nav-exp');
    const navId = document.querySelector('#nav-id');
    const navQuiz = document.querySelector('#nav-quiz');
    const helpBtn = document.querySelector('#btn-help-guide');

    if (navSolar) navSolar.textContent = tr.navSolar;
    if (navKepler) navKepler.textContent = tr.navKepler;
    if (navExp) navExp.textContent = tr.navExperiments;
    if (navId) navId.textContent = tr.navIndonesia;
    if (navQuiz) navQuiz.textContent = tr.navQuiz;
    if (helpBtn) helpBtn.textContent = tr.navGuide;

    // Update Select Dropdowns
    const levelSelect = document.querySelector('#select-curriculum-level') as HTMLSelectElement;
    if (levelSelect) {
      levelSelect.options[0].text = `${tr.levelPrefix}: SD`;
      levelSelect.options[1].text = `${tr.levelPrefix}: SMP`;
      levelSelect.options[2].text = `${tr.levelPrefix}: SMA / Univ`;
    }

    const unitSelect = document.querySelector('#select-unit-system') as HTMLSelectElement;
    if (unitSelect) {
      unitSelect.options[0].text = isEn ? 'Units: Student (km, days)' : 'Satuan: Siswa (km, hari)';
      unitSelect.options[1].text = isEn ? 'Units: Astronomical (AU, yr)' : 'Satuan: Astronomi (AU, thn)';
      unitSelect.options[2].text = isEn ? 'Units: SI Standard (m, s, kg)' : 'Satuan: Standar SI (m, s, kg)';
    }

    // Update Lang Switch Active States
    document.querySelector('#btn-lang-id')?.classList.toggle('active', !isEn);
    document.querySelector('#btn-lang-en')?.classList.toggle('active', isEn);

    // Update View Toggles
    const orbitSpan = document.querySelector('#label-toggle-orbits');
    const astSpan = document.querySelector('#label-toggle-asteroids');
    const gravSpan = document.querySelector('#label-toggle-gravity');
    const topBtn = document.querySelector('#btn-camera-top');
    if (orbitSpan) orbitSpan.textContent = tr.toggleOrbits;
    if (astSpan) astSpan.textContent = tr.toggleAsteroids;
    if (gravSpan) gravSpan.textContent = tr.toggleGravityField;
    if (topBtn) topBtn.textContent = tr.toggleTopView;

    // Refresh UI Components
    this.infoPanel.refreshLanguage();
    this.keplerLab.refreshLanguage();
    this.experimentPanel.refreshLanguage();
    this.indonesiaPanel.refreshLanguage();
    this.simControls.refreshLanguage();
    this.scaleControls.refreshLanguage();
    this.welcomeModal.refreshLanguage();
    this.searchExplorer.refreshLanguage();
  }

  /**
   * Connect all component events and callbacks
   */
  private wireEvents(): void {
    // 0. Language Switcher Buttons
    const btnLangId = document.querySelector('#btn-lang-id');
    const btnLangEn = document.querySelector('#btn-lang-en');
    if (btnLangId) {
      btnLangId.addEventListener('click', () => this.switchLanguage('id'));
    }
    if (btnLangEn) {
      btnLangEn.addEventListener('click', () => this.switchLanguage('en'));
    }

    // 1. Scene Object Click
    this.scene.onSelectObject = (id, type) => {
      // Auto-zoom smoothly and frame the selected body in full detail!
      this.scene.focusOn(id);

      if (type === 'planet') {
        const planet = getPlanetById(id);
        if (planet) {
          this.infoPanel.showPlanet(planet, this.curriculumLevel, this.unitSystem);
        }
      } else if (type === 'moon') {
        const moon = getMoonById(id);
        if (moon) {
          this.infoPanel.showMoon(moon, this.curriculumLevel, this.unitSystem);
        }
      }
    };

    // 2. Info Panel Actions
    this.infoPanel.onFocusClick = (id) => {
      this.scene.focusOn(id);
    };
    this.infoPanel.onFollowClick = (id) => {
      this.scene.follow(id);
    };
    this.infoPanel.onViewSurfaceClick = (id) => {
      this.scene.viewFromSurface(id);
    };
    this.infoPanel.onSelectMoon = (moonId) => {
      const moon = getMoonById(moonId);
      if (moon) {
        this.infoPanel.showMoon(moon, this.curriculumLevel, this.unitSystem);
        this.scene.focusOn(moonId);
      }
    };
    this.infoPanel.onClose = () => {
      // Keep tracking and sunlight active when closing panel to admire the celestial view
    };

    // 3. Simulation Controls
    this.simControls.onPlayPauseToggle = (isPaused) => {
      // simulation state updated
    };
    this.simControls.onResetSimulation = () => {
      this.engine.restore(this.initialPhysicsSnapshot);
      this.scene.cameraController.resetCamera(true);
      this.scene.disableFocusedLight();
      this.scene.solarSystem.selectBody(null);
    };
    this.simControls.onStepSimulation = (seconds) => {
      this.engine.update(seconds);
      this.simControls.advanceTime(seconds);
      this.scene.solarSystem.syncWithPhysics(this.engine, 0.016, false);
    };

    // 4. Scale Controls
    this.scaleControls.onScaleChange = (mode, customConfig) => {
      this.scene.solarSystem.setScaleMode(mode, customConfig);
    };

    // 5. Header Navigation
    const navSolar = document.querySelector('#nav-solar');
    const navKepler = document.querySelector('#nav-kepler');
    const navExp = document.querySelector('#nav-exp');
    const navId = document.querySelector('#nav-id');
    const navQuiz = document.querySelector('#nav-quiz');
    const brandHome = document.querySelector('#btn-brand-home');
    const helpBtn = document.querySelector('#btn-help-guide');

    const updateNavActive = (activeBtn: Element | null) => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      if (activeBtn) activeBtn.classList.add('active');
    };

    if (navSolar) {
      navSolar.addEventListener('click', () => {
        this.keplerLab.hide();
        this.experimentPanel.hide();
        this.indonesiaPanel.hide();
        updateNavActive(navSolar);
      });
    }

    if (brandHome) {
      brandHome.addEventListener('click', () => {
        this.keplerLab.hide();
        this.experimentPanel.hide();
        this.indonesiaPanel.hide();
        this.scene.cameraController.resetCamera(true);
        this.scene.disableFocusedLight();
        this.scene.solarSystem.selectBody(null);
        updateNavActive(navSolar);
      });
    }

    if (navKepler) {
      navKepler.addEventListener('click', () => {
        this.experimentPanel.hide();
        this.indonesiaPanel.hide();
        this.keplerLab.show();
        updateNavActive(navKepler);
      });
    }

    if (navExp) {
      navExp.addEventListener('click', () => {
        this.keplerLab.hide();
        this.indonesiaPanel.hide();
        this.experimentPanel.show();
        updateNavActive(navExp);
      });
    }

    if (navId) {
      navId.addEventListener('click', () => {
        this.keplerLab.hide();
        this.experimentPanel.hide();
        this.indonesiaPanel.show('palapa');
        updateNavActive(navId);
      });
    }

    if (navQuiz) {
      navQuiz.addEventListener('click', () => {
        this.keplerLab.hide();
        this.experimentPanel.hide();
        this.indonesiaPanel.show('quiz');
        updateNavActive(navQuiz);
      });
    }

    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.welcomeModal.show();
      });
    }

    // 6. Level Switcher
    const levelSelect = document.querySelector('#select-curriculum-level') as HTMLSelectElement;
    if (levelSelect) {
      levelSelect.addEventListener('change', () => {
        this.curriculumLevel = levelSelect.value as CurriculumLevel;
        this.infoPanel.setCurriculumLevel(this.curriculumLevel);
        this.indonesiaPanel.setCurriculumLevel(this.curriculumLevel);
      });
    }

    // 7. Unit Switcher
    const unitSelect = document.querySelector('#select-unit-system') as HTMLSelectElement;
    if (unitSelect) {
      unitSelect.addEventListener('change', () => {
        this.unitSystem = unitSelect.value as UnitSystem;
        this.infoPanel.setUnitSystem(this.unitSystem);
      });
    }

    // 8. Search Explorer Selection
    this.searchExplorer.onSelectResult = (res: SearchResult) => {
      if (res.type === 'planet') {
        const planet = getPlanetById(res.id);
        if (planet) {
          this.infoPanel.showPlanet(planet, this.curriculumLevel, this.unitSystem);
          this.scene.focusOn(res.id);
        }
      } else if (res.type === 'moon') {
        const moon = getMoonById(res.id);
        if (moon) {
          this.infoPanel.showMoon(moon, this.curriculumLevel, this.unitSystem);
          this.scene.focusOn(res.id);
        }
      } else if (res.type === 'experiment') {
        this.experimentPanel.show(res.id);
        updateNavActive(navExp);
      } else if (res.type === 'indonesia') {
        this.indonesiaPanel.show(res.id as any);
        updateNavActive(navId);
      } else if (res.type === 'concept') {
        this.keplerLab.show();
        updateNavActive(navKepler);
      }
    };

    // 9. Experiment Runner Callback
    this.experimentPanel.onRunExperiment = (expId, params) => {
      this.handleExperimentRun(expId, params);
    };

    this.experimentPanel.onResetExperiment = () => {
      this.engine.restore(this.initialPhysicsSnapshot);
    };

    // 10. Add Sandbox Body
    this.experimentPanel.onAddSandboxBody = (body) => {
      this.engine.addBody(body);
    };

    // 11. Welcome Modal Start
    this.welcomeModal.onStart = (level) => {
      this.curriculumLevel = level;
      if (levelSelect) levelSelect.value = level;
      this.infoPanel.setCurriculumLevel(level);
      this.indonesiaPanel.setCurriculumLevel(level);
    };

    // 12. Numerical Instability Watchdog
    this.engine.onInstability = (msg) => {
      const isEn = getLanguage() === 'en';
      const stabilityBadge = document.querySelector('#sim-stability-badge');
      if (stabilityBadge) {
        stabilityBadge.className = 'sim-status-badge unstable';
        stabilityBadge.textContent = isEn ? '⚠️ Instability Detected' : '⚠️ Instabilitas Terdeteksi';
        stabilityBadge.setAttribute('title', msg);
      }
      alert(msg);
    };
  }

  /**
   * Handle specific guided experiment physics parameters
   */
  private handleExperimentRun(expId: string, params: Record<string, number>): void {
    if (expId === 'change-earth-mass') {
      const multiplier = params.massMultiplier ?? 1.0;
      const earth = this.engine.getBody('earth');
      if (earth) {
        earth.mass = EARTH_MASS * multiplier;
      }
      this.scene.focusOn('earth');
    } else if (expId === 'satellite-orbit') {
      const vKms = params.velocity ?? 7.6;
      const altKm = params.altitude ?? 500;
      const r = (EARTH_RADIUS + altKm * 1000);
      const v = vKms * 1000;

      const earth = this.engine.getBody('earth');
      const earthPos = earth ? earth.position : new PhysVector3(AU, 0, 0);

      // Create test satellite
      const sat = new Body({
        id: `sat-${Date.now()}`,
        name: 'Test Satellite',
        indonesianName: 'Satelit Palapa Eksperimen',
        type: 'spacecraft',
        mass: 1000,
        radius: 100,
        position: new PhysVector3(earthPos.x + r, 0, 0),
        velocity: new PhysVector3(0, 0, (earth ? earth.velocity.z : 29780) + v),
        color: '#00f0ff'
      });
      this.engine.addBody(sat);
      this.scene.focusOn('earth');
    } else if (expId === 'escape-velocity') {
      const vLaunch = (params.launchSpeed ?? 11.2) * 1000;
      const earth = this.engine.getBody('earth');
      const earthPos = earth ? earth.position : new PhysVector3(AU, 0, 0);

      const probe = new Body({
        id: `probe-${Date.now()}`,
        name: 'Escape Probe',
        indonesianName: 'Wahana Antariksa Lepas',
        type: 'spacecraft',
        mass: 800,
        radius: 80,
        position: new PhysVector3(earthPos.x + EARTH_RADIUS * 1.05, 0, 0),
        velocity: new PhysVector3(vLaunch, 0, (earth ? earth.velocity.z : 29780)),
        color: '#ffaa00'
      });
      this.engine.addBody(probe);
      this.scene.focusOn('earth');
    } else if (expId === 'asteroid-slingshot') {
      const distAU = params.startDistance ?? 4.5;
      const speedMs = (params.asteroidSpeed ?? 15.0) * 1000;
      const angleRad = ((params.launchAngle ?? 45) * Math.PI) / 180;

      const ast = new Body({
        id: `asteroid-${Date.now()}`,
        name: 'Incoming Asteroid',
        indonesianName: 'Asteroid Eksperimen',
        type: 'asteroid',
        mass: 1e15,
        radius: 2000,
        position: new PhysVector3(distAU * AU, 0, 0),
        velocity: new PhysVector3(-Math.cos(angleRad) * speedMs, 0, Math.sin(angleRad) * speedMs),
        color: '#ff6b6b'
      });
      this.engine.addBody(ast);
    }
  }

  /**
   * Main simulation and animation render loop
   */
  private startLoop(): void {
    this.scene.start((deltaRealSec) => {
      if (!this.simControls.isPaused) {
        // Advance simulated time
        const deltaSimSeconds = deltaRealSec * this.simControls.simulationSpeed;

        // 1. Advance RK4 Gravitational Physics
        this.engine.update(deltaSimSeconds);

        // 2. Advance Timeline Clock Display
        this.simControls.advanceTime(deltaSimSeconds);

        // 3. Synchronize 3D visuals
        this.scene.solarSystem.syncWithPhysics(this.engine, deltaRealSec, false);

        // 4. Update live energy readouts if info panel is open
        const selectedId = this.scene.solarSystem.getSelectedBodyId();
        if (selectedId) {
          const body = this.engine.getBody(selectedId);
          if (body) {
            this.infoPanel.updateEnergyReadout(body, SOLAR_MASS);
          }
        }
      } else {
        // When paused, still update selection ring animation & gentle visual idle
        this.scene.solarSystem.syncWithPhysics(this.engine, deltaRealSec, true);
      }
    });
  }
}
