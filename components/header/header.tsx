"use client"

import { useRef, type ChangeEvent } from "react"
import { Search, User, Upload, Grid, List, SortAsc, Calendar, HardDrive } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/header/header-mode-toggle"
import type { Folder, File } from "@/lib/types"

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
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return "pdf"
      case "doc":
      case "docx":
        return "word"
      case "xls":
      case "xlsx":
        return "excel"
      case "ppt":
      case "pptx":
        return "powerpoint"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return "image"
      case "mp4":
      case "avi":
      case "mov":
        return "video"
      case "mp3":
      case "wav":
        return "audio"
      case "zip":
      case "rar":
      case "7z":
        return "archive"
      case "js":
      case "ts":
      case "css":
      case "html":
      case "json":
      case "sql":
        return "code"
      case "txt":
        return "text"
      case "fig":
      case "sketch":
      case "ase":
        return "design"
      case "ttf":
      case "otf":
      case "woff":
        return "font"
      default:
        return "file"
    }
  }

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedFolder) return

    const newFiles: File[] = Array.from(files).map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: getFileType(file.name),
      size: formatFileSize(file.size),
      lastModified: "Ahora",
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
        <div className="flex items-center space-x-3">
          {/* Barra de búsqueda más pequeña */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar en Drive"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Botón de subir archivos con texto */}
          <Button
            variant="outline"
            onClick={handleUploadClick}
            disabled={!selectedFolder}
            title={!selectedFolder ? "Selecciona una carpeta primero" : "Subir archivo"}
            className="flex items-center space-x-2"
          >
            <Upload size={18} />
            <span>Subir archivos</span>
          </Button>

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
