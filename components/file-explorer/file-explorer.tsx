"use client"

import { useState } from "react"
import { Home } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import type { Folder, CustomFile, CloudinaryAsset } from "@/lib/types"
import { RenameFileDialog, DeleteFileDialog, BulkDeleteDialog } from "./file-explorer-dialog"
import FileExplorerBreadcrumb from "./file-explorer-breadcrumb"
import { FileExplorerFilesSelection } from "./file-explorer-files-selection"
import { FileExplorerGridFiles } from "./file-explorer-grid-files"
import { FileExplorerLineFiles } from "./file-explorer-line-files"
import TrasnformFileDialog from "./file-explorer-transformation"
import { CldImage } from "next-cloudinary"
import { setFileDate, setFileSize } from "@/lib/utils"

interface FileExplorerProps {
  folder: Folder | null
  searchQuery: string
  view: "grid" | "list"
  sortBy: "name" | "date" | "size"
  folders: Folder[]
  onSelectFolder: (folder: Folder) => void
  onFoldersUpdate: (folders: Folder[]) => void
  assets: CloudinaryAsset[] | null
}

export function FileExplorer({
  folder,
  searchQuery,
  view,
  sortBy,
  folders,
  onSelectFolder,
  onFoldersUpdate,
  assets,
}: FileExplorerProps) {
  const [isRenameFileDialogOpen, setIsRenameFileDialogOpen] = useState(false)
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isTransformFileDialogOpen, setIsTransformFileDialogOpen] = useState(false)
  const [fileToRename, setFileToRename] = useState<{ file: CustomFile; folderId: string } | null>(null)
  const [fileToDelete, setFileToDelete] = useState<{ file: CustomFile; folderId: string } | null>(null)
  const [fileToTransform, setFileToTransform] = useState<{ file: CustomFile; folderId: string } | null>(null)
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

  const handleConfirmTransform = () => {
    
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
    return <ShowAllAssets assets={assets} handleFolderChange={handleFolderChange} folders={folders}/>
  }

  // Filtrar archivos por búsqueda
  const filteredFiles = currentFolder.files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Ordenar archivos
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "size") {
      return b.size - a.size; // Direct numeric comparison
    } else { // Assuming sortBy === "date"
      // Robust date sorting (newest first)
      const dateA = new Date(a.lastModified).getTime();
      const dateB = new Date(b.lastModified).getTime();
      // Handle cases where date might be invalid (e.g., "Ahora")
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1; // Put invalid dates at the end (ascending sort for errors)
      if (isNaN(dateB)) return -1; // Put invalid dates at the end (ascending sort for errors)
      return dateB - dateA; // Sort descending (newest first)
    }
  });

  const handleTransformFile = (file: CustomFile, folderId: string) => {
    setFileToTransform({ file, folderId })
    setIsTransformFileDialogOpen(true)
  }

 
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb */}
      <FileExplorerBreadcrumb
        folders={folders}
        currentFolder={currentFolder}
        handleFolderChange={handleFolderChange}
        sortedFiles={sortedFiles}
        searchQuery={searchQuery}
      />

      {/* Contenido de archivos */}
      <div className="flex-1 px-6 overflow-auto">

        {sortedFiles.length === 0 
            /* No hay archivos */
          ? <div className="text-center py-12 text-muted-foreground">
              <p>
                {searchQuery
                  ? `No se encontraron archivos que coincidan con "${searchQuery}"`
                  : "No hay archivos en esta carpeta"}
              </p>
            </div>

          : <div className="space-y-4">
              {/* Seleccion de archivos */}
              <FileExplorerFilesSelection 
                sortedFiles={sortedFiles} 
                selectedFiles={selectedFiles} 
                setSelectedFiles={setSelectedFiles} 
                setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
              />

              {
                view === "grid" 

                  /* Contenido de archivos en Grilla */
                  ? <FileExplorerGridFiles 
                      sortedFiles={sortedFiles} 
                      selectedFiles={selectedFiles} 
                      onFileSelect={handleFileSelect} 
                      currentFolderId={currentFolder.id} 
                      onRenameFile={handleRenameFile}
                      onDeleteFile={handleDeleteFile}
                      onTransformFile={handleTransformFile}
                    />

                    /* Contenido de archivos en linea */
                  : <FileExplorerLineFiles 
                      sortedFiles={sortedFiles} 
                      selectedFiles={selectedFiles} 
                      onFileSelect={handleFileSelect} 
                      currentFolderId={currentFolder.id} 
                      onRenameFile={handleRenameFile}
                      onDeleteFile={handleDeleteFile}
                      onTransformFile={handleTransformFile}
                    />
              }
            </div>
        }
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

      <TrasnformFileDialog 
        isOpen={isTransformFileDialogOpen}
        onOpenDialog={setIsTransformFileDialogOpen}
        fileToTransform={fileToTransform}
        onConfirm={handleConfirmTransform}
      />

    </div>
  )
}

const ShowAllAssets = ({assets, handleFolderChange, folders}: {assets: CloudinaryAsset[] | null, handleFolderChange: (folder: Folder) => void, folders: Folder[]}) => {

  const handleFileSelect = (folderName: string) => {
    const folder = folders.find((f) => f.name === folderName)
    console.log(folder)
    if (folder) {
      handleFolderChange(folder)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Home size={16} />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-auto px-4">
      {assets?.map((asset) => (
        <div
          key={asset.public_id}
          onClick={() => handleFileSelect(asset.asset_folder)}
          className={`group border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors relative}`}
        >
          
          <div className="text-center px-4 w-full">
            <p className="font-medium truncate" title={asset.filename}>
              {asset.display_name}
            </p>
          </div>

          <CldImage
            key={asset.public_id}
            src={asset.public_id}
            alt={asset.filename}
            width="500"
            height="500"
            crop={{
              type: "auto",
              source: true
          }}
            className={""}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground py-1">
            <span>
              {setFileDate(asset.uploaded_at)}
            </span>
            <span>{setFileSize(asset.bytes)}</span>
          </div>
          
        </div>
      ))}
    </div>
    </div>
  )
}