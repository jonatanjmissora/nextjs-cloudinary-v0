import { CustomFile } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "../ui/button";
import { Copy, Trash2 } from "lucide-react";

interface FileExplorerFilesSelectionProps {
    sortedFiles: CustomFile[]; 
    selectedFiles: Set<string>; 
    setSelectedFiles: (files: Set<string>) => void; 
    setIsBulkDeleteDialogOpen: (open: boolean) => void;
  }
  
  export const FileExplorerFilesSelection = ({sortedFiles, selectedFiles, setSelectedFiles, setIsBulkDeleteDialogOpen}: FileExplorerFilesSelectionProps) => {
  
    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        const allFileIds = new Set(sortedFiles.map((file) => file.id))
        setSelectedFiles(allFileIds)
      } else {
        setSelectedFiles(new Set())
      }
    }
  
    const handleCopySelectedFiles = () => {
      if (selectedFiles.size > 0) {
        // Aquí iría la lógica real de copia
        // Por ahora solo mostramos el toast
        toast({
          title: "Archivos copiados",
          description: `${selectedFiles.size} archivo${selectedFiles.size !== 1 ? "s" : ""} copiado${selectedFiles.size !== 1 ? "s" : ""} al portapapeles`,
          className: "bg-green-800 text-white",
        })
  
        // console.log("Toast should appear now", selectedFiles.size);
      }
    }
  
    const handleBulkDelete = () => {
      setIsBulkDeleteDialogOpen(true)
    }
  
    const isAllSelected = sortedFiles.length > 0 && sortedFiles.every((file) => selectedFiles.has(file.id))
    const isIndeterminate = sortedFiles.some((file) => selectedFiles.has(file.id)) && !isAllSelected
  
  
    return (
      <div className="min-h-8 flex justify-between items-center px-4 dashboard-file-selection">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              indeterminate={isIndeterminate}
            />
  
            <span className="pl-2 text-sm text-muted-foreground">todos</span>
  
            {selectedFiles.size > 0 && (
              <span className="pl-10 text-sm text-muted-foreground">
                ({selectedFiles.size}) seleccionado
                {selectedFiles.size !== 1 ? "s" : ""}
              </span>
            )}
          </div>
  
          {selectedFiles.size > 0 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                title="Copiar archivos seleccionados"
                onClick={handleCopySelectedFiles}
                className="hover:text-green-700 h-8"
              >
                <Copy size={14} />
              </Button>
  
              <Button
                variant="ghost"
                size="icon"
                title="Eliminar archivos seleccionados"
                onClick={handleBulkDelete}
                className="hover:text-red-700 h-8"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>
    )
  }