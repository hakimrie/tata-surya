import { MOON_MASS, MOON_RADIUS, MOON_ORBITAL_DISTANCE, MOON_ORBITAL_PERIOD } from '../utils/constants';

export interface MoonData {
  id: string;
  parentId: string;
  name: string;
  indonesianName: string;
  englishName: string;
  color: string;

  // Physical properties (SI Units)
  mass: number;                // kg
  radius: number;              // meters
  surfaceGravity: number;      // m/s^2
  escapeVelocity: number;      // m/s
  orbitalDistance: number;     // meters from parent planet center
  orbitalPeriod: number;       // seconds
  tidalLocked: boolean;

  // Educational descriptions (Bilingual)
  overview: string;
  overviewEn?: string;
  funFact: string;
  funFactEn?: string;
  curriculumNote: string;
  curriculumNoteEn?: string;
}

export const MOONS_DATA: MoonData[] = [
  // --- EARTH ---
  {
    id: 'moon',
    parentId: 'earth',
    name: 'Moon',
    indonesianName: 'Bulan',
    englishName: 'Moon',
    color: '#d8d8d8',
    mass: MOON_MASS,
    radius: MOON_RADIUS,
    surfaceGravity: 1.62,
    escapeVelocity: 2380,
    orbitalDistance: MOON_ORBITAL_DISTANCE,
    orbitalPeriod: MOON_ORBITAL_PERIOD,
    tidalLocked: true,
    overview: 'Bulan adalah satu-satunya satelit alami Bumi dan benda langit terdekat dengan kita. Gravitasi Bulan memicu pasang surut air laut di Bumi dan menstabilkan kemiringan sumbu rotasi Bumi.',
    overviewEn: 'The Moon is Earth\'s only natural satellite and our closest celestial neighbor. Its gravitational pull produces ocean tides and stabilizes Earth\'s rotational axial tilt.',
    funFact: 'Karena penguncian pasang surut (tidal locking), kita di Bumi selalu melihat sisi Bulan yang sama persis!',
    funFactEn: 'Because of tidal locking, observers on Earth always see the exact same face of the Moon!',
    curriculumNote: 'Gravitasi Bulan adalah sekitar 1/6 gravitasi Bumi. Jadi jika beratmu di Bumi 60 kg, di Bulan kamu hanya terasa seberat 10 kg!',
    curriculumNoteEn: 'The Moon\'s surface gravity is about 1/6th of Earth\'s (1.62 m/s²). A 60 kg student would feel like only 10 kg on the lunar surface!'
  },

  // --- MARS ---
  {
    id: 'phobos',
    parentId: 'mars',
    name: 'Phobos',
    indonesianName: 'Phobos',
    englishName: 'Phobos',
    color: '#8b7d77',
    mass: 1.0659e16,
    radius: 11.26e3,
    surfaceGravity: 0.0057,
    escapeVelocity: 11.39,
    orbitalDistance: 9376e3,
    orbitalPeriod: 0.3189 * 86400, // 7h 39m (orbits faster than Mars rotates!)
    tidalLocked: true,
    overview: 'Phobos adalah bulan terbesar Mars yang berbentuk bongkahan kentang tidak beraturan. Orbitnya sangat dekat dengan permukaan Mars dan terus mendekat secara perlahan.',
    overviewEn: 'Phobos is the larger of Mars\'s two moons, shaped like an irregular lumpy potato. It orbits extremely close to Mars and is gradually spiraling inward.',
    funFact: 'Phobos mengorbit Mars 3 kali dalam sehari! Dalam sekitar 50 juta tahun, Phobos akan hancur dan membentuk cincin di sekitar Mars.',
    funFactEn: 'Phobos orbits Mars 3 times a day! In about 50 million years, it will cross the Roche limit and break apart into a ring around Mars.',
    curriculumNote: 'Gaya pasang surut Mars secara bertahap memperlambat Phobos, menyebabkan radius orbitnya menyusut ~2 cm per tahun.',
    curriculumNoteEn: 'Tidal deceleration drains Phobos\'s orbital energy, lowering its orbital radius by approximately 2 cm per year.'
  },
  {
    id: 'deimos',
    parentId: 'mars',
    name: 'Deimos',
    indonesianName: 'Deimos',
    englishName: 'Deimos',
    color: '#a89f91',
    mass: 1.4762e15,
    radius: 6.2e3,
    surfaceGravity: 0.003,
    escapeVelocity: 5.55,
    orbitalDistance: 23463e3,
    orbitalPeriod: 1.263 * 86400, // 30.3 hours
    tidalLocked: true,
    overview: 'Deimos adalah bulan terkecil Mars dengan permukaan yang lebih halus tertutup lapisan tebal regolith debu antariksa.',
    overviewEn: 'Deimos is the smaller outer moon of Mars, smoothed out by a thick blanket of celestial impact regolith.',
    funFact: 'Gravitasi Deimos sangat lemah sehingga jika kamu melompat kencang dengan sepeda di Deimos, kamu bisa terlempar ke luar angkasa!',
    funFactEn: 'Deimos\'s gravity is so weak (0.003 m/s²) that a fast cyclist accelerating off a ramp could reach escape velocity and leave the moon forever!',
    curriculumNote: 'Phobos dan Deimos kemungkinan besar adalah asteroid dari sabuk asteroid yang terperangkap oleh gravitasi Mars miliaran tahun lalu.',
    curriculumNoteEn: 'Both Phobos and Deimos are likely captured carbonaceous C-type asteroids nudged from the main asteroid belt early in solar system history.'
  },

  // --- JUPITER (Galilean Moons) ---
  {
    id: 'io',
    parentId: 'jupiter',
    name: 'Io',
    indonesianName: 'Io',
    englishName: 'Io',
    color: '#e5c158',
    mass: 8.9319e22,
    radius: 1821.6e3,
    surfaceGravity: 1.796,
    escapeVelocity: 2560,
    orbitalDistance: 421700e3,
    orbitalPeriod: 1.769 * 86400,
    tidalLocked: true,
    overview: 'Io adalah objek paling aktif secara vulkanik di seluruh Tata Surya. Memiliki lebih dari 400 gunung berapi aktif yang menyemburkan lava belerang dan sulfur berwarna kuning-oranye.',
    overviewEn: 'Io is the most volcanically active body in the Solar System, boasting over 400 active volcanoes blasting sulfurous plumes and basaltic lava.',
    funFact: 'Gunung berapi di Io menyemburkan semburan gas sulfur hingga ketinggian 500 km di atas permukaannya!',
    funFactEn: 'Volcanic plumes on Io shoot gas and sulfurous ejecta up to 500 km high above its surface!',
    curriculumNote: 'Aktivitas vulkanik dahsyat Io dipicu oleh "pemanasan pasang surut" (tidal heating) akibat tarikan gravitasi Yupiter dan resonansi orbit dengan Europa dan Ganymede.',
    curriculumNoteEn: 'Intense tidal heating caused by gravitational tugs from Jupiter and orbital resonances with Europa and Ganymede continuously liquefies Io\'s interior.'
  },
  {
    id: 'europa',
    parentId: 'jupiter',
    name: 'Europa',
    indonesianName: 'Europa',
    englishName: 'Europa',
    color: '#c5b59a',
    mass: 4.7998e22,
    radius: 1560.8e3,
    surfaceGravity: 1.315,
    escapeVelocity: 2025,
    orbitalDistance: 670900e3,
    orbitalPeriod: 3.551 * 86400,
    tidalLocked: true,
    overview: 'Europa diselimuti kerak es air mulus dengan rekahan-rekahan garis kemerahan. Di bawah kerak esnya terdapat samudra air cair global sedalam puluhan kilometer yang berpotensi memiliki kehidupan mikrobial.',
    overviewEn: 'Europa is encased in a smooth crust of water ice fractured by dark red linear fractures. Beneath lies a global saltwater ocean tens of kilometers deep.',
    funFact: 'Samudra bawah tanah Europa diperkirakan memiliki volume air dua kali lipat lebih banyak daripada seluruh samudra di Bumi digabungkan!',
    funFactEn: 'Europa\'s subsurface ocean is estimated to hold twice as much liquid water as all of Earth\'s oceans combined!',
    curriculumNote: 'Europa menjadi kandidat paling menjanjikan dalam astrobiologi untuk menemukan kehidupan di luar Bumi dalam bentuk mikroorganisme laut dalam.',
    curriculumNoteEn: 'Europa is one of astrobiology\'s top candidates for discovering extraterrestrial microbial life around deep-sea hydrothermal vents.'
  },
  {
    id: 'ganymede',
    parentId: 'jupiter',
    name: 'Ganymede',
    indonesianName: 'Ganymede',
    englishName: 'Ganymede',
    color: '#9e9282',
    mass: 1.4819e23,
    radius: 2634.1e3,
    surfaceGravity: 1.428,
    escapeVelocity: 2741,
    orbitalDistance: 1070400e3,
    orbitalPeriod: 7.155 * 86400,
    tidalLocked: true,
    overview: 'Ganymede adalah bulan terbesar di seluruh Tata Surya. Bahkan ukurannya lebih besar daripada planet Merkurius dan planet kerdil Pluto!',
    overviewEn: 'Ganymede is the largest moon in the Solar System—larger in diameter than planet Mercury and dwarf planet Pluto.',
    funFact: 'Ganymede adalah satu-satunya bulan di Tata Surya yang memiliki medan magnetik internalnya sendiri.',
    funFactEn: 'Ganymede is the only moon in the Solar System known to generate its own internal magnetosphere.',
    curriculumNote: 'Jika Ganymede mengorbit Matahari langsung dan bukan Yupiter, ia akan langsung diklasifikasikan sebagai planet penuh.',
    curriculumNoteEn: 'If Ganymede orbited the Sun directly instead of Jupiter, it would be classified as a major terrestrial planet.'
  },
  {
    id: 'callisto',
    parentId: 'jupiter',
    name: 'Callisto',
    indonesianName: 'Callisto',
    englishName: 'Callisto',
    color: '#6e6259',
    mass: 1.0759e23,
    radius: 2410.3e3,
    surfaceGravity: 1.235,
    escapeVelocity: 2440,
    orbitalDistance: 1882700e3,
    orbitalPeriod: 16.689 * 86400,
    tidalLocked: true,
    overview: 'Callisto adalah salah satu objek dengan permukaan paling tua dan dipenuhi kawah tubrukan paling padat di Tata Surya kita.',
    overviewEn: 'Callisto is one of the oldest and most heavily cratered celestial bodies in the Solar System, serving as an ancient collision chronicle.',
    funFact: 'Permukaan Callisto hampir tidak pernah berubah selama 4 miliar tahun, seperti museum fosil sejarah tubrukan Tata Surya.',
    funFactEn: 'Callisto\'s surface has remained virtually unrefreshed for 4 billion years, preserving the solar system\'s impact history.',
    curriculumNote: 'Karena posisinya paling luar dari 4 bulan Galilean, Callisto mengalami radiasi paling rendah dari Yupiter, menjadikannya calon basis pangkalan manusia paling aman di masa depan.',
    curriculumNoteEn: 'Located outside Jupiter\'s lethal radiation belts, Callisto is considered the safest and most viable base for future human exploration of the Jovian system.'
  },

  // --- SATURN ---
  {
    id: 'titan',
    parentId: 'saturn',
    name: 'Titan',
    indonesianName: 'Titan',
    englishName: 'Titan',
    color: '#e0a96d',
    mass: 1.3452e23,
    radius: 2574.7e3,
    surfaceGravity: 1.352,
    escapeVelocity: 2639,
    orbitalDistance: 1221870e3,
    orbitalPeriod: 15.945 * 86400,
    tidalLocked: true,
    overview: 'Titan adalah bulan terbesar kedua di Tata Surya dan satu-satunya bulan yang memiliki atmosfer tebal kaya nitrogen, serta danau dan sungai cair metana/etana di permukaannya.',
    overviewEn: 'Titan is the second-largest moon in the Solar System and the only moon with a dense nitrogen atmosphere and liquid hydrocarbon lakes and rivers.',
    funFact: 'Di Titan turun hujan senyawa metana cair dan terdapat danau hidrokarbon alami!',
    funFactEn: 'On Titan, clouds rain liquid methane and ethane into massive polar hydrocarbon seas!',
    curriculumNote: 'Tekanan atmosfer di permukaan Titan adalah 1,45 atm (sedikit lebih tinggi dari Bumi). Karena gravitasi rendah dan udara padat, manusia yang memakai sayap buatan bisa terbang mengepakkan tangan di Titan!',
    curriculumNoteEn: 'Surface atmospheric pressure is 1.45 atm. Due to dense air and low gravity (1.35 m/s²), a human strapped with artificial wings could fly by flapping their arms!'
  },
  {
    id: 'enceladus',
    parentId: 'saturn',
    name: 'Enceladus',
    indonesianName: 'Enceladus',
    englishName: 'Enceladus',
    color: '#f0f0f5',
    mass: 1.08e20,
    radius: 252.1e3,
    surfaceGravity: 0.113,
    escapeVelocity: 239,
    orbitalDistance: 237948e3,
    orbitalPeriod: 1.37 * 86400,
    tidalLocked: true,
    overview: 'Enceladus adalah bulan es putih cemerlang yang memantulkan hampir 100% sinar matahari (albedo tertinggi di Tata Surya). Di kutub selatannya terdapat geyser uap air aktif.',
    overviewEn: 'Enceladus is a brilliant white icy moon reflecting nearly 100% of sunlight. Active cryovolcanic geysers erupt from warm fractures at its south pole.',
    funFact: 'Geyser es Enceladus menyemburkan butiran es ke angkasa yang menjadi pemasok utama cincin E Saturnus!',
    funFactEn: 'Enceladus\'s ice geysers vent water vapor and ice crystals into orbit, continuously supplying Saturn\'s vast diffuse E-ring!',
    curriculumNote: 'Wahana Cassini mendeteksi molekul organik kompleks dan hidrogen hidrotermal di dalam semburan geyser Enceladus, tanda lingkungan samudra hangat bawah es.',
    curriculumNoteEn: 'The Cassini spacecraft sampled complex organic molecules and molecular hydrogen in Enceladus\'s plumes, proving the existence of alkaline hydrothermal vents.'
  },

  // --- URANUS ---
  {
    id: 'miranda',
    parentId: 'uranus',
    name: 'Miranda',
    indonesianName: 'Miranda',
    englishName: 'Miranda',
    color: '#b0a49c',
    mass: 6.4e19,
    radius: 235.8e3,
    surfaceGravity: 0.079,
    escapeVelocity: 190,
    orbitalDistance: 129390e3,
    orbitalPeriod: 1.413 * 86400,
    tidalLocked: true,
    overview: 'Miranda memiliki bentang alam paling ekstrem dan aneh di Tata Surya, dengan tebing raksasa Verona Rupes yang tingginya mencapai 20 km!',
    overviewEn: 'Miranda features the most chaotic, extreme fault topography in the Solar System, crowned by the colossal 20-km vertical cliff of Verona Rupes.',
    funFact: 'Tebing Verona Rupes di Miranda adalah tebing tertinggi yang diketahui. Jika kamu melompat dari atasnya, kamu butuh waktu 12 menit sebelum menyentuh dasar!',
    funFactEn: 'Verona Rupes is the tallest cliff in the known universe. Leaping from the cliff edge would result in a 12-minute freefall before landing!',
    curriculumNote: 'Gravitasi rendah Miranda (0,079 m/s²) membuat waktu jatuh bebas dari ketinggian 20 km berlangsung sangat lama tanpa hambatan udara.',
    curriculumNoteEn: 'Miranda\'s low gravity (0.079 m/s²) means you would reach a terminal impact speed of only ~200 km/h after 12 full minutes of falling.'
  },

  // --- NEPTUNE ---
  {
    id: 'triton',
    parentId: 'neptune',
    name: 'Triton',
    indonesianName: 'Triton',
    englishName: 'Triton',
    color: '#8395a7',
    mass: 2.14e22,
    radius: 1353.4e3,
    surfaceGravity: 0.779,
    escapeVelocity: 1455,
    orbitalDistance: 354759e3,
    orbitalPeriod: -5.877 * 86400, // Retrograde orbit!
    tidalLocked: true,
    overview: 'Triton adalah bulan terbesar Neptunus dan satu-satunya bulan besar di Tata Surya yang mengorbit dengan arah berlawanan (retrograde) dari rotasi planet induknya.',
    overviewEn: 'Triton is Neptune\'s largest moon and the only large moon in the Solar System orbiting in a retrograde direction opposite to its planet\'s rotation.',
    funFact: 'Suhu permukaan Triton adalah -235°C, dipenuhi geyser nitrogen beku yang aktif menyembur!',
    funFactEn: 'With surface temperatures of -235°C (38 K), Triton hosts active geysers blasting sublimating nitrogen gas miles into its thin atmosphere!',
    curriculumNote: 'Orbit mundurnya (retrograde) membuktikan bahwa Triton adalah objek Sabuk Kuiper (mirip Pluto) yang tertangkap oleh gravitasi raksasa Neptunus.',
    curriculumNoteEn: 'Its retrograde, highly inclined orbit is conclusive proof that Triton is a captured Kuiper Belt Dwarf Planet, akin to Pluto.'
  }
];

export function getMoonsByPlanetId(planetId: string): MoonData[] {
  return MOONS_DATA.filter(m => m.parentId === planetId);
}

export function getMoonById(id: string): MoonData | undefined {
  return MOONS_DATA.find(m => m.id === id);
}
