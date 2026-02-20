import React, { useMemo, useState } from "react";
import LeaderLayout from "../layouts/LeaderLayout";

const PAGE_SIZE = 4;

const mockProjects = [
  {
    name: "Рога и копыта",
    clientSurname: "Орозалиев",
    clientName: "Альберт Максатович",
    managerSurname: "Орозалиевский",
    managerName: "Альбертий Максатович",
    percent: 80,
    status: "На паузе",
    budget: "100000 руб.",
  },
  {
    name: "Рога и копыта",
    clientSurname: "Орозалиев",
    clientName: "Альберт Максатович",
    managerSurname: "Орозалиевский",
    managerName: "Альбертий Максатович",
    percent: 100,
    status: "Завершен",
    budget: "100000 руб.",
  },
  {
    name: "Рога и копыта",
    clientSurname: "Орозалиев",
    clientName: "Альберт Максатович",
    managerSurname: "Орозалиевский",
    managerName: "Альбертий Максатович",
    percent: 75,
    status: "Просрочен",
    budget: "100000 руб.",
  },
  {
    name: "Рога и копыта",
    clientSurname: "Орозалиев",
    clientName: "Альберт Максатович",
    managerSurname: "Орозалиевский",
    managerName: "Альбертий Максатович",
    percent: 43,
    status: "В работе",
    budget: "100000 руб.",
  },
  {
    name: "Рога и копыта",
    clientSurname: "Орозалиев",
    clientName: "Альберт Максатович",
    managerSurname: "Орозалиевский",
    managerName: "Альбертий Максатович",
    percent: 80,
    status: "На паузе",
    budget: "100000 руб.",
  },
];

export default function Projects() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // фильтр поиска
  const filteredRows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mockProjects;
    return mockProjects.filter((p) =>
      [p.name, p.clientSurname, p.clientName, p.managerSurname, p.managerName, p.status, p.budget]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [q]);

  // всего страниц (только существующие)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE)),
    [filteredRows.length]
  );

  // если поиск уменьшил количество страниц — корректируем текущую
  useMemo(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // текущая страница (макс 4 проекта)
  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const onSearchChange = (e) => {
    setQ(e.target.value);
    setPage(1); // при поиске всегда на первую страницу
  };

  return (
    <LeaderLayout>
      {/* Search block */}
      <div className="bg-sky-100/70 rounded-xl px-8 py-7">
        {/* слово "Поиск" черным */}
        <div className="text-2xl font-extrabold mb-3 text-black">Поиск:</div>

        {/* поле поиска уже, примерно 600px */}
        <input
  value={q}
  onChange={onSearchChange}
  className="w-[800px] max-w-full bg-transparent outline-none text-lg text-black placeholder:text-black border-b border-slate-300 focus:border-slate-500"
  placeholder=""
/>

      </div>

      {/* Table header */}
      <div className="mt-8 grid grid-cols-[1.1fr_1.2fr_1.2fr_.8fr_.9fr_.8fr] gap-6 text-gray-400 text-xl font-semibold px-2">
        <div className="leading-6">
          Название
          <br />
          проекта
        </div>
        <div>Клиент</div>
        <div>Менеджер</div>
        <div>% Выполнения</div>
        <div>Статус</div>
        <div>Бюджет</div>
      </div>

      <div className="mt-2 border-b" />

      {/* Rows (максимум 4) */}
      <div className="divide-y">
        {pageRows.map((p, idx) => (
          <div
            key={`${p.name}-${idx}`}
            className="grid grid-cols-[1.1fr_1.2fr_1.2fr_.8fr_.9fr_.8fr] gap-6 py-10 px-2 items-center"
          >
            {/* название проекта тем же цветом, что остальной текст */}
            <div className="font-extrabold text-lg text-gray-800">{p.name}</div>

            <div>
              <div className="font-extrabold text-gray-800">{p.clientSurname}</div>
              <div className="text-gray-600">{p.clientName}</div>
            </div>

            <div>
              <div className="font-extrabold text-gray-800">{p.managerSurname}</div>
              <div className="text-gray-600">{p.managerName}</div>
            </div>

            <div className="text-3xl text-gray-400">{p.percent}</div>

            <div className="text-lg text-gray-800">{p.status}</div>

            <div className="text-lg text-gray-800">{p.budget}</div>
          </div>
        ))}

        {pageRows.length === 0 && (
          <div className="py-14 text-center text-gray-500">Ничего не найдено</div>
        )}
      </div>

      {/* Pagination (маленький переходник 163x24) */}
      <div className="mt-10">
        <div
          className="inline-flex items-center justify-between gap-2"
          style={{ width: 163, height: 24 }}
        >
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="w-6 h-6 flex items-center justify-center text-gray-500 disabled:opacity-40"
            aria-label="prev"
          >
            ‹
          </button>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={[
                  "w-6 h-6 rounded flex items-center justify-center",
                  p === page ? "text-gray-800 font-semibold" : "hover:text-gray-700",
                ].join(" ")}
                aria-label={`page-${p}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={page === totalPages}
            className="w-6 h-6 flex items-center justify-center text-gray-500 disabled:opacity-40"
            aria-label="next"
          >
            ›
          </button>
        </div>
      </div>
    </LeaderLayout>
  );
}
