// ============================================================
// UTILS.GS - Fungsi Utilitas & Helper Bersama
// ============================================================

/**
 * Generate ID unik untuk setiap sesi tes.
 * @param {string} prefix - Awalan ID (contoh: "WTG", "HTP", "PAULI")
 * @returns {string} ID dalam format PREFIX-YYYYMMDD-XXXX
 */
function generateIdTest(prefix) {
  const date = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${date}-${random}`;
}

/**
 * Upload gambar base64 ke Google Drive.
 * @param {string} base64 - Data gambar dalam format base64 (tanpa prefix data URI)
 * @param {string} filename - Nama file yang akan disimpan
 * @returns {string} URL publik file, atau "-" jika gagal
 */
function uploadFile(base64, filename) {
  if (!base64) return "-";
  try {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64),
      "image/jpeg",
      filename
    );
    const file = DriveApp.getFolderById(CONFIG.FOLDER_ID).createFile(blob);
    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (e) {
    console.error("uploadFile error:", e.message);
    return "-";
  }
}

/**
 * Format objek Date ke string dd/MM/yyyy (timezone Jakarta).
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return Utilities.formatDate(date, CONFIG.TIMEZONE, "dd/MM/yyyy");
}

// --- Standar Response Helper ---

function createSuccessResponse(data) {
  return { success: true, ...data };
}

function createErrorResponse(message) {
  console.error("Error:", message);
  return { success: false, message: String(message) };
}