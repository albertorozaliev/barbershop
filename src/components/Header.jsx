import { useState } from 'react'
import logo from "../assets/logo.png"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const element = document.querySelector(targetId)
    if (element) {
      const headerHeight = 100 // Высота фиксированного header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false)
  }

  // Ссылки навигации
  const navLinks = [
    { id: 'about', label: 'О нас' },
    { id: 'price', label: 'Стоимость' },
    { id: 'gallery', label: 'Стрижки' },
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur border-b border-orange-500/20">
      <div className="w-full mx-auto px-8 lg:px-16 py-6 flex items-center justify-between">
        
        {/* ЛОГО */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Barbershop logo"
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold text-orange-500">
            BARBER
          </span>
        </div>

        {/* ДЕСКТОПНАЯ НАВИГАЦИЯ */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleSmoothScroll(e, `#${link.id}`)}
              className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}

          {/* КНОПКА ЗАПИСИ */}
          <a
            href="#booking"
            onClick={(e) => handleSmoothScroll(e, '#booking')}
            className="ml-4 px-6 py-2 rounded-md bg-orange-500 text-black font-semibold hover:bg-orange-600 hover:text-white transition-all duration-200 animate-pulse-subtle"
          >
            Записаться
          </a>
        </nav>

        {/* БУРГЕР-КНОПКА (МОБИЛЬНАЯ) */}
        <button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-2"
  aria-label="Меню"
>
  {/* Верхняя линия */}
  <span
    className={`block w-8 h-[3px] bg-orange-500 rounded transition-transform duration-300 ease-in-out
      ${isMenuOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'}`}
  />
  
  {/* Средняя линия */}
  <span
    className={`block w-8 h-[3px] bg-orange-500 rounded transition-opacity duration-300 ease-in-out
      ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
  />
  
  {/* Нижняя линия */}
  <span
    className={`block w-8 h-[3px] bg-orange-500 rounded transition-transform duration-300 ease-in-out
      ${isMenuOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'}`}
  />
</button>



      </div>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      <div
        className={`md:hidden fixed left-0 w-full bg-black/95 backdrop-blur border-b border-orange-500/20 overflow-hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          top: '88px',
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out',
          maxHeight: isMenuOpen ? '500px' : '0px',
        }}
      >
        <nav className="flex flex-col px-6 py-4 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleSmoothScroll(e, `#${link.id}`)}
              className="text-gray-300 hover:text-orange-500 transition-colors duration-200 py-2 text-lg"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={(e) => handleSmoothScroll(e, '#booking')}
            className="mt-2 px-6 py-3 rounded-md bg-orange-500 text-black font-semibold hover:bg-orange-600 hover:text-white transition-all duration-200 text-center animate-pulse-subtle"
          >
            Записаться
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
