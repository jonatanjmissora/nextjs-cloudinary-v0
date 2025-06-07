import { CustomFile } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";
import { FileActions } from "./file-explorer-actions";
import { CldImage } from "next-cloudinary";
import { setFileDate, setFileSize } from "@/lib/utils";

interface FileExplorerLineFilesProps {
    sortedFiles: CustomFile[]; 
    selectedFiles: Set<string>; 
    onFileSelect: (fileId: string, checked: boolean) => void; 
    currentFolderId: string; 
    onRenameFile: (file: CustomFile, folderId: string) => void
    onDeleteFile: (file: CustomFile, folderId: string) => void
    onTransformFile: (file: CustomFile, folderId: string) => void
  }
  
  export const FileExplorerLineFiles = ({ sortedFiles, selectedFiles, onFileSelect, currentFolderId, onRenameFile, onDeleteFile, onTransformFile }: FileExplorerLineFilesProps ) => {
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
                        onClick={() => onFileSelect(file.id, !selectedFiles.has(file.id))}
                        className={`border-t border-border hover:bg-accent/50 group ${selectedFiles.has(file.id) ? "bg-accent/30" : ""
                          }`}
                      >
                        <td className="px-4">
                          <Checkbox
                            checked={selectedFiles.has(file.id)}
                            // onCheckedChange={(checked) => onFileSelect(file.id, checked as boolean)}
                          />
                        </td>
                        <td className="p-3 flex items-center">
                        <CldImage
                          key={file.id}
                          src={file.id}
                          alt={file.name}
                          width="50"
                          height="50"
                          crop={{
                            type: "auto",
                            source: true
                        }}
                          className={"mx-4"}
                        />
                          <span title={file.name}>{file.name}</span>
                        </td>
                        <td className="p-3 hidden md:table-cell text-muted-foreground">{setFileDate(file.lastModified)}</td>
                        <td className="p-3 hidden md:table-cell text-muted-foreground">{setFileSize(file.size)}</td>
                        <td className="p-3">
                          <FileActions
                            file={file}
                            folderId={currentFolderId}
                            onRenameFile={onRenameFile}
                            onDeleteFile={onDeleteFile}
                            onTransformFile={ onTransformFile}
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