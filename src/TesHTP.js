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
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // Sesuaikan nama sheet jika berbeda, pastikan sesuai dengan yang ada di Google Sheet
    const sheet = ss.getSheetByName("DATA_HTP") || ss.getSheetByName("DATA_THP"); 
    
    const folderLaporanID = "1N-MjNV1740sDU1FZJqQYX73fdGy77zkj"; // Folder PDF & Gambar HTP
    const templateDocID = "1gfksWt30LjZ1MufNM0VwLsWD9ZssCsDj"; // Template Doc HTP

    // Helper untuk upload gambar khusus folder HTP
    function _uploadGambar(base64, namaFile) {
      if (!base64) return "-";
      try {
        const blob = Utilities.newBlob(Utilities.base64Decode(base64), "image/jpeg", namaFile);
        const file = DriveApp.getFolderById(folderLaporanID).createFile(blob);
        return "https://drive.google.com/uc?export=view&id=" + file.getId();
      } catch (e) { return "-"; }
    }

    // 1. Upload 4 Gambar ke Drive HTP
    const urlOrang  = _uploadGambar(data.image_orang,  "Orang_" + data.id_test + ".jpg");
    const urlRumah  = _uploadGambar(data.image_rumah,  "Rumah_" + data.id_test + ".jpg");
    const urlPohon  = _uploadGambar(data.image_pohon,  "Pohon_" + data.id_test + ".jpg");
    const urlGabung = _uploadGambar(data.image_gabung, "Gabung_" + data.id_test + ".jpg");

    // 2. Mapping Berurutan ke Kolom Spreadsheet (Sesuai List Anda)
    const row = [
      data.id_test || "",                  // ID_Test
      data.id_peserta || "",               // ID_Peserta
      data.nama || "",                     // Nama
      data.tanggal || "",                  // Tanggal
      
      // --- TES ORANG (Person) ---
      Number(data.skor_orang_pro || 0),    // P1_Wajah
      Number(data.skor_orang_detl || 0),   // P2_Tangan
      Number(data.skor_orang_pers || 0),   // P3_Kaki
      Number(data.skor_orang_line || 0),   // P4_Integritas
      Number(data.total_orang || 0),       // pjml_score
      data.kategori_orang || "-",          // pktgn
      data.narasi_detail_orang_pro || "",  // nppro (Narasi Person Pro)
      data.narasi_detail_orang_detl || "", // npdetl
      data.narasi_detail_orang_pers || "", // nppers
      data.narasi_detail_orang_line || "", // npline
      data.teknis_orang || "",             // phslteknis
      data.konten_orang || "",             // phslkonten
      data.simbolis_orang || "",           // phslsimbol
      data.observasi_orang || "",          // phslkhusus

      // --- TES RUMAH (House) ---
      Number(data.skor_rumah_pro || 0),    // H1_Atap
      Number(data.skor_rumah_detl || 0),   // H2_Dinding
      Number(data.skor_rumah_pers || 0),   // H3_Pintu
      Number(data.skor_rumah_line || 0),   // H4_Garis
      Number(data.total_rumah || 0),       // Hjml_score
      data.kategori_rumah || "-",          // hktgn
      data.narasi_detail_rumah_pro || "",  // nhpro (Narasi House Pro)
      data.narasi_detail_rumah_detl || "", // nhdetl
      data.narasi_detail_rumah_pers || "", // nhpers
      data.narasi_detail_rumah_line || "", // nhline
      data.teknis_rumah || "",             // hhslteknis
      data.konten_rumah || "",             // hhslkonten
      data.simbolis_rumah || "",           // hhslsimbol
      data.observasi_rumah || "",          // hhslskhusus

      // --- TES POHON (Tree) ---
      Number(data.skor_pohon_pro || 0),    // T1_Batang
      Number(data.skor_pohon_detl || 0),   // T2_Dahan
      Number(data.skor_pohon_pers || 0),   // T3_Akar
      Number(data.skor_pohon_line || 0),   // T4_Daun
      Number(data.total_pohon || 0),       // Tjlm_score
      data.kategori_pohon || "-",          // Tktgn
      data.narasi_detail_pohon_pro || "",  // ntpro (Narasi Tree Pro)
      data.narasi_detail_pohon_detl || "", // ntdetl
      data.narasi_detail_pohon_pers || "", // ntpers
      data.narasi_detail_pohon_line || "", // ntline
      data.teknis_pohon || "",             // Thslteknis
      data.konten_pohon || "",             // Thslkonten
      data.simbolis_pohon || "",           // Thslsimbol
      data.observasi_pohon || "",          // Thslkhusus

      // --- TES GABUNGAN (Observasi) ---
      Number(data.skor_gabung_pro || 0),   // Obs_pro
      Number(data.skor_gabung_detl || 0),  // Obs_detl
      Number(data.skor_gabung_pers || 0),  // Obs_pers
      Number(data.skor_gabung_line || 0),  // Obs_line
      Number(data.total_gabung || 0),      // obsjml_score
      data.kategori_gabung || "-",         // obsktgn
      data.narasi_detail_gabung_pro || "", // nObs_pro (Narasi Gabungan)
      data.narasi_detail_gabung_detl || "",// nObs_detl
      data.narasi_detail_gabung_pers || "",// nObs_persn
      data.narasi_detail_gabung_line || "",// Obs_line (Narasi Gabung Line)
      data.teknis_gabung || "",            // obshslteknis
      data.konten_gabung || "",            // obshslkonten
      data.simbolis_gabung || "",          // obshslsimbol
      data.observasi_gabung || "",         // obshslkhusus

      // --- KESIMPULAN AKHIR ---
      Number(data.total_keseluruhan || 0), // Total_score
      data.kategori_keseluruhan || "-",    // Kategori_Akhir
      data.final_teknis || "",             // Aspek_Teknis
      data.final_interpretasi || "",       // Interprestasi
      data.final_dinamika || "",           // Dinamika
      data.final_profil || "",             // Rekomendasi
      
      // --- LINK GAMBAR URL ---
      urlOrang,                            // gbr_orang
      urlRumah,                            // gbr_rumah
      urlPohon,                            // gbr_pohon
      urlGabung                            // gbr_gabungan
    ];

    sheet.appendRow(row);

    // 3. Generate Laporan PDF
    const folderLaporan = DriveApp.getFolderById(folderLaporanID);
    const templateDoc = DriveApp.getFileById(templateDocID);
    const copy = templateDoc.makeCopy("Laporan_HTP_" + data.nama, folderLaporan);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();
    
    // Asumsi template DOCX Anda sudah diperbaiki sesuai instruksi di atas
    const replaceDict = {
      // Header
      "{{ID_Test}}": data.id_test || "-", "{{ID_Peserta}}": data.id_peserta || "-", "{{Nama}}": data.nama || "-", "{{Tanggal}}": data.tanggal || "-", "{{Total_score}}": String(data.total_keseluruhan || 0), "{{Kategori_Akhir}}": data.kategori_keseluruhan || "-",
      // Kesimpulan Akhir
      "{{Aspek_Teknis}}": data.final_teknis || "-", "{{Interprestasi}}": data.final_interpretasi || "-", "{{Dinamika}}": data.final_dinamika || "-", "{{Rekomendasi}}": data.final_profil || "-",
      // Orang
      "{{pjml_score}}": String(data.total_orang || 0), "{{pktgn}}": data.kategori_orang || "-", "{{nppro}}": data.narasi_detail_orang_pro || "-", "{{npdetl}}": data.narasi_detail_orang_detl || "-", "{{nppers}}": data.narasi_detail_orang_pers || "-", "{{npline}}": data.narasi_detail_orang_line || "-", "{{phslteknis}}": data.teknis_orang || "-", "{{phslkonten}}": data.konten_orang || "-", "{{phslsimbol}}": data.simbolis_orang || "-", "{{phslkhusus}}": data.observasi_orang || "-", "{{gbr_orang}}": urlOrang || "-",
      // Rumah (Gunakan nhpro jika DOCX sudah Anda perbaiki, biarkan nppro jika belum)
      "{{Hjml_score}}": String(data.total_rumah || 0), "{{hktg}}": data.kategori_rumah || "-", "{{nhpro}}": data.narasi_detail_rumah_pro || "-", "{{nhdetl}}": data.narasi_detail_rumah_detl || "-", "{{nhpers}}": data.narasi_detail_rumah_pers || "-", "{{nhline}}": data.narasi_detail_rumah_line || "-", "{{hhslteknis}}": data.teknis_rumah || "-", "{{hhslkonten}}": data.konten_rumah || "-", "{{hhslsimbol}}": data.simbolis_rumah || "-", "{{hhslskhusus}}": data.observasi_rumah || "-", "{{gbr_rumah}}": urlRumah || "-",
      // Pohon
      "{{Tjlm_score}}": String(data.total_pohon || 0), "{{Tktgn}}": data.kategori_pohon || "-", "{{tpro}}": data.narasi_detail_pohon_pro || "-", "{{tdetl}}": data.narasi_detail_pohon_detl || "-", "{{tpers}}": data.narasi_detail_pohon_pers || "-", "{{tline}}": data.narasi_detail_pohon_line || "-", "{{Thslteknis}}": data.teknis_pohon || "-", "{{Thslkonten}}": data.konten_pohon || "-", "{{Thslsimbol}}": data.simbolis_pohon || "-", "{{Thslkhusus}}": data.observasi_pohon || "-", "{{gbr_pohon}}": urlPohon || "-",
      // Gabung
      "{{obsjml_score}}": String(data.total_gabung || 0), "{{obsktg}}": data.kategori_gabung || "-", "{{Obs_pro}}": data.narasi_detail_gabung_pro || "-", "{{Obs_detl}}": data.narasi_detail_gabung_detl || "-", "{{Obs_pers}}": data.narasi_detail_gabung_pers || "-", "{{Obs_line}}": data.narasi_detail_gabung_line || "-", "{{obshslteknis}}": data.teknis_gabung || "-", "{{obshslkonten}}": data.konten_gabung || "-", "{{obshslsimbol}}": data.simbolis_gabung || "-", "{{obshslkhusus}}": data.observasi_gabung || "-", "{{gbr_gabungan}}": urlGabung || "-"
    };

    Object.entries(replaceDict).forEach(([tag, val]) => body.replaceText(tag, val));

    doc.saveAndClose();
    const pdfBlob = copy.getAs(MimeType.PDF);
    const pdf = folderLaporan.createFile(pdfBlob.setName("Laporan_HTP_" + data.nama + ".pdf"));
    copy.setTrashed(true);

    return { success: true, pdfUrl: pdf.getUrl(), message: "Data HTP berhasil disimpan" };
  } catch (err) {
    return { success: false, message: err.toString() };
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
