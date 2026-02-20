import React, { useMemo, useState } from "react";
import DesignerLayout from "../layouts/DesignerLayout";

const PAGE_SIZE = 4;

const mockProjects = [
  {
    id: 1,
    name: "Рога и копыта",
    clientTitle: "Орозалиев",
    clientSub: "Альберт Максатович",
    managerTitle: "Орозалиевский",
    managerSub: "Альбертий Максатович",
    percent: 80,
    status: "На паузе",
    deadline: "завтра",
    tone: "danger", // розовый фон
  },
  {
    id: 2,
    name: "Рога и копыта",
    clientTitle: "Орозалиев",
    clientSub: "Альберт Максатович",
    managerTitle: "Орозалиевский",
    managerSub: "Альбертий Максатович",
    percent: 100,
    status: "Завершен",
    deadline: "до 3 марта",
    tone: "success", // зелёный фон
  },
  {
    id: 3,
    name: "Рога и копыта",
    clientTitle: "Орозалиев",
    clientSub: "Альберт Максатович",
    managerTitle: "Орозалиевский",
    managerSub: "Альбертий Максатович",
    percent: 75,
    status: "На паузе",
    deadline: "до 3 марта",
    tone: "neutral", // белый фон
  },
];

function CellTwoLines({ title, sub }) {
  return (
    <div>
      <div className="font-extrabold text-gray-900">{title}</div>
      <div className="text-gray-900">{sub}</div>
    </div>
  );
}

export default function DesignerProjects() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mockProjects;
    return mockProjects.filter((p) =>
      [
        p.name,
        p.clientTitle,
        p.clientSub,
        p.managerTitle,
        p.managerSub,
        p.status,
        p.deadline,
        String(p.percent),
      ]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [q]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered.length]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const pages = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const rowBg = (tone) => {
    if (tone === "danger") return "bg-red-200/60";
    if (tone === "success") return "bg-green-100/70";
    return "bg-white";
  };

  return (
    <DesignerLayout>
      {/* Search block */}
      <div className="bg-sky-100/70 rounded-xl px-8 py-6">
        <div className="text-2xl font-extrabold mb-3 text-black">Поиск:</div>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="w-full bg-transparent outline-none text-lg text-black border-b border-slate-300 focus:border-slate-500"
          placeholder=""
        />
      </div>

      {/* Table header */}
      <div className="mt-8 grid grid-cols-[1.1fr_1.2fr_1.2fr_.8fr_.9fr_.8fr] gap-6 text-gray-400 text-xl font-semibold px-2">
        <div className="leading-6">Название<br />проекта</div>
        <div>Клиент</div>
        <div>Менеджер</div>
        <div>% Выполнения</div>
        <div>Статус</div>
        <div>Дедлайн</div>
      </div>
      <div className="mt-2 border-b" />

      {/* Rows */}
      <div className="divide-y">
        {pageRows.length === 0 ? (
          <div className="py-14 text-center text-gray-500">Нет проектов</div>
        ) : (
          pageRows.map((p) => (
            <div key={p.id} className={`${rowBg(p.tone)} px-2`}>
              <div className="grid grid-cols-[1.1fr_1.2fr_1.2fr_.8fr_.9fr_.8fr] gap-6 py-10 items-center">
                <div className="font-extrabold text-lg text-gray-900">{p.name}</div>

                <CellTwoLines title={p.clientTitle} sub={p.clientSub} />
                <CellTwoLines title={p.managerTitle} sub={p.managerSub} />

                <div className="text-3xl text-gray-400">{p.percent}</div>
                <div className="text-lg text-gray-900">{p.status}</div>
                <div className="text-lg text-gray-900">{p.deadline}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10">
        <div className="inline-flex items-center justify-between gap-2" style={{ width: 163, height: 24 }}>
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="w-6 h-6 flex items-center justify-center text-gray-500 disabled:opacity-40"
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
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={page === totalPages}
            className="w-6 h-6 flex items-center justify-center text-gray-500 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </DesignerLayout>
  );
}