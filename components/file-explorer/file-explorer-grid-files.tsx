import { CustomFile } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";
import { getFileIcon } from "@/lib/get-file-icon";
import { FileActions } from "./file-explorer-actions";

interface FileExplorerGridFilesProps {
    sortedFiles: CustomFile[]; 
    selectedFiles: Set<string>; 
    onFileSelect: (fileId: string, checked: boolean) => void; 
    currentFolderId: string; 
    onRenameFile: (file: CustomFile, folderId: string) => void
    onDeleteFile: (file: CustomFile, folderId: string) => void
  }
  
  export const FileExplorerGridFiles = ({sortedFiles, selectedFiles, onFileSelect, currentFolderId, onRenameFile, onDeleteFile}: FileExplorerGridFilesProps) => {

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
            {/* Checkbox en la esquina superior izquierda */}
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedFiles.has(file.id)}
                // onCheckedChange={(checked) => onFileSelect(file.id, checked as boolean)}
                className="bg-background border-2"
              />
            </div>

            <div className="flex justify-center mb-3 mt-4">{getFileIcon(file.type)}</div>
            <div className="text-center">
              <p className="font-medium truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {file.lastModified} · {file.size}
              </p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <FileActions
                file={file}
                folderId={currentFolderId}
                onRenameFile={onRenameFile}
                onDeleteFile={onDeleteFile}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }