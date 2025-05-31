
export const MainFooter = () => {

  const year = new Date().getFullYear()

  return (
    <footer className="p-4 w-full flex justify-end items-center gap-4 text-xs font font-semibold tracking-wider">
      <a href="https://jonatan-missora.vercel.app/" target="_blank">
        KatoDev {year}
      </a>
    </footer>
  )
}
