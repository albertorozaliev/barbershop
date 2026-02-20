// src/pages/Notifications.jsx
import React, { useMemo, useState } from "react";
import ManagerLayout from "../layouts/ManagerLayout";

const PAGE_SIZE = 4;

// мок-уведомления строго под макет
const mockNotifications = [
  {
    type: "danger",
    title: "Этап просрочен!",
    subtitle: "Проект: Рога и копыта",
  },
  {
    type: "info",
    title: "Загружена новая версия файла",
  },
  {
    type: "warning",
    title: "Изменен срок проекта",
  },
];

function IconDanger() {
  return (
    <div className="w-12 h-12 rounded-full border-4 border-red-500 flex items-center justify-center">
      <span className="text-red-500 font-extrabold text-2xl leading-none">!</span>
    </div>
  );
}

function IconInfo() {
  return (
    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
      <span className="text-white text-xl leading-none">💬</span>
    </div>
  );
}

function IconWarning() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <div className="w-0 h-0 border-l-[22px] border-r-[22px] border-b-[40px] border-l-transparent border-r-transparent border-b-yellow-400 relative">
        <div className="absolute left-1/2 top-[12px] -translate-x-1/2 text-black font-extrabold">!</div>
      </div>
    </div>
  );
}

function NotificationRow({ n }) {
  if (n.type === "danger") {
    return (
      <div className="w-full bg-red-100/80 rounded-none px-8 py-6 flex items-center gap-6">
        <IconDanger />
        <div className="text-gray-900">
          <div className="font-extrabold">{n.title}</div>
          <div className="font-semibold">{n.subtitle}</div>
        </div>
      </div>
    );
  }

  if (n.type === "info") {
    return (
      <div className="w-full bg-white px-8 py-8 flex items-center gap-6">
        <IconInfo />
        <div className="font-extrabold text-gray-900">{n.title}</div>
      </div>
    );
  }

  // warning
  return (
    <div className="w-full bg-white px-8 py-8 flex items-center gap-6">
      <IconWarning />
      <div className="font-extrabold text-gray-900">{n.title}</div>
    </div>
  );
}

export default function Notifications() {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(mockNotifications.length / PAGE_SIZE)),
    []
  );

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return mockNotifications.slice(start, start + PAGE_SIZE);
  }, [page]);

  const pages = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <ManagerLayout>
      {/* просто отступ сверху как на макете */}
      <div className="mt-14" />

      {/* list */}
      <div className="space-y-6">
        {pageRows.map((n, idx) => (
          <div key={idx}>
            <NotificationRow n={n} />
          </div>
        ))}
      </div>

      {/* пустые линии-сепараторы ниже (как на макете) */}
      <div className="mt-10 space-y-10">
        <div className="border-b border-gray-100" />
        <div className="border-b border-gray-100" />
        <div className="border-b border-gray-100" />
        <div className="border-b border-gray-100" />
      </div>

      {/* Pagination (163x24) */}
      <div className="mt-10">
        <div className="inline-flex items-center justify-between gap-2" style={{ width: 163, height: 24 }}>
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
    </ManagerLayout>
  );
}
