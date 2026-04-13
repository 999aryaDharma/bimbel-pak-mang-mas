// ============================================================
// TES_WARTEGG.GS - Modul Tes Wartegg
// ============================================================

/**
 * Simulasi analisa AI untuk 8 kotak Wartegg.
 * Menghasilkan skor acak 3-5 per kotak.
 * @returns {{ nilai: number[], total: number }}
 */
function analisaWarteggAI() {
  const scores = Array.from(
    { length: 8 },
    () => Math.floor(Math.random() * 3) + 3,
  );
  const total = scores.reduce((a, b) => a + b, 0);
  return { nilai: scores, total };
}

/**
 * Mengembalikan narasi analisa berdasarkan total skor Wartegg.
 * @param {number|string} total
 * @returns {object}
 */
function tampilkanAnalisa(total) {
  const kategori = _getKategoriWartegg(Number(total));
  return {
    ...NARASI_WARTEGG_GLOBAL[kategori],
    db_kotak: DB_NARASI_WARTEGG,
  };
}

/**
 * Simpan hasil tes Wartegg ke spreadsheet dan buat PDF dari template.
 * @param {object} data - Payload dari frontend
 */
function simpanWartegg(data) {
  try {
    const sheet = getSS().getSheetByName(CONFIG.SHEET.WARTEGG);
    if (!sheet)
      throw new Error("Sheet DATA_WARTEGG tidak ditemukan di spreadsheet.");

    let imageUrl = "-";
    if (data.imageFile && data.imageFile.length > 100) {
      const base64Clean = data.imageFile.replace(
        /^data:image\/[a-z]+;base64,/,
        "",
      );
      // Gunakan Folder ID Wartegg
      imageUrl = uploadFile(
        base64Clean,
        "wartegg_" + data.id_test + ".jpg",
        CONFIG.FOLDER_WARTEGG,
      );
    }

    sheet.appendRow([
      new Date(),
      data.id_test || "",
      data.id_peserta || "",
      data.nama || "",
      data.tanggal || "",
      Number(data.g1 || 0),
      Number(data.g2 || 0),
      Number(data.g3 || 0),
      Number(data.g4 || 0),
      Number(data.g5 || 0),
      Number(data.g6 || 0),
      Number(data.g7 || 0),
      Number(data.g8 || 0),
      Number(data.total || 0),
      data.kategori || "",
      data.aspek || "",
      data.interpretasi || "",
      data.deskripsi || "",
      data.rekomendasi || "",
      data.narasi_g1 || "",
      data.narasi_g2 || "",
      data.narasi_g3 || "",
      data.narasi_g4 || "",
      data.narasi_g5 || "",
      data.narasi_g6 || "",
      data.narasi_g7 || "",
      data.narasi_g8 || "",
      imageUrl,
    ]);

    const pdfUrl = _generatePdfWartegg(data, imageUrl);

    return createSuccessResponse({
      message: "Data Wartegg berhasil disimpan.",
      pdfUrl: pdfUrl,
    });
  } catch (e) {
    return createErrorResponse(e.message);
  }
}

/**
 * Generate PDF laporan Wartegg dari Google Doc template.
 * @param {object} data - Data hasil tes
 * @param {string} imageUrl - URL gambar yang sudah diupload
 * @returns {string} URL PDF yang dihasilkan, atau "" jika gagal
 */
function _generatePdfWartegg(data, imageUrl) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_WARTEGG);
    const templateFile = DriveApp.getFileById(CONFIG.TEMPLATE_WARTEGG);
    const namaFile =
      "Laporan_Wartegg_" +
      (data.nama || "Peserta") +
      "_" +
      (data.id_test || "");

    const copy = templateFile.makeCopy(namaFile, folder);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();

    const replacements = {
      "{{ID_Test}}": data.id_test || "-",
      "{{ID_Peserta}}": data.id_peserta || "-",
      "{{Nama}}": data.nama || "-",
      "{{Tanggal}}": data.tanggal || "-",
      "{{G1}}": String(data.g1 || 0),
      "{{G2}}": String(data.g2 || 0),
      "{{G3}}": String(data.g3 || 0),
      "{{G4}}": String(data.g4 || 0),
      "{{G5}}": String(data.g5 || 0),
      "{{G6}}": String(data.g6 || 0),
      "{{G7}}": String(data.g7 || 0),
      "{{G8}}": String(data.g8 || 0),
      "{{Total}}": String(data.total || 0),
      "{{Kategori}}": data.kategori || "-",
      "{{Aspek_Teknis}}": data.aspek || "-",
      "{{Interpretasi}}": data.interpretasi || "-",
      "{{Deskripsi}}": data.deskripsi || "-",
      "{{Rekomendasi}}": data.rekomendasi || "-",
      "{{Narasi_G1}}": data.narasi_g1 || "-",
      "{{Narasi_G2}}": data.narasi_g2 || "-",
      "{{Narasi_G3}}": data.narasi_g3 || "-",
      "{{Narasi_G4}}": data.narasi_g4 || "-",
      "{{Narasi_G5}}": data.narasi_g5 || "-",
      "{{Narasi_G6}}": data.narasi_g6 || "-",
      "{{Narasi_G7}}": data.narasi_g7 || "-",
      "{{Narasi_G8}}": data.narasi_g8 || "-",
      "{{URL_Gambar}}": imageUrl || "-",
    };

    Object.entries(replacements).forEach(([tag, value]) => {
      body.replaceText(tag, value);
    });

    doc.saveAndClose();
    const pdfBlob = copy.getAs(MimeType.PDF);
    const pdfFile = folder.createFile(pdfBlob.setName(namaFile + ".pdf"));

    copy.setTrashed(true);
    pdfFile.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW,
    );
    return pdfFile.getUrl();
  } catch (e) {
    return "";
  }
}

// --- Internal Helper ---

function _getKategoriWartegg(total) {
  if (total <= 16) return "Rendah";
  if (total <= 24) return "Cukup";
  if (total <= 32) return "Baik";
  return "Sangat Baik";
}
