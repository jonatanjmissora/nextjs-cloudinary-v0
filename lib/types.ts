export interface CustomFile {
  id: string
  name: string
  type: string
  size: string
  lastModified: string
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  files: CustomFile[]
}
