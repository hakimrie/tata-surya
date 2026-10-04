import * as THREE from 'three';
import { CometData } from '../data/comets';
import { AU } from '../utils/constants';

export class Comet {
  public data: CometData;
  public group: THREE.Group;
  public nucleusMesh: THREE.Mesh;
  public comaMesh: THREE.Mesh;
  public ionTail: THREE.Line;
  public dustTail: THREE.Line;
  public orbitLine: THREE.Line;
  public selectionIndicator: THREE.Mesh;

  public meanAnomaly: number = 0;
  public currentAngle: number = 0; // Kept for backwards compatibility
  public visualRadius: number = 0.22;

  private orbitPoints: THREE.Vector3[] = [];
  private distanceScale: number;

  // Visual orbital parameters
  private visualSemiMajorAxisAU: number;
  private visualEccentricity: number;
  private currentFlare: number = 0.5;

  private static readonly DUST_SEGMENTS = 20;

  constructor(data: CometData, distanceScale: number) {
    this.data = data;
    this.distanceScale = distanceScale;
    this.group = new THREE.Group();
    this.group.name = `comet-${data.id}`;

    // Compute visual semi-major axis and eccentricity
    // Halley fits inside the Solar System naturally (a = 17.8 AU, aphelion = 35 AU)
    // NEOWISE has a = 360 AU (aphelion ~720 AU in Oort cloud). In visual scale, we bound aphelion to ~48 AU (Kuiper Belt)
    // while strictly preserving perihelion q = 0.295 AU and ultra-high eccentricity > 0.98.
    if (data.id === 'neowise') {
      const qAU = data.perihelionAU; // 0.295 AU
      const visualAphelionAU = 48.0;
      this.visualSemiMajorAxisAU = (qAU + visualAphelionAU) / 2; // ~24.15 AU
      this.visualEccentricity = (visualAphelionAU - qAU) / (visualAphelionAU + qAU); // ~0.9878
    } else {
      this.visualSemiMajorAxisAU = data.semiMajorAxisAU;
      this.visualEccentricity = data.eccentricity;
    }

    // 1. Nucleus (Irregular icy space rock with craters & ridges)
    const nucleusGeo = new THREE.DodecahedronGeometry(this.visualRadius, 1);
    const posAttr = nucleusGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const bump = 1.0 + Math.sin(vx * 12) * Math.cos(vy * 12) * 0.22;
      posAttr.setXYZ(i, vx * bump, vy * bump, vz * bump);
    }
    nucleusGeo.computeVertexNormals();

    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.9,
      metalness: 0.1
    });
    this.nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    this.group.add(this.nucleusMesh);

    // 2. Glowing Coma
    const comaGeo = new THREE.SphereGeometry(this.visualRadius * 2.8, 16, 16);
    const comaMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(data.color),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.comaMesh = new THREE.Mesh(comaGeo, comaMat);
    this.group.add(this.comaMesh);

    // 3. Electric-Blue Ion Tail (Pre-allocated static Float32Array buffer: 2 vertices = 6 floats)
    const ionPositions = new Float32Array(6);
    const ionGeo = new THREE.BufferGeometry();
    ionGeo.setAttribute('position', new THREE.BufferAttribute(ionPositions, 3));
    const ionMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
      blending: THREE.AdditiveBlending
    });
    this.ionTail = new THREE.Line(ionGeo, ionMat);
    this.group.add(this.ionTail);

    // 4. Curved Golden-White Dust Tail (Pre-allocated static buffer: 20 vertices = 60 floats)
    const dustPositions = new Float32Array(Comet.DUST_SEGMENTS * 3);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.55,
      linewidth: 2,
      blending: THREE.AdditiveBlending
    });
    this.dustTail = new THREE.Line(dustGeo, dustMat);
    this.group.add(this.dustTail);

    // 5. Selection Ring
    const selGeo = new THREE.RingGeometry(this.visualRadius * 2.2, this.visualRadius * 2.4, 32);
    selGeo.rotateX(Math.PI / 2);
    const selMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    this.selectionIndicator = new THREE.Mesh(selGeo, selMat);
    this.selectionIndicator.visible = false;
    this.group.add(this.selectionIndicator);

    // 6. Build Orbit Path Line
    this.orbitLine = this.buildOrbitLine();

    // Start near perihelion for viewing excitement:
    // Halley at M = -0.35 rad (approaching perihelion)
    // NEOWISE at M = -0.15 rad (approaching perihelion)
    this.meanAnomaly = data.id === 'halley' ? -0.35 : -0.15;
    this.currentAngle = this.meanAnomaly;

    // Position comet initially
    this.update(0.016, true, 0);
  }

  /**
   * Solve Kepler's equation M = E - e*sin(E) for Eccentric Anomaly E using Halley's method
   */
  private solveKepler(M: number, e: number): number {
    let m = M % (Math.PI * 2);
    if (m < 0) m += Math.PI * 2;

    // Initial estimate for high eccentricity
    let E: number;
    if (e > 0.8) {
      if (m < Math.PI) {
        E = Math.pow(6 * m, 1 / 3);
      } else {
        const m2 = 2 * Math.PI - m;
        E = 2 * Math.PI - Math.pow(6 * m2, 1 / 3);
      }
    } else {
      E = m + e * Math.sin(m);
    }

    // Halley's third-order root-finding method
    for (let iter = 0; iter < 8; iter++) {
      const s = Math.sin(E);
      const c = Math.cos(E);
      const f = E - e * s - m;
      const f1 = 1 - e * c;
      const f2 = e * s;
      const delta = f / (f1 - (0.5 * f * f2) / f1);
      E -= delta;
      if (Math.abs(delta) < 1e-7) break;
    }
    return E;
  }

  /**
   * Build smooth, continuous 3D orbit line
   */
  public buildOrbitLine(): THREE.Line {
    const a = this.visualSemiMajorAxisAU * AU * this.distanceScale;
    const e = this.visualEccentricity;
    const b = a * Math.sqrt(Math.max(0, 1 - e * e));
    const incRad = (this.data.inclinationDeg * Math.PI) / 180;
    const sinI = Math.sin(incRad);
    const cosI = Math.cos(incRad);

    const segments = 512;
    this.orbitPoints = [];

    for (let i = 0; i <= segments; i++) {
      // Non-linear sampling parameter t in [-1, 1]
      // Clusters points densely near perihelion (E = 0) where orbit curves sharply
      const t = (i / segments) * 2 - 1;
      const sign = t < 0 ? -1 : 1;
      const tNonLinear = sign * Math.pow(Math.abs(t), 1.85);
      const E = tNonLinear * Math.PI;

      const xOrb = a * (Math.cos(E) - e);
      const zOrb = b * Math.sin(E);

      const x = xOrb;
      const y = zOrb * sinI;
      const z = zOrb * cosI;

      this.orbitPoints.push(new THREE.Vector3(x, y, z));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(this.orbitPoints);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.data.color),
      transparent: true,
      opacity: 0.4,
      linewidth: 1
    });

    const line = new THREE.Line(geo, mat);
    line.name = `orbit-comet-${this.data.id}`;
    return line;
  }

  /**
   * Update comet distance scale when user switches scale mode
   */
  public updateDistanceScale(distanceScale: number): void {
    this.distanceScale = distanceScale;
    if (this.orbitLine) {
      const oldGeo = this.orbitLine.geometry;
      this.orbitLine.geometry = this.buildOrbitLine().geometry;
      oldGeo.dispose();
    }
  }

  /**
   * Update comet position and dynamic tails each frame
   */
  public update(deltaRealSec: number, isSimPaused: boolean = false, deltaSimSeconds: number = deltaRealSec * 86400): void {
    if (!isSimPaused && deltaSimSeconds > 0) {
      // Visual orbital period in simulation seconds
      // Halley: completes 1 orbit in ~120 days of sim time (~120s at 1 day/s)
      // NEOWISE: completes 1 orbit in ~240 days of sim time (~240s at 1 day/s)
      const visualPeriodDays = this.data.id === 'halley' ? 120 : 240;
      const visualPeriodSec = visualPeriodDays * 86400;
      const meanMotion = (Math.PI * 2) / visualPeriodSec;

      // Rate of advance in Mean Anomaly
      const rawDeltaM = meanMotion * deltaSimSeconds;

      // Strict safety clamp on deltaM per frame to prevent any flashing or teleportation
      const maxDeltaMPerFrame = 0.006;
      const deltaM = Math.min(rawDeltaM, maxDeltaMPerFrame);

      this.meanAnomaly += deltaM;
      if (this.meanAnomaly > Math.PI * 2) {
        this.meanAnomaly -= Math.PI * 2;
      }
      this.currentAngle = this.meanAnomaly;
    }

    // Solve Kepler's equation for Eccentric Anomaly E
    const a = this.visualSemiMajorAxisAU * AU * this.distanceScale;
    const e = this.visualEccentricity;
    const b = a * Math.sqrt(Math.max(0, 1 - e * e));
    const incRad = (this.data.inclinationDeg * Math.PI) / 180;
    const sinI = Math.sin(incRad);
    const cosI = Math.cos(incRad);

    const E = this.solveKepler(this.meanAnomaly, e);

    // Exact 3D Position in ecliptic space
    const xOrb = a * (Math.cos(E) - e);
    const zOrb = b * Math.sin(E);

    const posX = xOrb;
    const posY = zOrb * sinI;
    const posZ = zOrb * cosI;

    this.group.position.set(posX, posY, posZ);

    // Exact 3D Velocity direction (derivative with respect to E, normalized)
    const vxOrb = -a * Math.sin(E);
    const vzOrb = b * Math.cos(E);
    const velDir = new THREE.Vector3(vxOrb, vzOrb * sinI, vzOrb * cosI).normalize();

    // Anti-sunward unit vector
    const sunToComet = this.group.position.clone().normalize();
    const distToSun = this.group.position.length();

    // Distance in AU
    const distAU = distToSun / (AU * this.distanceScale);

    // Flare intensity based on solar radiation (smooth curve)
    // Maximum near perihelion (~2.8), low at aphelion (~0.1)
    const targetFlare = Math.min(2.8, Math.max(0.1, 1.4 / Math.pow(Math.max(0.35, distAU), 1.1)));

    // Smooth exponential filtering across frames (completely prevents flashing!)
    const blendRate = Math.min(1.0, deltaRealSec * 4.5);
    this.currentFlare += (targetFlare - this.currentFlare) * blendRate;

    const tailLength = Math.max(3.0, this.currentFlare * 11.0);

    // 1. Update Ion Tail (in-place buffer update)
    const ionPos = this.ionTail.geometry.attributes.position as THREE.BufferAttribute;
    const ionArr = ionPos.array as Float32Array;
    const ionEnd = sunToComet.clone().multiplyScalar(tailLength);
    ionArr[0] = 0; ionArr[1] = 0; ionArr[2] = 0;
    ionArr[3] = ionEnd.x; ionArr[4] = ionEnd.y; ionArr[5] = ionEnd.z;
    ionPos.needsUpdate = true;

    const ionMat = this.ionTail.material as THREE.LineBasicMaterial;
    ionMat.opacity = Math.min(0.85, 0.15 + this.currentFlare * 0.25);

    // 2. Update Dust Tail (in-place buffer update, curves backwards along velocity lag)
    const dustPos = this.dustTail.geometry.attributes.position as THREE.BufferAttribute;
    const dustArr = dustPos.array as Float32Array;
    const segments = Comet.DUST_SEGMENTS;
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      // Pushed outward anti-sunward
      const outward = sunToComet.clone().multiplyScalar(t * tailLength * 0.85);
      // Lags behind backwards along velocity direction
      const lagScalar = -t * t * 3.2 * Math.min(1.8, this.currentFlare);
      const lag = velDir.clone().multiplyScalar(lagScalar);
      const pt = outward.add(lag);

      dustArr[i * 3] = pt.x;
      dustArr[i * 3 + 1] = pt.y;
      dustArr[i * 3 + 2] = pt.z;
    }
    dustPos.needsUpdate = true;

    const dustMat = this.dustTail.material as THREE.LineBasicMaterial;
    dustMat.opacity = Math.min(0.75, 0.12 + this.currentFlare * 0.22);

    // 3. Coma expansion & pulsation
    const comaScale = 1.0 + this.currentFlare * 0.7;
    this.comaMesh.scale.set(comaScale, comaScale, comaScale);
    (this.comaMesh.material as THREE.MeshBasicMaterial).opacity = Math.min(0.65, 0.18 + this.currentFlare * 0.16);

    // 4. Nucleus gentle rotation
    this.nucleusMesh.rotation.x += 0.012;
    this.nucleusMesh.rotation.y += 0.018;

    // 5. Selection ring rotation
    if (this.selectionIndicator.visible) {
      this.selectionIndicator.rotation.y += 0.03;
    }
  }

  public setSelected(selected: boolean, isCloseUp: boolean = false): void {
    this.selectionIndicator.visible = selected && !isCloseUp;
  }
}
