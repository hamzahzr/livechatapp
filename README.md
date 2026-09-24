# MAXY CHAT

Prototype web app pesan berbayar untuk videotron dengan moderasi admin.

## Halaman
- `index.html` — alur pengguna: pilih paket, isi nama + pesan, preview, aturan, pembayaran demo, status.
- `admin.html` — dashboard moderator/admin: approve, reject, live queue, emergency stop.
- `display.html` — layar videotron fullscreen untuk pesan yang sudah approved.
- `styles.css` — tema MAXY CHAT hitam + gold.
- `app.js` — logika prototype menggunakan localStorage.

## Alur
1. User memilih paket.
2. User mengisi **nama pengirim** dan **pesan**.
3. User menyetujui ketentuan.
4. Pembayaran disimulasikan berhasil (prototype).
5. Pesan masuk status `pending_moderation`.
6. Admin approve/reject.
7. Pesan approved masuk queue.
8. Display videotron hanya mengambil pesan approved.

## Catatan
Ini masih prototype frontend. Belum ada payment gateway asli, database realtime, autentikasi admin, webhook, maupun refund backend.

Tema visual: **Black + Gold**.
