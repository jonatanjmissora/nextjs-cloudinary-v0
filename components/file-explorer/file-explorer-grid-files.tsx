import { CustomFile } from "@/lib/types";
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
  
  export const FileExplorerGridFiles = ({
    sortedFiles, 
    selectedFiles, 
    onFileSelect, 
    currentFolderId, 
    onRenameFile, 
    onDeleteFile, 
    onTransformFile}: 
    FileExplorerGridFilesProps) => {

    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {sortedFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => onFileSelect(file.id, !selectedFiles.has(file.id))}
            className={`group border border-border rounded-lg p-4 hover:border-primary/50 transition-colors relative ${selectedFiles.has(file.id) 
              && "bg-primary/20 border-primary/70"}`}
          >
            
            <ImageCardHeader 
              file={file} 
              currentFolderId={currentFolderId} 
              onRenameFile={onRenameFile} 
              onDeleteFile={onDeleteFile} 
              onTransformFile={onTransformFile}
            />

            <div className="overflow-hidden">
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
              className={"group-hover:scale-110 transition-transform duration-300"}
            />
            </div>
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
    file: CustomFile;
    currentFolderId: string; 
    onRenameFile: (file: CustomFile, folderId: string) => void
    onDeleteFile: (file: CustomFile, folderId: string) => void
    onTransformFile: (file: CustomFile, folderId: string) => void
  }

  const ImageCardHeader = ({file, currentFolderId, onRenameFile, onDeleteFile, onTransformFile}: ImageCardHeaderProps) => {
    return (
      <div className="flex justify-between items-center border">
          
          {/* nombre de la imagen */}
          <p className="font-medium truncate" title={file.name}>
            {file.name}
          </p>

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