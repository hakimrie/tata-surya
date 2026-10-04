export interface CometData {
  id: string;
  name: string;
  indonesianName: string;
  englishName: string;
  semiMajorAxisAU: number;
  eccentricity: number;
  inclinationDeg: number;
  perihelionAU: number;
  orbitalPeriodYears: number;
  nucleusRadiusKm: number;
  color: string;
  overview: string;
  overviewEn: string;
  funFact: string;
  funFactEn: string;
}

export const COMETS_DATA: CometData[] = [
  {
    id: 'halley',
    name: '1P/Halley',
    indonesianName: 'Komet Halley (1P/Halley)',
    englishName: 'Halley\'s Comet (1P/Halley)',
    semiMajorAxisAU: 17.834,
    eccentricity: 0.967,
    inclinationDeg: 162.26, // Retrograde orbit
    perihelionAU: 0.586,
    orbitalPeriodYears: 75.3,
    nucleusRadiusKm: 5.5,
    color: '#a7f3d0',
    overview: 'Komet periodik paling terkenal di dunia yang mengorbit Matahari setiap ~75-76 tahun. Intinya adalah "bola salju kotor" yang terdiri dari es air, karbon monoksida, metana, dan debu kosmik. Saat mendekati Matahari, radiasi surya menyublimasikan es membentuk koma dan ekor megah sepanjang jutaan kilometer.',
    overviewEn: 'The most famous periodic comet, returning to the inner Solar System every ~75-76 years. Its nucleus is an icy "dirty snowball" of water ice, CO, methane, and silicate dust. As it nears the Sun, solar radiation vaporizes volatile ice, forming a radiant coma and tails millions of kilometers long.',
    funFact: 'Komet Halley bergerak dalam orbit retrograd (berlawanan arah jarum jam dengan planet-planet). Kunjungan terakhirnya terjadi pada tahun 1986, dan akan kembali menyapa langit Bumi pada pertengahan tahun 2061!',
    funFactEn: 'Halley travels in a retrograde orbit (opposite direction to all major planets). It last visited Earth in 1986 and will return to perihelion in mid-2061!'
  },
  {
    id: 'neowise',
    name: 'C/2020 F3 (NEOWISE)',
    indonesianName: 'Komet NEOWISE (C/2020 F3)',
    englishName: 'Comet NEOWISE (C/2020 F3)',
    semiMajorAxisAU: 360.0,
    eccentricity: 0.9992,
    inclinationDeg: 128.9,
    perihelionAU: 0.295, // Inside Mercury's orbit!
    orbitalPeriodYears: 6800,
    nucleusRadiusKm: 2.5,
    color: '#67e8f9',
    overview: 'Komet spektakuler dengan periode sangat panjang (~6.800 tahun) yang ditemukan oleh teleskop antariksa NEOWISE pada Maret 2020. Melewati perihelion sedekat 0,295 AU dari Matahari (lebih dekat daripada Merkurius) dan menampilkan ekor ganda debu dan ion yang memukau.',
    overviewEn: 'A spectacular long-period comet (~6,800-year orbit) discovered by the NEOWISE space telescope in March 2020. It safely swung past perihelion inside Mercury\'s orbit (0.295 AU), treating observers worldwide to magnificent dual dust and ion tails.',
    funFact: 'Ekor gas biru komet terdiri dari molekul ion karbon monoksida (CO+) yang terdorong langsung oleh angin surya dengan kecepatan hingga 400 km/detik!',
    funFactEn: 'The comet\'s vivid electric-blue ion tail is made of ionized carbon monoxide (CO+) blown directly away by the solar wind at up to 400 km/s!'
  }
];

export function getCometById(id: string): CometData | undefined {
  return COMETS_DATA.find(c => c.id === id);
}
