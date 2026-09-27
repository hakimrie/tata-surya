import { Vector3 } from './Vector3';
import { Body } from './Body';
import { RK4Integrator, AccelerationCalculator } from './RK4Integrator';
import { G, SPEED_OF_LIGHT } from '../utils/constants';

export interface SystemEnergy {
  kineticEnergy: number;      // Joules
  potentialEnergy: number;    // Joules
  totalEnergy: number;        // Joules
  angularMomentum: Vector3;   // kg * m^2 / s
  momentumMagnitude: number;
}

export type CollisionMode = 'merge' | 'bounce' | 'ignore';

export interface CollisionEvent {
  bodyA: Body;
  bodyB: Body;
  mergedBody?: Body;
  timestamp: number;
}

export class GravityEngine implements AccelerationCalculator {
  private bodies: Map<string, Body> = new Map();
  private integrator: RK4Integrator;

  // Maximum sub-step size in seconds to maintain RK4 stability (e.g. 1 hour = 3600s)
  public maxSubStepDt: number = 3600 * 2; // 2 hours max per sub-step
  public collisionMode: CollisionMode = 'merge';

  // Atmospheric drag active for orbital decay
  public atmosphericDragEnabled: boolean = false;
  public dragParentId: string = 'earth';
  public atmosphereDensity0: number = 1.225; // kg/m^3 at sea level
  public scaleHeight: number = 8500; // 8.5 km scale height

  // Stability status
  public isStable: boolean = true;
  public errorMessage: string | null = null;

  // Listeners
  public onCollision?: (event: CollisionEvent) => void;
  public onInstability?: (msg: string) => void;

  constructor(softeningMeters = 1e6) {
    this.integrator = new RK4Integrator(softeningMeters);
  }

  setSoftening(softeningMeters: number): void {
    this.integrator.setSoftening(softeningMeters);
  }

  addBody(body: Body): void {
    this.bodies.set(body.id, body);
  }

  removeBody(id: string): boolean {
    return this.bodies.delete(id);
  }

  getBody(id: string): Body | undefined {
    return this.bodies.get(id);
  }

  getBodies(): Body[] {
    return Array.from(this.bodies.values());
  }

  getActiveBodies(): Body[] {
    return Array.from(this.bodies.values()).filter(b => b.active);
  }

  clear(): void {
    this.bodies.clear();
    this.isStable = true;
    this.errorMessage = null;
  }

  /**
   * Save a deep snapshot of current simulation state
   */
  snapshot(): Body[] {
    return Array.from(this.bodies.values()).map(b => b.clone());
  }

  /**
   * Restore state from snapshot
   */
  restore(snapshot: Body[]): void {
    this.bodies.clear();
    for (const b of snapshot) {
      this.bodies.set(b.id, b.clone());
    }
    this.isStable = true;
    this.errorMessage = null;
  }

  /**
   * Advances the simulation by totalDt seconds using sub-stepping.
   * Keeps integrator within safe delta-t bounds.
   */
  update(totalDt: number): void {
    if (totalDt <= 0 || !this.isStable) return;

    const subSteps = Math.max(1, Math.ceil(totalDt / this.maxSubStepDt));
    const dt = totalDt / subSteps;

    const activeList = this.getActiveBodies();

    for (let s = 0; s < subSteps; s++) {
      this.integrator.step(activeList, dt, this);

      // Check stability
      for (const b of activeList) {
        if (!b.isValid() || b.velocity.length() > SPEED_OF_LIGHT * 0.5) {
          this.isStable = false;
          this.errorMessage = `Simulasi menjadi tidak stabil pada objek "${b.indonesianName || b.name}". Coba gunakan timestep yang lebih kecil.`;
          if (this.onInstability) {
            this.onInstability(this.errorMessage);
          }
          return;
        }
      }

      // Check collisions if enabled
      if (this.collisionMode !== 'ignore') {
        this.handleCollisions(activeList);
      }
    }

    // Update trails after sub-steps completed
    for (const b of activeList) {
      b.recordTrail();
    }
  }

  /**
   * Acceleration calculator callback for RK4Integrator:
   * Adds mutual gravity + optional atmospheric drag
   */
  calculateAccelerations(
    positions: Vector3[],
    velocities: Vector3[],
    masses: number[],
    bodies: Body[],
    outAccelerations: Vector3[]
  ): void {
    const count = positions.length;
    // 1. Compute mutual gravitational acceleration
    this.integrator.computeMutualAccelerations(positions, masses, count, outAccelerations);

    // 2. Atmospheric drag (if enabled)
    if (this.atmosphericDragEnabled) {
      let parentIndex = -1;
      for (let i = 0; i < count; i++) {
        if (bodies[i].id === this.dragParentId) {
          parentIndex = i;
          break;
        }
      }

      if (parentIndex !== -1) {
        const parentPos = positions[parentIndex];
        const parentRadius = bodies[parentIndex].radius;

        for (let i = 0; i < count; i++) {
          if (i === parentIndex) continue;
          const body = bodies[i];
          if (body.type === 'star' || body.type === 'planet') continue;

          const dx = positions[i].x - parentPos.x;
          const dy = positions[i].y - parentPos.y;
          const dz = positions[i].z - parentPos.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const altitude = dist - parentRadius;

          if (altitude > 0 && altitude < 1_000_000) { // Under 1,000 km altitude
            // Barometric density formula: rho = rho0 * exp(-h / H)
            const density = this.atmosphereDensity0 * Math.exp(-altitude / this.scaleHeight);

            // Relative velocity
            const relVx = velocities[i].x - velocities[parentIndex].x;
            const relVy = velocities[i].y - velocities[parentIndex].y;
            const relVz = velocities[i].z - velocities[parentIndex].z;
            const relSpeed = Math.sqrt(relVx * relVx + relVy * relVy + relVz * relVz);

            if (relSpeed > 0 && body.mass > 0) {
              // Drag force F = 0.5 * rho * v^2 * Cd * A
              // a_drag = -0.5 * rho * Cd * A * v * v_vec / m
              const dragFactor = (0.5 * density * body.dragCoefficient * body.crossSectionArea * relSpeed) / body.mass;
              outAccelerations[i].x -= relVx * dragFactor;
              outAccelerations[i].y -= relVy * dragFactor;
              outAccelerations[i].z -= relVz * dragFactor;
            }
          }
        }
      }
    }
  }

  /**
   * Handle physical collisions between bodies
   */
  private handleCollisions(activeBodies: Body[]): void {
    const n = activeBodies.length;
    for (let i = 0; i < n; i++) {
      const b1 = activeBodies[i];
      if (!b1.active) continue;

      for (let j = i + 1; j < n; j++) {
        const b2 = activeBodies[j];
        if (!b2.active) continue;

        const dist = b1.position.distanceTo(b2.position);
        const contactDist = b1.radius + b2.radius;

        if (dist <= contactDist) {
          if (this.collisionMode === 'merge') {
            // Larger body absorbs smaller body with momentum conservation
            const [primary, secondary] = b1.mass >= b2.mass ? [b1, b2] : [b2, b1];
            
            const totalMass = primary.mass + secondary.mass;
            if (totalMass > 0) {
              primary.velocity.x = (primary.mass * primary.velocity.x + secondary.mass * secondary.velocity.x) / totalMass;
              primary.velocity.y = (primary.mass * primary.velocity.y + secondary.mass * secondary.velocity.y) / totalMass;
              primary.velocity.z = (primary.mass * primary.velocity.z + secondary.mass * secondary.velocity.z) / totalMass;
            }
            primary.mass = totalMass;
            // Radius scales with cube root of mass assuming constant density
            primary.radius = Math.cbrt(Math.pow(primary.radius, 3) + Math.pow(secondary.radius, 3));
            secondary.active = false;

            if (this.onCollision) {
              this.onCollision({
                bodyA: b1,
                bodyB: b2,
                mergedBody: primary,
                timestamp: Date.now()
              });
            }
          }
        }
      }
    }
  }

  /**
   * Sample gravitational acceleration at any point in 3D space
   * Returns vector in m/s^2
   */
  sampleGravityField(point: Vector3, outField: Vector3, excludeBodyId?: string): Vector3 {
    outField.zero();
    for (const body of this.bodies.values()) {
      if (!body.active || body.mass <= 0 || body.id === excludeBodyId) continue;

      const dx = body.position.x - point.x;
      const dy = body.position.y - point.y;
      const dz = body.position.z - point.z;
      const distSq = dx * dx + dy * dy + dz * dz + 1e8; // softening
      const dist = Math.sqrt(distSq);

      const factor = (G * body.mass) / (distSq * dist);
      outField.x += dx * factor;
      outField.y += dy * factor;
      outField.z += dz * factor;
    }
    return outField;
  }

  /**
   * Calculate total mechanical energy and angular momentum of the system
   */
  computeSystemEnergy(): SystemEnergy {
    let ke = 0;
    let pe = 0;
    const lTot = new Vector3();
    const active = this.getActiveBodies();
    const n = active.length;

    // Kinetic Energy & Angular Momentum
    for (let i = 0; i < n; i++) {
      const b = active[i];
      const vSq = b.velocity.lengthSq();
      ke += 0.5 * b.mass * vSq;

      // L = r x (m * v)
      const rCrossV = new Vector3().crossVectors(b.position, b.velocity);
      lTot.addScaledVector(rCrossV, b.mass);
    }

    // Potential Energy: U = - sum_{i < j} G * m_i * m_j / r_ij
    for (let i = 0; i < n; i++) {
      const b1 = active[i];
      for (let j = i + 1; j < n; j++) {
        const b2 = active[j];
        const dist = b1.position.distanceTo(b2.position);
        if (dist > 0) {
          pe -= (G * b1.mass * b2.mass) / dist;
        }
      }
    }

    return {
      kineticEnergy: ke,
      potentialEnergy: pe,
      totalEnergy: ke + pe,
      angularMomentum: lTot,
      momentumMagnitude: lTot.length()
    };
  }
}
