import { ModeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MainHeader() {
  return (
    <header className="p-6 w-full flex justify-between items-center">
      <span className="text-xl font-bold tracking-wider">My Cloudinary</span>
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
