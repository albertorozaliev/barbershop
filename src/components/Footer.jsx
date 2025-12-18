import {
  Scissors,
  Clock,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
} from "lucide-react"

const LINKS = [
  { label: "Главная", to: "#home" },
  { label: "О нас", to: "#about" },
  { label: "Наши работы", to: "#gallery" }, 
  { label: "Отзывы", to: "#reviews" },
]

export default function Footer() {
  const handleSmoothScroll = (e, target) => {
    e.preventDefault()
    const el = document.querySelector(target)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Scissors className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-semibold text-orange-500">Миза</span>
            </div>

            <p className="mt-6 max-w-sm text-gray-400 leading-relaxed">
              Стиль, традиции и качество каждого обслуживания.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <SocialIcon href="https://vk.com/barbermiza" label="VK">
                <VkIcon className="h-4 w-4" />
              </SocialIcon>

              <SocialIcon href="#" label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </SocialIcon>

              <SocialIcon href="https://t.me/miza_barbershop" label="Telegram">
                <Send className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

       
          <div>
            <h3 className="text-lg font-semibold text-white">График работы:</h3>

            <div className="mt-6 space-y-4 text-gray-400">
              <Row icon={<Clock className="h-4 w-4 text-orange-500" />}>
                <div>Ежедневно с 10:00 до 22:00</div>
              </Row>
            </div>
          </div>

     
          <div>
            <h3 className="text-lg font-semibold text-white">Контакты:</h3>

            <div className="mt-6 space-y-4 text-gray-400">
              <Row icon={<Phone className="h-4 w-4 text-orange-500" />}>
                <a
                  className="transition-colors hover:text-white"
                  href="tel:+79220051033"
                >
                  +7‒922‒005‒10‒33
                </a>
              </Row>

              <Row icon={<Mail className="h-4 w-4 text-orange-500" />}>
                <a
                  className="transition-colors hover:text-white"
                  href="mailto:barbermiza@gmail.com"
                >
                  barbermiza@gmail.com
                </a>
              </Row>

              <Row icon={<MapPin className="h-4 w-4 text-orange-500" />}>
                <a
                  className="transition-colors hover:text-white leading-relaxed"
                  href="https://2gis.ru/tyumen/firm/70000001068953942"
                  target="_blank"
                  rel="noreferrer"
                >
                  ​Полевая улица, 109 ст1​ 1 этаж
                  <br />
                  Дом обороны м-н, Калининский округ, Тюмень, 625001
                </a>
              </Row>
            </div>
          </div>

    
          <div>
            <h3 className="text-lg font-semibold text-white">Быстрые ссылки</h3>

            <ul className="mt-6 space-y-3 text-gray-400">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.to}
                    onClick={(e) => handleSmoothScroll(e, l.to)}
                    className="transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      
        <div className="mt-14 h-px w-full bg-orange-500/20" />

        <div className="py-10 text-center text-gray-400">
          © Миза
        </div>
      </div>
    </footer>
  )
}

function Row({ icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-full
        bg-white/5
        text-gray-400
        transition-colors
        hover:bg-orange-500
        hover:text-black
      "
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}

function VkIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.65 17.23h1.14s.34-.04.52-.22c.17-.17.17-.52.17-.52s-.03-1.6.72-1.84c.75-.24 1.7 1.55 2.72 2.23.77.51 1.35.4 1.35.4l2.72-.04s1.42-.09.75-1.2c-.05-.09-.4-.85-2.05-2.38-1.72-1.6-1.49-1.34.58-4.1 1.26-1.68 1.77-2.71 1.61-3.15-.15-.42-1.08-.31-1.08-.31l-3.06.02s-.23-.03-.4.07c-.17.1-.28.33-.28.33s-.48 1.29-1.12 2.39c-1.35 2.3-1.89 2.42-2.11 2.28-.52-.34-.39-1.36-.39-2.09 0-2.27.34-3.22-.67-3.46-.34-.08-.6-.13-1.49-.14-1.14-.01-2.11 0-2.66.27-.36.18-.64.57-.47.6.21.04.69.13.94.48.33.45.32 1.47.32 1.47s.19 2.67-.44 3c-.44.23-1.05-.24-2.35-2.32-.67-1.07-1.17-2.26-1.17-2.26s-.1-.22-.27-.34c-.2-.14-.48-.19-.48-.19l-2.91.02s-.44.01-.6.2c-.14.16-.01.5-.01.5s2.28 5.32 4.86 7.99c2.37 2.45 5.07 2.29 5.07 2.29z" />
    </svg>
  )
}
