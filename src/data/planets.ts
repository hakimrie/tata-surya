import { AU, SOLAR_MASS, SOLAR_RADIUS, EARTH_MASS, EARTH_RADIUS } from '../utils/constants';

export type CurriculumLevel = 'sd' | 'smp' | 'sma';

export interface CurriculumContent {
  sd: string;
  smp: string;
  sma: string;
}

export interface AtmosphereGas {
  name: string;
  nameEn?: string;
  percentage: number;
}

export interface PlanetData {
  id: string;
  name: string;
  indonesianName: string;
  englishName: string;
  type: 'star' | 'planet' | 'dwarf';
  color: string;
  textureType: 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';
  hasRings?: boolean;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;

  // Physical properties (SI Units)
  mass: number;                // kg
  radius: number;              // meters
  density: number;             // kg/m^3
  surfaceGravity: number;      // m/s^2
  escapeVelocity: number;      // m/s
  axialTilt: number;           // degrees
  rotationPeriod: number;      // seconds (negative for retrograde)

  // Orbital properties (SI Units)
  meanDistance: number;        // meters from Sun
  semiMajorAxis: number;       // meters
  eccentricity: number;        // dimensionless
  inclination: number;         // degrees
  orbitalPeriod: number;       // seconds
  orbitalVelocity: number;     // m/s

  // Environmental properties
  knownMoonsCount: number;
  temperatureRange: {
    min?: number;              // °C
    max?: number;              // °C
    mean: number;              // °C
  };
  atmosphereComposition: AtmosphereGas[];

  // Educational content (Bilingual ID & EN)
  overview: string;
  overviewEn?: string;
  curriculum: CurriculumContent;
  curriculumEn?: CurriculumContent;
  didYouKnow: string[];
  didYouKnowEn?: string[];
}

export const PLANETS_DATA: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sun',
    indonesianName: 'Matahari',
    englishName: 'Sun',
    type: 'star',
    color: '#ffaa00',
    textureType: 'sun',
    mass: SOLAR_MASS,
    radius: SOLAR_RADIUS,
    density: 1408,
    surfaceGravity: 274.0,
    escapeVelocity: 617700,
    axialTilt: 7.25,
    rotationPeriod: 25.05 * 86400, // Equator ~25 days
    meanDistance: 0,
    semiMajorAxis: 0,
    eccentricity: 0,
    inclination: 0,
    orbitalPeriod: 0,
    orbitalVelocity: 0,
    knownMoonsCount: 0,
    temperatureRange: {
      min: 5500,
      max: 15000000,
      mean: 5505 // Surface photosphere
    },
    atmosphereComposition: [
      { name: 'Hidrogen (H₂)', nameEn: 'Hydrogen (H₂)', percentage: 73.46 },
      { name: 'Helium (He)', nameEn: 'Helium (He)', percentage: 24.85 },
      { name: 'Oksigen (O)', nameEn: 'Oxygen (O)', percentage: 0.77 },
      { name: 'Karbon (C)', nameEn: 'Carbon (C)', percentage: 0.29 },
      { name: 'Besi, Neon, Nitrogen, dll', nameEn: 'Iron, Neon, Nitrogen, etc.', percentage: 0.63 }
    ],
    overview: 'Matahari adalah bintang induk pusat Tata Surya kita. Mengandung 99,86% dari total massa seluruh Tata Surya, gravitasinya yang luar biasa mengikat semua planet, komet, dan asteroid dalam orbitnya.',
    overviewEn: 'The Sun is the star at the center of our Solar System. Containing 99.86% of the Solar System\'s total mass, its immense gravity binds all planets, comets, and asteroids in their orbits.',
    curriculum: {
      sd: 'Matahari adalah bintang yang paling dekat dengan Bumi. Matahari memancarkan cahaya dan panas yang membuat kehidupan di Bumi bisa berlangsung. Bumi dan planet lainnya berputar mengelilingi Matahari.',
      smp: 'Matahari menghasilkan energi melalui reaksi fusi nuklir hidrogen menjadi helium di intinya pada suhu 15 juta °C. Gaya gravitasi Matahari menjadi gaya sentripetal yang menjaga semua planet tetap berada pada orbitnya.',
      sma: 'Matahari berada pada deret utama (tipe spektrum G2V). Keseimbangan hidrostatik antara tekanan radiasi fusi nuklir ke arah luar dan gaya gravitasi ke arah dalam menjaga kestabilan strukturnya. Laju kehilangan massa melalui fusi adalah E=mc².'
    },
    curriculumEn: {
      sd: 'The Sun is the closest star to Earth. It radiates light and heat enabling life on Earth. Earth and all other planets revolve around the Sun.',
      smp: 'The Sun generates energy through hydrogen-to-helium nuclear fusion in its core at 15 million °C. The Sun\'s gravitational pull acts as the centripetal force keeping planets in orbit.',
      sma: 'The Sun is a G2V main-sequence star. Hydrostatic equilibrium between outward radiation pressure and inward gravitational force maintains its structure.'
    },
    didYouKnow: [
      'Matahari begitu besar sehingga bisa memuat sekitar 1,3 juta planet seukuran Bumi di dalamnya!',
      'Cahaya dari Matahari membutuhkan waktu sekitar 8 menit 20 detik untuk sampai ke Bumi.',
      'Suhu inti Matahari mencapai 15.000.000°C di mana fusi nuklir berlangsung terus-menerus.'
    ],
    didYouKnowEn: [
      'The Sun is so massive that about 1.3 million Earths could fit inside it!',
      'Light from the Sun takes about 8 minutes and 20 seconds to travel to Earth.',
      'The Sun\'s core reaches 15,000,000°C where continuous nuclear fusion powers the solar system.'
    ]
  },
  {
    id: 'mercury',
    name: 'Mercury',
    indonesianName: 'Merkurius',
    englishName: 'Mercury',
    type: 'planet',
    color: '#a09085',
    textureType: 'mercury',
    mass: 3.3011e23,
    radius: 2439.7e3,
    density: 5427,
    surfaceGravity: 3.7,
    escapeVelocity: 4250,
    axialTilt: 0.034,
    rotationPeriod: 58.646 * 86400,
    meanDistance: 57.91e9,
    semiMajorAxis: 57.909e9,
    eccentricity: 0.2056,
    inclination: 7.0,
    orbitalPeriod: 87.969 * 86400,
    orbitalVelocity: 47360,
    knownMoonsCount: 0,
    temperatureRange: {
      min: -180,
      max: 430,
      mean: 167
    },
    atmosphereComposition: [
      { name: 'Oksigen (O₂)', nameEn: 'Oxygen (O₂)', percentage: 42.0 },
      { name: 'Natrium (Na)', nameEn: 'Sodium (Na)', percentage: 29.0 },
      { name: 'Hidrogen (H₂)', nameEn: 'Hydrogen (H₂)', percentage: 22.0 },
      { name: 'Helium (He)', nameEn: 'Helium (He)', percentage: 6.0 },
      { name: 'Kalium & jejak gas lain', nameEn: 'Potassium & traces', percentage: 1.0 }
    ],
    overview: 'Merkurius adalah planet terkecil di Tata Surya dan yang paling dekat dengan Matahari. Permukaannya dipenuhi kawah tubrukan mirip Bulan dan memiliki rentang suhu siang-malam paling ekstrem.',
    overviewEn: 'Mercury is the smallest planet in the Solar System and closest to the Sun. Its cratered surface resembles Earth\'s Moon, and it experiences the most extreme day-to-night temperature swings.',
    curriculum: {
      sd: 'Merkurius adalah planet terdekat dari Matahari dan planet paling kecil. Karena tidak punya selimut udara (atmosfer) tebal, siangnya sangat panas dan malamnya sangat dingin membeku.',
      smp: 'Merkurius mengorbit Matahari paling cepat karena letaknya paling dekat (kecepatan orbit ~47 km/s). Satu tahun di Merkurius hanya 88 hari Bumi, sedangkan satu hari (rotasi) memakan waktu 59 hari Bumi.',
      sma: 'Orbit Merkurius memiliki eksentrisitas tertinggi (e = 0,2056). Presesi perihelion Merkurius (~43 detik busur per abad) tidak dapat dijelaskan sepenuhnya oleh mekanika Newton dan menjadi bukti kemenangan Teori Relativitas Umum Einstein.'
    },
    curriculumEn: {
      sd: 'Mercury is the closest planet to the Sun and the smallest planet. Lacking a thick atmosphere, days are scorching hot and nights are freezing cold.',
      smp: 'Mercury orbits the Sun fastest (~47 km/s) due to its proximity. One Mercury year is 88 Earth days, while its rotation takes 59 Earth days.',
      sma: 'Mercury has the highest orbital eccentricity (e = 0.2056). The anomalous perihelion precession of ~43 arcseconds per century provided crucial empirical proof for Einstein\'s General Relativity.'
    },
    didYouKnow: [
      'Meskipun paling dekat dengan Matahari, Merkurius bukan planet terpanas (gelar terpanas dipegang oleh Venus karena efek rumah kaca)!',
      'Merkurius memiliki inti besi cair raksasa yang mencakup sekitar 85% dari jari-jari planetnya.',
      'Satu tahun di Merkurius (88 hari Bumi) lebih singkat daripada satu hari matahari di sana (176 hari Bumi)!'
    ],
    didYouKnowEn: [
      'Despite being closest to the Sun, Mercury is not the hottest planet (Venus is hotter due to its runaway greenhouse effect)!',
      'Mercury possesses a huge metallic core occupying about 85% of the planet\'s total radius.',
      'One solar day on Mercury (176 Earth days) is twice as long as its entire year (88 Earth days)!'
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    indonesianName: 'Venus',
    englishName: 'Venus',
    type: 'planet',
    color: '#e3bb76',
    textureType: 'venus',
    hasAtmosphere: true,
    atmosphereColor: '#ffddaa',
    mass: 4.8675e24,
    radius: 6051.8e3,
    density: 5243,
    surfaceGravity: 8.87,
    escapeVelocity: 10360,
    axialTilt: 177.36, // Retrograde rotation
    rotationPeriod: -243.025 * 86400,
    meanDistance: 108.2e9,
    semiMajorAxis: 108.208e9,
    eccentricity: 0.0067,
    inclination: 3.39,
    orbitalPeriod: 224.701 * 86400,
    orbitalVelocity: 35020,
    knownMoonsCount: 0,
    temperatureRange: {
      mean: 464
    },
    atmosphereComposition: [
      { name: 'Karbon Dioksida (CO₂)', nameEn: 'Carbon Dioxide (CO₂)', percentage: 96.5 },
      { name: 'Nitrogen (N₂)', nameEn: 'Nitrogen (N₂)', percentage: 3.5 },
      { name: 'Sulfur Dioksida & Uap Air', nameEn: 'Sulfur Dioxide & Water Vapor', percentage: 0.1 }
    ],
    overview: 'Venus sering disebut "saudara kembar Bumi" karena ukuran dan massanya yang hampir serupa. Namun atmosfernya adalah neraka efek rumah kaca tak terkendali dengan tekanan 92 kali tekanan atmosfer Bumi.',
    overviewEn: 'Venus is often called Earth\'s twin due to similar size and mass. However, its atmosphere is an extreme runaway greenhouse with surface pressure 92 times that of Earth.',
    curriculum: {
      sd: 'Venus adalah planet paling terang di langit malam, sering disebut Bintang Fajar atau Bintang Kejora. Venus adalah planet terpanas karena diselimuti awan tebal yang menahan panas matahari.',
      smp: 'Venus berotasi berlawanan arah (retrograde) dari timur ke barat. Tekanan atmosfernya sangat tinggi (setara kedalaman 900 meter di bawah laut Bumi) dan kaya karbon dioksida yang memicu efek rumah kaca ekstrem.',
      sma: 'Efek rumah kaca tak terkendali (runaway greenhouse effect) menaikkan suhu permukaan Venus hingga 464°C, melampaui titik leleh timbal. Awan asam sulfat memantulkan 75% sinar matahari (albedo tinggi = 0,77).'
    },
    curriculumEn: {
      sd: 'Venus is the brightest planet in the night sky, known as the Morning Star or Evening Star. It is the hottest planet because thick clouds trap solar heat.',
      smp: 'Venus rotates in retrograde (east to west). Its surface atmospheric pressure equals 900 meters under Earth\'s oceans and is packed with CO2 causing extreme greenhouse heating.',
      sma: 'A runaway greenhouse effect elevates Venus\' surface temperature to 464°C, hot enough to melt lead. Sulfuric acid clouds reflect ~75% of incoming sunlight (albedo 0.77).'
    },
    didYouKnow: [
      'Di Venus, Matahari terbit dari barat dan terbenam di timur karena arah rotasinya terbalik!',
      'Satu hari di Venus (243 hari Bumi) lebih lama daripada satu tahunnya (225 hari Bumi)!',
      'Hujan di atmosfer atas Venus mengandung asam sulfat murni, tetapi menguap sebelum mencapai tanah karena panasnya permukaan.'
    ],
    didYouKnowEn: [
      'On Venus, the Sun rises in the west and sets in the east because it rotates backwards!',
      'A single day on Venus (243 Earth days) is longer than its entire year (225 Earth days)!',
      'Rain in the upper atmosphere is pure sulfuric acid, but evaporates before ever touching the ground.'
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    indonesianName: 'Bumi',
    englishName: 'Earth',
    type: 'planet',
    color: '#2a6f97',
    textureType: 'earth',
    hasAtmosphere: true,
    atmosphereColor: '#00aaff',
    mass: EARTH_MASS,
    radius: EARTH_RADIUS,
    density: 5514,
    surfaceGravity: 9.807,
    escapeVelocity: 11186,
    axialTilt: 23.44,
    rotationPeriod: 86164.1, // Sidereal day (23h 56m 4s)
    meanDistance: AU,
    semiMajorAxis: AU,
    eccentricity: 0.0167,
    inclination: 0.0,
    orbitalPeriod: 365.256 * 86400,
    orbitalVelocity: 29780,
    knownMoonsCount: 1,
    temperatureRange: {
      min: -89.2,
      max: 56.7,
      mean: 15
    },
    atmosphereComposition: [
      { name: 'Nitrogen (N₂)', nameEn: 'Nitrogen (N₂)', percentage: 78.08 },
      { name: 'Oksigen (O₂)', nameEn: 'Oxygen (O₂)', percentage: 20.95 },
      { name: 'Argon (Ar)', nameEn: 'Argon (Ar)', percentage: 0.93 },
      { name: 'Karbon Dioksida (CO₂)', nameEn: 'Carbon Dioxide (CO₂)', percentage: 0.04 },
      { name: 'Uap Air & gas lain', nameEn: 'Water Vapor & traces', percentage: 0.01 }
    ],
    overview: 'Bumi adalah rumah kita tercinta dan satu-satunya tempat di alam semesta yang diketahui memiliki kehidupan. Memiliki air cair di permukaan, atmosfer kaya oksigen, dan medan magnet pelindung.',
    overviewEn: 'Earth is our home planet and the only known place in the universe harboring life. It features liquid surface water, an oxygen-rich atmosphere, and a protective geomagnetic shield.',
    curriculum: {
      sd: 'Bumi adalah planet tempat kita hidup. Bumi berputar pada porosnya (rotasi) menyebabkan siang dan malam, serta mengelilingi Matahari (revolusi) selama 1 tahun menyebabkan pergantian musim.',
      smp: 'Kemiringan sumbu rotasi Bumi sebesar 23,5° adalah penyebab utama terjadinya pergantian 4 musim di belahan bumi utara dan selatan. Bumi memiliki satu satelit alami yaitu Bulan yang menyebabkan pasang surut air laut.',
      sma: 'Keseimbangan radiatif Bumi diatur oleh jarak 1 AU di zona layak huni (Habitable Zone). Medan magnet bumi (geomagnetik) dibangkitkan oleh efek dinamo pada inti luar besi-nikel cair, melindungi biosfer dari angin surya radiasi kosmis.'
    },
    curriculumEn: {
      sd: 'Earth is the planet where we live. Its rotation causes day and night, while its revolution around the Sun (1 year) drives changing seasons.',
      smp: 'Earth\'s 23.5° axial tilt causes four seasons in the northern and southern hemispheres. The Moon creates ocean tides and stabilizes Earth\'s climate.',
      sma: 'Earth orbits in the circumstellar Habitable Zone (1 AU). Its geomagnetic field, generated by a geodynamo in the liquid iron-nickel outer core, deflects solar wind and cosmic rays.'
    },
    didYouKnow: [
      'Bumi adalah satu-satunya planet yang namanya tidak diambil dari mitologi dewa-dewi Yunani atau Romawi.',
      'Sekitar 71% permukaan Bumi tertutup air laut, dan manusia baru menjelajahi kurang dari 20% samudra!',
      'Kecepatan lepas Bumi adalah 11,2 km/s. Roket luar angkasa harus melaju secepat ini untuk melepaskan diri dari tarikan gravitasi Bumi.'
    ],
    didYouKnowEn: [
      'Earth is the only planet in the Solar System not named after Greek or Roman deities.',
      'Approximately 71% of Earth\'s surface is covered by oceans, and less than 20% has been explored!',
      'Earth\'s escape velocity is 11.2 km/s. Rockets must achieve this speed to escape Earth\'s gravitational pull without further thrust.'
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    indonesianName: 'Mars',
    englishName: 'Mars',
    type: 'planet',
    color: '#c1440e',
    textureType: 'mars',
    hasAtmosphere: true,
    atmosphereColor: '#ffaa88',
    mass: 6.4171e23,
    radius: 3389.5e3,
    density: 3933,
    surfaceGravity: 3.72,
    escapeVelocity: 5030,
    axialTilt: 25.19,
    rotationPeriod: 88642.7, // 24h 37m
    meanDistance: 227.92e9,
    semiMajorAxis: 227.92e9,
    eccentricity: 0.0934,
    inclination: 1.85,
    orbitalPeriod: 686.98 * 86400,
    orbitalVelocity: 24077,
    knownMoonsCount: 2,
    temperatureRange: {
      min: -140,
      max: 20,
      mean: -63
    },
    atmosphereComposition: [
      { name: 'Karbon Dioksida (CO₂)', nameEn: 'Carbon Dioxide (CO₂)', percentage: 95.32 },
      { name: 'Nitrogen (N₂)', nameEn: 'Nitrogen (N₂)', percentage: 2.6 },
      { name: 'Argon (Ar)', nameEn: 'Argon (Ar)', percentage: 1.9 },
      { name: 'Oksigen (O₂)', nameEn: 'Oxygen (O₂)', percentage: 0.13 },
      { name: 'Karbon Monoksida & Uap Air', nameEn: 'Carbon Monoxide & Water Vapor', percentage: 0.05 }
    ],
    overview: 'Mars adalah "Planet Merah" yang kaya akan mineral besi oksida (karat). Mars menjadi tujuan utama pencarian jejak kehidupan masa lampau dan kolonisasi manusia antariksa di masa depan.',
    overviewEn: 'Mars is the "Red Planet", colored by iron oxide (rust) on its surface. It is the primary target in the search for past extraterrestrial microbial life and future human colonization.',
    curriculum: {
      sd: 'Mars tampak berwarna merah kejinggaan di langit karena tanahnya berkarat (besi oksida). Mars memiliki dua bulan kecil bernama Phobos dan Deimos. Sehari di Mars mirip dengan Bumi (sekitar 24,6 jam).',
      smp: 'Mars memiliki gunung berapi terbesar di Tata Surya bernama Olympus Mons (tingginya 21 km, 2,5 kali tinggi Gunung Everest). Atmosfernya sangat tipis (tekanan hanya 1% dari Bumi) dan didominasi CO₂.',
      sma: 'Eksentrisitas orbit Mars yang cukup besar (e = 0,0934) membantu Johannes Kepler merumuskan Hukum-Hukum Pergerakan Planet, mematahkan dogma orbit lingkaran sempurna Ptolemeus dan Copernicus.'
    },
    curriculumEn: {
      sd: 'Mars appears reddish-orange because its soil is rich in iron rust. Mars has two tiny moons named Phobos and Deimos. A day on Mars is very similar to Earth (~24.6 hours).',
      smp: 'Mars hosts the largest volcano in the Solar System, Olympus Mons (21 km high, 2.5 times Mount Everest). Its thin atmosphere has ~1% of Earth\'s surface pressure.',
      sma: 'The pronounced eccentricity of Mars (e = 0.0934) enabled Johannes Kepler to discover elliptical planetary orbits, replacing the classical circular paradigm.'
    },
    didYouKnow: [
      'Gunung Olympus Mons di Mars tingginya 21 km—begitu tinggi hingga puncaknya menembus atmosfer Mars!',
      'Matahari terbenam di Mars terlihat berwarna kebiruan karena butiran debu halus di atmosfernya menyebarkan cahaya biru ke depan.',
      'Mars memiliki ngarai raksasa bernama Valles Marineris yang panjangnya 4.000 km, cukup untuk membentang dari Sabang sampai Merauke!'
    ],
    didYouKnowEn: [
      'Olympus Mons on Mars is 21 km high—so tall that its summit reaches into the Martian upper atmosphere!',
      'Sunsets on Mars appear bluish due to fine dust scattering blue light preferentially forward.',
      'Valles Marineris is a massive canyon system over 4,000 km long, spanning the equivalent distance from the western to eastern tip of Indonesia!'
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    indonesianName: 'Yupiter',
    englishName: 'Jupiter',
    type: 'planet',
    color: '#d4a373',
    textureType: 'jupiter',
    hasRings: false, // Double-checked: Jupiter has no prominent visible rings in standard orrery view
    hasAtmosphere: true,
    atmosphereColor: '#ffeedd',
    mass: 1.8982e27,
    radius: 69911e3,
    density: 1326,
    surfaceGravity: 24.79,
    escapeVelocity: 59500,
    axialTilt: 3.13,
    rotationPeriod: 35730, // 9h 55m (fastest)
    meanDistance: 778.57e9,
    semiMajorAxis: 778.57e9,
    eccentricity: 0.0484,
    inclination: 1.304,
    orbitalPeriod: 4332.59 * 86400, // 11.86 years
    orbitalVelocity: 13070,
    knownMoonsCount: 95,
    temperatureRange: {
      mean: -110
    },
    atmosphereComposition: [
      { name: 'Hidrogen (H₂)', nameEn: 'Hydrogen (H₂)', percentage: 89.8 },
      { name: 'Helium (He)', nameEn: 'Helium (He)', percentage: 10.2 },
      { name: 'Metana (CH₄)', nameEn: 'Methane (CH₄)', percentage: 0.3 },
      { name: 'Amoniak (NH₃)', nameEn: 'Ammonia (NH₃)', percentage: 0.026 }
    ],
    overview: 'Yupiter adalah raksasa gas terbesar di Tata Surya kita. Massanya lebih dari dua kali lipat massa gabungan seluruh planet lainnya! Yupiter bertindak sebagai "pelindung gravitasi" yang menyedot komet menjauhi Bumi.',
    overviewEn: 'Jupiter is the largest gas giant in our Solar System. Its mass is more than twice that of all other planets combined! Its gravitational field acts as a cosmic shield, clearing comets away from inner planets.',
    curriculum: {
      sd: 'Yupiter adalah planet terbesar di Tata Surya kita. Yupiter tidak memiliki daratan padat untuk dipijak karena terbuat dari gas. Memiliki bintik merah raksasa yang merupakan badai dahsyat.',
      smp: 'Yupiter berotasi paling cepat di antara semua planet (hanya ~10 jam). Yupiter memiliki empat bulan terbesar yang ditemukan Galileo Galilei pada tahun 1610: Io, Europa, Ganymede, dan Callisto.',
      sma: 'Kerapatan rendah Yupiter (1.326 kg/m³) membuktikan komposisinya didominasi gas hidrogen dan helium primordial. Pada kedalaman ekstrem, hidrogen terkompresi menjadi hidrogen metalik cair yang menghasilkan medan magnet raksasa.'
    },
    curriculumEn: {
      sd: 'Jupiter is the largest planet in the Solar System. It has no solid ground because it is made of gas. The Great Red Spot is a giant anticyclonic storm.',
      smp: 'Jupiter rotates fastest of all planets (~10 hours). It hosts the four famous Galilean moons discovered in 1610: Io, Europa, Ganymede, and Callisto.',
      sma: 'Jupiter\'s low density (1,326 kg/m³) confirms a primordial H/He composition. Deep inside, hydrogen transitions to liquid metallic hydrogen, powering a colossal magnetic field.'
    },
    didYouKnow: [
      'Bintik Merah Raksasa (Great Red Spot) Yupiter adalah badai antisiklon raksasa yang telah berkecamuk lebih dari 350 tahun dan lebih besar dari planet Bumi!',
      'Bulan terbesar Yupiter, Ganymede, ukurannya lebih besar daripada planet Merkurius.',
      'Gravitasi Yupiter yang kuat sering membelokkan atau menelan komet berbahaya yang mengarah ke bagian dalam tata surya, melindungi Bumi.'
    ],
    didYouKnowEn: [
      'The Great Red Spot is an anticyclonic storm wider than Earth that has raged for over 350 years!',
      'Jupiter\'s largest moon, Ganymede, is bigger than the planet Mercury.',
      'Jupiter\'s immense gravitational well acts as a vacuum cleaner, capturing dangerous incoming comets.'
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    indonesianName: 'Saturnus',
    englishName: 'Saturn',
    type: 'planet',
    color: '#e0c080',
    textureType: 'saturn',
    hasRings: true, // Saturn has the iconic prominent ring system!
    hasAtmosphere: true,
    atmosphereColor: '#fffaee',
    mass: 5.6834e26,
    radius: 58232e3,
    density: 687, // Less dense than water!
    surfaceGravity: 10.44,
    escapeVelocity: 35500,
    axialTilt: 26.73,
    rotationPeriod: 38360, // 10h 39m
    meanDistance: 1433.5e9,
    semiMajorAxis: 1433.53e9,
    eccentricity: 0.0541,
    inclination: 2.485,
    orbitalPeriod: 10759.22 * 86400, // 29.45 years
    orbitalVelocity: 9680,
    knownMoonsCount: 146,
    temperatureRange: {
      mean: -140
    },
    atmosphereComposition: [
      { name: 'Hidrogen (H₂)', nameEn: 'Hydrogen (H₂)', percentage: 96.3 },
      { name: 'Helium (He)', nameEn: 'Helium (He)', percentage: 3.25 },
      { name: 'Metana & Amoniak', nameEn: 'Methane & Ammonia', percentage: 0.45 }
    ],
    overview: 'Saturnus terkenal dengan sistem cincinnya yang megah dan memukau. Kerapatan rata-rata Saturnus lebih rendah daripada air; jika ada wadah air yang cukup besar, Saturnus akan mengapung!',
    overviewEn: 'Saturn is renowned for its magnificent, intricate ring system. Saturn\'s mean density is less than water; placed in a large enough ocean, Saturn would float!',
    curriculum: {
      sd: 'Saturnus adalah planet tercantik karena memiliki cincin melingkar yang sangat lebar dan indah. Cincinnya terbentuk dari miliaran bongkahan es dan debu batu.',
      smp: 'Cincin Saturnus membentang hingga ratusan ribu kilometer, namun ketebalannya rata-rata hanya puluhan meter! Saturnus memiliki bulan bernama Titan yang memiliki atmosfer tebal.',
      sma: 'Batas Roche (Roche Limit) menjelaskan keberadaan cincin Saturnus: gaya pasang surut gravitasi Saturnus menghancurkan komet atau bulan es yang mendekat terlalu dekat sehingga materi tersebut tidak dapat memadat menjadi bulan.'
    },
    curriculumEn: {
      sd: 'Saturn is famous for its bright, wide rings made of billions of chunks of water ice and rocky dust.',
      smp: 'Saturn\'s rings span 282,000 km across but are only tens of meters thick! Titan, Saturn\'s largest moon, has a thick atmosphere.',
      sma: 'The Roche limit explains Saturn\'s rings: tidal forces prevent icy debris inside the Roche limit from coalescing into a single moon.'
    },
    didYouKnow: [
      'Kerapatan Saturnus hanya 687 kg/m³, lebih ringan dari air (1.000 kg/m³). Jadi jika ada kolam renang raksasa, Saturnus akan mengapung!',
      'Cincin Saturnus lebarnya mencapai 282.000 km, namun tebalnya rata-rata hanya sekitar 10 sampai 30 meter!',
      'Saturnus memiliki badai berbentuk heksagon (segi enam) raksasa yang misterius dan stabil di kutub utaranya.'
    ],
    didYouKnowEn: [
      'Saturn\'s mean density is only 687 kg/m³, lower than water (1,000 kg/m³). In a giant bathtub, Saturn would float!',
      'Saturn\'s rings span over 282,000 km across, yet their average thickness is merely 10 to 30 meters!',
      'A mysterious, persistent hexagonal storm pattern swirls continuously at Saturn\'s north pole.'
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    indonesianName: 'Uranus',
    englishName: 'Uranus',
    type: 'planet',
    color: '#8ac4d0',
    textureType: 'uranus',
    hasRings: false, // Double-checked: no prominent Saturn-like rings
    hasAtmosphere: true,
    atmosphereColor: '#c8f0f8',
    mass: 8.6810e25,
    radius: 25362e3,
    density: 1271,
    surfaceGravity: 8.69,
    escapeVelocity: 21300,
    axialTilt: 97.77, // Rotates on its side!
    rotationPeriod: -62060, // 17h 14m retrograde
    meanDistance: 2872.5e9,
    semiMajorAxis: 2872.46e9,
    eccentricity: 0.0472,
    inclination: 0.772,
    orbitalPeriod: 30685.4 * 86400, // 84 years
    orbitalVelocity: 6800,
    knownMoonsCount: 28,
    temperatureRange: {
      min: -224,
      mean: -195
    },
    atmosphereComposition: [
      { name: 'Hidrogen (H₂)', nameEn: 'Hydrogen (H₂)', percentage: 82.5 },
      { name: 'Helium (He)', nameEn: 'Helium (He)', percentage: 15.2 },
      { name: 'Metana (CH₄)', nameEn: 'Methane (CH₄)', percentage: 2.3 }
    ],
    overview: 'Uranus adalah raksasa es yang unik karena menggelinding miring pada porosnya dengan kemiringan 98 derajat. Warna biru kehijauannya berasal dari gas metana yang menyerap cahaya merah.',
    overviewEn: 'Uranus is an ice giant uniquely tilted at 98 degrees, effectively rolling around the Sun on its side. Its pale cyan hue is caused by methane absorbing red sunlight.',
    curriculum: {
      sd: 'Uranus tampak berwarna biru muda kehijauan dan sangat dingin. Keunikan Uranus adalah cara berputarnya seperti menggelinding miring di lintasannya.',
      smp: 'Kemiringan sumbu Uranus yang hampir 98° menyebabkan satu kutub menghadap Matahari terus-menerus selama 42 tahun, diikuti 42 tahun malam yang gelap gulita.',
      sma: 'Kemiringan ekstrem Uranus kemungkinan akibat tubrukan masif protoplanet seukuran Bumi pada era pembentukan Tata Surya. Metana di atmosfer menyerap spektrum merah gelombang panjang, memantulkan spektrum biru-cyan.'
    },
    curriculumEn: {
      sd: 'Uranus is a cold, pale cyan ice planet that rotates on its side like a rolling bowling ball.',
      smp: 'Its 98° axial tilt creates extreme 42-year long polar days followed by 42-year polar nights.',
      sma: 'The severe axial tilt was likely caused by a protoplanetary collision in the early Solar System. Methane absorbs red wavelengths and reflects cyan.'
    },
    didYouKnow: [
      'Uranus adalah planet pertama yang ditemukan dengan teleskop modern oleh William Herschel pada tahun 1781.',
      'Suhu atmosfer Uranus pernah tercatat mencapai -224°C, menjadikannya salah satu tempat terdingin di Tata Surya.',
      'Karena kemiringannya 98°, kutub Uranus mengalami siang tanpa henti selama 42 tahun lalu malam selama 42 tahun!'
    ],
    didYouKnowEn: [
      'Uranus was the first planet discovered using a modern telescope by William Herschel in 1781.',
      'Atmospheric temperatures drop to -224°C, making Uranus the coldest planetary atmosphere in the Solar System.',
      'Due to its 98° tilt, each pole experiences 42 years of continuous sunlight followed by 42 years of darkness!'
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    indonesianName: 'Neptunus',
    englishName: 'Neptune',
    type: 'planet',
    color: '#3454d1',
    textureType: 'neptune',
    hasRings: false, // Double-checked: no prominent rings
    hasAtmosphere: true,
    atmosphereColor: '#6080ff',
    mass: 1.02413e26,
    radius: 24622e3,
    density: 1638,
    surfaceGravity: 11.15,
    escapeVelocity: 23500,
    axialTilt: 28.32,
    rotationPeriod: 57996, // 16h 6m
    meanDistance: 4495.1e9,
    semiMajorAxis: 4495.06e9,
    eccentricity: 0.0086,
    inclination: 1.769,
    orbitalPeriod: 60189.0 * 86400, // 164.8 years
    orbitalVelocity: 5430,
    knownMoonsCount: 16,
    temperatureRange: {
      mean: -200
    },
    atmosphereComposition: [
      { name: 'Hidrogen (H₂)', nameEn: 'Hydrogen (H₂)', percentage: 80.0 },
      { name: 'Helium (He)', nameEn: 'Helium (He)', percentage: 19.0 },
      { name: 'Metana (CH₄)', nameEn: 'Methane (CH₄)', percentage: 1.0 }
    ],
    overview: 'Neptunus adalah planet terjauh di Tata Surya kita. Planet biru pekat ini memiliki angin tercepat di Tata Surya yang berhembus hingga kecepatan supersonik lebih dari 2.100 km/jam.',
    overviewEn: 'Neptune is the outermost major planet. This deep azure ice giant features the fastest winds in the Solar System, roaring at supersonic speeds over 2,100 km/h.',
    curriculum: {
      sd: 'Neptunus adalah planet yang paling jauh dari Matahari. Warnanya biru tua pekat dan dipenuhi badai angin yang sangat kencang serta dingin membeku.',
      smp: 'Neptunus ditemukan melalui perhitungan matematika gravitasi sebelum diamati langsung lewat teleskop pada tahun 1846, berkat penyimpangan orbit Uranus yang dihitung oleh Le Verrier dan Adams.',
      sma: 'Kecepatan angin di atmosfer Neptunus mencapai 2.100 km/jam (Mach 1,7). Keberadaan Neptunus membuktikan presisi mekanika orbit Newton: Hukum Gravitasi Universal mampu memprediksi lokasi benda langit yang belum pernah terlihat.'
    },
    curriculumEn: {
      sd: 'Neptune is the farthest planet from the Sun. It has a vivid deep blue color and fierce supersonic winds.',
      smp: 'Neptune was discovered through mathematical gravitational predictions in 1846 by Le Verrier and Adams before telescope confirmation.',
      sma: 'Wind speeds reach 2,100 km/h (Mach 1.7). Its discovery validated Newtonian gravitational mechanics and celestial orbital prediction.'
    },
    didYouKnow: [
      'Neptunus adalah satu-satunya planet yang ditemukan melalui prediksi matematika terlebih dahulu sebelum dilihat teleskop!',
      'Satu tahun di Neptunus sama dengan 165 tahun di Bumi. Neptunus baru menyelesaikan satu orbit penuh sejak ditemukan pada tahun 2011 lalu!',
      'Bulan terbesar Neptunus, Triton, memiliki geyser aktif yang menyemburkan nitrogen beku setinggi 8 km ke angkasa.'
    ],
    didYouKnowEn: [
      'Neptune was the only planet discovered via mathematical prediction before direct telescopic observation!',
      'One year on Neptune equals 165 Earth years. It completed its first full orbit since discovery in 2011!',
      'Neptune\'s largest moon, Triton, has active cryovolcanoes spewing liquid nitrogen 8 km into space.'
    ]
  },
  {
    id: 'pluto',
    name: 'Pluto',
    indonesianName: 'Pluto (Planet Kerdil)',
    englishName: 'Pluto (Dwarf Planet)',
    type: 'dwarf',
    color: '#9c8e80',
    textureType: 'pluto',
    mass: 1.303e22,
    radius: 1188.3e3,
    density: 1854,
    surfaceGravity: 0.62,
    escapeVelocity: 1210,
    axialTilt: 122.53,
    rotationPeriod: -6.387 * 86400,
    meanDistance: 5906.4e9,
    semiMajorAxis: 5906.38e9,
    eccentricity: 0.2488,
    inclination: 17.16,
    orbitalPeriod: 90560 * 86400, // 248 years
    orbitalVelocity: 4670,
    knownMoonsCount: 5,
    temperatureRange: {
      mean: -229
    },
    atmosphereComposition: [
      { name: 'Nitrogen (N₂)', nameEn: 'Nitrogen (N₂)', percentage: 99.0 },
      { name: 'Metana & Karbon Monoksida', nameEn: 'Methane & Carbon Monoxide', percentage: 1.0 }
    ],
    overview: 'Pluto diklasifikasikan ulang sebagai "planet kerdil" oleh IAU pada tahun 2006. Memiliki orbit yang sangat lonjong dan miring di Sabuk Kuiper, serta dataran es nitrogen berbentuk hati bernama Tombaugh Regio.',
    overviewEn: 'Pluto was reclassified as a dwarf planet by the IAU in 2006. It has an eccentric, inclined Kuiper Belt orbit and a prominent nitrogen ice heart named Tombaugh Regio.',
    curriculum: {
      sd: 'Pluto dulunya dianggap sebagai planet ke-9, tetapi sejak 2006 diubah statusnya menjadi planet kerdil karena ukurannya sangat kecil dan orbitnya belum bersih dari benda langit lain.',
      smp: 'Syarat sebuah planet menurut Persatuan Astronomi Internasional (IAU): mengorbit Matahari, berbentuk bulat karena gravitasinya sendiri, dan telah membersihkan lingkungan sekitar orbitnya. Pluto tidak memenuhi syarat ketiga.',
      sma: 'Orbit Pluto berada dalam resonansi orbit 2:3 dengan Neptunus (setiap 3 kali Neptunus mengelilingi Matahari, Pluto mengelilinginya 2 kali), sehingga keduanya tidak pernah bertabrakan meskipun orbitnya saling bersilangan.'
    },
    curriculumEn: {
      sd: 'Pluto was formerly the 9th planet, but in 2006 was designated a dwarf planet due to its tiny size and crowded Kuiper Belt neighborhood.',
      smp: 'IAU planetary criteria: orbit the Sun, round under hydrostatic gravity, and clear its orbital neighborhood. Pluto does not clear its orbit.',
      sma: 'Pluto is locked in a stable 2:3 mean-motion orbital resonance with Neptune, preventing collisions despite crossed orbital projections.'
    },
    didYouKnow: [
      'Pluto memiliki dataran es nitrogen raksasa berbentuk hati yang dinamai Tombaugh Regio!',
      'Bulan terbesar Pluto, Charon, begitu besar sehingga Pluto dan Charon saling mengitari titik pusat massa bersama di luar tubuh Pluto (sistem biner sejati).'
    ],
    didYouKnowEn: [
      'Pluto boasts a massive nitrogen ice plain shaped like a heart, named Tombaugh Regio!',
      'Pluto and its moon Charon orbit a common barycenter located outside Pluto\'s surface, making them a true binary system.'
    ]
  }
];

export function getPlanetById(id: string): PlanetData | undefined {
  return PLANETS_DATA.find(p => p.id === id);
}
