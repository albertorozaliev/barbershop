import { Users, Star, Scissors } from "lucide-react"
import img1 from "../assets/about-1.jpg"
import img2 from "../assets/about-2.jpg"
import img3 from "../assets/about-3.jpg"
import img4 from "../assets/about-4.jpg"

export default function About() {
  return (
    <section id="about" className="bg-neutral-900 text-white px-6 py-28">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        {/* LEFT */}
        <div>
          <p className="mb-4 text-sm font-semibold tracking-[0.35em] text-orange-500">
            О НАС
          </p>

          <h2 className="mb-8 text-3xl font-semibold leading-tight md:text-4xl">
            Лучший опыт современной барберской культуры
          </h2>

          <div className="space-y-6 text-gray-300 leading-relaxed max-w-xl">
            <p>
              В нашем барбершопе мы объединяем проверенные временем традиции мужского ухода с современными техниками и актуальными трендами. Для нас барберинг — это не просто стрижка или оформление бороды, а искусство, в котором важна каждая деталь.
            </p>
            <p>
              Наша команда профессиональных барберов работает с вниманием к стилю, характеру и образу каждого гостя. Мы создаём атмосферу комфорта и уверенности, где можно расслабиться, довериться мастеру и выйти с ощущением обновлённого образа и внутренней силы.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-10 max-w-lg">
            <Stat
  icon={<Scissors className="h-7 w-7" />}
  value="6"
  suffix="+"
  label="Лет опыта"
/>
            <Stat
              icon={<Users className="h-7 w-7" />}
              value="3000"
              suffix="+"
              label="Клиентов"
            />
            <Stat
  icon={<Star className="h-7 w-7" />}
  value="4.9"
  suffix="/5"
  label="Оценка"
/>
          </div>
        </div>

      
        <div className="lg:justify-self-end">
          <div className="grid grid-cols-2 gap-6 lg:gap-7">
          
            <div className="flex flex-col gap-6 lg:gap-7">
                <ImageCard className="h-44 lg:h-52" src={img1} />
                <ImageCard className="h-64 lg:h-80" src={img2} />
            </div>
            <div className="flex flex-col gap-6 lg:gap-7 translate-y-8 lg:translate-y-12">
                <ImageCard className="h-64 lg:h-80" src={img4} />
                <ImageCard className="h-44 lg:h-52" src={img3} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, value, suffix, label }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full text-orange-500">
        {icon}
      </div>
      <div className="text-xl font-semibold text-white">
        {value}
        <span className="text-orange-500">{suffix}</span>
      </div>
      <div className="mt-1 text-sm text-gray-400">{label}</div>
    </div>
  )
}

function ImageCard({ src, className = "" }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl",
        "shadow-[0_22px_55px_rgba(0,0,0,0.45)]",
        className,
      ].join(" ")}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  )
}

