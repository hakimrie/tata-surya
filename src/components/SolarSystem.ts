import * as THREE from 'three';
import { Planet } from './Planet';
import { Moon } from './Moon';
import { Comet } from './Comet';
import { COMETS_DATA } from '../data/comets';
import { Constellations } from './Constellations';
import { SpacecraftMissions } from './SpacecraftMissions';
import { SolarAtmosphere } from '../effects/SolarAtmosphere';
import { BlackHole } from './BlackHole';
import { PLANETS_DATA, PlanetData } from '../data/planets';
import { MOONS_DATA, MoonData } from '../data/moons';
import { GravityEngine } from '../physics/GravityEngine';
import { Body } from '../physics/Body';
import { Vector3 as PhysVector3 } from '../physics/Vector3';
import { AU, MOON_RADIUS } from '../utils/constants';
import { TextureGenerator } from '../utils/textureGenerator';

export type ScaleMode = 'trueScale' | 'visual' | 'custom';

export interface ScaleConfig {
  mode: ScaleMode;
  distanceScale: number;    // converts meters to 3D scene units
  planetSizeScale: number;  // multiplier for planet radius
  sunSizeScale: number;     // multiplier for Sun radius
  moonSizeScale: number;    // multiplier for moon radius
  moonOrbitScale: number;   // multiplier for moon orbit distance
}

export interface MajorAsteroidItem {
  id: string;
  name: string;
  indonesianName: string;
  mesh: THREE.Mesh;
  semiMajorAxisAU: number;
  orbitalSpeed: number; // rad/s
  currentAngle: number;
}

export class SolarSystem {
  public group: THREE.Group;
  public planets: Map<string, Planet> = new Map();
  public moons: Map<string, Moon> = new Map();
  public comets: Map<string, Comet> = new Map();
  public majorAsteroids: MajorAsteroidItem[] = [];
  public orbitLinesGroup: THREE.Group;
  public asteroidBeltGroup: THREE.Group;
  public gravityFieldGroup: THREE.Group;
  public cometsGroup: THREE.Group;
  public constellations: Constellations;
  public spacecraftMissions: SpacecraftMissions;
  public solarAtmosphere?: SolarAtmosphere;
  public blackHole?: BlackHole;

  public scaleConfig: ScaleConfig;
  public isScaleExaggerated: boolean = true;

  // Visual toggles
  public showOrbitPaths: boolean = true;
  public showAsteroidBelt: boolean = true;
  public showGravityField: boolean = false;
  public showVelocityVectors: boolean = false;
  public showComets: boolean = true;
  public showConstellations: boolean = true;
  public showSpacecraft: boolean = true;

  private selectedBodyId: string | null = null;

  constructor() {
    this.group = new THREE.Group();
    this.orbitLinesGroup = new THREE.Group();
    this.asteroidBeltGroup = new THREE.Group();
    this.gravityFieldGroup = new THREE.Group();
    this.cometsGroup = new THREE.Group();

    this.group.add(this.orbitLinesGroup);
    this.group.add(this.asteroidBeltGroup);
    this.group.add(this.gravityFieldGroup);
    this.group.add(this.cometsGroup);

    // Default to Visual Educational Scale
    this.scaleConfig = {
      mode: 'visual',
      distanceScale: 150 / (30 * AU), // Neptune (~30 AU) fits nicely in ~150 scene units
      planetSizeScale: 600,            // Enlarged so Earth is visible (~3.8 scene units)
      sunSizeScale: 35,                // Sun readable without engulfing Mercury
      moonSizeScale: 1200,
      moonOrbitScale: 18
    };

    // Celestial Dome Constellations
    this.constellations = new Constellations();
    this.group.add(this.constellations.group);

    // Historic Spacecraft Missions
    this.spacecraftMissions = new SpacecraftMissions(this.scaleConfig.distanceScale);
    this.group.add(this.spacecraftMissions.group);

    this.createPlanets();
    this.createMoons();
    this.createComets();
    this.createAsteroidBelt();
    this.createOrbitLines();
    this.createGravityFieldGrid();
  }

  /**
   * Initialize all planets and dynamic solar atmosphere
   */
  private createPlanets(): void {
    for (const pData of PLANETS_DATA) {
      const visualRadius = this.computePlanetVisualRadius(pData);
      const planet = new Planet(pData, visualRadius);
      this.planets.set(pData.id, planet);
      this.group.add(planet.group);

      if (pData.type === 'star') {
        this.solarAtmosphere = new SolarAtmosphere(visualRadius);
        planet.group.add(this.solarAtmosphere.group);
      }
    }
  }

  /**
   * Initialize comets with dynamic dual tails (Halley, NEOWISE)
   */
  private createComets(): void {
    for (const cData of COMETS_DATA) {
      const comet = new Comet(cData, this.scaleConfig.distanceScale);
      this.comets.set(cData.id, comet);
      this.cometsGroup.add(comet.group);
      this.cometsGroup.add(comet.orbitLine);
    }
  }

  /**
   * Initialize major moons
   */
  private createMoons(): void {
    for (const mData of MOONS_DATA) {
      const visualRadius = this.computeMoonVisualRadius(mData);
      const moon = new Moon(mData, visualRadius);
      this.moons.set(mData.id, moon);

      // Add moon group and orbit line to parent planet group
      const parentPlanet = this.planets.get(mData.parentId);
      if (parentPlanet) {
        parentPlanet.group.add(moon.group);
        const orbitR = this.computeMoonVisualOrbitRadius(mData);
        const orbitLine = moon.createOrbitLine(orbitR);
        parentPlanet.group.add(orbitLine);
        moon.setOrbitLineVisible(this.showOrbitPaths);
      } else {
        this.group.add(moon.group);
      }
    }
  }

  /**
   * Create realistic asteroid belt particle system (thousands of asteroids between Mars and Jupiter)
   * Uses fine, delicate cosmic dust particles with realistic Kirkwood gap distributions.
   */
  private createAsteroidBelt(): void {
    const asteroidCount = 6500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(asteroidCount * 3);
    const colors = new Float32Array(asteroidCount * 3);

    // Main asteroid belt: 2.15 AU to 3.28 AU from Sun
    const rMinAU = 2.15;
    const rMaxAU = 3.28;
    const distScale = this.scaleConfig.distanceScale;

    // Spectral mineral colors for asteroids:
    // C-type (carbonaceous neutral grey/brown ~75%), S-type (silicate warm tan ~17%), M-type (metallic nickel-iron ~8%)
    const cTypeColor = new THREE.Color('#8a8078');
    const sTypeColor = new THREE.Color('#c2b09a');
    const mTypeColor = new THREE.Color('#dcdce8');

    let count = 0;
    while (count < asteroidCount) {
      const angle = Math.random() * Math.PI * 2;
      // Triangular/Gaussian radial distribution concentrated near belt core (~2.7 AU)
      const rAU = rMinAU + (Math.random() * 0.5 + Math.random() * 0.5) * (rMaxAU - rMinAU);

      // Kirkwood Gaps (Jupiter orbital resonance zones where asteroids are cleared out)
      const inKirkwoodGap =
        Math.abs(rAU - 2.50) < 0.035 || // 3:1 resonance
        Math.abs(rAU - 2.82) < 0.03 ||  // 5:2 resonance
        Math.abs(rAU - 2.95) < 0.025 || // 7:3 resonance
        Math.abs(rAU - 3.27) < 0.03;   // 2:1 resonance

      if (inKirkwoodGap && Math.random() < 0.85) {
        continue; // 85% ejected in resonance gaps
      }

      const r = rAU * AU * distScale;
      // Flat ecliptic disk with natural Gaussian vertical dispersion
      const height = (Math.random() - 0.5) * (Math.random() - 0.5) * 0.55;

      positions[count * 3] = Math.cos(angle) * r;
      positions[count * 3 + 1] = height;
      positions[count * 3 + 2] = Math.sin(angle) * r;

      const randType = Math.random();
      const baseCol = randType < 0.75 ? cTypeColor : randType < 0.92 ? sTypeColor : mTypeColor;
      const brightness = 0.55 + Math.random() * 0.65; // Glint variation

      colors[count * 3] = Math.min(1.0, baseCol.r * brightness);
      colors[count * 3 + 1] = Math.min(1.0, baseCol.g * brightness);
      colors[count * 3 + 2] = Math.min(1.0, baseCol.b * brightness);

      count++;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular shaded 3D rock sprite texture
    const spriteTexture = TextureGenerator.getTexture('asteroid-sprite');

    // Delicate size: fine cosmic specks rather than gigantic boulders
    const material = new THREE.PointsMaterial({
      size: 0.11,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      opacity: 0.75
    });

    const points = new THREE.Points(geometry, material);
    this.asteroidBeltGroup.add(points);

    // Create 3D tumbling meshes for iconic major asteroids: Ceres, Vesta, Pallas, Hygiea
    this.createMajor3DAsteroids();
  }

  /**
   * Create 3D low-poly tumbling rock meshes for iconic asteroids
   * Proportionately sized to remain realistic relative to planets
   */
  private createMajor3DAsteroids(): void {
    const rockTex = TextureGenerator.getTexture('asteroid-rock');
    const rockMat = new THREE.MeshStandardMaterial({
      map: rockTex,
      roughness: 0.9,
      metalness: 0.1
    });

    // Realistic scale: Ceres (dwarf planet, r = 473 km) is visibly smaller than Mercury (r = 2440 km)
    const majorDefs = [
      { id: 'ceres', name: 'Ceres (Dwarf Planet)', indonesianName: 'Ceres (Planet Kerdil)', aAU: 2.77, rSize: 0.15 },
      { id: 'vesta', name: 'Vesta', indonesianName: 'Vesta', aAU: 2.36, rSize: 0.11 },
      { id: 'pallas', name: 'Pallas', indonesianName: 'Pallas', aAU: 2.77, rSize: 0.10 },
      { id: 'hygiea', name: 'Hygiea', indonesianName: 'Hygiea', aAU: 3.14, rSize: 0.08 }
    ];

    for (const def of majorDefs) {
      // Perturbed irregular dodecahedron for realistic space rock shape
      const geo = new THREE.DodecahedronGeometry(def.rSize, 1);
      const posAttr = geo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const vz = posAttr.getZ(i);
        const bump = 1.0 + (Math.sin(vx * 10) * Math.cos(vy * 10) * 0.18);
        posAttr.setXYZ(i, vx * bump, vy * bump, vz * bump);
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, rockMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const initialAngle = Math.random() * Math.PI * 2;
      const orbitalPeriodYears = Math.sqrt(Math.pow(def.aAU, 3)); // Kepler 3rd Law!
      const speed = (2 * Math.PI) / (orbitalPeriodYears * 365.25 * 86400);

      this.asteroidBeltGroup.add(mesh);

      this.majorAsteroids.push({
        id: def.id,
        name: def.name,
        indonesianName: def.indonesianName,
        mesh,
        semiMajorAxisAU: def.aAU,
        orbitalSpeed: speed,
        currentAngle: initialAngle
      });
    }
  }

  /**
   * Create orbit path lines for planets
   */
  public createOrbitLines(): void {
    // Clear existing
    while (this.orbitLinesGroup.children.length > 0) {
      const child = this.orbitLinesGroup.children[0] as THREE.Line;
      child.geometry.dispose();
      (child.material as THREE.Material).dispose();
      this.orbitLinesGroup.remove(child);
    }

    const segments = 128;
    for (const pData of PLANETS_DATA) {
      if (pData.type === 'star') continue;

      const a = pData.semiMajorAxis * this.scaleConfig.distanceScale;
      const e = pData.eccentricity;
      const b = a * Math.sqrt(Math.max(0, 1 - e * e));
      const c = a * e; // Focus offset from center where Sun is

      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        // Shift x by -c so the Sun at (0,0,0) is at one of the foci!
        const x = a * Math.cos(theta) - c;
        const z = b * Math.sin(theta);
        points.push(new THREE.Vector3(x, 0, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(pData.color),
        transparent: true,
        opacity: 0.35,
        linewidth: 1
      });

      const line = new THREE.Line(geometry, material);
      line.name = `orbit-${pData.id}`;
      this.orbitLinesGroup.add(line);
    }
  }

  /**
   * Create 3D Gravitational Vector Field Grid
   */
  private createGravityFieldGrid(): void {
    const gridSize = 14;
    const spacing = 16;
    const arrowHelperCount = gridSize * gridSize;

    const group = new THREE.Group();
    group.name = 'gravity-grid';

    for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
      for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
        if (x === 0 && z === 0) continue; // Skip Sun origin
        const origin = new THREE.Vector3(x * spacing, 0, z * spacing);
        const dir = new THREE.Vector3(-x, 0, -z).normalize();
        const arrow = new THREE.ArrowHelper(dir, origin, 3, 0x00f0ff, 1.2, 0.8);
        group.add(arrow);
      }
    }

    this.gravityFieldGroup.add(group);
    this.gravityFieldGroup.visible = this.showGravityField;
  }

  /**
   * Set scale mode (True Scale vs Visual Educational Scale vs Custom)
   */
  setScaleMode(mode: ScaleMode, customConfig?: Partial<ScaleConfig>): void {
    this.scaleConfig.mode = mode;

    if (mode === 'trueScale') {
      this.isScaleExaggerated = false;
      this.scaleConfig.distanceScale = 150 / (30 * AU);
      this.scaleConfig.planetSizeScale = 1.0;
      this.scaleConfig.sunSizeScale = 1.0;
      this.scaleConfig.moonSizeScale = 1.0;
      this.scaleConfig.moonOrbitScale = 1.0;
    } else if (mode === 'visual') {
      this.isScaleExaggerated = true;
      this.scaleConfig.distanceScale = 150 / (30 * AU);
      this.scaleConfig.planetSizeScale = 600;
      this.scaleConfig.sunSizeScale = 35;
      this.scaleConfig.moonSizeScale = 1200;
      this.scaleConfig.moonOrbitScale = 18;
    } else if (mode === 'custom' && customConfig) {
      this.isScaleExaggerated = true;
      Object.assign(this.scaleConfig, customConfig);
    }

    // Refresh meshes, orbits, and asteroid belt
    this.updateMeshScales();
    for (const comet of this.comets.values()) {
      comet.updateDistanceScale(this.scaleConfig.distanceScale);
    }
    this.createOrbitLines();
    this.recreateAsteroidBelt();
  }

  /**
   * Recreate asteroid belt (e.g. on scale change)
   */
  public recreateAsteroidBelt(): void {
    while (this.asteroidBeltGroup.children.length > 0) {
      const child = this.asteroidBeltGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m: any) => m.dispose());
        else child.material.dispose();
      }
      this.asteroidBeltGroup.remove(child);
    }
    this.majorAsteroids = [];
    this.createAsteroidBelt();
  }

  private computePlanetVisualRadius(p: PlanetData): number {
    if (p.type === 'star') {
      // In true scale, Sun is 6.96e8 m
      const trueR = p.radius * this.scaleConfig.distanceScale;
      return Math.max(1.5, trueR * this.scaleConfig.sunSizeScale);
    }

    const trueR = p.radius * this.scaleConfig.distanceScale;
    const visualR = trueR * this.scaleConfig.planetSizeScale;
    // Keep a reasonable minimum so Mercury is still clickable in visual mode
    return Math.max(0.4, visualR);
  }

  public computeMoonVisualRadius(m: MoonData): number {
    if (this.scaleConfig.mode === 'trueScale') {
      const trueR = m.radius * this.scaleConfig.distanceScale;
      return Math.max(0.002, trueR * this.scaleConfig.moonSizeScale);
    }

    const rRatio = m.radius / MOON_RADIUS;
    const baseMoonR = 0.11;
    // Power-law compression so Ganymede/Titan are ~0.13, Moon is 0.11, Phobos/Deimos ~0.032
    const sizeFactor = Math.max(0.28, Math.pow(rRatio, 0.36));
    const userScaleFactor = this.scaleConfig.moonSizeScale / 1200;
    return baseMoonR * sizeFactor * userScaleFactor;
  }

  public computeMoonVisualOrbitRadius(m: MoonData): number {
    if (this.scaleConfig.mode === 'trueScale') {
      return m.orbitalDistance * this.scaleConfig.distanceScale * this.scaleConfig.moonOrbitScale;
    }

    const parent = this.planets.get(m.parentId);
    if (!parent) return 1.0;

    const parentR = parent.visualRadius;
    const parentPhysR = parent.data.radius;
    const x = m.orbitalDistance / parentPhysR; // physical ratio
    const sqrtX = Math.sqrt(x);

    let visualMultiplier: number;
    if (parent.data.hasRings) {
      // Saturn rings extend to 2.42x planet radius.
      // Base offset at 2.65 ensures Enceladus is just outside rings (3.4x),
      // and Titan orbits clearly outside (4.4x).
      visualMultiplier = 2.65 + 0.38 * sqrtX;
    } else if (parent.data.id === 'earth') {
      // Earth's moon is physically distant (60 Earth radii), while Venus is our closest
      // planetary neighbor (only ~1.38 scene units away). Setting visualMultiplier ~1.70
      // gives a visual orbit radius of ~0.68: clearly outside Earth (0.40) while keeping
      // a wide, safe clearance (~0.70 units) from Venus to prevent any collision or overlap.
      visualMultiplier = 1.70;
    } else {
      // Non-ringed planets: 1.35x + 0.35 * sqrt(x)
      visualMultiplier = 1.35 + 0.35 * sqrtX;
    }

    const orbitMultiplier = this.scaleConfig.moonOrbitScale / 18;
    let orbitR = parentR * visualMultiplier * orbitMultiplier;

    // Astronomical Hill-Sphere / Planetary Clearance Protection:
    // Ensure moon's orbit never expands into neighboring planets' orbital paths,
    // even if scale sliders (moonOrbitScale or planetSizeScale) are adjusted in custom mode.
    const parentIndex = PLANETS_DATA.findIndex(p => p.id === parent.data.id);
    if (parentIndex !== -1) {
      const innerNeighbor = PLANETS_DATA[parentIndex - 1];
      const outerNeighbor = PLANETS_DATA[parentIndex + 1];
      let minNeighborGap = Infinity;
      let closestNeighborVisualR = 0.4;

      if (innerNeighbor && innerNeighbor.type !== 'star') {
        const gap = (parent.data.semiMajorAxis - innerNeighbor.semiMajorAxis) * this.scaleConfig.distanceScale;
        const neighborPlanet = this.planets.get(innerNeighbor.id);
        const nVisualR = neighborPlanet ? neighborPlanet.visualRadius : 0.4;
        if (gap > 0 && gap < minNeighborGap) {
          minNeighborGap = gap;
          closestNeighborVisualR = nVisualR;
        }
      }

      if (outerNeighbor) {
        const gap = (outerNeighbor.semiMajorAxis - parent.data.semiMajorAxis) * this.scaleConfig.distanceScale;
        const neighborPlanet = this.planets.get(outerNeighbor.id);
        const nVisualR = neighborPlanet ? neighborPlanet.visualRadius : 0.4;
        if (gap > 0 && gap < minNeighborGap) {
          minNeighborGap = gap;
          closestNeighborVisualR = nVisualR;
        }
      }

      if (minNeighborGap !== Infinity) {
        const moonVisualR = this.computeMoonVisualRadius(m);
        // Safe ceiling: maintain clear separation from neighboring planet's body and orbit
        const safeMaxOrbitR = Math.max(
          parentR + moonVisualR + 0.05,
          minNeighborGap - closestNeighborVisualR - moonVisualR - 0.15
        );
        orbitR = Math.min(orbitR, safeMaxOrbitR);
      }
    }

    return orbitR;
  }

  public setOrbitLinesVisible(visible: boolean): void {
    this.showOrbitPaths = visible;
    this.orbitLinesGroup.visible = visible;
    for (const moon of this.moons.values()) {
      moon.setOrbitLineVisible(visible);
    }
  }

  private updateMeshScales(): void {
    for (const [id, planet] of this.planets.entries()) {
      const newR = this.computePlanetVisualRadius(planet.data);
      planet.setVisualRadius(newR);
    }

    for (const [id, moon] of this.moons.entries()) {
      const newR = this.computeMoonVisualRadius(moon.data);
      moon.setVisualRadius(newR);
      const newOrbitR = this.computeMoonVisualOrbitRadius(moon.data);
      moon.updateOrbitLine(newOrbitR);
    }
  }

  /**
   * Sync visual 3D positions each frame with physics simulation engine
   */
  syncWithPhysics(
    engine: GravityEngine,
    deltaRealSec: number,
    isSimPaused: boolean = false,
    deltaSimSeconds: number = deltaRealSec * 86400
  ): void {
    const distScale = this.scaleConfig.distanceScale;

    for (const body of engine.getActiveBodies()) {
      const planet = this.planets.get(body.id);
      if (planet) {
        // Map SI meters (X, Z plane in Three.js)
        planet.group.position.set(
          body.position.x * distScale,
          body.position.y * distScale,
          body.position.z * distScale
        );
        planet.updateRotation(deltaRealSec, isSimPaused);
      }

      // Check if it's a moon
      const moon = this.moons.get(body.id);
      if (moon && body.parentId) {
        const parentBody = engine.getBody(body.parentId);
        if (parentBody) {
          const dx = body.position.x - parentBody.position.x;
          const dy = body.position.y - parentBody.position.y;
          const dz = body.position.z - parentBody.position.z;
          const physDist = Math.hypot(dx, dy, dz);

          if (this.scaleConfig.mode === 'trueScale') {
            const relX = dx * distScale * this.scaleConfig.moonOrbitScale;
            const relY = dy * distScale * this.scaleConfig.moonOrbitScale;
            const relZ = dz * distScale * this.scaleConfig.moonOrbitScale;
            moon.group.position.set(relX, relY, relZ);
            if (moon.data.tidalLocked && Math.hypot(relX, relZ) > 1e-4) {
              moon.bodyMesh.rotation.y = Math.atan2(relX, relZ);
            }
          } else {
            const visualOrbitR = this.computeMoonVisualOrbitRadius(moon.data);
            if (physDist > 0) {
              const relX = (dx / physDist) * visualOrbitR;
              const relY = (dy / physDist) * visualOrbitR;
              const relZ = (dz / physDist) * visualOrbitR;
              moon.group.position.set(relX, relY, relZ);
              if (moon.data.tidalLocked) {
                moon.bodyMesh.rotation.y = Math.atan2(relX, relZ);
              }
            }
          }
        }
      }
    }

    // Slowly rotate asteroid belt particle cloud and animate major 3D asteroids
    if (this.asteroidBeltGroup.visible) {
      if (!isSimPaused) {
        this.asteroidBeltGroup.rotation.y += 0.0004;
      }

      // Update major 3D asteroids orbits and tumble
      for (const ast of this.majorAsteroids) {
        if (!isSimPaused) {
          ast.currentAngle += ast.orbitalSpeed * (deltaRealSec * 86400 * 5);
        }
        const r = ast.semiMajorAxisAU * AU * distScale;
        ast.mesh.position.set(
          Math.cos(ast.currentAngle) * r,
          Math.sin(ast.currentAngle * 2) * 0.8,
          Math.sin(ast.currentAngle) * r
        );
        ast.mesh.rotation.x += 0.012;
        ast.mesh.rotation.y += 0.018;
      }
    }

    // Update dynamic solar atmosphere (prominence loops & solar wind)
    if (this.solarAtmosphere) {
      this.solarAtmosphere.update(deltaRealSec, isSimPaused);
    }

    // Update dynamic comets with dual tails
    if (this.cometsGroup.visible) {
      for (const comet of this.comets.values()) {
        comet.update(deltaRealSec, isSimPaused, deltaSimSeconds);
      }
    }

    // Update historic spacecraft (JWST & Palapa tracking Earth)
    if (this.spacecraftMissions.group.visible) {
      const earth = this.planets.get('earth');
      this.spacecraftMissions.update(deltaRealSec, earth ? earth.group.position : undefined);
    }

    // Update Black Hole if present in sandbox
    if (this.blackHole) {
      this.blackHole.update(deltaRealSec);
    }
  }

  /**
   * Set comets visibility
   */
  public setCometsVisible(visible: boolean): void {
    this.showComets = visible;
    this.cometsGroup.visible = visible;
    for (const c of this.comets.values()) {
      c.orbitLine.visible = visible && this.showOrbitPaths;
    }
  }

  /**
   * Set constellations sky dome visibility
   */
  public setConstellationsVisible(visible: boolean): void {
    this.showConstellations = visible;
    this.constellations.setVisible(visible);
  }

  /**
   * Set spacecraft missions visibility
   */
  public setSpacecraftVisible(visible: boolean): void {
    this.showSpacecraft = visible;
    this.spacecraftMissions.setVisible(visible);
  }

  /**
   * Add Black Hole into Solar System scene
   */
  public addBlackHole(position: THREE.Vector3): BlackHole {
    if (!this.blackHole) {
      this.blackHole = new BlackHole(1.4);
      this.group.add(this.blackHole.group);
    }
    this.blackHole.group.position.copy(position);
    return this.blackHole;
  }

  /**
   * Select a celestial body by ID
   */
  selectBody(id: string | null, isCloseUp: boolean = false): void {
    this.selectedBodyId = id;

    for (const planet of this.planets.values()) {
      planet.setSelected(planet.data.id === id, isCloseUp);
    }
    for (const moon of this.moons.values()) {
      moon.setSelected(moon.data.id === id, isCloseUp);
    }
    for (const comet of this.comets.values()) {
      comet.setSelected(comet.data.id === id, isCloseUp);
    }
  }

  getSelectedBodyId(): string | null {
    return this.selectedBodyId;
  }

  /**
   * Raycast from mouse coordinates to pick planet, moon, or comet
   */
  raycast(raycaster: THREE.Raycaster): { id: string; type: 'planet' | 'moon' | 'comet'; object: THREE.Object3D } | null {
    // Check planets first
    const planetMeshes: THREE.Mesh[] = [];
    for (const p of this.planets.values()) {
      planetMeshes.push(p.bodyMesh);
    }
    const planetIntersects = raycaster.intersectObjects(planetMeshes, false);
    if (planetIntersects.length > 0) {
      const hit = planetIntersects[0].object;
      for (const p of this.planets.values()) {
        if (p.bodyMesh === hit) {
          return { id: p.data.id, type: 'planet', object: p.group };
        }
      }
    }

    // Check moons
    const moonMeshes: THREE.Mesh[] = [];
    for (const m of this.moons.values()) {
      moonMeshes.push(m.bodyMesh);
    }
    const moonIntersects = raycaster.intersectObjects(moonMeshes, false);
    if (moonIntersects.length > 0) {
      const hit = moonIntersects[0].object;
      for (const m of this.moons.values()) {
        if (m.bodyMesh === hit) {
          return { id: m.data.id, type: 'moon', object: m.group };
        }
      }
    }

    // Check comets
    if (this.cometsGroup.visible) {
      const cometMeshes: THREE.Mesh[] = [];
      for (const c of this.comets.values()) {
        cometMeshes.push(c.nucleusMesh);
      }
      const cometIntersects = raycaster.intersectObjects(cometMeshes, false);
      if (cometIntersects.length > 0) {
        const hit = cometIntersects[0].object;
        for (const c of this.comets.values()) {
          if (c.nucleusMesh === hit) {
            return { id: c.data.id, type: 'comet', object: c.group };
          }
        }
      }
    }

    return null;
  }
}
