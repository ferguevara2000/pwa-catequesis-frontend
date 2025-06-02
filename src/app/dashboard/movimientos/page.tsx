"use client";

import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Movimiento } from "@/services/movimiento";
import MovimientoManagement from "@/components/finanzas/movimientos-management";
import { exportToExcel, exportToPDF } from "@/lib/utils";
import { ReporteDialog } from "@/components/reportes/ReportDialog";

export default function MovimientoPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState<
    Movimiento | undefined
  >();
  const [movimientoData, setMovimientoData] = useState<Movimiento[]>([]);

  const handleCreate = () => {
    setSelectedMovimiento(undefined);
    setFormOpen(true);
  };

  const handleEdit = (movimiento: Movimiento) => {
    setSelectedMovimiento(movimiento);
    setFormOpen(true);
  };

  const handleExportPDF = () => {
    if (!movimientoData.length) return;
    exportToPDF({
      data: movimientoData,
      columns: [
        { header: "Caserio", key: "finanza_nombre" },
        { header: "Tipo", key: "tipo" },
        { header: "Monto", key: "monto" },
        { header: "Fecha", key: "fecha" },
      ],
      title: "Reporte de movimientos financieros",
      filename: "reporte_financiero",
    });
  };

  const handleExportExcel = () => {
    if (!movimientoData.length) return;

    const columns = [
      { header: "Caserio", key: "finanza_nombre" },
        { header: "Tipo", key: "tipo" },
        { header: "Monto", key: "monto" },
        { header: "Fecha", key: "fecha" },
    ];

    exportToExcel(movimientoData, columns, "Reporte de movimientos financieros");
  };

  return (
    <RoleProtectedRoute allowedRoles={["Administrador"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Movimientos Financieros Parroquiales
          </h1>
          <div className="flex gap-2">
            <ReporteDialog onPdfClick={handleExportPDF} onExcelClick={handleExportExcel} />
            <Button onClick={handleCreate} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Ingresar Movimiento
            </Button>
          </div>
        </div>

        <MovimientoManagement
          formOpen={formOpen}
          onCloseForm={() => {
            setFormOpen(false);
            setSelectedMovimiento(undefined);
          }}
          selectedMovimiento={selectedMovimiento}
          onEdit={handleEdit}
          onDataReady={(data) => setMovimientoData(data)}
        />
      </div>
    </RoleProtectedRoute>
  );
}
