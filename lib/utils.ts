import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CloudinaryAsset, Folder } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitialAssets(initialAssets: CloudinaryAsset[]): Folder[] {
  const folderMap: Record<string, Folder> = {};
  const folderIds = new Map<string, number>();
  let nextId = 1;

  // First pass: create folder structure with proper IDs
  initialAssets.forEach((asset) => {
    const pathParts = asset.asset_folder.split('/');
    let currentPath = '';
    
    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (!folderMap[currentPath]) {
        // Get parent folder ID
        const parentId = pathParts.length > 1 
          ? folderIds.get(pathParts.slice(0, -1).join('/'))
          : null;

        // Get folder name (last part of path)
        const folderName = part;
        
        // Create folder entry
        folderMap[currentPath] = {
          name: folderName,
          id: nextId.toString(),
          parentId: parentId?.toString() || null,
          files: []
        };
        
        // Store folder ID for future reference
        folderIds.set(currentPath, nextId);
        
        // Increment ID for next folder
        nextId++;
      }
    }
  });

  // Second pass: add files to folders
  initialAssets.forEach(asset => {
    const path = asset.asset_folder;
    const folder = folderMap[path];
    if (folder) {
      folder.files.push({
        id: asset.public_id,
        name: asset.display_name,
        type: asset.resource_type,
        size: asset.bytes,
        lastModified: asset.uploaded_at,
        format: asset.format,
        secureUrl: asset.secure_url,
        width: asset.width,
        height: asset.height,
      });
    }
  });

  // Clean up folder names by removing parent paths from subfolder names
  const cleanedFolders: Record<string, Folder> = {};
  Object.entries(folderMap).forEach(([folderPath, folder]) => {
    const pathParts = folderPath.split('/');
    if (pathParts.length > 1) {
      const folderName = pathParts[pathParts.length - 1];
      cleanedFolders[folderName] = folder;
    } else {
      cleanedFolders[folderPath] = folder;
    }
  });

  // Convert to array and return
  const sortedFolderArray = Object.values(cleanedFolders).sort((a, b) => a.name.localeCompare(b.name))
  return sortedFolderArray
}


export const getFileType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
      return "pdf"
    case "doc":
    case "docx":
      return "word"
    case "xls":
    case "xlsx":
      return "excel"
    case "ppt":
    case "pptx":
      return "powerpoint"
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
      return "image"
    case "mp4":
    case "avi":
    case "mov":
      return "video"
    case "mp3":
    case "wav":
      return "audio"
    case "zip":
    case "rar":
    case "7z":
      return "archive"
    case "js":
    case "ts":
    case "css":
    case "html":
    case "json":
    case "sql":
      return "code"
    case "txt":
      return "text"
    case "fig":
    case "sketch":
    case "ase":
      return "design"
    case "ttf":
    case "otf":
    case "woff":
      return "font"
    default:
      return "file"
  }
}

export const setFileDate = (date: string) => {
  const newDate = new Date(date);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(newDate);
};

export const setFileSize = (bits: number, decimalPlaces = 1) => {
  if (bits < 0) {
    return "Invalid input";
  }
  const bytes = bits / 8;
  const kilobytes = bytes / (1024 );
  if(kilobytes >= 1024) return (kilobytes/1024).toFixed(decimalPlaces) + " MB";
  return kilobytes.toFixed(decimalPlaces) + " KB";
}