import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

export function exportarExcel(detalhes) {
  const worksheet = utils.json_to_sheet(detalhes);

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "RelatórioClientes");

  const excelBuffer = write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `RelatorioClientes_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
