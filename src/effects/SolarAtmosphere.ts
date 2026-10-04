import * as THREE from 'three';

export class SolarAtmosphere {
  public group: THREE.Group;
  private coronaMesh: THREE.Mesh;
  private sunRadius: number;

  constructor(sunRadius: number) {
    this.sunRadius = sunRadius;
    this.group = new THREE.Group();
    this.group.name = 'solar-atmosphere';

    // Soft, delicate golden starlight limb halo (clean & unobtrusive, no distracting particles or harsh rings)
    const geo = new THREE.SphereGeometry(sunRadius * 1.12, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffb703,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.coronaMesh = new THREE.Mesh(geo, mat);
    this.group.add(this.coronaMesh);
  }

  /**
   * Update subtle breathing animation each frame
   */
  public update(_deltaRealSec: number, _isSimPaused: boolean = false): void {
    const t = performance.now() * 0.0012;
    const pulse = 1.0 + Math.sin(t) * 0.02;
    this.coronaMesh.scale.set(pulse, pulse, pulse);
  }
}
