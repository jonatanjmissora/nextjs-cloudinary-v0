import { CustomFile } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";
import { getFileIcon } from "@/lib/get-file-icon";
import { FileActions } from "./file-explorer-actions";

interface FileExplorerLineFilesProps {
    sortedFiles: CustomFile[]; 
    selectedFiles: Set<string>; 
    onFileSelect: (fileId: string, checked: boolean) => void; 
    currentFolderId: string; 
    onRenameFile: (file: CustomFile, folderId: string) => void
    onDeleteFile: (file: CustomFile, folderId: string) => void
  }
  
  export const FileExplorerLineFiles = ({ sortedFiles, selectedFiles, onFileSelect, currentFolderId, onRenameFile, onDeleteFile }: FileExplorerLineFilesProps ) => {
    return (
      <div className="space-y-4">
              {/* Barra de acciones para vista de lista */}
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium"></th>
                      <th className="text-left p-3 font-medium">Nombre</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Última modificación</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Tamaño</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFiles.map((file) => (
                      <tr
                        key={file.id}
                        className={`border-t border-border hover:bg-accent/50 group ${selectedFiles.has(file.id) ? "bg-accent/30" : ""
                          }`}
                      >
                        <td className="p-3">
                          <Checkbox
                            checked={selectedFiles.has(file.id)}
                            onCheckedChange={(checked) => onFileSelect(file.id, checked as boolean)}
                          />
                        </td>
                        <td className="p-3 flex items-center">
                          <div className="mr-3">{getFileIcon(file.type)}</div>
                          <span title={file.name}>{file.name}</span>
                        </td>
                        <td className="p-3 hidden md:table-cell text-muted-foreground">{file.lastModified}</td>
                        <td className="p-3 hidden md:table-cell text-muted-foreground">{file.size}</td>
                        <td className="p-3">
                          <FileActions
                            file={file}
                            folderId={currentFolderId}
                            onRenameFile={onRenameFile}
                            onDeleteFile={onDeleteFile}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
    )
  }