// ============================================================
// DATA_PESERTA.GS - Modul CRUD Data Peserta
// ============================================================

/**
 * Ambil daftar peserta untuk opsi dropdown di frontend.
 * @returns {Array<{id: string, nama: string}>}
 */
function getPesertaDropdown() {
  const sheet = getSS().getSheetByName(CONFIG.SHEET.PESERTA);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  // Kolom B (index 1) = ID Peserta, Kolom C (index 2) = Nama
  return data.slice(1).map(r => ({ id: r[1], nama: r[2] }));
}

/**
 * Ambil semua data peserta untuk ditampilkan di tabel.
 * @returns {{ success: boolean, rows: Array, header: Array, total: number }}
 */
function getSemuaPeserta() {
  try {
    const sheet = getSS().getSheetByName(CONFIG.SHEET.PESERTA);
    if (!sheet) return createErrorResponse("Sheet DATA_PESERTA tidak ditemukan");

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return createSuccessResponse({ rows: [], header: [], total: 0 });

    const header = data[0].slice(1);
    const rows = data.slice(1).map(row => ({
      id: row[1],
      data: row.slice(1).map(cell => {
        if (cell instanceof Date) return formatDate(cell);
        return cell === "" ? "-" : cell;
      })
    }));

    return createSuccessResponse({ header, rows, total: rows.length });
  } catch (e) {
    return createErrorResponse(e.message);
  }
}

/**
 * Hapus satu baris data peserta berdasarkan ID.
 * @param {string|number} id - ID peserta yang akan dihapus
 */
function hapusDataPesertaSheet(id) {
  try {
    const sheet = getSS().getSheetByName(CONFIG.SHEET.PESERTA);
    if (!sheet) return createErrorResponse("Sheet DATA_PESERTA tidak ditemukan");

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]) === String(id)) {
        sheet.deleteRow(i + 1);
        return createSuccessResponse({ message: `Data peserta ${id} berhasil dihapus.` });
      }
    }
    return createErrorResponse("ID tidak ditemukan di database.");
  } catch (e) {
    return createErrorResponse(e.message);
  }
}