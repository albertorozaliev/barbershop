import React, { useEffect, useMemo, useRef, useState } from "react";
import LeaderLayout from "../layouts/LeaderLayout";
import jsPDF from "jspdf";

const API_BASE = "http://localhost:4000";
const PAGE_SIZE = 4;

// --- helpers
function isoDate(d) {
  // YYYY-MM-DD (локальная дата, без сдвигов)
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function ruLongDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

function dateLabelAndTime(dtIso) {
  const d = new Date(dtIso);
  const now = new Date();

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  let label;
  if (sameDay(day, today)) label = "Сегодня";
  else if (sameDay(day, yest)) label = "Вчера";
  else label = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(d);

  const time = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);

  return { label, time };
}

export default function Reports() {
  const printableRef = useRef(null);

  const [q, setQ] = useState("");

  // ✅ ДЕФОЛТНЫЙ ПЕРИОД: последние 14 дней до сегодня (чтобы новые отчёты всегда попадали)
  const _today = useMemo(() => new Date(), []);
  const _from = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d;
  }, []);

  const [from, setFrom] = useState(isoDate(_from));
  const [to, setTo] = useState(isoDate(_today));

  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  const periodText = useMemo(() => `${ruLongDate(from)} — ${ruLongDate(to)}`, [from, to]);

  // load reports from DB
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const url = new URL(`${API_BASE}/api/reports`);
        if (q.trim()) url.searchParams.set("q", q.trim());
        if (from) url.searchParams.set("from", from);
        if (to) url.searchParams.set("to", to);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (cancelled) return;

        setRows(Array.isArray(data) ? data : []);
        setPage(1);
        setSelectedId(null);
      } catch (e) {
        if (!cancelled) setLoadErr("Не удалось загрузить отчёты");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [q, from, to]);

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

  const selected = useMemo(() => rows.find((r) => r.id === selectedId) || null, [rows, selectedId]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const onExportSelectedPdf = () => {
    if (!selected) return;

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("Report", 15, 20);

    doc.setFontSize(11);
    doc.text(`Period: ${periodText}`, 15, 28);

    const dt = new Date(selected.dt);
    const dtText = dt.toLocaleString("en-GB");

    const y0 = 45;

    doc.setDrawColor(180);
    doc.roundedRect(15, y0 - 10, 180, 55, 3, 3);

    doc.setFontSize(12);
    doc.text(`Project: ${selected.project || ""}`, 20, y0);
    doc.text(`Manager: ${selected.manager || ""}`, 20, y0 + 12);
    doc.text(`Status: ${selected.status || ""}`, 20, y0 + 24);
    doc.text(`Date: ${dtText}`, 20, y0 + 36);

    doc.save(`report_${selected.id}.pdf`);
  };

  // белые инпуты даты с чёрной рамкой
  const dateInputCls = "h-10 px-3 rounded-lg bg-white border border-black text-gray-900 outline-none";

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

      {/* Header row */}
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-gray-900">Отчёт</div>
          <div className="text-2xl text-gray-400">({periodText})</div>
        </div>

        <button
          onClick={onExportSelectedPdf}
          disabled={!selected}
          className="w-[96px] h-[48px] rounded-xl bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500"
          title={!selected ? "Выберите отчёт в таблице" : "Экспорт выбранного отчёта в PDF"}
        >
          PDF
        </button>
      </div>

      {/* Date controls */}
      <div className="mt-6 flex gap-3 items-center">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={dateInputCls} />
        <span className="text-gray-500">—</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={dateInputCls} />
      </div>

      {/* Table */}
      <section className="mt-10">
        <div className="grid grid-cols-[220px_280px_260px_1fr] gap-6 text-gray-400 text-xl font-semibold px-2">
          <div>Дата, время</div>
          <div>Проект</div>
          <div>Менеджер</div>
          <div>Статус</div>
        </div>

        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="py-14 text-center text-gray-500">Загрузка...</div>
          ) : loadErr ? (
            <div className="py-14 text-center text-red-600">{loadErr}</div>
          ) : pageRows.length === 0 ? (
            <div className="py-14 text-center text-gray-500">Нет данных за выбранный период</div>
          ) : (
            pageRows.map((r) => {
              const { label, time } = dateLabelAndTime(r.dt);
              const isSelected = r.id === selectedId;

              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={[
                    "w-full text-left",
                    "bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-150",
                    "border-2",
                    isSelected ? "border-red-500" : "border-transparent",
                    "focus:outline-none focus:ring-0",
                  ].join(" ")}
                >
                  <div className="grid grid-cols-[220px_280px_260px_1fr] gap-6 py-6 px-6 items-center">
                    <div>
                      <div className="font-extrabold text-gray-900">{label}</div>
                      <div className="text-gray-900">{time}</div>
                    </div>

                    <div className="font-extrabold text-gray-900">{r.project}</div>
                    <div className="font-extrabold text-gray-400">{r.manager}</div>
                    <div className="text-gray-400 text-lg">{r.status}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Pagination */}
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

      {/* PRINT: выбранный отчёт (печатается только он) */}
      <div className="hidden">
        <div ref={printableRef}>
          {selected ? (
            <div className="p-6">
              <div className="text-2xl font-extrabold">Отчёт</div>
              <div className="text-sm text-gray-600 mt-1">Период: {periodText}</div>

              <div className="mt-6 border rounded-lg p-4">
                <div className="font-semibold">Проект: {selected.project}</div>
                <div>Менеджер: {selected.manager}</div>
                <div>Статус: {selected.status}</div>
                <div className="text-sm text-gray-600 mt-2">
                  Дата:{" "}
                  {new Intl.DateTimeFormat("ru-RU", { dateStyle: "full", timeStyle: "medium" }).format(
                    new Date(selected.dt)
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* print styles */}
      <style>{`
        @media print {
          body.print-report-only * { visibility: hidden !important; }
          body.print-report-only [data-print="true"],
          body.print-report-only [data-print="true"] * { visibility: visible !important; }

          body.print-report-only [data-print="true"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          @page { size: A4; margin: 12mm; }
        }
      `}</style>
    </LeaderLayout>
  );
}