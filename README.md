# Bab 10 · Keadilan Sosial

Slide presentasi kelompok untuk mata kuliah **Character Building: Pancasila** (CHAR6013001), BINUS University.
Dosen: Dr. Jamson Siallagan, S.Th., M.A., M.Th. · Presentasi: Jumat, 27 November 2026.

Dibuat dengan HTML, CSS, dan JavaScript murni. Tidak ada framework, build step, atau CDN. Font sudah disertakan di `assets/fonts/`, jadi slide tetap tampil normal tanpa internet.

## Isi folder

```
index.html          isi 30 slide + catatan pembicara
style.css           tampilan
script.js           navigasi dan elemen interaktif
assets/fonts/       Source Sans 3 dan Lora (lisensi SIL OFL)
README.md
```

## Unggah ke GitHub dan aktifkan GitHub Pages

1. Masuk ke GitHub, klik **New repository**. Beri nama, misalnya `keadilan-sosial`, pilih **Public**, lalu **Create repository**.
2. Di halaman repo baru, klik **uploading an existing file**. Seret semua isi folder ini (`index.html`, `style.css`, `script.js`, `README.md`, dan folder `assets`) ke jendela unggah. Pastikan `index.html` berada di akar repo, bukan di dalam subfolder.
3. Klik **Commit changes**.
4. Buka **Settings → Pages**. Pada **Source** pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
5. Tunggu 1–2 menit, lalu muat ulang halaman Settings → Pages. Alamatnya akan muncul, misalnya `https://username.github.io/keadilan-sosial/`.

Lewat terminal (opsional):

```bash
git init
git add .
git commit -m "Slide Bab 10 Keadilan Sosial"
git branch -M main
git remote add origin https://github.com/USERNAME/keadilan-sosial.git
git push -u origin main
```

Lalu aktifkan Pages seperti langkah 4.

## Cara memakai saat presentasi

| Tombol | Fungsi |
| --- | --- |
| → / PageDown / Spasi | slide berikutnya (clicker presentasi juga bisa) |
| ← / PageUp | slide sebelumnya |
| Home / End | slide pertama / terakhir |
| T | daftar isi per bab (bisa diklik) |
| N | catatan pembicara: poin bicara, durasi, target waktu, stopwatch |
| P | buka catatan di jendela terpisah (untuk layar ganda/extended display) |
| F | layar penuh |
| Esc | tutup panel |

Di ponsel, geser kiri/kanan untuk pindah slide dan gulir ke bawah bila isinya panjang.

- Penanda di kanan atas berubah merah bertuliskan **Giliran [nama]** pada slide pertama setiap presenter.
- Garis tipis di paling atas menunjukkan progres per bagian (Pembukaan, 10.1–10.6).
- Kaki slide menunjukkan rujukan: "Diktat hlm." untuk halaman diktat, "LS" untuk nomor halaman lecture slides.
- Alamat slide tersimpan di URL (misalnya `.../#/15`), jadi bisa langsung membuka slide tertentu.

**Catatan pembicara dan proyektor.** Kalau layar laptop *dicerminkan* (mirror) ke proyektor, panel catatan (N) ikut terlihat audiens. Pilihannya: atur tampilan ke *extend*, tekan **P**, lalu taruh jendela catatan di layar laptop; atau buka catatan di HP/laptop lain dari alamat yang sama.

## Mengubah isi

- Setiap slide adalah satu `<section class="slide">` di `index.html`. Atribut `data-who` menentukan nama presenter di kanan atas, `data-src` menentukan rujukan di kaki slide.
- Catatan pembicara ada di `<aside class="notes" data-dur="m:dd">` di dalam tiap slide. `data-dur` adalah estimasi durasi slide tersebut.
- Alokasi menit per bab ada di bagian atas `script.js` (`SECTIONS`).

## Alokasi waktu

| Bagian | Presenter | Slide | Waktu |
| --- | --- | --- | --- |
| Pembukaan | Keindi | 1–3 | 2 menit |
| 10.1 Pendahuluan dan Asal-Usul | Keindi (4–7), Angel (8–11) | 4–11 | 8 menit |
| 10.2 Hakikat Keadilan | Clarissa | 12–14 | 4 menit |
| 10.3 Jenis-Jenis Keadilan | Hilery (15–17), Razka (18–20) | 15–20 | 9 menit |
| 10.4 Keadilan Distributif pada Khususnya | Hajjid | 21–24 | 6 menit |
| 10.5 Keadilan Sosial | Rama | 25–27 | 6 menit |
| 10.6 Penutup | Yoel | 28–30 | 3 menit |
| Transisi antarpresenter | | | ±2 menit |
| **Total** | | **30 slide** | **40 menit** |

## Sumber

- Diktat Pancasila, Topik X: Keadilan Sosial, hlm. 88–98.
- Lecture Slides Session 10: Keadilan Sosial bagi Seluruh Rakyat Indonesia (Social Justice).

Dua bagian yang ditandai kotak bergaris putus-putus ("Catatan kelompok" di slide 7 dan "Contoh ilustrasi" di slide 29) adalah tambahan kelompok, bukan isi sumber.
