import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Download, Trash2, Share2, Info, Pencil } from 'lucide-react'
import type { CustomFile } from "@/lib/types"

interface FileActionsProps {
    file: CustomFile
    folderId: string
    onRenameFile: (file: CustomFile, folderId: string) => void
    onDeleteFile: (file: CustomFile, folderId: string) => void
  }
  
  export function FileActions({ file, folderId, onRenameFile, onDeleteFile }: FileActionsProps) {
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