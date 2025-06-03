export interface CustomFile {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: string;
  format: string;
  secureUrl: string;
  width: number;
  height: number;
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  files: CustomFile[]
}

interface AccessKeyInfo {
  access_key: string
}

export interface CloudinaryAsset {
  asset_id: string
  public_id: string
  asset_folder: string
  filename: string
  display_name: string
  format: string
  version: number
  resource_type: string
  type: string
  created_at: string
  uploaded_at: string
  bytes: number
  backup_bytes: number
  width: number
  height: number
  aspect_ratio: number
  pixels: number
  url: string
  secure_url: string
  status: string
  access_mode: string
  access_control: null
  etag: string
  created_by: AccessKeyInfo
  uploaded_by: AccessKeyInfo
}