"use client"

import { useState, useCallback } from "react"
import { FolderStructure } from "@/components/folder-structure/folder-structure"
import { Header } from "@/components/header/header"
import { FileExplorer } from "@/components/file-explorer/file-explorer"
import type { Folder } from "@/lib/types"
import { initialFolders } from "@/lib/mock-folders"
import MainHeader from "./main-header"
import { MainFooter } from "./mani-footer"

export function Dashboard() {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name")
  const [folders, setFolders] = useState<Folder[]>(initialFolders)

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
          />
          <FileExplorer
            folder={selectedFolder}
            searchQuery={searchQuery}
            view={view}
            sortBy={sortBy}
            folders={folders}
            onSelectFolder={handleSelectFolder}
            onFoldersUpdate={handleFoldersUpdate}
          />
        </div>
      </div>
      <MainFooter />
    </div>
  )
}