import * as THREE from 'three';

export interface ConstellationDefinition {
  id: string;
  name: string;
  indonesianName: string;
  indigenousName?: string;
  indigenousDescription?: string;
  stars: [number, number, number][]; // normalized spherical coords [raDeg, decDeg, brightness]
  lines: [number, number][];         // index pairs connecting stars
}

export const CONSTELLATIONS_DATA: ConstellationDefinition[] = [
  // 1. CRUX / SOUTHERN CROSS (Bintang Pari / Gubuk Penceng - Iconic Indonesian Navigation Asterism!)
  {
    id: 'crux',
    name: 'Crux (Southern Cross)',
    indonesianName: 'Rasi Pari / Gubuk Penceng (Crux)',
    indigenousName: 'Bintang Pari / Gubuk Penceng',
    indigenousDescription: 'Penunjuk arah Selatan sejati bagi pelaut Bugis, Jawa, dan Nusantara kuno.',
    stars: [
      [186.5, -63.1, 1.0], // Acrux (Alpha Crucis)
      [192.1, -59.7, 0.9], // Mimosa (Beta Crucis)
      [187.8, -57.1, 0.9], // Gacrux (Gamma Crucis)
      [183.8, -58.7, 0.8], // Delta Crucis
      [185.0, -60.4, 0.6]  // Epsilon Crucis
    ],
    lines: [
      [0, 2], // Acrux to Gacrux (points directly to South Celestial Pole!)
      [1, 3], // Mimosa to Delta Crucis
      [0, 4]
    ]
  },
  // 2. ORION (The Hunter / Bintang Waluku / Bajak Sawah)
  {
    id: 'orion',
    name: 'Orion',
    indonesianName: 'Rasi Waluku / Pemburu (Orion)',
    indigenousName: 'Bintang Waluku / Bajak',
    indigenousDescription: 'Penanda musim tanam padi (Pranata Mangsa) oleh petani tradisional Jawa dan Sunda.',
    stars: [
      [88.8, 7.4, 1.2],   // Betelgeuse (Alpha Orionis)
      [78.6, -8.2, 1.2],  // Rigel (Beta Orionis)
      [81.3, 6.3, 0.9],   // Bellatrix (Gamma Orionis)
      [86.9, -9.7, 0.9],  // Saiph (Kappa Orionis)
      [83.0, -0.3, 1.0],  // Mintaka (Belt 1)
      [84.1, -1.2, 1.0],  // Alnilam (Belt 2)
      [85.2, -1.9, 1.0]   // Alnitak (Belt 3)
    ],
    lines: [
      [0, 2], [2, 4], [4, 5], [5, 6], [6, 1],
      [0, 6], [1, 3], [3, 6]
    ]
  },
  // 3. URSA MAJOR (The Great Bear / Bintang Biduk / Bintang Jong)
  {
    id: 'ursa-major',
    name: 'Ursa Major (Big Dipper)',
    indonesianName: 'Rasi Biduk / Beruang Besar (Ursa Major)',
    indigenousName: 'Bintang Biduk / Prahu Pecah',
    indigenousDescription: 'Penunjuk arah Utara sejati di belahan langit utara.',
    stars: [
      [165.9, 61.8, 1.0], // Dubhe (Pointer to Polaris)
      [165.5, 56.4, 0.9], // Merak (Pointer to Polaris)
      [178.5, 53.7, 0.9], // Phecda
      [183.9, 57.0, 0.8], // Megrez
      [193.5, 56.0, 1.0], // Alioth
      [200.0, 54.9, 0.9], // Mizar
      [206.9, 49.3, 1.0]  // Alkaid
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], // Dipper Bowl
      [3, 4], [4, 5], [5, 6]          // Handle
    ]
  },
  // 4. CASSIOPEIA (The Queen)
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    indonesianName: 'Rasi Kasiopeia (W shape)',
    stars: [
      [9.3, 59.2, 0.9],   // Caph
      [10.1, 56.5, 1.0],  // Schedar
      [14.2, 60.7, 0.9],  // Gamma Cas
      [20.4, 60.2, 0.8],  // Ruchbah
      [26.2, 63.7, 0.8]   // Segin
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  // 5. SCORPIUS (The Scorpion / Bintang Kalajengking)
  {
    id: 'scorpius',
    name: 'Scorpius',
    indonesianName: 'Rasi Kalajengking (Scorpius)',
    stars: [
      [247.4, -26.4, 1.2], // Antares (Alpha Scorpii - Red Supergiant)
      [241.4, -22.6, 0.8], // Graffias
      [240.8, -19.8, 0.8], // Dschubba
      [252.1, -38.0, 0.9], // Wei
      [264.3, -43.0, 0.9], // Shaula (Stinger)
      [263.4, -37.3, 0.8]  // Sargas
    ],
    lines: [
      [2, 1], [1, 0], [0, 3], [3, 5], [5, 4]
    ]
  },
  // 6. CYGNUS (The Swan / Northern Cross)
  {
    id: 'cygnus',
    name: 'Cygnus',
    indonesianName: 'Rasi Angsa (Cygnus)',
    stars: [
      [310.4, 45.3, 1.2],  // Deneb
      [305.6, 40.3, 0.9],  // Sadr
      [290.3, 28.0, 0.9],  // Albireo
      [294.9, 45.1, 0.8],  // Fawaris
      [313.4, 30.2, 0.8]   // Gienah
    ],
    lines: [
      [0, 1], [1, 2], [3, 1], [1, 4]
    ]
  }
];

export class Constellations {
  public group: THREE.Group;
  private linesGroup: THREE.Group;
  private radius = 1200; // Harmonious celestial dome scale (8x larger than Neptune, visible in complete panorama)

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'constellations';
    this.linesGroup = new THREE.Group();
    this.group.add(this.linesGroup);

    this.buildConstellations();
  }

  private static createStarTexture(): THREE.Texture | undefined {
    if (typeof document === 'undefined') return undefined;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(210, 235, 255, 0.9)');
    grad.addColorStop(0.6, 'rgba(100, 180, 255, 0.35)');
    grad.addColorStop(1, 'rgba(0, 40, 120, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  private buildConstellations(): void {
    const constellations = CONSTELLATIONS_DATA;
    const starTex = Constellations.createStarTexture();

    for (const c of constellations) {
      const starVecs: THREE.Vector3[] = [];

      for (const [raDeg, decDeg] of c.stars) {
        const raRad = (raDeg * Math.PI) / 180;
        const decRad = (decDeg * Math.PI) / 180;

        const x = this.radius * Math.cos(decRad) * Math.cos(raRad);
        const y = this.radius * Math.sin(decRad);
        const z = this.radius * Math.cos(decRad) * Math.sin(raRad);

        starVecs.push(new THREE.Vector3(x, y, z));
      }

      // Constellation lines
      const linePositions: number[] = [];
      for (const [i1, i2] of c.lines) {
        const p1 = starVecs[i1];
        const p2 = starVecs[i2];
        if (p1 && p2) {
          linePositions.push(p1.x, p1.y, p1.z);
          linePositions.push(p2.x, p2.y, p2.z);
        }
      }

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      // Glow color: special cyan for Indonesian indigenous asterisms (Crux & Orion/Waluku)
      const isIndo = !!c.indigenousName;
      const lineMat = new THREE.LineBasicMaterial({
        color: isIndo ? 0x38bdf8 : 0x64748b,
        transparent: true,
        opacity: isIndo ? 0.55 : 0.28,
        blending: THREE.AdditiveBlending
      });

      const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
      lineMesh.name = `constellation-${c.id}`;
      this.linesGroup.add(lineMesh);

      // Star point markers (glowing circular stars at constellation vertices)
      const starPositions: number[] = [];
      for (const p of starVecs) {
        starPositions.push(p.x, p.y, p.z);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: isIndo ? 0xbae6fd : 0xf1f5f9,
        size: 10,
        sizeAttenuation: false, // Ensures stars remain sharp, constant glittering points like real stars
        ...(starTex ? { map: starTex } : {}),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const starPoints = new THREE.Points(starGeo, starMat);
      this.linesGroup.add(starPoints);

      // Constellation text label
      if (typeof document !== 'undefined') {
        const center = new THREE.Vector3();
        for (const p of starVecs) center.add(p);
        center.divideScalar(starVecs.length);

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = isIndo ? '#38bdf8' : '#94a3b8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const labelText = c.indigenousName ? `⭐ ${c.indigenousName}` : c.name;
          ctx.fillText(labelText, 128, 32);

          const tex = new THREE.CanvasTexture(canvas);
          const spriteMat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
          });
          const sprite = new THREE.Sprite(spriteMat);
          sprite.position.copy(center).multiplyScalar(0.96);
          sprite.scale.set(120, 30, 1);
          this.linesGroup.add(sprite);
        }
      }
    }
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }
}
