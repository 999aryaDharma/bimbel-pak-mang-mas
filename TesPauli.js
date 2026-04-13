const GEMINI_API_KEY = "AIzaSyBzqaQW7hjJOWLe598UGHKorks7ad3g0_8"; // Pastikan API key Anda valid

function prosesAnalisaAIPauli(base64) {
  // 1. Bersihkan prefix base64 jika terbawa dari frontend (misal: "data:image/png;base64,")
  const base64Clean = base64.replace(/^data:image\/[a-z]+;base64,/, "");
  
  // Menggunakan Gemini 1.5 Flash (Pilihan Paling Stabil & Cepat di v1)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
  
  // 2. PROMPT BARU: Algoritma Pathfinding untuk Tes Pauli (Atas ke Bawah, Bersambung)
  const prompt = `Kamu adalah evaluator Psikotes Pauli bertenaga AI yang sangat teliti.
  PENGINGAT KERAS: BACA GAMBAR DENGAN SANGAT TELITI!
  Ini adalah lembar Psikotes Pauli. Terdapat Angka Soal (besar/hitam) dan Angka Jawaban (kecil/merah/tulisan tangan) di sela-sela angka soal.
  Terdapat juga "Garis Interval" horizontal berupa coretan yang memotong lajur.

  TUGASMU: BACA PERSAMAAN MATEMATIKANYA DARI ATAS KE BAWAH.
  Kamu harus membaca kelompok 3 angka: [Angka Soal Atas + Angka Soal Bawah] = Jawaban Siswa.
  
  CONTOH CARA MEMBACA LAJUR 1:
  Soal 4 dan 9, siswa menjawab 3. Tulis: 4+9=3.
  Soal 9 dan 8, siswa menjawab 7. Tulis: 9+8=7.
  Dan seterusnya ke bawah.

  ALGORITMA INTERVAL:
  - Baca persamaan ke bawah sampai kamu menemukan "Garis Interval". Itu dihitung sebagai 1 Interval.
  - Setelah garis, lanjutkan membaca ke bawah. Jika lajur habis, pindah ke pucuk lajur sebelah kanannya, teruskan membaca sampai ketemu Garis Interval berikutnya.

  BUKTIKAN DI LOG PENGAMATAN:
  Kamu WAJIB menuliskan log dengan format matematika ini agar bisa diverifikasi kebenarannya.
  Contoh log:
  "Interval 1: Lajur 1 [4+9=3, 9+8=7, 8+8=6, 8+0=8] (Ketemu Garis). Total Jawaban = 4.
  Interval 2: Lajur 1 [0+2=2, 2+4=6] -> Lompat Lajur 2 [2+8=0, 8+3=1, 3+3=6] (Ketemu Garis). Total Jawaban = 5."
  ATURAN ANTI-HALUSINASI (WAJIB DIIKUTI):
  - FILTER SPASIAL: Mata AI-mu HANYA boleh melihat angka yang posisinya agak ke kanan di sela-sela angka utama.
  - Kamu harus menelusuri jalurnya dan TIDAK BOLEH MENEBAK.
  - Di dalam "log_pengamatan", WAJIB menyebutkan deretan angka jawaban yang kamu telusuri untuk membuktikan kamu membaca posisi yang benar.
  - Contoh log: "Interval 1: Kolom 1 atas [3, 8, 5, 6, 8, 2] = 6 angka jawaban. Interval 2: Lanjut Kolom 1 bawah [2, 2, 1, 6] lalu lompat Kolom 2 atas [1, 7, 0, 7] = 8 angka jawaban. Interval 3: ..."

  Berikan output dalam JSON murni dengan struktur persis seperti ini:
  {
    "log_pengamatan": "Tuliskan jejak deretan angka JAWABAN yang kamu temukan per interval seperti instruksi di atas...",
    "lajur": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
  }`;

  // Blok generationConfig tidak dipakai agar tidak error di UrlFetchApp
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
      "muteHttpExceptions": true // Agar bisa membaca pesan error API jika gagal
    });
    
    const resText = JSON.parse(response.getContentText());
    
    // Tangkap error API
    if (resText.error) {
       return { error: "API Error: " + resText.error.message };
    }

    let rawContent = resText.candidates[0].content.parts[0].text;
    
    // Ambil hanya teks di dalam { ... } untuk menghindari garbage text dari AI
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback pembersihan standar jika regex tidak menangkap kurung kurawal
    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(rawContent);
  } catch (e) {
    return { error: "System Error: " + e.toString() };
  }
}

// Fungsi Simpan
function eksekusiSimpanPauli(obj) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("DATA_PAULI") || ss.insertSheet("DATA_PAULI");
  
  // KEAMANAN ARRAY: Pastikan array lajur ukurannya SELALU 20
  let lajurArray = Array.isArray(obj.lajur) ? obj.lajur : [];
  while (lajurArray.length < 20) lajurArray.push(0);
  lajurArray = lajurArray.slice(0, 20);

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