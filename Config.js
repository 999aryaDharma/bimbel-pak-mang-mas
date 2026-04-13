// ============================================================
// CONFIG.GS - Konfigurasi Sentral & Entry Point Aplikasi
// ============================================================

const CONFIG = {
  SS_ID: "1E0hTfph7Shepi0P-wSmv4Y9OZMQ7ygX_AzT18_4YdyQ",
  FOLDER_ID: "1BLHleJhrgbhc7XAmEOxaBn-0CwkfiDNd",
  TEMPLATE_PDF: "1oRD4nF_rtdDM6SOGZ4yntB2kFpn2YZLi",
  SHEET: {
    PESERTA: "DATA_PESERTA",
    WARTEGG: "DATA_WARTEGG",
    HTP: "DATA_HTP",
    PAULI: "DATA_PAULI",
    KRAEPELIN: "DATA_KRAEPELIN"
  },
  TIMEZONE: "Asia/Jakarta"
};

// Helper: buka spreadsheet utama
const getSS = () => SpreadsheetApp.openById(CONFIG.SS_ID);

// Entry point Google Apps Script Web App
function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle("Aplikasi Bimbel Psikotes");
}

// Helper untuk include file HTML (dipanggil dari template)
function include(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}