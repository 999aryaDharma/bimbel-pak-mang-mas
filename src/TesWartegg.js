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
        "Wartegg_" + data.nama + ".png",
        CONFIG.FOLDER_WARTEGG_FOTO,
      );
    }

    const row = [
      data.id_test || "",      // ID_TEST
      data.id_peserta || "",   // WTGID_PESERTA
      data.nama || "",         // NAMA
      data.tanggal || "",      // TGL_TESTN
      Number(data.g1 || 0),    // GAMBAR1
      Number(data.g2 || 0),    // GAMBAR2
      Number(data.g3 || 0),    // GAMBAR3
      Number(data.g4 || 0),    // GAMBAR4
      Number(data.g5 || 0),    // GAMBAR5
      Number(data.g6 || 0),    // GAMBAR6
      Number(data.g7 || 0),    // GAMBAR7
      Number(data.g8 || 0),    // GAMBAR8
      Number(data.total || 0), // NILAI_SCORE
      data.kategori || "",     // KATEGORI
      data.aspek || "",        // ASPEK_TEKNIS
      data.interpretasi || "", // INTERPRETASI
      data.deskripsi || "",    // DESKRIPSI
      data.rekomendasi || "",  // REKOMENDASI
      imageUrl,                // DATA_GAMBAR (Link Drive)
      "-",                     // DATA_GRAFIK (Placeholder)
      data.narasi_g1 || "",    // ADAPTASI
      data.narasi_g2 || "",    // KREATIVITAS
      data.narasi_g3 || "",    // AMBISI
      data.narasi_g4 || "",    // KECEMASAN
      data.narasi_g5 || "",    // ENERGI
      data.narasi_g6 || "",    // INTELEKTUAL
      data.narasi_g7 || "",    // SENSIBILITAS
      data.narasi_g8 || ""     // SOSIAL
    ];

    sheet.appendRow(row);
    const pdfUrl = _generatePdfWartegg(data, imageUrl);

    return createSuccessResponse({
      message: "Data Wartegg berhasil disimpan.",
      pdfUrl: pdfUrl
    });
  } catch (e) {
    return createErrorResponse(e.message);
  }
}

/**
 * Generate PDF laporan Wartegg dari Google Doc template.
 * @param {object} data - Data hasil tes
 * @param {string} imageUrl - URL gambar yang sudah diupload (untuk di sheet)
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

    // HARUS SAMA PERSIS BESAR KECIL HURUFNYA DENGAN TEMPLATE DOCX
    const replacements = {
      "{{id_test}}": data.id_test || "-",
      "{{id_peserta}}": data.id_peserta || "-",
      "{{nama}}": data.nama || "-",
      "{{tanggal}}": data.tanggal || "-",
      "{{total}}": String(data.total || 0),
      "{{kategori}}": data.kategori || "-",
      "{{narasi_g1}}": data.narasi_g1 || "-",
      "{{narasi_g2}}": data.narasi_g2 || "-",
      "{{narasi_g3}}": data.narasi_g3 || "-",
      "{{narasi_g4}}": data.narasi_g4 || "-",
      "{{narasi_g5}}": data.narasi_g5 || "-",
      "{{narasi_g6}}": data.narasi_g6 || "-",
      "{{narasi_g7}}": data.narasi_g7 || "-",
      "{{narasi_g8}}": data.narasi_g8 || "-",
      "{{aspek}}": data.aspek || "-",
      "{{interpretasi}}": data.interpretasi || "-",
      "{{deskripsi}}": data.deskripsi || "-",
      "{{rekomendasi}}": data.rekomendasi || "-"
    };

    // 1. Ganti semua teks narasi
    Object.entries(replacements).forEach(([tag, value]) => {
      body.replaceText(tag, value);
    });

    // 2. Sisipkan GAMBAR secara visual ke dalam dokumen
    const imageTag = "{{imgUrl}}";
    const found = body.findText(imageTag);
    
    if (found) {
      const textElement = found.getElement();
      const parent = textElement.getParent();
      
      // Hapus teks {{imgUrl}}
      textElement.asText().setText(textElement.asText().getText().replace(imageTag, ""));
      
      if (data.imageFile && data.imageFile.length > 100) {
        try {
          const base64Clean = data.imageFile.replace(/^data:image\/[a-z]+;base64,/, "");
          const imageBlob = Utilities.newBlob(Utilities.base64Decode(base64Clean), "image/jpeg", "wartegg.jpg");
          
          let inlineImage;
          if (parent.getType() === DocumentApp.ElementType.PARAGRAPH) {
             inlineImage = parent.asParagraph().appendInlineImage(imageBlob);
          } else {
             inlineImage = body.appendImage(imageBlob);
          }
          
          // Sesuaikan ukuran gambar agar tidak terpotong kertas (Maksimal lebar ~500px)
          const width = inlineImage.getWidth();
          const height = inlineImage.getHeight();
          const maxWidth = 500; 
          if (width > maxWidth) {
             const ratio = maxWidth / width;
             inlineImage.setWidth(maxWidth);
             inlineImage.setHeight(height * ratio);
          }
        } catch(e) {
           console.error("Gagal menyisipkan gambar Wartegg:", e);
        }
      }
    }

    doc.saveAndClose();
    const pdfBlob = copy.getAs(MimeType.PDF);
    const pdfFile = folder.createFile(pdfBlob.setName(namaFile + ".pdf"));

    copy.setTrashed(true);
    // pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW,);
    return pdfFile.getUrl();
  } catch (e) {
    return "";
  }
}

function diagnosisWartegg() {
  const folderID   = CONFIG.FOLDER_WARTEGG;
  const templateID = CONFIG.TEMPLATE_WARTEGG;

  console.log("=== DIAGNOSIS HTP ===");

  try {
    const folder = DriveApp.getFolderById(folderID);
    console.log("OK - Folder ditemukan: " + folder.getName());
  } catch(e) {
    console.log("GAGAL - Folder: " + e.message);
  }

  try {
    const template = DriveApp.getFileById(templateID);
    console.log("OK - Template ditemukan: " + template.getName());
  } catch(e) {
    console.log("GAGAL - Template: " + e.message);
  }

  try {
    const folder = DriveApp.getFolderById(folderID);
    const blob = Utilities.newBlob("test", "text/plain", "test.txt");
    const file = folder.createFile(blob);
    console.log("OK - createFile berhasil: " + file.getId());
    file.setTrashed(true);
  } catch(e) {
    console.log("GAGAL - createFile: " + e.message);
  }

  try {
    const template = DriveApp.getFileById(templateID);
    const folder = DriveApp.getFolderById(folderID);
    const copy = template.makeCopy("TEST_COPY", folder);
    console.log("OK - makeCopy berhasil: " + copy.getId());
    copy.setTrashed(true);
  } catch(e) {
    console.log("GAGAL - makeCopy: " + e.message);
  }
}

function cekAkunScript() {
  console.log("Akun aktif: " + Session.getActiveUser().getEmail());
  console.log("Akun efektif: " + Session.getEffectiveUser().getEmail());
}

// --- Internal Helper ---

function _getKategoriWartegg(total) {
  if (total <= 16) return "Rendah";
  if (total <= 24) return "Cukup";
  if (total <= 32) return "Baik";
  return "Sangat Baik";
}