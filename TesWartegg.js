// ============================================================
// TES_WARTEGG.GS - Modul Tes Wartegg
// ============================================================

/**
 * Simulasi analisa AI untuk 8 kotak Wartegg.
 * Menghasilkan skor acak 3-5 per kotak.
 * @returns {{ nilai: number[], total: number }}
 */
function analisaWarteggAI() {
  const scores = Array.from({ length: 8 }, () => Math.floor(Math.random() * 3) + 3);
  const total = scores.reduce((a, b) => a + b, 0);
  return { nilai: scores, total };
}

/**
 * Mengembalikan narasi analisa berdasarkan total skor Wartegg.
 * @param {number|string} total - Total skor (0-40)
 * @returns {object} Narasi global + database kotak untuk update real-time
 */
function tampilkanAnalisa(total) {
  const kategori = _getKategoriWartegg(Number(total));
  return {
    ...NARASI_WARTEGG_GLOBAL[kategori],
    db_kotak: DB_NARASI_WARTEGG
  };
}

/**
 * Simpan hasil tes Wartegg ke spreadsheet dan opsional generate PDF.
 * @param {object} data - Payload dari frontend
 */
function simpanWartegg(data) {
  try {
    const sheet = getSS().getSheetByName(CONFIG.SHEET.WARTEGG);
    if (!sheet) throw new Error("Sheet DATA_WARTEGG tidak ditemukan");

    // Upload gambar ke Drive jika ada
    const imageUrl = data.imageFile
      ? uploadFile(data.imageFile.replace(/^data:image\/[a-z]+;base64,/, ""), `wartegg_${data.id_test}.jpg`)
      : "-";

    sheet.appendRow([
      new Date(),
      data.id_test, data.id_peserta, data.nama,
      Number(data.g1), Number(data.g2), Number(data.g3), Number(data.g4),
      Number(data.g5), Number(data.g6), Number(data.g7), Number(data.g8),
      Number(data.total), data.kategori,
      data.aspek, data.interpretasi, data.deskripsi, data.rekomendasi,
      data.narasi_g1, data.narasi_g2, data.narasi_g3, data.narasi_g4,
      data.narasi_g5, data.narasi_g6, data.narasi_g7, data.narasi_g8,
      imageUrl
    ]);

    return createSuccessResponse({ message: "Data Wartegg berhasil disimpan.", pdfUrl: "" });
  } catch (e) {
    return createErrorResponse(e.message);
  }
}

// --- Internal Helper ---

function _getKategoriWartegg(total) {
  if (total <= 16) return "Rendah";
  if (total <= 24) return "Cukup";
  if (total <= 32) return "Baik";
  return "Sangat Baik";
}