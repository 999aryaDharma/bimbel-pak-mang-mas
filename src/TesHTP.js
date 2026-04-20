// ============================================================
// TES_HTP.GS - Modul Tes House-Tree-Person (HTP)
// uploadGambarSaja ada di Utils.gs - tidak didefinisikan di sini
// Gambar di PDF = URL teks (bukan inline image)
// ============================================================

const HTP_ASPEK_IDS = ["pro", "detl", "pers", "line"];
const HTP_TAHAP_IDS = ["orang", "rumah", "pohon", "gabung"];

/**
 * Simulasi analisa AI per tahap HTP.
 * @param {string} imageData - Data gambar base64
 * @param {string} tahapId   - "orang" | "rumah" | "pohon" | "gabung"
 * @returns {object}
 */
function panggilAI_HTP(imageData, tahapId) {
  try {
    const key = tahapId.toLowerCase();
    const db  = HTP_DB_MAP[key];
    if (!db) throw new Error("Database untuk '" + tahapId + "' tidak ditemukan.");

    const skor   = {};
    const narasi = {};
    let total    = 0;

    HTP_ASPEK_IDS.forEach(function(id) {
      const nilai = Math.floor(Math.random() * 5) + 1;
      skor[id]    = nilai;
      total      += nilai;
      narasi[id]  = (db.narasi[id] && db.narasi[id][String(nilai)])
        ? db.narasi[id][String(nilai)]
        : "Analisa aspek " + id + " dengan skor " + nilai + ".";
    });

    const kategori   = _getKategoriHTP(total);
    const kesimpulan = db.kesimpulan[kategori] || {
      teknis: "-", konten: "-", simbolis: "-", observasi: "-"
    };

    return {
      tahapId, skor, total, kategori, narasi, kesimpulan,
      db_referensi: { narasi: db.narasi, kesimpulan: db.kesimpulan }
    };
  } catch (e) {
    console.error("panggilAI_HTP error:", e.message);
    return { error: e.message };
  }
}

/**
 * Simpan hasil tes HTP ke spreadsheet dan generate PDF.
 * Gambar sudah diupload via uploadGambarSaja() di Utils.gs.
 * payload.image_* berisi URL Drive.
 *
 * @param {object} data - Payload dari frontend
 * @returns {{ success: boolean, pdfUrl?: string, message: string }}
 */
function simpanHTP(data) {
  try {
    const ss    = getSS();
    const sheet = ss.getSheetByName("DATA_HTP") || ss.getSheetByName("DATA_THP");
    if (!sheet) throw new Error("Sheet DATA_HTP tidak ditemukan.");

    const urlOrang  = data.image_orang  || "-";
    const urlRumah  = data.image_rumah  || "-";
    const urlPohon  = data.image_pohon  || "-";
    const urlGabung = data.image_gabung || "-";

    // 70 kolom - urutan HARUS sama persis dengan header sheet DATA_HTP
    const row = [
      // 1-4: Identitas
      data.id_test    || "",
      data.id_peserta || "",
      data.nama       || "",
      data.tanggal    || "",

      // 5-18: ORANG
      Number(data.skor_orang_pro    || 0),  //  5. P1_Wajah
      Number(data.skor_orang_detl   || 0),  //  6. P2_Tangan
      Number(data.skor_orang_pers   || 0),  //  7. P3_Kaki
      Number(data.skor_orang_line   || 0),  //  8. P4_Integritas
      Number(data.total_orang       || 0),  //  9. pjml_score
      data.kategori_orang           || "-", // 10. pktg
      data.narasi_detail_orang_pro  || "",  // 11. nppro
      data.narasi_detail_orang_detl || "",  // 12. npdetl
      data.narasi_detail_orang_pers || "",  // 13. nppers
      data.narasi_detail_orang_line || "",  // 14. npline
      data.teknis_orang    || "",           // 15. phslteknis
      data.konten_orang    || "",           // 16. phslkonten
      data.simbolis_orang  || "",           // 17. phslsimbol
      data.observasi_orang || "",           // 18. phslkhusus

      // 19-32: RUMAH
      Number(data.skor_rumah_pro    || 0),  // 19. H1_Atap
      Number(data.skor_rumah_detl   || 0),  // 20. H2_Dinding
      Number(data.skor_rumah_pers   || 0),  // 21. H3_Pintu
      Number(data.skor_rumah_line   || 0),  // 22. H4_Garis
      Number(data.total_rumah       || 0),  // 23. Hjml_score
      data.kategori_rumah           || "-", // 24. hktg
      data.narasi_detail_rumah_pro  || "",  // 25. nhpro
      data.narasi_detail_rumah_detl || "",  // 26. nhdetl
      data.narasi_detail_rumah_pers || "",  // 27. nhpers
      data.narasi_detail_rumah_line || "",  // 28. nhline
      data.teknis_rumah    || "",           // 29. hhslteknis
      data.konten_rumah    || "",           // 30. hhslkonten
      data.simbolis_rumah  || "",           // 31. hhslsimbol
      data.observasi_rumah || "",           // 32. hhslskhusus

      // 33-46: POHON
      Number(data.skor_pohon_pro    || 0),  // 33. T1_Batang
      Number(data.skor_pohon_detl   || 0),  // 34. T2_Dahan
      Number(data.skor_pohon_pers   || 0),  // 35. T3_Akar
      Number(data.skor_pohon_line   || 0),  // 36. T4_Daun
      Number(data.total_pohon       || 0),  // 37. Tjlm_score
      data.kategori_pohon           || "-", // 38. Tktg
      data.narasi_detail_pohon_pro  || "",  // 39. ntpro
      data.narasi_detail_pohon_detl || "",  // 40. ntdetl
      data.narasi_detail_pohon_pers || "",  // 41. ntpers
      data.narasi_detail_pohon_line || "",  // 42. ntline
      data.teknis_pohon    || "",           // 43. Thslteknis
      data.konten_pohon    || "",           // 44. Thslkonten
      data.simbolis_pohon  || "",           // 45. Thslsimbol
      data.observasi_pohon || "",           // 46. Thslkhusus

      // 47-60: GABUNGAN
      Number(data.skor_gabung_pro    || 0), // 47. Obs_pro
      Number(data.skor_gabung_detl   || 0), // 48. Obs_detl
      Number(data.skor_gabung_pers   || 0), // 49. Obs_pers
      Number(data.skor_gabung_line   || 0), // 50. Obs_line
      Number(data.total_gabung       || 0), // 51. obsjml_score
      data.kategori_gabung           || "-",// 52. obsktg
      data.narasi_detail_gabung_pro  || "", // 53. nObs_pro
      data.narasi_detail_gabung_detl || "", // 54. nObs_detl
      data.narasi_detail_gabung_pers || "", // 55. nObs_pers
      data.narasi_detail_gabung_line || "", // 56. nObs_line
      data.teknis_gabung    || "",          // 57. obshslteknis
      data.konten_gabung    || "",          // 58. obshslkonten
      data.simbolis_gabung  || "",          // 59. obshslsimbol
      data.observasi_gabung || "",          // 60. obshslkhusus

      // 61-66: Kesimpulan Akhir
      Number(data.total_keseluruhan || 0),  // 61. Total_score
      data.kategori_keseluruhan || "-",     // 62. Kategori_Akhir
      data.final_teknis         || "",      // 63. Aspek_Teknis
      data.final_interpretasi   || "",      // 64. Interprestasi
      data.final_dinamika       || "",      // 65. Dinamika
      data.final_profil         || "",      // 66. Rekomendasi

      // 67-70: URL Gambar
      urlOrang,
      urlRumah,
      urlPohon,
      urlGabung
    ];

    sheet.appendRow(row);

    const pdfUrl = _generatePdfHTP(data, { urlOrang, urlRumah, urlPohon, urlGabung });
    return { success: true, pdfUrl: pdfUrl, message: "Data HTP berhasil disimpan." };
  } catch (err) {
    console.error("simpanHTP error:", err.message);
    return { success: false, message: err.toString() };
  }
}

/**
 * Generate PDF laporan HTP dari Google Doc template.
 * Gambar ditampilkan sebagai URL teks di PDF.
 *
 * @param {object} data - Data hasil tes
 * @param {object} urls - { urlOrang, urlRumah, urlPohon, urlGabung }
 * @returns {string} URL PDF
 */
/**
 * Generate PDF laporan HTP dari Google Doc template.
 * Gambar disisipkan secara inline dari Drive menggunakan URL yang sudah tersimpan.
 *
 * @param {object} data - Data hasil tes
 * @param {object} urls - { urlOrang, urlRumah, urlPohon, urlGabung }
 * @returns {string} URL PDF
 */
function _generatePdfHTP(data, urls) {
  try {
    const folder   = DriveApp.getFolderById(CONFIG.FOLDER_HTP);
    const template = DriveApp.getFileById(CONFIG.TEMPLATE_HTP);
    const namaFile = "Laporan_HTP_" + (data.nama || "Peserta") + "_" + (data.id_test || "");
 
    const copy = template.makeCopy(namaFile, folder);
    const doc  = DocumentApp.openById(copy.getId());
    const body = doc.getBody();
 
    // 1. Ganti semua tag teks
    const replaceDict = {
      "{{ID_Test}}":        data.id_test             || "-",
      "{{ID_Peserta}}":     data.id_peserta           || "-",
      "{{Nama}}":           data.nama                 || "-",
      "{{Tanggal}}":        data.tanggal              || "-",
      "{{Total_score}}":    String(data.total_keseluruhan || 0),
      "{{Kategori_Akhir}}": data.kategori_keseluruhan || "-",
      "{{Aspek_Teknis}}":   data.final_teknis         || "-",
      "{{Interprestasi}}":  data.final_interpretasi   || "-",
      "{{Dinamika}}":       data.final_dinamika       || "-",
      "{{Rekomendasi}}":    data.final_profil         || "-",
 
      // ORANG
      "{{pjml_score}}":   String(data.total_orang || 0),
      "{{pktgn}}":        data.kategori_orang            || "-",
      "{{nppro}}":        data.narasi_detail_orang_pro   || "-",
      "{{npdetl}}":       data.narasi_detail_orang_detl  || "-",
      "{{nppers}}":       data.narasi_detail_orang_pers  || "-",
      "{{npline}}":       data.narasi_detail_orang_line  || "-",
      "{{phslteknis}}":   data.teknis_orang              || "-",
      "{{phslkonten}}":   data.konten_orang              || "-",
      "{{phslsimbol}}":   data.simbolis_orang            || "-",
      "{{phslkhusus}}":   data.observasi_orang           || "-",
 
      // RUMAH
      "{{Hjml_score}}":   String(data.total_rumah || 0),
      "{{hktg}}":         data.kategori_rumah            || "-",
      "{{nhpro}}":        data.narasi_detail_rumah_pro   || "-",
      "{{nhdetl}}":       data.narasi_detail_rumah_detl  || "-",
      "{{nhpers}}":       data.narasi_detail_rumah_pers  || "-",
      "{{nhline}}":       data.narasi_detail_rumah_line  || "-",
      "{{hhslteknis}}":   data.teknis_rumah              || "-",
      "{{hhslkonten}}":   data.konten_rumah              || "-",
      "{{hhslsimbol}}":   data.simbolis_rumah            || "-",
      "{{hhslskhusus}}":  data.observasi_rumah           || "-",
 
      // POHON
      "{{Tjlm_score}}":   String(data.total_pohon || 0),
      "{{Tktgn}}":        data.kategori_pohon            || "-",
      "{{ntpro}}":        data.narasi_detail_pohon_pro   || "-",
      "{{ntdetl}}":       data.narasi_detail_pohon_detl  || "-",
      "{{ntpers}}":       data.narasi_detail_pohon_pers  || "-",
      "{{ntline}}":       data.narasi_detail_pohon_line  || "-",
      "{{Thslteknis}}":   data.teknis_pohon              || "-",
      "{{Thslkonten}}":   data.konten_pohon              || "-",
      "{{Thslsimbol}}":   data.simbolis_pohon            || "-",
      "{{Thslkhusus}}":   data.observasi_pohon           || "-",
 
      // GABUNGAN
      "{{obsjml_score}}": String(data.total_gabung || 0),
      "{{obsktg}}":       data.kategori_gabung           || "-",
      "{{nObs_pro}}":     data.narasi_detail_gabung_pro  || "-",
      "{{nObs_detl}}":    data.narasi_detail_gabung_detl || "-",
      "{{nObs_pers}}":    data.narasi_detail_gabung_pers || "-",
      "{{nObs_line}}":    data.narasi_detail_gabung_line || "-",
      "{{obshslteknis}}": data.teknis_gabung             || "-",
      "{{obshslkonten}}": data.konten_gabung             || "-",
      "{{obshslsimbol}}": data.simbolis_gabung           || "-",
      "{{obshslkhusus}}": data.observasi_gabung          || "-",
    };
 
    Object.entries(replaceDict).forEach(function([tag, val]) {
      body.replaceText(tag, val);
    });
 
    // 2. Sisipkan 4 gambar inline dari Drive
    // Ambil blob langsung dari file Drive yang sudah terupload
    // Tidak perlu kirim base64 ulang dari frontend
    var gambarList = [
      { tag: "{{gbr_orang}}",    url: urls.urlOrang  },
      { tag: "{{gbr_rumah}}",    url: urls.urlRumah  },
      { tag: "{{gbr_pohon}}",    url: urls.urlPohon  },
      { tag: "{{gbr_gabungan}}", url: urls.urlGabung },
    ];
 
    gambarList.forEach(function(item) {
      _sisipkanGambarDariUrl(body, item.tag, item.url);
    });
 
    doc.saveAndClose();
 
    const pdfBlob = copy.getAs(MimeType.PDF);
    const pdf     = folder.createFile(pdfBlob.setName(namaFile + ".pdf"));
    copy.setTrashed(true);
 
    return pdf.getUrl();
  } catch (e) {
    console.error("_generatePdfHTP error:", e.message);
    return "";
  }
}
 
/**
 * Sisipkan gambar dari Drive ke dalam dokumen secara inline.
 * Mengambil file dari Drive menggunakan file ID yang diekstrak dari URL.
 *
 * @param {GoogleAppsScript.Document.Body} body
 * @param {string} tag - Placeholder contoh "{{gbr_orang}}"
 * @param {string} url - URL Drive format: https://drive.google.com/uc?export=view&id=FILE_ID
 */
function _sisipkanGambarDariUrl(body, tag, url) {
  try {
    const found = body.findText(tag);
    if (!found) {
      console.log("Tag tidak ditemukan di template: " + tag);
      return;
    }
 
    const textElement = found.getElement().asText();
    const parent      = textElement.getParent();
 
    // Hapus teks tag
    textElement.setText(textElement.getText().replace(tag, ""));
 
    // Tidak ada gambar - biarkan kosong
    if (!url || url === "-") return;
 
    // Ekstrak fileId dari URL Drive
    // Format: https://drive.google.com/uc?export=view&id=FILE_ID
    const match  = url.match(/id=([^&]+)/);
    if (!match) {
      console.log("Gagal ekstrak fileId dari URL: " + url);
      return;
    }
 
    const fileId = match[1];
 
    try {
      const blob = DriveApp.getFileById(fileId).getBlob();
 
      var inlineImage;
      if (parent.getType() === DocumentApp.ElementType.PARAGRAPH) {
        inlineImage = parent.asParagraph().appendInlineImage(blob);
      } else {
        inlineImage = body.appendImage(blob);
      }
 
      // Resize agar muat di halaman - maks lebar 480px
      const maxWidth = 480;
      const w = inlineImage.getWidth();
      const h = inlineImage.getHeight();
      if (w > maxWidth) {
        inlineImage.setWidth(maxWidth);
        inlineImage.setHeight(Math.round(h * (maxWidth / w)));
      }
 
      console.log("Gambar berhasil disisipkan untuk: " + tag);
    } catch (imgErr) {
      console.error("Gagal sisipkan gambar untuk " + tag + ": " + imgErr.message);
      // Fallback: tulis URL sebagai teks jika gambar gagal disisipkan
      if (parent.getType() === DocumentApp.ElementType.PARAGRAPH) {
        parent.asParagraph().appendText(url);
      }
    }
  } catch (e) {
    console.error("_sisipkanGambarDariUrl error untuk " + tag + ": " + e.message);
  }
}

// --- Bridge backward-compatibility ---

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