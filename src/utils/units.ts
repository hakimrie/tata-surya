import { AU, EARTH_MASS, SOLAR_MASS } from './constants';

export type UnitSystem = 'student' | 'astronomical' | 'si';

export class UnitConverter {
  /**
   * Meters to Kilometers
   */
  static metersToKm(meters: number): number {
    return meters / 1000;
  }

  /**
   * Meters to Astronomical Units (AU)
   */
  static metersToAU(meters: number): number {
    return meters / AU;
  }

  /**
   * AU to Meters
   */
  static auToMeters(au: number): number {
    return au * AU;
  }

  /**
   * Kilograms to Earth Masses
   */
  static kgToEarthMass(kg: number): number {
    return kg / EARTH_MASS;
  }

  /**
   * Kilograms to Solar Masses
   */
  static kgToSolarMass(kg: number): number {
    return kg / SOLAR_MASS;
  }

  /**
   * Seconds to Days
   */
  static secondsToDays(seconds: number): number {
    return seconds / 86400;
  }

  /**
   * Seconds to Earth Years (365.25 days)
   */
  static secondsToYears(seconds: number): number {
    return seconds / (86400 * 365.25);
  }

  /**
   * Days to Seconds
   */
  static daysToSeconds(days: number): number {
    return days * 86400;
  }

  /**
   * Years to Seconds
   */
  static yearsToSeconds(years: number): number {
    return years * 86400 * 365.25;
  }

  /**
   * m/s to km/s
   */
  static msToKms(ms: number): number {
    return ms / 1000;
  }

  /**
   * km/s to m/s
   */
  static kmsToMs(kms: number): number {
    return kms * 1000;
  }

  /**
   * Format distance based on chosen unit system
   */
  static formatDistance(meters: number, unitSystem: UnitSystem = 'student'): string {
    if (isNaN(meters) || !isFinite(meters)) return 'N/A';
    
    if (unitSystem === 'si') {
      return `${meters.toExponential(3)} m`;
    }
    
    if (unitSystem === 'astronomical') {
      const au = this.metersToAU(meters);
      if (au < 0.01) {
        return `${(this.metersToKm(meters)).toLocaleString('id-ID', { maximumFractionDigits: 0 })} km`;
      }
      return `${au.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 3 })} AU`;
    }
    
    // Student mode
    const km = this.metersToKm(meters);
    if (km >= 1_000_000) {
      const millionKm = km / 1_000_000;
      return `${millionKm.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} juta km`;
    }
    return `${km.toLocaleString('id-ID', { maximumFractionDigits: 1 })} km`;
  }

  /**
   * Format mass based on unit system
   */
  static formatMass(kg: number, unitSystem: UnitSystem = 'student'): string {
    if (isNaN(kg) || !isFinite(kg)) return 'N/A';

    if (unitSystem === 'si') {
      return `${kg.toExponential(3)} kg`;
    }

    if (unitSystem === 'astronomical') {
      if (kg >= SOLAR_MASS * 0.05) {
        const solar = this.kgToSolarMass(kg);
        return `${solar.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 3 })} M☉ (Massa Matahari)`;
      }
      const earth = this.kgToEarthMass(kg);
      return `${earth.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 3 })} M⊕ (Massa Bumi)`;
    }

    // Student mode: scientific notation with superscripts
    return this.toScientificSuperscript(kg, 'kg');
  }

  /**
   * Format velocity
   */
  static formatVelocity(ms: number, unitSystem: UnitSystem = 'student'): string {
    if (isNaN(ms) || !isFinite(ms)) return 'N/A';

    if (unitSystem === 'si') {
      return `${ms.toLocaleString('id-ID', { maximumFractionDigits: 1 })} m/s`;
    }

    const kms = this.msToKms(ms);
    return `${kms.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} km/s`;
  }

  /**
   * Format time period (seconds)
   */
  static formatPeriod(seconds: number, unitSystem: UnitSystem = 'student'): string {
    if (isNaN(seconds) || !isFinite(seconds)) return 'N/A';

    if (unitSystem === 'si') {
      return `${seconds.toLocaleString('id-ID', { maximumFractionDigits: 0 })} detik`;
    }

    const days = this.secondsToDays(seconds);
    if (days >= 365.25) {
      const years = this.secondsToYears(seconds);
      return `${years.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} tahun (${days.toLocaleString('id-ID', { maximumFractionDigits: 0 })} hari)`;
    }

    if (days < 1) {
      const hours = seconds / 3600;
      return `${hours.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} jam`;
    }

    return `${days.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} hari`;
  }

  /**
   * Helper to format numbers with Unicode superscripts e.g. 5.972 × 10²⁴ kg
   */
  static toScientificSuperscript(val: number, unit: string = ''): string {
    if (val === 0) return `0 ${unit}`.trim();
    const expStr = val.toExponential(3);
    const [mantissa, exponent] = expStr.split('e');
    const expNum = parseInt(exponent, 10);

    if (Math.abs(expNum) < 4) {
      return `${val.toLocaleString('id-ID', { maximumFractionDigits: 2 })} ${unit}`.trim();
    }

    const superscripts: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '-': '⁻'
    };

    const expFormatted = exponent
      .replace(/^\+/, '')
      .split('')
      .map(char => superscripts[char] ?? char)
      .join('');

    const mantissaFormatted = parseFloat(mantissa).toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    });

    return `${mantissaFormatted} × 10${expFormatted} ${unit}`.trim();
  }
}
