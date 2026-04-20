function prosesAnalisaAIKraepelin(base64) {
  const base64Clean = base64.replace(/^data:image\/[a-z]+;base64,/, "");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `Kamu adalah evaluator Psikotes Kraepelin bertenaga AI yang sangat teliti.
PENGINGAT KERAS: BACA GAMBAR DENGAN SANGAT TELITI!

INSTRUKSI TES KRAEPELIN:
Tes Kraepelin adalah tes penjumlahan angka yang terdiri dari 50 lajur (kolom). Setiap lajur berisi deretan angka-angka yang harus dijumlahkan secara berurutan dari bawah ke atas.

CARA MENGERJAKAN:
1. Setiap lajur (kolom) berisi deretan angka yang harus dijumlahkan
2. Mulai penjumlahan dari BAWAH ke ATAS dalam setiap lajur
3. Setelah selesai satu lajur, pindah ke lajur berikutnya (kiri ke kanan)
4. Tuliskan HASIL PENJUMLAHAN (total angka yang dikerjakan) untuk setiap lajur

CARA MENILAI:
1. TOTAL DIKERJAKAN (N) = Jumlahkan semua hasil penjumlahan dari 50 lajur (L1 + L2 + ... + L50)
2. TOTAL SALAH (S) = Jumlah kesalahan dalam penjumlahan (hasil yang tidak sesuai dengan penjumlahan sebenarnya)
3. TOTAL LONCATAN (L) = Jumlah lajur yang dilewati/tidak dikerjakan
4. PEMBERTULAN (P) = Jumlah koreksi/penjelasan (ada tanda "=" yang menunjukkan perbaikan)

ATURAN PENILAIAN:
- Setiap lajur yang memiliki hasil penjumlahan = HITUNG sebagai dikerjakan
- Jika hasil penjumlahan SALAH = HITUNG sebagai kesalahan
- Jika ada lajur yang KOSONG/tidak ada jawaban = HITUNG sebagai loncatan
- Jika ada tanda "=" (sama dengan) yang menunjukkan koreksi = HITUNG sebagai pembetulan

ALGORITMA PEMBACAAN:
1. Baca lajur 1 (paling kiri) dari BAWAH ke ATAS
2. Jumlahkan semua angka dalam lajur tersebut
3. Catat hasil penjumlahan
4. Periksa apakah ada kesalahan penjumlahan
5. Lanjut ke lajur 2, 3, 4, ... sampai lajur 50
6. Akumulasi semua data

BUKTIKAN DI LOG PENGAMATAN:
Kamu WAJIB menuliskan log dengan format ini agar bisa diverifikasi kebenarannya.
Contoh log:
"Lajur 1: [5+3+7+2+4] = 21 (Benar). Total angka dalam lajur: 5
 Lajur 2: [8+1+6+3] = 18 (Salah, seharusnya 18, siswa menulis 16). Total angka: 4
 Lajur 3: [KOSONG - Tidak dikerjakan = Loncatan]
 Interval 1 selesai (Lajur 1-10): Total dikerjakan = 8, Salah = 1, Loncat = 1"

ATURAN ANTI-HALUSINASI (WAJIB DIIKUTI):
- FILTER SPASIAL: Mata AI-mu HANYA boleh melihat angka yang ada dalam setiap lajur
- Kamu harus menelusuri setiap lajur dari BAWAH ke ATAS
- TIDAK BOLEH MENEBAK angka yang tidak terlihat jelas
- Di dalam "log_pengamatan", WAJIB menyebutkan deretan angka yang kamu baca per lajur
- Contoh log: "Lajur 1: [5, 3, 7, 2, 4] → Jumlah = 21. Lajur 2: [8, 1, 6, 3] → Jumlah = 18 (Siswa: 16 = SALAH)"

Berikan output dalam JSON murni dengan struktur persis seperti ini:
{
  "log_pengamatan": "Tuliskan jejak pembacaan angka per lajur seperti instruksi di atas...",
  "lajur": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "total_n": 0,
  "total_salah": 0,
  "total_loncat": 0,
  "total_betul": 0,
  "score_akhir": 0,
  "persen_salah": 0,
  "puncak": 0,
  "terendah": 0,
  "simpangan": 0,
  "kategori": "Sangat Baik/Baik/Cukup/Kurang",
  "rekomendasi": "Disarankan untuk...",
  "narasi_kapasitas": "Analisa kapasitas kerja (dari total n)...",
  "narasi_ketelitian": "Analisa ketelitian & konsentrasi (dari total salah)...",
  "narasi_stabilitas": "Analisa emosi & stabilitas...",
  "narasi_kurva": "Analisa grafik kurva kerja...",
  "analisa_global": "Kesimpulan keseluruhan kandidat..."
}

CATATAN PENTING:
- Array "lajur" harus berisi 50 angka (hasil penjumlahan untuk setiap lajur)
- Jika lajur kosong/tidak dikerjakan, isi dengan 0
- Total N adalah penjumlahan SEMUA 50 lajur
- Pastikan membaca dengan teliti, jangan sampai ada lajur yang terlewat`;

  const payload = {
    "contents": [{
      "parts": [
        { "text": prompt },
        {
          "inlineData": {
            "mimeType": "image/jpeg",
            "data": base64Clean
          }
        }
      ]
    }]
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    });

    const resText = JSON.parse(response.getContentText());

    if (resText.error) {
       return { error: "API Error: " + resText.error.message };
    }

    let rawContent = resText.candidates[0].content.parts[0].text;

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(rawContent);
  } catch (e) {
    return { error: "System Error: " + e.toString() };
  }
}

// Fungsi Simpan
function eksekusiSimpanKraepelin(obj) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("DATA_KRAEPELIN") || ss.insertSheet("DATA_KRAEPELIN");

  // KEAMANAN ARRAY: Pastikan array lajur ukurannya SELALU 50
  let lajurArray = Array.isArray(obj.lajur) ? obj.lajur : [];
  while (lajurArray.length < 50) lajurArray.push(0);
  lajurArray = lajurArray.slice(0, 50);

  // PEMETAAN VARIABEL
  const rowData = [
    obj.id_test || "",
    obj.id_peserta || "",
    obj.nama || "",
    obj.tanggal || "",
    ...lajurArray,
    obj.total_n || 0,
    obj.total_salah || 0,
    obj.total_loncat || 0,
    obj.total_betul || 0,
    obj.score_akhir || 0,
    obj.persen_salah || 0,
    obj.puncak || 0,
    obj.terendah || 0,
    obj.simpangan || 0,
    obj.kategori || "",
    obj.rekomendasi || "",
    obj.analisa_global || "",
    obj.narasi_kapasitas || "",
    obj.narasi_ketelitian || "",
    obj.narasi_stabilitas || "",
    obj.narasi_kurva || ""
  ];

  sheet.appendRow(rowData);
  return "Data berhasil disimpan ke Spreadsheet.";
}
