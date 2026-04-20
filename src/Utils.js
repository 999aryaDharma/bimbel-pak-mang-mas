// ============================================================
// UTILS.GS - Fungsi Utilitas & Helper Bersama
// ============================================================

function generateIdTest(prefix) {
  const date = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${date}-${random}`;
}

/**
 * Upload gambar base64 ke Google Drive dengan spesifik folder ID.
 */
function uploadFile(base64, filename, folderId) {
  if (!base64) return "-";
  try {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64),
      "image/jpeg",
      filename,
    );
    const file = DriveApp.getFolderById(folderId).createFile(blob);
    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (e) {
    console.error("uploadFile error:", e.message);
    return "-";
  }
}
 
/**
 * Upload gambar ke Drive dan kembalikan URL + fileId.
 * fileId dibutuhkan oleh backend untuk sisipkan gambar ke PDF.
 *
 * @param {string} base64     - Data gambar base64 (boleh dengan/tanpa data URI prefix)
 * @param {string} namaFile   - Nama file yang akan disimpan di Drive
 * @param {string} modulType  - "HTP" atau "WARTEGG"
 * @returns {{ success: boolean, url: string, fileId: string, message?: string }}
 */
function uploadGambarSaja(base64, namaFile, modulType) {
  try {
    // Gunakan CONFIG.FOLDER_HTP atau CONFIG.FOLDER_WARTEGG (konsisten dengan simpanHTP/simpanWartegg)
    const folderID    = modulType === "HTP" ? CONFIG.FOLDER_HTP_FOTO : CONFIG.FOLDER_WARTEGG_FOTO;
    const base64Clean = base64.replace(/^data:image\/[a-z]+;base64,/, "");
    const blob        = Utilities.newBlob(
      Utilities.base64Decode(base64Clean),
      "image/jpeg",
      namaFile
    );
 
    const file = DriveApp.getFolderById(folderID).createFile(blob);
    return {
      success: true,
      fileId:  file.getId(),
      url:     "https://drive.google.com/uc?export=view&id=" + file.getId()
    };
  } catch (e) {
    console.error("uploadGambarSaja error:", e.message);
    return { success: false, fileId: "", url: "-", message: e.message };
  }
}

/**
 * Fungsi diagnostik — jalankan langsung dari Apps Script Editor untuk isolasi masalah.
 * Klik Run -> testUploadHTP() dan lihat hasilnya di Execution Log.
 */
function testUploadHTP() {
  // 1x1 pixel JPEG minimal sebagai data test (tidak butuh file asli)
  const tinyJpegBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAAR" +
    "CAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=";
 
  const result = uploadGambarSaja(tinyJpegBase64, "test_diagnostik.jpg", "HTP");
  console.log("testUploadHTP result:", JSON.stringify(result));
 
  if (result.success) {
    console.log("SUKSES! fileId:", result.fileId);
    console.log("URL:", result.url);
    // Hapus file test
    try { DriveApp.getFileById(result.fileId).setTrashed(true); } catch(e) {}
  } else {
    console.error("GAGAL:", result.message);
  }
 
  return result;
}

function formatDate(date) {
  return Utilities.formatDate(date, CONFIG.TIMEZONE, "dd/MM/yyyy");
}

function createSuccessResponse(data) {
  return { success: true, ...data };
}

function cekAksesFolder() {
  console.log("Akun: " + Session.getEffectiveUser().getEmail());
  
  try {
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_HTP);
    console.log("FOLDER_HTP: " + folder.getName());
    console.log("Owner: " + folder.getOwner().getEmail());
    
    const blob = Utilities.newBlob("test", "text/plain", "test.txt");
    const file = folder.createFile(blob);
    console.log("createFile OK: " + file.getId());
    file.setTrashed(true);
  } catch(e) {
    console.log("GAGAL: " + e.message);
  }
}

function createErrorResponse(message) {
  console.error("Error:", message);
  return { success: false, message: String(message) };
}
