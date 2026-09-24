# MAXY CHAT v2 — Full Interactive Prototype

Versi ini mengaktifkan seluruh fitur prototype MAXY CHAT dalam satu aplikasi frontend Black + Gold.

## Fitur aktif

### User App
- Stepper 5 tahap: Paket → Pesan → Review → Pembayaran → Status
- 5 tier animasi: Basic, Neon, Premium, Super, VIP
- Preview animasi sesuai tier
- Nama pengirim tetap tampil, tanpa foto profil
- Persetujuan aturan wajib
- Simulasi pembayaran
- Status order realtime
- Riwayat order
- Pengajuan refund setelah pesan ditolak
- Responsive mobile app

### Admin Control Center
- Dashboard & metrics
- Moderasi approve/reject dengan alasan
- Automatic FLAGGED berdasarkan blacklist
- Antrean videotron + reorder + prioritas tampil
- Transaksi
- Refund management
- Event settings
- Edit harga & durasi paket
- Blacklist editor
- Reports
- Pause / Resume / Clear / Emergency Stop
- Data demo generator

### Videotron Display
- Fullscreen display
- Nama pengirim + pesan
- Animasi enter/active/exit berbeda tiap tier
- Queue otomatis
- Pause overlay dan Emergency overlay
- Event name & hashtag dari admin settings

## Cara menjalankan

Jalankan folder dengan web server lokal:

```bash
python -m http.server 8080
```

Buka:
- User: http://localhost:8080/index.html
- Admin: http://localhost:8080/admin.html
- Display: http://localhost:8080/display.html

## Catatan produksi

Versi ini adalah prototype frontend dan menyimpan state di localStorage, sehingga alur lengkap dapat diuji pada browser/origin yang sama.

Untuk produksi multi-device masih perlu backend realtime, autentikasi admin, payment gateway + webhook, database server, audit log, rate limiting, dan penyimpanan refund/transaksi server.
