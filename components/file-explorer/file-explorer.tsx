"use client"

import { useState } from "react"
import { Home } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Folder, CustomFile } from "@/lib/types"
import { FileActions } from "./file-explorer-actions"
import { getFileIcon } from "@/lib/get-file-icon"
import { RenameFileDialog, DeleteFileDialog, BulkDeleteDialog } from "./file-explorer-dialog"
import FileExplorerBreadcrumb from "./file-explorer-breadcrumb"
import { FileExplorerFilesSelection } from "./file-explorer-files-selection"
import { FileExplorerGridFiles } from "./file-explorer-grid-files"

interface FileExplorerProps {
  folder: Folder | null
  searchQuery: string
  view: "grid" | "list"
  sortBy: "name" | "date" | "size"
  folders: Folder[]
  onSelectFolder: (folder: Folder) => void
  onFoldersUpdate: (folders: Folder[]) => void
}

export function FileExplorer({
  folder,
  searchQuery,
  view,
  sortBy,
  folders,
  onSelectFolder,
  onFoldersUpdate,
}: FileExplorerProps) {
  const [isRenameFileDialogOpen, setIsRenameFileDialogOpen] = useState(false)
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [fileToRename, setFileToRename] = useState<{ file: CustomFile; folderId: string } | null>(null)
  const [fileToDelete, setFileToDelete] = useState<{ file: CustomFile; folderId: string } | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Buscar la carpeta actual en la lista actualizada de carpetas
  const currentFolder = folder ? folders.find((f) => f.id === folder.id) || folder : null

  const handleRenameFile = (file: CustomFile, folderId: string) => {
    setFileToRename({ file, folderId })
    setNewFileName(file.name)
    setIsRenameFileDialogOpen(true)
  }

  const handleDeleteFile = (file: CustomFile, folderId: string) => {
    setFileToDelete({ file, folderId })
    setIsDeleteFileDialogOpen(true)
  }

  const handleSaveRename = () => {
    if (fileToRename && newFileName.trim()) {
      // Crear una copia actualizada de las carpetas
      const updatedFolders = folders.map((f) => {
        if (f.id === fileToRename.folderId) {
          return {
            ...f,
            files: f.files.map((file) => (file.id === fileToRename.file.id ? { ...file, name: newFileName } : file)),
          }
        }
        return f
      })

      // Actualizar el estado
      onFoldersUpdate(updatedFolders)
      setIsRenameFileDialogOpen(false)
    }
  }

  const handleConfirmDeleteFile = () => {
    if (fileToDelete) {
      // Crear una copia actualizada de las carpetas sin el archivo eliminado
      const updatedFolders = folders.map((f) => {
        if (f.id === fileToDelete.folderId) {
          return {
            ...f,
            files: f.files.filter((file) => file.id !== fileToDelete.file.id),
          }
        }
        return f
      })

      // Actualizar el estado
      onFoldersUpdate(updatedFolders)
      setIsDeleteFileDialogOpen(false)
      setFileToDelete(null)
    }
  }

  const handleConfirmBulkDelete = () => {
    if (currentFolder && selectedFiles.size > 0) {
      // Crear una copia actualizada de las carpetas sin los archivos eliminados
      const updatedFolders = folders.map((f) => {
        if (f.id === currentFolder.id) {
          return {
            ...f,
            files: f.files.filter((file) => !selectedFiles.has(file.id)),
          }
        }
        return f
      })

      // Actualizar el estado
      onFoldersUpdate(updatedFolders)
      setSelectedFiles(new Set()) // Limpiar selección
      setIsBulkDeleteDialogOpen(false)

      // Mostrar toast de confirmación
      toast({
        title: "Archivos eliminados",
        description: `${selectedFiles.size} archivo${selectedFiles.size !== 1 ? "s" : ""} eliminado${selectedFiles.size !== 1 ? "s" : ""} correctamente`,
        variant: "destructive",
      })
    }
  }

  // Manejar selección de archivos
  const handleFileSelect = (fileId: string, checked: boolean) => {
    const newSelectedFiles = new Set(selectedFiles)
    if (checked) {
      newSelectedFiles.add(fileId)
    } else {
      newSelectedFiles.delete(fileId)
    }
    setSelectedFiles(newSelectedFiles)
  }

  // Limpiar selección cuando cambie de carpeta
  const handleFolderChange = (folder: Folder) => {
    setSelectedFiles(new Set())
    onSelectFolder(folder)
  }

  if (!currentFolder) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Home size={16} />
            <span>Selecciona una carpeta para ver su contenido</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground">
          <p>Selecciona una carpeta para ver su contenido</p>
        </div>
      </div>
    )
  }

  // Filtrar archivos por búsqueda
  const filteredFiles = currentFolder.files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Ordenar archivos
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "size") {
      // Convertir tamaño a número para comparar (simplificado)
      const sizeA = Number.parseFloat(a.size.split(" ")[0]) || 0
      const sizeB = Number.parseFloat(b.size.split(" ")[0]) || 0
      return sizeB - sizeA
    } else {
      // Por fecha (simplificado)
      return a.lastModified.localeCompare(b.lastModified)
    }
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb */}
      <FileExplorerBreadcrumb
        folders={folders}
        currentFolder={currentFolder}
        handleFolderChange={handleFolderChange}
        sortedFiles={sortedFiles as unknown as File[]}
        searchQuery={searchQuery}
      />

      {/* Contenido de archivos */}
      <div className="flex-1 px-6 overflow-auto">
        {sortedFiles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              {searchQuery
                ? `No se encontraron archivos que coincidan con "${searchQuery}"`
                : "No hay archivos en esta carpeta"}
            </p>
          </div>
        ) 
        : view === "grid" 
          ? (
          <div className="space-y-4">
            {/* Checkbox para seleccionar todos en vista de cuadrícula */}
            <FileExplorerFilesSelection 
              sortedFiles={sortedFiles as unknown as CustomFile[]} 
              selectedFiles={selectedFiles} 
              setSelectedFiles={setSelectedFiles} 
              setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
            />

            <FileExplorerGridFiles 
              sortedFiles={sortedFiles} 
              selectedFiles={selectedFiles} 
              onFileSelect={handleFileSelect} 
              currentFolderId={currentFolder.id} 
              onRenameFile={handleRenameFile}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        ) 
        : (
          <div className="space-y-4">
            {/* Barra de acciones para vista de lista */}
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium"></th>
                    <th className="text-left p-3 font-medium">Nombre</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Última modificación</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Tamaño</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className={`border-t border-border hover:bg-accent/50 group ${selectedFiles.has(file.id) ? "bg-accent/30" : ""
                        }`}
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={selectedFiles.has(file.id)}
                          onCheckedChange={(checked) => handleFileSelect(file.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-3 flex items-center">
                        <div className="mr-3">{getFileIcon(file.type)}</div>
                        <span title={file.name}>{file.name}</span>
                      </td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{file.lastModified}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{file.size}</td>
                      <td className="p-3">
                        <FileActions
                          file={file}
                          folderId={currentFolder.id}
                          onRenameFile={handleRenameFile}
                          onDeleteFile={handleDeleteFile}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Diálogos */}
      <RenameFileDialog
        isOpen={isRenameFileDialogOpen}
        onOpenChange={setIsRenameFileDialogOpen}
        fileToRename={fileToRename}
        newFileName={newFileName}
        onNewFileNameChange={setNewFileName}
        onSave={handleSaveRename}
      />

      <DeleteFileDialog
        isOpen={isDeleteFileDialogOpen}
        onOpenChange={setIsDeleteFileDialogOpen}
        fileToDelete={fileToDelete}
        onConfirm={handleConfirmDeleteFile}
      />

      <BulkDeleteDialog
        isOpen={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        selectedFilesCount={selectedFiles.size}
        onConfirm={handleConfirmBulkDelete}
      />
    </div>
  )
}

