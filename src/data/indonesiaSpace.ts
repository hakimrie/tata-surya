/**
 * Indonesian Space Heritage, Milestones, and Astronomy Lore
 * "Indonesia & Antariksa"
 */

export interface SpaceMilestone {
  year: number;
  title: string;
  titleEn?: string;
  category: 'satellite' | 'observatory' | 'education' | 'future';
  description: string;
  descriptionEn?: string;
  significance: string;
  significanceEn?: string;
  details: string;
  detailsEn?: string;
}

export interface QuizQuestion {
  id: string;
  level: 'sd' | 'smp' | 'sma';
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanation: string;
  explanationEn?: string;
  topic: 'tata-surya' | 'kepler' | 'gravitasi' | 'indonesia';
}

export const INDONESIA_SPACE_ARTICLES = {
  palapa: {
    title: 'Satelit Palapa: Penyatuan Nusantara Melalui Antariksa',
    titleEn: 'Palapa Satellite: Uniting the Archipelago Through Space',
    subtitle: 'Indonesia Menjadi Negara Berkembang Pertama Pemilik Satelit Komunikasi Domestik',
    subtitleEn: 'Indonesia Became the First Developing Nation to Operate a Domestic Communications Satellite',
    icon: '🛰️',
    content: `
Pada 8 Juli 1976 (9 Juli 1976 waktu Indonesia), sebuah roket Delta 2914 melesat dari Cape Canaveral, Amerika Serikat, membawa **Satelit Palapa A1**. Peluncuran bersejarah ini menjadikan Republik Indonesia sebagai **negara ketiga di dunia** (setelah Amerika Serikat dan Kanada) yang mengoperasikan Sistem Komunikasi Satelit Domestik (SKSD).

### Mengapa Satelit Sangat Vital bagi Indonesia?
Indonesia adalah negara kepulauan terbesar di dunia dengan lebih dari **17.000 pulau**, membentang lebih dari 5.000 km sepanjang khatulistiwa melintasi 3 zona waktu. Membangun kabel telepon bawah laut atau menara pemancar darat di setiap pulau pada tahun 1970-an secara logistik hampir mustahil. 

Satelit Palapa memecahkan tantangan geografis ini dengan menempatkan pemancar telekomunikasi di orbit luar angkasa, sehingga sinyal televisi (TVRI), radio, telepon, dan data dapat menjangkau seluruh pelosok Nusantara secara serentak—dari Sabang sampai Merauke, dari Miangas hingga Pulau Rote. Nama "Palapa" diambil dari **Sumpah Palapa** Mahapatih Gajah Mada (Kerajaan Majapahit 1336) yang bertekad menyatukan Nusantara.

### Fisika Orbit Geostasioner (GEO)
Satelit Palapa ditempatkan di **Orbit Geostasioner (GEO)** pada ketinggian **35.786 km** tepat di atas garis khatulistiwa Bumi.
Pada ketinggian spesifik ini, periode revolusi satelit mengitari Bumi persis sama dengan periode rotasi Bumi (23 jam 56 menit 4 detik). Akibatnya, satelit bergerak dengan kecepatan orbit sekitar **3,07 km/s** dan tampak "diam" tidak bergerak jika dilihat dari stasiun bumi. Ini memungkinkan antena parabola stasiun bumi diarahkan ke satu titik tetap di langit tanpa harus terus-menerus digerakkan.
    `,
    contentEn: `
On July 8, 1976 (July 9 Indonesian time), a Delta 2914 rocket blasted off from Cape Canaveral, USA, carrying **Palapa A1**. This historic launch made the Republic of Indonesia the **third country in the world** (after the USA and Canada) to operate a Domestic Satellite Communication System (SKSD).

### Why Satellites Are Crucial for Indonesia
Indonesia is the world's largest archipelago with over **17,000 islands**, spanning over 5,000 km along the equator across 3 time zones. Constructing subsea telephone cables or terrestrial microwave relay towers across every island in the 1970s was logistically impossible.

Palapa solved this vast geographical barrier by placing telecommunication repeaters in geostationary orbit, allowing television (TVRI), radio, telephone, and emergency data to reach all corners of the nation simultaneously—from Sabang to Merauke. The name "Palapa" honors the 1336 Palapa Oath of Prime Minister Gajah Mada of the Majapahit Empire, who vowed to unite the archipelago.

### Geostationary Orbit (GEO) Physics
Palapa was placed in **Geostationary Orbit (GEO)** at an altitude of **35,786 km** directly above Earth's equator.
At this precise altitude, the satellite's orbital period matches Earth's sidereal rotation period (23h 56m 4s). As a result, the satellite orbits at ~3.07 km/s and appears motionless relative to ground observers, allowing earth station dishes to remain pointed at a fixed point in the sky without continuous tracking.
    `,
    stats: [
      { label: 'Tahun Peluncuran Perdana', value: '1976 (Palapa A1)' },
      { label: 'Ketinggian Orbit (GEO)', value: '35.786 km' },
      { label: 'Kecepatan Orbit', value: '3,07 km/s (11.050 km/jam)' },
      { label: 'Generasi Terkini', value: 'SATRIA-1 (150 Gbps, 2023)' }
    ],
    statsEn: [
      { label: 'Maiden Launch Year', value: '1976 (Palapa A1)' },
      { label: 'Orbital Altitude (GEO)', value: '35,786 km' },
      { label: 'Orbital Speed', value: '3.07 km/s (11,050 km/h)' },
      { label: 'Latest Generation', value: 'SATRIA-1 (150 Gbps, 2023)' }
    ]
  },

  bosscha: {
    title: 'Observatorium Bosscha: Jantung Astronomi Modern Indonesia',
    titleEn: 'Bosscha Observatory: The Heart of Indonesian Modern Astronomy',
    subtitle: 'Warisan Cagar Budaya dan Riset Bintang Ganda Bersejarah di Lembang, Jawa Barat',
    subtitleEn: 'A Century-Old Cultural Heritage and Historical Binary Star Research in Lembang, West Java',
    icon: '🔭',
    content: `
Didirikan pada tahun **1923** di Lembang, Kabupaten Bandung Barat, Jawa Barat pada ketinggian 1.310 meter di atas permukaan laut, **Observatorium Bosscha** adalah observatorium astronomi modern tertua dan paling bersejarah di Indonesia.

### Sejarah Pendirian
Observatorium ini digagas oleh Karel Albert Rudolf Bosscha (seorang pengusaha teh dan filantropis terkemuka) bersama sepupunya R.A. Kerkhoven dan astronom Dr. Joan Voûte melalui perhimpunan *Nederlandsch-Indische Sterrenkundige Vereeniging* (NISV). Bosscha menyumbangkan dana besar dan tanah perkebunan teh Malabar miliknya untuk pembangunan observatorium ini.

### Teleskop Raksasa Refraktor Ganda Zeiss (60 cm)
Ikon utama Observatorium Bosscha adalah **Teleskop Refraktor Ganda Zeiss** berdiameter 60 cm dengan panjang fokus 10,78 meter yang terlindung di dalam kubah baja berputar berbobot ratusan ton. Teleskop ini terdiri dari dua tabung lensa objektif kembar: satu dioptimalkan untuk pengamatan visual manusia dan satu untuk pelat fotografi astronomi. 

Teleskop Zeiss Bosscha menjadi rujukan internasional terkemuka di belahan bumi selatan untuk pengamatan **bintang ganda visual (binary stars)**, penentuan massa bintang, orbit bintang ganda, serta pengamatan planet Mars dan komet.

### Pusat Pendidikan Astronomi ITB
Setelah Indonesia merdeka, Bosscha diserahkan kepada Pemerintah Republik Indonesia pada tahun 1951 dan dikelola oleh **Institut Teknologi Bandung (ITB)**. Di sinilah berdiri Departemen Astronomi ITB—program studi astronomi sarjana hingga doktoral satu-satunya di Indonesia dan Asia Tenggara selama puluhan tahun, melahirkan astronom-astronom terkemuka dunia.
    `,
    contentEn: `
Founded in **1923** in Lembang, West Java at an elevation of 1,310 meters above sea level, **Bosscha Observatory** is the oldest and most historic modern astronomical observatory in Indonesia.

### History of Establishment
The observatory was spearheaded by Karel Albert Rudolf Bosscha, an eminent tea estate entrepreneur and philanthropist, together with his cousin R.A. Kerkhoven and astronomer Dr. Joan Voûte through the NISV (*Nederlandsch-Indische Sterrenkundige Vereeniging*). Bosscha donated substantial funds and Malabar tea plantation land for its construction.

### The Great Zeiss Double Refractor (60 cm)
The centerpiece of Bosscha Observatory is the 60 cm **Zeiss Double Refractor Telescope** with a 10.78-meter focal length housed within a rotating steel dome. It features twin objective tubes: one optimized for visual observation and the other for astronomical photographic plates.

Bosscha's Zeiss telescope became world-renowned across the southern hemisphere for observing visual binary stars, stellar mass determinations, and tracking Mars and comets.

### ITB Center for Astronomy
Following Indonesian independence, Bosscha was handed over to the Republic of Indonesia in 1951 and entrusted to **Institut Teknologi Bandung (ITB)**. ITB established Southeast Asia's premier university astronomy department, producing world-class astrophysicists.
    `,
    stats: [
      { label: 'Tahun Berdiri', value: '1923 (Lebih dari 100 Tahun)' },
      { label: 'Lokasi & Ketinggian', value: 'Lembang, Jabar (1.310 mdpl)' },
      { label: 'Diameter Teleskop Zeiss', value: '60 cm (Panjang 10,78 m)' },
      { label: 'Institusi Pengelola', value: 'Institut Teknologi Bandung (ITB)' }
    ],
    statsEn: [
      { label: 'Year Established', value: '1923 (Over 100 Years)' },
      { label: 'Location & Altitude', value: 'Lembang, West Java (1,310 m ASL)' },
      { label: 'Zeiss Telescope Diameter', value: '60 cm (Focal length 10.78 m)' },
      { label: 'Managing Institution', value: 'Institut Teknologi Bandung (ITB)' }
    ]
  },

  equatorialAdvantage: {
    title: 'Keuntungan Geografis Khatulistiwa Indonesia dalam Sains Antariksa',
    titleEn: 'Indonesia\'s Equatorial Geographic Advantage in Space Science',
    subtitle: 'Mengapa Garis Khatulistiwa adalah Lokasi Emas untuk Peluncuran Wahana Antariksa',
    subtitleEn: 'Why Earth\'s Equator is the Prime Location for Space Launches',
    icon: '🌍',
    content: `
Posisi Indonesia yang terbentang tepat di sepanjang garis khatulistiwa (lintang 0°) memberikan keuntungan fisika orbital yang luar biasa bagi sains dan teknologi antariksa:

### 1. Kecepatan Rotasi Tangensial Maksimum Bumi
Bumi berotasi dari barat ke timur dengan kecepatan sudut konstan. Namun kecepatan linear (tangensial) permukaan Bumi bernilai maksimum di khatulistiwa:
$$v = \\omega \\times R = \\left(\\frac{2\\pi}{86.164\\text{ s}}\\right) \\times 6.378.137\\text{ m} \\approx 465\\text{ m/s} = 1.674\\text{ km/jam}$$

Ketika roket diluncurkan ke arah timur dari wilayah khatulistiwa (seperti rencana bandar antariksa di Pulau Biak, Papua), roket langsung mendapatkan "dorongan gratis" sebesar **465 m/s** dari rotasi alami Bumi! Ini menghemat hingga **10%–15% bahan bakar roket** atau memungkinkan roket membawa muatan (satelit) yang jauh lebih berat dibandingkan jika diluncurkan dari negara berlintang tinggi seperti Rusia atau Eropa.

### 2. Efisiensi Peluncuran ke Orbit Geostasioner (GEO)
Satelit komunikasi komersial umumnya beroperasi di orbit ekuator (inklinasi 0°). Peluncuran dari lokasi non-ekuator memerlukan manuver perubahan bidang orbit (*plane change maneuver*) yang membakar banyak bahan bakar berharga. Dari Indonesia, roket dapat langsung meluncur ke bidang orbit ekuator tanpa koreksi inklinasi sudut orbit.

### 3. Jendela Pengamatan Langit Utara & Selatan Sekaligus
Karena berada di khatulistiwa, pengamat astronomi di Indonesia memiliki keistimewaan dapat mengamati rasi bintang belahan langit utara (seperti Ursa Major / Bintang Biduk) dan belahan langit selatan (seperti Crux / Salib Selatan dan Awan Magellan) sepanjang tahun.
    `,
    contentEn: `
Indonesia's location spanning the equator (0° latitude) provides unmatched orbital mechanics benefits:

### 1. Maximum Tangential Rotational Velocity
Earth rotates west-to-east at constant angular velocity, but tangential linear speed peaks at the equator:
$$v = \\omega \\times R \\approx 465\\text{ m/s} = 1,674\\text{ km/h}$$
Launching eastward from equatorial sites (such as the proposed Biak Spaceport in Papua) gives rockets a free 465 m/s velocity boost, saving **10%–15% rocket propellant** or enabling significantly heavier satellite payloads compared to northern sites in Europe or Russia.

### 2. Direct Ingestion into Geostationary Orbit (GEO)
Geostationary satellites operate in an equatorial orbital plane (0° inclination). Launching from higher latitudes requires expensive plane-change inclination burns. From Indonesia, rockets can inject straight into equatorial orbit with zero plane-change penalty.

### 3. All-Sky Northern & Southern Observational Window
Positioned on the equator, astronomical observers in Indonesia can see both northern constellations (like Ursa Major) and southern treasures (like the Southern Cross and the Magellanic Clouds) throughout the year.
    `,
    stats: [
      { label: 'Lintang Geografis', value: '0° Khatulistiwa' },
      { label: 'Kecepatan Rotasi Alami', value: '465 m/s (1.674 km/jam)' },
      { label: 'Penghematan Bahan Bakar', value: 'Hingga 15% propelan' },
      { label: 'Lokasi Riset Antariksa Masa Depan', value: 'Bandar Antariksa Biak (Papua)' }
    ],
    statsEn: [
      { label: 'Geographic Latitude', value: '0° Equator' },
      { label: 'Earth Surface Speed', value: '465 m/s (1,674 km/h)' },
      { label: 'Propellant Savings', value: 'Up to 15% fuel' },
      { label: 'Future Spaceport Site', value: 'Biak Island (Papua)' }
    ]
  },

  timau: {
    title: 'Observatorium Nasional Timau: Era Baru Astronomi Indonesia',
    titleEn: 'Timau National Observatory: A New Era for Indonesian Astronomy',
    subtitle: 'Fasilitas Teleskop Optik 3,8 Meter Termutakhir di Nusa Tenggara Timur',
    subtitleEn: 'State-of-the-Art 3.8-Meter Optical Telescope Facility in East Nusa Tenggara',
    icon: '🌌',
    content: `
Menjawab polusi cahaya di kawasan Bandung yang semakin meningkat, Indonesia melalui Badan Riset dan Inovasi Nasional (BRIN) bersama ITB membangun **Observatorium Nasional Timau** di kawasan Gunung Timau, Kabupaten Kupang, Nusa Tenggara Timur (NTT).

### Langit Paling Gelap dan Terang di Indonesia
Kawasan NTT dipilih karena memiliki iklim relatif kering dengan lebih dari **70% malam cerah bebas awan per tahun** dan tingkat polusi cahaya sangat rendah. Kawasan sekitarnya juga telah ditetapkan sebagai Taman Langit Gelap (*Dark Sky Park*).

### Teleskop Raksasa 3,8 Meter
Observatorium Nasional Timau dilengkapi dengan teleskop optik cermin berdiameter **3,8 meter**, salah satu teleskop optik terbesar di Asia Tenggara dan belahan bumi selatan, membuka peluang riset eksoplanet, survei galaksi jauh, dan pemantauan sampah antariksa (*space debris*).
    `,
    contentEn: `
In response to rising urban light pollution in Bandung, Indonesia (through BRIN in partnership with ITB) constructed the **Timau National Observatory** atop Mount Timau in Kupang Regency, East Nusa Tenggara (NTT).

### The Darkest and Clearest Skies in Indonesia
NTT was selected for its dry climate boasting over **70% clear cloudless nights per year** and negligible light pollution. The surrounding area has been designated as a protected Dark Sky Park.

### Colossal 3.8-Meter Telescope
Timau features a 3.8-meter segmented mirror optical telescope—one of the largest in Southeast Asia and the southern hemisphere—opening frontier research in exoplanets, deep-sky cosmology, and orbital debris monitoring.
    `,
    stats: [
      { label: 'Lokasi', value: 'Gunung Timau, Kupang, NTT' },
      { label: 'Diameter Cermin Utama', value: '3,8 Meter' },
      { label: 'Kondisi Langit', value: '>70% Malam Cerah / Tahun' },
      { label: 'Status Kawasan', value: 'Cagar Langit Gelap (Dark Sky Reserve)' }
    ],
    statsEn: [
      { label: 'Location', value: 'Mt. Timau, Kupang, NTT' },
      { label: 'Primary Mirror Diameter', value: '3.8 Meters' },
      { label: 'Clear Sky Ratio', value: '>70% Clear Nights / Year' },
      { label: 'Zoning Status', value: 'Dark Sky Reserve' }
    ]
  }
};

export const INDONESIAN_SPACE_MILESTONES: SpaceMilestone[] = [
  {
    year: 1923,
    title: 'Pendirian Observatorium Bosscha',
    titleEn: 'Establishment of Bosscha Observatory',
    category: 'observatory',
    description: 'Pembangunan observatorium astronomi modern pertama di Lembang Jawa Barat.',
    descriptionEn: 'Construction of the first modern astronomical observatory in Lembang, West Java.',
    significance: 'Meletakkan fondasi sains astronomi dan astrofisika di Asia Tenggara.',
    significanceEn: 'Laid the foundation for astronomical and astrophysical research in Southeast Asia.',
    details: 'Dilengkapi teleskop ganda Zeiss 60 cm untuk riset bintang ganda dan fotometri.',
    detailsEn: 'Equipped with the 60 cm twin Zeiss telescope for binary star astrometry and photometry.'
  },
  {
    year: 1951,
    title: 'Pembentukan Departemen Astronomi ITB',
    titleEn: 'Founding of ITB Astronomy Department',
    category: 'education',
    description: 'Program studi astronomi resmi pertama dan satu-satunya di Indonesia.',
    descriptionEn: 'First and only official university degree astronomy department in Indonesia.',
    significance: 'Menghasilkan ratusan astronom, akademisi, dan ilmuwan luar angkasa Indonesia.',
    significanceEn: 'Trained generations of world-renowned Indonesian astronomers and scientists.',
    details: 'Bekerja sama erat dengan Observatorium Bosscha untuk kurikulum perkuliahan dan observasi lapangan.',
    detailsEn: 'Works in close synergy with Bosscha Observatory for observational field research.'
  },
  {
    year: 1963,
    title: 'Pembentukan LAPAN',
    titleEn: 'Establishment of LAPAN',
    category: 'satellite',
    description: 'Lembaga Penerbangan dan Antariksa Nasional didirikan oleh Presiden Soekarno.',
    descriptionEn: 'National Institute of Aeronautics and Space established by President Sukarno.',
    significance: 'Badan resmi pemerintah untuk merintis teknologi roket roket uji muatan (Kartika I) dan sains antariksa.',
    significanceEn: 'Pioneered early Indonesian sounding rockets (Kartika I) and atmospheric science.',
    details: 'Kini diintegrasikan ke dalam Badan Riset dan Inovasi Nasional (BRIN).',
    detailsEn: 'Now integrated into the National Research and Innovation Agency (BRIN).'
  },
  {
    year: 1976,
    title: 'Peluncuran Satelit Palapa A1',
    titleEn: 'Launch of Palapa A1 Satellite',
    category: 'satellite',
    description: 'Satelit telekomunikasi pertama Indonesia diluncurkan ke orbit geostasioner 35.786 km.',
    descriptionEn: 'First Indonesian communications satellite launched into geostationary orbit at 35,786 km.',
    significance: 'Indonesia menjadi negara ke-3 di dunia dengan sistem satelit domestik, menyatukan komunikasi 17.000 pulau.',
    significanceEn: 'Indonesia became the 3rd nation in the world with a domestic satellite system.',
    details: 'Diluncurkan pada 8 Juli 1976 dengan roket Delta 2914.',
    detailsEn: 'Launched on July 8, 1976 atop a Delta 2914 rocket.'
  },
  {
    year: 2007,
    title: 'Peluncuran Satelit Mikro LAPAN-TUBSAT',
    titleEn: 'Launch of LAPAN-TUBSAT Microsatellite',
    category: 'satellite',
    description: 'Satelit mikro pertama buatan teknisi Indonesia bekerja sama dengan TU Berlin Jerman.',
    descriptionEn: 'First microsatellite built by Indonesian engineers in partnership with TU Berlin.',
    significance: 'Membuktikan kemampuan insinyur Indonesia merancang sistem kendali satelit video resolusi tinggi.',
    significanceEn: 'Demonstrated indigenous capability in high-resolution video surveillance satellite control.',
    details: 'Beroperasi di orbit rendah Bumi (LEO) pada ketinggian 630 km.',
    detailsEn: 'Operated in Low Earth Orbit (LEO) at an altitude of 630 km.'
  },
  {
    year: 2023,
    title: 'Peluncuran Satelit SATRIA-1 & Observatorium Timau',
    titleEn: 'Launch of SATRIA-1 & Timau Observatory Inauguration',
    category: 'future',
    description: 'Satelit Very High Throughput Satellite (VHTS) berkapasitas 150 Gbps diluncurkan dengan roket Falcon 9 SpaceX.',
    descriptionEn: 'Very High Throughput Satellite (VHTS) with 150 Gbps capacity launched on SpaceX Falcon 9.',
    significance: 'Menyediakan internet cepat untuk 50.000 titik fasilitas publik di wilayah 3T (Terdepan, Terluar, Tertinggal).',
    significanceEn: 'Provides high-speed connectivity to 50,000 public facilities in remote islands.',
    details: 'Di tahun yang sama, peresmian fasilitas Observatorium Nasional Timau di NTT.',
    detailsEn: 'In the same year, the 3.8m Timau National Observatory was inaugurated in NTT.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    level: 'sd',
    topic: 'tata-surya',
    question: 'Planet apakah yang terletak paling dekat dengan Matahari di Tata Surya kita?',
    questionEn: 'Which planet is closest to the Sun in our Solar System?',
    options: ['Venus', 'Merkurius', 'Bumi', 'Mars'],
    optionsEn: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correctIndex: 1,
    explanation: 'Merkurius adalah planet terdekat dari Matahari dengan jarak rata-rata sekitar 58 juta kilometer, dan membutuhkan waktu 88 hari Bumi untuk satu kali revolusi.',
    explanationEn: 'Mercury is the closest planet to the Sun at an average distance of ~58 million km, completing one revolution in just 88 Earth days.'
  },
  {
    id: 'q2',
    level: 'sd',
    topic: 'tata-surya',
    question: 'Perputaran Bumi pada porosnya sendiri disebut rotasi. Apa akibat utama dari peristiwa rotasi Bumi?',
    questionEn: 'Earth\'s spinning around its own axis is called rotation. What is the primary consequence of Earth\'s rotation?',
    options: [
      'Terjadinya pergantian siang dan malam',
      'Terjadinya pergantian 4 musim dalam setahun',
      'Perubahan bentuk fase Bulan',
      'Bumi menjadi semakin panas'
    ],
    optionsEn: [
      'The cycle of day and night',
      'The changing of four seasons in a year',
      'The phases of the Moon',
      'Earth gradually becoming hotter'
    ],
    correctIndex: 0,
    explanation: 'Rotasi Bumi (berputar pada porosnya selama ~24 jam) menyebabkan bagian Bumi yang menghadap Matahari mengalami siang, sedangkan bagian yang membelakangi Matahari mengalami malam.',
    explanationEn: 'Earth\'s rotation (~24 hours) causes the sunlit hemisphere to experience day while the opposite side experiences night.'
  },
  {
    id: 'q3',
    level: 'smp',
    topic: 'kepler',
    question: 'Menurut Hukum I Johannes Kepler, bagaimanakah bentuk lintasan orbit planet saat mengelilingi Matahari?',
    questionEn: 'According to Johannes Kepler\'s First Law, what shape are planetary orbits around the Sun?',
    options: [
      'Lingkaran sempurna dengan Matahari tepat di titik tengah',
      'Elips dengan Matahari berada pada salah satu titik fokusnya',
      'Garis lurus bolak-balik',
      'Spiral yang semakin lama semakin mendekat ke Matahari'
    ],
    optionsEn: [
      'A perfect circle with the Sun at the exact center',
      'An ellipse with the Sun at one of the two foci',
      'A back-and-forth straight line',
      'A spiral gradually falling into the Sun'
    ],
    correctIndex: 1,
    explanation: 'Hukum I Kepler menyatakan: "Semua planet bergerak dalam lintasan elips mengitari Matahari dengan Matahari berada di salah satu fokus elips tersebut."',
    explanationEn: 'Kepler\'s First Law states: "The orbit of a planet is an ellipse with the Sun located at one of the two foci."'
  },
  {
    id: 'q4',
    level: 'smp',
    topic: 'gravitasi',
    question: 'Mengapa planet bergerak lebih cepat dalam orbitnya ketika berada di dekat Matahari (perihelion)?',
    questionEn: 'Why does a planet travel faster along its orbit when it is closest to the Sun (perihelion)?',
    options: [
      'Karena panas Matahari mendorong planet',
      'Karena gaya gravitasi Matahari lebih kuat pada jarak yang lebih dekat, menariknya lebih cepat',
      'Karena gesekan udara di dekat Matahari lebih sedikit',
      'Karena massa planet membesar saat dekat Matahari'
    ],
    optionsEn: [
      'Because solar heat pushes the planet forward',
      'Because solar gravity is stronger at closer distances, pulling it faster',
      'Because there is less atmospheric drag near the Sun',
      'Because planetary mass increases near the Sun'
    ],
    correctIndex: 1,
    explanation: 'Berdasarkan Hukum Gravitasi Newton (F = G*M*m/r²) dan Hukum II Kepler, saat planet lebih dekat ke Matahari, tarikan gravitasinya lebih besar sehingga percepatan dan kecepatan orbitnya meningkat.',
    explanationEn: 'By Newton\'s Law of Gravitation (F = GMm/r²) and Kepler\'s Second Law, gravitational attraction is stronger at perihelion, accelerating the planet to its highest orbital speed.'
  },
  {
    id: 'q5',
    level: 'smp',
    topic: 'indonesia',
    question: 'Apa nama satelit telekomunikasi pertama yang diluncurkan oleh Indonesia pada tahun 1976?',
    questionEn: 'What is the name of Indonesia\'s first communications satellite launched in 1976?',
    options: ['Satelit Garuda', 'Satelit Palapa A1', 'Satelit Nusantara', 'Satelit Satria-1'],
    optionsEn: ['Garuda Satellite', 'Palapa A1 Satellite', 'Nusantara Satellite', 'SATRIA-1 Satellite'],
    correctIndex: 1,
    explanation: 'Satelit Palapa A1 diluncurkan pada 8 Juli 1976, menjadikan Indonesia negara ke-3 di dunia yang memiliki sistem komunikasi satelit domestik untuk menyatukan 17.000 pulaunya.',
    explanationEn: 'Palapa A1 launched on July 8, 1976, making Indonesia the 3rd country in the world to operate a domestic satellite network across its 17,000 islands.'
  },
  {
    id: 'q6',
    level: 'sma',
    topic: 'kepler',
    question: 'Hukum III Kepler menyatakan hubungan antara periode orbit (T) dan sumbu semi-mayor (a). Bagaimanakah perbandingannya?',
    questionEn: 'Kepler\'s Third Law relates orbital period (T) and semi-major axis (a). What is the exact relationship?',
    options: [
      'T² sebanding dengan a³ (T² ∝ a³)',
      'T sebanding dengan a (T ∝ a)',
      'T³ sebanding dengan a² (T³ ∝ a²)',
      'T sebanding dengan 1/a²'
    ],
    optionsEn: [
      'T² is proportional to a³ (T² ∝ a³)',
      'T is proportional to a (T ∝ a)',
      'T³ is proportional to a² (T³ ∝ a²)',
      'T is proportional to 1/a²'
    ],
    correctIndex: 0,
    explanation: 'Hukum III Kepler: Kuadrat periode revolusi planet sebanding dengan pangkat tiga dari sumbu semi-mayor lintasannya (T²/a³ = konstan = 4π²/(GM)).',
    explanationEn: 'Kepler\'s Third Law: The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit (T²/a³ = 4π²/(GM)).'
  },
  {
    id: 'q7',
    level: 'sma',
    topic: 'gravitasi',
    question: 'Berapakah kecepatan lepas (escape velocity) dari permukaan Bumi jika mengabaikan gesekan atmosfer?',
    questionEn: 'What is the escape velocity from Earth\'s surface (neglecting atmospheric resistance)?',
    options: ['3,0 km/s', '7,9 km/s', '11,2 km/s', '29,8 km/s'],
    optionsEn: ['3.0 km/s', '7.9 km/s', '11.2 km/s', '29.8 km/s'],
    correctIndex: 2,
    explanation: 'Kecepatan lepas permukaan Bumi dihitung dengan rumus v_esc = √(2GM/R) ≈ 11,2 km/s (~40.320 km/jam). Kecepatan 7,9 km/s adalah kecepatan orbit sirkular rendah (LEO).',
    explanationEn: 'Earth\'s surface escape velocity is v_esc = √(2GM/R) ≈ 11.2 km/s (~40,320 km/h). 7.9 km/s is low Earth circular orbital velocity.'
  },
  {
    id: 'q8',
    level: 'sma',
    topic: 'indonesia',
    question: 'Mengapa wilayah khatulistiwa Indonesia (seperti Pulau Biak) sangat ideal untuk meluncurkan roket ke luar angkasa?',
    questionEn: 'Why is Indonesia\'s equatorial territory (e.g. Biak Island) optimal for orbital rocket launches?',
    options: [
      'Karena gaya gravitasi Bumi di khatulistiwa bernilai nol',
      'Karena kecepatan rotasi linear Bumi maksimal di khatulistiwa (~465 m/s), memberikan dorongan kecepatan awal gratis ke arah timur',
      'Karena atmosfer di khatulistiwa jauh lebih tipis dari kutub',
      'Karena jarak Bumi ke Bulan lebih dekat di khatulistiwa'
    ],
    optionsEn: [
      'Because Earth\'s gravity at the equator is zero',
      'Because tangential surface rotation speed peaks at the equator (~465 m/s), giving a free eastward velocity boost',
      'Because equatorial atmosphere is thinner than the poles',
      'Because the Moon is physically closer to the equator'
    ],
    correctIndex: 1,
    explanation: 'Kecepatan linear rotasi Bumi v = ω*R bernilai maksimal di lintang 0° (~465 m/s). Meluncurkan roket ke arah timur dari ekuator menghemat hingga 15% bahan bakar roket dan mempermudah injeksi ke orbit geostasioner.',
    explanationEn: 'Tangential velocity v = ω*R peaks at 0° latitude (~465 m/s). Launching eastward saves up to 15% rocket propellant and avoids costly plane-change orbital maneuvers for GEO.'
  },
  {
    id: 'q9',
    level: 'smp',
    topic: 'tata-surya',
    question: 'Planet manakah di Tata Surya yang memiliki kerapatan rata-rata lebih kecil daripada kerapatan air (kurang dari 1.000 kg/m³)?',
    questionEn: 'Which Solar System planet has an average density lower than that of liquid water (< 1,000 kg/m³)?',
    options: ['Yupiter', 'Saturnus', 'Uranus', 'Neptunus'],
    optionsEn: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correctIndex: 1,
    explanation: 'Saturnus memiliki kerapatan rata-rata hanya 687 kg/m³, lebih ringan daripada air. Jika ada wadah air raksasa yang cukup besar, planet Saturnus akan terapung!',
    explanationEn: 'Saturn has an average density of only 687 kg/m³—lower than water (1,000 kg/m³). If a bathtub large enough existed, Saturn would float!'
  },
  {
    id: 'q10',
    level: 'sma',
    topic: 'gravitasi',
    question: 'Pada teknik gravitasi bantu (gravity assist / slingshot) yang digunakan wahana seperti Voyager, bagaimana wahana antariksa dapat menambah energi kinetiknya?',
    questionEn: 'In a gravity assist / slingshot maneuver utilized by probes like Voyager, how does the spacecraft gain kinetic energy?',
    options: [
      'Menyerap energi panas dari atmosfer planet',
      'Mengambil momentum sudut dan energi orbital dari planet yang sedang bergerak mengelilingi Matahari',
      'Menyalakan mesin roket dengan bahan bakar bantuan gravitasi',
      'Menabrak partikel di cincin planet'
    ],
    optionsEn: [
      'Absorbing thermal energy from planetary atmospheres',
      'Stealing orbital energy and angular momentum from the planet revolving around the Sun',
      'Igniting rocket thrusters augmented by gravity waves',
      'Colliding with ring particles'
    ],
    correctIndex: 1,
    explanation: 'Dalam kerangka acuan Matahari, wahana antariksa yang melintas di belakang planet yang sedang bergerak akan "ditarik" oleh gravitasi planet tersebut, mencuri sebagian kecil energi orbital planet sehingga kecepatannya terhadap Matahari melonjak tinggi.',
    explanationEn: 'In the heliocentric frame, flying behind a moving planet pulls the probe along, transferring a small fraction of the planet\'s orbital momentum to drastically accelerate the spacecraft.'
  }
];
