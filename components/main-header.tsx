import { ModeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { LogOut, Search, Settings, Upload, User, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CloudinaryAsset } from "@/lib/types"
import { Input } from "./ui/input"
import { CldUploadWidget } from "next-cloudinary"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onHandleNewUpload: (asset: CloudinaryAsset) => void
}

export default function MainHeader({
  searchQuery,
  onSearchChange,
  onHandleNewUpload,
}: HeaderProps) {
  return (
    <header className="p-6 w-full flex justify-between items-center">

      <span className="text-xl font-bold tracking-wider">My Cloudinary</span>

      <HeaderCenter 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onHandleNewUpload={onHandleNewUpload}
        />

      <div className="flex justify-center items-center gap-8">
        
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full border">
              <User className="size-12" strokeWidth={3} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between gap-4">
              <span>Perfil</span>
              <User className="mr-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between gap-4">
              <span>Configuración</span>
              <LogOut className="mr-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between gap-4">
              <span>Cerrar sesión</span>
              <Settings className="mr-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onHandleNewUpload: (asset: CloudinaryAsset) => void
}

const HeaderCenter = ({
  searchQuery,
  onSearchChange,
  onHandleNewUpload,
}: HeaderProps) => {
  return (
      <article className="p-4 dashboard-header w-1/2">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center space-x-3 w-full">
            {/* Barra de búsqueda */}
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar en Drive"
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <span className={`absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer ${searchQuery ? "block" : "hidden"}`}>
                <X size={16} onClick={() => onSearchChange('')}/>
              </span>
            </div>
  
            {/* Botón de subir archivos con texto */}
            <UploadButton onHandleNewUpload={onHandleNewUpload}/>
              
          </div>
        </div>
      </article>
    )
  }
  
  const UploadButton = ({onHandleNewUpload}: {onHandleNewUpload: (asset: CloudinaryAsset) => void}) => {
    return (
      <CldUploadWidget
        uploadPreset="my-cloudinary"
        onSuccess={result => {
            console.log(result.info)
            // onHandleNewUpload(result.info)
        }}
        onQueuesEnd={(_, { widget}) => {
            widget.close()
        }}
        >
        {({ open }) => {
            function handleOnClick() {
                open()
            }
            return (
  
                <Button
                  variant="outline"
                  onClick={handleOnClick}
                  className="flex items-center space-x-2"
                  >
                    <Upload size={18} />
                    <span>Subir archivos</span>
                </Button>
            )
        }}
    </CldUploadWidget>
    )
  }