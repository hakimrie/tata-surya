import * as THREE from 'three';

export class Background {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.createStarfield();
    this.createMilkyWay();
  }

  private createStarfield(): void {
    const starCount = 6000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    // Spectral star colors (Blue-white, White, Yellow, Orange, Red)
    const spectralColors = [
      new THREE.Color('#9bb0ff'), // O/B star (blue-white)
      new THREE.Color('#bbccff'), // A star
      new THREE.Color('#f8f9fa'), // F star (white)
      new THREE.Color('#fff4e8'), // G star (sun-like yellow-white)
      new THREE.Color('#ffd2a1'), // K star (orange)
      new THREE.Color('#ffb56c'), // M star (red giant)
    ];

    const radius = 8000;

    for (let i = 0; i < starCount; i++) {
      // Uniform spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * (0.8 + 0.2 * Math.random());

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation based on stellar classification
      const colorIndex = Math.floor(Math.random() * spectralColors.length);
      const baseColor = spectralColors[colorIndex];
      const brightness = 0.5 + Math.random() * 0.5;

      colors[i * 3] = baseColor.r * brightness;
      colors[i * 3 + 1] = baseColor.g * brightness;
      colors[i * 3 + 2] = baseColor.b * brightness;

      // Variable star sizes
      sizes[i] = Math.random() < 0.05 ? 3.0 : 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Star texture using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const stars = new THREE.Points(geometry, material);
    this.group.add(stars);
  }

  private createMilkyWay(): void {
    // Subtle galactic dust band
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const bandRadius = 7500;
    const tilt = 0.6; // Tilt of galactic plane

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 1200;
      const r = bandRadius + (Math.random() - 0.5) * 1000;

      let x = Math.cos(angle) * r;
      let y = spread;
      let z = Math.sin(angle) * r;

      // Apply galactic plane tilt
      const yt = y * Math.cos(tilt) - z * Math.sin(tilt);
      const zt = y * Math.sin(tilt) + z * Math.cos(tilt);

      positions[i * 3] = x;
      positions[i * 3 + 1] = yt;
      positions[i * 3 + 2] = zt;

      // Dusty purple/blue/gold hue
      const t = Math.random();
      colors[i * 3] = 0.4 + 0.3 * t;
      colors[i * 3 + 1] = 0.3 + 0.2 * t;
      colors[i * 3 + 2] = 0.6 + 0.4 * t;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 14.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const milkyWay = new THREE.Points(geometry, material);
    this.group.add(milkyWay);
  }
}
