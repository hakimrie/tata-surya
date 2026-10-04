import { describe, it, expect } from 'vitest';
import { PLANETS_DATA, getPlanetById } from '../src/data/planets';
import { MOONS_DATA, getMoonsByPlanetId } from '../src/data/moons';
import { INDONESIA_SPACE_ARTICLES, QUIZ_QUESTIONS } from '../src/data/indonesiaSpace';
import { setLanguage, getLanguage, t } from '../src/utils/i18n';

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
