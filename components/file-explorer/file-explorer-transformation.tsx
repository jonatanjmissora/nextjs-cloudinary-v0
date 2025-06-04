import { DialogContent, Dialog } from "@radix-ui/react-dialog";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { CustomFile } from "@/lib/types";

interface TrasnformFileDialogProps {
    isOpen: boolean
    onOpenDialog: (open: boolean) => void
    fileToTransform: { file: CustomFile; folderId: string } | null
    onConfirm: () => void
}

export default function TrasnformFileDialog({isOpen, onOpenDialog, fileToTransform, onConfirm}: TrasnformFileDialogProps) {

    const [isBackgroundRemove, setIsBackgroundRemove] = useState<boolean>(false)
    const [isGrayscale, setIsGrayscale] = useState<boolean>(false)
    const [prompt, setprompt] = useState<string>("")
    if(!fileToTransform) return
    const file = fileToTransform.file

  return (
    <Dialog open={isOpen} onOpenChange={onOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Transformacion usando IA</span>
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium truncate">{file.name}</span>
            <CldImage
            key={file.id}
            src={file.id}
            alt={file.name}
            width="700"
            height="700"
            crop={{
              type: "auto",
              source: true
          }}
            className={"w-500 h-full"}
          />

          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenDialog(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Transformar
          </Button>
        </DialogFooter>
        HOLA {JSON.stringify(fileToTransform)}
      </DialogContent>
    </Dialog>
  )
}
