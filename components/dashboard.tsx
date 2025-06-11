"use client"

import { useState, useCallback, useEffect } from "react"
import { FileExplorer } from "@/components/file-explorer/file-explorer"
import type { CloudinaryAsset, Folder } from "@/lib/types"
import MainHeader from "./main-header"
import { MainFooter } from "./main-footer"
import { getInitialAssets } from "@/lib/utils"
import { FolderStructure } from "./folder-structure/folder-structure"
import { Skeleton } from "./ui/skeleton"

export function Dashboard() {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name")
  const [folders, setFolders] = useState<Folder[]>([])

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  // Usar useCallback para evitar recreaciones innecesarias de la función
  const handleFoldersUpdate = useCallback(
    (updatedFolders: Folder[]) => {
      setFolders(updatedFolders)

      // Si la carpeta seleccionada fue eliminada, deseleccionarla
      if (selectedFolder && !updatedFolders.some((folder) => folder.id === selectedFolder.id)) {
        setSelectedFolder(null)
      }
    },
    [selectedFolder],
  )

  // Manejar la selección de carpeta de forma segura
  const handleSelectFolder = useCallback(
    (folder: Folder | null) => {
      if (folder) {
        // Verificar que la carpeta existe en el estado actual
        const folderExists = folders.some((f) => f.id === folder.id)
        if (folderExists) {
          setSelectedFolder(folder)
        }
      } else {
        setSelectedFolder(null)
      }
    },
    [folders],
  )

  const onHandleNewUpload = (asset: CloudinaryAsset) => {
    // setAssets(prev => (prev ? [asset, ...prev] : [asset]))
  }

  const getData = async() => {
    try {
      console.log("obteniendo datos de Cloudinary...")
      const res = await fetch(`/api/assets?${searchTerm}`)
      const initialAssets = await res.json()
      const folders = getInitialAssets(initialAssets)
      setFolders(folders)
      setError("")
      console.log("datos de Cloudinary recibidos")
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : String(error))
      setError("No se pudo leer de Cloudinary")
    }
    finally{
      setLoading(false)
    }
  }

  useEffect( () => {
    getData()
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background">
      <MainHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onHandleNewUpload={onHandleNewUpload}
            />
      <main className="flex-1 flex">
        <FolderStructure
          onSelectFolder={handleSelectFolder}
          selectedFolder={selectedFolder}
          onFoldersUpdate={handleFoldersUpdate}
          folders={folders}
        />
        <div className="flex flex-col">

          <FileExplorerHeader />

          {
            loading 
              ? <SkeltonFiles />
              
              : error 
                  ? <div className="w-full h-full flex justify-center mt-12 text-bold text-xl"><p>Error: {error}</p></div>
                
                  :
                  <FileExplorer
                    folder={selectedFolder}
                    searchQuery={searchQuery}
                    view={view}
                    onViewChange={setView}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    folders={folders}
                    onSelectFolder={handleSelectFolder}
                    onFoldersUpdate={handleFoldersUpdate}
                  />
          }
        </div>
      </main>
      <MainFooter />
    </div>
  )
}


const FileExplorerHeader = () => {
  return(
    <></>
  )
}


const SkeltonFiles = () => {

    return (
      <div className="p-4 dashboard-file-explorer">

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          
          {
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="w-full h-[23rem] sm:h-[16rem] 2xl:h-[23rem] p-4 pt-14 pb-10 border border-border rounded-lg">

              <Skeleton
                className="w-full h-full rounded-none"
              >
                
              </Skeleton>
                </div>
            ))
          }
          </div>

      </div>
    )
}