/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import ExcelJS, { Borders } from "exceljs";
import { saveAs } from "file-saver";

function formatDate(fecha: string): string {
  const date = new Date(fecha)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getFullBorder(): Partial<Borders> {
  return {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } }
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ExportColumn<T> {
  header: string
  key: keyof T
}

interface ExportToPDFProps<T> {
  data: T[]
  columns: ExportColumn<T>[]
  title: string
  filename?: string
}

export function exportToPDF<T>({ data, columns, title, filename = "reporte" }: ExportToPDFProps<T>) {
  const doc = new jsPDF()

  // Colores y tipografías
  const primaryColor = "#2c3e50"
  const secondaryColor = "#7f8c8d"
  const pageWidth = doc.internal.pageSize.getWidth()

  // Encabezado institucional
  doc.setFontSize(12)
  doc.setTextColor(primaryColor)
  doc.setFont("helvetica", "bold")
  doc.text("Parroquia San Miguel Arcángel de Montalvo", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setTextColor(secondaryColor)
  doc.setFontSize(10)
  doc.text("Diócesis de Ambato", doc.internal.pageSize.getWidth() / 2, 21, { align: "center" })
  doc.text("Calle Montalvo y Mercurial - Ambato (Tungurahua)", doc.internal.pageSize.getWidth() / 2, 27, { align: "center" })

  // Línea divisoria
  doc.setDrawColor(160)
  doc.line(14, 30, doc.internal.pageSize.getWidth() - 14, 30)

  // Título del reporte
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor)
  doc.setFontSize(14)
  doc.text(title.toUpperCase(), doc.internal.pageSize.getWidth() / 2, 40, { align: "center" })

   // Fecha actual centrada
  const today = new Date()
  const formattedDate = today.toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(secondaryColor)
  doc.text(`Fecha de emisión: ${formattedDate}`, pageWidth / 2, 46, { align: "center" })

  // Tabla de datos
  autoTable(doc, {
    startY: 50,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => String(row[col.key] ?? ""))),
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: {
      fillColor: [44, 62, 80], // azul oscuro
      textColor: [255, 255, 255],
      halign: "center",
    },
    bodyStyles: {
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })

  doc.save(`${filename}.pdf`)
}

/**
 * Exporta datos a Excel
 */
export async function exportToExcel(data: any[], columns: { key: string, header: string }[], title: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte");

  const fecha = new Date().toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const colLength = columns.length;
  const endCol = String.fromCharCode(64 + colLength); // A, B, C, D...

  // ========== ENCABEZADO INSTITUCIONAL ==========
  const headerLines = [
    "Parroquia San Miguel Arcángel de Montalvo",
    "Diócesis de Ambato",
    "",
    title.toUpperCase(),
    `Fecha de emisión: ${fecha}`,
    ""
  ];

  headerLines.forEach((text, index) => {
    const row = worksheet.addRow([text]);
    row.font = { name: "Arial", bold: true, size: 14 };
    row.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.mergeCells(`A${index + 1}:${endCol}${index + 1}`);

    if (index === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" }
      };
    } else if (index === 1) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFB4C6E7" }
      };
    } else if (index === 4) {
      row.font.size = 16;
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF8EA9DB" }
      };
    }
  });

  worksheet.addRow([]);

  // ========== ENCABEZADO DE LA TABLA ==========
  const headerRow = worksheet.addRow(columns.map(col => col.header));
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" } // azul profesional
  };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.height = 20;
  headerRow.border = getFullBorder();

  // ========== CUERPO DE LA TABLA ==========
  data.forEach((item, index) => {
    const row = worksheet.addRow(columns.map(col => item[col.key]));
    row.font = { name: "Arial", size: 11 };
    row.alignment = { vertical: "middle", horizontal: "center" };
    row.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: index % 2 === 0 ? "FFF2F2F2" : "FFFFFFFF" // alternancia de filas
      }
    };
    row.border = getFullBorder();
  });

  // ========== AJUSTAR ANCHOS ==========
  worksheet.columns.forEach((col) => {
    col.width = 25;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${title}.xlsx`);
}


// Función para exportar a PDF
export function exportCertificadoPDF(certificacion: any, nombreGraduado: string) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  console.log(certificacion)

  const cursoNombre = certificacion?.matricula_id?.curso_id?.nombre || ""
  const nivelNombre = certificacion?.matricula_id?.curso_id?.nivel_id?.nombre || ""
  const porcentajeAsistencia = certificacion?.porcentaje_asistencia || 0
  const fecha = formatDate(certificacion?.fecha || new Date().toISOString())

  // Fondo opcional
  doc.setFillColor(240, 240, 240)
  doc.rect(0, 0, 297, 210, "F")

  // Título del certificado
  doc.setFontSize(24)
  doc.setTextColor(40, 40, 40)
  doc.setFont("helvetica", "bold")
  doc.text("CERTIFICADO DE FINALIZACIÓN", 148.5, 30, { align: "center" })

  // Nivel (principal título al centro)
  doc.setFontSize(20)
  doc.setTextColor(0, 102, 204)
  doc.text(nivelNombre.toUpperCase(), 148.5, 50, { align: "center" })

  // Texto: El presente certifica que...
  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.setFont("helvetica", "normal")
  doc.text(`Se otorga el presente certificado a:`, 148.5, 70, { align: "center" })

  // Nombre del graduado
  doc.setFontSize(18)
  doc.setFont("times", "bolditalic")
  doc.setTextColor(0, 0, 0)
  doc.text(nombreGraduado, 148.5, 82, { align: "center" })

  // Información adicional
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.text(`Por su participación en el curso "${cursoNombre}"`, 148.5, 95, { align: "center" })
  doc.text(`Con un porcentaje de asistencia del ${porcentajeAsistencia}%`, 148.5, 105, { align: "center" })
  doc.text(`Fecha de emisión: ${fecha}`, 148.5, 115, { align: "center" })

  // Línea de firma
  doc.line(100, 150, 197, 150)
  doc.setFontSize(10)
  doc.text("Firma del Coordinador", 148.5, 158, { align: "center" })

  // Guardar
  const fileName = `Certificado_${nombreGraduado.replace(/ /g, "_")}.pdf`
  doc.save(fileName)

  // Devuelve Blob URL
  const blob = doc.output("blob")
  return URL.createObjectURL(blob)
}