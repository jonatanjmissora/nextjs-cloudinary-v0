import { FileText, FileIcon as FilePresentation, FileImage, Play, Music, Archive, Code, Type, Palette, FileIcon } from "lucide-react"

export const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />
      case "word":
        return <FileText className="h-10 w-10 text-blue-600" />
      case "excel":
        return <FileText className="h-10 w-10 text-green-600" />
      case "powerpoint":
        return <FilePresentation className="h-10 w-10 text-orange-500" />
      case "image":
        return <FileImage className="h-10 w-10 text-purple-500" />
      case "video":
        return <Play className="h-10 w-10 text-red-600" />
      case "audio":
        return <Music className="h-10 w-10 text-pink-500" />
      case "archive":
        return <Archive className="h-10 w-10 text-yellow-600" />
      case "code":
        return <Code className="h-10 w-10 text-green-500" />
      case "text":
        return <Type className="h-10 w-10 text-gray-500" />
      case "design":
        return <Palette className="h-10 w-10 text-indigo-500" />
      case "font":
        return <Type className="h-10 w-10 text-purple-600" />
      default:
        return <FileIcon className="h-10 w-10 text-gray-400" />
    }
  }