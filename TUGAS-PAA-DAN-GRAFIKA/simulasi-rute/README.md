# 🗺️ Simulasi Rute Kota

Aplikasi simulasi pencarian rute terpendek menggunakan algoritma **Dijkstra** dengan visualisasi peta SVG interaktif dan panel chat AI Navigator.

## 🚀 Cara Menjalankan

Cukup buka `index.html` di browser — tidak perlu server/build tool.

> Kalau mau pakai live server: `npx serve .` atau buka lewat VS Code Live Server.

## 📁 Struktur File

```
simulasi-rute/
├── index.html              ← entry point utama
├── JADWAL_GIT.md           ← jadwal push & commit tim
├── css/
│   ├── style.css           ← layout, peta, animasi
│   └── chat.css            ← panel chat AI
└── js/
    ├── graph-data.js       ← data graf & state global
    ├── bezier.js           ← geometri, bezier, clearance
    ├── decorations.js      ← elemen dekorasi SVG
    ├── zoom-pan.js         ← zoom & pan peta
    ├── car.js              ← animasi mobil
    ├── chat.js             ← panel log AI
    ├── probe.js            ← probe animasi Dijkstra
    ├── road-states.js      ← kondisi jalan
    ├── map-draw.js         ← render peta & dekorasi
    ├── ui-controls.js      ← kontrol UI & tombol
    ├── simulation.js       ← simulasi Dijkstra + animasi
    └── randomize.js        ← generator peta acak
```

## ✨ Fitur

- 🗺️ Peta SVG interaktif dengan zoom & pan
- 🔍 Algoritma Dijkstra dengan visualisasi step-by-step
- 🚗 Animasi mobil mengikuti rute (dengan follow-cam)
- 🌧️ Kondisi jalan: Rusak, Perbaikan, Hujan, Macet
- 🎲 Generate peta acak 26 kota (A–Z)
- 🧠 Panel AI Navigator dengan chat log

## 👥 Kontribusi

Lihat `JADWAL_GIT.md` untuk jadwal push dan pembagian tugas tim.
