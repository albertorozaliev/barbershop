import React, { useEffect, useMemo, useState } from "react";
import LeaderLayout from "../layouts/LeaderLayout";

const API_BASE = "http://localhost:4000";
const PAGE_SIZE = 4;

export default function Users() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const url = new URL(`${API_BASE}/api/users`);
        if (q.trim()) url.searchParams.set("q", q.trim());

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          setRows(Array.isArray(data) ? data : []);
          setPage(1);
        }
      } catch (e) {
        if (!cancelled) setLoadErr("Не удалось загрузить пользователей");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [q]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(rows.length / PAGE_SIZE)), [rows.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const pages = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <LeaderLayout>
      {/* Search block */}
      <div className="bg-sky-100/70 rounded-xl px-8 py-6">
        <div className="text-2xl font-extrabold mb-3 text-black">Поиск:</div>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="w-full bg-transparent outline-none text-lg text-black focus:text-black placeholder:text-black border-b border-slate-300 focus:border-slate-500"
          placeholder=""
        />
      </div>

      {/* Table header */}
      <div className="mt-10 grid grid-cols-[180px_260px_220px_160px_120px_180px] gap-6 text-gray-400 text-xl font-semibold px-2">
        <div>ФИО</div>
        <div className="flex items-center gap-2">
          <span>Роль</span>
          {/* иконка как на макете (пока просто декор) */}
          <span className="w-6 h-6 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 text-sm">
            ⌄
          </span>
        </div>
        <div>Email</div>
        <div>Телефон</div>
        <div>Статус</div>
        <div className="leading-6">
          Активные
          <br />
          проекты
        </div>
      </div>

      <div className="mt-2 border-b" />

      {/* Rows (max 4 per page) */}
      <div className="divide-y">
        {loading ? (
          <div className="py-14 text-center text-gray-500">Загрузка...</div>
        ) : loadErr ? (
          <div className="py-14 text-center text-red-600">{loadErr}</div>
        ) : pageRows.length === 0 ? (
          <div className="py-14 text-center text-gray-500">Ничего не найдено</div>
        ) : (
          pageRows.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[180px_260px_220px_160px_120px_180px] gap-6 py-10 px-2 items-center"
            >
              <div className="font-extrabold text-gray-900">{u.fullName}</div>
              <div className="font-extrabold text-gray-900">{u.role}</div>
              <div className="font-extrabold text-gray-900">{u.email}</div>
              <div className="text-lg text-gray-400">{u.phone}</div>
              <div className="text-lg text-gray-900">{u.status}</div>
              <div className="text-3xl text-gray-900">{u.activeProjects ?? 0}</div>
            </div>
          ))
        )}
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
    </LeaderLayout>
  );
}
