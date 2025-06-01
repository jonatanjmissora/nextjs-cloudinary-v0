import { Folder } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface FileExplorerBreadcrumbProps {
  folders: Folder[]
  currentFolder: Folder
  handleFolderChange: (folder: Folder) => void
  sortedFiles: File[]
  searchQuery: string
}

export default function FileExplorerBreadcrumb({
  folders,
  currentFolder,
  handleFolderChange,
  sortedFiles,
  searchQuery,
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
    <>
        {/* Breadcrumb */}
        <div className="p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm">
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
            <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground">
                {sortedFiles.length} {sortedFiles.length === 1 ? "archivo" : "archivos"}
                {searchQuery &&
                ` (filtrado de ${currentFolder.files.length} total${currentFolder.files.length !== 1 ? "es" : ""})`}
            </div>
            </div>
        </div>
    </>
  )
}
