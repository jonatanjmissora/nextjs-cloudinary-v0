import { Folder, CustomFile } from "@/lib/types";
import { Calendar, ChevronRight, Grid, HardDrive, List, SortAsc } from "lucide-react";
import { Button } from "../ui/button";

interface FileExplorerBreadcrumbProps {
  folders: Folder[]
  currentFolder: Folder
  handleFolderChange: (folder: Folder) => void
  sortedFiles: CustomFile[]
  searchQuery: string
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
  sortBy: "name" | "date" | "size"
  onSortChange: (sortBy: "name" | "date" | "size") => void
}

export default function FileExplorerBreadcrumb({
  folders,
  currentFolder,
  handleFolderChange,
  sortedFiles,
  searchQuery,
  view,
  onViewChange,
  sortBy,
  onSortChange
}: FileExplorerBreadcrumbProps) {

 // Función para construir la ruta de breadcrumb
  const buildBreadcrumbPath = (currentFolder: Folder | null): Folder[] => {
    if (!currentFolder) return []

    const path: Folder[] = []
    let current: Folder | null = currentFolder
    let safetyCounter = 0 // Evitar bucles infinitos
    const maxDepth = 20

    while (current && safetyCounter < maxDepth) {
      path.unshift(current)
      const parentId: string | null = current.parentId
      if (parentId) {
        const parentFolder: Folder | undefined = folders.find((f) => f.id === parentId)
        current = parentFolder || null
      } else {
        current = null
      }
      safetyCounter++
    }

    return path
  }

  const breadcrumbPath = buildBreadcrumbPath(currentFolder)

  return (
    <div className="px-4 flex justify-between items-center dashboard-breadcrumb">
        <div className="flex items-center text-sm">
        {breadcrumbPath.map((pathFolder, index) => (
            <div key={pathFolder.id} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-muted-foreground" />
            <button
                onClick={() => handleFolderChange(pathFolder)}
                className={`hover:text-primary transition-colors ${index === breadcrumbPath.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
                {pathFolder.name}
            </button>
            </div>
        ))}
        </div>

        <ViewsAndOrder view={view} onViewChange={onViewChange} sortBy={sortBy} onSortChange={onSortChange}/>

        <div className="flex items-center space-x-4">
        <div className="text-xs text-muted-foreground">
            {sortedFiles.length} {sortedFiles.length === 1 ? "archivo" : "archivos"}
            {searchQuery &&
            ` (filtrado de ${currentFolder.files.length} total${currentFolder.files.length !== 1 ? "es" : ""})`}
        </div>
        </div>
    </div>
  )
}


const ViewsAndOrder = ({view, onViewChange, sortBy, onSortChange}: {view: "grid" | "list"; onViewChange: (view: "grid" | "list") => void; sortBy: "name" | "date" | "size"; onSortChange: (sortBy: "name" | "date" | "size") => void}) => {
  return (
    <div className="flex items-center justify-center gap-40">
        {/* Botones de vista - solo iconos */}
        <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">vista</span>
          <Button
            variant="ghost"
            className={`bg-background ${view === "grid" ? "text-primary" : "text-muted-foreground"}`}
            size="icon"
            onClick={() => onViewChange("grid")}
            title="Grilla"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant="ghost"
            className={`bg-background ${view === "list" ? "text-primary" : "text-muted-foreground"}`}
            size="icon"
            onClick={() => onViewChange("list")}
            title="Lista"
          >
            <List size={16} />
          </Button>
        </div>

        {/* Botones de ordenamiento - iconos */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">orden</span>
          <Button
            variant="ghost"
            className={`bg-background ${sortBy === "name" ? "text-primary" : "text-muted-foreground"}`}
            size="icon"
            onClick={() => onSortChange("name")}
            title="Nombre"
          >
            <SortAsc size={16} />
          </Button>
          <Button
            variant="ghost"
            className={`bg-background ${sortBy === "date" ? "text-primary" : "text-muted-foreground"}`}
            size="icon"
            onClick={() => onSortChange("date")}
            title="Fecha"
          >
            <Calendar size={16} />
          </Button>
          <Button
            variant="ghost"
            className={`bg-background ${sortBy === "size" ? "text-primary" : "text-muted-foreground"}`}
            size="icon"
            onClick={() => onSortChange("size")}
            title="Tamaño"
          >
            <HardDrive size={16} />
          </Button>
        </div>
      </div>
  )
}