"use client"

import { useState, useCallback } from "react"
import { FolderStructure } from "@/components/folder-structure/folder-structure"
import { Header } from "@/components/header/header"
import { FileExplorer } from "@/components/file-explorer/file-explorer"
import type { Folder } from "@/lib/types"
import { initialFolders } from "@/lib/mock-folders"
import { ModeToggle } from "./header/header-mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



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

const MainHeader = () => {
  return (
    <header className="p-6 w-full flex justify-between items-center">
      <span className="text-xl font-bold tracking-wider">My Cloudinary</span>
      <div className="flex justify-center items-center gap-8">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full border">
              <User className="size-12" strokeWidth={3} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between gap-4">
              <span>Perfil</span>
              <User className="mr-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between gap-4">
              <span>Configuración</span>
              <LogOut className="mr-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between gap-4">
              <span>Cerrar sesión</span>
              <Settings className="mr-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

const MainFooter = () => {

  const year = new Date().getFullYear()

  return (
    <footer className="p-4 w-full flex justify-end items-center gap-4 text-xs font font-semibold tracking-wider">
      <a href="https://jonatan-missora.vercel.app/" target="_blank">
        KatoDev {year}
      </a>
    </footer>
  )
}