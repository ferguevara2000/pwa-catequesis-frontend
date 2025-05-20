import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Finanza, getAllBarrios } from "@/services/finanzas";

type Barrio = {
  id: number;
  nombre: string;
};

export default function FinanzaForm({
  open,
  onClose,
  finanza,
}: {
  open: boolean;
  onClose: () => void;
  finanza?: Partial<Finanza>;
}) {
  const [formData, setFormData] = useState({
    barrio_id: 0,
    total_ingresos: 0,
    total_egresos: 0,
    saldo: 0,
    actualizado_en: "",
    tesorero: "",
  });

  const [barrios, setBarrios] = useState<Barrio[]>([]);

  useEffect(() => {
    const fetchBarrios = async () => {
      const data = await getAllBarrios();
      setBarrios(data);
    };
    fetchBarrios();
  }, []);

  useEffect(() => {
    if (finanza) {
      setFormData({
        barrio_id: finanza.barrio_id ?? 0,
        total_ingresos: finanza.total_ingresos ?? 0,
        total_egresos: finanza.total_egresos ?? 0,
        saldo: finanza.saldo ?? 0,
        actualizado_en: finanza.actualizado_en?.slice(0, 10) ?? "",
        tesorero: finanza.tesorero
          ? `${finanza.tesorero.nombre} ${finanza.tesorero.apellidos}`
          : "",
      });
    }
  }, [finanza]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle financiero</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {/* Barrio */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Barrio</label>
            <Select
              value={formData.barrio_id.toString()}
              disabled
            >
              <SelectTrigger className="w-full bg-muted cursor-not-allowed">
                <SelectValue placeholder="Selecciona un barrio" />
              </SelectTrigger>
              <SelectContent>
                {barrios.map((barrio) => (
                  <SelectItem key={barrio.id} value={barrio.id.toString()}>
                    {barrio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Total Ingresos */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Total Ingresos</label>
            <Input
              name="total_ingresos"
              type="number"
              value={formData.total_ingresos}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* Total Egresos */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Total Egresos</label>
            <Input
              name="total_egresos"
              type="number"
              value={formData.total_egresos}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* Saldo */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Saldo</label>
            <Input
              name="saldo"
              type="number"
              value={formData.saldo}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* Fecha Actualización */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Fecha Actualización</label>
            <Input
              name="actualizado_en"
              type="date"
              value={formData.actualizado_en}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* Tesorero */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground">Tesorero</label>
            <Input
              name="tesorero"
              value={formData.tesorero}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
