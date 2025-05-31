"use client"

import { useState } from "react"
import { FileIcon, FileText, FileImage, FileIcon as FilePresentation, MoreVertical, Download, Trash2, Share2, Info, ChevronRight, Home, Pencil, Play, Music, Archive, Code, Type, Palette, AlertTriangle, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { Folder, File } from "@/types"

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
  const [fileToRename, setFileToRename] = useState<{ file: File; folderId: string } | null>(null)
  const [fileToDelete, setFileToDelete] = useState<{ file: File; folderId: string } | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Buscar la carpeta actual en la lista actualizada de carpetas
  const currentFolder = folder ? folders.find((f) => f.id === folder.id) || folder : null

  // Función para construir la ruta de breadcrumb
  const buildBreadcrumbPath = (currentFolder: Folder | null): Folder[] => {
    if (!currentFolder) return []

    const path: Folder[] = []
    let current = currentFolder
    let safetyCounter = 0 // Evitar bucles infinitos
    const maxDepth = 20

    while (current && safetyCounter < maxDepth) {
      path.unshift(current)
      if (current.parentId) {
        const parentFolder = folders.find((f) => f.id === current.parentId)
        current = parentFolder || null
      } else {
        current = null
      }
      safetyCounter++
    }

    return path
  }

  const breadcrumbPath = buildBreadcrumbPath(currentFolder)

  const handleRenameFile = (file: File, folderId: string) => {
    setFileToRename({ file, folderId })
    setNewFileName(file.name)
    setIsRenameFileDialogOpen(true)
  }

  const handleDeleteFile = (file: File, folderId: string) => {
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />
      case "word":
        return <FileText className="h-10 w-10 text-blue-600" />
      case "excel":
        return <FileText className="h-10 w-10 text-green-600" />
      case "powerpoint":
        return <FilePresentation className="h-10 w-10 text-orange-500" />
      case "image":
        return <FileImage className="h-10 w-10 text-purple-500" />
      case "video":
        return <Play className="h-10 w-10 text-red-600" />
      case "audio":
        return <Music className="h-10 w-10 text-pink-500" />
      case "archive":
        return <Archive className="h-10 w-10 text-yellow-600" />
      case "code":
        return <Code className="h-10 w-10 text-green-500" />
      case "text":
        return <Type className="h-10 w-10 text-gray-500" />
      case "design":
        return <Palette className="h-10 w-10 text-indigo-500" />
      case "font":
        return <Type className="h-10 w-10 text-purple-600" />
      default:
        return <FileIcon className="h-10 w-10 text-gray-400" />
    }
  }

  const isAllSelected = sortedFiles.length > 0 && sortedFiles.every((file) => selectedFiles.has(file.id))
  const isIndeterminate = sortedFiles.some((file) => selectedFiles.has(file.id)) && !isAllSelected

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbPath.map((pathFolder, index) => (
            <div key={pathFolder.id} className="flex items-center space-x-2">
              <ChevronRight size={14} className="text-muted-foreground" />
              <button
                onClick={() => handleFolderChange(pathFolder)}
                className={`hover:text-primary transition-colors ${
                  index === breadcrumbPath.length - 1
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
        ) : view === "grid" ? (
          <div className="space-y-4">
            {/* Checkbox para seleccionar todos en vista de cuadrícula */}
            <div className="min-h-12 flex justify-between items-center space-x-2">
              <div>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(ref) => {
                    if (ref) ref.indeterminate = isIndeterminate
                  }}
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
                  className={`group border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors relative ${
                    selectedFiles.has(file.id) ? "bg-accent/30 border-primary" : ""
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
        ) : (
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
                        ref={(ref) => {
                          if (ref) ref.indeterminate = isIndeterminate
                        }}
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
                      className={`border-t border-border hover:bg-accent/50 group ${
                        selectedFiles.has(file.id) ? "bg-accent/30" : ""
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

      {/* Diálogo para renombrar archivo */}
      <Dialog open={isRenameFileDialogOpen} onOpenChange={setIsRenameFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar archivo</DialogTitle>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Nuevo nombre"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameFileDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRename}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar archivo individual */}
      <Dialog open={isDeleteFileDialogOpen} onOpenChange={setIsDeleteFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              {fileToDelete && (
                <>
                  ¿Estás seguro de que quieres eliminar el archivo <strong>"{fileToDelete.file.name}"</strong>?
                  <br />
                  <br />
                  <span className="text-sm text-muted-foreground">
                    <strong>Esta acción no se puede deshacer.</strong>
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteFileDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteFile}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminación masiva */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar eliminación masiva
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar <strong>{selectedFiles.size}</strong> archivo
              {selectedFiles.size !== 1 ? "s" : ""} seleccionado{selectedFiles.size !== 1 ? "s" : ""}?
              <br />
              <br />
              <span className="text-sm text-muted-foreground">
                <strong>Esta acción no se puede deshacer.</strong>
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmBulkDelete}>
              Eliminar {selectedFiles.size} archivo{selectedFiles.size !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface FileActionsProps {
  file: File
  folderId: string
  onRenameFile: (file: File, folderId: string) => void
  onDeleteFile: (file: File, folderId: string) => void
}

function FileActions({ file, folderId, onRenameFile, onDeleteFile }: FileActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical size={16} />
          <span className="sr-only">Acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRenameFile(file, folderId)}>
          <Pencil size={14} className="mr-2" />
          <span>Renombrar</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download size={14} className="mr-2" />
          <span>Descargar</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 size={14} className="mr-2" />
          <span>Compartir</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Info size={14} className="mr-2" />
          <span>Detalles</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDeleteFile(file, folderId)}
        >
          <Trash2 size={14} className="mr-2" />
          <span>Eliminar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
