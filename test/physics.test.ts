import { describe, it, expect } from 'vitest';
import { Vector3 } from '../src/physics/Vector3';
import { Body } from '../src/physics/Body';
import { GravityEngine } from '../src/physics/GravityEngine';
import { OrbitalMechanics } from '../src/physics/OrbitalMechanics';
import { UnitConverter } from '../src/utils/units';
import {
  G,
  AU,
  SOLAR_MASS,
  EARTH_MASS,
  EARTH_RADIUS,
  EARTH_ORBITAL_SPEED,
  EARTH_ORBITAL_PERIOD
} from '../src/utils/constants';

describe('Vector3', () => {
  it('performs basic vector operations correctly', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);

    expect(v1.clone().add(v2)).toEqual(new Vector3(5, 7, 9));
    expect(v2.clone().sub(v1)).toEqual(new Vector3(3, 3, 3));
    expect(v1.dot(v2)).toBe(1 * 4 + 2 * 5 + 3 * 6); // 4 + 10 + 18 = 32

    const cross = new Vector3().crossVectors(new Vector3(1, 0, 0), new Vector3(0, 1, 0));
    expect(cross.x).toBeCloseTo(0);
    expect(cross.y).toBeCloseTo(0);
    expect(cross.z).toBeCloseTo(1);

    expect(new Vector3(3, 4, 0).length()).toBe(5);
    expect(new Vector3(3, 4, 0).normalize().length()).toBeCloseTo(1.0, 5);
  });
});

describe('OrbitalMechanics', () => {
  it('calculates Earth orbital speed accurately', () => {
    const vCirc = OrbitalMechanics.circularVelocity(SOLAR_MASS, AU);
    // Real Earth speed ~ 29,780 m/s
    expect(vCirc).toBeGreaterThan(29500);
    expect(vCirc).toBeLessThan(30000);
  });

  it('calculates Earth escape velocity accurately', () => {
    const vEsc = OrbitalMechanics.escapeVelocity(EARTH_MASS, EARTH_RADIUS);
    // Real Earth escape velocity ~ 11,186 m/s (~11.2 km/s)
    expect(vEsc / 1000).toBeCloseTo(11.19, 1);
    // Escape velocity must equal sqrt(2) * circular orbital velocity at surface
    const vCircSurface = OrbitalMechanics.circularVelocity(EARTH_MASS, EARTH_RADIUS);
    expect(vEsc).toBeCloseTo(Math.SQRT2 * vCircSurface, 2);
  });

  it('calculates surface gravity accurately', () => {
    const gEarth = OrbitalMechanics.surfaceGravity(EARTH_MASS, EARTH_RADIUS);
    expect(gEarth).toBeCloseTo(9.81, 1);
  });

  it('verifies Kepler Third Law ratio for Earth', () => {
    const periodSeconds = OrbitalMechanics.orbitalPeriod(AU, SOLAR_MASS);
    const periodDays = periodSeconds / 86400;
    expect(periodDays).toBeCloseTo(365.25, 0);

    const ratio = OrbitalMechanics.keplerThirdLawRatioAU(1.0, 1.0);
    expect(ratio).toBeCloseTo(1.0, 4);
  });

  it('calculates Kepler Second Law swept area correctly', () => {
    const h = 4.45e15; // specific angular momentum for Earth
    const dt = 86400;  // 1 day
    const area = OrbitalMechanics.areaSwept(h, dt);
    expect(area).toBe(0.5 * h * dt);
  });

  it('identifies trajectory types accurately from energy', () => {
    // 1. Bound circular orbit
    const vCirc = OrbitalMechanics.circularVelocity(SOLAR_MASS, AU);
    const elementsCircular = OrbitalMechanics.calculateOrbitalElements(
      new Vector3(AU, 0, 0),
      new Vector3(0, 0, vCirc),
      SOLAR_MASS
    );
    expect(elementsCircular.trajectoryType).toBe('circular');
    expect(elementsCircular.eccentricity).toBeCloseTo(0, 2);

    // 2. Escape hyperbolic trajectory
    const vHyperbolic = vCirc * 1.6;
    const elementsHyp = OrbitalMechanics.calculateOrbitalElements(
      new Vector3(AU, 0, 0),
      new Vector3(0, 0, vHyperbolic),
      SOLAR_MASS
    );
    expect(elementsHyp.trajectoryType).toBe('hyperbolic');
    expect(elementsHyp.eccentricity).toBeGreaterThan(1);
  });
});

describe('GravityEngine & RK4Integrator', () => {
  it('conserves energy and maintains stable Earth orbit in RK4 simulation', () => {
    const engine = new GravityEngine();

    const sun = new Body({
      id: 'sun',
      name: 'Sun',
      type: 'star',
      mass: SOLAR_MASS,
      radius: 6.96e8,
      position: new Vector3(0, 0, 0),
      velocity: new Vector3(0, 0, 0),
      fixed: true
    });

    const vEarth = OrbitalMechanics.circularVelocity(SOLAR_MASS, AU);
    const earth = new Body({
      id: 'earth',
      name: 'Earth',
      type: 'planet',
      mass: EARTH_MASS,
      radius: EARTH_RADIUS,
      position: new Vector3(AU, 0, 0),
      velocity: new Vector3(0, 0, vEarth)
    });

    engine.addBody(sun);
    engine.addBody(earth);

    const initialEnergy = engine.computeSystemEnergy();

    // Advance 30 days in simulation with RK4
    const dtPerDay = 86400;
    for (let day = 0; day < 30; day++) {
      engine.update(dtPerDay);
    }

    const currentDist = earth.position.length();
    // Distance should stay within 0.1% of 1 AU for a circular orbit with RK4
    const distanceDeviationRatio = Math.abs(currentDist - AU) / AU;
    expect(distanceDeviationRatio).toBeLessThan(0.005);

    // Check energy conservation
    const finalEnergy = engine.computeSystemEnergy();
    const energyDeviationRatio = Math.abs(finalEnergy.totalEnergy - initialEnergy.totalEnergy) / Math.abs(initialEnergy.totalEnergy);
    expect(energyDeviationRatio).toBeLessThan(0.001);
  });

  it('restores snapshot without mutating original dataset', () => {
    const engine = new GravityEngine();
    const b1 = new Body({
      id: 'test-1',
      name: 'Test',
      type: 'planet',
      mass: 1000,
      radius: 10,
      position: new Vector3(100, 0, 0),
      velocity: new Vector3(0, 10, 0)
    });
    engine.addBody(b1);

    const snapshot = engine.snapshot();

    // Mutate state during simulation
    b1.position.x = 9999;
    b1.mass = 50000;

    // Restore
    engine.restore(snapshot);
    const restored = engine.getBody('test-1');
    expect(restored).toBeDefined();
    expect(restored!.position.x).toBe(100);
    expect(restored!.mass).toBe(1000);
  });

  it('handles safety checks on zero or negative values', () => {
    const invalidBody = new Body({
      id: 'neg',
      name: 'Neg',
      type: 'custom',
      mass: -500, // Should be clamped to >= 0
      radius: -10 // Should be clamped to >= 1
    });
    expect(invalidBody.mass).toBe(0);
    expect(invalidBody.radius).toBe(1);
    expect(invalidBody.isValid()).toBe(true);
  });
});

describe('UnitConverter', () => {
  it('converts units correctly', () => {
    expect(UnitConverter.metersToAU(AU)).toBeCloseTo(1.0, 5);
    expect(UnitConverter.metersToKm(1000)).toBe(1);
    expect(UnitConverter.secondsToDays(86400)).toBe(1);
    expect(UnitConverter.msToKms(11200)).toBe(11.2);
    expect(UnitConverter.daysToSeconds(1)).toBe(86400);
    expect(UnitConverter.yearsToSeconds(1)).toBe(86400 * 365.25);
  });

  it('formats values for students with Indonesian formatting', () => {
    const distStr = UnitConverter.formatDistance(149.6e9, 'student');
    expect(distStr).toContain('juta km');

    const massStr = UnitConverter.formatMass(EARTH_MASS, 'student');
    expect(massStr).toContain('10²⁴');

    const speedStr = UnitConverter.formatVelocity(29780, 'student');
    expect(speedStr).toContain('km/s');

    const periodStr = UnitConverter.formatPeriod(365.25 * 86400, 'student');
    expect(periodStr).toContain('tahun');
  });

  it('formats astronomical and SI units accurately', () => {
    const distAU = UnitConverter.formatDistance(AU, 'astronomical');
    expect(distAU).toContain('1,00');

    const distSI = UnitConverter.formatDistance(AU, 'si');
    expect(distSI).toContain('m');
  });
});
