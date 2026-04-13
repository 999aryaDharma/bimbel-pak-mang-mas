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
    // Menggunakan folderId yang diberikan
    const file = DriveApp.getFolderById(folderId).createFile(blob);
    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (e) {
    console.error("uploadFile error:", e.message);
    return "-";
  }
}

function formatDate(date) {
  return Utilities.formatDate(date, CONFIG.TIMEZONE, "dd/MM/yyyy");
}

function createSuccessResponse(data) {
  return { success: true, ...data };
}

function createErrorResponse(message) {
  console.error("Error:", message);
  return { success: false, message: String(message) };
}
