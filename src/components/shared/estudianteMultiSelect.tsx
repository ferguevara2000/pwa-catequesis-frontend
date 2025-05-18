import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Usuario } from "@/services/estudianteCurso";
import { Button } from "../ui/button";

export function EstudiantesMultiSelect({
  estudiantes,
  selected,
  onChange,
}: {
  estudiantes: Usuario[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selected.length > 0
            ? `${selected.length} estudiante(s) seleccionado(s)`
            : "Selecciona estudiantes"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-h-[300px] overflow-y-auto">
        <div className="space-y-2">
          {estudiantes.map((est) => (
            <div key={est.id} className="flex items-center space-x-2">
              <Checkbox
                checked={selected.includes(est.id!.toString())}
                onCheckedChange={() => toggle(est.id!.toString())}
              />
              <label>{est.nombre}</label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
