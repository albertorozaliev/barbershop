import { useEffect, useState } from "react"
import logo from "../assets/logo.png"
import logomain from "../assets/logomain.png"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О нас" },
    { id: "gallery", label: "Наши работы" },
    { id: "reviews", label: "Отзывы" },
  ]


const handleSmoothScroll = (e, id) => {
  e.preventDefault()
  document.querySelector(`#${id}`)?.scrollIntoView({
    behavior: "smooth",
  })
  setIsMenuOpen(false)
}


  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-orange-500/20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* ЛОГО */}
        <a
  href="#home"
  onClick={(e) => handleSmoothScroll(e, "home")}
  className="flex items-center justify-center gap-4"
>
  <img src={logo} alt="Barbershop logo" className="w-14 h-14" />
  <img src={logomain} alt="Barbershop logomain" className="w-28 h-14" />
</a>


        {/* ДЕСКТОПНАЯ НАВИГАЦИЯ */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleSmoothScroll(e, link.id)}
              className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}

         <a
  href="https://dikidi.ru/997256?p=1.pi-po"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-12 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-orange-400 hover:text-white hover:-translate-y-0.5 hover:shadow-xl"
>
  Записаться
</a>


        </nav>

        {/* БУРГЕР */}
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-2"
          aria-label="Меню"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block w-8 h-[3px] bg-orange-500 rounded transition-transform duration-300 ease-in-out
              ${isMenuOpen ? "rotate-45 translate-y-2" : "rotate-0 translate-y-0"}`}
          />
          <span
            className={`block w-8 h-[3px] bg-orange-500 rounded transition-opacity duration-300 ease-in-out
              ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`block w-8 h-[3px] bg-orange-500 rounded transition-transform duration-300 ease-in-out
              ${isMenuOpen ? "-rotate-45 -translate-y-2" : "rotate-0 translate-y-0"}`}
          />
        </button>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      <div
        className={`md:hidden overflow-hidden border-b border-orange-500/20 bg-black/95 backdrop-blur transition-all duration-300 ${
          isMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto w-full max-w-7xl px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleSmoothScroll(e, link.id)}
              className="text-gray-300 hover:text-orange-500 transition-colors duration-200 py-2 text-lg"
            >
              {link.label}
            </a>
          ))}

          <a
  href="https://dikidi.ru/997256?p=1.pi-po"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-12 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-orange-400 hover:text-white hover:-translate-y-0.5 hover:shadow-xl"
>
  Записаться
</a>


        </nav>
      </div>
    </header>
  )
}


export default Header
