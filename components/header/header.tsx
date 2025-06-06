"use client"

import { CldUploadWidget } from "next-cloudinary"

import { useRef, type ChangeEvent } from "react"
import { Search, Upload, Grid, List, SortAsc, Calendar, HardDrive } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Folder, CustomFile } from "@/lib/types"
import { getFileType } from "@/lib/utils"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
  sortBy: "name" | "date" | "size"
  onSortChange: (sort: "name" | "date" | "size") => void
  folders: Folder[]
  selectedFolder: Folder | null
  onFoldersUpdate: (folders: Folder[]) => void
  onHandleNewUpload: any
}

export function Header({
  searchQuery,
  onSearchChange,
  view,
  onViewChange,
  sortBy,
  onSortChange,
  folders,
  selectedFolder,
  onFoldersUpdate,
  onHandleNewUpload,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedFolder) return

    const newFiles: CustomFile[] = Array.from(files).map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: getFileType(file.name),
      size: file.size,
      lastModified: "Ahora",
      format: file.name.split('.').pop()?.toLowerCase() || '',
      secureUrl: '', 
      width: 0, 
      height: 0,
    }))

    // Actualizar la carpeta seleccionada con los nuevos archivos
    const updatedFolders = folders.map((folder) => {
      if (folder.id === selectedFolder.id) {
        return {
          ...folder,
          files: [...folder.files, ...newFiles],
        }
      }
      return folder
    })

    // Actualizar el estado
    onFoldersUpdate(updatedFolders)

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    if (selectedFolder && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <header className="border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center space-x-3 w-full">
          {/* Barra de búsqueda */}
          <div className="relative w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar en Drive"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Botón de subir archivos con texto */}
          <UploadButton onHandleNewUpload={onHandleNewUpload}/>

          {/* Input oculto para seleccionar archivos */}
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} accept="*/*" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        {/* Botones de vista - solo iconos */}
        <div className="flex items-center space-x-2">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewChange("grid")}
            title="Vista de cuadrícula"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewChange("list")}
            title="Vista de lista"
          >
            <List size={16} />
          </Button>
        </div>

        {/* Botones de ordenamiento - iconos */}
        <div className="flex items-center space-x-2">
          <Button
            variant={sortBy === "name" ? "default" : "ghost"}
            size="icon"
            onClick={() => onSortChange("name")}
            title="Ordenar por nombre"
          >
            <SortAsc size={16} />
          </Button>
          <Button
            variant={sortBy === "date" ? "default" : "ghost"}
            size="icon"
            onClick={() => onSortChange("date")}
            title="Ordenar por fecha"
          >
            <Calendar size={16} />
          </Button>
          <Button
            variant={sortBy === "size" ? "default" : "ghost"}
            size="icon"
            onClick={() => onSortChange("size")}
            title="Ordenar por tamaño"
          >
            <HardDrive size={16} />
          </Button>
        </div>
      </div>
    </header>
  )
}


const UploadButton = ({onHandleNewUpload, selectedFolder}: any) => {
  return (
    <CldUploadWidget
      uploadPreset="my-cloudinary"
      onSuccess={result => {
          console.log(result)
          onHandleNewUpload(result.info)
      }}
      onQueuesEnd={(result, { widget}) => {
          widget.close()
      }}
      >
      {({ open }) => {
          function handleOnClick() {
              open()
          }
          return (
            <Button
            variant="outline"
            onClick={handleOnClick}
            title={!selectedFolder ? "Selecciona una carpeta primero" : "Subir archivo"}
            className="flex items-center space-x-2"
          >
            <Upload size={18} />
            <span>Subir archivos</span>
          </Button>
          )
      }}
  </CldUploadWidget>
  )
}