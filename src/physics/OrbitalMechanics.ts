import { Vector3 } from './Vector3';
import { G, AU } from '../utils/constants';

export interface OrbitalElements {
  semiMajorAxis: number;       // meters (a)
  eccentricity: number;        // dimensionless (e)
  periapsis: number;           // meters (closest distance)
  apoapsis: number;            // meters (furthest distance)
  orbitalPeriod: number;       // seconds (T)
  specificEnergy: number;      // J/kg
  specificAngularMomentum: number; // m^2/s
  trajectoryType: 'circular' | 'elliptical' | 'parabolic' | 'hyperbolic' | 'collision';
  currentSpeed: number;        // m/s
  currentDistance: number;     // meters
}

export class OrbitalMechanics {
  /**
   * Calculate circular orbital velocity at distance r from central mass M:
   * v = sqrt(G * M / r)
   */
  static circularVelocity(centralMass: number, distance: number): number {
    if (distance <= 0 || centralMass <= 0) return 0;
    return Math.sqrt((G * centralMass) / distance);
  }

  /**
   * Calculate escape velocity from central mass M at distance r:
   * v_esc = sqrt(2 * G * M / r)
   */
  static escapeVelocity(centralMass: number, distance: number): number {
    if (distance <= 0 || centralMass <= 0) return 0;
    return Math.sqrt((2 * G * centralMass) / distance);
  }

  /**
   * Surface gravity: g = G * M / R^2
   */
  static surfaceGravity(mass: number, radius: number): number {
    if (radius <= 0 || mass <= 0) return 0;
    return (G * mass) / (radius * radius);
  }

  /**
   * Kepler's Third Law:
   * T = 2 * pi * sqrt(a^3 / (G * (M + m)))
   */
  static orbitalPeriod(semiMajorAxis: number, centralMass: number, bodyMass: number = 0): number {
    if (semiMajorAxis <= 0 || centralMass + bodyMass <= 0) return 0;
    const mu = G * (centralMass + bodyMass);
    return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / mu);
  }

  /**
   * Kepler's Third Law ratio:
   * T^2 / a^3 should equal 4 * pi^2 / (G * M)
   * In astronomical units: (T / year)^2 / (a / AU)^3 = 1
   */
  static keplerThirdLawRatioAU(periodYears: number, semiMajorAxisAU: number): number {
    if (semiMajorAxisAU <= 0) return 0;
    return (periodYears * periodYears) / Math.pow(semiMajorAxisAU, 3);
  }

  /**
   * Calculate instantaneous orbital elements from position and velocity vectors relative to central body
   */
  static calculateOrbitalElements(
    relPosition: Vector3,
    relVelocity: Vector3,
    centralMass: number,
    centralRadius: number = 0
  ): OrbitalElements {
    const r = relPosition.length();
    const v = relVelocity.length();
    const mu = G * centralMass;

    if (r === 0 || mu === 0) {
      return {
        semiMajorAxis: 0,
        eccentricity: 0,
        periapsis: 0,
        apoapsis: 0,
        orbitalPeriod: 0,
        specificEnergy: 0,
        specificAngularMomentum: 0,
        trajectoryType: 'collision',
        currentSpeed: v,
        currentDistance: r
      };
    }

    // Specific orbital energy: epsilon = v^2 / 2 - mu / r
    const specificEnergy = (v * v) / 2 - mu / r;

    // Specific angular momentum: h = r x v
    const hVec = new Vector3().crossVectors(relPosition, relVelocity);
    const h = hVec.length();

    // Eccentricity vector: e = (v x h) / mu - r / |r|
    // v x h:
    const vCrossH = new Vector3().crossVectors(relVelocity, hVec);
    const eVec = new Vector3(
      vCrossH.x / mu - relPosition.x / r,
      vCrossH.y / mu - relPosition.y / r,
      vCrossH.z / mu - relPosition.z / r
    );
    let eccentricity = eVec.length();

    // Clamp numerical floating point jitter near 0
    if (Math.abs(eccentricity) < 1e-6) eccentricity = 0;

    let semiMajorAxis = 0;
    let periapsis = 0;
    let apoapsis = 0;
    let orbitalPeriod = 0;
    let trajectoryType: OrbitalElements['trajectoryType'] = 'elliptical';

    if (Math.abs(specificEnergy) < 1e-4) {
      // Parabolic
      trajectoryType = 'parabolic';
      periapsis = (h * h) / (2 * mu);
      apoapsis = Infinity;
      semiMajorAxis = Infinity;
    } else if (specificEnergy > 0) {
      // Hyperbolic
      trajectoryType = 'hyperbolic';
      semiMajorAxis = -mu / (2 * specificEnergy);
      periapsis = semiMajorAxis * (1 - eccentricity);
      apoapsis = Infinity;
    } else {
      // Bound orbit (circular or elliptical)
      semiMajorAxis = -mu / (2 * specificEnergy);
      periapsis = semiMajorAxis * (1 - eccentricity);
      apoapsis = semiMajorAxis * (1 + eccentricity);
      orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / mu);
      trajectoryType = eccentricity < 0.01 ? 'circular' : 'elliptical';
    }

    // Collision check with central body
    if (periapsis < centralRadius) {
      trajectoryType = 'collision';
    }

    return {
      semiMajorAxis,
      eccentricity,
      periapsis,
      apoapsis,
      orbitalPeriod,
      specificEnergy,
      specificAngularMomentum: h,
      trajectoryType,
      currentSpeed: v,
      currentDistance: r
    };
  }

  /**
   * Kepler's Second Law: dA/dt = h / 2 = constant.
   * Swept area over time deltaT = (h / 2) * deltaT
   */
  static areaSwept(h: number, deltaT: number): number {
    return 0.5 * h * deltaT;
  }
}
