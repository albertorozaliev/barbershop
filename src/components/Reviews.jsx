const reviews = [
  {
    name: "Алексей Стафеев",
    rating: 5,
    text:
      "Отличное место ! Стригусь не в первый раз у ребят! Александр отличный мастер, профессионал своего дела! Однозначно рекомендую ! Процветания вам и удачи вашем деле!",
    link: "https://2gis.ru/tyumen/user/9514d668c12d4aacb834df7f6e8dfd39",
  },
  {
    name: "Никита Тендитник",
    rating: 5,
    text:
      "Стригусь у мастера Александра уже почти год, но с сыном пришел первый раз. Был приятно удивлен подходом к капризному мальчику четырех лет. Стрижки получились замечательно, время в ожидании стрижек друг друга прошло незаметно для обоих. Обязательно придем еще.",
    link: "https://2gis.ru/tyumen/user/5efa8e8c58884c819a41f1262ca5cac8",
  },
  {
    name: "Артем Чистяков",
    rating: 5,
    text:
      "Хочу выразить Владу, свою искреннюю благодарность за выполненную работу. Доброта и профессионализм произвели на меня впечатление!!!",
    link: "https://2gis.ru/tyumen/user/5bf046519a084314b1294a6746a28f62",
  },
  {
    name: "Кристина Климчук",
    rating: 5,
    text:
      "Топ-мастер Влад — это не просто профессионал, это поистине мощный барбер. Много слышали о нем, сегодня решили попробовать сами, приехали с мужем на стрижку. Муж доволен, я счастлива ❤️",
    link: "https://2gis.ru/tyumen/user/388444dfac684d71b3c36fac907d59cd",
  },
  {
    name: "Андрей Кудринских",
    rating: 5,
    text:
      "Отличное место, отличное отношение, отличные парни. Макс — это не только отличный мессенджер в России, но и отличный барбер. 😂",
    link: "https://2gis.ru/tyumen/user/4f7f321478ab456e936dca9d4a55d655",
  },
]

export default function Reviews() {
  const doubled = [...reviews, ...reviews]

  return (
    <section
      id="reviews"
      className="bg-neutral-950 text-white py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Клиенты при работе с нами
            <br />
            отмечают{" "}
            <span className="text-orange-500">профессионализм</span>
            <br />
            <span className="text-orange-500">и результативность</span>
          </h2>

          <p className="text-gray-300 leading-relaxed max-w-xl lg:justify-self-end">
            Ценим обратную связь о нашей работе и уделяем большое внимание сервису.
            Создаём комфортные условия сотрудничества для удобства и эффективного
            решения поставленных задач.
          </p>
        </div>
      </div>

     
      <div className="mt-16 w-screen overflow-hidden">
        <div className="reviews-marquee flex gap-6 px-6">
          {doubled.map((r, idx) => (
            <ReviewCard key={`${r.name}-${idx}`} {...r} />
          ))}
        </div>
      </div>
    </section>
  )
}


function ReviewCard({ name, rating, text, link }) {
  return (
    <div
      className="
        group
        relative
        w-[320px] md:w-[380px]
        shrink-0
        rounded-3xl
        bg-white/5
        p-8
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        backdrop-blur
        transition-transform
        duration-300
        hover:-translate-y-1
        hover:bg-white/7
      "
    >
     
      <div className="absolute right-6 top-6 text-orange-500 text-5xl leading-none opacity-90">
        ”
      </div>

      <p className="text-gray-300 leading-relaxed">
        {text}
      </p>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-gray-400">
          {name}{" "}
          <span className="ml-2 text-orange-500">
            {"★".repeat(rating)}
          </span>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-orange-500 transition-colors hover:text-orange-400"
        >
          см. отзыв
        </a>
      </div>
    </div>
  )
}
