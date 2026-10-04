import * as THREE from 'three';

export class TextureGenerator {
  private static cache: Map<string, THREE.Texture> = new Map();

  /**
   * Get or create procedural texture by type
   */
  static getTexture(type: string): THREE.Texture {
    if (this.cache.has(type)) {
      return this.cache.get(type)!;
    }

    if (typeof document === 'undefined') {
      const dummy = new THREE.Texture();
      this.cache.set(type, dummy);
      return dummy;
    }

    let texture: THREE.Texture;
    switch (type) {
      case 'sun':
        texture = this.createSunTexture();
        break;
      case 'mercury':
        texture = this.createMercuryTexture();
        break;
      case 'venus':
        texture = this.createVenusTexture();
        break;
      case 'earth':
        texture = this.createEarthTexture();
        break;
      case 'mars':
        texture = this.createMarsTexture();
        break;
      case 'jupiter':
        texture = this.createJupiterTexture();
        break;
      case 'saturn':
        texture = this.createSaturnTexture();
        break;
      case 'saturn-ring':
        texture = this.createSaturnRingTexture();
        break;
      case 'uranus':
        texture = this.createUranusTexture();
        break;
      case 'neptune':
        texture = this.createNeptuneTexture();
        break;
      case 'pluto':
        texture = this.createPlutoTexture();
        break;
      case 'moon':
        texture = this.createMoonTexture();
        break;
      case 'io':
        texture = this.createIoTexture();
        break;
      case 'europa':
        texture = this.createEuropaTexture();
        break;
      case 'titan':
        texture = this.createTitanTexture();
        break;
      case 'ganymede':
        texture = this.createGanymedeTexture();
        break;
      case 'callisto':
        texture = this.createCallistoTexture();
        break;
      case 'enceladus':
        texture = this.createEnceladusTexture();
        break;
      case 'phobos':
        texture = this.createPhobosTexture();
        break;
      case 'triton':
        texture = this.createTritonTexture();
        break;
      case 'asteroid-sprite':
        texture = this.createAsteroidSpriteTexture();
        break;
      case 'asteroid-rock':
        texture = this.createAsteroidRockTexture();
        break;
      default:
        texture = this.createDefaultTexture();
        break;
    }

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    this.cache.set(type, texture);
    return texture;
  }

  private static createCanvas(w = 1024, h = 512): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    return { canvas, ctx };
  }

  // --- SUN ---
  private static createSunTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(1024, 512);
    // Fiery solar surface
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ff9900');
    grad.addColorStop(0.5, '#ffcc00');
    grad.addColorStop(1, '#ff7700');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Turbulent solar flares and granulation cells
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = 2 + Math.random() * 10;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 200, 0.25)' : 'rgba(200, 50, 0, 0.2)';
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  // --- MERCURY ---
  private static createMercuryTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(512, 256);
    ctx.fillStyle = '#8f867e';
    ctx.fillRect(0, 0, 512, 256);

    // Impact craters and basalt plains
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const r = 1 + Math.random() * 14;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(50, 45, 40, 0.4)' : 'rgba(210, 200, 190, 0.35)';
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  // --- VENUS ---
  private static createVenusTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(512, 256);
    ctx.fillStyle = '#e8c89b';
    ctx.fillRect(0, 0, 512, 256);

    // Flowing sulfuric cloud swirls
    for (let y = 0; y < 256; y += 4) {
      const wave = Math.sin(y * 0.05) * 20;
      ctx.fillStyle = (y % 8 === 0) ? 'rgba(215, 170, 110, 0.4)' : 'rgba(255, 240, 210, 0.35)';
      ctx.fillRect(0, y, 512, 4);
    }
    return new THREE.CanvasTexture(canvas);
  }

  // --- EARTH ---
  private static createEarthTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(1024, 512);
    // Deep blue ocean
    const seaGrad = ctx.createLinearGradient(0, 0, 0, 512);
    seaGrad.addColorStop(0, '#0a2342');
    seaGrad.addColorStop(0.5, '#124559');
    seaGrad.addColorStop(1, '#0a2342');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Continents & landmasses
    ctx.fillStyle = '#2d6a4f';
    const continents = [
      { x: 260, y: 180, rx: 90, ry: 70 },   // North America
      { x: 330, y: 340, rx: 70, ry: 90 },   // South America
      { x: 530, y: 150, rx: 80, ry: 50 },   // Europe
      { x: 540, y: 270, rx: 90, ry: 90 },   // Africa
      { x: 720, y: 160, rx: 140, ry: 80 },  // Asia
      { x: 790, y: 250, rx: 60, ry: 20 },   // Southeast Asia & Indonesia archipelago
      { x: 820, y: 360, rx: 65, ry: 50 },   // Australia
    ];

    for (const c of continents) {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mountain / desert tint
      ctx.fillStyle = '#7f5539';
      ctx.beginPath();
      ctx.ellipse(c.x + 10, c.y - 10, c.rx * 0.5, c.ry * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2d6a4f';
    }

    // Indonesia archipelago specifically highlighted!
    ctx.fillStyle = '#52b788';
    ctx.beginPath();
    ctx.ellipse(780, 260, 45, 12, 0.2, 0, Math.PI * 2); // Sumatra, Java, Kalimantan
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(820, 265, 30, 10, -0.1, 0, Math.PI * 2); // Sulawesi, Papua
    ctx.fill();

    // Delicate swirling atmospheric white clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    for (let i = 0; i < 45; i++) {
      const cx = Math.random() * 1024;
      const cy = 60 + Math.random() * 392;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 25 + Math.random() * 50, 6 + Math.random() * 12, Math.random() * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    // Polar ice caps
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 1024, 35); // North pole
    ctx.fillRect(0, 477, 1024, 35); // South pole (Antarctica)

    return new THREE.CanvasTexture(canvas);
  }

  // --- MARS ---
  private static createMarsTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(512, 256);
    // Reddish iron-oxide terrain
    ctx.fillStyle = '#c1440e';
    ctx.fillRect(0, 0, 512, 256);

    // Darker basaltic maria
    ctx.fillStyle = 'rgba(80, 25, 10, 0.5)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 512;
      const y = 80 + Math.random() * 100;
      ctx.beginPath();
      ctx.ellipse(x, y, 40 + Math.random() * 70, 20 + Math.random() * 40, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Polar ice caps (CO2 dry ice + water ice)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(256, 10, 80, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(256, 246, 70, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // --- JUPITER ---
  private static createJupiterTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(1024, 512);

    // Alternating cloud belts (zones and belts)
    const bandColors = [
      '#e3d5ca', '#d5bdaf', '#b07d62', '#8d5b4c', '#e3d5ca',
      '#d4a373', '#bc6c25', '#dda15e', '#fefae0', '#bc6c25',
      '#99582a', '#d4a373', '#e3d5ca', '#b07d62', '#d5bdaf'
    ];

    const h = 512 / bandColors.length;
    for (let i = 0; i < bandColors.length; i++) {
      ctx.fillStyle = bandColors[i];
      ctx.fillRect(0, i * h, 1024, h + 1);

      // Add turbulence within band
      for (let j = 0; j < 30; j++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        const tx = Math.random() * 1024;
        const ty = i * h + Math.random() * h;
        ctx.fillRect(tx, ty, 30 + Math.random() * 50, 4);
      }
    }

    // Great Red Spot (Bintik Merah Raksasa)
    ctx.fillStyle = '#a83232';
    ctx.beginPath();
    ctx.ellipse(650, 320, 55, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red spot inner vortex
    ctx.fillStyle = '#d94e34';
    ctx.beginPath();
    ctx.ellipse(650, 320, 35, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // --- SATURN ---
  private static createSaturnTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(1024, 512);

    // Warm golden-amber atmospheric base gradient with authentic Saturnian coloration
    // Saturn's cloud deck consists of ammonia crystal hazes, phosphine, and hydrocarbons.
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.00, '#6d7248'); // North polar hood (sage/olive)
    grad.addColorStop(0.08, '#828755'); // North polar zone
    grad.addColorStop(0.12, '#b29158'); // North north temperate belt
    grad.addColorStop(0.18, '#caa060'); // North temperate zone
    grad.addColorStop(0.26, '#be8e4a'); // North tropical belt
    grad.addColorStop(0.35, '#dcb26c'); // North equatorial belt
    grad.addColorStop(0.44, '#eed59b'); // Equatorial zone (radiant honey-cream)
    grad.addColorStop(0.50, '#f8e4b5'); // Equator core (brightest)
    grad.addColorStop(0.56, '#ecd192'); // Equatorial zone south
    grad.addColorStop(0.65, '#c99650'); // South equatorial belt
    grad.addColorStop(0.74, '#b8823f'); // South tropical belt
    grad.addColorStop(0.82, '#ca9c5a'); // South temperate zone
    grad.addColorStop(0.90, '#9e7a42'); // South polar transition
    grad.addColorStop(1.00, '#755c32'); // South polar cap
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Latitudinal fluid wave bands (Rossby waves & cloud turbulence)
    const bandList = [
      { y: 55, h: 14, color: 'rgba(175, 140, 85, 0.35)' },
      { y: 78, h: 10, color: 'rgba(215, 180, 120, 0.40)' },
      { y: 98, h: 22, color: 'rgba(165, 120, 60, 0.30)' },
      { y: 130, h: 18, color: 'rgba(195, 150, 85, 0.35)' },
      { y: 160, h: 25, color: 'rgba(170, 125, 65, 0.40)' },
      { y: 195, h: 15, color: 'rgba(235, 205, 150, 0.45)' },
      { y: 220, h: 30, color: 'rgba(255, 240, 200, 0.35)' },
      { y: 260, h: 28, color: 'rgba(255, 245, 210, 0.40)' },
      { y: 300, h: 20, color: 'rgba(180, 135, 75, 0.35)' },
      { y: 330, h: 26, color: 'rgba(160, 115, 55, 0.40)' },
      { y: 370, h: 18, color: 'rgba(205, 165, 105, 0.35)' },
      { y: 405, h: 24, color: 'rgba(150, 110, 55, 0.40)' },
      { y: 440, h: 16, color: 'rgba(185, 145, 85, 0.30)' },
      { y: 465, h: 20, color: 'rgba(130, 95, 45, 0.35)' }
    ];

    for (const b of bandList) {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.moveTo(0, b.y);
      for (let x = 0; x <= 1024; x += 16) {
        const wave =
          Math.sin(x * 0.02) * 2.5 +
          Math.cos(x * 0.05 + b.y) * 1.5 +
          Math.sin(x * 0.08) * 0.8;
        ctx.lineTo(x, b.y + wave);
      }
      ctx.lineTo(1024, b.y + b.h);
      for (let x = 1024; x >= 0; x -= 16) {
        const wave =
          Math.sin(x * 0.02) * 2.5 +
          Math.cos(x * 0.05 + b.y) * 1.5 +
          Math.sin(x * 0.08) * 0.8;
        ctx.lineTo(x, b.y + b.h + wave);
      }
      ctx.closePath();
      ctx.fill();
    }

    // Authentic North Polar Hexagon (6-fold symmetric polar jet stream at ~78° N)
    // In equirectangular projection, pole is at y = 0, longitude lambda = x / 1024 * 2pi.
    const hexRadius0 = 46; // pixel radius from north pole (y = 0)
    ctx.fillStyle = '#6a6e43';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, hexRadius0);
    for (let x = 0; x <= 1024; x += 4) {
      const lambda = (x / 1024) * Math.PI * 2;
      // 6-fold symmetric boundary formula
      const modAngle = ((lambda + Math.PI / 6) % (Math.PI / 3)) - Math.PI / 6;
      const hexY = (hexRadius0 * Math.cos(Math.PI / 6)) / Math.cos(modAngle);
      ctx.lineTo(x, hexY);
    }
    ctx.lineTo(1024, 0);
    ctx.closePath();
    ctx.fill();

    // Hexagon bright golden jet-stream ribbon border
    ctx.strokeStyle = '#b2a562';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = 0; x <= 1024; x += 4) {
      const lambda = (x / 1024) * Math.PI * 2;
      const modAngle = ((lambda + Math.PI / 6) % (Math.PI / 3)) - Math.PI / 6;
      const hexY = (hexRadius0 * Math.cos(Math.PI / 6)) / Math.cos(modAngle);
      if (x === 0) ctx.moveTo(x, hexY);
      else ctx.lineTo(x, hexY);
    }
    ctx.stroke();

    // Central polar storm vortex eye (dark hurricane at pole)
    ctx.fillStyle = '#3c4022';
    ctx.fillRect(0, 0, 1024, 12);
    ctx.fillStyle = '#525730';
    ctx.fillRect(0, 12, 1024, 10);

    // Delicate ammonia cloud wisps across temperate & equatorial zones
    for (let i = 0; i < 350; i++) {
      const x = Math.random() * 1024;
      const y = 80 + Math.random() * 340;
      const len = 30 + Math.random() * 90;
      const isLight = Math.random() > 0.45;
      ctx.fillStyle = isLight ? 'rgba(255, 245, 220, 0.12)' : 'rgba(150, 100, 40, 0.09)';
      ctx.fillRect(x, y, len, 1.5);
    }

    return new THREE.CanvasTexture(canvas);
  }

  // --- SATURN RINGS ---
  private static createSaturnRingTexture(): THREE.Texture {
    // 2048x64 high-resolution concentric ring texture
    // Horizontal axis maps to radial distance from inner to outer ring edge.
    const { canvas, ctx } = this.createCanvas(2048, 64);
    const imgData = ctx.createImageData(2048, 64);
    const data = imgData.data;

    // Precalculate radial color profile for each column x
    const rCol = new Uint8Array(2048);
    const gCol = new Uint8Array(2048);
    const bCol = new Uint8Array(2048);
    const aCol = new Uint8Array(2048);

    for (let x = 0; x < 2048; x++) {
      const u = x / 2048; // normalized radial position (0 = inner edge, 1 = outer edge)
      let r = 0, g = 0, b = 0, a = 0;

      if (u < 0.040) {
        // Inner clearance / faint D-ring edge
        a = 0;
      } else if (u < 0.240) {
        // C Ring (Crepe Ring): Translucent dark smoky amber / bronze charcoal (globe visible behind it)
        const t = (u - 0.040) / (0.240 - 0.040);
        // Colombo Gap notch near u = 0.135
        const inGap = Math.abs(u - 0.135) < 0.007;
        if (inGap) {
          r = 35; g = 30; b = 25; a = 0;
        } else {
          const micro = 1.0 + 0.12 * Math.sin(x * 0.4) + 0.06 * Math.sin(x * 1.6);
          r = Math.min(255, Math.floor((140 + t * 35) * micro));
          g = Math.min(255, Math.floor((125 + t * 30) * micro));
          b = Math.min(255, Math.floor((105 + t * 25) * micro));
          a = Math.min(255, Math.floor((60 + t * 50) * micro));
        }
      } else if (u < 0.252) {
        // Maxwell Gap (boundary between C and B rings)
        r = 25; g = 20; b = 15; a = 0;
      } else if (u < 0.658) {
        // B Ring: The broadest, brightest, and densest ring!
        const t = (u - 0.252) / (0.658 - 0.252);
        // Micro-ringlet density modulation (thousands of delicate concentric ringlets)
        const micro =
          1.0 +
          0.14 * Math.sin(x * 0.26) +
          0.09 * Math.cos(x * 0.68 + 0.6) +
          0.05 * Math.sin(x * 1.9) +
          0.035 * Math.cos(x * 4.4) +
          0.02 * Math.sin(x * 11.5);

        // Core of B Ring has brilliant golden reflectivity matching reference photo
        const bell = Math.sin(t * Math.PI);
        r = Math.min(255, Math.floor((228 + bell * 26) * micro));
        g = Math.min(255, Math.floor((208 + bell * 24) * micro));
        b = Math.min(255, Math.floor((172 + bell * 22) * micro));
        a = Math.min(255, Math.floor((235 + bell * 20) * micro));
      } else if (u < 0.725) {
        // CASSINI DIVISION: Famous 4,800-km gap between B and A rings
        // In reality and reference photo, this is a clear transparent space!
        if (u >= 0.665 && u <= 0.718) {
          // Pure transparent void: deep space / planet behind shows completely
          a = 0;
        } else {
          // Delicate smooth edge falloff
          const edgeDist = u < 0.665 ? (u - 0.658) / 0.007 : (0.725 - u) / 0.007;
          const alphaFade = Math.pow(1.0 - edgeDist, 2);
          r = 75; g = 65; b = 50;
          a = Math.floor(60 * (1.0 - alphaFade));
        }
      } else if (u < 0.945) {
        // A Ring: Silvery-gold outer ring with Encke and Keeler gaps
        if (u >= 0.872 && u <= 0.888) {
          // Encke Gap (325 km wide sharp gap - clear space)
          a = 0;
        } else if (u >= 0.932 && u <= 0.938) {
          // Keeler Gap (42 km gap near outer edge - clear space)
          a = 0;
        } else {
          const t = (u - 0.725) / (0.945 - 0.725);
          const micro =
            1.0 +
            0.12 * Math.sin(x * 0.28) +
            0.07 * Math.cos(x * 1.15) +
            0.04 * Math.sin(x * 3.6) +
            0.02 * Math.sin(x * 9.8);
          r = Math.min(255, Math.floor((208 + t * 16) * micro));
          g = Math.min(255, Math.floor((192 + t * 15) * micro));
          b = Math.min(255, Math.floor((162 + t * 12) * micro));
          a = Math.min(255, Math.floor((205 - t * 20) * micro));
        }
      } else if (u < 0.965) {
        // Clearance outside A Ring (Roche Division)
        a = 0;
      } else if (u < 0.985) {
        // F Ring: Delicate shepherd ringlet
        const t = Math.exp(-Math.pow((u - 0.975) / 0.005, 2));
        r = 210; g = 195; b = 165;
        a = Math.floor(t * 150);
      } else {
        // Outer space
        a = 0;
      }

      rCol[x] = r;
      gCol[x] = g;
      bCol[x] = b;
      aCol[x] = a;
    }

    // Fill all rows with the radial profile
    for (let y = 0; y < 64; y++) {
      const rowOffset = y * 2048 * 4;
      for (let x = 0; x < 2048; x++) {
        const idx = rowOffset + x * 4;
        data[idx] = rCol[x];
        data[idx + 1] = gCol[x];
        data[idx + 2] = bCol[x];
        data[idx + 3] = aCol[x];
      }
    }

    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    return texture;
  }

  // --- URANUS ---
  private static createUranusTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, '#9bf6ff');
    grad.addColorStop(0.5, '#a0c4ff');
    grad.addColorStop(1, '#9bf6ff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);
    return new THREE.CanvasTexture(canvas);
  }

  // --- NEPTUNE ---
  private static createNeptuneTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(512, 256);
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#1d3557');
    grad.addColorStop(0.5, '#2a6f97');
    grad.addColorStop(1, '#1d3557');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Cirrus white storm clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      ctx.fillRect(x, y, 40 + Math.random() * 60, 3);
    }
    return new THREE.CanvasTexture(canvas);
  }

  // --- PLUTO ---
  private static createPlutoTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    ctx.fillStyle = '#a38f7e';
    ctx.fillRect(0, 0, 256, 128);

    // Tombaugh Regio (Heart shape)
    ctx.fillStyle = '#f8edeb';
    ctx.beginPath();
    ctx.ellipse(130, 65, 30, 22, 0.2, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // --- MOON ---
  private static createMoonTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(512, 256);
    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(0, 0, 512, 256);

    // Lunar Maria (dark basaltic volcanic plains)
    ctx.fillStyle = 'rgba(70, 70, 70, 0.6)';
    const maria = [
      { x: 180, y: 110, r: 40 }, // Mare Imbrium
      { x: 260, y: 130, r: 35 }, // Mare Serenitatis
      { x: 320, y: 140, r: 30 }, // Mare Tranquillitatis (Apollo 11 landing)
      { x: 120, y: 140, r: 45 }, // Oceanus Procellarum
    ];
    for (const m of maria) {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Impact craters with bright rays
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const r = 1 + Math.random() * 8;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.3 ? 'rgba(50, 50, 50, 0.5)' : 'rgba(230, 230, 230, 0.6)';
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- IO ---
  private static createIoTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    // Sulfur yellow surface
    ctx.fillStyle = '#e9c46a';
    ctx.fillRect(0, 0, 256, 128);

    // Active volcanic calderas (paterae)
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 128;
      ctx.fillStyle = Math.random() > 0.5 ? '#d62828' : '#264653';
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.random() * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- EUROPA ---
  private static createEuropaTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    // Smooth white/ice crust
    ctx.fillStyle = '#e2eafc';
    ctx.fillRect(0, 0, 256, 128);

    // Lineae (red-brown tectonic cracks and fissures in ice)
    ctx.strokeStyle = 'rgba(157, 107, 83, 0.6)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 256, Math.random() * 128);
      ctx.quadraticCurveTo(Math.random() * 256, Math.random() * 128, Math.random() * 256, Math.random() * 128);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- TITAN (Hazy golden-orange photochemical smog with polar hood) ---
  private static createTitanTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0.0, '#b45309'); // Darker northern polar hood
    grad.addColorStop(0.2, '#d97706'); // Upper hazy atmosphere
    grad.addColorStop(0.5, '#f59e0b'); // Warm amber equatorial smog
    grad.addColorStop(0.8, '#d97706');
    grad.addColorStop(1.0, '#b45309'); // Southern polar hood
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);

    // Subtle atmospheric haze bands
    for (let i = 0; i < 20; i++) {
      const y = Math.random() * 128;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(180, 83, 9, 0.12)';
      ctx.fillRect(0, y, 256, 2 + Math.random() * 4);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- GANYMEDE (Grooved terrain & dark silicate plates) ---
  private static createGanymedeTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    ctx.fillStyle = '#4b5563'; // Dark polygonal regions (Galileo Regio)
    ctx.fillRect(0, 0, 256, 128);

    // Lighter grooved icy terrain
    ctx.strokeStyle = 'rgba(209, 213, 219, 0.45)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      const sx = Math.random() * 256;
      const sy = Math.random() * 128;
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 30 + Math.random() * 60, sy + (Math.random() - 0.5) * 20);
      ctx.stroke();
    }

    // Impact craters
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 128;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.3 ? 'rgba(243, 244, 246, 0.7)' : 'rgba(31, 41, 55, 0.5)';
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- CALLISTO (Heavily cratered ancient icy crust) ---
  private static createCallistoTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    ctx.fillStyle = '#374151'; // Very dark ancient surface
    ctx.fillRect(0, 0, 256, 128);

    // Multitudes of bright white impact craters (Valhalla basin)
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 128;
      const r = 1 + Math.random() * 5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(249, 250, 251, 0.85)' : 'rgba(17, 24, 39, 0.6)';
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- ENCELADUS (Brilliant pure white ice with south polar blue tiger stripes) ---
  private static createEnceladusTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    ctx.fillStyle = '#f8fafc'; // Super high albedo (>0.99) pure snow/ice
    ctx.fillRect(0, 0, 256, 128);

    // Faint subtle cratering in northern hemisphere
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 60;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(203, 213, 225, 0.5)';
      ctx.fill();
    }

    // South polar "Tiger Stripes" (Damascus, Baghdad, Alexandria, Cairo Sulci cryovolcanic fissures)
    ctx.strokeStyle = '#38bdf8'; // Cyan-blue fresh crystalline ice
    ctx.lineWidth = 2.0;
    for (let i = 0; i < 6; i++) {
      const sx = 60 + i * 25;
      ctx.beginPath();
      ctx.moveTo(sx, 95);
      ctx.quadraticCurveTo(sx + 10, 110, sx + 20, 125);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- PHOBOS / DEIMOS (Dark carbonaceous asteroid rock) ---
  private static createPhobosTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(128, 64);
    ctx.fillStyle = '#44403c'; // Dark carbonaceous chondrite
    ctx.fillRect(0, 0, 128, 64);

    // Giant Stickney crater & grooves
    ctx.beginPath();
    ctx.arc(45, 32, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#292524';
    ctx.fill();

    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 64;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 162, 158, 0.4)';
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- TRITON (Cantaloupe terrain & pinkish nitrogen frost) ---
  private static createTritonTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0.0, '#94a3b8'); // Bluish-grey cantaloupe terrain
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1.0, '#fecdd3'); // Pink southern nitrogen polar cap
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);

    // Nitrogen geyser dark streaks
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 256;
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x + 15, 85);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // --- ASTEROID SPRITE (Soft circular shaded space rock / cosmic dust) ---
  private static createAsteroidSpriteTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(64, 64);
    ctx.clearRect(0, 0, 64, 64);

    // Glowing cosmic dust / rock particle with smooth natural falloff
    const grad = ctx.createRadialGradient(28, 28, 1, 32, 32, 30);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');  // Bright specular glint
    grad.addColorStop(0.2, 'rgba(235, 225, 215, 0.95)'); // Core rock
    grad.addColorStop(0.5, 'rgba(160, 150, 140, 0.65)'); // Diffuse mineral body
    grad.addColorStop(0.8, 'rgba(90, 85, 80, 0.25)');    // Soft edge falloff
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');         // Perfectly transparent boundary

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // --- ASTEROID 3D ROCK TEXTURE (For Ceres, Vesta, etc.) ---
  private static createAsteroidRockTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(256, 128);
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(0, 0, 256, 128);

    // Rocky bumps and craters
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 128;
      const r = 2 + Math.random() * 10;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(30, 30, 30, 0.35)' : 'rgba(200, 200, 200, 0.3)';
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  private static createDefaultTexture(): THREE.Texture {
    const { canvas, ctx } = this.createCanvas(64, 64);
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }
}
