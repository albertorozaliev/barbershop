import mainFone from '../assets/mainFone.mp4'

export default function Hero() {
  return (
    <section id="home" className="relative h-[calc(100vh-96px)] overflow-hidden">
      {/* Видео фон */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        src={mainFone}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Затемнение */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center">
          <h1 className="mb-8 text-4xl md:text-6xl font-extrabold text-white tracking-wide">
            Мужские стрижки<br />и стиль
          </h1>

          <a
  href="https://dikidi.ru/997256?p=1.pi-po"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-14 py-6 text-lg font-semibold text-black transition-all duration-300 hover:bg-orange-400 hover:text-white hover:-translate-y-1 hover:shadow-2xl"
>
  Записаться
</a>




        </div>
      </div>
    </section>
    
  )
}
