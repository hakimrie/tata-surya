import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type CameraMode = 'free' | 'focus' | 'follow' | 'surface' | 'ecliptic-top';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;
  public mode: CameraMode = 'free';

  // Target object to follow/focus
  public targetObject: THREE.Object3D | null = null;
  public targetRadius: number = 10;

  // Smoothing interpolation state
  private isTransitioning: boolean = false;
  private transitionAlpha: number = 0;
  private startPosition = new THREE.Vector3();
  private startTarget = new THREE.Vector3();
  private destPosition = new THREE.Vector3();
  private destTarget = new THREE.Vector3();

  // Follow offset relative to moving body
  private followOffset = new THREE.Vector3(0, 15, 30);

  // Default camera home view
  public defaultPosition = new THREE.Vector3(0, 180, 320);
  public defaultTarget = new THREE.Vector3(0, 0, 0);

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 0.08;
    this.controls.maxDistance = 25000;
    this.controls.maxPolarAngle = Math.PI - 0.01;

    this.resetCamera(false);
    this.setupKeyboardListeners();
  }

  /**
   * Reset camera to bird's-eye Solar System overview
   */
  resetCamera(smooth = true): void {
    this.mode = 'free';
    this.targetObject = null;

    if (smooth) {
      this.startTransition(this.defaultPosition, this.defaultTarget);
    } else {
      this.camera.position.copy(this.defaultPosition);
      this.controls.target.copy(this.defaultTarget);
      this.controls.update();
    }
  }

  /**
   * Focus camera smoothly on a celestial object with cinematic framing and sunlit orientation
   */
  focusOnObject(
    obj: THREE.Object3D,
    radius: number,
    hasRings: boolean = false,
    axialTilt: number = 0
  ): void {
    this.targetObject = obj;
    this.targetRadius = Math.max(radius, 0.03);
    this.mode = 'focus';

    const objPos = new THREE.Vector3();
    obj.getWorldPosition(objPos);

    const distFromSun = Math.hypot(objPos.x, objPos.z);

    // Compute close cinematic framing distance:
    // Planets and moons fill ~65% - 75% of viewport height
    let viewDist: number;
    if (hasRings) {
      // Saturn rings extend to 2.42x planet radius
      // Total ring diameter is ~4.84 * radius
      viewDist = radius * 4.9;
    } else if (distFromSun < 1.0) {
      // Sun at origin
      viewDist = Math.max(radius * 2.5, 5.0);
    } else {
      // Regular planet or moon
      viewDist = Math.max(radius * 3.2, 0.25);
    }

    let destCamPos: THREE.Vector3;

    if (distFromSun < 1.0) {
      // Sun overview from isometric angle
      destCamPos = new THREE.Vector3(
        viewDist * 0.7,
        viewDist * 0.45,
        viewDist * 0.7
      );
    } else {
      // Position camera on the SUNLIT side of the planet:
      // -rHat points toward the Sun at (0, 0, 0)
      // Elevated above the orbital plane to view open rings and north polar details (matching Picture 1)
      const rHat = new THREE.Vector3(objPos.x / distFromSun, 0, objPos.z / distFromSun);
      const tHat = new THREE.Vector3(-objPos.z / distFromSun, 0, objPos.x / distFromSun);

      // ~37 degrees elevation above orbital plane (views the North Polar Hexagon and opens up the ring ellipse)
      const elevation = 0.65;
      // ~18 degrees phase angle for vibrant, direct sunlit illumination
      const phase = 0.32;

      const cosElev = Math.cos(elevation);
      const sinElev = Math.sin(elevation);
      const cosPhase = Math.cos(phase);
      const sinPhase = Math.sin(phase);

      const offset = new THREE.Vector3();
      // Towards Sun
      offset.addScaledVector(rHat, -viewDist * cosElev * cosPhase);
      // Tangential along orbit
      offset.addScaledVector(tHat, viewDist * cosElev * sinPhase);
      // Elevation
      offset.y += viewDist * sinElev;

      destCamPos = objPos.clone().add(offset);
    }

    // On desktop screens (>960px) where info panel occupies the right 380px,
    // offset camera and target slightly along camera-right so the planet is framed
    // dead-center in the open visible viewport!
    const destTarget = objPos.clone();
    if (window.innerWidth > 960 && distFromSun >= 1.0) {
      const fwd = new THREE.Vector3().subVectors(objPos, destCamPos).normalize();
      const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
      const shift = viewDist * 0.18;
      destTarget.addScaledVector(right, shift);
      destCamPos.addScaledVector(right, shift);
    }

    this.followOffset.copy(destCamPos).sub(objPos);
    this.startTransition(destCamPos, destTarget);
  }

  /**
   * Set follow mode: keeps target locked onto moving body
   */
  setFollowMode(
    obj: THREE.Object3D,
    radius: number,
    hasRings: boolean = false,
    axialTilt: number = 0
  ): void {
    this.focusOnObject(obj, radius, hasRings, axialTilt);
    this.mode = 'follow';
  }

  /**
   * View from planet surface looking out into space
   */
  viewFromSurface(obj: THREE.Object3D, radius: number): void {
    this.targetObject = obj;
    this.targetRadius = radius;
    this.mode = 'surface';

    const objPos = new THREE.Vector3();
    obj.getWorldPosition(objPos);

    // Surface position (slightly above surface)
    const surfacePos = new THREE.Vector3(
      objPos.x,
      objPos.y + radius * 1.05,
      objPos.z
    );

    // Looking towards the Sun at origin
    const lookTarget = new THREE.Vector3(0, 0, 0);

    this.startTransition(surfacePos, lookTarget);
  }

  /**
   * Set top-down perpendicular ecliptic view
   */
  setEclipticTopView(): void {
    this.mode = 'ecliptic-top';
    this.targetObject = null;

    const currentDist = this.camera.position.length();
    const destPos = new THREE.Vector3(0, Math.max(currentDist, 350), 0.001);
    const destTarget = new THREE.Vector3(0, 0, 0);

    this.startTransition(destPos, destTarget);
  }

  /**
   * Set wide-angle panoramic view framing the entire celestial sky dome and constellations
   */
  setConstellationOverview(): void {
    this.mode = 'free';
    this.targetObject = null;

    // Harmonious panoramic vantage point framing the 1200-radius celestial dome
    const destPos = new THREE.Vector3(0, 950, 1600);
    const destTarget = new THREE.Vector3(0, 0, 0);

    this.startTransition(destPos, destTarget);
  }

  private startTransition(destPos: THREE.Vector3, destTarget: THREE.Vector3): void {
    this.isTransitioning = true;
    this.transitionAlpha = 0;
    this.startPosition.copy(this.camera.position);
    this.startTarget.copy(this.controls.target);
    this.destPosition.copy(destPos);
    this.destTarget.copy(destTarget);
  }

  /**
   * Update called every frame
   */
  update(deltaSeconds: number): void {
    if (this.isTransitioning) {
      // Keep tracking moving destination while transition is underway
      if (this.targetObject) {
        const currentObjPos = new THREE.Vector3();
        this.targetObject.getWorldPosition(currentObjPos);
        const delta = currentObjPos.clone().sub(this.destTarget);
        this.destTarget.copy(currentObjPos);
        this.destPosition.add(delta);
      }

      // Smooth cubic ease out transition
      this.transitionAlpha += deltaSeconds * 2.2;
      if (this.transitionAlpha >= 1) {
        this.transitionAlpha = 1;
        this.isTransitioning = false;
      }

      // Smoothstep interpolation
      const t = this.transitionAlpha;
      const ease = t * t * (3 - 2 * t);

      this.camera.position.lerpVectors(this.startPosition, this.destPosition, ease);
      this.controls.target.lerpVectors(this.startTarget, this.destTarget, ease);
    } else if (this.targetObject && (this.mode === 'follow' || this.mode === 'focus')) {
      // Keep tracking moving body seamlessly with orbital motion
      // while allowing full user mouse rotation/pan via OrbitControls
      const currentObjPos = new THREE.Vector3();
      this.targetObject.getWorldPosition(currentObjPos);

      const delta = currentObjPos.clone().sub(this.controls.target);
      this.camera.position.add(delta);
      this.controls.target.copy(currentObjPos);
    } else if (this.targetObject && this.mode === 'surface') {
      const currentObjPos = new THREE.Vector3();
      this.targetObject.getWorldPosition(currentObjPos);
      const surfacePos = new THREE.Vector3(
        currentObjPos.x,
        currentObjPos.y + this.targetRadius * 1.02,
        currentObjPos.z
      );
      this.camera.position.copy(surfacePos);
    }

    this.controls.update();
  }

  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => {
      // Don't intercept typing in input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'r':
        case 'R':
          this.resetCamera(true);
          break;
        case '+':
        case '=':
          this.camera.position.multiplyScalar(0.85);
          break;
        case '-':
        case '_':
          this.camera.position.multiplyScalar(1.15);
          break;
      }
    });
  }
}
