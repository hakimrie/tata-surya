import * as THREE from 'three';
import { Background } from './Background';
import { SolarSystem } from '../components/SolarSystem';
import { CameraController } from '../components/CameraController';
import { GravityEngine } from '../physics/GravityEngine';

export class SolarSystemScene {
  public container: HTMLElement;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public cameraController: CameraController;

  public background: Background;
  public solarSystem: SolarSystem;

  public sunLight: THREE.PointLight;
  public ambientLight: THREE.AmbientLight;
  public focusedLight: THREE.DirectionalLight;
  public focusedLightTarget: THREE.Object3D;
  private focusedLightHasRings: boolean = false;
  private focusedLightAxialTilt: number = 0;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Animation frame loop
  private animationFrameId: number | null = null;
  private lastTime = 0;

  // Callback on object clicked
  public onSelectObject?: (id: string, type: 'planet' | 'moon') => void;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020208);

    // 2. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 30000);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Camera Controller
    this.cameraController = new CameraController(this.camera, this.renderer.domElement);

    // 5. Lighting
    // Ambient light: realistic planetary reflection and deep space starlight illumination
    this.ambientLight = new THREE.AmbientLight(0x4a6080, 0.65);
    this.scene.add(this.ambientLight);

    // Sun light: Point light at origin radiating outward
    this.sunLight = new THREE.PointLight(0xffffff, 2.5, 0, 0.0001);
    this.sunLight.position.set(0, 0, 0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.scene.add(this.sunLight);

    // Dedicated directional sunlight for focused close-ups
    // Casts razor-sharp shadows of planet globe onto rings (Picture 1 quality!)
    this.focusedLight = new THREE.DirectionalLight(0xffffff, 2.8);
    this.focusedLight.castShadow = true;
    this.focusedLight.shadow.mapSize.width = 2048;
    this.focusedLight.shadow.mapSize.height = 2048;
    this.focusedLight.shadow.bias = -0.0001;
    this.focusedLight.shadow.radius = 1.2;
    this.focusedLight.visible = false;
    this.scene.add(this.focusedLight);

    this.focusedLightTarget = new THREE.Object3D();
    this.scene.add(this.focusedLightTarget);
    this.focusedLight.target = this.focusedLightTarget;

    // 6. Background (Starfield + Milky Way)
    this.background = new Background();
    this.scene.add(this.background.group);

    // 7. Solar System
    this.solarSystem = new SolarSystem();
    this.scene.add(this.solarSystem.group);

    // 8. Event listeners
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onResize);

    const canvas = this.renderer.domElement;
    let pointerDownPos = { x: 0, y: 0 };

    canvas.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('pointerup', (e) => {
      // Differentiate between click and drag
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist < 5) {
        this.handleClick(e);
      }
    });
  }

  private onResize = (): void => {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private handleClick(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hit = this.solarSystem.raycast(this.raycaster);

    if (hit) {
      this.solarSystem.selectBody(hit.id);
      if (this.onSelectObject) {
        this.onSelectObject(hit.id, hit.type);
      }
    }
  }

  /**
   * Update focused light directional shadow caster towards planet
   */
  updateFocusedLight(
    targetGroup: THREE.Object3D,
    radius: number,
    hasRings: boolean = false,
    axialTilt: number = 0
  ): void {
    this.focusedLightHasRings = hasRings;
    this.focusedLightAxialTilt = axialTilt;

    const pos = new THREE.Vector3();
    targetGroup.getWorldPosition(pos);
    const dist = Math.hypot(pos.x, pos.z);
    if (dist < 1.0) {
      this.disableFocusedLight();
      return;
    }

    const dir = new THREE.Vector3(pos.x / dist, 0, pos.z / dist);

    let sunDir: THREE.Vector3;
    if (hasRings) {
      // For ringed planets (Saturn), illuminate from authentic northern summer sun direction
      // (elevated ~20 degrees above ring plane with slight azimuthal offset)
      // This produces the iconic, dramatic curved shadow cast by the planet onto the back-right rings (Picture 1)!
      const tiltRad = (axialTilt * Math.PI) / 180;
      const northPole = new THREE.Vector3(-Math.sin(tiltRad), Math.cos(tiltRad), 0);
      const orbitTangent = new THREE.Vector3(-dir.z, 0, dir.x);
      sunDir = new THREE.Vector3()
        .sub(dir)
        .addScaledVector(orbitTangent, -0.35)
        .addScaledVector(northPole, 0.42)
        .normalize();
    } else {
      sunDir = dir.clone().negate().normalize();
    }

    // Position light source 24 units along sunDir
    this.focusedLight.position.copy(pos).addScaledVector(sunDir, 24);
    this.focusedLightTarget.position.copy(pos);

    // Generous orthographic shadow camera bounds enclosing entire planet and outer rings
    const box = Math.max(radius * 2.5, 10.0);
    this.focusedLight.shadow.camera.left = -box;
    this.focusedLight.shadow.camera.right = box;
    this.focusedLight.shadow.camera.top = box;
    this.focusedLight.shadow.camera.bottom = -box;
    this.focusedLight.shadow.camera.near = 1;
    this.focusedLight.shadow.camera.far = 60;
    this.focusedLight.shadow.bias = 0.00005;
    this.focusedLight.shadow.normalBias = 0.02;
    this.focusedLight.shadow.camera.updateProjectionMatrix();

    this.focusedLight.intensity = 2.8;
    this.focusedLight.visible = true;

    // Suppress coarse cubemap PointLight during close-up focus so the high-resolution
    // 2048x2048 directional shadow is razor sharp with zero light leakage
    this.sunLight.intensity = 0.0;
    this.sunLight.castShadow = false;
  }

  disableFocusedLight(): void {
    this.focusedLight.visible = false;
    this.focusedLightHasRings = false;
    this.sunLight.intensity = 2.5;
    this.sunLight.castShadow = true;
  }

  /**
   * Focus camera on planet or moon by id
   */
  focusOn(id: string): void {
    this.solarSystem.selectBody(id, true);

    const planet = this.solarSystem.planets.get(id);
    if (planet) {
      const radius = planet.visualRadius || 5;
      this.cameraController.focusOnObject(
        planet.group,
        radius,
        planet.data.hasRings,
        planet.data.axialTilt
      );
      this.updateFocusedLight(
        planet.group,
        radius * (planet.data.hasRings ? 2.5 : 1.2),
        planet.data.hasRings,
        planet.data.axialTilt
      );
      return;
    }

    const moon = this.solarSystem.moons.get(id);
    if (moon) {
      const radius = moon.visualRadius || 0.12;
      this.cameraController.focusOnObject(moon.group, radius, false, 0);
      this.updateFocusedLight(moon.group, radius * 1.5, false, 0);
    }
  }

  /**
   * Follow orbit of planet or moon by id
   */
  follow(id: string): void {
    this.focusOn(id);
  }

  /**
   * View from planet surface
   */
  viewFromSurface(id: string): void {
    this.solarSystem.selectBody(id);
    const planet = this.solarSystem.planets.get(id);
    if (planet) {
      const radius = planet.visualRadius || 5;
      this.cameraController.viewFromSurface(planet.group, radius);
      this.disableFocusedLight();
    }
  }

  /**
   * Start rendering animation loop
   */
  start(onFrameUpdate: (deltaRealSec: number) => void): void {
    this.lastTime = performance.now();

    const loop = (currentTime: number) => {
      const deltaRealSec = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;

      // Update camera smooth movement
      this.cameraController.update(deltaRealSec);

      // Keep focused light tracking moving target
      if (this.focusedLight.visible && this.cameraController.targetObject) {
        const pos = new THREE.Vector3();
        this.cameraController.targetObject.getWorldPosition(pos);
        const dist = Math.hypot(pos.x, pos.z);
        if (dist > 1.0) {
          const dir = new THREE.Vector3(pos.x / dist, 0, pos.z / dist);
          let sunDir: THREE.Vector3;
          if (this.focusedLightHasRings) {
            const tiltRad = (this.focusedLightAxialTilt * Math.PI) / 180;
            const northPole = new THREE.Vector3(-Math.sin(tiltRad), Math.cos(tiltRad), 0);
            const orbitTangent = new THREE.Vector3(-dir.z, 0, dir.x);
            sunDir = new THREE.Vector3()
              .sub(dir)
              .addScaledVector(orbitTangent, -0.35)
              .addScaledVector(northPole, 0.42)
              .normalize();
          } else {
            sunDir = dir.clone().negate().normalize();
          }
          this.focusedLight.position.copy(pos).addScaledVector(sunDir, 24);
          this.focusedLightTarget.position.copy(pos);
        }
      }

      // User simulation update callback
      onFrameUpdate(deltaRealSec);

      // Render Three.js scene
      this.renderer.render(this.scene, this.camera);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
