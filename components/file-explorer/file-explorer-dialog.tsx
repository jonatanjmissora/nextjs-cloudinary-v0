"use client"

import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CustomFile } from "@/lib/types"

interface RenameFileDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  fileToRename: { file: CustomFile; folderId: string } | null
  newFileName: string
  onNewFileNameChange: (name: string) => void
  onSave: () => void
}

export function RenameFileDialog({
  isOpen,
  onOpenChange,
  fileToRename,
  newFileName,
  onNewFileNameChange,
  onSave,
}: RenameFileDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renombrar archivo</DialogTitle>
        </DialogHeader>
        <Input
          value={newFileName}
          onChange={(e) => onNewFileNameChange(e.target.value)}
          placeholder="Nuevo nombre"
          autoFocus
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteFileDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  fileToDelete: { file: CustomFile; folderId: string } | null
  onConfirm: () => void
}

export function DeleteFileDialog({
  isOpen,
  onOpenChange,
  fileToDelete,
  onConfirm,
}: DeleteFileDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface BulkDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedFilesCount: number
  onConfirm: () => void
}

export function BulkDeleteDialog({
  isOpen,
  onOpenChange,
  selectedFilesCount,
  onConfirm,
}: BulkDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar eliminación masiva
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar <strong>{selectedFilesCount}</strong> archivo
            {selectedFilesCount !== 1 ? "s" : ""} seleccionado{selectedFilesCount !== 1 ? "s" : ""}?
            <br />
            <br />
            <span className="text-sm text-muted-foreground">
              <strong>Esta acción no se puede deshacer.</strong>
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar {selectedFilesCount} archivo{selectedFilesCount !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 