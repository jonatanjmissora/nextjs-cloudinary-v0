import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";
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
    const [prompt, setPrompt] = useState<string>("")

    useEffect(() => {
        setIsBackgroundRemove(false)
        setIsGrayscale(false)
        setPrompt("")
    }, [fileToTransform])

    if(!fileToTransform) {
        return null
    }
    const file = fileToTransform.file

  return (
    <Dialog open={isOpen} onOpenChange={onOpenDialog}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Transformacion usando IA
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-1 items-center pt-2">

            <span className="text-sm text-muted-foreground">{file.name}</span>

            <CloudinaryImage 
              file={file} 
              isBackgroundRemove={isBackgroundRemove} 
              isGrayscale={isGrayscale} 
              prompt={prompt}
            />
            
          </DialogDescription>
        </DialogHeader>

        <TransformMenu 
          isBackgroundRemove={isBackgroundRemove} 
          setIsBackgroundRemove={setIsBackgroundRemove} 
          isGrayscale={isGrayscale} 
          setIsGrayscale={setIsGrayscale} 
          prompt={prompt} 
          setPrompt={setPrompt}
          onOpenDialog={onOpenDialog}
          onConfirm={onConfirm}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenDialog(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Transformar
          </Button>
        </DialogFooter>

      </DialogContent>

    </Dialog>
  )
}

interface CloudinaryImageProps {
  file: CustomFile, 
  isBackgroundRemove: boolean, 
  isGrayscale: boolean, 
  prompt: string
}

const CloudinaryImage = ({file, isBackgroundRemove, isGrayscale, prompt}: CloudinaryImageProps) => {
  return (
    <CldImage
      key={file.id}
      src={file.id}
      alt={file.name}
      width="700"
      height="700"
      removeBackground={isBackgroundRemove}
      grayscale={isGrayscale}
      replaceBackground={prompt}
      crop={{
        type: "auto",
        source: true
      }}
      className={"w-[30dvw] h-full"}
    />
  )
}

interface TransformMenuProps {
  isBackgroundRemove: boolean, 
  setIsBackgroundRemove: (value: boolean) => void, 
  isGrayscale: boolean, 
  setIsGrayscale: (value: boolean) => void, 
  prompt: string, 
  setPrompt: (value: string) => void,
  onOpenDialog: (open: boolean) => void,
  onConfirm: () => void
}

const TransformMenu = ({isBackgroundRemove, setIsBackgroundRemove, isGrayscale, setIsGrayscale, prompt, setPrompt, onOpenDialog, onConfirm}: TransformMenuProps) => {
  return (
    <div className="flex flex-col" >
      <div className="flex flex-col justify-center items-center gap-3">

        <div className="flex gap-8">

          <div className="flex justify-center items-center gap-2">
              <input type="checkbox" id="background" name="background" 
                onChange={() => setIsBackgroundRemove(!isBackgroundRemove)}
                checked={isBackgroundRemove}/>
              <label htmlFor="background">no background</label>
          </div>

          <div className="flex justify-center items-center gap-2">
              <input type="checkbox" id="grayscale" name="grayscale" 
                onChange={() => setIsGrayscale(!isGrayscale)}
                checked={isGrayscale}/>
              <label htmlFor="grayscale">grayscale</label>
          </div>

        </div>

        <input value={prompt} placeholder="Start typing to change background" 
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full border rounded-md p-2"
        />

      </div>

    </div>
  )
}
