import * as THREE from 'three';
import { AU } from '../utils/constants';

export interface SpacecraftDefinition {
  id: string;
  name: string;
  indonesianName: string;
  color: string;
  descriptionId: string;
  descriptionEn: string;
}

export class SpacecraftMissions {
  public group: THREE.Group;
  private distanceScale: number;

  private voyagerMesh: THREE.Group;
  private jwstMesh: THREE.Group;
  private palapaMesh: THREE.Group;

  constructor(distanceScale: number) {
    this.distanceScale = distanceScale;
    this.group = new THREE.Group();
    this.group.name = 'spacecraft-missions';

    // 1. Voyager 1 & 2 Interstellar Escape Trajectory
    this.voyagerMesh = this.buildVoyagerTrajectory();
    this.group.add(this.voyagerMesh);

    // 2. JWST at Sun-Earth L2 Halo Orbit
    this.jwstMesh = this.buildJWSTOrbit();
    this.group.add(this.jwstMesh);

    // 3. Palapa A1 (GEO over Indonesia)
    this.palapaMesh = this.buildPalapaOrbit();
    this.group.add(this.palapaMesh);

    // Default visible
    this.group.visible = false;
  }

  private buildVoyagerTrajectory(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'voyager-mission';

    // Hyperbolic escape trajectory arching past Jupiter (5.2 AU) & Saturn (9.5 AU) out to 50 AU
    const points: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Hyperbolic path
      const rAU = 1.0 + t * 45.0; // from 1 AU out to 46 AU
      const r = rAU * AU * this.distanceScale;
      const angle = (t * 1.8) - 0.4;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      // Tilts out of ecliptic plane by 35° after Saturn encounter
      const y = t > 0.3 ? (t - 0.3) * r * 0.45 : 0;
      points.push(new THREE.Vector3(x, y, z));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 1.5,
      gapSize: 0.8,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.75
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    group.add(line);

    // 3D Probe Model at tip
    const probe = this.createProbeMesh(0x38bdf8);
    const tipPos = points[points.length - 1];
    probe.position.copy(tipPos);
    group.add(probe);

    return group;
  }

  private buildJWSTOrbit(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'jwst-mission';

    // Halo orbit at Sun-Earth L2 (located at ~1.01 AU from Sun, behind Earth)
    const earthDistAU = 1.0;
    const l2DistAU = 1.01; // ~1.5 million km outside Earth
    const l2R = l2DistAU * AU * this.distanceScale;

    // Small halo loop around L2
    const haloPoints: THREE.Vector3[] = [];
    const haloRadius = 0.45;
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      const hX = l2R + Math.cos(theta) * haloRadius;
      const hY = Math.sin(theta) * haloRadius * 0.7;
      const hZ = Math.sin(theta) * haloRadius * 0.4;
      haloPoints.push(new THREE.Vector3(hX, hY, hZ));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(haloPoints);
    const mat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.8
    });
    const haloLine = new THREE.Line(geo, mat);
    group.add(haloLine);

    // Gold hexagonal sunshield probe mesh
    const jwstProbe = this.createProbeMesh(0xf59e0b);
    jwstProbe.position.set(l2R + haloRadius, 0, 0);
    group.add(jwstProbe);

    return group;
  }

  private buildPalapaOrbit(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'palapa-mission';

    // GEO orbit ring centered near Earth's mean distance
    const earthR = 1.0 * AU * this.distanceScale;
    const geoRingRadius = 0.85;

    const ringPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(
        earthR + Math.cos(theta) * geoRingRadius,
        0,
        Math.sin(theta) * geoRingRadius
      ));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const mat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.7
    });
    group.add(new THREE.Line(geo, mat));

    // Palapa satellite marker
    const satProbe = this.createProbeMesh(0x10b981);
    satProbe.position.set(earthR + geoRingRadius, 0, 0);
    group.add(satProbe);

    return group;
  }

  private createProbeMesh(colorHex: number): THREE.Group {
    const group = new THREE.Group();

    // Central bus
    const busGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const busMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.8, roughness: 0.2 });
    const bus = new THREE.Mesh(busGeo, busMat);
    group.add(bus);

    // Solar panels
    const panelGeo = new THREE.BoxGeometry(0.45, 0.02, 0.14);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const panelLeft = new THREE.Mesh(panelGeo, panelMat);
    panelLeft.position.set(-0.35, 0, 0);
    group.add(panelLeft);

    const panelRight = new THREE.Mesh(panelGeo, panelMat);
    panelRight.position.set(0.35, 0, 0);
    group.add(panelRight);

    // High-gain dish antenna
    const dishGeo = new THREE.ConeGeometry(0.12, 0.08, 16);
    dishGeo.rotateX(Math.PI);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 0.14, 0);
    group.add(dish);

    return group;
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public update(deltaRealSec: number, earthPos?: THREE.Vector3): void {
    // If earthPos is supplied, sync JWST & Palapa relative to Earth
    if (earthPos) {
      // Follow Earth
      const distFromSun = Math.hypot(earthPos.x, earthPos.z);
      if (distFromSun > 0.1) {
        const rHat = earthPos.clone().normalize();
        // JWST at L2 (1.2 units behind Earth away from Sun)
        const l2Pos = earthPos.clone().addScaledVector(rHat, 1.15);
        this.jwstMesh.position.copy(l2Pos);

        // Palapa orbiting Earth
        this.palapaMesh.position.copy(earthPos);
        this.palapaMesh.rotation.y += 0.02;
      }
    }
  }
}
