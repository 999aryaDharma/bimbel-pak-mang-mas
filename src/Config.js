// ============================================================
// CONFIG.GS - Konfigurasi Sentral & Entry Point Aplikasi
// ============================================================

const CONFIG = {
  SS_ID: "1E0hTfph7Shepi0P-wSmv4Y9OZMQ7ygX_AzT18_4YdyQ",

  // Konfigurasi Folder & Template WARTEGG
  FOLDER_WARTEGG: "1jn4Ftr2p11WRSJy87d-Kr8Iw7B8L1fik",
  TEMPLATE_WARTEGG: "1E6DT3GlTPy3N62mB8i0FgfJ4AJ1BtZJyCrPUvSeDOPM",
  FOLDER_WARTEGG_FOTO: "1LunzkMJ0dflCTOPlTJb2ZMNG9JTLXmqM",

  // Konfigurasi Folder & Template HTP
  FOLDER_HTP: "1N-MjNV1740sDU1FZJqQYX73fdGy77zkj",
  TEMPLATE_HTP: "1-81pisDPptpkucvg0pKLSl79sfBQaW35CF1I3fFl8PY",
  FOLDER_HTP_FOTO: "1B6VHlMVBYP0kJ15_hwPy0D89K45ObdD4",

  SHEET: {
    PESERTA: "DATA_PESERTA",
    WARTEGG: "DATA_WARTEGG",
    HTP: "DATA_HTP",
    PAULI: "DATA_PAULI",
    KRAEPELIN: "DATA_KRAEPELIN",
  },
  TIMEZONE: "Asia/Jakarta",
};

const getSS = () => SpreadsheetApp.openById(CONFIG.SS_ID);

function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle("Aplikasi Bimbel Psikotes");
}

function include(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}
