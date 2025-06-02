"use client"

import { useState, useCallback, useEffect } from "react"
import { FolderStructure } from "@/components/folder-structure/folder-structure"
import { Header } from "@/components/header/header"
import { FileExplorer } from "@/components/file-explorer/file-explorer"
import type { Folder } from "@/lib/types"
import { initialFolders } from "@/lib/mock-folders"
import MainHeader from "./main-header"
import { MainFooter } from "./main-footer"



export function Dashboard() {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name")
  const [folders, setFolders] = useState<Folder[]>(initialFolders)

  const [assets, setAssets] = useState<any[]>([])
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
    (folder: Folder) => {
      // Verificar que la carpeta existe en el estado actual
      const folderExists = folders.some((f) => f.id === folder.id)
      if (folderExists) {
        setSelectedFolder(folder)
      }
    },
    [folders],
  )

  const onHandleNewUpload = (asset: any) => {
    setAssets(prev => [asset, ...prev])
  }

  const getData = async() => {
    try {
      const res = await fetch(`/api/assets?${searchTerm}`)
      const data = await res.json()
      setAssets(data)
      setError("")
    } catch (error) {
      console.log(error.message)
      setError(error.message)
      setAssets([])
    }
    finally{
      setLoading(false)
    }
  }

  useEffect( () => {
    getData()
  }, [searchTerm])


  return (
    <div className="flex flex-col h-screen bg-background">
      <MainHeader />
      <div className="flex-1 flex">
        <FolderStructure
          onSelectFolder={handleSelectFolder}
          selectedFolder={selectedFolder}
          onFoldersUpdate={handleFoldersUpdate}
          folders={folders}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            view={view}
            onViewChange={setView}
            sortBy={sortBy}
            onSortChange={setSortBy}
            folders={folders}
            selectedFolder={selectedFolder}
            onFoldersUpdate={handleFoldersUpdate}
            onHandleNewUpload={onHandleNewUpload}
          />
          {
            loading 
              ? <p>Loading...</p> 
              
              : error 
                  ? <p>Error: {error}</p>
                
                  :
                  // <FileExplorer
                  //   folder={selectedFolder}
                  //   searchQuery={searchQuery}
                  //   view={view}
                  //   sortBy={sortBy}
                  //   folders={folders}
                  //   onSelectFolder={handleSelectFolder}
                  //   onFoldersUpdate={handleFoldersUpdate}
                  // />
                  <p>{JSON.stringify(assets)}</p>
          }
        </div>
      </div>
      <MainFooter />
    </div>
  )
}