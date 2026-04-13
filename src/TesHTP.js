// ============================================================
// TES_HTP.GS - Modul Tes House-Tree-Person (HTP)
// ============================================================

const HTP_ASPEK_IDS = ["pro", "detl", "pers", "line"];
const HTP_TAHAP_IDS = ["orang", "rumah", "pohon", "gabung"];

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
    const db = HTP_DB_MAP[key];
    if (!db) throw new Error(`Database untuk '${tahapId}' tidak ditemukan.`);

    const skor = {};
    const narasi = {};
    let total = 0;

    HTP_ASPEK_IDS.forEach((id) => {
      const nilai = Math.floor(Math.random() * 5) + 1;
      skor[id] = nilai;
      total += nilai;
      narasi[id] =
        db.narasi[id] && db.narasi[id][String(nilai)]
          ? db.narasi[id][String(nilai)]
          : `Analisa aspek ${id} dengan skor ${nilai}.`;
    });

    const kategori = _getKategoriHTP(total);
    const kesimpulan = db.kesimpulan[kategori] || {
      teknis: "-",
      konten: "-",
      simbolis: "-",
      observasi: "-",
    };

    return {
      tahapId,
      skor,
      total,
      kategori,
      narasi,
      kesimpulan,
      db_referensi: { narasi: db.narasi, kesimpulan: db.kesimpulan },
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

    // 1. Upload 4 Gambar ke Folder Drive HTP
    const urlOrang = uploadFile(
      data.image_orang,
      "htp_orang_" + data.id_test + ".jpg",
      CONFIG.FOLDER_HTP,
    );
    const urlRumah = uploadFile(
      data.image_rumah,
      "htp_rumah_" + data.id_test + ".jpg",
      CONFIG.FOLDER_HTP,
    );
    const urlPohon = uploadFile(
      data.image_pohon,
      "htp_pohon_" + data.id_test + ".jpg",
      CONFIG.FOLDER_HTP,
    );
    const urlGabung = uploadFile(
      data.image_gabung,
      "htp_gabung_" + data.id_test + ".jpg",
      CONFIG.FOLDER_HTP,
    );

    // 2. Susun data untuk Sheet
    const row = [
      new Date(),
      data.id_test || "",
      data.id_peserta || "",
      data.nama || "",
      data.tanggal || "",
    ];

    HTP_TAHAP_IDS.forEach((tahap) => {
      HTP_ASPEK_IDS.forEach((aspek) => {
        row.push(Number(data[`skor_${tahap}_${aspek}`] || 0));
      });
      row.push(Number(data[`total_${tahap}`] || 0));
      row.push(data[`kategori_${tahap}`] || "-");
      row.push(data[`teknis_${tahap}`] || "");
      row.push(data[`konten_${tahap}`] || "");
      row.push(data[`simbolis_${tahap}`] || "");
      row.push(data[`observasi_${tahap}`] || "");
    });

    row.push(Number(data.total_keseluruhan || 0));
    row.push(data.kategori_keseluruhan || "-");
    row.push(data.final_teknis || "");
    row.push(data.final_interpretasi || "");
    row.push(data.final_dinamika || "");
    row.push(data.final_profil || "");

    // Simpan link gambar di sheet di ujung kanan
    row.push(urlOrang);
    row.push(urlRumah);
    row.push(urlPohon);
    row.push(urlGabung);

    sheet.appendRow(row);

    // 3. Generate PDF Laporan HTP
    const pdfUrl = _generatePdfHTP(data, {
      urlOrang,
      urlRumah,
      urlPohon,
      urlGabung,
    });

    return createSuccessResponse({
      message: "Data HTP berhasil disimpan & Laporan PDF dibuat.",
      pdfUrl: pdfUrl,
    });
  } catch (e) {
    return createErrorResponse(e.message);
  }
}

function _generatePdfHTP(data, urls) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_HTP);
    const templateFile = DriveApp.getFileById(CONFIG.TEMPLATE_HTP);
    const namaFile =
      "Laporan_HTP_" + (data.nama || "Peserta") + "_" + (data.id_test || "");

    const copy = templateFile.makeCopy(namaFile, folder);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();

    // Mapping Data Template - Pastikan Doc HTP menggunakan tag {{...}} ini!
    const replacements = {
      "{{ID_Test}}": data.id_test || "-",
      "{{ID_Peserta}}": data.id_peserta || "-",
      "{{Nama}}": data.nama || "-",
      "{{Tanggal}}": data.tanggal || "-",
      "{{Total_Skor}}": String(data.total_keseluruhan || 0),
      "{{Kategori_Akhir}}": data.kategori_keseluruhan || "-",
      "{{Final_Teknis}}": data.final_teknis || "-",
      "{{Final_Interpretasi}}": data.final_interpretasi || "-",
      "{{Final_Dinamika}}": data.final_dinamika || "-",
      "{{Final_Profil}}": data.final_profil || "-",
      "{{URL_Orang}}": urls.urlOrang || "-",
      "{{URL_Rumah}}": urls.urlRumah || "-",
      "{{URL_Pohon}}": urls.urlPohon || "-",
      "{{URL_Gabung}}": urls.urlGabung || "-",
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
    console.error("_generatePdfHTP error:", e.message);
    return "";
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
  if (total >= 9) return "Cukup";
  return "Rendah";
}
