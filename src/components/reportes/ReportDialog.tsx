'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, FileSpreadsheet } from "lucide-react"

interface ReporteDialogProps {
  onPdfClick: () => void
  onExcelClick: () => void
}

export function ReporteDialog({ onPdfClick, onExcelClick }: ReporteDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Generar Reporte
      </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generar Reporte</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => {
              onPdfClick()
              setOpen(false)
            }}
            variant="secondary"
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            PDF
          </Button>

          <Button
            onClick={() => {
              onExcelClick()
              setOpen(false)
            }}
            variant="secondary"
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
