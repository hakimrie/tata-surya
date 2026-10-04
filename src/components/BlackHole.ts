import * as THREE from 'three';

export class BlackHole {
  public group: THREE.Group;
  public eventHorizonMesh: THREE.Mesh;
  public photonSphereMesh: THREE.Mesh;
  public accretionDiskMesh: THREE.Mesh;

  public radius: number;

  constructor(radius: number = 1.2) {
    this.radius = radius;
    this.group = new THREE.Group();
    this.group.name = 'black-hole';

    // 1. Event Horizon (Total blackness absorbing 100% of light)
    const horizonGeo = new THREE.SphereGeometry(radius, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.eventHorizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    this.group.add(this.eventHorizonMesh);

    // 2. Photon Sphere Ring (Gravitational deflection of light around horizon)
    const photonGeo = new THREE.RingGeometry(radius * 1.05, radius * 1.22, 64);
    photonGeo.rotateX(Math.PI / 2);
    const photonMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.photonSphereMesh = new THREE.Mesh(photonGeo, photonMat);
    this.group.add(this.photonSphereMesh);

    // 3. Relativistic Accretion Disk with Doppler Asymmetry
    const diskInner = radius * 1.5;
    const diskOuter = radius * 4.2;
    const diskGeo = new THREE.RingGeometry(diskInner, diskOuter, 96, 1);
    diskGeo.rotateX(-Math.PI / 2);

    // Procedural accretion disk texture with swirling hot plasma & Doppler beaming
    let diskTex: THREE.Texture;
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 512, 0);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)'); // Ultra-hot inner edge
        grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.85)');   // Cyan-blue ionizing plasma
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.7)');   // Amber relativistic gas
        grad.addColorStop(0.8, 'rgba(220, 38, 38, 0.4)');    // Cool outer red fringe
        grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 64);
        diskTex = new THREE.CanvasTexture(canvas);
      } else {
        diskTex = new THREE.Texture();
      }
    } else {
      diskTex = new THREE.Texture();
    }
    const diskMat = new THREE.MeshStandardMaterial({
      map: diskTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      roughness: 0.2,
      metalness: 0.1,
      blending: THREE.AdditiveBlending
    });

    this.accretionDiskMesh = new THREE.Mesh(diskGeo, diskMat);
    this.group.add(this.accretionDiskMesh);
  }

  public update(deltaRealSec: number): void {
    // Swirl accretion disk at relativistic speed
    this.accretionDiskMesh.rotation.y += 0.045;
    this.photonSphereMesh.rotation.y += 0.02;
  }
}
