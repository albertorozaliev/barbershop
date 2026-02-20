import React, { useEffect, useMemo, useState } from "react";
import ManagerLayout from "../layouts/ManagerLayout";

const API_BASE = "http://localhost:4000";
const PAGE_SIZE = 4;

function ruLongDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function dateLabelAndTime(dtIso) {
  const d = new Date(dtIso);
  const now = new Date();

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  let label;
  if (sameDay(day, today)) label = "Сегодня";
  else if (sameDay(day, yest)) label = "Вчера";
  else
    label = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
    }).format(d);

  const time = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);

  return { label, time };
}

const STATUS_OPTIONS = ["В процессе", "С задержкой", "В срок"];

function getMoscowNowDisplay() {
  const now = new Date();
  const dt = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);

  const tm = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  return { date: dt, time: tm };
}

function validateReport({ project, status }) {
  const errors = {};
  const p = project.trim();
  if (p.length < 2) errors.project = "Мин. 2 символа";
  if (p.length > 80) errors.project = "Макс. 80 символов";
  if (!STATUS_OPTIONS.includes(status)) errors.status = "Выберите статус";
  return errors;
}

export default function ManagerReports() {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("2026-02-01");
  const [to, setTo] = useState("2026-02-12");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  // modal create
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("В процессе");
  const [formErr, setFormErr] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  const [mskNow, setMskNow] = useState(getMoscowNowDisplay());

  const periodText = useMemo(
    () => `${ruLongDate(from)} — ${ruLongDate(to)}`,
    [from, to]
  );

  const dateInputCls =
    "h-10 px-3 rounded-lg bg-white border border-black text-gray-900 outline-none";

  const loadReports = async () => {
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

      setRows(Array.isArray(data) ? data : []);
      setPage(1);
      setSelectedId(null);
    } catch (e) {
      setLoadErr("Не удалось загрузить отчёты");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, from, to]);

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

  const openModal = () => {
    setOpen(true);
    setProject("");
    setStatus("В процессе");
    setFormErr({});
    setSaveErr("");
    setMskNow(getMoscowNowDisplay());
  };

  const closeModal = () => {
    if (saving) return;
    setOpen(false);
  };

  const onCreate = async () => {
    setSaveErr("");
    const errors = validateReport({ project, status });
    setFormErr(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      const username = localStorage.getItem("username") || "manager";

      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: project.trim(),
          status,
          manager: username, // менеджер = текущий логин
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      await loadReports();
      setOpen(false);
    } catch (e) {
      setSaveErr(e.message || "Не удалось создать отчёт");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ManagerLayout>
      {/* Search + Add report */}
      <div className="flex gap-6 items-stretch">
        <div className="bg-sky-100/70 rounded-xl px-6 py-5 w-[520px] flex flex-col justify-center">
          <div className="text-xl font-extrabold mb-2 text-black">Поиск:</div>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent outline-none text-base text-black border-b border-slate-300 focus:border-slate-500"
            placeholder=""
          />
        </div>

        <button
          onClick={openModal}
          className="bg-sky-100/70 rounded-xl px-6 py-5 w-[320px] flex items-center justify-between"
        >
          <div className="text-xl font-extrabold text-black">
            Добавить отчет
          </div>
          <div className="w-11 h-11 rounded-xl border-4 border-black flex items-center justify-center text-3xl font-black text-black">
            +
          </div>
        </button>
      </div>

      {/* Header row */}
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-gray-900">Отчёт</div>
          <div className="text-2xl text-gray-400">({periodText})</div>
        </div>
      </div>

      {/* Date controls */}
      <div className="mt-6 flex gap-3 items-center">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className={dateInputCls}
        />
        <span className="text-gray-500">—</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={dateInputCls}
        />
      </div>

      {/* Table */}
      <section className="mt-10">
        <div className="grid grid-cols-[220px_280px_260px_1fr] gap-6 text-gray-400 text-xl font-semibold px-2">
          <div>Дата, время</div>
          <div>Проект</div>
          <div>Менеджер</div>
          <div>Статус</div>
        </div>
        <div className="mt-2 border-b" />

        <div className="divide-y">
          {loading ? (
            <div className="py-14 text-center text-gray-500">Загрузка...</div>
          ) : loadErr ? (
            <div className="py-14 text-center text-red-600">{loadErr}</div>
          ) : pageRows.length === 0 ? (
            <div className="py-14 text-center text-gray-500">
              Нет данных за выбранный период
            </div>
          ) : (
            pageRows.map((r) => {
              const { label, time } = dateLabelAndTime(r.dt);
              const isSelected = r.id === selectedId;

              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className="w-full text-left bg-transparent"
                >
                  <div
                    className={[
                      "grid grid-cols-[220px_280px_260px_1fr] gap-6 py-6 px-6 items-center",
                      "bg-white rounded-xl transition-all duration-150",
                      isSelected
                        ? "border-2 border-red-500 shadow-sm"
                        : "shadow-sm hover:shadow-md",
                    ].join(" ")}
                  >
                    <div>
                      <div className="font-extrabold text-gray-900">
                        {label}
                      </div>
                      <div className="text-gray-900">{time}</div>
                    </div>

                    <div className="font-extrabold text-gray-900">
                      {r.project}
                    </div>
                    <div className="font-extrabold text-gray-400">
                      {r.manager}
                    </div>
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

      {/* CREATE MODAL */}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div className="relative w-[920px] max-w-[94vw] bg-white rounded-xl shadow-lg px-16 py-14">
            <div className="grid grid-cols-[280px_1fr] gap-8">
              <div className="space-y-7 text-gray-900 text-xl">
                <div className="h-12 flex items-center">Дата</div>
                <div className="h-12 flex items-center">Время (МСК)</div>
                <div className="h-12 flex items-center">Проект</div>
                <div className="h-12 flex items-center">Менеджер</div>
                <div className="h-12 flex items-center">Статус</div>
              </div>

              <div className="border-2 border-dashed border-green-700/60 rounded-xl p-6 space-y-6">
                <input
                  value={mskNow.date}
                  readOnly
                  className="w-full h-12 border border-slate-300 rounded-lg px-4 outline-none text-center font-semibold bg-white text-black"
                />

                <input
                  value={mskNow.time}
                  readOnly
                  className="w-full h-12 border border-slate-300 rounded-lg px-4 outline-none text-center font-semibold bg-white text-black"
                />

                <div>
                  <input
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Введите текст"
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none text-center font-semibold bg-white text-black",
                      formErr.project ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={saving}
                  />
                  {formErr.project ? (
                    <div className="mt-1 text-sm text-red-600">
                      {formErr.project}
                    </div>
                  ) : null}
                </div>

                <input
                  value={localStorage.getItem("username") || "manager"}
                  readOnly
                  className="w-full h-12 border border-slate-300 rounded-lg px-4 outline-none text-center font-semibold bg-white text-black"
                />

                <div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none bg-white text-black text-center font-semibold",
                      formErr.status ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={saving}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="text-black">
                        {s}
                      </option>
                    ))}
                  </select>

                  {formErr.status ? (
                    <div className="mt-1 text-sm text-red-600">
                      {formErr.status}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {saveErr ? (
              <div className="mt-6 text-center text-red-600">{saveErr}</div>
            ) : null}

            <div className="mt-10 flex justify-center">
              <button
                onClick={onCreate}
                disabled={saving}
                className="bg-green-800 text-white font-bold px-16 py-2 rounded-lg shadow disabled:opacity-60"
              >
                {saving ? "Создание..." : "Создать"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ManagerLayout>
  );
}