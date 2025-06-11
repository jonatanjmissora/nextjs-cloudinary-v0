"use client"

import { CldUploadWidget } from "next-cloudinary"

import { useRef, type ChangeEvent } from "react"
import { Search, Upload, Grid, List, SortAsc, Calendar, HardDrive, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Folder, CustomFile, CloudinaryAsset } from "@/lib/types"
import { getFileType } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onHandleNewUpload: (asset: CloudinaryAsset) => void
}

export function Header({
  searchQuery,
  onSearchChange,
  onHandleNewUpload,
}: HeaderProps) {
  // const fileInputRef = useRef<HTMLInputElement>(null)

  // const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
  //   console.log("selectedFolder", selectedFolder)
    // const files = event.target.files
    // if (!files || !selectedFolder) return

    // const newFiles: CustomFile[] = Array.from(files).map((file) => ({
    //   id: `file-${Date.now()}-${Math.random()}`,
    //   name: file.name,
    //   type: getFileType(file.name),
    //   size: file.size,
    //   lastModified: "Ahora",
    //   format: file.name.split('.').pop()?.toLowerCase() || '',
    //   secureUrl: '', 
    //   width: 0, 
    //   height: 0,
    // }))

    // // Actualizar la carpeta seleccionada con los nuevos archivos
    // const updatedFolders = folders.map((folder) => {
    //   if (folder.id === selectedFolder.id) {
    //     return {
    //       ...folder,
    //       files: [...folder.files, ...newFiles],
    //     }
    //   }
    //   return folder
    // })

    // // Actualizar el estado
    // onFoldersUpdate(updatedFolders)

    // // Limpiar el input
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = ""
    // }
  // }
  // const handleUploadClick = () => {
  //   if (selectedFolder && fileInputRef.current) {
  //     fileInputRef.current.click()
  //   }
  // }

  return (
    <article className="p-4 dashboard-header">
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
            <span className={`absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer ${searchQuery ? "block" : "hidden"}`}>
              <X size={16} onClick={() => onSearchChange('')}/>
            </span>
          </div>

          {/* Botón de subir archivos con texto */}
          <UploadButton onHandleNewUpload={onHandleNewUpload}/>
            
        </div>
      </div>
    </article>
  )
}

const UploadButton = ({onHandleNewUpload}: {onHandleNewUpload: (asset: CloudinaryAsset) => void}) => {
  return (
    <CldUploadWidget
      uploadPreset="my-cloudinary"
      onSuccess={result => {
          console.log(result.info)
          // onHandleNewUpload(result.info)
      }}
      onQueuesEnd={(_, { widget}) => {
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