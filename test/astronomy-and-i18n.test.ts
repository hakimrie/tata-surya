import { describe, it, expect } from 'vitest';
import { PLANETS_DATA, getPlanetById } from '../src/data/planets';
import { MOONS_DATA, getMoonsByPlanetId } from '../src/data/moons';
import { INDONESIA_SPACE_ARTICLES, QUIZ_QUESTIONS } from '../src/data/indonesiaSpace';
import { setLanguage, getLanguage, t } from '../src/utils/i18n';
import { COMETS_DATA, getCometById } from '../src/data/comets';
import { Comet } from '../src/components/Comet';
import { CONSTELLATIONS_DATA } from '../src/components/Constellations';
import { AtmosphereGlow } from '../src/effects/AtmosphereGlow';
import { EXPERIMENTS, getExperimentById } from '../src/data/experiments';

describe('Planetary Configuration Verification', () => {
  it('only Saturn has prominent rings enabled', () => {
    const ringPlanets = PLANETS_DATA.filter(p => p.hasRings);
    expect(ringPlanets.length).toBe(1);
    expect(ringPlanets[0].id).toBe('saturn');

    const jupiter = getPlanetById('jupiter');
    const uranus = getPlanetById('uranus');
    const neptune = getPlanetById('neptune');

    expect(jupiter?.hasRings).toBe(false);
    expect(uranus?.hasRings).toBe(false);
    expect(neptune?.hasRings).toBe(false);
  });

  it('preserves accurate sidereal rotation periods for outer planets', () => {
    const jupiter = getPlanetById('jupiter');
    const saturn = getPlanetById('saturn');
    const uranus = getPlanetById('uranus');
    const neptune = getPlanetById('neptune');

    // Jupiter rotation period ~ 9h 55m (~35,730s)
    expect(jupiter?.rotationPeriod).toBeCloseTo(35730, -2);
    // Saturn rotation period ~ 10h 33m (~38,360s)
    expect(saturn?.rotationPeriod).toBeCloseTo(38360, -2);
    // Uranus has retrograde rotation (negative value)
    expect(uranus?.rotationPeriod).toBeLessThan(0);
    // Neptune rotation period ~ 16h 6m (~57,996s)
    expect(neptune?.rotationPeriod).toBeCloseTo(57996, -2);
  });

  it('has bilingual educational content for all planets', () => {
    for (const p of PLANETS_DATA) {
      expect(p.name).toBeDefined();
      expect(p.englishName).toBeDefined();
      expect(p.indonesianName).toBeDefined();
      expect(p.overview).toBeDefined();
      expect(p.overviewEn).toBeDefined();
      expect(p.curriculumEn).toBeDefined();
      expect(p.curriculumEn?.sd).toBeDefined();
      expect(p.curriculumEn?.smp).toBeDefined();
      expect(p.curriculumEn?.sma).toBeDefined();
      expect(p.didYouKnowEn).toBeDefined();
      expect(p.didYouKnowEn?.length).toBeGreaterThan(0);
    }
  });

  it('has bilingual educational content for all moons', () => {
    for (const m of MOONS_DATA) {
      expect(m.name).toBeDefined();
      expect(m.englishName).toBeDefined();
      expect(m.indonesianName).toBeDefined();
      expect(m.overviewEn).toBeDefined();
      expect(m.funFactEn).toBeDefined();
      expect(m.curriculumNoteEn).toBeDefined();
    }
  });
});

describe('Internationalization (i18n) Engine', () => {
  it('switches between Indonesian and English seamlessly', () => {
    setLanguage('id');
    expect(getLanguage()).toBe('id');
    expect(t().appTitle).toBe('TATA SURYA 3D');
    expect(t().navSolar).toContain('Tata Surya');

    setLanguage('en');
    expect(getLanguage()).toBe('en');
    expect(t().appTitle).toBe('3D SOLAR SYSTEM');
    expect(t().navSolar).toContain('Solar System');

    // Clean up to Indonesian default
    setLanguage('id');
  });

  it('has complete translation coverage in both languages', () => {
    for (const lang of ['id', 'en'] as const) {
      setLanguage(lang);
      const dict = t();
      expect(dict.appTitle).toBeTruthy();
      expect(dict.appSubtitle).toBeTruthy();
      expect(dict.navAllExperiments).toBeTruthy();
      expect(dict.navAllExperimentsTitle).toBeTruthy();
      expect(dict.navSolar).toBeTruthy();
      expect(dict.navKepler).toBeTruthy();
      expect(dict.navExperiments).toBeTruthy();
      expect(dict.navIndonesia).toBeTruthy();
      expect(dict.navQuiz).toBeTruthy();
      expect(dict.playBtn).toBeTruthy();
      expect(dict.pauseBtn).toBeTruthy();
      expect(dict.scaleTitle).toBeTruthy();
      expect(dict.welcomeTitle).toBeTruthy();
    }
    setLanguage('id');
  });

  it('has bilingual Indonesian space articles and quiz questions', () => {
    expect(INDONESIA_SPACE_ARTICLES.palapa.titleEn).toBeDefined();
    expect(INDONESIA_SPACE_ARTICLES.palapa.contentEn).toBeDefined();
    expect(INDONESIA_SPACE_ARTICLES.bosscha.titleEn).toBeDefined();
    expect(INDONESIA_SPACE_ARTICLES.equatorialAdvantage.titleEn).toBeDefined();
    expect(INDONESIA_SPACE_ARTICLES.timau.titleEn).toBeDefined();

    for (const q of QUIZ_QUESTIONS) {
      expect(q.questionEn).toBeDefined();
      expect(q.optionsEn).toBeDefined();
      expect(q.optionsEn?.length).toBe(q.options.length);
      expect(q.explanationEn).toBeDefined();
    }
  });
});

describe('Asteroid Belt Proportions & Scaling', () => {
  it('ensures major asteroids are physically smaller than terrestrial planets', () => {
    // Mercury is the smallest terrestrial planet (radius ~2440 km)
    const mercury = getPlanetById('mercury')!;
    const earth = getPlanetById('earth')!;

    // Ceres radius is ~473 km (1/5 of Mercury, 1/13 of Earth)
    const ceresRadiusKm = 473;
    const vestaRadiusKm = 263;

    expect(ceresRadiusKm).toBeLessThan(mercury.radius / 1000);
    expect(vestaRadiusKm).toBeLessThan(ceresRadiusKm);
    expect(ceresRadiusKm).toBeLessThan(earth.radius / 1000);
  });
});

describe('Moon Orbit Scaling & Collision Prevention', () => {
  it('prevents Earth Moon from colliding with Venus in Visual Mode', async () => {
    const { SolarSystem } = await import('../src/components/SolarSystem');
    const solarSystem = new SolarSystem();

    const earthMoon = solarSystem.moons.get('moon')!;
    expect(earthMoon).toBeDefined();

    const earthPlanet = solarSystem.planets.get('earth')!;
    const venusPlanet = solarSystem.planets.get('venus')!;
    expect(earthPlanet).toBeDefined();
    expect(venusPlanet).toBeDefined();

    const moonOrbitR = solarSystem.computeMoonVisualOrbitRadius(earthMoon.data);
    const moonVisualR = solarSystem.computeMoonVisualRadius(earthMoon.data);
    const earthVisualR = earthPlanet.visualRadius;
    const venusVisualR = venusPlanet.visualRadius;

    // 1. Moon must orbit clearly outside Earth's surface
    expect(moonOrbitR).toBeGreaterThan(earthVisualR + moonVisualR);

    // 2. Distance between Earth and Venus orbit paths
    const distScale = solarSystem.scaleConfig.distanceScale;
    const earthVenusGap = (earthPlanet.data.semiMajorAxis - venusPlanet.data.semiMajorAxis) * distScale;

    // 3. Moon orbit radius must be strictly less than the gap to Venus
    expect(moonOrbitR).toBeLessThan(earthVenusGap);

    // 4. Moon and Venus surfaces must maintain a positive clearance at closest conjunction
    const clearanceToVenus = earthVenusGap - moonOrbitR - venusVisualR - moonVisualR;
    expect(clearanceToVenus).toBeGreaterThan(0.1);
  });

  it('maintains safe clearance even when moon orbit scale slider is set to maximum', async () => {
    const { SolarSystem } = await import('../src/components/SolarSystem');
    const solarSystem = new SolarSystem();
    const earthMoon = solarSystem.moons.get('moon')!;
    const earthPlanet = solarSystem.planets.get('earth')!;
    const venusPlanet = solarSystem.planets.get('venus')!;

    // Set custom mode with maximum moon orbit scale (54)
    solarSystem.setScaleMode('custom', {
      moonOrbitScale: 54
    });

    const moonOrbitR = solarSystem.computeMoonVisualOrbitRadius(earthMoon.data);
    const moonVisualR = solarSystem.computeMoonVisualRadius(earthMoon.data);
    const venusVisualR = venusPlanet.visualRadius;
    const distScale = solarSystem.scaleConfig.distanceScale;
    const earthVenusGap = (earthPlanet.data.semiMajorAxis - venusPlanet.data.semiMajorAxis) * distScale;

    // Planetary clearance guard must clamp orbit so clearance is still maintained
    const clearanceToVenus = earthVenusGap - moonOrbitR - venusVisualR - moonVisualR;
    expect(clearanceToVenus).toBeGreaterThan(0.1);
  });
});

describe('Cometary Orbital Dynamics & Scientific Accuracy', () => {
  it('loads periodic and long-period comets with realistic orbital elements', () => {
    expect(COMETS_DATA.length).toBeGreaterThanOrEqual(2);

    const halley = getCometById('halley');
    expect(halley).toBeDefined();
    // Halley has retrograde orbit (i > 90 deg)
    expect(halley?.inclinationDeg).toBeGreaterThan(90);
    expect(halley?.inclinationDeg).toBeCloseTo(162.26, 1);
    // Halley has high eccentricity e > 0.95
    expect(halley?.eccentricity).toBeGreaterThan(0.95);
    // Perihelion is inside Earth's orbit (~0.586 AU)
    expect(halley?.perihelionAU).toBeLessThan(1.0);

    const neowise = getCometById('neowise');
    expect(neowise).toBeDefined();
    // NEOWISE has extreme near-parabolic eccentricity e > 0.999
    expect(neowise?.eccentricity).toBeGreaterThan(0.999);
    // Swings very close to the Sun, inside Mercury's perihelion (~0.295 AU)
    expect(neowise?.perihelionAU).toBeLessThan(0.387);
  });

  it('provides bilingual educational overviews and fun facts for all comets', () => {
    for (const c of COMETS_DATA) {
      expect(c.name).toBeTruthy();
      expect(c.indonesianName).toBeTruthy();
      expect(c.englishName).toBeTruthy();
      expect(c.overview).toBeTruthy();
      expect(c.overviewEn).toBeTruthy();
      expect(c.funFact).toBeTruthy();
      expect(c.funFactEn).toBeTruthy();
      expect(c.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('instantiates 3D Comet with dual tail buffers and Keplerian solver', () => {
    const halleyData = getCometById('halley')!;
    const distanceScale = 1.0;
    const comet = new Comet(halleyData, distanceScale);

    expect(comet.group).toBeDefined();
    expect(comet.orbitLine).toBeDefined();
    expect(comet.ionTail).toBeDefined();
    expect(comet.dustTail).toBeDefined();

    // Verify static buffer geometries: Ion tail has 6 floats (2 points), dust tail has 60 floats (20 points)
    const ionPos = comet.ionTail.geometry.attributes.position;
    const dustPos = comet.dustTail.geometry.attributes.position;
    expect(ionPos.count).toBe(2);
    expect(dustPos.count).toBe(20);

    // Initial position should be finite
    expect(Number.isFinite(comet.group.position.x)).toBe(true);
    expect(Number.isFinite(comet.group.position.y)).toBe(true);
    expect(Number.isFinite(comet.group.position.z)).toBe(true);

    const initialM = comet.meanAnomaly;

    // When paused, mean anomaly does not advance
    comet.update(0.016, true, 0);
    expect(comet.meanAnomaly).toBe(initialM);

    // When running with simulation time, mean anomaly advances smoothly
    comet.update(0.016, false, 86400); // 1 sim day
    expect(comet.meanAnomaly).toBeGreaterThan(initialM);

    // Position updates smoothly without NaN
    expect(Number.isFinite(comet.group.position.x)).toBe(true);
    expect(Number.isFinite(comet.group.position.y)).toBe(true);
    expect(Number.isFinite(comet.group.position.z)).toBe(true);
  });
});

describe('Celestial Constellations & Nusantara Maritime Navigation', () => {
  it('includes Western constellations and Indonesian indigenous asterisms', () => {
    const ids = CONSTELLATIONS_DATA.map(c => c.id);
    expect(ids).toContain('crux');
    expect(ids).toContain('orion');
    expect(ids).toContain('ursa-major');
    expect(ids).toContain('cassiopeia');
    expect(ids).toContain('scorpius');
    expect(ids).toContain('cygnus');

    const crux = CONSTELLATIONS_DATA.find(c => c.id === 'crux');
    expect(crux?.indigenousName).toBe('Bintang Pari / Gubuk Penceng');
    expect(crux?.indigenousDescription).toContain('Selatan');

    const orion = CONSTELLATIONS_DATA.find(c => c.id === 'orion');
    expect(orion?.indigenousName).toBe('Bintang Waluku / Bajak');
    expect(orion?.indigenousDescription).toContain('tanam padi');
  });

  it('has valid star coordinates and line vertex indices for each constellation', () => {
    for (const c of CONSTELLATIONS_DATA) {
      expect(c.stars.length).toBeGreaterThan(0);
      expect(c.lines.length).toBeGreaterThan(0);

      // Verify all lines connect valid star indices
      for (const [s1, s2] of c.lines) {
        expect(s1).toBeGreaterThanOrEqual(0);
        expect(s1).toBeLessThan(c.stars.length);
        expect(s2).toBeGreaterThanOrEqual(0);
        expect(s2).toBeLessThan(c.stars.length);
      }
    }
  });
});

describe('Atmosphere Limb Glow Rayleigh Presets', () => {
  it('defines physically-scaled atmosphere presets for major planets', () => {
    const presets = AtmosphereGlow.PRESETS;
    expect(presets.earth).toBeDefined();
    expect(presets.venus).toBeDefined();
    expect(presets.mars).toBeDefined();
    expect(presets.titan).toBeDefined();

    for (const [, preset] of Object.entries(presets)) {
      expect(preset.coefficient).toBeGreaterThan(1.0);
      expect(preset.coefficient).toBeLessThan(1.25);
      expect(preset.power).toBeGreaterThan(0);
      expect(preset.intensity).toBeGreaterThan(0);
      expect(preset.color).toBeDefined();
    }
  });
});

describe('Rogue Black Hole Relativistic Encounter Experiment', () => {
  it('registers Experiment 9 with complete interactive parameters', () => {
    const exp = getExperimentById('black-hole-encounter');
    expect(exp).toBeDefined();
    expect(exp?.title).toContain('Lubang Hitam');
    expect(exp?.titleEn).toContain('Black Hole');
    expect(exp?.predictionQuestion.question).toBeTruthy();
    expect(exp?.predictionQuestion.options.some(o => o.isCorrect)).toBe(true);

    const sliderIds = exp?.sliders.map(s => s.id);
    expect(sliderIds).toContain('blackHoleMass');
    expect(sliderIds).toContain('encounterDist');
    expect(sliderIds).toContain('flybySpeed');

    // Mass range allows simulating stellar black holes
    const massSlider = exp?.sliders.find(s => s.id === 'blackHoleMass')!;
    expect(massSlider.min).toBeLessThanOrEqual(3.0);
    expect(massSlider.max).toBeGreaterThanOrEqual(5.0);
  });
});

describe('Advanced Experience UI Internationalization Keys', () => {
  it('has localized translation keys for Cinematic Tour, Scale Theater, Comets, Constellations, and Audio', () => {
    for (const lang of ['id', 'en'] as const) {
      setLanguage(lang);
      const dict = t();
      expect(dict.navTour).toBeTruthy();
      expect(dict.navScaleTheater).toBeTruthy();
      expect(dict.btnSnapshot).toBeTruthy();
      expect(dict.btnAudio).toBeTruthy();
      expect(dict.toggleConstellations).toBeTruthy();
      expect(dict.toggleComets).toBeTruthy();
      expect(dict.toggleSpacecraft).toBeTruthy();
      expect(dict.toggleSkyDomeView).toBeTruthy();
    }
    setLanguage('id');
  });
});
