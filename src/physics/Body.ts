import { Vector3 } from './Vector3';

export type BodyType = 'star' | 'planet' | 'moon' | 'asteroid' | 'comet' | 'spacecraft' | 'custom';

export interface BodyOptions {
  id: string;
  name: string;
  indonesianName?: string;
  type: BodyType;
  mass: number;          // kg
  radius: number;        // meters
  position?: Vector3;    // meters
  velocity?: Vector3;    // m/s
  color?: string;
  parentId?: string;
  fixed?: boolean;
  dragCoefficient?: number;
  crossSectionArea?: number; // m^2
  albedo?: number;
}

export class Body {
  id: string;
  name: string;
  indonesianName: string;
  type: BodyType;
  mass: number;           // in kg
  radius: number;         // in meters
  position: Vector3;      // in meters
  velocity: Vector3;      // in m/s
  acceleration: Vector3;  // in m/s^2
  color: string;
  parentId?: string;
  fixed: boolean;
  active: boolean;

  // Atmospheric drag parameters (for orbital decay experiment)
  dragCoefficient: number;
  crossSectionArea: number; // in m^2

  // Historical trajectory points (in SI meters)
  trail: Vector3[] = [];
  maxTrailPoints = 300;

  constructor(options: BodyOptions) {
    this.id = options.id;
    this.name = options.name;
    this.indonesianName = options.indonesianName || options.name;
    this.type = options.type;
    this.mass = Math.max(0, options.mass);
    this.radius = Math.max(1, options.radius);
    this.position = options.position ? options.position.clone() : new Vector3();
    this.velocity = options.velocity ? options.velocity.clone() : new Vector3();
    this.acceleration = new Vector3();
    this.color = options.color || '#ffffff';
    this.parentId = options.parentId;
    this.fixed = !!options.fixed;
    this.active = true;
    this.dragCoefficient = options.dragCoefficient || 2.2;
    this.crossSectionArea = options.crossSectionArea || (Math.PI * Math.pow(Math.min(this.radius, 10), 2));
  }

  /**
   * Clone this body for safe simulation branching/resetting
   */
  clone(): Body {
    const copy = new Body({
      id: this.id,
      name: this.name,
      indonesianName: this.indonesianName,
      type: this.type,
      mass: this.mass,
      radius: this.radius,
      position: this.position.clone(),
      velocity: this.velocity.clone(),
      color: this.color,
      parentId: this.parentId,
      fixed: this.fixed,
      dragCoefficient: this.dragCoefficient,
      crossSectionArea: this.crossSectionArea
    });
    copy.active = this.active;
    copy.acceleration.copy(this.acceleration);
    copy.trail = this.trail.map(p => p.clone());
    return copy;
  }

  /**
   * Record current position to trail (sub-sampled)
   */
  recordTrail(minDistanceThreshold = 1e8): void {
    if (this.trail.length > 0) {
      const last = this.trail[this.trail.length - 1];
      if (last.distanceTo(this.position) < minDistanceThreshold) {
        return;
      }
    }
    this.trail.push(this.position.clone());
    if (this.trail.length > this.maxTrailPoints) {
      this.trail.shift();
    }
  }

  clearTrail(): void {
    this.trail = [];
  }

  /**
   * Check if body state values are physically valid (not NaN or infinite)
   */
  isValid(): boolean {
    return (
      !isNaN(this.mass) && isFinite(this.mass) && this.mass >= 0 &&
      !isNaN(this.radius) && isFinite(this.radius) && this.radius > 0 &&
      this.position.isValid() &&
      this.velocity.isValid() &&
      this.acceleration.isValid()
    );
  }
}
