import { Vector3 } from './Vector3';
import { Body } from './Body';
import { G } from '../utils/constants';

export interface AccelerationCalculator {
  calculateAccelerations(
    positions: Vector3[],
    velocities: Vector3[],
    masses: number[],
    bodies: Body[],
    outAccelerations: Vector3[]
  ): void;
}

export class RK4Integrator {
  private softeningSq: number;

  // Cached scratch arrays to eliminate GC allocations every frame
  private scratchPos1: Vector3[] = [];
  private scratchPos2: Vector3[] = [];
  private scratchPos3: Vector3[] = [];

  private scratchVel1: Vector3[] = [];
  private scratchVel2: Vector3[] = [];
  private scratchVel3: Vector3[] = [];

  private k1r: Vector3[] = [];
  private k1v: Vector3[] = [];
  private k2r: Vector3[] = [];
  private k2v: Vector3[] = [];
  private k3r: Vector3[] = [];
  private k3v: Vector3[] = [];
  private k4r: Vector3[] = [];
  private k4v: Vector3[] = [];

  private masses: number[] = [];
  private initialPositions: Vector3[] = [];
  private initialVelocities: Vector3[] = [];

  constructor(softeningMeters = 1e6) {
    this.softeningSq = softeningMeters * softeningMeters;
  }

  setSoftening(softeningMeters: number): void {
    this.softeningSq = softeningMeters * softeningMeters;
  }

  /**
   * Ensure scratch memory is allocated for N bodies
   */
  private ensureCapacity(n: number): void {
    while (this.k1r.length < n) {
      this.scratchPos1.push(new Vector3());
      this.scratchPos2.push(new Vector3());
      this.scratchPos3.push(new Vector3());

      this.scratchVel1.push(new Vector3());
      this.scratchVel2.push(new Vector3());
      this.scratchVel3.push(new Vector3());

      this.k1r.push(new Vector3());
      this.k1v.push(new Vector3());
      this.k2r.push(new Vector3());
      this.k2v.push(new Vector3());
      this.k3r.push(new Vector3());
      this.k3v.push(new Vector3());
      this.k4r.push(new Vector3());
      this.k4v.push(new Vector3());

      this.masses.push(0);
      this.initialPositions.push(new Vector3());
      this.initialVelocities.push(new Vector3());
    }
  }

  /**
   * Perform a single RK4 step on an array of active bodies with timestep dt (in seconds)
   */
  step(bodies: Body[], dt: number, accCalc?: AccelerationCalculator): void {
    const activeBodies = bodies.filter(b => b.active);
    const n = activeBodies.length;
    if (n === 0 || dt === 0) return;

    this.ensureCapacity(n);

    // Snapshot current state
    for (let i = 0; i < n; i++) {
      const b = activeBodies[i];
      this.initialPositions[i].copy(b.position);
      this.initialVelocities[i].copy(b.velocity);
      this.masses[i] = b.mass;
    }

    // --- STEP 1: k1 ---
    // k1r = v
    // k1v = a(r, v)
    if (accCalc) {
      accCalc.calculateAccelerations(this.initialPositions, this.initialVelocities, this.masses, activeBodies, this.k1v);
    } else {
      this.computeMutualAccelerations(this.initialPositions, this.masses, n, this.k1v);
    }
    for (let i = 0; i < n; i++) {
      this.k1r[i].copy(this.initialVelocities[i]);
      // Update intermediate body acceleration for visualization
      activeBodies[i].acceleration.copy(this.k1v[i]);
    }

    // --- STEP 2: k2 ---
    // r2 = r + 0.5 * dt * k1r
    // v2 = v + 0.5 * dt * k1v
    const halfDt = 0.5 * dt;
    for (let i = 0; i < n; i++) {
      this.scratchPos1[i].set(
        this.initialPositions[i].x + halfDt * this.k1r[i].x,
        this.initialPositions[i].y + halfDt * this.k1r[i].y,
        this.initialPositions[i].z + halfDt * this.k1r[i].z
      );
      this.scratchVel1[i].set(
        this.initialVelocities[i].x + halfDt * this.k1v[i].x,
        this.initialVelocities[i].y + halfDt * this.k1v[i].y,
        this.initialVelocities[i].z + halfDt * this.k1v[i].z
      );
      this.k2r[i].copy(this.scratchVel1[i]);
    }
    if (accCalc) {
      accCalc.calculateAccelerations(this.scratchPos1, this.scratchVel1, this.masses, activeBodies, this.k2v);
    } else {
      this.computeMutualAccelerations(this.scratchPos1, this.masses, n, this.k2v);
    }

    // --- STEP 3: k3 ---
    // r3 = r + 0.5 * dt * k2r
    // v3 = v + 0.5 * dt * k2v
    for (let i = 0; i < n; i++) {
      this.scratchPos2[i].set(
        this.initialPositions[i].x + halfDt * this.k2r[i].x,
        this.initialPositions[i].y + halfDt * this.k2r[i].y,
        this.initialPositions[i].z + halfDt * this.k2r[i].z
      );
      this.scratchVel2[i].set(
        this.initialVelocities[i].x + halfDt * this.k2v[i].x,
        this.initialVelocities[i].y + halfDt * this.k2v[i].y,
        this.initialVelocities[i].z + halfDt * this.k2v[i].z
      );
      this.k3r[i].copy(this.scratchVel2[i]);
    }
    if (accCalc) {
      accCalc.calculateAccelerations(this.scratchPos2, this.scratchVel2, this.masses, activeBodies, this.k3v);
    } else {
      this.computeMutualAccelerations(this.scratchPos2, this.masses, n, this.k3v);
    }

    // --- STEP 4: k4 ---
    // r4 = r + dt * k3r
    // v4 = v + dt * k3v
    for (let i = 0; i < n; i++) {
      this.scratchPos3[i].set(
        this.initialPositions[i].x + dt * this.k3r[i].x,
        this.initialPositions[i].y + dt * this.k3r[i].y,
        this.initialPositions[i].z + dt * this.k3r[i].z
      );
      this.scratchVel3[i].set(
        this.initialVelocities[i].x + dt * this.k3v[i].x,
        this.initialVelocities[i].y + dt * this.k3v[i].y,
        this.initialVelocities[i].z + dt * this.k3v[i].z
      );
      this.k4r[i].copy(this.scratchVel3[i]);
    }
    if (accCalc) {
      accCalc.calculateAccelerations(this.scratchPos3, this.scratchVel3, this.masses, activeBodies, this.k4v);
    } else {
      this.computeMutualAccelerations(this.scratchPos3, this.masses, n, this.k4v);
    }

    // --- FINAL WEIGHTED COMBINATION ---
    // r_new = r + (dt / 6) * (k1r + 2*k2r + 2*k3r + k4r)
    // v_new = v + (dt / 6) * (k1v + 2*k2v + 2*k3v + k4v)
    const dtOver6 = dt / 6.0;
    for (let i = 0; i < n; i++) {
      const b = activeBodies[i];
      if (!b.fixed) {
        b.position.x += dtOver6 * (this.k1r[i].x + 2 * this.k2r[i].x + 2 * this.k3r[i].x + this.k4r[i].x);
        b.position.y += dtOver6 * (this.k1r[i].y + 2 * this.k2r[i].y + 2 * this.k3r[i].y + this.k4r[i].y);
        b.position.z += dtOver6 * (this.k1r[i].z + 2 * this.k2r[i].z + 2 * this.k3r[i].z + this.k4r[i].z);

        b.velocity.x += dtOver6 * (this.k1v[i].x + 2 * this.k2v[i].x + 2 * this.k3v[i].x + this.k4v[i].x);
        b.velocity.y += dtOver6 * (this.k1v[i].y + 2 * this.k2v[i].y + 2 * this.k3v[i].y + this.k4v[i].y);
        b.velocity.z += dtOver6 * (this.k1v[i].z + 2 * this.k2v[i].z + 2 * this.k3v[i].z + this.k4v[i].z);
      }
    }
  }

  /**
   * Fast N-body mutual gravitational acceleration using Newton's law:
   * a_i = sum_{j != i} G * m_j * (r_j - r_i) / (dist_sq + softening_sq)^(3/2)
   */
  public computeMutualAccelerations(
    positions: Vector3[],
    masses: number[],
    count: number,
    outAccelerations: Vector3[]
  ): void {
    // Reset output accelerations
    for (let i = 0; i < count; i++) {
      outAccelerations[i].zero();
    }

    // Exploit Newton's Third Law (F_ij = -F_ji) for 2x performance
    for (let i = 0; i < count; i++) {
      const p1 = positions[i];
      const m1 = masses[i];

      for (let j = i + 1; j < count; j++) {
        const p2 = positions[j];
        const m2 = masses[j];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;

        const distSq = dx * dx + dy * dy + dz * dz + this.softeningSq;
        const dist = Math.sqrt(distSq);
        const invDist3 = 1 / (dist * distSq);

        const factor = G * invDist3;

        // Acceleration on i due to j: a_i += G * m_j * delta_r / r^3
        const f1 = factor * m2;
        outAccelerations[i].x += dx * f1;
        outAccelerations[i].y += dy * f1;
        outAccelerations[i].z += dz * f1;

        // Acceleration on j due to i: a_j -= G * m_1 * delta_r / r^3
        const f2 = factor * m1;
        outAccelerations[j].x -= dx * f2;
        outAccelerations[j].y -= dy * f2;
        outAccelerations[j].z -= dz * f2;
      }
    }
  }
}
