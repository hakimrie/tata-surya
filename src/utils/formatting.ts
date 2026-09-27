/**
 * Formatting utilities for Indonesian educational presentation
 */

export function formatSimulationDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatSimulationDateTime(date: Date): string {
  return `${date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })} ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
}

export function formatEnergy(joules: number): string {
  if (isNaN(joules) || !isFinite(joules)) return '0 J';
  const absJ = Math.abs(joules);
  const sign = joules < 0 ? '-' : '';

  if (absJ >= 1e30) {
    return `${sign}${(absJ / 1e30).toFixed(2)} × 10³⁰ J`;
  }
  if (absJ >= 1e24) {
    return `${sign}${(absJ / 1e24).toFixed(2)} × 10²⁴ J (YJ)`;
  }
  if (absJ >= 1e18) {
    return `${sign}${(absJ / 1e18).toFixed(2)} EJ`;
  }
  if (absJ >= 1e12) {
    return `${sign}${(absJ / 1e12).toFixed(2)} TJ`;
  }
  if (absJ >= 1e9) {
    return `${sign}${(absJ / 1e9).toFixed(2)} GJ`;
  }
  if (absJ >= 1e6) {
    return `${sign}${(absJ / 1e6).toFixed(2)} MJ`;
  }
  if (absJ >= 1e3) {
    return `${sign}${(absJ / 1e3).toFixed(2)} kJ`;
  }
  return `${sign}${absJ.toFixed(1)} J`;
}

export function formatGravity(gravityMps2: number): string {
  if (isNaN(gravityMps2) || !isFinite(gravityMps2)) return 'N/A';
  const gEarth = (gravityMps2 / 9.80665).toFixed(2);
  return `${gravityMps2.toFixed(2)} m/s² (${gEarth} g)`;
}

export function formatTemperature(minC?: number, maxC?: number, meanC?: number): string {
  if (meanC !== undefined && minC === undefined) {
    return `${meanC > 0 ? '+' : ''}${meanC}°C (${(meanC + 273.15).toFixed(0)} K)`;
  }
  if (minC !== undefined && maxC !== undefined) {
    return `${minC}°C s/d ${maxC > 0 ? '+' : ''}${maxC}°C`;
  }
  if (meanC !== undefined) {
    return `${meanC}°C`;
  }
  return 'N/A';
}

export function formatNumberId(num: number, maxDecimals: number = 2): string {
  return num.toLocaleString('id-ID', {
    maximumFractionDigits: maxDecimals
  });
}
