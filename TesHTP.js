// ============================================================
// TES_HTP.GS - Modul Tes House-Tree-Person (HTP)
// ============================================================

const HTP_ASPEK_IDS = ["pro", "detl", "pers", "line"];
const HTP_TAHAP_IDS  = ["orang", "rumah", "pohon", "gabung"];

/**
 * Simulasi analisa AI per tahap HTP.
 * Mengembalikan skor, narasi per aspek, dan kesimpulan.
 *
 * @param {string} imageData - Data gambar base64 (untuk AI nyata di masa depan)
 * @param {string} tahapId   - "orang" | "rumah" | "pohon" | "gabung"
 * @returns {object}
 */
function panggilAI_HTP(imageData, tahapId) {
  try {
    const key = tahapId.toLowerCase();
    const db  = HTP_DB_MAP[key];
    if (!db) throw new Error(`Database untuk '${tahapId}' tidak ditemukan.`);

    const skor   = {};
    const narasi = {};
    let total    = 0;

    HTP_ASPEK_IDS.forEach(id => {
      const nilai  = Math.floor(Math.random() * 5) + 1;
      skor[id]     = nilai;
      total       += nilai;
      narasi[id]   = (db.narasi[id] && db.narasi[id][String(nilai)])
                       ? db.narasi[id][String(nilai)]
                       : `Analisa aspek ${id} dengan skor ${nilai}.`;
    });

    const kategori   = _getKategoriHTP(total);
    const kesimpulan = db.kesimpulan[kategori]
                       || { teknis: "-", konten: "-", simbolis: "-", observasi: "-" };

    return {
      tahapId,
      skor,
      total,
      kategori,
      narasi,
      kesimpulan,
      db_referensi: { narasi: db.narasi, kesimpulan: db.kesimpulan }
    };
  } catch (e) {
    console.error("panggilAI_HTP error:", e.message);
    return { error: e.message };
  }
}

/**
 * Simpan hasil tes HTP (semua 4 tahap) ke spreadsheet.
 * @param {object} data - Payload lengkap dari frontend
 */
function simpanHTP(data) {
  try {
    const sheet = getSS().getSheetByName(CONFIG.SHEET.HTP);
    if (!sheet) throw new Error("Sheet DATA_HTP tidak ditemukan");

    // Bangun baris secara dinamis agar mudah di-maintain
    const row = [
      new Date(),
      data.id_test    || "",
      data.id_peserta || "",
      data.nama       || "",
      data.tanggal    || ""
    ];

    // Tambah data per tahap (orang, rumah, pohon, gabung)
    HTP_TAHAP_IDS.forEach(tahap => {
      HTP_ASPEK_IDS.forEach(aspek => {
        row.push(Number(data[`skor_${tahap}_${aspek}`] || 0));
      });
      row.push(Number(data[`total_${tahap}`] || 0));
      row.push(data[`kategori_${tahap}`] || "-");
      row.push(data[`teknis_${tahap}`]   || "");
      row.push(data[`konten_${tahap}`]   || "");
      row.push(data[`simbolis_${tahap}`] || "");
      row.push(data[`observasi_${tahap}`]|| "");
    });

    // Rekapitulasi akhir
    row.push(Number(data.total_keseluruhan   || 0));
    row.push(data.kategori_keseluruhan        || "-");
    row.push(data.final_teknis               || "");
    row.push(data.final_interpretasi         || "");
    row.push(data.final_dinamika             || "");
    row.push(data.final_profil               || "");

    sheet.appendRow(row);
    return createSuccessResponse({ message: "Data HTP berhasil disimpan." });
  } catch (e) {
    return createErrorResponse(e.message);
  }
}

// --- Bridge untuk Kode.gs (backward-compatible jika ada pemanggil lama) ---
function pauliJembatanAI(base64) {
  return prosesAnalisaAIPauli(base64);
}

function simpanKeSheetPauli(data) {
  return eksekusiSimpanPauli(data);
}

// --- Internal Helper ---

function _getKategoriHTP(total) {
  if (total >= 17) return "Sangat Baik";
  if (total >= 13) return "Baik";
  if (total >= 9)  return "Cukup";
  return "Rendah";
}