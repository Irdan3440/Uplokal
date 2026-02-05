# 🇮🇩 Uplokal - From Local Up To Global

**Uplokal** adalah platform digital All-in-One yang dirancang khusus untuk memberdayakan UMKM (Usaha Mikro, Kecil, dan Menengah) Indonesia agar siap bersaing di pasar global. Platform ini menjembatani kesenjangan antara potensi lokal dengan standar internasional melalui rangkaian layanan terintegrasi.

---

## 🚀 Fitur Utama

- **🩺 Business Diagnostic**: Analisis kesehatan bisnis otomatis (marketing, keuangan, legalitas) dengan sistem scoring.
- **💰 Tax & Finance Assistant**: Pengelolaan arus kas sederhana dan estimasi pajak yang ramah UMKM.
- **📢 Marketing Campaign**: Pengelolaan kampanye digital (Ads) dengan dashboard transparansi data real-time.
- **🤝 B2B Matchmaking**: Sistem RFQ (Request for Quotation) untuk menghubungkan supplier lokal dengan pembeli global.
- **📂 Document Vault**: Penyimpanan dokumen legalitas bisnis yang aman dan terorganisir untuk keperluan ekspor.
- **🎓 Export Readiness**: Penilaian dan panduan langkah demi langkah untuk mempersiapkan UMKM menuju ekspor.

---

## 🛠️ Stack Teknologi

Proyek ini dibangun dengan fokus pada performa, aksesibilitas, dan kemudahan pemeliharaan:

- **Struktur**: HTML5 (Semantik)
- **Gaya**: Vanilla CSS3 (Custom Variables, Flexbox, & Grid)
- **Logika**: Vanilla JavaScript (ES6+)
- **Ikon**: Lucide Icons
- **Tipografi**: Plus Jakarta Sans (via Google Fonts)
- **PWA**: Dukungan Service Worker untuk akses offline dan instalasi di perangkat.

---

## 📂 Struktur Proyek

```text
Uplokal/
├── 📁 assets/          # Gambar, logo, dan aset statis lainnya.
├── 📁 components/      # Potongan HTML reusable (header, footer, sidebar).
├── 📁 css/             # Stylesheet terpisah berdasarkan modul/halaman.
│   ├── variables.css   # Definisi warna, font, dan spacing global.
│   ├── global.css      # Reset CSS dan utility classes.
│   ├── dashboard.css   # Styling khusus untuk dashboard pengguna.
│   └── ...
├── 📁 js/              # Logika frontend.
│   ├── app.js          # Inisialisasi utama dan logika global.
│   ├── components/     # Script untuk komponen dinamis.
│   ├── i18n.js         # Sistem internasionalisasi (Multi-bahasa).
│   └── ...
├── index.html          # Halaman landing utama.
├── dashboard.html      # Dashboard utama pengguna.
├── login.html          # Halaman autentikasi.
└── manifest.json       # Konfigurasi Progressive Web App.
```

---

## ⚙️ Persiapan Lokal

1. **Clone repositori**:
   ```bash
   git clone <repository-url>
   ```
2. **Jalankan local server**:
   Karena proyek ini menggunakan modul ES6 dan fetch API untuk komponen, disarankan menggunakan server lokal:
   - Jika menggunakan VS Code: Gunakan ekstensi **Live Server**.
   - Jika menggunakan Python: `python -m http.server`
   - Jika menggunakan Node.js: `npx serve`

3. **Akses**: Buka `http://localhost:5500` (atau port yang sesuai) di browser Anda.

---

## 🎨 Panduan Pengembangan

- **Penamaan Class**: Menggunakan standar BEM (Block Element Modifier) atau penamaan deskriptif yang konsisten.
- **Variabel CSS**: Selalu gunakan variabel dari `variables.css` untuk warna dan tema agar konsistensi desain terjaga.
- **Komponen**: Tambahkan komponen baru ke folder `components/` dan inisialisasi di `js/components/`.

---

## 📝 Lisensi

Hak Cipta © 2026 Uplokal Team. Seluruh hak cipta dilindungi undang-undang.
