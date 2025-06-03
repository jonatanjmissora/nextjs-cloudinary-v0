import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CloudinaryAsset } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface FoldersType {
  id: string;
  parentId: string | null;
  files: {
    id: string;
    name: string;
    type: string;
    size: number;
    lastModified: string;
    format: string;
    secureUrl: string;
    width: number;
    height: number;
  }[];
}

interface FolderStructure {
  [key: string]: Folder;
}

export function getInitialAssets(initialAssets: CloudinaryAsset[]): FolderStructure {
  const result: FolderStructure = {};
  const idCounter = new Map<string, number>();

  // First pass: create folder structure
  initialAssets.forEach((asset, index) => {
    const pathParts = asset.asset_folder.split('/');
    let currentPath = '';
    
    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (!result[currentPath]) {
        const parentId = pathParts.length > 1 
          ? result[pathParts.slice(0, -1).join('/')]?.id 
          : null;
          
        result[currentPath] = {
          id: (idCounter.get(currentPath) || 0).toString(),
          parentId,
          files: []
        };
        idCounter.set(currentPath, (idCounter.get(currentPath) || 0) + 1);
      }
    }
  });

  // Second pass: add files to folders
  initialAssets.forEach(asset => {
    const path = asset.asset_folder;
    result[path].files.push({
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
  });

  return result;
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

// const foldersInitial = [
//   {
//     asset_id: "01",
//     asset_folder: "my folder 1",
//     name: "my picture 1",
//     type: "image",
//     size: "1.2 MB",
//     lastModified: "Ayer",
//   },
//   {
//     asset_id: "02",
//     asset_folder: "my folder 1",
//     name: "my picture 2",
//     type: "image",
//     size: "1.4 MB",
//     lastModified: "Hoy",
//   },
//   {
//     asset_id: "03",
//     asset_folder: "my folder 2",
//     name: "my picture 3",
//     type: "image",
//     size: "1.3 MB",
//     lastModified: "Hoy",
//   },
//   {
//     asset_id: "04",
//     asset_folder: "my folder 2",
//     name: "my picture 4",
//     type: "image",
//     size: "1.0 MB",
//     lastModified: "Hoy",
//   },
//   {
//     asset_id: "05",
//     asset_folder: "my folder 2/my folder 3",
//     name: "my picture 5",
//     type: "image",
//     size: "1.8 MB",
//     lastModified: "Hoy",
//   },
//   {
//     asset_id: "06",
//     asset_folder: "my folder 2/my folder 3",
//     name: "my picture 6",
//     type: "image",
//     size: "1.9 MB",
//     lastModified: "Hoy",
//   },
//   {
//     asset_id: "07",
//     asset_folder: "my folder 1",
//     name: "my picture 7",
//     type: "image",
//     size: "1.1 MB",
//     lastModified: "Ayer",
//   },
//   {
//     asset_id: "08",
//     asset_folder: "my folder 2/my folder 3",
//     name: "my picture 8",
//     type: "image",
//     size: "1.0 MB",
//     lastModified: "Hoy",
//   },
//   {
//     asset_id: "09",
//     asset_folder: "my folder 2/my folder 3/my folder 4",
//     name: "my picture 9",
//     type: "image",
//     size: "1.0 MB",
//     lastModified: "Ayer",
//   },
// ]

// const foldersFinish = {
//   "my folder 1": {
//     id: "1",
//     parentId: null,
//     files: [
//       {
//         id: "01",
//         name: "my picture 1",
//         type: "image",
//         size: "1.2 MB",
//         lastModified: "Ayer",
//       },
//       {
//         id: "02",
//         name: "my picture 1",
//         type: "image",
//         size: "1.4 MB",
//         lastModified: "Hoy",
//       },
//       {
//         id: "07",
//         name: "my picture 7",
//         type: "image",
//         size: "1.1 MB",
//         lastModified: "Ayer",
//       },
//     ],
//   },
//   "my folder 2": {
//     id: "2",
//     parentId: null,
//     files: [
//       {
//         id: "03",
//         name: "my picture 3",
//         type: "image",
//         size: "1.3 MB",
//         lastModified: "Hoy",
//       },
//       {
//         id: "04",
//         name: "my picture 4",
//         type: "image",
//         size: "1.0 MB",
//         lastModified: "Hoy",
//       },
//     ],
//   },
//   "my folder 3": {
//     id: "3",
//     parentId: "2",
//     files: [
//       {
//         id: "05",
//         name: "my picture 5",
//         type: "image",
//         size: "1.8 MB",
//         lastModified: "Hoy",
//       },
//       {
//         id: "06",
//         name: "my picture 6",
//         type: "image",
//         size: "1.9 MB",
//         lastModified: "Hoy",
//       },
//       {
//         id: "08",
//         name: "my picture 8",
//         type: "image",
//         size: "1.0 MB",
//         lastModified: "Hoy",
//       },
//     ],
//   },
//   "my folder 4": {
//     id: "4",
//     parentId: "3",
//     files: [
//       {
//         id: "09",
//         name: "my picture 9",
//         type: "image",
//         size: "1.0 MB",
//         lastModified: "Ayer",
//       },
//     ],
//   },
// }



