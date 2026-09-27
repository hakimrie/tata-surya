/**
 * Astronomical and Physical Constants (SI Units)
 * SI Units: meters (m), kilograms (kg), seconds (s), m/s, m/s^2
 */

// Gravitational constant G in m^3 kg^-1 s^-2 (CODATA 2018)
export const G = 6.67430e-11;

// Astronomical Unit (AU) in meters
export const AU = 1.495978707e11;

// Solar constants
export const SOLAR_MASS = 1.98847e30; // kg
export const SOLAR_RADIUS = 6.9634e8; // meters (696,340 km)
export const SOLAR_LUMINOSITY = 3.828e26; // Watts

// Earth constants
export const EARTH_MASS = 5.9722e24; // kg
export const EARTH_RADIUS = 6.371e6; // meters (6,371 km)
export const EARTH_SURFACE_GRAVITY = 9.80665; // m/s^2
export const EARTH_ESCAPE_VELOCITY = 11186; // m/s (~11.2 km/s)
export const EARTH_ORBITAL_PERIOD = 365.256363004 * 86400; // seconds (1 sidereal year)
export const EARTH_ORBITAL_SPEED = 29780; // m/s (~29.8 km/s)

// Moon constants
export const MOON_MASS = 7.342e22; // kg
export const MOON_RADIUS = 1.7374e6; // meters (1,737.4 km)
export const MOON_ORBITAL_DISTANCE = 3.844e8; // meters (384,400 km)
export const MOON_ORBITAL_PERIOD = 27.321661 * 86400; // seconds (sidereal month)

// Geostationary orbit radius from Earth center in meters (e.g. Palapa)
export const GEO_ORBIT_RADIUS = 42164e3; // meters (35,786 km altitude + Earth radius)

// Speed of light in vacuum
export const SPEED_OF_LIGHT = 299792458; // m/s

// Seconds in time units
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = 86400;
export const SECONDS_PER_MONTH = 86400 * 30.4375;
export const SECONDS_PER_YEAR = 86400 * 365.25;

// Visual scale default factors
// Base visual scale converts meters to Three.js scene units
// 1 Scene Unit in Educational Mode ~ 1 AU scaled
export const DEFAULT_SCALE_SETTINGS = {
  // Visual Mode (Educational Scale)
  visual: {
    distanceScale: 1 / (10 * AU), // 10 AU = 1.0 scene units (or scaled nicely)
    planetSizeScale: 2000,        // Enlarges planets so they are visible
    sunSizeScale: 80,             // Sun scaled reasonably relative to planets
    moonSizeScale: 4000,
    moonOrbitScale: 40,
  },
  // True Scale (Scientifically Proportional)
  trueScale: {
    distanceScale: 1 / (100 * AU),
    planetSizeScale: 1,
    sunSizeScale: 1,
    moonSizeScale: 1,
    moonOrbitScale: 1,
  }
};
