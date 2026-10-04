import { SolarSystemScene } from '../scenes/SolarSystemScene';
import { CosmicAudio } from '../audio/CosmicAudio';
import { t, getLanguage } from '../utils/i18n';

export interface TourStop {
  id: string;
  nameId: string;
  nameEn: string;
  telemetryId: string;
  telemetryEn: string;
  captionId: string;
  captionEn: string;
  durationSec: number;
}

export class CinematicTour {
  public container: HTMLElement;
  private scene: SolarSystemScene;
  private audio: CosmicAudio;
  public isActive: boolean = false;
  private currentStopIndex: number = 0;
  private stopTimer: number | null = null;
  private isPaused: boolean = false;

  public onTourEnd?: () => void;

  private stops: TourStop[] = [
    {
      id: 'sun',
      nameId: 'Matahari (Surya)',
      nameEn: 'The Sun (Sol)',
      telemetryId: 'Tipe: Bintang Deret Utama G2V | Suhu Inti: 15.000.000°C | Massa: 99,86% Massa Tata Surya',
      telemetryEn: 'Type: Yellow Dwarf Star (G2V) | Core Temp: 15,000,000°C | Mass: 99.86% of Solar System',
      captionId: 'Jantung kehidupan Tata Surya kita. Reaktor fusi termonuklir raksasa yang mengubah 600 juta ton hidrogen menjadi helium setiap detiknya, memancarkan cahaya dan panas yang menopang kehidupan di Bumi.',
      captionEn: 'The radiant heart of our solar system. A gigantic thermonuclear fusion reactor fusing 600 million tons of hydrogen into helium every second, sustaining all life on Earth.',
      durationSec: 10
    },
    {
      id: 'mercury',
      nameId: 'Merkurius',
      nameEn: 'Mercury',
      telemetryId: 'Jarak ke Matahari: 0,39 AU | Suhu: -180°C hingga +430°C | Gravitasi: 3,7 m/s²',
      telemetryEn: 'Distance to Sun: 0.39 AU | Temp: -180°C to +430°C | Gravity: 3.7 m/s²',
      captionId: 'Planet terdekat dari Matahari dan terkecil di Tata Surya. Tanpa atmosfer tebal untuk menahan panas, permukaannya mengalami fluktuasi suhu paling ekstrem di Tata Surya.',
      captionEn: 'The swiftest and innermost planet. Bereft of a thick atmosphere to insulate its surface, it endures the most violent temperature swings in the solar system.',
      durationSec: 9
    },
    {
      id: 'venus',
      nameId: 'Venus (Bintang Kejora)',
      nameEn: 'Venus (The Morning Star)',
      telemetryId: 'Atmosfer: 96,5% CO₂ | Tekanan: 92 atm | Suhu Permukaan: 464°C',
      telemetryEn: 'Atmosphere: 96.5% CO₂ | Pressure: 92 atm | Surface Temp: 464°C',
      captionId: 'Sering disebut "saudara kembar Bumi" karena ukuran yang mirip, namun mengalami efek rumah kaca tak terkendali yang menjadikannya planet terpanas di Tata Surya, cukup untuk melelehkan timbal.',
      captionEn: 'Earth\'s "evil twin", cloaked in dense clouds of sulfuric acid. Runaway greenhouse effect traps solar heat, turning its volcanic surface into a 464°C furnace hotter than Mercury.',
      durationSec: 9
    },
    {
      id: 'earth',
      nameId: 'Bumi & Bulan',
      nameEn: 'Earth & The Moon',
      telemetryId: 'Atmosfer: 78% N₂, 21% O₂ | Air Cair: 71% Permukaan | Kehidupan: Aktif',
      telemetryEn: 'Atmosphere: 78% N₂, 21% O₂ | Liquid Water: 71% Surface | Biosphere: Thriving',
      captionId: 'Satu-satunya oasis kehidupan yang kita ketahui di alam semesta. Dilindungi oleh medan magnet kuat dan atmosfer kaya oksigen, dengan Bulan menjaga stabilitas kemiringan sumbu rotasi Bumi.',
      captionEn: 'The Pale Blue Dot—the only known sanctuary of life in the cosmos. Sheltered by a protective magnetosphere and oceans of liquid water, with our large Moon stabilizing the climate.',
      durationSec: 10
    },
    {
      id: 'mars',
      nameId: 'Mars (Planet Merah)',
      nameEn: 'Mars (The Red Planet)',
      telemetryId: 'Gunung Tertinggi: Olympus Mons (22 km) | Hari: 24j 37m | Gravitasi: 3,72 m/s²',
      telemetryEn: 'Highest Volcano: Olympus Mons (22 km) | Sol Length: 24h 37m | Gravity: 3.72 m/s²',
      captionId: 'Dunia berdebu merah berkarat dengan ngarai raksasa Valles Marineris dan gunung api terbesar Olympus Mons. Bukti geologis menunjukkan danau dan sungai air pernah mengalir di permukaannya.',
      captionEn: 'The rust-hued frontier of human exploration. Home to the towering Olympus Mons and vast dry riverbeds whispering stories of an ancient warm, wet Martian epoch.',
      durationSec: 9
    },
    {
      id: 'ceres',
      nameId: 'Sabuk Asteroid & Ceres',
      nameEn: 'The Asteroid Belt & Ceres',
      telemetryId: 'Jarak: 2,77 AU | Diameter Ceres: 940 km | Klasifikasi: Planet Kerdil',
      telemetryEn: 'Distance: 2.77 AU | Ceres Diameter: 940 km | Classification: Dwarf Planet',
      captionId: 'Zona luas antara Mars dan Jupiter yang dihuni oleh jutaan bongkahan batu dan es primordial. Ceres, objek terbesarnya, menyimpan mantel es air dan uap cryovolcanic di bawah keraknya.',
      captionEn: 'The cosmic debris field between Mars and Jupiter. Ceres, the queen of the belt, harbors an icy mantle and cryovolcanic brine deposits that intrigue astrobiologists.',
      durationSec: 9
    },
    {
      id: 'jupiter',
      nameId: 'Jupiter & Bulan-Bulan Galilean',
      nameEn: 'Jupiter & The Galilean Moons',
      telemetryId: 'Massa: 317,8x Bumi | Bintik Merah: Badai 300+ Tahun | Bulan: 95 Dikenal',
      telemetryEn: 'Mass: 317.8x Earth | Great Red Spot: 300+ Year Storm | Moons: 95 Known',
      captionId: 'Raksasa gas terbesar di Tata Surya. Berfungsi sebagai "pelindung gravitasi" Bumi dari komet liar. Mengiringi bulan vulkanik Io dan bulan es Europa yang menyembunyikan samudra bawah tanah.',
      captionEn: 'The colossus of our solar system. Its colossal gravity acts as a cosmic shield, while guiding enigmatic worlds like volcanic Io and ocean-bearing Europa.',
      durationSec: 10
    },
    {
      id: 'saturn',
      nameId: 'Saturnus & Kemegahan Cincin',
      nameEn: 'Saturn & The Majestic Rings',
      telemetryId: 'Lebar Cincin: 282.000 km | Ketebalan: ~10 meter | Kepadatan: Lebih ringan dari air',
      telemetryEn: 'Ring Span: 282,000 km | Ring Thickness: ~10 meters | Density: Floats in water',
      captionId: 'Permata paling memesona di angkasa. Cincinnya tersusun atas miliaran partikel es murni dan debu berputar, dihiasi divisi celah Cassini yang anggun dan badai heksagonal di kutub utara.',
      captionEn: 'The jewel of the solar system. Millions of icy ringlets orbit in a delicate sheet just meters thick, crowned by the mysterious North Polar Hexagon jet stream.',
      durationSec: 10
    },
    {
      id: 'neptune',
      nameId: 'Uranus & Neptunus (Raksasa Es)',
      nameEn: 'Uranus & Neptune (The Ice Giants)',
      telemetryId: 'Kecepatan Angin Neptunus: 2.100 km/jam | Suhu: -218°C | Warna: Metana Biru',
      telemetryEn: 'Neptune Wind Speed: 2,100 km/h | Temp: -218°C | Color: Atmospheric Methane',
      captionId: 'Dunia raksasa es terluar yang diselimuti atmosfer metana biru laut dalam. Neptunus menghasilkan angin supersonik tercepat di Tata Surya, mengorbit di batas terluar keluarga Matahari kita.',
      captionEn: 'The deep azure sentinels of the outer system. Enriched with water, ammonia, and methane ices, swept by 2,100 km/h supersonic winds in the freezing dark.',
      durationSec: 9
    },
    {
      id: 'sun',
      nameId: 'Kosmos Tak Berbatas (Kesimpulan)',
      nameEn: 'The Infinite Cosmos (Conclusion)',
      telemetryId: 'Diameter Tata Surya: ~100 AU | Galaksi: Bima Sakti (Milky Way)',
      telemetryEn: 'Solar System Diameter: ~100 AU | Home: Milky Way Galaxy',
      captionId: 'Tata Surya kita hanyalah satu dari ratusan miliar sistem bintang di galaksi Bima Sakti. Pengetahuan astronomi mengajarkan kita betapa berharganya kehidupan dan betapa luasnya keajaiban semesta.',
      captionEn: 'Our solar system is but one of hundreds of billions of star systems in the Milky Way. Astronomy teaches us the profound fragility of our home and the limitless wonders awaiting exploration.',
      durationSec: 10
    }
  ];

  constructor(scene: SolarSystemScene) {
    this.scene = scene;
    this.audio = CosmicAudio.getInstance();

    this.container = document.createElement('div');
    this.container.id = 'cinematic-tour-hud';
    this.container.className = 'cinematic-hud hidden';
    this.container.setAttribute('aria-label', 'Tur Sinematik Tata Surya');

    this.render();
  }

  public start(): void {
    this.isActive = true;
    this.currentStopIndex = 0;
    this.isPaused = false;
    this.container.classList.remove('hidden');

    // Add letterbox styling class to body
    document.body.classList.add('cinematic-active');

    this.goToStop(0);
  }

  public stop(): void {
    if (this.stopTimer !== null) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this.isActive = false;
    this.container.classList.add('hidden');
    document.body.classList.remove('cinematic-active');

    this.scene.cameraController.resetCamera(true);
    this.scene.disableFocusedLight();

    if (this.onTourEnd) {
      this.onTourEnd();
    }
  }

  public next(): void {
    if (this.currentStopIndex < this.stops.length - 1) {
      this.goToStop(this.currentStopIndex + 1);
    } else {
      this.stop();
    }
  }

  public prev(): void {
    if (this.currentStopIndex > 0) {
      this.goToStop(this.currentStopIndex - 1);
    }
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    const playPauseBtn = this.container.querySelector('#btn-tour-playpause');
    if (playPauseBtn) {
      playPauseBtn.innerHTML = this.isPaused ? '▶' : '⏸';
    }
    return this.isPaused;
  }

  private goToStop(index: number): void {
    if (this.stopTimer !== null) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }

    this.currentStopIndex = index;
    const stop = this.stops[index];

    // Trigger audio flyby whoosh & planetary resonance
    this.audio.playFlybyWhoosh();
    this.audio.playPlanetaryRadio(stop.id);

    // Focus camera
    if (index === this.stops.length - 1) {
      // Final stop: bird's eye cosmic overview
      this.scene.cameraController.resetCamera(true);
      this.scene.disableFocusedLight();
    } else {
      this.scene.focusOn(stop.id);
    }

    this.updateHUD(stop);

    // Schedule next stop
    const scheduleNext = () => {
      if (!this.isPaused) {
        this.next();
      } else {
        this.stopTimer = window.setTimeout(scheduleNext, 1000);
      }
    };
    this.stopTimer = window.setTimeout(scheduleNext, stop.durationSec * 1000);
  }

  private updateHUD(stop: TourStop): void {
    const isEn = getLanguage() === 'en';
    const titleEl = this.container.querySelector('#tour-title');
    const badgeEl = this.container.querySelector('#tour-station-badge');
    const teleEl = this.container.querySelector('#tour-telemetry');
    const captionEl = this.container.querySelector('#tour-caption');
    const progressEl = this.container.querySelector('#tour-progress-bar') as HTMLElement;

    if (titleEl) titleEl.textContent = isEn ? stop.nameEn : stop.nameId;
    if (badgeEl) badgeEl.textContent = `${isEn ? 'STATION' : 'DESTINASI'} ${this.currentStopIndex + 1} / ${this.stops.length}`;
    if (teleEl) teleEl.textContent = isEn ? stop.telemetryEn : stop.telemetryId;
    if (captionEl) captionEl.textContent = isEn ? stop.captionEn : stop.captionId;

    if (progressEl) {
      const pct = ((this.currentStopIndex + 1) / this.stops.length) * 100;
      progressEl.style.width = `${pct}%`;
    }
  }

  private render(): void {
    const isEn = getLanguage() === 'en';

    this.container.innerHTML = `
      <!-- Top Letterbox Bar with Title -->
      <div class="cinematic-letterbox top">
        <div class="tour-top-meta">
          <span class="tour-badge" id="tour-station-badge">DESTINASI 1 / ${this.stops.length}</span>
          <span class="tour-hud-telemetry" id="tour-telemetry">Memulai pelayaran kosmis...</span>
        </div>
        <button class="btn-tour-close" id="btn-tour-close" title="${isEn ? 'Exit Tour' : 'Keluar Tur'}">✕ ${isEn ? 'Exit' : 'Keluar'}</button>
      </div>

      <!-- Bottom Letterbox Bar with Narrative Subtitle & Controls -->
      <div class="cinematic-letterbox bottom">
        <div class="tour-progress-track">
          <div class="tour-progress-fill" id="tour-progress-bar"></div>
        </div>

        <div class="tour-bottom-content">
          <div class="tour-narration-box">
            <h3 class="tour-destination-title" id="tour-title">Matahari</h3>
            <p class="tour-caption-text" id="tour-caption">Memuat narasi...</p>
          </div>

          <div class="tour-controls">
            <button class="btn-tour-nav" id="btn-tour-prev" title="${isEn ? 'Previous Station' : 'Destinasi Sebelumnya'}">⏮</button>
            <button class="btn-tour-nav primary" id="btn-tour-playpause" title="${isEn ? 'Pause / Play' : 'Jeda / Lanjut'}">⏸</button>
            <button class="btn-tour-nav" id="btn-tour-next" title="${isEn ? 'Next Station' : 'Destinasi Selanjutnya'}">⏭</button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents(): void {
    this.container.querySelector('#btn-tour-close')?.addEventListener('click', () => this.stop());
    this.container.querySelector('#btn-tour-prev')?.addEventListener('click', () => this.prev());
    this.container.querySelector('#btn-tour-next')?.addEventListener('click', () => this.next());
    this.container.querySelector('#btn-tour-playpause')?.addEventListener('click', () => this.togglePause());
  }

  public refreshLanguage(): void {
    if (this.isActive) {
      this.updateHUD(this.stops[this.currentStopIndex]);
    }
  }
}
