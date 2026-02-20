import React, { useEffect, useMemo, useState } from "react";
import ManagerLayout from "../layouts/ManagerLayout";

const API_BASE = "http://localhost:4000";
const PAGE_SIZE = 4;

export default function ManagerClients() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  const loadClients = async (searchValue = q) => {
    setLoading(true);
    setLoadErr("");
    try {
      const url = new URL(`${API_BASE}/api/clients`);
      if (searchValue.trim()) url.searchParams.set("q", searchValue.trim());

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setLoadErr("Не удалось загрузить клиентов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadClients(q);
      setPage(1);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
    [rows.length]
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <ManagerLayout>
      {/* Search block (как у руководителя) */}
      <div className="bg-sky-100/70 rounded-xl px-8 py-7">
        <div className="text-2xl font-extrabold mb-3 text-black">Поиск:</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full bg-transparent outline-none text-lg text-black border-b border-slate-300 focus:border-slate-500"
          placeholder=""
        />
      </div>

      {/* Table header */}
      <div className="mt-8 grid grid-cols-[1.2fr_1.2fr_1.2fr_1fr_.8fr_.8fr] gap-6 text-gray-400 text-xl font-semibold px-2">
        <div>Название компании</div>
        <div>Контактное лицо</div>
        <div>Email</div>
        <div>Телефон</div>
        <div>Статус</div>
        <div>Активные проекты</div>
      </div>

      <div className="mt-2 border-b" />

      {/* Rows */}
      <div className="divide-y">
        {loading ? (
          <div className="py-14 text-center text-gray-500">Загрузка...</div>
        ) : loadErr ? (
          <div className="py-14 text-center text-red-600">{loadErr}</div>
        ) : pageRows.length === 0 ? (
          <div className="py-14 text-center text-gray-500">Нет клиентов</div>
        ) : (
          pageRows.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[1.2fr_1.2fr_1.2fr_1fr_.8fr_.8fr] gap-6 py-10 px-2 items-center"
            >
              <div className="font-extrabold text-lg text-gray-900">
                {c.company}
              </div>

              <div className="font-semibold text-gray-900">
                {c.contact}
              </div>

              <div className="font-semibold text-gray-900">
                {c.email}
              </div>

              <div className="text-gray-500 text-lg">
                {c.phone}
              </div>

              <div className="text-lg text-gray-900">
                {c.status}
              </div>

              <div className="text-3xl text-gray-900 text-center">
                {c.activeProjects ?? 0}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10">
        <div
          className="inline-flex items-center justify-between gap-2"
          style={{ width: 163, height: 24 }}
        >
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
                  p === page
                    ? "text-gray-800 font-semibold"
                    : "hover:text-gray-700",
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
    </ManagerLayout>
  );
}