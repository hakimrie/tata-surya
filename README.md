# Tata Surya 3D & Sandbox Gravitasi Edukasi (RK4)

Aplikasi simulasi 3D Tata Surya dan laboratorium gravitasi interaktif berbahasa Indonesia yang dirancang khusus untuk siswa **SD, SMP, SMA/SMK**, dan mahasiswa pengantar fisika/astronomi. Menggabungkan akurasi fisika numerik **Runge-Kutta Orde ke-4 (RK4)** dengan visualisasi WebGL modern via **Three.js** dan **Vite + TypeScript**.

🌐 **Live Demo & Koleksi Eksperimen**: [https://experiment.bukuanak.id/](https://experiment.bukuanak.id/)

![Tata Surya 3D](https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Fitur Utama

### 1. Tata Surya 3D & Orrery Ilmiah
- **Matahari & 8 Planet Utama**: Merkurius, Venus, Bumi, Mars, Yupiter, Saturnus (dengan sistem cincin fotorealistis & divisi Cassini), Uranus, Neptunus, serta planet kerdil Pluto.
- **Satelit Alami Terkemuka**: Bulan (Bumi), Phobos & Deimos (Mars), Io, Europa, Ganymede, Callisto (Yupiter), Titan, Enceladus (Saturnus), Miranda (Uranus), Triton (Neptunus).
- **Sabuk Asteroid & Komet**: Ribuan partikel asteroid dinamis di antara orbit Mars dan Yupiter.
- **Kontrol Kamera Halus**: Rotasi bebas, zoom, pan, fokus objek, mode ikuti orbit (*follow orbit*), pandangan dari permukaan planet (*view from surface*), dan pandangan atas bidang ekliptika (2D top view).
- **Tekstur Prosedural Offline**: Seluruh tekstur planet, atmosfer, badai Bintik Merah Yupiter, daratan benua Bumi & kepulauan Indonesia dibuat secara prosedural via Canvas HTML5 (100% offline tanpa ketergantungan CDN eksternal).

### 2. Mesin Fisika RK4 (Runge-Kutta 4th Order) N-Body
- Menggunakan hukum gravitasi universal Newton:
  $$\mathbf{a}_i = \sum_{j \neq i} G \cdot m_j \frac{\mathbf{r}_j - \mathbf{r}_i}{(|\mathbf{r}_j - \mathbf{r}_i|^2 + \epsilon^2)^{3/2}}$$
- Integrasi numerik 4 langkah derivatif ($k_1, k_2, k_3, k_4$) dengan alokasi memori nol (*zero GC allocations*) untuk performa 60 FPS stabil.
- Sub-stepping otomatis untuk menjaga kestabilan numerik saat kecepatan simulasi dipercepat hingga $10.000\times$.
- Pemantauan kestabilan numerik (*numerical instability watchdog*), deteksi tabrakan lenting/penggabungan (*merging*), serta perhitungan kekekalan energi mekanik ($E = E_k + E_p$) dan momentum sudut secara *real-time*.

### 3. Eksplorasi Skala: Nyata vs Edukasi Visual
- **Mode A (Skala Nyata)**: Menampilkan proporsi jarak dan ukuran planet sebenarnya secara astronomis untuk menunjukkan betapa luasnya kehampaan ruang angkasa.
- **Mode B (Skala Visual Edukasi)**: Membesarkan ukuran planet dan mengompresi jarak agar siswa dapat melihat planet dan orbitnya dengan nyaman di layar.
- **Mode C (Skala Kustom)**: Slider independen untuk ukuran planet, jarak orbit, dan ukuran bulan.
- Dilengkapi banner peringatan sains transparan agar siswa tidak salah mengira visualisasi yang dibesarkan sebagai ukuran sebenarnya.

### 4. Laboratorium Hukum Kepler
- **Hukum I Kepler**: Eksplorasi orbit elips dengan slider eksentrisitas $e = 0,00$ s/d $0,75$, penanda posisi Matahari di fokus 1, fokus kosong 2, perihelion, dan aphelion.
- **Hukum II Kepler**: Visualisasi interaktif sapuan luas juring yang sama dalam selang waktu yang sama ($\frac{dA}{dt} = \text{konstan}$) serta indikator kecepatan seketika (bergerak lebih cepat di perihelion dan lebih lambat di aphelion).
- **Hukum III Kepler (Harmonik)**: Grafik logaritmik dan tabel pembuktian hubungan $T^2 \propto a^3$ di mana rasio $\frac{T^2}{a^3} \approx 1,000$ untuk seluruh planet.

### 5. 10 Eksperimen Terpandu & Gravity Sandbox
Metodologi edukasi: **Eksplorasi ➔ Prediksi ➔ Eksperimen ➔ Amati ➔ Penjelasan Ilmiah**
1. **Orbit Satelit Mengelilingi Bumi**: Menemukan kecepatan injeksi minimum (~7,6 km/s) dan eksperimen pikiran Meriam Newton.
2. **Meloloskan Diri dari Gravitasi Bumi**: Menemukan kecepatan lepas $v_{esc} \approx 11,2\text{ km/s}$ dan transisi energi mekanik $E \ge 0$.
3. **Eksperimen Mengubah Massa Bumi**: Simulasi hipotetis mengubah massa Bumi $0,1\times - 2\times$ dan dampaknya pada gravitasi serta orbit Bulan.
4. **Mengarahkan Asteroid ke Orbit**: Menguji kondisi batas energi orbital spesifik ($\varepsilon < 0$).
5. **Ketapel Gravitasi (Gravity Assist / Slingshot)**: Bagaimana wahana Voyager mencuri momentum planet untuk melesat ke ruang antarbintang.
6. **Hukum II Kepler**: Kekekalan momentum sudut dan speedometer orbit.
7. **Hukum III Kepler**: Uji harmoni periode orbit terhadap jarak semi-mayor.
8. **Peluruhan Orbit Akibat Gesekan Atmosfer**: Menjelaskan *Satellite Paradox* dan penurunan ketinggian stasiun ISS.
9. **Gravity Sandbox**: Membuat planet kustom dengan massa, radius, jarak, dan kecepatan bebas.
10. **Buku Catatan Pengamatan Siswa**: Mencatat hipotesis dan hasil eksperimen dengan fitur ekspor berkas teks/CSV untuk tugas sekolah.

### 6. Indonesia & Antariksa
- **Satelit Palapa**: Kisah peluncuran Palapa A1 (1976) yang menjadikan Indonesia negara ke-3 di dunia pemilik sistem satelit domestik, peran pentingnya menyatukan 17.000 pulau, dan fisika orbit geostasioner (GEO 35.786 km).
- **Observatorium Bosscha**: Sejarah 100+ tahun di Lembang, Teleskop Refraktor Ganda Zeiss 60 cm, dan peran Departemen Astronomi ITB.
- **Observatorium Nasional Timau**: Fasilitas teleskop optik 3,8 meter termutakhir di Nusa Tenggara Timur dan kawasan cagar langit gelap.
- **Keuntungan Garis Khatulistiwa**: Penjelasan dorongan alami rotasi Bumi sebesar 465 m/s (1.674 km/jam) yang menghemat hingga 15% bahan bakar roket saat peluncuran dari khatulistiwa (seperti rencana bandar antariksa Pulau Biak).
- **Kuis Astronomi Interaktif**: Kuis pilihan ganda dengan umpan balik langsung dan penjelasan lengkap berstandar Kurikulum Merdeka.

### 7. Penyesuaian Jenjang Belajar
- **SD**: Penjelasan intuitif, sederhana, fokus pada siang/malam, rotasi, revolusi, dan nama-nama planet.
- **SMP**: Gaya gravitasi, kecepatan orbit, pengantar Hukum Kepler, pasang surut, dan skala Tata Surya.
- **SMA / Universitas**: Mekanika orbit Newton, rumus matematis lengkap, energi mekanik total, integrasi RK4, dan parameter Keplerian.

---

## 🏗️ Struktur Arsitektur Kode

```text
src/
├── main.ts                     # Entrypoint aplikasi
├── App.ts                      # Pengendali utama seluruh modul & UI
├── vite-env.d.ts               # Deklarasi tipe Vite client
├── components/
│   ├── SolarSystem.ts          # Sinkronisasi 3D planet, bulan, skala, sabuk asteroid
│   ├── Planet.ts               # Objek 3D planet, cincin Saturnus, atmosfer, rotasi
│   ├── Moon.ts                 # Objek 3D satelit alami
│   ├── CameraController.ts     # Kontrol orbit, fokus, follow, dan permukaan planet
│   ├── SimulationControls.ts   # Kontrol waktu, play/pause, kecepatan, kalender
│   ├── InfoPanel.ts            # Panel data astronomi, kurikulum, & meter energi real-time
│   ├── ScaleControls.ts        # Kontrol Mode A (Nyata), Mode B (Visual), & Kustom
│   ├── KeplerLab.ts            # Laboratorium interaktif Hukum I, II, & III Kepler
│   ├── ExperimentPanel.ts      # 10 Eksperimen terpandu, sandbox gravitasi, ekspor catatan
│   ├── IndonesiaSpacePanel.ts  # Modul Palapa, Bosscha, Timau, khatulistiwa, & kuis
│   ├── SearchExplorer.ts       # Pencarian instan planet, bulan, dan konsep sains
│   └── WelcomeModal.ts         # Modal sambutan dan pilihan jenjang awal
├── physics/
│   ├── Vector3.ts              # Kelas vektor 3D matematika murni
│   ├── Body.ts                 # Model benda langit fisika SI
│   ├── GravityEngine.ts        # Mesin gravitasi N-Body, sub-stepping, konservasi energi
│   ├── RK4Integrator.ts        # Integrator Runge-Kutta Orde ke-4
│   └── OrbitalMechanics.ts     # Rumus kecepatan orbit, kecepatan lepas, vis-viva, Kepler
├── data/
│   ├── planets.ts              # Dataset astronomi SI 8 planet, Matahari, & kurikulum
│   ├── moons.ts                # Dataset bulan-bulan utama Tata Surya
│   ├── indonesiaSpace.ts       # Sejarah antariksa Indonesia, lini masa, & bank kuis
│   └── experiments.ts          # Panduan 10 eksperimen fisika & prediksi
├── scenes/
│   ├── SolarSystemScene.ts     # Pengelola Scene Three.js, Renderer, pencahayaan, raycaster
│   └── Background.ts           # Skybox bintang spektral 3D & Bima Sakti
├── utils/
│   ├── constants.ts            # Konstanta fisik & astronomi SI (G, AU, massa Matahari, dll)
│   ├── units.ts                # Konverter satuan (Siswa, Astronomi, SI)
│   ├── formatting.ts           # Pemformat angka, tanggal, energi, suhu, & gravitasi
│   └── textureGenerator.ts     # Pembangkit tekstur prosedural berbasis canvas HTML5
└── styles/
    └── main.css                # Desain glassmorphic antariksa responsif & aksesibel
```

---

## 🚀 Cara Menjalankan

### Kebutuhan Sistem
- **Node.js** v18+ (atau v20+)
- **npm** v9+

### Instalasi Dependensi
```bash
npm install
```

### Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser Anda di `http://localhost:3000`.

### Menjalankan Pengujian Unit (Unit Tests)
```bash
npm test
```
Menjalankan pengujian Vitest untuk rumus vektor, mekanika orbit, kecepatan lepas, hukum Kepler, integrator RK4, konservasi energi mekanik, dan konversi satuan.

### Membangun Versi Produksi (Production Build)
```bash
npm run build
```
Menghasilkan berkas statis teroptimasi di dalam direktori `dist/`.

---

## ⌨️ Pintasan Keyboard (Shortcuts)

| Tombol | Fungsi |
|---|---|
| **Spasi (Space)** | Putar / Jeda Simulasi |
| **R** | Reset kamera ke pandangan awal Tata Surya |
| **+ / =** | Perbesar kamera (Zoom In) |
| **- / _** | Perkecil kamera (Zoom Out) |
| **Klik Kiri + Geser** | Rotasi sudut pandang kamera 3D |
| **Klik Kanan + Geser** | Pan / geser posisi kamera |
| **Scroll Mouse** | Zoom in / Zoom out |

---

## 📜 Lisensi
Aplikasi ini dirilis di bawah lisensi [MIT](LICENSE). Dibuat untuk tujuan edukasi sains dan astronomi di Indonesia.
