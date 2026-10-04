/**
 * Internationalization (i18n) Module
 * Supports Indonesian ('id') and English ('en')
 */

export type Language = 'id' | 'en';

export interface Translations {
  // Brand & Header
  appTitle: string;
  appSubtitle: string;
  navAllExperiments: string;
  navAllExperimentsTitle: string;
  navSolar: string;
  navKepler: string;
  navExperiments: string;
  navIndonesia: string;
  navQuiz: string;
  navGuide: string;
  levelPrefix: string;
  unitPrefix: string;
  searchPlaceholder: string;

  // View Toggles
  toggleOrbits: string;
  toggleAsteroids: string;
  toggleGravityField: string;
  toggleTopView: string;

  // Simulation Controls
  simTimeBadge: string;
  rk4Stable: string;
  rk4Unstable: string;
  playBtn: string;
  pauseBtn: string;
  stepPrev: string;
  stepNext: string;
  resetBtn: string;
  timeSpeedLabel: string;
  jumpLabel: string;
  jump1Month: string;
  jump1Year: string;
  jump10Years: string;

  // Scale Controls
  scaleTitle: string;
  scaleModeVisual: string;
  scaleModeTrue: string;
  scaleModeCustom: string;
  planetSizeScale: string;
  distanceScale: string;
  moonSizeScale: string;
  moonOrbitScale: string;
  scaleWarningNotice: string;
  scaleWarningText: string;

  // Info Panel
  tabOverview: string;
  tabPhysical: string;
  tabOrbit: string;
  tabAtmosphere: string;
  tabMoons: string;
  tabEnergy: string;
  btnFocus: string;
  btnFollow: string;
  btnSurface: string;
  labelMass: string;
  labelRadius: string;
  labelDensity: string;
  labelGravity: string;
  labelEscapeVelocity: string;
  labelAxialTilt: string;
  labelMeanTemp: string;
  labelHasRings: string;
  labelSemiMajorAxis: string;
  labelEccentricity: string;
  labelOrbitalVelocity: string;
  labelOrbitalPeriod: string;
  labelRotationPeriod: string;
  labelInclination: string;
  labelDistance: string;
  labelKineticEnergy: string;
  labelPotentialEnergy: string;
  labelTotalEnergy: string;
  labelInstantSpeed: string;
  labelInstantDistance: string;
  energyConservationNote: string;
  didYouKnowTitle: string;
  curriculumTitle: string;
  atmosphereCompositionTitle: string;
  moonsTitle: string;

  // Kepler Lab
  keplerTitle: string;
  keplerSubtitle: string;
  law1Title: string;
  law1Sub: string;
  law2Title: string;
  law2Sub: string;
  law3Title: string;
  law3Sub: string;
  law1Heading: string;
  law1Desc: string;
  law2Heading: string;
  law2Desc: string;
  law3Heading: string;
  law3Desc: string;
  perihelionLabel: string;
  aphelionLabel: string;
  semiMinorLabel: string;
  eccentricityLabel: string;
  selectPlanetPreset: string;
  instantSpeedLabel: string;
  tableColPlanet: string;
  tableColA: string;
  tableColT: string;
  tableColA3: string;
  tableColT2: string;
  tableColRatio: string;
  tableProofNote: string;

  // Experiments & Sandbox
  expTitle: string;
  expSubtitle: string;
  btnGuidedMode: string;
  btnSandboxMode: string;
  selectExpLabel: string;
  objectiveTitle: string;
  step1Prediction: string;
  step2Setup: string;
  step3Observe: string;
  step4Explain: string;
  btnRunExp: string;
  btnResetExp: string;
  studentNotesTitle: string;
  notesPlaceholder: string;
  btnSaveNote: string;
  btnExportNotes: string;
  sandboxIntro: string;
  sandboxPresetsTitle: string;
  sandboxCustomTitle: string;
  sbBodyName: string;
  sbMass: string;
  sbDistance: string;
  sbSpeed: string;
  sbAngle: string;
  btnLaunchBody: string;

  // Indonesia & Space
  idSpaceBadge: string;
  idSpaceTitle: string;
  idSpaceSubtitle: string;
  tabPalapa: string;
  tabBosscha: string;
  tabEquator: string;
  tabTimau: string;
  tabTimeline: string;
  tabQuiz: string;
  quizScoreLabel: string;
  quizCompletedTitle: string;
  btnRetryQuiz: string;
  btnNextQuestion: string;
  explanationTitle: string;
  correctFeedback: string;

  // Welcome Modal
  welcomeBadge: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeFeat1Title: string;
  welcomeFeat1Desc: string;
  welcomeFeat2Title: string;
  welcomeFeat2Desc: string;
  welcomeFeat3Title: string;
  welcomeFeat3Desc: string;
  welcomeFeat4Title: string;
  welcomeFeat4Desc: string;
  welcomeFeat5Title: string;
  welcomeFeat5Desc: string;
  selectLevelPrompt: string;
  levelSdTitle: string;
  levelSdDesc: string;
  levelSmpTitle: string;
  levelSmpDesc: string;
  levelSmaTitle: string;
  levelSmaDesc: string;
  btnStartExploring: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  id: {
    appTitle: 'TATA SURYA 3D',
    appSubtitle: 'Simulasi & Sandbox Gravitasi Edukasi',
    navAllExperiments: 'Semua Eksperimen',
    navAllExperimentsTitle: 'Jelajahi semua eksperimen interaktif di experiment.bukuanak.id',
    navSolar: '🪐 Tata Surya 3D',
    navKepler: '📐 Lab Kepler',
    navExperiments: '🚀 Eksperimen & Sandbox',
    navIndonesia: '🇮🇩 Indonesia & Antariksa',
    navQuiz: '🎯 Kuis',
    navGuide: '❓ Panduan',
    levelPrefix: 'Tingkat',
    unitPrefix: 'Satuan',
    searchPlaceholder: 'Cari planet, bulan, konsep gravitasi, Palapa, Bosscha...',

    toggleOrbits: 'Garis Orbit',
    toggleAsteroids: 'Sabuk Asteroid',
    toggleGravityField: 'Medan Gravitasi',
    toggleTopView: '👁️ Pandangan Atas (Top 2D)',

    simTimeBadge: 'WAKTU SIMULASI',
    rk4Stable: '● RK4 Stabil',
    rk4Unstable: '⚠️ Instabilitas',
    playBtn: '▶ Putar (Spasi)',
    pauseBtn: '⏸ Jeda (Spasi)',
    stepPrev: '◀ 1h',
    stepNext: '1h ▶',
    resetBtn: '↺ Reset',
    timeSpeedLabel: 'Kecepatan Waktu:',
    jumpLabel: 'Lompat:',
    jump1Month: '+1 Bulan',
    jump1Year: '+1 Tahun',
    jump10Years: '+10 Tahun',

    scaleTitle: '🔭 SKALA VISUALISASI',
    scaleModeVisual: 'Mode B: Visual Edukasi',
    scaleModeTrue: 'Mode A: Skala Nyata',
    scaleModeCustom: 'Mode C: Kustom',
    planetSizeScale: 'Ukuran Planet:',
    distanceScale: 'Jarak Orbit:',
    moonSizeScale: 'Ukuran Bulan:',
    moonOrbitScale: 'Jarak Orbit Satelit:',
    scaleWarningNotice: 'Pemberitahuan Skala Visual Edukasi:',
    scaleWarningText: 'Ukuran planet sengaja diperbesar dan jarak dikompresi agar objek dapat terlihat jelas di layar. Untuk melihat proporsi ruang hampa antariksa yang sebenarnya, beralihlah ke Mode A (Skala Nyata).',

    tabOverview: 'Ringkasan',
    tabPhysical: 'Fisik',
    tabOrbit: 'Orbit',
    tabAtmosphere: 'Atmosfer',
    tabMoons: 'Bulan',
    tabEnergy: 'Energi',
    btnFocus: 'Fokus',
    btnFollow: 'Ikuti Orbit',
    btnSurface: 'Permukaan',
    labelMass: 'Massa Fisik',
    labelRadius: 'Jari-Jari (Radius)',
    labelDensity: 'Kerapatan (Density)',
    labelGravity: 'Gravitasi Permukaan',
    labelEscapeVelocity: 'Kecepatan Lepas',
    labelAxialTilt: 'Kemiringan Sumbu (Axial Tilt)',
    labelMeanTemp: 'Suhu Rata-Rata',
    labelHasRings: 'Cincin Planet',
    labelSemiMajorAxis: 'Sumbu Semi-Mayor (a)',
    labelEccentricity: 'Eksentrisitas Orbit (e)',
    labelOrbitalVelocity: 'Kecepatan Orbit Rata-Rata',
    labelOrbitalPeriod: 'Periode Orbit (T)',
    labelRotationPeriod: 'Periode Rotasi (1 Hari)',
    labelInclination: 'Inklinasi Sudut Orbit',
    labelDistance: 'Jarak Rata-Rata',
    labelKineticEnergy: 'Energi Kinetik (Ek = ½mv²)',
    labelPotentialEnergy: 'Energi Potensial Gravitasi (Ep = -GMm/r)',
    labelTotalEnergy: 'Total Energi Mekanik (E = Ek + Ep)',
    labelInstantSpeed: 'Kecepatan Seketika (v)',
    labelInstantDistance: 'Jarak ke Matahari (r)',
    energyConservationNote: 'Kekekalan Energi Mekanik: Pada orbit tertutup elips/lingkaran yang stabil, nilai Total Energi (E) selalu bernilai negatif dan konstan sepanjang waktu.',
    didYouKnowTitle: 'Tahukah Kamu?',
    curriculumTitle: 'Kurikulum IPA / Fisika',
    atmosphereCompositionTitle: 'Komposisi Gas Atmosfer',
    moonsTitle: 'Satelit Alami Terkemuka',

    keplerTitle: 'Laboratorium Hukum Kepler',
    keplerSubtitle: 'Eksplorasi Interaktif Tiga Hukum Pergerakan Planet Johannes Kepler (1609 - 1619)',
    law1Title: 'Hukum I Kepler',
    law1Sub: 'Bentuk Orbit Elips',
    law2Title: 'Hukum II Kepler',
    law2Sub: 'Luas & Kecepatan Sama',
    law3Title: 'Hukum III Kepler',
    law3Sub: 'Harmoni T² ∝ a³',
    law1Heading: 'Hukum I: "Semua planet bergerak dalam lintasan elips dengan Matahari di salah satu titik fokusnya."',
    law1Desc: 'Copernicus sebelumnya menduga orbit planet adalah lingkaran sempurna. Namun, data presisi Tycho Brahe terhadap planet Mars membuat Kepler menyadari bahwa orbit planet sebenarnya berbentuk elips (lonjong).',
    law2Heading: 'Hukum II: "Garis hubung planet-Matahari menyapu luasan yang sama dalam selang waktu yang sama."',
    law2Desc: 'Artinya: planet bergerak paling cepat ketika paling dekat dengan Matahari (Perihelion) dan bergerak paling lambat ketika paling jauh (Aphelion). Ini adalah perwujudan dari Hukum Kekekalan Momentum Sudut!',
    law3Heading: 'Hukum III (Harmonik): "Kuadrat periode revolusi sebanding dengan pangkat tiga sumbu semi-mayor: T² ∝ a³"',
    law3Desc: 'Jika periode orbit dinyatakan dalam tahun Bumi (T) dan jarak dalam satuan astronomi (a dalam AU), maka untuk semua planet di Tata Surya berlaku perbandingan konstan: T² / a³ = 1,000.',
    perihelionLabel: 'Jarak Perihelion (Terdekat):',
    aphelionLabel: 'Jarak Aphelion (Terjauh):',
    semiMinorLabel: 'Sumbu Semi-Minor (b):',
    eccentricityLabel: 'Eksentrisitas Orbit (e):',
    selectPlanetPreset: 'Pilih Planet Preset:',
    instantSpeedLabel: 'Kecepatan Orbital Seketika:',
    tableColPlanet: 'Planet',
    tableColA: 'a (AU)',
    tableColT: 'T (Tahun)',
    tableColA3: 'a³',
    tableColT2: 'T²',
    tableColRatio: 'T²/a³',
    tableProofNote: 'Perhatikan kolom T²/a³ bernilai mendekati 1,000 untuk seluruh planet, membuktikan Hukum Ketiga Kepler secara empiris!',

    expTitle: 'Eksperimen Terpandu',
    expSubtitle: 'Eksplorasi ➔ Prediksi ➔ Eksperimen ➔ Amati ➔ Pahami',
    btnGuidedMode: '🧪 Eksperimen Terpandu (10 Skenario)',
    btnSandboxMode: '🛠️ Gravity Sandbox (Rancang Bebas)',
    selectExpLabel: 'Pilih Eksperimen:',
    objectiveTitle: 'Tujuan Eksperimen:',
    step1Prediction: 'LANGKAH 1: PREDIKSI KAMU',
    step2Setup: 'LANGKAH 2: PENGATURAN PARAMETER SIMULASI',
    step3Observe: 'LANGKAH 3: AMATI APA YANG TERJADI',
    step4Explain: 'LANGKAH 4: PENJELASAN FISIKA ILMIAH',
    btnRunExp: '🚀 Jalankan Simulasi Eksperimen',
    btnResetExp: '↺ Pulihkan Default',
    studentNotesTitle: 'Catatan Pengamatan Siswa:',
    notesPlaceholder: 'Tuliskan hipotesis, apa yang kamu amati dari lintasan planet/satelit, dan kesimpulanmu di sini...',
    btnSaveNote: '💾 Catat',
    btnExportNotes: '📥 Ekspor Catatan (TXT/CSV)',
    sandboxIntro: 'Selamat datang di Gravity Sandbox! Di sini kamu bebas menciptakan sistem tata surya miniaturnya sendiri, menambahkan benda langit, mengatur kecepatan orbit, dan mengamati apakah gravitasinya stabil atau saling bertubrukan!',
    sandboxPresetsTitle: 'Pilih Template Benda Langit:',
    sandboxCustomTitle: 'Buat Benda Langit Kustom:',
    sbBodyName: 'Nama Benda:',
    sbMass: 'Massa (relatif terhadap Bumi):',
    sbDistance: 'Jarak dari Pusat (AU):',
    sbSpeed: 'Kelajuan Awal (km/s):',
    sbAngle: 'Arah Gerak (Sudut Tangensial):',
    btnLaunchBody: '🚀 Luncurkan ke Sistem Gravitasi',

    idSpaceBadge: '🇮🇩 INDONESIA & ANTARIKSA',
    idSpaceTitle: 'Kiprah Astronomi & Antariksa Indonesia',
    idSpaceSubtitle: 'Dari Satelit Palapa, Observatorium Bosscha, hingga Cagar Langit Gelap Timau',
    tabPalapa: '🛰️ Satelit Palapa',
    tabBosscha: '🔭 Obs. Bosscha',
    tabEquator: '🌍 Khatulistiwa Emas',
    tabTimau: '🌌 Obs. Timau NTT',
    tabTimeline: '📜 Lini Masa',
    tabQuiz: '🎯 Kuis Interaktif',
    quizScoreLabel: 'Skor:',
    quizCompletedTitle: 'Kuis Selesai!',
    btnRetryQuiz: 'Ulangi Kuis ↺',
    btnNextQuestion: 'Pertanyaan Berikutnya ➔',
    explanationTitle: 'Penjelasan Ilmiah:',
    correctFeedback: '🎉 Jawaban Benar!',

    welcomeBadge: '🚀 LABORATORIUM ASTRONOMI & FISIKA INTERAKTIF',
    welcomeTitle: 'Selamat Datang di Tata Surya 3D!',
    welcomeSubtitle: 'Simulasi Sains & Sandbox Gravitasi Berbasis RK4 untuk Siswa & Mahasiswa Indonesia',
    welcomeFeat1Title: 'Jelajahi Planet & Bulan',
    welcomeFeat1Desc: 'Amati 8 planet utama, struktur atmosfer, cincin Saturnus, dan satelit alami secara 3D.',
    welcomeFeat2Title: 'Pelajari Orbit & Hukum Kepler',
    welcomeFeat2Desc: 'Pahami mengapa orbit berbentuk elips, sapuan luas yang sama, dan perbandingan harmonik T² ∝ a³.',
    welcomeFeat3Title: 'Simulasi Gravitasi N-Body RK4',
    welcomeFeat3Desc: 'Integrator numerik Runge-Kutta Orde ke-4 nyata yang menghitung tarikan gravitasi timbal-balik Newton.',
    welcomeFeat4Title: 'Lakukan Eksperimen & Sandbox',
    welcomeFeat4Desc: 'Uji kecepatan lepas, ubah massa Bumi, tembakkan asteroid, atau rancang sistem tata surya sendiri!',
    welcomeFeat5Title: 'Kenali Astronomi Indonesia',
    welcomeFeat5Desc: 'Pelajari Satelit Palapa, sejarah 100 tahun Observatorium Bosscha, dan keistimewaan khatulistiwa.',
    selectLevelPrompt: 'Pilih Jenjang Belajar Kamu:',
    levelSdTitle: 'SD',
    levelSdDesc: 'Pengenalan planet, siang-malam, rotasi & revolusi',
    levelSmpTitle: 'SMP',
    levelSmpDesc: 'Gaya gravitasi, kecepatan orbit, pengantar Kepler',
    levelSmaTitle: 'SMA / Univ',
    levelSmaDesc: 'Mekanika Newton, RK4, energi mekanik, perhitungan orbit',
    btnStartExploring: 'Mulai Jelajahi Tata Surya ➔'
  },

  en: {
    appTitle: '3D SOLAR SYSTEM',
    appSubtitle: 'Educational Simulation & Gravity Sandbox',
    navAllExperiments: 'All Experiments',
    navAllExperimentsTitle: 'Explore all interactive experiments at experiment.bukuanak.id',
    navSolar: '🪐 3D Solar System',
    navKepler: '📐 Kepler Lab',
    navExperiments: '🚀 Experiments & Sandbox',
    navIndonesia: '🇮🇩 Indonesia & Space',
    navQuiz: '🎯 Quiz',
    navGuide: '❓ Guide',
    levelPrefix: 'Level',
    unitPrefix: 'Units',
    searchPlaceholder: 'Search planets, moons, gravity concepts, Palapa, Bosscha...',

    toggleOrbits: 'Orbit Paths',
    toggleAsteroids: 'Asteroid Belt',
    toggleGravityField: 'Gravity Field',
    toggleTopView: '👁️ Ecliptic Top (2D)',

    simTimeBadge: 'SIMULATION TIME',
    rk4Stable: '● RK4 Stable',
    rk4Unstable: '⚠️ Instability',
    playBtn: '▶ Play (Space)',
    pauseBtn: '⏸ Pause (Space)',
    stepPrev: '◀ 1d',
    stepNext: '1d ▶',
    resetBtn: '↺ Reset',
    timeSpeedLabel: 'Time Speed:',
    jumpLabel: 'Jump:',
    jump1Month: '+1 Month',
    jump1Year: '+1 Year',
    jump10Years: '+10 Years',

    scaleTitle: '🔭 VISUAL SCALE',
    scaleModeVisual: 'Mode B: Visual Educational',
    scaleModeTrue: 'Mode A: True Scale',
    scaleModeCustom: 'Mode C: Custom',
    planetSizeScale: 'Planet Size:',
    distanceScale: 'Orbit Distance:',
    moonSizeScale: 'Moon Size:',
    moonOrbitScale: 'Moon Orbit Distance:',
    scaleWarningNotice: 'Educational Visual Scale Notice:',
    scaleWarningText: 'Planet sizes are intentionally exaggerated and distances compressed so objects are clearly visible on screen. To view true astronomical proportions, switch to Mode A (True Scale).',

    tabOverview: 'Overview',
    tabPhysical: 'Physical',
    tabOrbit: 'Orbit',
    tabAtmosphere: 'Atmosphere',
    tabMoons: 'Moons',
    tabEnergy: 'Energy',
    btnFocus: 'Focus',
    btnFollow: 'Follow Orbit',
    btnSurface: 'Surface View',
    labelMass: 'Physical Mass',
    labelRadius: 'Radius',
    labelDensity: 'Mean Density',
    labelGravity: 'Surface Gravity',
    labelEscapeVelocity: 'Escape Velocity',
    labelAxialTilt: 'Axial Tilt',
    labelMeanTemp: 'Mean Temperature',
    labelHasRings: 'Ring System',
    labelSemiMajorAxis: 'Semi-Major Axis (a)',
    labelEccentricity: 'Orbital Eccentricity (e)',
    labelOrbitalVelocity: 'Mean Orbital Velocity',
    labelOrbitalPeriod: 'Orbital Period (T)',
    labelRotationPeriod: 'Rotation Period (1 Day)',
    labelInclination: 'Orbital Inclination',
    labelDistance: 'Mean Distance',
    labelKineticEnergy: 'Kinetic Energy (KE = ½mv²)',
    labelPotentialEnergy: 'Gravitational Potential Energy (U = -GMm/r)',
    labelTotalEnergy: 'Total Mechanical Energy (E = KE + U)',
    labelInstantSpeed: 'Instantaneous Speed (v)',
    labelInstantDistance: 'Distance to Sun (r)',
    energyConservationNote: 'Conservation of Mechanical Energy: In bound elliptical/circular orbits, Total Energy (E) remains constant and negative over time.',
    didYouKnowTitle: 'Did You Know?',
    curriculumTitle: 'Curriculum Connection',
    atmosphereCompositionTitle: 'Atmospheric Composition',
    moonsTitle: 'Major Natural Satellites',

    keplerTitle: "Kepler's Laws Laboratory",
    keplerSubtitle: "Interactive Exploration of Johannes Kepler's Three Laws of Planetary Motion (1609 - 1619)",
    law1Title: "Kepler's 1st Law",
    law1Sub: 'Elliptical Orbits',
    law2Title: "Kepler's 2nd Law",
    law2Sub: 'Equal Areas & Velocity',
    law3Title: "Kepler's 3rd Law",
    law3Sub: 'Harmonic T² ∝ a³',
    law1Heading: 'First Law: "Planets orbit the Sun in ellipses with the Sun at one focus."',
    law1Desc: 'Copernicus previously assumed orbits were perfect circles. However, Tycho Brahe\'s precise observational data of Mars led Kepler to discover that planetary orbits are actually ellipses.',
    law2Heading: 'Second Law: "A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time."',
    law2Desc: 'This means planets travel fastest when closest to the Sun (Perihelion) and slowest when farthest (Aphelion). This is a direct consequence of Conservation of Angular Momentum!',
    law3Heading: 'Third Law (Harmonic): "The square of the orbital period is proportional to the cube of the semi-major axis: T² ∝ a³"',
    law3Desc: 'When the orbital period is measured in Earth years (T) and distance in Astronomical Units (a in AU), the ratio is constant for all planets in the Solar System: T² / a³ = 1.000.',
    perihelionLabel: 'Perihelion Distance (Closest):',
    aphelionLabel: 'Aphelion Distance (Farthest):',
    semiMinorLabel: 'Semi-Minor Axis (b):',
    eccentricityLabel: 'Orbital Eccentricity (e):',
    selectPlanetPreset: 'Select Preset Planet:',
    instantSpeedLabel: 'Instantaneous Orbital Speed:',
    tableColPlanet: 'Planet',
    tableColA: 'a (AU)',
    tableColT: 'T (Years)',
    tableColA3: 'a³',
    tableColT2: 'T²',
    tableColRatio: 'T²/a³',
    tableProofNote: 'Notice that the T²/a³ column equals ~1.000 for every planet, empirically proving Kepler\'s Third Law!',

    expTitle: 'Guided Experiments',
    expSubtitle: 'Explore ➔ Predict ➔ Experiment ➔ Observe ➔ Explain',
    btnGuidedMode: '🧪 Guided Experiments (10 Scenarios)',
    btnSandboxMode: '🛠️ Gravity Sandbox (Free Design)',
    selectExpLabel: 'Select Experiment:',
    objectiveTitle: 'Objective:',
    step1Prediction: 'STEP 1: YOUR PREDICTION',
    step2Setup: 'STEP 2: SIMULATION PARAMETERS',
    step3Observe: 'STEP 3: OBSERVE THE OUTCOME',
    step4Explain: 'STEP 4: SCIENTIFIC EXPLANATION',
    btnRunExp: '🚀 Run Simulation Experiment',
    btnResetExp: '↺ Reset Defaults',
    studentNotesTitle: 'Student Observation Notes:',
    notesPlaceholder: 'Write your hypotheses, observations of the orbital trajectory, and conclusions here...',
    btnSaveNote: '💾 Save Note',
    btnExportNotes: '📥 Export Notes (TXT/CSV)',
    sandboxIntro: 'Welcome to the Gravity Sandbox! Create your own miniature solar system, add celestial bodies, set initial velocities, and observe gravitational stability or collisions!',
    sandboxPresetsTitle: 'Select Celestial Preset:',
    sandboxCustomTitle: 'Create Custom Celestial Body:',
    sbBodyName: 'Body Name:',
    sbMass: 'Mass (relative to Earth):',
    sbDistance: 'Distance from Center (AU):',
    sbSpeed: 'Initial Speed (km/s):',
    sbAngle: 'Direction (Tangential Angle):',
    btnLaunchBody: '🚀 Launch into Gravity System',

    idSpaceBadge: '🇮🇩 INDONESIA & SPACE',
    idSpaceTitle: 'Indonesian Astronomy & Space Heritage',
    idSpaceSubtitle: 'From the Palapa Satellite, Bosscha Observatory, to the Timau Dark Sky Reserve',
    tabPalapa: '🛰️ Palapa Satellite',
    tabBosscha: '🔭 Bosscha Obs.',
    tabEquator: '🌍 Equatorial Boost',
    tabTimau: '🌌 Timau Obs. NTT',
    tabTimeline: '📜 Timeline',
    tabQuiz: '🎯 Interactive Quiz',
    quizScoreLabel: 'Score:',
    quizCompletedTitle: 'Quiz Complete!',
    btnRetryQuiz: 'Retry Quiz ↺',
    btnNextQuestion: 'Next Question ➔',
    explanationTitle: 'Scientific Explanation:',
    correctFeedback: '🎉 Correct Answer!',

    welcomeBadge: '🚀 INTERACTIVE ASTRONOMY & PHYSICS LAB',
    welcomeTitle: 'Welcome to 3D Solar System!',
    welcomeSubtitle: 'RK4 Numerical Gravitational Sandbox & Planetarium for Students and Educators',
    welcomeFeat1Title: 'Explore Planets & Moons',
    welcomeFeat1Desc: 'Examine the 8 planets, atmospheric compositions, Saturn\'s rings, and natural satellites in 3D.',
    welcomeFeat2Title: "Learn Orbits & Kepler's Laws",
    welcomeFeat2Desc: 'Understand elliptical orbits, equal area sweeps, and the harmonic ratio T² ∝ a³.',
    welcomeFeat3Title: 'RK4 N-Body Gravitational Engine',
    welcomeFeat3Desc: 'A real 4th-order Runge-Kutta numerical integrator calculating mutual Newtonian gravity.',
    welcomeFeat4Title: 'Hands-on Experiments & Sandbox',
    welcomeFeat4Desc: 'Test escape velocities, alter Earth\'s mass, launch asteroids, or build your own system!',
    welcomeFeat5Title: 'Discover Indonesian Astronomy',
    welcomeFeat5Desc: 'Learn about the Palapa satellite, 100-year Bosscha heritage, and equatorial launch advantages.',
    selectLevelPrompt: 'Select Your Learning Level:',
    levelSdTitle: 'Elementary (SD)',
    levelSdDesc: 'Planet basics, day/night cycles, rotation & revolution',
    levelSmpTitle: 'Junior High (SMP)',
    levelSmpDesc: 'Gravitational forces, orbital velocity, Kepler introduction',
    levelSmaTitle: 'Senior High / Univ (SMA)',
    levelSmaDesc: 'Newtonian mechanics, RK4, mechanical energy, orbital equations',
    btnStartExploring: 'Start Exploring ➔'
  }
};

function getInitialLang(): Language {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('tata_surya_lang') as Language;
    if (saved === 'id' || saved === 'en') return saved;
  }
  return 'id';
}

let currentLang: Language = getInitialLang();

export function getLanguage(): Language {
  return currentLang;
}

export function setLanguage(lang: Language): void {
  currentLang = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('tata_surya_lang', lang);
  }
}

export function t(): Translations {
  return TRANSLATIONS[currentLang];
}
