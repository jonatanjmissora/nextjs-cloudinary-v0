"use client"

import { useState } from "react"
import { Trash2, Home, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Folder, CustomFile } from "@/lib/types"
import { FileActions } from "./file-explorer-actions"
import { getFileIcon } from "@/lib/get-file-icon"
import { RenameFileDialog, DeleteFileDialog, BulkDeleteDialog } from "./file-explorer-dialog"
import FileExplorerBreadcrumb from "./file-explorer-breadcrumb"

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

  // Manejar copia de archivos seleccionados
  const handleCopySelectedFiles = () => {
    if (selectedFiles.size > 0) {
      // Aquí iría la lógica real de copia
      // Por ahora solo mostramos el toast
      toast({
        title: "Archivos copiados",
        description: `${selectedFiles.size} archivo${selectedFiles.size !== 1 ? "s" : ""} copiado${selectedFiles.size !== 1 ? "s" : ""} al portapapeles`,
        className: "bg-green-50 border-green-200 text-green-800",
      })

      console.log("Toast should appear now", selectedFiles.size);
    }
  }

  // Manejar eliminación masiva de archivos
  const handleBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true)
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

  // Seleccionar/deseleccionar todos los archivos
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allFileIds = new Set(sortedFiles.map((file) => file.id))
      setSelectedFiles(allFileIds)
    } else {
      setSelectedFiles(new Set())
    }
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

  const isAllSelected = sortedFiles.length > 0 && sortedFiles.every((file) => selectedFiles.has(file.id))
  const isIndeterminate = sortedFiles.some((file) => selectedFiles.has(file.id)) && !isAllSelected

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
            <div className="min-h-12 flex justify-between items-center space-x-2">
              <div>
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
                    className="hover:bg-green-100 hover:text-green-700"
                  >
                    <Copy size={16} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    title="Eliminar archivos seleccionados"
                    onClick={handleBulkDelete}
                    className="hover:bg-red-100 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors relative ${selectedFiles.has(file.id) ? "bg-accent/30 border-primary" : ""
                    }`}
                >
                  {/* Checkbox en la esquina superior izquierda */}
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedFiles.has(file.id)}
                      onCheckedChange={(checked) => handleFileSelect(file.id, checked as boolean)}
                      className="bg-background border-2"
                    />
                  </div>

                  <div className="flex justify-center mb-3 mt-4">{getFileIcon(file.type)}</div>
                  <div className="text-center">
                    <p className="font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.lastModified} · {file.size}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileActions
                      file={file}
                      folderId={currentFolder.id}
                      onRenameFile={handleRenameFile}
                      onDeleteFile={handleDeleteFile}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) 
        : (
          <div className="space-y-4">
            {/* Barra de acciones para vista de lista */}
            {selectedFiles.size > 0 && (
              <div className="flex justify-end items-center gap-4 py-2">
                <span className="text-sm text-muted-foreground">
                  ({selectedFiles.size}) seleccionado{selectedFiles.size !== 1 ? "s" : ""}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Copiar archivos seleccionados"
                  onClick={handleCopySelectedFiles}
                  className="hover:bg-green-100 hover:text-green-700"
                >
                  <Copy size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Eliminar archivos seleccionados"
                  onClick={handleBulkDelete}
                  className="hover:bg-red-100 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}

            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        indeterminate={isIndeterminate}
                      />
                    </th>
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


