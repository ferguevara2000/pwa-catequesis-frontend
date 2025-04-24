// DeleteAlertDialog.tsx
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogTrigger,
    AlertDialogCancel,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog"
  import { Trash2, AlertCircle } from "lucide-react"
  import { Button } from "@/components/ui/button"
  
  export default function DeleteAlertDialog({
    onConfirm,
  }: {
    onConfirm: () => void
  }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" className="hover:bg-muted transition-colors cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
  
        <AlertDialogContent className="bg-white dark:bg-black border border-muted rounded-lg shadow-xl text-neutral-900 dark:text-neutral-100">
          <AlertDialogHeader className="flex flex-col items-center space-y-2 text-center">
            <AlertCircle className="w-10 h-10 text-neutral-800 dark:text-neutral-100" />
            <AlertDialogTitle className="text-xl font-semibold">
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-neutral-600 dark:text-neutral-300">
              Esta acción eliminará el usuario permanentemente. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
  
          <AlertDialogFooter className="flex justify-center gap-4 mt-4">
            <AlertDialogCancel className="border border-neutral-400 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="border border-neutral-800 bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  