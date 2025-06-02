import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Bautismo } from "@/services/bautismos"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export interface GenerarCertificadoModalProps {
  item: Bautismo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function GenerarCertificadoModal({ item, open, onOpenChange }: GenerarCertificadoModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      generarCertificadoPDF(item).then(url => setPdfUrl(url))
    } else {
      setPdfUrl(null)
    }
  }, [open, item])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
        <div className="flex flex-col h-full w-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Vista previa del certificado</h2>
          </div>
          <div className="flex-1">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="Vista previa del certificado"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Generando certificado...</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

async function generarCertificadoPDF(item: Bautismo): Promise<string> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()

  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const fontSize = 12

  const MARGIN_X = 50

  const drawCenteredText = (text: string, y: number, size = fontSize, font = fontRegular) => {
    const textWidth = font.widthOfTextAtSize(text, size)
    const x = (width - textWidth) / 2
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) })
  }

  const drawParagraphWithBoldData = (
    parts: (string | { text: string, bold: boolean })[],
    x: number,
    y: number
  ): number => {
    let offsetX = x
    let currentY = y

    parts.forEach(part => {
      const text = typeof part === "string" ? part : part.text
      const isBold = typeof part !== "string" && part.bold
      const fontToUse = isBold ? fontBold : fontRegular
      const textWidth = fontToUse.widthOfTextAtSize(text, fontSize)

      if (offsetX + textWidth > width - MARGIN_X) {
        currentY -= fontSize + 4
        offsetX = x
      }

      page.drawText(text, {
        x: offsetX,
        y: currentY,
        size: fontSize,
        font: fontToUse,
        color: rgb(0, 0, 0),
      })

      offsetX += textWidth + 1
    })

    return currentY - fontSize - 4
  }

  const fullName = `${item.nombres} ${item.apellidos}`
  const fecha = new Date(item.fecha_bautismo)
  const dia = fecha.getDate()
  const mes = fecha.toLocaleString("es-ES", { month: "long" })
  const anio = fecha.getFullYear()

  let y = height - 50
  drawCenteredText("Diócesis de Ambato", y, 16, fontBold); y -= 22
  drawCenteredText("Ministerio Parroquial de", y, 14); y -= 20
  drawCenteredText("San Miguel de Montalvo", y, 14, fontBold); y -= 28
  drawCenteredText("PARTIDA DE BAUTISMO", y, 18, fontBold); y -= 50

  drawParagraphWithBoldData([
    "Fecha: ", { text: new Date().toLocaleDateString("es-EC"), bold: true }
  ], width - 180, y); y -= 30

  y = drawParagraphWithBoldData([
    "Yo el inscrito certifico, en forma legal, a petición de la parte interesada que ",
    { text: fullName, bold: true },
    " se encuentra inscrito en la Partida con los siguientes datos."
  ], MARGIN_X, y)

  y = drawParagraphWithBoldData([
    "El día ", { text: String(dia), bold: true },
    " del mes ", { text: mes, bold: true },
    " del año ", { text: String(anio), bold: true },
    " en la iglesia de San Miguel Arcángel de Montalvo,"
  ], MARGIN_X, y)

  y = drawParagraphWithBoldData([
    "el Rvdo. Padre ", { text: item.sacerdote, bold: true },
    " bautizó solemnemente a ", { text: fullName, bold: true }, "."
  ], MARGIN_X, y)

  y = drawParagraphWithBoldData([
    "Hijo(a) de ", { text: `${item.nombres_padre} ${item.apellidos_padre}`, bold: true },
    " y de ", { text: `${item.nombres_madre} ${item.apellidos_madre}`, bold: true }, "."
  ], MARGIN_X, y)

  y = drawParagraphWithBoldData([
    "Fueron padrinos: ", { text: item.padrino!, bold: true }, "."
  ], MARGIN_X, y)

  y -= 40
  page.drawText("Certifica:", { x: MARGIN_X, y, size: fontSize, font: fontRegular }); y -= 60
  page.drawText("______________________________", { x: MARGIN_X, y, size: fontSize, font: fontRegular }); y -= 15
  page.drawText("Rvdo. Padre Ignacio Caizabanda Jerez", { x: MARGIN_X, y, size: fontSize, font: fontBold })

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  return URL.createObjectURL(blob)
}
