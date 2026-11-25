# Pendataan Nomor WhatsApp/HP

Aplikasi sederhana untuk 25 peserta. Setiap peserta mendapat tautan pribadi untuk mengisi nomor HP. Data disimpan pada `data/participants.json` di repository GitHub melalui GitHub Contents API.

## 1. Upload ke GitHub
Buat repository baru, misalnya `pendataan-wa`, lalu upload seluruh isi folder proyek ini (bukan folder induknya).

## 2. Buat GitHub token
Buat Personal Access Token (Fine-grained) untuk repository tersebut dengan izin **Contents: Read and write**. Jangan masukkan token ke file proyek atau frontend.

## 3. Deploy ke Vercel
Import repository GitHub ke Vercel. Tambahkan Environment Variables berikut pada Project Settings > Environment Variables:

- `GITHUB_OWNER` = username/organisasi pemilik repository
- `GITHUB_REPO` = nama repository
- `GITHUB_BRANCH` = `main` (sesuaikan nama branch)
- `GITHUB_TOKEN` = token GitHub dengan akses Contents read/write
- `ADMIN_PASSWORD` = password rahasia untuk halaman admin

Lalu deploy / redeploy.

## 4. Cara menggunakan
1. Buka domain Vercel tanpa query, misalnya `https://nama-app.vercel.app`.
2. Klik **Login Admin**, masukkan `ADMIN_PASSWORD`.
3. Tabel 25 peserta tampil. Klik **Salin Link** pada nama masing-masing.
4. Kirim link itu kepada peserta yang bersangkutan.
5. Peserta mengisi nomor WhatsApp/HP lalu klik **Simpan Nomor**.
6. Admin klik **Muat Ulang** untuk melihat data terbaru.

## Catatan keamanan
- Jangan membagikan password admin.
- Link pribadi berisi kunci acak; kirim hanya kepada orang yang bersangkutan.
- Endpoint detail peserta hanya menampilkan nama, nomor daftar, jenis kelamin, dan nomor HP. Hanya link dengan kunci yang cocok yang dapat mengubah nomor.
- Repository dan file JSON dapat dibuat private. Vercel tetap dapat mengakses GitHub API memakai token.
- Jika beberapa orang menyimpan pada saat hampir bersamaan, GitHub dapat menolak salah satu update karena konflik SHA; peserta/admin dapat mencoba ulang.
- Untuk data pribadi, batasi akses repository dan token GitHub. Rotasi token jika pernah terekspos.
