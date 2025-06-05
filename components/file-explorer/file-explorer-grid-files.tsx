import { CustomFile } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";
import { FileActions } from "./file-explorer-actions";
import { CldImage } from "next-cloudinary";
import { setFileDate, setFileSize } from "@/lib/utils";

interface FileExplorerGridFilesProps {
    sortedFiles: CustomFile[]; 
    selectedFiles: Set<string>; 
    onFileSelect: (fileId: string, checked: boolean) => void; 
    currentFolderId: string; 
    onRenameFile: (file: CustomFile, folderId: string) => void
    onDeleteFile: (file: CustomFile, folderId: string) => void
    onTransformFile: (file: CustomFile, folderId: string) => void
  }
  
  export const FileExplorerGridFiles = ({sortedFiles, selectedFiles, onFileSelect, currentFolderId, onRenameFile, onDeleteFile, onTransformFile}: FileExplorerGridFilesProps) => {

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => onFileSelect(file.id, !selectedFiles.has(file.id))}
            className={`group border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors relative ${selectedFiles.has(file.id) 
              ? "bg-accent/30" 
              : ""
              }`}
          >
            
            <ImageCardHeader 
              selectedFiles={selectedFiles} 
              file={file} 
              currentFolderId={currentFolderId} 
              onRenameFile={onRenameFile} 
              onDeleteFile={onDeleteFile} 
              onTransformFile={onTransformFile}
            />

            <CldImage
              key={file.id}
              src={file.id}
              alt={file.name}
              width="500"
              height="500"
              crop={{
                type: "auto",
                source: true
            }}
              className={""}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground py-1">
              <span>
                {setFileDate(file.lastModified)}
              </span>
              <span>{setFileSize(file.size)}</span>
            </div>
            
          </div>
        ))}
      </div>
    )
  }

  interface ImageCardHeaderProps {
    selectedFiles: Set<string>; 
    file: CustomFile;
    currentFolderId: string; 
    onRenameFile: (file: CustomFile, folderId: string) => void
    onDeleteFile: (file: CustomFile, folderId: string) => void
    onTransformFile: (file: CustomFile, folderId: string) => void
  }

  const ImageCardHeader = ({selectedFiles, file, currentFolderId, onRenameFile, onDeleteFile, onTransformFile}: ImageCardHeaderProps) => {
    return (
      <div className="flex justify-between items-center">
        {/* Checkbox en la esquina superior izquierda */}
          <div className="flex justify-center items-center">
            <Checkbox
              checked={selectedFiles.has(file.id)}
              className="bg-background border-2"
            />
          </div>

          {/* nombre de la imagen */}
          <div className="text-center px-1 w-3/4">
            <p className="font-medium truncate" title={file.name}>
              {file.name}
            </p>
          </div>

          {/* menu de accion para la imagen */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FileActions
              file={file}
              folderId={currentFolderId}
              onRenameFile={onRenameFile}
              onDeleteFile={onDeleteFile}
              onTransformFile={onTransformFile}
            />
          </div>
      </div>
    )
  }