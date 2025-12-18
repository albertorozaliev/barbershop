import fone2 from "../assets/fone2.jpg"

import g1 from "../assets/gallery/g1.jpg"
import g2 from "../assets/gallery/g2.jpg"
import g3 from "../assets/gallery/g3.jpg"
import g4 from "../assets/gallery/g4.jpg"
import g5 from "../assets/gallery/g5.jpg"
import g6 from "../assets/gallery/g6.jpg"

export default function Gallery() {
  const items = [
    { title: "Детская стрижка", src: g1 },
    { title: "Отец + Сын", src: g2 },
    { title: "Стрижка", src: g3 },
    { title: "Моделирование бороды", src: g4 },
    { title: "Стрижка", src: g5 },
    { title: "Стрижка машинкой", src: g6 },
  ]

  return (
    <section
      id="gallery"
      className="relative px-6 py-28 text-white"
    >
      {/* фон */}
      <img
        src={fone2}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* затемнение */}
      <div className="absolute inset-0 bg-black/70" />

   
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Наши работы
          </h2>
          <p className="mt-4 text-gray-300">
            Посмотрите некоторые из наших лучших работ и атмосферу барбершопа
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <GalleryCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryCard({ title, src }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl transition-transform duration-300 hover:scale-[1.04]">
      {/* картинка */}
      <img
        src={src}
        alt={title}
        className="h-full w-full object-cover aspect-[4/3]"
      />

      {/* затемнение снизу */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* текст по центру */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-white text-lg font-semibold">
          {title}
        </span>
      </div>
    </div>
  )
}
