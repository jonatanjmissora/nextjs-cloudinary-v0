import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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