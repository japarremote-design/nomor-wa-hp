# Pendataan Peserta Kewirausahaan

## Isi aplikasi
- Admin dapat login, mengedit data peserta, menambah peserta, melihat data, membuat tautan pribadi, dan menyalin pesan WhatsApp massal.
- Peserta membuka tautan pribadi untuk melengkapi nomor HP dan alamat serta mengunggah KTP.
- Data peserta disimpan di `data/participants.json` pada GitHub.
- File KTP disimpan di Supabase Storage bucket privat `ktp-private`. File tidak disimpan di GitHub.

## Deploy
1. Buat repository GitHub **private** dan upload seluruh isi folder proyek ini.
2. Buat Supabase project.
3. Di Supabase Storage, buat bucket bernama `ktp-private` dan pastikan **Public bucket = OFF**.
4. Buat GitHub Fine-grained Personal Access Token untuk repository ini dengan permission **Contents: Read and write**.
5. Import repository ke Vercel.
6. Tambahkan Environment Variables berikut di Vercel (Production, Preview jika diperlukan):
   - `GITHUB_OWNER` = username/organisasi GitHub
   - `GITHUB_REPO` = nama repository
   - `GITHUB_BRANCH` = `main` (sesuaikan branch)
   - `GITHUB_TOKEN` = token GitHub
   - `ADMIN_PASSWORD` = password admin yang kuat
   - `SUPABASE_URL` = Project URL dari Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role secret dari Supabase (JANGAN pernah masukkan ke frontend/GitHub)
7. Redeploy Vercel setelah mengisi environment variables.

## Cara pakai
- Buka domain Vercel tanpa query, login admin.
- Klik Edit untuk melengkapi nama, L/P, nomor HP, alamat, kelas kewirausahaan, dan status siap kerja.
- Klik Salin Link untuk mengirim link khusus per peserta. Tombol Salin Semua Pesan WA menyalin seluruh pesan.
- Peserta membuka link pribadi, melengkapi nomor HP/alamat, dan mengunggah KTP.
- Admin klik Muat Ulang. Klik Lihat KTP untuk membuka tautan sementara (berlaku 60 detik).

## Catatan privasi dan batasan
- Data KTP adalah data pribadi berisiko tinggi. Kumpulkan hanya bila benar-benar diperlukan, batasi admin yang bisa mengakses, dan hapus berkas setelah tujuan administrasi selesai sesuai kebijakan retensi.
- Jangan pernah membuat bucket KTP menjadi public.
- Jangan menyimpan `SUPABASE_SERVICE_ROLE_KEY` atau `GITHUB_TOKEN` di `index.html`, file JSON, atau variabel `NEXT_PUBLIC_*`.
- Repository GitHub sebaiknya private karena JSON berisi nomor HP, alamat, dan kunci link pribadi.
- Link peserta adalah rahasia akses untuk peserta tersebut; jangan kirim ke grup umum.
- Implementasi ini menggunakan password admin bersama melalui environment variable. Untuk penggunaan institusional/produksi dengan banyak admin, pertimbangkan autentikasi per akun, audit log, backup, dan kontrol akses lebih kuat.
- Ukuran KTP dibatasi 5 MB dan tipe file JPG, PNG, PDF.
- Jika update JSON bersamaan mengalami konflik GitHub SHA, muat ulang data dan coba simpan kembali.
