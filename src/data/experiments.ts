/**
 * Guided Experiments definition for physics and astronomy students
 * Explore -> Predict -> Experiment -> Observe -> Explain
 */

export interface ExperimentSlider {
  id: string;
  name: string;
  nameEn: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  description: string;
}

export interface ExperimentDefinition {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  objective: string;
  predictionQuestion: {
    question: string;
    options: {
      text: string;
      isCorrect: boolean;
      feedback: string;
    }[];
  };
  sliders: ExperimentSlider[];
  observationPoints: string[];
  explanation: string;
  curriculumCategory: 'Hukum Newton & Gravitasi' | 'Hukum Kepler' | 'Mekanika Antariksa';
}

export const EXPERIMENTS: ExperimentDefinition[] = [
  {
    id: 'satellite-orbit',
    title: '1. Orbit Satelit Mengelilingi Bumi',
    titleEn: 'Put a Satellite Into Orbit',
    icon: '🛰️',
    curriculumCategory: 'Mekanika Antariksa',
    objective: 'Menemukan kecepatan minimum yang dibutuhkan agar sebuah satelit (seperti Satelit Palapa) tidak jatuh kembali ke permukaan Bumi, melainkan masuk ke dalam orbit yang stabil.',
    predictionQuestion: {
      question: 'Apa yang terjadi jika kecepatan peluncuran satelit pada ketinggian 500 km bernilai kurang dari 7,6 km/s?',
      options: [
        {
          text: 'Satelit akan tetap mengorbit dalam lingkaran sempurna.',
          isCorrect: false,
          feedback: 'Keliru. Kecepatan sirkular pada ketinggian 500 km adalah ~7,6 km/s. Jika kurang, gaya gravitasi akan menariknya ke bawah.'
        },
        {
          text: 'Satelit tidak memiliki kelajuan horizontal yang cukup dan akan jatuh kembali ke atmosfer Bumi (lintasan sub-orbital).',
          isCorrect: true,
          feedback: 'Tepat sekali! Gravitasi Bumi akan menarik satelit ke bawah lebih cepat daripada kelengkungan permukaan Bumi melengkung menjauh.'
        },
        {
          text: 'Satelit akan langsung meluncur bebas keluar dari Tata Surya.',
          isCorrect: false,
          feedback: 'Keliru. Untuk lepas dari Bumi dibutuhkan kecepatan lepas ~11,2 km/s.'
        }
      ]
    },
    sliders: [
      {
        id: 'velocity',
        name: 'Kecepatan Awal (v₀)',
        nameEn: 'Initial Velocity',
        min: 3.0,
        max: 13.0,
        step: 0.1,
        defaultValue: 7.6,
        unit: 'km/s',
        description: 'Kecepatan horizontal injeksi wahana antariksa ke orbit.'
      },
      {
        id: 'altitude',
        name: 'Ketinggian Lepas Landas (h)',
        nameEn: 'Altitude',
        min: 200,
        max: 2000,
        step: 50,
        defaultValue: 500,
        unit: 'km',
        description: 'Ketinggian di atas permukaan laut Bumi saat mesin pendorong mati.'
      }
    ],
    observationPoints: [
      'Jika v < 7,6 km/s: Lintasan berbentuk elips tajam yang memotong permukaan Bumi (jatuh / sub-orbital).',
      'Jika v ≈ 7,6 km/s: Orbit mendekati lingkaran sempurna (e ≈ 0).',
      'Jika 7,6 km/s < v < 11,2 km/s: Orbit menjadi elips yang semakin lonjong dengan apogee menjauh.',
      'Jika v ≥ 11,2 km/s: Wahana mencapai kecepatan lepas dan tidak akan pernah kembali (lintasan hiperbolik).'
    ],
    explanation: `
Isaac Newton pertama kali menggambarkan konsep ini melalui eksperimen pikiran **"Meriam Newton" (Newton's Cannonball)**.
Agar satelit dapat mengorbit, kecepatan horizontalnya harus cukup tinggi sehingga kelengkungan lintasan jatuhnya persis sama dengan kelengkungan permukaan Bumi.

Rumus kecepatan orbit sirkular:
$$v_{circ} = \\sqrt{\\frac{G \\times M}{r}}$$
Pada ketinggian 500 km ($r = 6.371 + 500 = 6.871\\text{ km}$), $v_{circ} \\approx 7.615\\text{ m/s} = 7,62\\text{ km/s}$.
Jika kecepatan kurang dari nilai ini, gaya sentripetal gravitasi melengkungkan lintasan terlalu tajam dan satelit menghantam atmosfer Bumi.
    `
  },

  {
    id: 'escape-velocity',
    title: '2. Meloloskan Diri dari Gravitasi Bumi',
    titleEn: 'Escape Earth Gravity',
    icon: '🚀',
    curriculumCategory: 'Hukum Newton & Gravitasi',
    objective: 'Mengamati transisi energi mekanik dari orbit terikat (energi negatif, elips) menuju lintasan lepas tanpa batas (energi positif, hiperbola).',
    predictionQuestion: {
      question: 'Berapakah kecepatan awal minimum yang dibutuhkan dari permukaan Bumi agar wahana antariksa lepas dari tarikan gravitasi Bumi selamanya tanpa mesin pendorong menyala lagi?',
      options: [
        {
          text: 'Sekitar 7,9 km/s',
          isCorrect: false,
          feedback: '7,9 km/s adalah kecepatan orbit sirkular permukaan (kecepatan kosmis pertama), bukan kecepatan lepas.'
        },
        {
          text: 'Sekitar 11,2 km/s',
          isCorrect: true,
          feedback: 'Benar! v_esc = √(2GM/R) ≈ 11,2 km/s (kecepatan kosmis kedua).'
        },
        {
          text: 'Sekitar 29,8 km/s',
          isCorrect: false,
          feedback: '29,8 km/s adalah kecepatan revolusi Bumi mengelilingi Matahari.'
        }
      ]
    },
    sliders: [
      {
        id: 'launchSpeed',
        name: 'Kelajuan Peluncuran',
        nameEn: 'Launch Speed',
        min: 8.0,
        max: 16.0,
        step: 0.2,
        defaultValue: 11.2,
        unit: 'km/s',
        description: 'Kelajuan wahana saat meninggalkan pengaruh atmosfer Bumi.'
      }
    ],
    observationPoints: [
      'Amati nilai Energi Total Mekanik (E = Ek + Ep): apakah bernilai negatif, nol, atau positif?',
      'Jika E < 0 (v < 11,2 km/s): Orbit terikat (bound orbit), wahana akan berbalik kembali.',
      'Jika E ≥ 0 (v ≥ 11,2 km/s): Orbit terbuka (unbound trajectory), wahana terus bergerak menjauh tak hingga.'
    ],
    explanation: `
Kecepatan lepas (*escape velocity*) adalah kelajuan di mana Energi Kinetik wahana persis mengimbangi Energi Potensial Gravitasinya:
$$E = E_k + E_p = \\frac{1}{2}mv^2 - \\frac{GMm}{r} = 0$$
$$\\frac{1}{2}mv_{esc}^2 = \\frac{GMm}{r} \\implies v_{esc} = \\sqrt{\\frac{2GM}{r}} = \\sqrt{2} \\times v_{circ}$$

Untuk Bumi:
$$v_{esc} = \\sqrt{\\frac{2 \\times (6,674 \\times 10^{-11}) \\times (5,972 \\times 10^{24})}{6,371 \\times 10^6}} \\approx 11.186\\text{ m/s} \\approx 11,2\\text{ km/s}$$
    `
  },

  {
    id: 'change-earth-mass',
    title: '3. Eksperimen: Apa yang Terjadi Jika Massa Bumi Berubah?',
    titleEn: 'What Happens If Earth Mass Changes?',
    icon: '⚖️',
    curriculumCategory: 'Hukum Newton & Gravitasi',
    objective: 'Mempelajari dampak hipotetis perubahan massa Bumi terhadap percepatan gravitasi permukaan, orbit Bulan, dan berat benda.',
    predictionQuestion: {
      question: 'Jika massa Bumi tiba-tiba berlipat ganda menjadi 2× massa semula (sementara jari-jarinya tetap sama), apa yang akan terjadi pada orbit Bulan?',
      options: [
        {
          text: 'Bulan akan terlempar lepas menjauhi Bumi ke luar angkasa.',
          isCorrect: false,
          feedback: 'Keliru. Gravitasi yang lebih kuat justru menarik Bulan lebih erat ke arah Bumi!'
        },
        {
          text: 'Tarikan gravitasi yang meningkat akan menarik Bulan ke orbit elips yang lebih dekat dan lebih cepat (periode revolusi memendek).',
          isCorrect: true,
          feedback: 'Tepat sekali! Gaya gravitasi meningkat 2× lipat, membuat orbit Bulan tertarik ke dalam dan kecepatannya meningkat.'
        },
        {
          text: 'Tidak ada perubahan sama sekali pada Bulan.',
          isCorrect: false,
          feedback: 'Keliru. Gaya gravitasi berbanding lurus dengan massa Bumi (F = G*M*m/r²).'
        }
      ]
    },
    sliders: [
      {
        id: 'massMultiplier',
        name: 'Faktor Pengali Massa Bumi',
        nameEn: 'Earth Mass Factor',
        min: 0.1,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
        unit: '× Massa Normal',
        description: 'Ubah massa Bumi secara hipotetis untuk melihat perubahan hukum gravitasi.'
      }
    ],
    observationPoints: [
      'Perhatikan gravitasi permukaan g = GM/R²: jika massa 2×, maka g menjadi ~19,6 m/s².',
      'Perhatikan bentuk lintasan Bulan: jika massa bertambah, orbit Bulan mengerut dan laju orbitnya melonjak naik.',
      'Jika massa Bumi dikurangi di bawah 0,3×: kecepatan orbit Bulan yang lama menjadi terlalu cepat untuk gravitasi lemah, sehingga Bulan lepas terlempar ke orbit Matahari!'
    ],
    explanation: `
> **Catatan Ilmiah Penting:** Ini adalah simulasi komputasional hipotetis untuk tujuan edukasi fisika. Massa Bumi dalam kenyataannya stabil dan tidak dapat berubah secara drastis.

Gaya gravitasi Newton dinyatakan sebagai:
$$F = G \\frac{M_{Bumi} \\cdot m}{r^2}$$
Dan percepatan gravitasi permukaan:
$$g = \\frac{G \\cdot M_{Bumi}}{R^2}$$
Jika $M_{Bumi}$ berlipat ganda, semua berat benda di Bumi berlipat ganda, dan kecepatan orbit sirkular yang dibutuhkan untuk kestabilan satelit/Bulan meningkat sebesar faktor $\\sqrt{2} \\approx 1,414$.
    `
  },

  {
    id: 'asteroid-slingshot',
    title: '4. Mengarahkan Asteroid Masuk ke Orbit',
    titleEn: 'Can You Put an Asteroid Into Orbit?',
    icon: '☄️',
    curriculumCategory: 'Mekanika Antariksa',
    objective: 'Mencoba meluncurkan asteroid dari tepi Tata Surya dan mengarahkannya agar terperangkap dalam orbit elips stabil di sekitar Matahari tanpa menabrak.',
    predictionQuestion: {
      question: 'Dapatkah sebuah asteroid dari luar Tata Surya yang mendekati Matahari terperangkap masuk ke dalam orbit tertutup HANYA dengan tarikan gravitasi Matahari saja (tanpa bantuan tarikan planet atau hambatan gas)?',
      options: [
        {
          text: 'Bisa, gravitasi Matahari otomatis melingkarkan lintasannya.',
          isCorrect: false,
          feedback: 'Keliru. Karena kekekalan energi mekanik, benda yang datang dari jarak tak terhingga dengan energi kinetik awal akan selalu memiliki E > 0 (hiperbola) dan akan terbang lewat lagi menjauh.'
        },
        {
          text: 'Tidak bisa. Benda yang datang dari jauh tanpa kehilangan energi akan mengikuti lintasan hiperbolik terbuka dan kembali keluar Tata Surya.',
          isCorrect: true,
          feedback: 'Tepat sekali! Menurut hukum kekekalan energi, benda bebas membutuhkan interaksi dengan benda ketiga (seperti gravitasi Yupiter) untuk membuang energi dan terperangkap.'
        }
      ]
    },
    sliders: [
      {
        id: 'startDistance',
        name: 'Jarak Awal Peluncuran',
        nameEn: 'Start Distance',
        min: 2.0,
        max: 8.0,
        step: 0.5,
        defaultValue: 4.5,
        unit: 'AU',
        description: 'Jarak awal asteroid dari Matahari.'
      },
      {
        id: 'asteroidSpeed',
        name: 'Kecepatan Asteroid',
        nameEn: 'Asteroid Speed',
        min: 5.0,
        max: 35.0,
        step: 1.0,
        defaultValue: 15.0,
        unit: 'km/s',
        description: 'Kecepatan awal saat peluncuran.'
      },
      {
        id: 'launchAngle',
        name: 'Sudut Arah Luncur',
        nameEn: 'Launch Angle',
        min: 0,
        max: 90,
        step: 5,
        defaultValue: 45,
        unit: 'derajat',
        description: 'Sudut relatif terhadap garis radial Matahari.'
      }
    ],
    observationPoints: [
      'Amati apakah asteroid menabrak Matahari (perihelion < radius Matahari).',
      'Amati apakah asteroid membentuk elips tertutup atau melesat keluar (hiperbola).',
      'Perhatikan perihelion (jarak terdekat) dan aphelion (jarak terjauh) yang dicapai.'
    ],
    explanation: `
Dalam mekanika benda dua titik Newton, lintasan ditentukan oleh Energi Orbital Spesifik $\\varepsilon$:
$$\\varepsilon = \\frac{v^2}{2} - \\frac{GM}{r}$$
- Jika $\\varepsilon < 0$: Orbit Elips (terperangkap dalam Tata Surya)
- Jika $\\varepsilon = 0$: Orbit Parabola
- Jika $\\varepsilon > 0$: Orbit Hiperbola (lolos meninggalkan Tata Surya)

Agar asteroid antarbintang (seperti Oumuamua) dapat terperangkap ke dalam Tata Surya kita, asteroid tersebut harus berinteraksi secara gravitasi dengan planet raksasa seperti Yupiter untuk mentransfer sebagian energinya.
    `
  },

  {
    id: 'gravity-assist',
    title: '5. Ketapel Gravitasi (Gravity Assist / Slingshot)',
    titleEn: 'Gravity Assist Around a Planet',
    icon: '🪐',
    curriculumCategory: 'Mekanika Antariksa',
    objective: 'Memahami bagaimana wahana antariksa (seperti Voyager, Cassini, New Horizons) dapat melipatgandakan kecepatannya secara drastis tanpa membakar bahan bakar ekstra, dengan "mencuri" sedikit momentum dari planet bergerak.',
    predictionQuestion: {
      question: 'Jika wahana melintas di belakang planet yang sedang bergerak mengorbit Matahari, apa yang terjadi pada kecepatan wahana dalam kerangka acuan Matahari setelah terbang lintas?',
      options: [
        {
          text: 'Kecepatan wahana bertambah besar.',
          isCorrect: true,
          feedback: 'Benar! Wahana terseret oleh medan gravitasi planet bergerak, menerima transfer momentum orbital dari planet.'
        },
        {
          text: 'Kecepatan wahana berkurang karena gravitasi menahannya.',
          isCorrect: false,
          feedback: 'Keliru jika melintas di belakang arah gerak planet. Kecepatan berkurang hanya jika melintas di depan arah gerak planet.'
        },
        {
          text: 'Kecepatan wahana selalu tetap sama persis.',
          isCorrect: false,
          feedback: 'Keliru. Kecepatannya sama hanya dalam kerangka acuan planet, tetapi bertambah besar dalam kerangka acuan Matahari!'
        }
      ]
    },
    sliders: [
      {
        id: 'flybyDistance',
        name: 'Jarak Terdekat Lintasan (Perikron)',
        nameEn: 'Flyby Altitude',
        min: 100000,
        max: 800000,
        step: 50000,
        defaultValue: 250000,
        unit: 'km',
        description: 'Jarak terdekat wahana dari pusat planet raksasa saat terbang lintas.'
      },
      {
        id: 'probeSpeed',
        name: 'Kelajuan Wahana Datang',
        nameEn: 'Probe Approach Speed',
        min: 8.0,
        max: 20.0,
        step: 1.0,
        defaultValue: 12.0,
        unit: 'km/s',
        description: 'Kelajuan pendekatan wahana terhadap Matahari.'
      }
    ],
    observationPoints: [
      'Perhatikan vektor kecepatan wahana sebelum dan sesudah melewati planet.',
      'Bandingkan energi kinetik wahana: lajunya bertambah hingga puluhan km/s!',
      'Planet juga melambat, tetapi karena massa planet triliunan kali lipat massa wahana, perlambatan planet tidak dapat terukur.'
    ],
    explanation: `
Prinsip **Ketapel Gravitasi (Gravity Assist)** adalah tumbukan lenting elastis tanpa kontak fisik.
Dalam kerangka acuan planet, kelajuan datang sama dengan kelajuan pergi ($v_{masuk} = v_{keluar}$), hanya arahnya yang berbelok sebesar sudut $\\theta$.

Namun dalam **kerangka acuan Matahari**, karena planet bergerak dengan kelajuan orbit $V_{planet}$, kecepatan wahana setelah terbang lintas dapat bertambah hingga:
$$v_{akhir} \\approx v_{awal} + 2 V_{planet}$$
Wahana Voyager 1 & 2 berhasil mencapai ruang antarbintang berkat bantuan gravitasi berantai dari Yupiter dan Saturnus!
    `
  },

  {
    id: 'kepler-second-law',
    title: '6. Hukum II Kepler: Luas Wilayah dan Kecepatan Orbit',
    titleEn: "Kepler's Second Law: Equal Areas in Equal Time",
    icon: '📐',
    curriculumCategory: 'Hukum Kepler',
    objective: 'Membuktikan secara visual bahwa garis hubung antara planet dan Matahari menyapu luasan juring yang sama dalam selang waktu yang sama (dA/dt = konstan).',
    predictionQuestion: {
      question: 'Kapan sebuah planet dalam orbit elips bergerak dengan kelajuan paling tinggi?',
      options: [
        {
          text: 'Ketika berada di posisi paling dekat dengan Matahari (Perihelion)',
          isCorrect: true,
          feedback: 'Benar! Di perihelion jari-jari r minimum sehingga kecepatan v harus maksimum agar luasan juring per satuan waktu tetap konstan.'
        },
        {
          text: 'Ketika berada di posisi paling jauh dari Matahari (Aphelion)',
          isCorrect: false,
          feedback: 'Keliru. Di aphelion planet bergerak paling lambat.'
        },
        {
          text: 'Kelajuan planet selalu sama di setiap titik orbitnya.',
          isCorrect: false,
          feedback: 'Keliru. Itu hanya berlaku pada orbit lingkaran sempurna (e = 0).'
        }
      ]
    },
    sliders: [
      {
        id: 'eccentricity',
        name: 'Eksentrisitas Orbit (e)',
        nameEn: 'Eccentricity',
        min: 0.0,
        max: 0.75,
        step: 0.05,
        defaultValue: 0.4,
        unit: '',
        description: 'Tingkat kelonjongan bentuk elips orbit (e=0 lingkaran, e mendekati 1 sangat lonjong).'
      }
    ],
    observationPoints: [
      'Amati juring berwarna yang disapu oleh planet: pada saat dekat Matahari, juringnya pendek dan lebar; saat jauh, juringnya panjang dan sempit.',
      'Kedua luasan juring tersebut memiliki luas meter persegi yang persis sama!',
      'Perhatikan speedometer kecepatan orbit planet yang berubah-ubah secara kontinu.'
    ],
    explanation: `
Hukum II Kepler adalah konsekuensi langsung dari **Hukum Kekekalan Momentum Sudut**:
Karena gaya gravitasi selalu mengarah ke pusat Matahari (gaya sentral), torsi terhadap Matahari bernilai nol:
$$\\tau = \\mathbf{r} \\times \\mathbf{F} = 0 \\implies \\mathbf{L} = m (\\mathbf{r} \\times \\mathbf{v}) = \\text{konstan}$$

Laju luasan juring yang disapu per satuan waktu:
$$\\frac{dA}{dt} = \\frac{1}{2} |\\mathbf{r} \\times \\mathbf{v}| = \\frac{L}{2m} = \\text{konstan}$$
Maka untuk selang waktu $\\Delta t$ yang sama, luas juring $\\Delta A$ yang disapu planet selalu sama di mana pun posisinya di orbit.
    `
  },

  {
    id: 'kepler-third-law',
    title: '7. Hukum III Kepler: Perbandingan Orbit Seluruh Planet',
    titleEn: "Kepler's Third Law: Harmonic Law",
    icon: '📊',
    curriculumCategory: 'Hukum Kepler',
    objective: 'Menguji kebenaran hubungan harmonik T² ∝ a³ pada planet-planet di Tata Surya menggunakan grafik interaktif.',
    predictionQuestion: {
      question: 'Jika sebuah planet baru ditemukan dengan jarak rata-rata 4 AU dari Matahari, berapakah perkiraan periode revolusinya?',
      options: [
        {
          text: '4 tahun Bumi',
          isCorrect: false,
          feedback: 'Keliru. Hubungannya bukan T = a, melainkan T² = a³.'
        },
        {
          text: '8 tahun Bumi',
          isCorrect: true,
          feedback: 'Tepat sekali! T² = 4³ = 64, maka T = √64 = 8 tahun Bumi.'
        },
        {
          text: '16 tahun Bumi',
          isCorrect: false,
          feedback: 'Keliru. 16² = 256, bukan 64.'
        }
      ]
    },
    sliders: [
      {
        id: 'semiMajorAxisAU',
        name: 'Jarak Sumbu Semi-Mayor (a)',
        nameEn: 'Semi-Major Axis',
        min: 0.3,
        max: 35.0,
        step: 0.5,
        defaultValue: 5.2,
        unit: 'AU',
        description: 'Jarak rata-rata planet dari Matahari dalam satuan astronomi (AU).'
      }
    ],
    observationPoints: [
      'Titik-titik seluruh 8 planet di Tata Surya membentuk satu garis lurus sempurna pada grafik sumbu T² terhadap a³.',
      'Merkurius (a = 0,39 AU) memiliki T = 0,24 tahun (88 hari).',
      'Neptunus (a = 30 AU) memiliki T = 165 tahun.'
    ],
    explanation: `
Johannes Kepler menerbitkan Hukum Ketiganya pada tahun 1619 dalam bukunya *Harmonices Mundi*.
Dengan menyamakan gaya gravitasi Newton dengan gaya sentripetal:
$$\\frac{GMm}{a^2} = m \\left(\\frac{2\\pi}{T}\\right)^2 a \\implies \\frac{T^2}{a^3} = \\frac{4\\pi^2}{GM}$$
Untuk semua planet yang mengorbit bintang yang sama (Matahari), nilai $\\frac{4\\pi^2}{GM}$ adalah konstan!
Bila $T$ diukur dalam tahun Bumi dan $a$ dalam satuan AU:
$$\\frac{T^2}{a^3} = 1,000$$
    `
  },

  {
    id: 'orbital-decay',
    title: '8. Peluruhan Orbit Akibat Gesekan Atmosfer',
    titleEn: 'Orbital Decay Demonstration',
    icon: '📉',
    curriculumCategory: 'Mekanika Antariksa',
    objective: 'Mengamati bagaimana molekul gas tipis di lapisan termosfer/eksosfer memberikan gaya hambat aerodinamika pada satelit orbit rendah (LEO), menyedot energi orbitnya hingga satelit jatuh terbakar.',
    predictionQuestion: {
      question: 'Ketika sebuah satelit mengalami hambatan udara dan orbitnya perlahan meluruh menyusut ke ketinggian yang lebih rendah, apakah kelajuan linearnya menjadi lebih lambat atau justru lebih cepat?',
      options: [
        {
          text: 'Lebih lambat karena ada gesekan udara yang mengeremnya.',
          isCorrect: false,
          feedback: 'Ini adalah "Paradoks Satelit"! Gesekan memang membuang energi mekanik total, namun karena ketinggian r menyusut ke dalam sumur gravitasi yang lebih dalam, kelajuan linearnya justru bertambah cepat (v = √(GM/r)).'
        },
        {
          text: 'Secara berlawanan dengan intuisi, kelajuan linear satelit justru semakin cepat saat orbitnya menyusut ke bawah!',
          isCorrect: true,
          feedback: 'Benar sekali! Kehilangan energi potensial gravitasi dua kali lebih besar dari kehilangan energi kinetik, sehingga satelit justru melaju lebih cepat di orbit yang lebih rendah.'
        }
      ]
    },
    sliders: [
      {
        id: 'initialAltitude',
        name: 'Ketinggian Awal Satelit',
        nameEn: 'Initial Altitude',
        min: 250,
        max: 800,
        step: 25,
        defaultValue: 350,
        unit: 'km',
        description: 'Ketinggian awal satelit di atas permukaan Bumi.'
      },
      {
        id: 'dragMultiplier',
        name: 'Faktor Hambatan Atmosfer (Kerapatan Udara)',
        nameEn: 'Atmospheric Drag Factor',
        min: 1,
        max: 50,
        step: 2,
        defaultValue: 10,
        unit: '×',
        description: 'Meningkatkan luas penampang satelit atau kerapatan atmosfer untuk mempercepat demonstrasi.'
      }
    ],
    observationPoints: [
      'Amati ketinggian satelit yang berkurang secara spiral ke arah Bumi.',
      'Perhatikan kecepatan orbital satelit yang justru meningkat seiring menyusutnya radius orbit.',
      'Ketika satelit menembus ketinggian di bawah 120 km, hambatan udara melonjak drastis dan satelit memasuki atmosfer tebal (re-entry).'
    ],
    explanation: `
Meskipun luar angkasa sering dianggap ruang hampa mutlak, pada ketinggian 200–500 km (Low Earth Orbit / LEO) masih terdapat sisa-sisa atom nitrogen dan oksigen dari atmosfer atas Bumi.
Gaya hambat aerodinamika dihitung dengan rumus:
$$F_d = \\frac{1}{2} \\rho(h) v^2 C_d A$$
Di mana kerapatan atmosfer $\\rho(h)$ meluruh secara eksponensial terhadap ketinggian:
$$\\rho(h) = \\rho_0 e^{-h / H}$$

Stasiun Luar Angkasa Internasional (ISS) yang berada di ketinggian ~410 km kehilangan ketinggian sekitar 100 meter setiap hari dan harus secara berkala menyalakan pendorong roket (*re-boost*) untuk menaikkan orbitnya kembali!
    `
  },

  {
    id: 'black-hole-encounter',
    title: '9. Pertemuan Gravitasi Lubang Hitam Pengembara',
    titleEn: 'Rogue Black Hole Gravitational Encounter',
    icon: '🕳️',
    curriculumCategory: 'Hukum Newton & Gravitasi',
    objective: 'Menyimulasikan bagaimana benda bermassa luar biasa padat (Lubang Hitam Bermassa Bintang) dapat mengganggu stabilitas orbit planet-planet di Tata Surya melalui tarikan gravitasi pasang surut (tidal forces).',
    predictionQuestion: {
      question: 'Jika sebuah lubang hitam bermassa 3 kali massa Matahari melintas dekat Jupiter dan Saturnus, apa dampak yang paling mungkin terjadi pada planet-planet tersebut?',
      options: [
        {
          text: 'Planet-planet tidak akan terpengaruh sama sekali karena lubang hitam tidak memancarkan cahaya.',
          isCorrect: false,
          feedback: 'Keliru. Gravitasi tidak bergantung pada emisi cahaya, melainkan semata-mata pada massa objek dan jaraknya.'
        },
        {
          text: 'Orbit planet akan mengalami gangguan (perturbasi) besar, eksentrisitas melonjak, bahkan beberapa planet dapat terlempar keluar dari Tata Surya.',
          isCorrect: true,
          feedback: 'Tepat sekali! Gaya gravitasi lubang hitam yang masif akan mematahkan keterikatan orbit Keplerian reguler dan mengubahnya menjadi lintasan kacau (*chaotic orbital resonance*).'
        }
      ]
    },
    sliders: [
      {
        id: 'blackHoleMass',
        name: 'Massa Lubang Hitam (Massa Matahari)',
        nameEn: 'Black Hole Mass (Solar Masses)',
        min: 1.0,
        max: 8.0,
        step: 0.5,
        defaultValue: 3.0,
        unit: 'M☉',
        description: 'Kelipatan massa Matahari dari lubang hitam pengembara yang melintas.'
      },
      {
        id: 'encounterDist',
        name: 'Jarak Terdekat Lintasan (Periastron)',
        nameEn: 'Closest Approach Distance',
        min: 8.0,
        max: 40.0,
        step: 2.0,
        defaultValue: 15.0,
        unit: 'AU',
        description: 'Jarak terdekat sumbu lintasan lubang hitam ke Matahari saat melintas.'
      },
      {
        id: 'flybySpeed',
        name: 'Kecepatan Melintas Lubang Hitam',
        nameEn: 'Flyby Speed',
        min: 15.0,
        max: 50.0,
        step: 5.0,
        defaultValue: 25.0,
        unit: 'km/s',
        description: 'Kecepatan hiperbolik lubang hitam relatif terhadap pusat Tata Surya.'
      }
    ],
    observationPoints: [
      'Amati bagaimana cakram akresi dan bayangan lubang hitam melintasi ruang angkasa antarbintang.',
      'Perhatikan bagaimana planet luar (Jupiter, Saturnus, Uranus, Neptunus) terbelokkan jalurnya.',
      'Perhatikan bagaimana medan gravitasi total Tata Surya bergeser ke arah barycenter gabungan Matahari dan lubang hitam.'
    ],
    explanation: `
Lubang hitam bermassa bintang (*stellar-mass black hole*) terbentuk dari ledakan supernova bintang masif ($M > 20 M_\\odot$).
Meskipun massanya beberapa kali lipat Matahari kita, radius cakrawala peristiwanya (*event horizon* / radius Schwarzschild) sangat kecil:
$$r_s = \\frac{2GM}{c^2}$$
Untuk lubang hitam bermassa $3 M_\\odot$, radius Schwarzschild-nya hanyalah sekitar **8,9 kilometer**!
Ketika melintas di ruang angkasa, tarikan gravitasi Newton-nya bekerja persis seperti benda masif lainnya pada jarak jauh, namun kelengkungan ruang-waktu di dekatnya menciptakan cakram akresi bercahaya dan efek lensa gravitasi (*gravitational lensing*).
    `
  }
];

export function getExperimentById(id: string): ExperimentDefinition | undefined {
  return EXPERIMENTS.find(e => e.id === id);
}
