import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Gera e baixa um relatório Excel com os dados dos clientes.
 * @param {Array} detalhes - Array de objetos com nome, cpf, email, vaiReceber, jaPagou, total.
 */
export async function exportarExcel(detalhes) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("RelatórioClientes");

    worksheet.columns = [
        { header: "Cliente", key: "nome" },
        { header: "CPF", key: "cpf" },
        { header: "Email", key: "email" },
        { header: "Contas a Receber", key: "vaiReceber" },
        { header: "Contas Pagas", key: "jaPagou" },
        { header: "Total por Cliente", key: "total" }
    ];

    detalhes.forEach(item => {
        worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, `RelatorioClientes_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
